"use client";

import React, { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Image from "next/image";
import { X, Check } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useGetHostPropertiesQuery, useGetSinglePropertyQuery, useUpdatePropertyMutation } from "@/redux/features/property/propertyApi";
import { toast } from "sonner";
import Link from "next/link";
import { useGetMyDefaultHostTermsQuery } from "@/redux/features/public/publicApi";
import TermsSelection from "./TermsSelection";
import { useAppSelector } from "@/redux/hooks";
import { currentUser } from "@/redux/features/auth/authSlice";
import { useRouter, useParams } from "next/navigation";
import { useConnectStripeAccountMutation, useGetMyProfileQuery, useGetStripeAccountStatusQuery } from "@/redux/features/users/usersApi";

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
    availableFrom: z.date().refine((val) => val instanceof Date, {
        message: "Start date is required",
    }),
    availableTo: z.date().refine((val) => val instanceof Date, {
        message: "End date is required",
    }),
    amenities: z.array(z.string()).min(1, { message: "Please select at least 1 amenity" }),
});

const step3Schema = z.object({
    coverPhoto: z.any().optional(),
    photos: z.array(z.any()).optional(),
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

const amenitiesList = ["Wifi", "Garden", "Beach Access", "Parking", "Pool", "Smoking Allowed", "Hot Tub", "Pet Friendly", "Balcony", "Towels Included", "Dryer", "Kitchen", "Tv", "Gym", "Lift Access", "Disability Access", "Disability Parking"];
const propertyTypeOptions = ["Hotel", "Apartment", "Aparthotel", "Bed & Breakfast", "Hostel", "Guesthouse", "Entire Home", "Room Only", "Student Accommodation", "Unique Stays", "Caravan"];

const EditPropertyPage = () => {
    const { id } = useParams();
    const [activeTab, setActiveTab] = useState("step1");
    const [step1Data, setStep1Data] = useState<Step1Data | null>(null);
    const [step2Data, setStep2Data] = useState<Step2Data | null>(null);
    const [step3Data, setStep3Data] = useState<Step3Data | null>(null);
    const [coverPreview, setCoverPreview] = useState<string | null>(null);
    const [photosPreview, setPhotosPreview] = useState<string[]>([]);
    const [existingCoverPhoto, setExistingCoverPhoto] = useState<string | null>(null);
    const [existingPhotos, setExistingPhotos] = useState<string[]>([]);
    const [showRules, setShowRules] = useState(false);
    const [completedSteps, setCompletedSteps] = useState<string[]>([]);

    // Fetch property data
    const { data: propertyData, isLoading: propertyLoading } = useGetSinglePropertyQuery(id as string);
    const property = propertyData?.data;

    const [connectStripeAccount, { isLoading: isConnectingStripe }] = useConnectStripeAccountMutation();
    const { data: response, isLoading: stripeLoading } = useGetStripeAccountStatusQuery();
    const accountStatus = response?.data?.status;
    const { data: myProfile } = useGetMyProfileQuery();
    const verificationStatus = myProfile?.data?.profile?.verificationStatus;

    const step1Form = useForm<Step1Data>({
        resolver: zodResolver(step1Schema),
        defaultValues: {
            title: "",
            description: "",
            location: "",
            postCode: "",
            propertyType: "",
        },
    });

    const { setValue, watch, formState } = step1Form;
    const selectedType = watch("propertyType");
    const [open, setOpen] = useState(false);

    const step2Form = useForm<Step2Data>({
        resolver: zodResolver(step2Schema),
        defaultValues: {
            maxGuests: 1,
            bedrooms: 1,
            bathrooms: 1,
            price: 1,
            availableFrom: new Date(),
            availableTo: new Date(),
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

    // Set form values when property data is loaded
    useEffect(() => {
        if (property) {
            // Step 1 data
            step1Form.reset({
                title: property.title || "",
                description: property.description || "",
                location: property.location || "",
                postCode: property.postCode || "",
                propertyType: property.propertyType || "",
            });

            // Step 2 data
            step2Form.reset({
                maxGuests: property.maxGuests || 1,
                bedrooms: property.bedrooms || 1,
                bathrooms: property.bathrooms || 1,
                price: property.price || 1,
                availableFrom: property.availableFrom ? new Date(property.availableFrom) : new Date(),
                availableTo: property.availableTo ? new Date(property.availableTo) : new Date(),
                amenities: property.amenities || [],
            });

            // Step 3 data - set existing images
            if (property.coverPhoto) {
                setExistingCoverPhoto(`${process.env.NEXT_PUBLIC_BACKEND_URL}${property.coverPhoto}`);
                setCoverPreview(`${process.env.NEXT_PUBLIC_BACKEND_URL}${property.coverPhoto}`);
            }
            if (property.photos && property.photos.length > 0) {
                const photoUrls = property.photos.map((photo) => `${process.env.NEXT_PUBLIC_BACKEND_URL}${photo}`);
                setExistingPhotos(photoUrls);
                setPhotosPreview(photoUrls);
            }

            // Mark steps as completed
            setCompletedSteps(["step1", "step2", "step3"]);
        }
    }, [property, step1Form, step2Form]);

    const [showOptions, setShowOptions] = useState(false);
    const [selectedTermsId, setSelectedTermsId] = useState<string | null>(null);
    const [selectedCustomTermsId, setSelectedCustomTermsId] = useState<string | null>(null);
    const [updateProperty, { isLoading, error }] = useUpdatePropertyMutation();
    const { data: defaultTermsResponse, isLoading: termsLoading } = useGetMyDefaultHostTermsQuery();

    useEffect(() => {
        if (property) {
            if (property.coverPhoto) {
                setExistingCoverPhoto(property.coverPhoto);
                setCoverPreview(`${process.env.NEXT_PUBLIC_BASE_API}${property.coverPhoto}`);
            }
            if (property.photos && property.photos.length > 0) {
                setExistingPhotos(property.photos);
                setPhotosPreview(property.photos.map((photo) => `${process.env.NEXT_PUBLIC_BASE_API}${photo}`));
            }

            // Mark steps as completed
            setCompletedSteps(["step1", "step2", "step3"]);
        }
    }, [property, step1Form, step2Form]);

    const handleConnectStripe = async () => {
        try {
            const result = await connectStripeAccount().unwrap();
            if (result.data?.onboardingUrl) {
                window.open(result.data.onboardingUrl, "_blank");
            }
        } catch (error: any) {
            const errorMessage = error?.data?.message || "Failed to connect to Stripe. Please try again.";
            toast.error(errorMessage);
            console.log("Failed to connect Stripe:", error);
        }
    };

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

    const getFinalTermsId = () => {
        return selectedCustomTermsId || selectedTermsId;
    };

    const mainuser = useAppSelector(currentUser);
    const router = useRouter();

    const onSubmitStep4 = async (step4Data: Step4Data) => {
        if (!step1Data || !step2Data) return;

        const coverPhotoFile: File | null = step3Data?.coverPhoto || null;
        const photosFiles: File[] = step3Data?.photos || [];

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

        // Append Step3 files if they exist
        if (coverPhotoFile) {
            formData.append("coverPhoto", coverPhotoFile);
        }
        photosFiles.forEach((file) => formData.append("photos", file));

        // Step4 agreement
        formData.append("agreeTerms", step4Data.agreeTerms.toString());
        const finalTermsId = getFinalTermsId();
        if (finalTermsId) {
            formData.append("termsAndConditions", finalTermsId);
        }

        try {
            const result = await updateProperty({ id: id as string, data: formData }).unwrap();
            console.log("Property updated successfully:", result);

            if (mainuser?.role === "ADMIN") {
                router.push("/dashboard/property-management");
            } else if (mainuser?.role === "HOST") {
                router.push("/dashboard/property-listing");
            } else {
                router.push("/dashboard");
            }
            toast.success("Property updated successfully!");
        } catch (err: any) {
            toast.error(err?.data?.message || "Failed to update property");
            console.error("Error updating property:", err);
        }
    };

    const getBackLink = () => {
        if (mainuser?.role === "ADMIN") return "/dashboard/property-management";
        if (mainuser?.role === "HOST") return "/dashboard/property-listing";
        return "/dashboard";
    };

    const isStepCompleted = (step: string) => completedSteps.includes(step);

    const handleTabChange = (tab: string) => {
        const stepNumber = parseInt(tab.replace("step", ""));
        const currentStepNumber = parseInt(activeTab.replace("step", ""));

        if (stepNumber < currentStepNumber) {
            setActiveTab(tab);
            return;
        }

        if (stepNumber === currentStepNumber + 1 && isStepCompleted(activeTab)) {
            setActiveTab(tab);
        }
    };

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

    if (propertyLoading) {
        return (
            <div className="flex justify-center items-center min-h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C9A94D]"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto">
            <div className="flex items-center gap-3 mb-6">
                <Link href={getBackLink()} className="text-[#C9A94D] hover:text-[#b8973e] transition">
                    ← Back to Properties
                </Link>
                <h1 className="text-2xl font-bold text-[#C9A94D]">Edit Property</h1>
            </div>

            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                <TabsList className="mb-8 grid gap-3 md:grid-cols-4 grid-cols-2 bg-transparent w-full h-auto relative">
                    {["Basic info", "Details", "Photos", "Review"].map((label, i) => (
                        <StepIndicator key={i} step={`step${i + 1}`} label={label} />
                    ))}
                </TabsList>

                {/* Step 1 - Basic Information */}
                <TabsContent value="step1" className="text-[#C9A94D] border border-[#C9A94D] p-3 md:p-6 rounded-[20px]">
                    <h1 className="text-[28px] font-bold mb-2">Basic Information</h1>
                    <p className="mb-8">Update the basic information about your property</p>

                    <form onSubmit={step1Form.handleSubmit(onSubmitStep1)} className="space-y-5">
                        {["title", "description", "location", "postCode"].map((field) => (
                            <div key={field}>
                                <label className="block text-sm font-medium">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                                {field === "description" ? (
                                    <textarea {...step1Form.register(field as keyof Step1Data)} rows={5} className="mt-1 block w-full rounded-lg border border-[#C9A94D] p-3 focus:ring-2 focus:ring-[#C9A94D] focus:outline-none" />
                                ) : (
                                    <input {...step1Form.register(field as keyof Step1Data)} className="mt-1 block w-full rounded-lg border border-[#C9A94D] p-3 focus:ring-2 focus:ring-[#C9A94D] focus:outline-none" />
                                )}
                                {step1Form.formState.errors[field as keyof Step1Data] && <p className="text-red-500 text-sm mt-1">{step1Form.formState.errors[field as keyof Step1Data]?.message}</p>}
                            </div>
                        ))}

                        {/* <div>
                            <label className="block text-sm font-medium">Property Type</label>
                            <DropdownMenu open={open} onOpenChange={setOpen}>
                                <DropdownMenuTrigger asChild>
                                    <button type="button" className="mt-1 block w-full rounded-lg border border-[#C9A94D] p-3 text-left focus:ring-2 focus:ring-[#C9A94D] focus:outline-none">
                                        {selectedType || "Select Type"}
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)] bg-white border border-[#C9A94D] z-50 p-0">
                                    {propertyTypeOptions.map((option, i) => (
                                        <DropdownMenuItem
                                            key={i}
                                            className="border-b border-[#C9A94D] last:border-b-0 justify-center cursor-pointer"
                                            onClick={() => {
                                                setValue("propertyType", option, { shouldValidate: true });
                                                setOpen(false);
                                            }}
                                        >
                                            {option}
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                            {formState.errors.propertyType && <p className="text-red-500 text-sm mt-1">{formState.errors.propertyType?.message as string}</p>}
                        </div> */}
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
                            <button type="submit" className="bg-[#C9A94D] text-white py-2 px-10 rounded-lg hover:bg-[#bfa14a] transition">
                                Next
                            </button>
                        </div>
                    </form>
                </TabsContent>

                {/* Step 2 - Property Details */}
                <TabsContent value="step2" className="text-[#C9A94D] border border-[#C9A94D] p-3 md:p-6 rounded-[20px]">
                    <h1 className="text-[28px] font-bold mb-2">Property Details</h1>
                    <p className="mb-8">Update the capacity and layout details</p>

                    <form onSubmit={step2Form.handleSubmit(onSubmitStep2)} className="space-y-5">
                        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                            {["maxGuests", "bedrooms", "bathrooms", "price"].map((field) => (
                                <div key={field}>
                                    <label className="block text-sm font-medium">{field === "maxGuests" ? "Maximum Guests" : field === "price" ? "Price (Per night)" : field.charAt(0).toUpperCase() + field.slice(1)}</label>
                                    <input type="number" {...step2Form.register(field as keyof Step2Data, { valueAsNumber: true })} className="mt-1 block w-full rounded-lg border border-[#C9A94D] p-3 focus:ring-2 focus:ring-[#C9A94D] focus:outline-none" />
                                    {step2Form.formState.errors[field as keyof Step2Data] && <p className="text-red-500 text-sm mt-1">{step2Form.formState.errors[field as keyof Step2Data]?.message}</p>}
                                </div>
                            ))}

                            {/* Date Pickers */}
                            <div className="w-full">
                                <label className="block text-sm font-medium mb-1">From</label>
                                <Controller control={step2Form.control} name="availableFrom" render={({ field }) => <DatePicker placeholderText="From" selected={field.value} onChange={(date: Date | null) => field.onChange(date ?? undefined)} wrapperClassName="w-full" className="w-full mt-1 block rounded-lg border border-[#C9A94D] p-3 focus:ring-2 focus:ring-[#C9A94D] focus:outline-none" />} />
                            </div>

                            <div className="w-full">
                                <label className="block text-sm font-medium mb-1">To</label>
                                <Controller control={step2Form.control} name="availableTo" render={({ field }) => <DatePicker placeholderText="To" selected={field.value} onChange={(date: Date | null) => field.onChange(date ?? undefined)} wrapperClassName="w-full" className="w-full mt-1 block rounded-lg border border-[#C9A94D] p-3 focus:ring-2 focus:ring-[#C9A94D] focus:outline-none" />} />
                            </div>
                        </div>

                        {/* Amenities */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Amenities</label>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 rounded-lg p-3">
                                {amenitiesList.map((amenity) => (
                                    <label key={amenity} className="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" value={amenity} {...step2Form.register("amenities")} className="hidden" />
                                        <div className={`w-5 h-5 border rounded-xs border-[#C9A94D] flex items-center justify-center transition-all ${step2Form.watch("amenities")?.includes(amenity) ? "bg-[#14213D]" : "bg-transparent"}`}>{step2Form.watch("amenities")?.includes(amenity) && <div className="w-[14px] h-[14px] bg-[#C9A94D] rounded-xs" />}</div>
                                        <span>{amenity}</span>
                                    </label>
                                ))}
                            </div>
                            {step2Form.formState.errors.amenities && <p className="text-red-500 text-sm mt-1">{step2Form.formState.errors.amenities.message}</p>}
                        </div>

                        <div className="flex justify-between mt-4">
                            <button type="button" onClick={() => setActiveTab("step1")} className="bg-[#B6BAC3] text-[#626A7D] py-2 px-6 rounded-lg hover:bg-gray-300 transition">
                                Previous
                            </button>
                            <button type="submit" className="bg-[#C9A94D] text-white py-[10px] px-10 rounded-lg hover:bg-[#bfa14a] transition">
                                Next
                            </button>
                        </div>
                    </form>
                </TabsContent>

                {/* Step 3 - Photos */}
                <TabsContent value="step3" className="text-[#C9A94D] border border-[#C9A94D] p-3 md:p-6 rounded-[20px]">
                    <h1 className="text-[28px] font-bold mb-2">Photos</h1>
                    <p className="mb-8">Update photos to showcase your property</p>

                    <form onSubmit={step3Form.handleSubmit(onSubmitStep3)} className="space-y-5">
                        <div className="flex flex-col md:flex-row gap-14">
                            {/* Cover Photo */}
                            <div className="w-full md:w-80">
                                <div className="w-full border border-[#C9A94D] bg-[#2D3546] p-5 rounded-[12px] mb-4 md:mb-10 flex items-center justify-center cursor-pointer">
                                    <label className="flex items-center gap-2 cursor-pointer w-full justify-center">
                                        <Image src="/listing/add/upload.png" alt="Upload photo" height={32} width={32} />
                                        <span className="text-white">Update Cover</span>
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

                                {/* Cover Preview */}
                                <div className="w-full border border-dashed border-[#C9A94D] bg-[#2D3546] p-5 rounded-[12px] mb-4 md:mb-10 flex items-center justify-center h-60 relative">
                                    {coverPreview ? (
                                        <>
                                            <Image src={coverPreview} alt="Cover Preview" fill className="object-cover rounded-lg" unoptimized />
                                            <X
                                                className="w-6 h-6 absolute top-3 right-3 text-[#D00000] cursor-pointer"
                                                onClick={() => {
                                                    setCoverPreview(existingCoverPhoto);
                                                    step3Form.setValue("coverPhoto", null);
                                                }}
                                            />
                                        </>
                                    ) : existingCoverPhoto ? (
                                        <>
                                            <Image src={`${process.env.NEXT_PUBLIC_BASE_API}${existingCoverPhoto}`} alt="Existing Cover" fill className="object-cover rounded-lg" unoptimized />
                                            <div className="absolute top-3 right-3 flex gap-2">
                                                <X
                                                    className="w-6 h-6 text-[#D00000] cursor-pointer"
                                                    onClick={() => {
                                                        setCoverPreview(null);
                                                        setExistingCoverPhoto(null);
                                                        step3Form.setValue("coverPhoto", null);
                                                    }}
                                                />
                                            </div>
                                        </>
                                    ) : (
                                        <p className="text-white">Cover</p>
                                    )}
                                </div>
                            </div>

                            {/* Additional Photos */}
                            <div className="w-full md:w-80">
                                <div className="w-full border border-[#C9A94D] bg-[#2D3546] p-5 rounded-[12px] mb-4 md:mb-10 flex items-center justify-center cursor-pointer">
                                    <label className="flex items-center gap-2 cursor-pointer w-full justify-center">
                                        <Image src="/listing/add/upload.png" alt="Upload photo" height={32} width={32} />
                                        <span className="text-white">Add More Photos</span>
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
                                                setPhotosPreview((prev) => [...prev, ...files.map((f: File) => URL.createObjectURL(f))]);
                                            }}
                                        />
                                    </label>
                                </div>

                                {/* Photos Preview */}
                                <div className="w-full border border-dashed border-[#C9A94D] bg-[#2D3546] p-5 rounded-[12px] mb-4 md:mb-10 flex flex-wrap gap-2 h-60 relative justify-center items-center overflow-auto">
                                    {photosPreview.length > 0 || existingPhotos.length > 0 ? (
                                        <>
                                            {existingPhotos.map((url, i) => (
                                                <div key={`existing-${i}`} className="w-28 h-28 relative rounded-lg overflow-hidden">
                                                    <Image src={`${process.env.NEXT_PUBLIC_BASE_API}${url}`} alt={`Existing Photo ${i + 1}`} fill className="object-cover" unoptimized />
                                                    <X
                                                        className="w-5 h-5 absolute top-1 right-1 text-[#D00000] cursor-pointer"
                                                        onClick={() => {
                                                            const newExisting = existingPhotos.filter((_, idx) => idx !== i);
                                                            setExistingPhotos(newExisting);
                                                        }}
                                                    />
                                                </div>
                                            ))}
                                            {photosPreview.map((url, i) => (
                                                <div key={`new-${i}`} className="w-28 h-28 relative rounded-lg overflow-hidden">
                                                    <Image src={url} alt={`New Photo ${i + 1}`} fill className="object-cover" unoptimized />
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
                                            ))}
                                        </>
                                    ) : (
                                        <p className="text-white">Photos</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-between mt-4">
                            <button type="button" onClick={() => setActiveTab("step2")} className="bg-[#B6BAC3] text-[#626A7D] py-2 px-6 rounded-lg hover:bg-gray-300 transition">
                                Previous
                            </button>
                            <button type="submit" className="bg-[#C9A94D] text-white py-2 px-6 rounded-lg hover:bg-[#bfa14a] transition">
                                Next
                            </button>
                        </div>
                    </form>
                </TabsContent>

                {/* Step 4 - Review */}
                <TabsContent value="step4" className="text-[#C9A94D] border border-[#C9A94D] p-3 md:p-6 rounded-[20px]">
                    <h1 className="text-[28px] font-bold mb-2">Review Changes</h1>
                    <p className="mb-8">Make sure everything looks right before you update.</p>

                    {/* Preview Section */}
                    <div className="space-y-4 mb-6 border border-[#C9A94D] p-3 md:p-5 rounded-[20px] text-[#C9A94D]">
                        <div className="flex items-center justify-between gap-3 flex-col md:flex-row">
                            <div className="flex gap-5 flex-col md:flex-row">
                                <div className="relative w-40 h-32 flex items-center justify-center rounded-lg overflow-hidden border border-[#C9A94D] bg-[#2D3546]">{coverPreview || existingCoverPhoto ? <Image src={coverPreview || existingCoverPhoto!} alt="Cover Preview" fill className="object-cover rounded-lg" unoptimized /> : <p className="text-white text-sm">Cover</p>}</div>
                                <div className="gap-1">
                                    <p className="text-xl font-bold mb-2">Name: {step1Data?.title || property?.title}</p>
                                    <p className="mb-2">Location: {step1Data?.location || property?.location}</p>
                                    <button className="rounded-[20px] text-[#14213D] bg-[#B6BAC3] py-1 px-2 w-auto inline-block">{step1Data?.propertyType || property?.propertyType}</button>
                                </div>
                            </div>
                            <span className="text-xl font-bold">Starting From: {step2Data?.price || property?.price}</span>
                        </div>

                        <div className="mt-3 py-5 flex justify-around border-t border-b border-[#C9A94D]">
                            <div className="flex items-center gap-2">
                                <Image src="/listing/add/users-alt.png" alt="User Alt" width={24} height={24} />
                                <span>{step2Data?.maxGuests || property?.maxGuests || "N/A"} Guests</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Image src="/listing/add/home-roof.png" alt="User Alt" width={24} height={24} />
                                <span>{step2Data?.bedrooms || property?.bedrooms || "N/A"} Bed</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Image src="/listing/add/bed-front.png" alt="User Alt" width={24} height={24} />
                                <span>{step2Data?.bathrooms || property?.bathrooms || "N/A"} Bath</span>
                            </div>
                        </div>

                        {/* Bank Details */}
                        <div onClick={!accountStatus || accountStatus !== "verified" ? handleConnectStripe : undefined} className={`flex items-center gap-2 cursor-pointer transition ${isConnectingStripe || accountStatus === "verified" ? "opacity-60 pointer-events-none" : "hover:text-[#C9A94D]"}`}>
                            <Image src="/listing/add/plus-circle.png" alt="Add Bank Details" width={24} height={24} />
                            {stripeLoading ? <p>Checking Bank Details...</p> : isConnectingStripe ? <p>Connecting Bank Details...</p> : accountStatus === "verified" ? <p>Bank Details Verified</p> : <p>Update Bank Details (Optional)</p>}
                        </div>

                        {/* Address Verification */}
                        <div className="flex items-center gap-2">
                            {verificationStatus !== "approved" ? (
                                <Link href="/dashboard/profile/verify" target="_blank">
                                    <div className="flex items-center gap-1 cursor-pointer">
                                        <Image src="/listing/add/attachment.png" alt="Attachment" width={24} height={24} />
                                        <p>Verify Address (Optional)</p>
                                    </div>
                                </Link>
                            ) : (
                                <div className="flex items-center gap-1 opacity-60">
                                    <Image src="/listing/add/attachment.png" alt="Attachment" width={24} height={24} />
                                    <p>Address Verified</p>
                                </div>
                            )}

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

                        {/* Terms & Conditions */}
                        <div className="flex items-center justify-end gap-2 flex-col md:flex-row relative">
                            <TermsSelection onTermsChange={handleTermsChange} selectedCustomTermsId={selectedCustomTermsId} setSelectedCustomTermsId={setSelectedCustomTermsId} />
                            <div className="relative">
                                <button className="bg-[#626A7D] py-1 px-7 text-white rounded-[8px] w-full md:w-auto flex items-center gap-1" onClick={() => setShowOptions(!showOptions)} disabled={termsLoading}>
                                    Use/Edit Default Host T&Cs
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
                                        <Link href={"/dashboard/terms-conditions"} target="_blank">
                                            <button className="w-full bg-[#626A7D] py-1 px-7 text-white rounded-[8px] hover:bg-[#535a6b]" onClick={() => setShowOptions(false)}>
                                                Edit Default
                                            </button>
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Agreement Form */}
                    <form onSubmit={step4Form.handleSubmit(onSubmitStep4)}>
                        <div className="flex items-center mb-6">
                            <input type="checkbox" {...step4Form.register("agreeTerms")} className="mr-3 w-4 h-4 text-[#C9A94D] border-[#C9A94D] focus:ring-[#C9A94D] accent-[#C9A94D]" />
                            <label htmlFor="agreeTerms" className="text-sm font-medium">
                                I Agree to LetANest <Link href="/terms-of-conditions">Terms & Conditions</Link>
                            </label>
                        </div>
                        {step4Form.formState.errors.agreeTerms && <p className="text-red-500 text-sm mb-4">{step4Form.formState.errors.agreeTerms.message}</p>}

                        <div className="flex justify-between gap-3 flex-col md:flex-row">
                            <button type="button" onClick={() => setActiveTab("step3")} className="bg-[#B6BAC3] text-[#626A7D] py-2 px-6 rounded-lg hover:bg-gray-300 transition">
                                Previous
                            </button>
                            <button type="submit" disabled={isLoading} className="bg-[#C9A94D] text-white py-2 px-10 rounded-lg hover:bg-[#bfa14a] transition disabled:opacity-50">
                                {isLoading ? "Updating..." : "Update Property"}
                            </button>
                        </div>
                    </form>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default EditPropertyPage;
