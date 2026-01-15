"use client";

import React, { useState, useEffect, useRef } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Image from "next/image";
import { X, Check, Search } from "lucide-react";
import { useCreatePropertyMutation } from "@/redux/features/property/propertyApi";
import { toast } from "sonner";
import Link from "next/link";
import { useGetMyDefaultHostTermsQuery, useGetPropertyDefaultQuery } from "@/redux/features/public/publicApi";
import TermsSelection from "./TermsSelection";
import { useAppSelector } from "@/redux/hooks";
import { currentUser } from "@/redux/features/auth/authSlice";
import { useRouter, useSearchParams } from "next/navigation";
import { useConnectStripeAccountMutation, useGetMyProfileQuery, useGetStripeAccountStatusQuery } from "@/redux/features/users/usersApi";
import BankDetailsModal from "./BankDetailsModal";
import { useGetMyBankDetailsQuery } from "@/redux/features/bankdetails/bankDetailsApi";
import DefaultTermsEditModal from "./DefaultTermsEdit";
import { useGetAllLocationsQuery } from "@/redux/features/location/locationApi";
import { useDebounce } from "@/hooks/use-debounce";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

// Step 1 schema
const step1Schema = z.object({
    title: z.string().min(2, { message: "Property title is required" }),
    description: z.string().min(30, { message: "Description must be at least 30 characters" }),
    location: z.string().min(2, { message: "Location is required" }),
    postCode: z.string().min(2, { message: "Post code is required" }),
    propertyType: z.string().min(1, { message: "Please select a property type" }),
});

// Step 2 schema
const step2Schema = z.object({
    maxGuests: z.number().min(1, { message: "At least 1 guest is required" }),
    bedrooms: z.number().min(1, { message: "At least 1 bedroom is required" }),
    bathrooms: z.number().min(1, { message: "At least 1 bathroom is required" }),
    price: z.number().min(0, { message: "Price must be 0 or greater" }),
    availableFrom: z.date().optional(),
    availableTo: z.date().optional(),
    calendarEnabled: z.boolean().default(true).optional(),
    amenities: z.array(z.string()).min(1, { message: "Please select at least 1 amenity" }),
});

const step3Schema = z.object({
    coverPhoto: z.any().refine((file) => file instanceof File, { message: "Cover photo is required" }),
    photos: z.array(z.instanceof(File)).min(1, { message: "Please upload at least 1 photo" }),
});

const step4Schema = z.object({
    agreeTerms: z.boolean().refine((val) => val === true, {
        message: "You must agree to the terms before submitting.",
    }),
});

type Step1Data = z.infer<typeof step1Schema>;
type Step2Data = z.infer<typeof step2Schema>;
type Step3Data = z.infer<typeof step3Schema>;
type Step4Data = z.infer<typeof step4Schema>;

// ---------------- Local Storage Helpers ----------------
const STORAGE_KEY = "add_listing_form_data";

// Convert File to base64 for storage
const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });
};

