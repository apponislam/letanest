"use client";

import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Image from "next/image";
import { X, Check } from "lucide-react";
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useCreatePropertyMutation } from "@/redux/features/property/propertyApi";
import { toast } from "sonner";
import Link from "next/link";
import { useGetMyDefaultHostTermsQuery } from "@/redux/features/public/publicApi";
import TermsSelection from "./TermsSelection";
import { useAppSelector } from "@/redux/hooks";
import { currentUser } from "@/redux/features/auth/authSlice";
import { useRouter } from "next/navigation";
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

const amenitiesList = ["Wifi", "Garden", "Beach Access", "Parking", "Pool", "Smoking Allowed", "Hot Tub", "Pet Friendly", "Balcony", "Towels Included", "Dryer", "Kitchen", "Tv", "Gym", "Lift Access", "Disability Access", "Disability Parking"];
const propertyTypeOptions = ["Hotel", "Apartment", "Aparthotel", "Bed & Breakfast", "Hostel", "Guesthouse", "Entire Home", "Room Only", "Student Accommodation", "Unique Stays", "Caravan"];

const AddListingForm: React.FC = () => {
    const [activeTab, setActiveTab] = useState("step1");
    const [step1Data, setStep1Data] = useState<Step1Data | null>(null);
    const [step2Data, setStep2Data] = useState<Step2Data | null>(null);
    const [step3Data, setStep3Data] = useState<Step3Data | null>(null);
    const [coverPreview, setCoverPreview] = useState<string | null>(null);
    const [photosPreview, setPhotosPreview] = useState<string[]>([]);
    const [showRules, setShowRules] = useState(false);
    const [completedSteps, setCompletedSteps] = useState<string[]>([]);

    const [connectStripeAccount, { isLoading: isConnectingStripe }] = useConnectStripeAccountMutation();
    const { data: response, isLoading: stripeLoading } = useGetStripeAccountStatusQuery();
    const accountStatus = response?.data?.status;
    const { data: myProfile } = useGetMyProfileQuery();
    const verificationStatus = myProfile?.data?.profile?.verificationStatus;
    console.log(myProfile);

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

    const step1Form = useForm<Step1Data>({
        resolver: zodResolver(step1Schema),
        defaultValues: { title: "", description: "", location: "", postCode: "", propertyType: "" },
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

    const onSubmitStep1 = (data: Step1Data) => {
        setStep1Data(data);
        setCompletedSteps((prev) => [...prev, "step1"]);
        console.log("Step 1 Data:", data);
        setActiveTab("step2");
    };

    const onSubmitStep2 = (data: Step2Data) => {
        setStep2Data(data);
        setCompletedSteps((prev) => [...prev, "step2"]);
        console.log("Step 2 Data:", data);
        setActiveTab("step3");
    };

    const step3Form = useForm<Step3Data>({
        resolver: zodResolver(step3Schema),
        defaultValues: {
            coverPhoto: null,
            photos: [],
        },
    });

    const onSubmitStep3 = (data: Step3Data) => {
        setStep3Data(data);
        setCompletedSteps((prev) => [...prev, "step3"]);
        const finalData = {
            ...step1Data,
            ...step2Data,
            ...data,
        };
        console.log("Final combined data:", finalData);
        setActiveTab("step4");
    };

    const step4Form = useForm<Step4Data>({
        resolver: zodResolver(step4Schema),
        defaultValues: { agreeTerms: false },
    });

    const [showOptions, setShowOptions] = useState(false);
    const [selectedTermsId, setSelectedTermsId] = useState<string | null>(null);
    const [selectedCustomTermsId, setSelectedCustomTermsId] = useState<string | null>(null);
    const [createProperty, { isLoading, error }] = useCreatePropertyMutation();
    const { data: defaultTermsResponse, isLoading: termsLoading } = useGetMyDefaultHostTermsQuery();

    const handleUseDefault = () => {
        console.log("clicked use default");
        if (defaultTermsResponse?.data?._id) {
            setSelectedTermsId(defaultTermsResponse.data._id);
            setSelectedCustomTermsId(null); // Clear custom if default is selected
            console.log("Using default T&C ID:", defaultTermsResponse.data._id);
            toast.success("Default terms and conditions applied!");
        } else {
            console.log("No T&C ID available");
            toast.error("No default terms found!");
        }
        setShowOptions(false);
    };

    const handleRemoveDefault = () => {
        setSelectedTermsId(null);
        setShowOptions(false);
        console.log("Removed default T&C");
        toast.info("Default terms and conditions removed!");
    };

    const handleTermsChange = (termsId: string | null) => {
        setSelectedCustomTermsId(termsId);
        setSelectedTermsId(null); // Clear default if custom is selected
        console.log("Selected Custom Terms ID:", termsId);
    };

    // Get the final selected terms ID (custom has priority over default)
    const getFinalTermsId = () => {
        return selectedCustomTermsId || selectedTermsId;
    };

    const mainuser = useAppSelector(currentUser);
    const router = useRouter();

    const onSubmitStep4 = async (step4Data: Step4Data) => {
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
            // Send FormData via RTK Query mutation
            const result = await createProperty(formData).unwrap();
            console.log("Property created successfully:", result);
            // Redirect based on user role
            if (mainuser?.role === "ADMIN") {
                router.push("/dashboard/property-management");
            } else if (mainuser?.role === "HOST") {
                router.push("/dashboard/property-listing");
            } else {
                // Fallback redirect
                router.push("/dashboard");
            }
            toast.success("Property created successfully!");
        } catch (err: any) {
            toast.error(err?.data?.message || "Failed to create property");
            console.error("Error creating property:", err);
        }
    };

    // Function to check if a step is completed
    const isStepCompleted = (step: string) => completedSteps.includes(step);

    // Function to handle tab change with validation
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

                {/* Progress line between steps */}
                {/* {stepNumber < 4 && <div className={`absolute top-6 left-full w-8 h-0.5 -translate-y-1/2 ${isCompleted ? "bg-green-500" : "bg-[#9399A6]"}`} />} */}
            </TabsTrigger>
        );
    };

    return (
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="mb-8 grid gap-3 md:grid-cols-4 grid-cols-2 bg-transparent w-full h-auto relative">
                {["Basic info", "Details", "Photos", "Review"].map((label, i) => (
                    <StepIndicator key={i} step={`step${i + 1}`} label={label} />
                ))}
            </TabsList>

            {/* Step 1 */}
            <TabsContent value="step1" className="text-[#C9A94D] border border-[#C9A94D] p-3 md:p-6 rounded-[20px]">
                <h1 className="text-[28px] font-bold mb-2">Basic Information</h1>
                <p className="mb-8">Let's start with the basics about your property</p>

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
                                    <div className={`w-5 h-5 border rounded-full border-[#C9A94D] flex items-center justify-center transition-all ${step1Form.watch("propertyType") === type ? "bg-[#14213D]" : "bg-transparent"}`}>{step1Form.watch("propertyType") === type && <div className="w-3 h-3 bg-[#C9A94D] rounded-full" />}</div> {/* FIXED: step2Form → step1Form */}
                                    <span>{type}</span>
                                </label>
                            ))}
                        </div>
                        {step1Form.formState.errors.propertyType && <p className="text-red-500 text-sm mt-1">{step1Form.formState.errors.propertyType?.message as string}</p>} {/* FIXED: step2Form → step1Form */}
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

            {/* Step 2 */}
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
                            <label className="block text-sm font-medium">Beds</label>
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

                        {/* availableFrom */}
                        <div className="w-full">
                            <label className="block text-sm font-medium mb-1">From</label>
                            <Controller
                                control={step2Form.control}
                                name="availableFrom"
                                render={({ field }) => (
                                    <div className="w-full">
                                        <DatePicker placeholderText="From" selected={field.value} onChange={(date: Date | null) => field.onChange(date ?? undefined)} wrapperClassName="w-full" className="w-full mt-1 block rounded-lg border border-[#C9A94D] p-3 focus:ring-2 focus:ring-[#C9A94D] focus:outline-none" />
                                    </div>
                                )}
                            />
                            {step2Form.formState.errors.availableFrom && <p className="text-red-500 text-sm mt-1">{step2Form.formState.errors.availableFrom?.message}</p>}
                        </div>

                        {/* availableTo */}
                        <div className="w-full">
                            <label className="block text-sm font-medium mb-1">To</label>
                            <Controller
                                control={step2Form.control}
                                name="availableTo"
                                render={({ field }) => (
                                    <div className="w-full">
                                        <DatePicker placeholderText="To" selected={field.value} onChange={(date: Date | null) => field.onChange(date ?? undefined)} wrapperClassName="w-full" className="w-full mt-1 block rounded-lg border border-[#C9A94D] p-3 focus:ring-2 focus:ring-[#C9A94D] focus:outline-none" />
                                    </div>
                                )}
                            />
                            {step2Form.formState.errors.availableTo && <p className="text-red-500 text-sm mt-1">{step2Form.formState.errors.availableTo?.message}</p>}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Amenities</label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 rounded-lg p-3">
                            {amenitiesList.map((amenity) => (
                                <label key={amenity} className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        value={amenity}
                                        {...step2Form.register("amenities")}
                                        className="hidden" // Hide the default checkbox
                                    />
                                    {/* Custom checkbox */}
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
                        <button type="submit" className="bg-[#C9A94D] text-white py-[10px] px-10 rounded-lg  hover:bg-[#bfa14a] transition">
                            Next
                        </button>
                    </div>
                </form>
            </TabsContent>

            {/* Step 3 */}
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
                        <button type="button" onClick={() => setActiveTab("step2")} className="bg-[#B6BAC3] text-[#626A7D] py-2 px-6 rounded-lg hover:bg-gray-300 transition">
                            Previous
                        </button>
                        <button type="submit" className="bg-[#C9A94D] text-white py-2 px-6 rounded-lg hover:bg-[#bfa14a] transition">
                            Next
                        </button>
                    </div>
                </form>
            </TabsContent>

            {/* Step 4 */}
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
                            <span>{step2Data?.bedrooms || "N/A"} Bed</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Image src="/listing/add/bed-front.png" alt="User Alt" width={24} height={24}></Image>
                            <span>{step2Data?.bathrooms || "N/A"} Bath</span>
                        </div>
                    </div>

                    {/* <div onClick={handleConnectStripe} className={`flex items-center gap-2 cursor-pointer transition ${isConnectingStripe ? "opacity-60 pointer-events-none" : "hover:text-[#C9A94D]"}`}>
                        <Image src="/listing/add/plus-circle.png" alt="Add Bank Details" width={24} height={24} />
                        <p>{isConnectingStripe ? "Connecting to Stripe..." : "Add Bank Details (Optional)"}</p>
                    </div> */}
                    <div onClick={!accountStatus || accountStatus !== "verified" ? handleConnectStripe : undefined} className={`flex items-center gap-2 cursor-pointer transition ${isConnectingStripe || accountStatus === "verified" ? "opacity-60 pointer-events-none" : "hover:text-[#C9A94D]"}`}>
                        <Image src="/listing/add/plus-circle.png" alt="Add Bank Details" width={24} height={24} />

                        {stripeLoading ? <p>Checking Bank Details...</p> : isConnectingStripe ? <p>Connecting Bank Details...</p> : accountStatus === "verified" ? <p>Bank Details Verified</p> : <p>Add Bank Details (Optional)</p>}
                    </div>

                    <div className="flex items-center gap-2">
                        {/* <Dialog open={verifyAttOpen} onOpenChange={setVerifyAttOpen}>
                            <DialogTrigger asChild>
                                <div className="flex items-center gap-1 cursor-pointer">
                                    <Image src="/listing/add/attachment.png" alt="Attachment" width={24} height={24} />
                                    <p>Verify Address (Optional)</p>
                                </div>
                            </DialogTrigger>

                       
                            <DialogContent className="bg-[#2D3546] border border-[#C9A94D] rounded-[12px] p-6 max-w-lg w-full">
                                <DialogHeader>
                                    <DialogTitle className="text-white text-lg">Upload Attachment</DialogTitle>
                                </DialogHeader>

                                <form onSubmit={handleVerifyAttSubmit} className="space-y-4">
                                    <div className="w-full border border-dashed border-[#C9A94D] p-5 rounded-[12px] flex items-center justify-center h-60 relative cursor-pointer" onDragOver={(e) => e.preventDefault()} onDrop={handleVerifyAttDrop} onClick={handleVerifyAttClickUpload}>
                                        {verifyAttPreview ? (
                                            <>
                                                <Image src={verifyAttPreview} alt="Attachment Preview" fill className="object-cover rounded-lg" unoptimized />
                                                <X
                                                    className="w-6 h-6 absolute top-3 right-3 text-[#D00000] cursor-pointer"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleVerifyAttRemove();
                                                    }}
                                                />
                                            </>
                                        ) : (
                                            <span className="text-white text-center">Drag & Drop or Click to Upload</span>
                                        )}
                                    </div>

                                    <DialogFooter>
                                        <Button type="submit" variant="secondary" disabled={!verifyAttFile} className="bg-[#C9A94D] text-white hover:bg-[#b8973e]">
                                            Submit
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog> */}
                        {/* <Link href="/dashboard/profile/verify" target="_blank">
                            <div className="flex items-center gap-1 cursor-pointer">
                                <Image src="/listing/add/attachment.png" alt="Attachment" width={24} height={24} />
                                <p>Verify Address (Optional)</p>
                            </div>
                        </Link> */}

                        {/* Tooltip */}
                        {/* <div className="relative inline-block" onMouseEnter={() => setShowRules(true)} onMouseLeave={() => setShowRules(false)} onClick={() => setShowRules(!showRules)}>
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
                        </div> */}

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
                        {/* <button className="bg-[#626A7D] py-1 px-7 text-white rounded-[8px] w-full md:w-auto">Upload Your Own Host T&Cs</button> */}
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
                                        <button
                                            className="w-full bg-red-600 py-1 px-7 text-white rounded-[8px] hover:bg-red-700"
                                            onClick={handleRemoveDefault} // Use the new handler
                                        >
                                            Remove Default
                                        </button>
                                    )}
                                    <Link href={"/dashboard/terms-conditions"} target="_blank">
                                        <button
                                            className="w-full bg-[#626A7D] py-1 px-7 text-white rounded-[8px] hover:bg-[#535a6b]"
                                            onClick={() => {
                                                setShowOptions(false);
                                            }}
                                        >
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

                    {/* Buttons */}
                    <div className="flex justify-between gap-3 flex-col md:flex-row">
                        <button type="button" onClick={() => setActiveTab("step3")} className="bg-[#B6BAC3] text-[#626A7D] py-2 px-6 rounded-lg hover:bg-gray-300 transition">
                            Previous
                        </button>
                        <button type="submit" className="bg-[#C9A94D] text-white py-2 px-10 rounded-lg hover:bg-[#bfa14a] transition">
                            Submit for Review
                        </button>
                    </div>
                </form>
            </TabsContent>
        </Tabs>
    );
};

export default AddListingForm;