// Convert base64 back to File
const base64ToFile = (base64: string, filename: string): File => {
    const arr = base64.split(",");
    const mime = arr[0].match(/:(.*?);/)![1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
};

const saveFormData = async (data: any) => {
    if (typeof window !== "undefined") {
        // Convert files to base64 for storage
        const dataToSave = { ...data };

        if (data.coverPhoto instanceof File) {
            dataToSave.coverPhotoBase64 = await fileToBase64(data.coverPhoto);
            dataToSave.coverPhotoName = data.coverPhoto.name;
        }

        if (data.photos && Array.isArray(data.photos)) {
            dataToSave.photosBase64 = [];
            dataToSave.photosNames = [];
            for (const photo of data.photos) {
                if (photo instanceof File) {
                    dataToSave.photosBase64.push(await fileToBase64(photo));
                    dataToSave.photosNames.push(photo.name);
                }
            }
        }

        localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    }
};

const getFormData = (): any => {
    if (typeof window !== "undefined") {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : {};
    }
    return {};
};

const clearFormData = () => {
    if (typeof window !== "undefined") {
        localStorage.removeItem(STORAGE_KEY);
    }
};

const amenityCategories = [
    {
        title: "Essentials",
        amenities: ["Wifi", "Towels Included", "Heating", "Air Conditioning", "Kitchen", "Washing Machine", "Dryer", "Tv"],
    },
    {
        title: "Parking & Transport",
        amenities: ["Parking", "EV Charging Point"],
    },
    {
        title: "Safety & Security",
        amenities: ["Smoke Alarm", "Carbon Monoxide Alarm", "First Aid Kit", "CCTV / Security Lighting"],
    },
    {
        title: "Outdoor & Leisure",
        amenities: ["Garden", "Balcony / Terrace", "BBQ Facilities", "Outdoor Furniture", "Pool", "Hot Tub", "Beach Access"],
    },
    {
        title: "Family-Friendly",
        amenities: ["High Chair", "Cot / Travel Cot", "Playground Nearby"],
    },
    {
        title: "Accessibility",
        amenities: ["Disability Access", "Disability Parking", "Lift Access", "Step-free Entrance"],
    },
    {
        title: "Pet & Smoking Policies",
        amenities: ["Pet Friendly", "Smoking Allowed"],
    },
    {
        title: "Extras",
        amenities: ["Gym", "Coffee Machine / Kettle", "Hairdryer", "Iron / Ironing Board"],
    },
];

const propertyTypeOptions = ["Hotel", "Apartment", "Aparthotel", "Bed & Breakfast", "Hostel", "Guesthouse", "Entire Home", "Room Only", "Student Accommodation", "Unique Stays", "Caravan"];

const AddListingForm: React.FC = () => {
    const [activeTab, setActiveTab] = useState("step1");
    const [step1Data, setStep1Data] = useState<Step1Data | null>(null);
    const [step2Data, setStep2Data] = useState<Step2Data | null>(null);
    const [step3Data, setStep3Data] = useState<Step3Data | null>(null);
    const [coverPreview, setCoverPreview] = useState<string | null>(null);
    const [photosPreview, setPhotosPreview] = useState<string[]>([]);
    const [showStripeRules, setShowStripeRules] = useState(false);
    const [showRules, setShowRules] = useState(false);
    const [completedSteps, setCompletedSteps] = useState<string[]>([]);
    const [isInitialLoad, setIsInitialLoad] = useState(true);

    const [connectStripeAccount, { isLoading: isConnectingStripe }] = useConnectStripeAccountMutation();
    const { data: response, isLoading: stripeLoading } = useGetStripeAccountStatusQuery();
    const accountStatus = response?.data?.status;
    const { data: myProfile } = useGetMyProfileQuery();
    const verificationStatus = myProfile?.data?.profile?.verificationStatus;
    const { data: bankDetailsResponse, isLoading: bankDetailsLoading, refetch: refetchBankDetails } = useGetMyBankDetailsQuery();
    const isDisabled = bankDetailsResponse?.data == null && response == null;

    // Inside your component
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const searchInputRef = useRef<HTMLInputElement>(null);

    // Fetch all cities once (no search parameter to avoid re-fetches)
    const { data: locationsData, isLoading: locationLoading } = useGetAllLocationsQuery({
        isActive: true,
        limit: 100,
    });

    // Client-side filtering
    const filteredCities = locationsData?.data?.filter((city: any) => city.name.toLowerCase().includes(searchTerm.toLowerCase())) || [];

    // Focus management
    useEffect(() => {
        if (isOpen && searchInputRef.current) {
            const timer = setTimeout(() => {
                searchInputRef.current?.focus();
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    // const { data: locationsData } = useGetAllLocationsQuery({
    //     isActive: true,
    //     limit: 100,
    // });

    console.log(locationsData);

    const router = useRouter();
    const searchParams = useSearchParams();
    const mainuser = useAppSelector(currentUser);

    // ---------------- Form Definitions ----------------
    const step1Form = useForm<Step1Data>({
        resolver: zodResolver(step1Schema),
        defaultValues: { title: "", description: "", location: "", postCode: "", propertyType: "" },
    });

    const step2Form = useForm<Step2Data>({
        resolver: zodResolver(step2Schema),
        defaultValues: {
            maxGuests: 1,
            bedrooms: 1,
            bathrooms: 1,
            price: 1,
            availableFrom: new Date(),
            availableTo: new Date(),
            calendarEnabled: true,
            amenities: [],
        },
    });

    const step3Form = useForm<Step3Data>({
        resolver: zodResolver(step3Schema),
        defaultValues: {
            coverPhoto: null,
            photos: [],
        },
    });

    const step4Form = useForm<Step4Data>({
        resolver: zodResolver(step4Schema),
        defaultValues: { agreeTerms: false },
    });

    // ---------------- Form Persistence Logic ----------------
    useEffect(() => {
        if (typeof window === "undefined") return;

        const savedData = getFormData();
        const fromTerms = searchParams.get("fromTerms") === "true";

        if (fromTerms && Object.keys(savedData).length > 0) {
            if (savedData.step1Data) {
                step1Form.reset(savedData.step1Data);
                setStep1Data(savedData.step1Data);
            }

            if (savedData.step2Data) {
                // Convert date strings back to Date objects
                const step2DataWithDates = {
                    ...savedData.step2Data,
                    availableFrom: savedData.step2Data.availableFrom ? new Date(savedData.step2Data.availableFrom) : new Date(),
                    availableTo: savedData.step2Data.availableTo ? new Date(savedData.step2Data.availableTo) : new Date(),
                    calendarEnabled: savedData.step2Data.calendarEnabled !== undefined ? savedData.step2Data.calendarEnabled : true,
                };
                step2Form.reset(step2DataWithDates);
                setStep2Data(step2DataWithDates);
            }

            // Restore photos from base64
            if (savedData.coverPhotoBase64) {
                const coverFile = base64ToFile(savedData.coverPhotoBase64, savedData.coverPhotoName || "cover.jpg");
                step3Form.setValue("coverPhoto", coverFile);
                setCoverPreview(URL.createObjectURL(coverFile));
            }

            if (savedData.photosBase64 && Array.isArray(savedData.photosBase64)) {
                const photoFiles = savedData.photosBase64.map((base64: string, index: number) => base64ToFile(base64, savedData.photosNames?.[index] || `photo-${index}.jpg`));
                step3Form.setValue("photos", photoFiles);
                setPhotosPreview(photoFiles.map((file: any) => URL.createObjectURL(file)));
            }

            if (savedData.completedSteps) setCompletedSteps(savedData.completedSteps);
            if (savedData.activeTab) setActiveTab(savedData.activeTab);
        }

        setIsInitialLoad(false);
    }, [searchParams]);

    // ---------------- Auto-save form data ----------------
    useEffect(() => {
        if (isInitialLoad) return;

        const saveData = async () => {
            const formData = {
                step1Data: step1Form.getValues(),
                step2Data: {
                    ...step2Form.getValues(),
                    availableFrom: step2Form.getValues().availableFrom?.toISOString(),
                    availableTo: step2Form.getValues().availableTo?.toISOString(),
                },
                coverPhoto: step3Form.getValues("coverPhoto"),
                photos: step3Form.getValues("photos"),
                completedSteps,
                activeTab,
            };

            await saveFormData(formData);
        };

        saveData();
    }, [step1Form.watch(), step2Form.watch(), coverPreview, photosPreview, completedSteps, activeTab, isInitialLoad]);

    const handleConnectStripe = async () => {
        try {
            const result = await connectStripeAccount().unwrap();
            if (result.data?.onboardingUrl) {
                window.open(result.data.onboardingUrl, "_blank");
            }
        } catch (error: any) {
            const errorMessage = error?.data?.message || "Failed to connect to Stripe. Please try again.";
            toast.error(errorMessage);
        }
    };

    // ---------------- Form Submission Handlers ----------------
    const onSubmitStep1 = (data: Step1Data) => {
        setStep1Data(data);
        setCompletedSteps((prev) => [...prev, "step1"]);
        setActiveTab("step2");
    };

    const onSubmitStep2 = (data: Step2Data) => {
        setStep2Data(data);
        setCompletedSteps((prev) => [...prev, "step2"]);
        setActiveTab("step3");
    };

    const onSubmitStep3 = (data: Step3Data) => {
        setStep3Data(data);
        setCompletedSteps((prev) => [...prev, "step3"]);
        setActiveTab("step4");
    };

    // ---------------- Terms & Conditions Logic ----------------
    const [showOptions, setShowOptions] = useState(false);
    const [showEditDefaultModal, setShowEditDefaultModal] = useState(false);
    const [selectedTermsId, setSelectedTermsId] = useState<string | null>(null);
    const [selectedCustomTermsId, setSelectedCustomTermsId] = useState<string | null>(null);
    const [createProperty, { isLoading }] = useCreatePropertyMutation();
    // const { data: defaultTermsResponse, isLoading: termsLoading } = useGetMyDefaultHostTermsQuery();
    const { data: defaultTermsResponse, isLoading: termsLoading } = useGetPropertyDefaultQuery();
    // console.log(defaultTermsResponse?.data);

    const handleUseDefault = () => {
        if (defaultTermsResponse?.data?._id) {
            setSelectedTermsId(defaultTermsResponse.data._id);
            setSelectedCustomTermsId(null);
            toast.success("Default terms and conditions applied!");
        } else {
            toast.error("No default terms found!");
        }
        setShowOptions(false);
    };

    const handleRemoveDefault = () => {
        setSelectedTermsId(null);
        setShowOptions(false);
        toast.info("Default terms and conditions removed!");
    };

    const handleTermsChange = (termsId: string | null) => {
        setSelectedCustomTermsId(termsId);
        setSelectedTermsId(null);
    };

    const handleTermsClick = () => {
        router.push(`/terms-of-conditions?role=host&returnTo=add-listing`);
    };

    const getFinalTermsId = () => {
        return selectedCustomTermsId || selectedTermsId;
    };

    // ---------------- Final Submission ----------------
    const onSubmitStep4 = async (step4Data: Step4Data) => {
        if (isDisabled) {
            toast.error("Please complete your payment setup first: Add Bank Details / Setup Stripe Account");
            return;
        }

        if (!step1Data || !step2Data || !step3Data) return;

        setCompletedSteps((prev) => [...prev, "step4"]);

        const coverPhotoFile: File = step3Data.coverPhoto;
        const photosFiles: File[] = step3Data.photos;

        const formData = new FormData();

        // Append Step1 & Step2 fields
        Object.entries({
            ...step1Data,
            ...step2Data,
        }).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                if (value instanceof Date) {
                    formData.append(key, value.toISOString());
                } else if (Array.isArray(value)) {
                    value.forEach((v) => formData.append(key, v.toString()));
                } else {
                    formData.append(key, value.toString());
                }
            }
        });

        // Append Step3 files
        formData.append("coverPhoto", coverPhotoFile);
        photosFiles.forEach((file) => formData.append("photos", file));

        // Step4 agreement
        formData.append("agreeTerms", step4Data.agreeTerms.toString());
        const finalTermsId = getFinalTermsId();
        if (finalTermsId) {
            formData.append("termsAndConditions", finalTermsId);
        }

        try {
            const result = await createProperty(formData).unwrap();
            console.log("Property created successfully:", result);

            clearFormData();

            if (mainuser?.role === "ADMIN") {
                router.push("/dashboard/property-management");
            } else if (mainuser?.role === "HOST") {
                router.push("/dashboard/property-listing");
            } else {
                router.push("/dashboard");
            }
            toast.success("Property created successfully!");
        } catch (err: any) {
            toast.error(err?.data?.message || "Failed to create property");
        }
    };

    // ---------------- Step Navigation Logic ----------------
    const isStepCompleted = (step: string) => completedSteps.includes(step);

    const handleTabChange = (tab: string) => {
        const stepNumber = parseInt(tab.replace("step", ""));
        const currentStepNumber = parseInt(activeTab.replace("step", ""));

        // Allow going back to previous steps
        if (stepNumber < currentStepNumber) {
            setActiveTab(tab);
            return;
        }

        // Only allow going to next step if current step is completed
        if (stepNumber === currentStepNumber + 1 && isStepCompleted(activeTab)) {
            setActiveTab(tab);
        }
    };

    // Step indicator component
    const StepIndicator = ({ step, label }: { step: string; label: string }) => {
        const isCompleted = isStepCompleted(step);
        const isActive = activeTab === step;
        const stepNumber = parseInt(step.replace("step", ""));

        return (
            <TabsTrigger value={step} className={`flex flex-col items-center justify-center data-[state=active]:bg-transparent relative ${isCompleted ? "cursor-pointer" : "cursor-not-allowed"}`} onClick={() => handleTabChange(step)}>
                <div className={`flex items-center justify-center rounded-full w-12 h-12 transition-all duration-200 ${isActive ? "bg-[#C9A94D] text-white" : isCompleted ? "bg-[#C9A94D] text-white" : "bg-[#9399A6] text-[#B6BAC3]"}`}>{isCompleted ? <Check className="w-6 h-6" /> : stepNumber}</div>
                <p className={`mt-2 text-center transition-colors duration-200 ${isActive ? "text-[#C9A94D] font-semibold" : isCompleted ? "text-[#C9A94D] font-semibold" : "text-[#B6BAC3]"}`}>{label}</p>
            </TabsTrigger>
        );
    };

    // Function to set full year dates when calendar is enabled

    const handleCalendarToggle = (enabled: boolean) => {
        if (enabled) {
            const currentYear = new Date().getFullYear();
            const startOfYear = new Date(currentYear, 0, 1); // January 1st
            const endOfYear = new Date(currentYear, 11, 31); // December 31st

            step2Form.setValue("availableFrom", startOfYear);
            step2Form.setValue("availableTo", endOfYear);
        } else {
            step2Form.setValue("availableFrom", undefined);
            step2Form.setValue("availableTo", undefined);
        }
        step2Form.setValue("calendarEnabled", enabled);
    };

    return (
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="mb-8 grid gap-3 md:grid-cols-4 grid-cols-2 bg-transparent w-full h-auto relative">
                {["Basic info", "Details", "Photos", "Review"].map((label, i) => (
                    <StepIndicator key={i} step={`step${i + 1}`} label={label} />
                ))}
            </TabsList>

            {/* Step 1 - Basic Information */}
            <TabsContent value="step1" className="text-[#C9A94D] border border-[#C9A94D] p-3 md:p-6 rounded-[20px]">
                <h1 className="text-[28px] font-bold mb-2">Basic Information</h1>
                <p className="mb-8">Let's start with the basics about your property</p>

                <form onSubmit={step1Form.handleSubmit(onSubmitStep1)} className="space-y-5">
                    {/* {["title", "description", "location", "postCode"].map((field) => (
                        <div key={field}>
                            <label className="block text-sm font-medium">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                            {field === "description" ? (
                                <textarea {...step1Form.register(field as keyof Step1Data)} rows={5} className="mt-1 block w-full rounded-lg border border-[#C9A94D] p-3 focus:ring-2 focus:ring-[#C9A94D] focus:outline-none" />
                            ) : (
                                <input {...step1Form.register(field as keyof Step1Data)} className="mt-1 block w-full rounded-lg border border-[#C9A94D] p-3 focus:ring-2 focus:ring-[#C9A94D] focus:outline-none" />
                            )}
                            {step1Form.formState.errors[field as keyof Step1Data] && <p className="text-red-500 text-sm mt-1">{step1Form.formState.errors[field as keyof Step1Data]?.message}</p>}
                        </div>
                    ))} */}
                    <div key="title">
                        <label className="block text-sm font-medium">Title</label>
                        <input {...step1Form.register("title")} className="mt-1 block w-full rounded-lg border border-[#C9A94D] p-3 focus:ring-2 focus:ring-[#C9A94D] focus:outline-none" />
                        {step1Form.formState.errors.title && <p className="text-red-500 text-sm mt-1">{step1Form.formState.errors.title?.message}</p>}
                    </div>

                    <div key="description">
                        <label className="block text-sm font-medium">Description</label>
                        <textarea {...step1Form.register("description")} rows={5} className="mt-1 block w-full rounded-lg border border-[#C9A94D] p-3 focus:ring-2 focus:ring-[#C9A94D] focus:outline-none" />
                        {step1Form.formState.errors.description && <p className="text-red-500 text-sm mt-1">{step1Form.formState.errors.description?.message}</p>}
                    </div>

                    {/* <div key="location">
                        <label className="block text-sm font-medium">Location</label>
                        <input {...step1Form.register("location")} className="mt-1 block w-full rounded-lg border border-[#C9A94D] p-3 focus:ring-2 focus:ring-[#C9A94D] focus:outline-none" />
                        {step1Form.formState.errors.location && <p className="text-red-500 text-sm mt-1">{step1Form.formState.errors.location?.message}</p>}
                    </div> */}
                    <div key="location">
                        <label className="block text-sm font-medium">Location</label>
                        <div className="mt-1 flex">
                            <input {...step1Form.register("location")} className="flex-1 rounded-l-lg border border-r-0 border-[#C9A94D] p-3 focus:ring-2 focus:ring-[#C9A94D] focus:outline-none" placeholder="Enter location" />

                            <Select
                                open={isOpen}
                                onOpenChange={(open) => {
                                    setIsOpen(open);
                                    if (!open) setSearchTerm("");
                                }}
                                onValueChange={(value) => {
                                    if (value) {
                                        const currentValue = step1Form.getValues("location") || "";
                                        const newValue = currentValue.trim() ? `${currentValue.trim()}, ${value}` : value;
                                        step1Form.setValue("location", newValue);
                                        setIsOpen(false);
                                        setSearchTerm("");
                                    }
                                }}
                            >
                                <SelectTrigger className="w-1/4 h-auto! rounded-r-lg rounded-l-none border border-[#C9A94D] bg-transparent p-3 focus:ring-2 focus:ring-[#C9A94D] focus:outline-none flex items-center justify-center">
                                    <SelectValue placeholder="+ City" />
                                </SelectTrigger>
                                <SelectContent
                                    className="bg-white backdrop-blur-sm dark:bg-gray-900 p-0 w-[var(--radix-select-trigger-width)]"
                                    position="popper"
                                    sideOffset={4}
                                    onCloseAutoFocus={(e) => e.preventDefault()}
                                    // Remove forceMount - it doesn't exist
                                >
                                    {/* Search Section */}
                                    <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 p-2 border-b">
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                                            <input
                                                ref={searchInputRef}
                                                type="text"
                                                placeholder="Search cities..."
                                                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C9A94D] bg-white dark:bg-gray-800"
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    e.preventDefault();
                                                }}
                                                onMouseDown={(e) => {
                                                    e.stopPropagation();
                                                }}
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter") e.stopPropagation();
                                                }}
                                                // This is the key: prevent React from stealing focus
                                                onFocus={(e) => {
                                                    e.stopPropagation();
                                                }}
                                            />
                                        </div>
                                    </div>

                                    {/* Cities List */}
                                    <div className="max-h-60 overflow-y-auto py-1">
                                        {locationLoading ? (
                                            <div className="p-4 text-center">Loading...</div>
                                        ) : filteredCities.length === 0 ? (
                                            <div className="p-4 text-center text-gray-500">{searchTerm ? `No cities found for "${searchTerm}"` : "No cities available"}</div>
                                        ) : (
                                            filteredCities.map((city: any) => (
                                                <SelectItem
                                                    key={city._id}
                                                    value={city.name}
                                                    className="cursor-pointer py-2"
                                                    onMouseDown={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                    }}
                                                >
                                                    {city.name}
                                                </SelectItem>
                                            ))
                                        )}
                                    </div>
                                </SelectContent>
                            </Select>
                        </div>
                        {step1Form.formState.errors.location && <p className="text-red-500 text-sm mt-1">{step1Form.formState.errors.location?.message}</p>}
                    </div>

                    <div key="postCode">
                        <label className="block text-sm font-medium">Postcode</label>
                        <input {...step1Form.register("postCode")} className="mt-1 block w-full rounded-lg border border-[#C9A94D] p-3 focus:ring-2 focus:ring-[#C9A94D] focus:outline-none" />
                        {step1Form.formState.errors.postCode && <p className="text-red-500 text-sm mt-1">{step1Form.formState.errors.postCode?.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Property Type</label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 rounded-lg ">
                            {propertyTypeOptions.map((type) => (
                                <label key={type} className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        value={type}
                                        {...step1Form.register("propertyType", { required: "Property type is required" })}
                                        className="hidden" // hide default radio
                                    />
                                    {/* Custom radio button */}
                                    <div className={`w-5 h-5 border rounded-full border-[#C9A94D] flex items-center justify-center transition-all ${step1Form.watch("propertyType") === type ? "bg-[#14213D]" : "bg-transparent"}`}>{step1Form.watch("propertyType") === type && <div className="w-3 h-3 bg-[#C9A94D] rounded-full" />}</div>
                                    <span>{type}</span>
                                </label>
                            ))}
                        </div>
                        {step1Form.formState.errors.propertyType && <p className="text-red-500 text-sm mt-1">{step1Form.formState.errors.propertyType?.message as string}</p>}
                    </div>

                    <div className="flex justify-between mt-4">
                        <button type="button" className="bg-[#B6BAC3] text-[#626A7D] py-2 px-6 rounded-lg hover:bg-gray-300 transition opacity-50 cursor-not-allowed" disabled>
                            Previous
                        </button>

                        <button type="submit" className="bg-[#C9A94D] text-white py-2 px-10 rounded-lg hover:bg-[#bfa14a] transition cursor-pointer">
                            Next
                        </button>
                    </div>
                </form>
            </TabsContent>

            {/* Step 2 - Property Details */}
            <TabsContent value="step2" className="text-[#C9A94D] border border-[#C9A94D] p-3 md:p-6 rounded-[20px]">
                <h1 className="text-[28px] font-bold mb-2">Property Details</h1>
                <p className="mb-8">Tell us about the capacity and layout</p>
                <form onSubmit={step2Form.handleSubmit(onSubmitStep2)} className="space-y-5">
                    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                        {/* maxGuests */}
                        <div>
                            <label className="block text-sm font-medium">Maximum Guests</label>
                            <input type="number" {...step2Form.register("maxGuests", { valueAsNumber: true })} className="mt-1 block w-full rounded-lg border border-[#C9A94D] p-3 focus:ring-2 focus:ring-[#C9A94D] focus:outline-none" />
                            {step2Form.formState.errors.maxGuests && <p className="text-red-500 text-sm mt-1">{step2Form.formState.errors.maxGuests?.message}</p>}
                        </div>

                        {/* bedrooms */}
                        <div>
                            <label className="block text-sm font-medium">Bedrooms</label>
                            <input type="number" {...step2Form.register("bedrooms", { valueAsNumber: true })} className="mt-1 block w-full rounded-lg border border-[#C9A94D] p-3 focus:ring-2 focus:ring-[#C9A94D] focus:outline-none" />
                            {step2Form.formState.errors.bedrooms && <p className="text-red-500 text-sm mt-1">{step2Form.formState.errors.bedrooms?.message}</p>}
                        </div>

                        {/* bathrooms */}
                        <div>
                            <label className="block text-sm font-medium">Bathrooms</label>
                            <input type="number" {...step2Form.register("bathrooms", { valueAsNumber: true })} className="mt-1 block w-full rounded-lg border border-[#C9A94D] p-3 focus:ring-2 focus:ring-[#C9A94D] focus:outline-none" />
                            {step2Form.formState.errors.bathrooms && <p className="text-red-500 text-sm mt-1">{step2Form.formState.errors.bathrooms?.message}</p>}
                        </div>

                        {/* price */}
                        <div>
                            <label className="block text-sm font-medium">Price (Per night)</label>
                            <input type="number" {...step2Form.register("price", { valueAsNumber: true })} className="mt-1 block w-full rounded-lg border border-[#C9A94D] p-3 focus:ring-2 focus:ring-[#C9A94D] focus:outline-none" />
                            {step2Form.formState.errors.price && <p className="text-red-500 text-sm mt-1">{step2Form.formState.errors.price?.message}</p>}
                        </div>

                        {/* 5th Field - From/To Dates */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Availability Period</label>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <Controller
                                        control={step2Form.control}
                                        name="availableFrom"
                                        render={({ field }) => (
                                            <div className="w-full">
                                                <DatePicker placeholderText="Start Date" selected={field.value} onChange={(date: Date | null) => field.onChange(date ?? undefined)} wrapperClassName="w-full" className="w-full rounded-lg border border-[#C9A94D] p-3 focus:ring-2 focus:ring-[#C9A94D] focus:outline-none text-sm" />
                                            </div>
                                        )}
                                    />
                                </div>
                                <div>
                                    <Controller
                                        control={step2Form.control}
                                        name="availableTo"
                                        render={({ field }) => (
                                            <div className="w-full">
                                                <DatePicker placeholderText="End Date" selected={field.value} onChange={(date: Date | null) => field.onChange(date ?? undefined)} wrapperClassName="w-full" className="w-full rounded-lg border border-[#C9A94D] p-3 focus:ring-2 focus:ring-[#C9A94D] focus:outline-none text-sm" />
                                            </div>
                                        )}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* 6th Field - Dropdown for Calendar Status */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Open/Close Calendar</label>
                            <select
                                {...step2Form.register("calendarEnabled", {
                                    setValueAs: (value) => value === "true",
                                })}
                                className="mt-1 block w-full rounded-lg border border-[#C9A94D] p-3 focus:ring-2 focus:ring-[#C9A94D] focus:outline-none"
                            >
                                <option value="true">Open Calendar</option>
                                <option value="false">Close Calendar</option>
                            </select>
                            {step2Form.formState.errors.calendarEnabled && <p className="text-red-500 text-sm mt-1">{step2Form.formState.errors.calendarEnabled?.message}</p>}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-4">Amenities</label>
                        <div className="space-y-8">
                            {amenityCategories.map((category, categoryIdx) => (
                                <div key={categoryIdx} className="mb-6">
                                    <h3 className="text-[#C9A94D] text-lg font-medium mb-3">{category.title}</h3>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        {category.amenities.map((amenity, amenityIdx) => (
                                            <div
                                                key={amenityIdx}
                                                className="flex items-center gap-2 cursor-pointer"
                                                onClick={() => {
                                                    const currentAmenities = step2Form.getValues("amenities") || [];
                                                    const isSelected = currentAmenities.includes(amenity);

                                                    if (isSelected) {
                                                        step2Form.setValue(
                                                            "amenities",
                                                            currentAmenities.filter((a) => a !== amenity)
                                                        );
                                                    } else {
                                                        step2Form.setValue("amenities", [...currentAmenities, amenity]);
                                                    }
                                                }}
                                            >
                                                <button type="button" className={`w-5 h-5 border rounded-xs border-[#C9A94D] flex items-center justify-center transition-all ${step2Form.watch("amenities")?.includes(amenity) ? "bg-[#14213D]" : "bg-transparent"}`}>
                                                    {step2Form.watch("amenities")?.includes(amenity) && <div className="w-[14px] h-[14px] bg-[#C9A94D] rounded-xs" />}
                                                </button>
                                                <span className="text-[#C9A94D]">{amenity}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                        {step2Form.formState.errors.amenities && <p className="text-red-500 text-sm mt-3">{step2Form.formState.errors.amenities.message}</p>}
                    </div>

                    <div className="flex justify-between mt-4">
                        <button type="button" onClick={() => setActiveTab("step1")} className="bg-[#B6BAC3] text-[#626A7D] py-2 px-6 rounded-lg hover:bg-gray-300 transition cursor-pointer">
                            Previous
                        </button>
                        <button type="submit" className="bg-[#C9A94D] text-white py-[10px] px-10 rounded-lg  hover:bg-[#bfa14a] transition cursor-pointer">
                            Next
                        </button>
                    </div>
                </form>
            </TabsContent>

            {/* Step 3 - Photos */}
            <TabsContent value="step3" className="text-[#C9A94D] border border-[#C9A94D] p-3 md:p-6 rounded-[20px]">
                <h1 className="text-[28px] font-bold mb-2">Photos</h1>
                <p className="mb-8">Add photos to showcase your property</p>

                <form onSubmit={step3Form.handleSubmit(onSubmitStep3)} className="space-y-5">
                    <div className="flex flex-col md:flex-row gap-14">
                        {/* Cover Photo */}
                        <div className="w-full md:w-80">
                            <div className="w-full border border-[#C9A94D] bg-[#2D3546] p-5 rounded-[12px] mb-4 md:mb-10 flex items-center justify-center cursor-pointer">
                                <label className="flex items-center gap-2 cursor-pointer w-full justify-center">
                                    <Image src="/listing/add/upload.png" alt="Upload photo" height={32} width={32} />
                                    <span className="text-white">Upload Cover</span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0] ?? null;
                                            step3Form.setValue("coverPhoto", file);
                                            if (file) setCoverPreview(URL.createObjectURL(file));
                                        }}
                                    />
                                </label>
                            </div>

                            {/* Drag & Drop + Preview */}
                            <div
                                className="w-full border border-dashed border-[#C9A94D] bg-[#2D3546] p-5 rounded-[12px] mb-4 md:mb-10 flex items-center justify-center h-60 relative"
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={(e) => {
                                    e.preventDefault();
                                    const file = e.dataTransfer.files[0];
                                    if (file) {
                                        step3Form.setValue("coverPhoto", file);
                                        setCoverPreview(URL.createObjectURL(file));
                                    }
                                }}
                            >
                                {coverPreview ? <Image src={coverPreview} alt="Cover Preview" fill className="object-cover rounded-lg" unoptimized /> : <p className="text-white">Cover</p>}
                                {coverPreview && (
                                    <X
                                        className="w-6 h-6 absolute top-3 right-3 text-[#D00000] cursor-pointer"
                                        onClick={() => {
                                            setCoverPreview(null);
                                            step3Form.setValue("coverPhoto", null);
                                        }}
                                    />
                                )}
                            </div>
                            {step3Form.formState.errors.coverPhoto?.message && <p className="text-red-500 text-sm mt-1">{String(step3Form.formState.errors.coverPhoto?.message)}</p>}
                        </div>

                        <div className="w-full md:w-80">
                            {/* Upload Button */}
                            <div className="w-full border border-[#C9A94D] bg-[#2D3546] p-5 rounded-[12px] mb-4 md:mb-10 flex items-center justify-center cursor-pointer">
                                <label className="flex items-center gap-2 cursor-pointer w-full justify-center">
                                    <Image src="/listing/add/upload.png" alt="Upload photo" height={32} width={32} />
                                    <span className="text-white">Upload Photos</span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        className="hidden"
                                        onChange={(e) => {
                                            const files = e.target.files ? Array.from(e.target.files) : [];
                                            const currentFiles = step3Form.getValues("photos") || [];
                                            const newFiles = [...currentFiles, ...files];
                                            step3Form.setValue("photos", newFiles);
                                            setPhotosPreview(newFiles.map((f: File) => URL.createObjectURL(f)));
                                        }}
                                    />
                                </label>
                            </div>

                            {/* Photo Slots */}
                            <div
                                className="w-full border border-dashed border-[#C9A94D] bg-[#2D3546] p-5 rounded-[12px] mb-4 md:mb-10 flex flex-wrap gap-2 h-60 relative justify-center items-center overflow-auto"
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={(e) => {
                                    e.preventDefault();
                                    const files = e.dataTransfer.files ? Array.from(e.dataTransfer.files) : [];
                                    if (files.length) {
                                        const currentFiles = step3Form.getValues("photos") || [];
                                        const newFiles = [...currentFiles, ...files];
                                        step3Form.setValue("photos", newFiles);
                                        setPhotosPreview(newFiles.map((f: File) => URL.createObjectURL(f)));
                                    }
                                }}
                            >
                                {photosPreview.length > 0 ? (
                                    photosPreview.map((url, i) => (
                                        <div key={i} className="w-28 h-28 relative rounded-lg overflow-hidden">
                                            <Image src={url} alt={`Photo ${i + 1}`} fill className="object-cover" unoptimized />
                                            <X
                                                className="w-5 h-5 absolute top-1 right-1 text-[#D00000] cursor-pointer"
                                                onClick={() => {
                                                    const newPreviews = photosPreview.filter((_, idx) => idx !== i);
                                                    const newFiles = (step3Form.getValues("photos") as File[]).filter((_, idx) => idx !== i);
                                                    setPhotosPreview(newPreviews);
                                                    step3Form.setValue("photos", newFiles);
                                                }}
                                            />
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">Photo</p>
                                )}
                            </div>

                            {/* Error Message */}
                            {step3Form.formState.errors.photos?.message && <p className="text-red-500 text-sm mt-1">{String(step3Form.formState.errors.photos?.message)}</p>}
                        </div>
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex justify-between mt-4">
                        <button type="button" onClick={() => setActiveTab("step2")} className="bg-[#B6BAC3] text-[#626A7D] py-2 px-6 rounded-lg hover:bg-gray-300 transition cursor-pointer">
                            Previous
                        </button>
                        <button type="submit" className="bg-[#C9A94D] text-white py-2 px-6 rounded-lg hover:bg-[#bfa14a] transition cursor-pointer">
                            Next
                        </button>
                    </div>
                </form>
            </TabsContent>

            {/* Step 4 - Review */}
            <TabsContent value="step4" className="text-[#C9A94D] border border-[#C9A94D] p-3 md:p-6 rounded-[20px]">
                <h1 className="text-[28px] font-bold mb-2">Nearly Done</h1>
                <p className="mb-8">Make sure everything looks right before you submit. </p>

                {/* Preview Section */}
                <div className="space-y-4 mb-6 border border-[#C9A94D] p-3 md:p-5 rounded-[20px] text-[#C9A94D]">
                    <div className="flex items-center justify-between gap-3 flex-col md:flex-row">
                        <div className="flex gap-5 flex-col md:flex-row">
                            {/* Img - cover */}
                            <div className="relative w-40 h-32 flex items-center justify-center rounded-lg overflow-hidden border border-[#C9A94D] bg-[#2D3546]">{coverPreview ? <Image src={coverPreview} alt="Cover Preview" fill className="object-cover rounded-lg" unoptimized /> : <p className="text-white text-sm">Cover</p>}</div>
                            <div className="gap-1">
                                <p className="text-xl font-bold mb-2">Name: {step1Data?.title || "N/A"}</p>
                                <p className="mb-2">Location: {step1Data?.location || "N/A"}</p>
                                <button className="rounded-[20px] text-[#14213D] bg-[#B6BAC3] py-1 px-2 w-auto inline-block">{step1Data?.propertyType || "N/A"}</button>
                            </div>
                        </div>
                        <span className="text-xl font-bold">Starting From: {step2Data?.price || "---"}</span>
                    </div>
                    <div className="mt-3 py-5 flex justify-around border-t border-b border-[#C9A94D]">
                        <div className="flex items-center gap-2">
                            <Image src="/listing/add/users-alt.png" alt="User Alt" width={24} height={24}></Image>
                            <span>{step2Data?.maxGuests || "N/A"} Guests</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Image src="/listing/add/home-roof.png" alt="User Alt" width={24} height={24}></Image>
                            <span>{step2Data?.bedrooms || "N/A"} Bedrooms</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Image src="/listing/add/bed-front.png" alt="User Alt" width={24} height={24}></Image>
                            <span>{step2Data?.bathrooms || "N/A"} Bathrooms</span>
                        </div>
                    </div>
                    <BankDetailsModal bankDetailsResponse={bankDetailsResponse} bankDetailsLoading={bankDetailsLoading} refetchBankDetails={refetchBankDetails} />

                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-2">
                            {accountStatus !== "verified" ? (
                                <div onClick={handleConnectStripe} className="flex items-center gap-1 cursor-pointer">
                                    <Image src="/listing/add/plus-circle.png" alt="Set Up Stripe Account" width={24} height={24} />
                                    {stripeLoading ? <p>Checking Stripe Account...</p> : isConnectingStripe ? <p>Connecting Stripe Account...</p> : <p>Link/Set Up Stripe Account (To Receive Payments Automatically)</p>}
                                </div>
                            ) : (
                                <div className="flex items-center gap-1 opacity-60">
                                    <Image src="/listing/add/plus-circle.png" alt="Set Up Stripe Account" width={24} height={24} />
                                    <p>Stripe Account Verified</p>
                                </div>
                            )}

                            {/* Tooltip */}
                            <div className="relative inline-block" onMouseEnter={() => setShowStripeRules(true)} onMouseLeave={() => setShowStripeRules(false)} onClick={() => setShowStripeRules(!showStripeRules)}>
                                <Image src="/listing/add/info-circle.png" alt="Info" width={24} height={24} />

                                {showStripeRules && (
                                    <div className="absolute -right-5 md:right-unset md:left-1/2 md:bottom-full bottom-full mb-2 md:mb-4 w-72 md:w-[520px] bg-[#14213D] text-white text-sm p-6 rounded-[10px] shadow-lg md:-translate-x-1/2 border border-[#C9A94D] z-50" style={{ maxHeight: "80vh", overflowY: "auto" }}>
                                        <h2 className="font-bold mb-2 text-[14px]">Why Connect Stripe Account?</h2>
                                        <p className="mb-2">Connecting your Stripe account is essential to receive payments automatically from your guests.</p>
                                        <p className="mb-2">By setting up Stripe, you can:</p>

                                        <ul className="list-disc list-outside ml-4 mb-2 text-[13px] space-y-1">
                                            <li>
                                                <span className="font-semibold">Get paid instantly and securely</span> — No need to manually chase payments.
                                            </li>
                                            <li>
                                                <span className="font-semibold">Simplify your bookings</span> — Automatic payment processing makes managing your stays hassle-free.
                                            </li>
                                            <li>
                                                <span className="font-semibold">Access additional benefits</span> — Stripe enables features like refunds, payout tracking, and financial reporting.
                                            </li>
                                            <li>
                                                <span className="font-semibold">Boost trust with guests</span> — Verified payment systems make your listings more reliable and professional.
                                            </li>
                                        </ul>

                                        <p className="mt-2">Setting up is quick and easy, and it ensures you can fully take advantage of all the platform's payment tools and features.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-2">
                            {verificationStatus !== "approved" ? (
                                <Link href="/dashboard/profile/verify" target="_blank">
                                    <div className="flex items-center gap-1 cursor-pointer">
                                        <Image src="/listing/add/attachment.png" alt="Attachment" width={24} height={24} />
                                        <p>Get Address (Optional)</p>
                                    </div>
                                </Link>
                            ) : (
                                <div className="flex items-center gap-1 opacity-60">
                                    <Image src="/listing/add/attachment.png" alt="Attachment" width={24} height={24} />
                                    <p>Verified Done</p>
                                </div>
                            )}

                            {/* Tooltip */}
                            <div className="relative inline-block" onMouseEnter={() => setShowRules(true)} onMouseLeave={() => setShowRules(false)} onClick={() => setShowRules(!showRules)}>
                                <Image src="/listing/add/info-circle.png" alt="Info" width={24} height={24} />

                                {showRules && (
                                    <div className="absolute -right-5 md:right-unset md:left-1/2 md:bottom-full bottom-full mb-2 md:mb-4 w-72 md:w-[520px] bg-[#14213D] text-white text-sm p-6 rounded-[10px] shadow-lg md:-translate-x-1/2 border border-[#C9A94D] z-50" style={{ maxHeight: "80vh", overflowY: "auto" }}>
                                        <h2 className="font-bold mb-2 text-[14px]">Common Proof of Address Documents</h2>
                                        <p className="mb-2">Please provide one of the following recent documents showing your full name and address:</p>

                                        <ol className="list-decimal list-outside ml-4 mb-2 text-[13px] space-y-1">
                                            <li>
                                                <span className="font-semibold">Utility Bill (gas, electricity, water, landline, broadband):</span> Must be recent (usually within the last 3 months). Must show your full name and address.
                                            </li>
                                            <li>
                                                <span className="font-semibold">Bank or Building Society Statement:</span> Printed or digital copy is usually acceptable. Must be recent and include your name and address.
                                            </li>
                                            <li>
                                                <span className="font-semibold">Council Tax Bill or Local Authority Letter:</span> Shows your address and is usually considered official.
                                            </li>
                                            <li>
                                                <span className="font-semibold">Government-Issued Letter:</span> HMRC tax document, benefit letter, or other government correspondence. Must be recent and show your name and address.
                                            </li>
                                            <li>
                                                <span className="font-semibold">Tenancy Agreement or Mortgage Statement:</span> Must be current and officially issued.
                                            </li>
                                        </ol>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center justify-end gap-2 flex-col md:flex-row relative">
                        <TermsSelection onTermsChange={handleTermsChange} selectedCustomTermsId={selectedCustomTermsId} setSelectedCustomTermsId={setSelectedCustomTermsId} />

                        <div className="relative">
                            <button className={`py-1 px-7 rounded-[8px] w-full md:w-auto flex items-center gap-1 ${selectedTermsId ? "bg-green-600 hover:bg-green-700" : "bg-[#626A7D] hover:bg-[#535a6b]"} text-white`} onClick={() => setShowOptions(!showOptions)} disabled={termsLoading}>
                                {selectedTermsId ? "Default T&Cs Applied" : "Use/Edit Default Host T&Cs"}
                                {termsLoading && " (Loading...)"}
                            </button>

                            {showOptions && (
                                <div className="absolute top-full left-0 mt-1 w-full flex flex-col gap-1 z-10">
                                    {!selectedTermsId ? (
                                        <button className="w-full bg-[#626A7D] py-1 px-7 text-white rounded-[8px] hover:bg-[#535a6b]" onClick={handleUseDefault} disabled={!defaultTermsResponse?.data?._id}>
                                            Use Default
                                        </button>
                                    ) : (
                                        <button className="w-full bg-red-600 py-1 px-7 text-white rounded-[8px] hover:bg-red-700" onClick={handleRemoveDefault}>
                                            Remove Default
                                        </button>
                                    )}
                                    {/* <Link href={"/dashboard/terms-conditions"} target="_blank">
                                        <button
                                            className="w-full bg-[#626A7D] py-1 px-7 text-white rounded-[8px] hover:bg-[#535a6b]"
                                            onClick={() => {
                                                setShowOptions(false);
                                            }}
                                        >
                                            Edit Default
                                        </button>
                                    </Link> */}
                                    <button
                                        className="w-full bg-[#626A7D] py-1 px-7 text-white rounded-[8px] hover:bg-[#535a6b]"
                                        onClick={() => {
                                            setShowEditDefaultModal(true);
                                            setShowOptions(false);
                                        }}
                                    >
                                        Edit Default
                                    </button>
                                </div>
                            )}
                        </div>
                        <DefaultTermsEditModal defaultTermsResponse={defaultTermsResponse} setSelectedTermsId={setSelectedTermsId} setSelectedCustomTermsId={setSelectedCustomTermsId} setShowOptions={setShowOptions} isOpen={showEditDefaultModal} onClose={() => setShowEditDefaultModal(false)} />
                    </div>
                </div>

                {/* Agreement Form */}
                <form onSubmit={step4Form.handleSubmit(onSubmitStep4)}>
                    <div className="flex items-center mb-6">
                        <input type="checkbox" {...step4Form.register("agreeTerms")} className="mr-3 w-4 h-4 text-[#C9A94D] border-[#C9A94D] focus:ring-[#C9A94D] accent-[#C9A94D]" />
                        <label htmlFor="agreeTerms" className="text-sm font-medium">
                            I Agree to LetANest{" "}
                            <button type="button" className="hover:underline" onClick={handleTermsClick}>
                                Terms & Conditions
                            </button>
                        </label>
                    </div>
                    {step4Form.formState.errors.agreeTerms && <p className="text-red-500 text-sm mb-4">{step4Form.formState.errors.agreeTerms.message}</p>}

                    {/* Buttons */}
                    <div className="flex justify-between gap-3 flex-col md:flex-row">
                        <button type="button" onClick={() => setActiveTab("step3")} className="bg-[#B6BAC3] text-[#626A7D] py-2 px-6 rounded-lg hover:bg-gray-300 transition cursor-pointer">
                            Previous
                        </button>
                        <button type="submit" disabled={isLoading} className={`flex items-center justify-center gap-2 py-2 px-10 rounded-lg transition text-white ${isDisabled || isLoading ? "bg-[#535a6b] cursor-not-allowed" : "bg-[#C9A94D] hover:bg-[#bfa14a] cursor-pointer"}`}>
                            {isLoading ? (
                                <>
                                    <svg className="w-5 h-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                                    </svg>
                                    <span>Submitting...</span>
                                </>
                            ) : (
                                <span>Submit for Review</span>
                            )}
                        </button>
                        {/* <button type="submit" disabled={isDisabled || isLoading} className={`flex items-center justify-center gap-2 py-2 px-10 rounded-lg transition text-white ${isDisabled || isLoading ? "bg-[#535a6b] cursor-not-allowed" : "bg-[#C9A94D] hover:bg-[#bfa14a] cursor-pointer"}`}>
                            {isLoading ? (
                                <>
                                    <svg className="w-5 h-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                                    </svg>
                                    <span>Submitting...</span>
                                </>
                            ) : (
                                <span>Submit for Review</span>
                            )}
                        </button> */}
                    </div>
                </form>
            </TabsContent>
        </Tabs>
    );
};

export default AddListingForm;
