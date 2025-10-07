// "use client";

// import React from "react";
// import * as z from "zod";
// import { useForm, useFieldArray } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Label } from "@/components/ui/label";
// import { Button } from "@/components/ui/button";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import PageHeader from "@/components/PageHeader";
// import { X } from "lucide-react";

// const subscriptionSchema = z.object({
//     title: z.string().min(2, { message: "Title is required" }),
//     details: z.string().min(5, { message: "Details are required" }),
//     price: z.string().min(1, { message: "Price is required" }),
//     duration: z.string().min(1, { message: "Duration is required" }),
//     services: z.array(
//         z.object({
//             name: z.string().min(1, { message: "Service name is required" }),
//         })
//     ),
// });

// type SubscriptionFormValues = z.infer<typeof subscriptionSchema>;

// const AddMembershipForm = () => {
//     const {
//         control,
//         register,
//         handleSubmit,
//         reset,
//         formState: { errors },
//     } = useForm<SubscriptionFormValues>({
//         resolver: zodResolver(subscriptionSchema),
//         defaultValues: {
//             title: "",
//             details: "",
//             price: "",
//             duration: "",
//             services: [{ name: "" }],
//         },
//     });

//     const { fields, append, remove } = useFieldArray({
//         control,
//         name: "services",
//     });

//     const onSubmit = (data: SubscriptionFormValues) => {
//         // convert price to number here manually
//         const processedData = {
//             ...data,
//             price: Number(data.price),
//         };
//         console.log("Form Data:", processedData);
//         reset();
//     };

//     return (
//         <div className="container mx-auto">
//             <PageHeader title={"Add Membership"}></PageHeader>

//             <div className="bg-[#2D3546] border border-[#C9A94D] p-4 md:p-9 text-[#C9A94D]">
//                 <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 w-full md:max-w-96">
//                     <h2 className="text-2xl font-bold text-[#C9A94D] mb-4">Add Subscription</h2>

//                     <div className="flex flex-col gap-3">
//                         <Label htmlFor="title">Title</Label>
//                         <Input id="title" placeholder="eg. Home" {...register("title")} className="bg-[#2D3546] border border-[#C9A94D] placeholder:text-[#C9A94D]" />
//                         {errors.title && <span className="text-red-500 text-sm">{errors.title.message}</span>}
//                     </div>

//                     <div className="flex flex-col gap-3">
//                         <Label htmlFor="details">Details</Label>
//                         <Textarea id="details" placeholder="eg. Home" {...register("details")} className="bg-[#2D3546] border border-[#C9A94D] placeholder:text-[#C9A94D]" />
//                         {errors.details && <span className="text-red-500 text-sm">{errors.details.message}</span>}
//                     </div>

//                     <div className="flex flex-col gap-3">
//                         <Label htmlFor="price">Price</Label>
//                         <Input type="number" id="price" placeholder="0" {...register("price")} className="bg-[#2D3546] border border-[#C9A94D] placeholder:text-[#C9A94D]" />
//                         {errors.price && <span className="text-red-500 text-sm">{errors.price.message}</span>}
//                     </div>

//                     <div className="flex flex-col gap-3 ">
//                         <Label htmlFor="duration">Duration</Label>
//                         <Select {...register("duration")}>
//                             <SelectTrigger className="bg-[#2D3546] border border-[#C9A94D] w-full placeholder:text-[#C9A94D] text-[#C9A94D]">
//                                 <SelectValue placeholder="Select duration" className="placeholder:text-[#C9A94D] text-[#C9A94D]" />
//                             </SelectTrigger>
//                             <SelectContent className="bg-[#2D3546]  border border-[#C9A94D] placeholder:text-[#C9A94D] text-[#C9A94D]">
//                                 <SelectItem value="1 Month">1 Month</SelectItem>
//                                 <SelectItem value="3 Months">3 Months</SelectItem>
//                                 <SelectItem value="6 Months">6 Months</SelectItem>
//                                 <SelectItem value="12 Months">12 Months</SelectItem>
//                             </SelectContent>
//                         </Select>
//                         {errors.duration && <span className="text-red-500 text-sm">{errors.duration.message}</span>}
//                     </div>

//                     <div className="flex flex-col gap-3 space-y-2">
//                         <Label>Services</Label>
//                         {fields.map((field, index) => (
//                             <div key={field.id} className="flex gap-2">
//                                 <Input placeholder="eg. Cleaning" {...register(`services.${index}.name` as const)} className="flex-1 bg-[#2D3546] border border-[#C9A94D] placeholder:text-[#C9A94D] text-[#C9A94D]" />
//                                 <Button variant="destructive" onClick={() => remove(index)}>
//                                     <X />
//                                 </Button>
//                             </div>
//                         ))}
//                         <Button type="button" className="bg-[#C9A94D] hover:bg-[#b8973e] text-white" onClick={() => append({ name: "" })}>
//                             Add More
//                         </Button>
//                     </div>

//                     <div className="grid grid-cols-2 gap-4 mt-4">
//                         <Button type="button" onClick={() => reset()} className="w-full bg-[#C9A94D] hover:bg-[#C9A94D]">
//                             Reset
//                         </Button>
//                         <Button type="submit" className="bg-[#14213D] text-white border border-[#C9A94D] hover:bg-[#14213D] w-full">
//                             Save
//                         </Button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default AddMembershipForm;

// "use client";

// import React from "react";
// import * as z from "zod";
// import { useForm, useFieldArray } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Label } from "@/components/ui/label";
// import { Button } from "@/components/ui/button";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Checkbox } from "@/components/ui/checkbox";
// import PageHeader from "@/components/PageHeader";
// import { X, Plus } from "lucide-react";

// // Define the feature schema with explicit required included field
// const featureSchema = z.object({
//     name: z.string().min(1, { message: "Feature name is required" }),
//     included: z.boolean(),
// });

// const subscriptionSchema = z.object({
//     name: z.string().min(2, { message: "Name is required" }),
//     type: z.enum(["GUEST", "HOST"]),
//     level: z.enum(["free", "premium", "silver", "gold"]),
//     billingPeriod: z.enum(["monthly", "annual", "none"]),
//     cost: z.number().min(0, { message: "Cost must be a positive number" }),
//     currency: z.string().min(1, { message: "Currency is required" }),
//     bookingFee: z.union([z.number(), z.string()]),
//     commission: z.number().optional(),
//     bookingLimit: z.number().optional(),
//     description: z.string().min(5, { message: "Description is required" }),
//     features: z.array(featureSchema).min(1, { message: "At least one feature is required" }),
//     perks: z
//         .array(
//             z.object({
//                 value: z.string().min(1, { message: "Perk is required" }),
//             })
//         )
//         .min(1, { message: "At least one perk is required" }),
//     badge: z.string().optional(),
//     isActive: z.boolean(),
// });

// // Explicitly define the form values type to match the schema exactly
// type SubscriptionFormValues = {
//     name: string;
//     type: "GUEST" | "HOST";
//     level: "free" | "premium" | "silver" | "gold";
//     billingPeriod: "monthly" | "annual" | "none";
//     cost: number;
//     currency: string;
//     bookingFee: string | number;
//     commission?: number;
//     bookingLimit?: number;
//     description: string;
//     features: Array<{
//         name: string;
//         included: boolean;
//     }>;
//     perks: Array<{
//         value: string;
//     }>;
//     badge?: string;
//     isActive: boolean;
// };

// const AddMembershipForm = () => {
//     const {
//         control,
//         register,
//         handleSubmit,
//         reset,
//         watch,
//         formState: { errors },
//     } = useForm<SubscriptionFormValues>({
//         resolver: zodResolver(subscriptionSchema),
//         defaultValues: {
//             name: "",
//             type: "GUEST",
//             level: "free",
//             billingPeriod: "none",
//             cost: 0,
//             currency: "gbp",
//             bookingFee: "",
//             commission: undefined,
//             bookingLimit: undefined,
//             description: "",
//             features: [{ name: "", included: true }],
//             perks: [{ value: "" }],
//             badge: "",
//             isActive: true,
//         },
//     });

//     const {
//         fields: featureFields,
//         append: appendFeature,
//         remove: removeFeature,
//     } = useFieldArray({
//         control,
//         name: "features",
//     });

//     const {
//         fields: perkFields,
//         append: appendPerk,
//         remove: removePerk,
//     } = useFieldArray({
//         control,
//         name: "perks",
//     });

//     const watchType = watch("type");
//     const watchLevel = watch("level");
//     const watchBillingPeriod = watch("billingPeriod");

//     const onSubmit = (data: SubscriptionFormValues) => {
//         // Process the data to match your API structure
//         const processedData = {
//             ...data,
//             // Convert perks array to string array
//             perks: data.perks.map((perk) => perk.value),
//             // Ensure bookingFee is properly formatted
//             bookingFee: typeof data.bookingFee === "string" && data.bookingFee.includes("%") ? data.bookingFee : Number(data.bookingFee),
//         };
//         console.log("Form Data:", processedData);
//         // Here you would typically call your API mutation
//         // createSubscription(processedData);
//     };

//     return (
//         <div className="container mx-auto">
//             <PageHeader title={"Add Membership"} />

//             <div className="bg-[#2D3546] border border-[#C9A94D] p-4 md:p-9 text-[#C9A94D]">
//                 <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
//                     <h2 className="text-2xl font-bold text-[#C9A94D] mb-6">Create Subscription Plan</h2>

//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                         {/* Basic Information */}
//                         <div className="flex flex-col gap-3">
//                             <Label htmlFor="name">Plan Name</Label>
//                             <Input id="name" placeholder="e.g., Golden Key (Premium Guest)" {...register("name")} className="bg-[#2D3546] border border-[#C9A94D] placeholder:text-[#C9A94D]" />
//                             {errors.name && <span className="text-red-500 text-sm">{errors.name.message}</span>}
//                         </div>

//                         <div className="flex flex-col gap-3">
//                             <Label htmlFor="type">Type</Label>
//                             <Select {...register("type")}>
//                                 <SelectTrigger className="bg-[#2D3546] border border-[#C9A94D] w-full text-[#C9A94D]">
//                                     <SelectValue placeholder="Select type" />
//                                 </SelectTrigger>
//                                 <SelectContent className="bg-[#2D3546] border border-[#C9A94D] text-[#C9A94D]">
//                                     <SelectItem value="GUEST">Guest</SelectItem>
//                                     <SelectItem value="HOST">Host</SelectItem>
//                                 </SelectContent>
//                             </Select>
//                             {errors.type && <span className="text-red-500 text-sm">{errors.type.message}</span>}
//                         </div>

//                         <div className="flex flex-col gap-3">
//                             <Label htmlFor="level">Level</Label>
//                             <Select {...register("level")}>
//                                 <SelectTrigger className="bg-[#2D3546] border border-[#C9A94D] w-full text-[#C9A94D]">
//                                     <SelectValue placeholder="Select level" />
//                                 </SelectTrigger>
//                                 <SelectContent className="bg-[#2D3546] border border-[#C9A94D] text-[#C9A94D]">
//                                     <SelectItem value="free">Free</SelectItem>
//                                     <SelectItem value="premium">Premium</SelectItem>
//                                     <SelectItem value="silver">Silver</SelectItem>
//                                     <SelectItem value="gold">Gold</SelectItem>
//                                 </SelectContent>
//                             </Select>
//                             {errors.level && <span className="text-red-500 text-sm">{errors.level.message}</span>}
//                         </div>

//                         <div className="flex flex-col gap-3">
//                             <Label htmlFor="billingPeriod">Billing Period</Label>
//                             <Select {...register("billingPeriod")}>
//                                 <SelectTrigger className="bg-[#2D3546] border border-[#C9A94D] w-full text-[#C9A94D]">
//                                     <SelectValue placeholder="Select billing period" />
//                                 </SelectTrigger>
//                                 <SelectContent className="bg-[#2D3546] border border-[#C9A94D] text-[#C9A94D]">
//                                     <SelectItem value="monthly">Monthly</SelectItem>
//                                     <SelectItem value="annual">Annual</SelectItem>
//                                     <SelectItem value="none">None</SelectItem>
//                                 </SelectContent>
//                             </Select>
//                             {errors.billingPeriod && <span className="text-red-500 text-sm">{errors.billingPeriod.message}</span>}
//                         </div>

//                         {/* Pricing Information */}
//                         <div className="flex flex-col gap-3">
//                             <Label htmlFor="cost">Cost</Label>
//                             <Input type="number" id="cost" step="0.01" placeholder="0.00" {...register("cost", { valueAsNumber: true })} className="bg-[#2D3546] border border-[#C9A94D] placeholder:text-[#C9A94D]" />
//                             {errors.cost && <span className="text-red-500 text-sm">{errors.cost.message}</span>}
//                         </div>

//                         <div className="flex flex-col gap-3">
//                             <Label htmlFor="currency">Currency</Label>
//                             <Select {...register("currency")}>
//                                 <SelectTrigger className="bg-[#2D3546] border border-[#C9A94D] w-full text-[#C9A94D]">
//                                     <SelectValue placeholder="Select currency" />
//                                 </SelectTrigger>
//                                 <SelectContent className="bg-[#2D3546] border border-[#C9A94D] text-[#C9A94D]">
//                                     <SelectItem value="gbp">GBP (£)</SelectItem>
//                                     <SelectItem value="usd">USD ($)</SelectItem>
//                                     <SelectItem value="eur">EUR (€)</SelectItem>
//                                 </SelectContent>
//                             </Select>
//                             {errors.currency && <span className="text-red-500 text-sm">{errors.currency.message}</span>}
//                         </div>

//                         {watchType === "GUEST" && (
//                             <div className="flex flex-col gap-3">
//                                 <Label htmlFor="bookingFee">Booking Fee</Label>
//                                 <Input id="bookingFee" placeholder="e.g., 10% or 0" {...register("bookingFee")} className="bg-[#2D3546] border border-[#C9A94D] placeholder:text-[#C9A94D]" />
//                                 {errors.bookingFee && <span className="text-red-500 text-sm">{errors.bookingFee.message}</span>}
//                             </div>
//                         )}

//                         {watchType === "HOST" && (
//                             <div className="flex flex-col gap-3">
//                                 <Label htmlFor="commission">Commission (%)</Label>
//                                 <Input type="number" id="commission" step="0.1" placeholder="e.g., 10" {...register("commission", { valueAsNumber: true })} className="bg-[#2D3546] border border-[#C9A94D] placeholder:text-[#C9A94D]" />
//                                 {errors.commission && <span className="text-red-500 text-sm">{errors.commission.message}</span>}
//                             </div>
//                         )}

//                         {watchType === "GUEST" && watchLevel !== "free" && (
//                             <div className="flex flex-col gap-3">
//                                 <Label htmlFor="bookingLimit">Booking Limit</Label>
//                                 <Input type="number" id="bookingLimit" placeholder="e.g., 4" {...register("bookingLimit", { valueAsNumber: true })} className="bg-[#2D3546] border border-[#C9A94D] placeholder:text-[#C9A94D]" />
//                                 {errors.bookingLimit && <span className="text-red-500 text-sm">{errors.bookingLimit.message}</span>}
//                             </div>
//                         )}

//                         <div className="flex flex-col gap-3">
//                             <Label htmlFor="badge">Badge Name</Label>
//                             <Input id="badge" placeholder="e.g., Gold Guest" {...register("badge")} className="bg-[#2D3546] border border-[#C9A94D] placeholder:text-[#C9A94D]" />
//                             {errors.badge && <span className="text-red-500 text-sm">{errors.badge.message}</span>}
//                         </div>
//                     </div>

//                     {/* Description */}
//                     <div className="flex flex-col gap-3">
//                         <Label htmlFor="description">Description</Label>
//                         <Textarea id="description" placeholder="Describe the subscription plan..." {...register("description")} className="bg-[#2D3546] border border-[#C9A94D] placeholder:text-[#C9A94D] min-h-[80px]" />
//                         {errors.description && <span className="text-red-500 text-sm">{errors.description.message}</span>}
//                     </div>

//                     {/* Features */}
//                     <div className="flex flex-col gap-3">
//                         <Label>Features</Label>
//                         <div className="space-y-3">
//                             {featureFields.map((field, index) => (
//                                 <div key={field.id} className="flex gap-3 items-start">
//                                     <Input placeholder="e.g., No booking fees" {...register(`features.${index}.name`)} className="flex-1 bg-[#2D3546] border border-[#C9A94D] placeholder:text-[#C9A94D]" />
//                                     <div className="flex items-center space-x-2 mt-2">
//                                         <Checkbox {...register(`features.${index}.included`)} defaultChecked />
//                                         <Label className="text-sm">Included</Label>
//                                     </div>
//                                     <Button type="button" variant="destructive" size="sm" onClick={() => removeFeature(index)} disabled={featureFields.length === 1}>
//                                         <X className="h-4 w-4" />
//                                     </Button>
//                                 </div>
//                             ))}
//                         </div>
//                         <Button type="button" className="bg-[#C9A94D] hover:bg-[#b8973e] text-white w-fit" onClick={() => appendFeature({ name: "", included: true })}>
//                             <Plus className="h-4 w-4 mr-2" />
//                             Add Feature
//                         </Button>
//                         {errors.features && <span className="text-red-500 text-sm">{errors.features.message}</span>}
//                     </div>

//                     {/* Perks */}
//                     <div className="flex flex-col gap-3">
//                         <Label>Perks</Label>
//                         <div className="space-y-3">
//                             {perkFields.map((field, index) => (
//                                 <div key={field.id} className="flex gap-2">
//                                     <Input placeholder="e.g., Priority host response" {...register(`perks.${index}.value`)} className="flex-1 bg-[#2D3546] border border-[#C9A94D] placeholder:text-[#C9A94D]" />
//                                     <Button type="button" variant="destructive" onClick={() => removePerk(index)} disabled={perkFields.length === 1}>
//                                         <X className="h-4 w-4" />
//                                     </Button>
//                                 </div>
//                             ))}
//                         </div>
//                         <Button type="button" className="bg-[#C9A94D] hover:bg-[#b8973e] text-white w-fit" onClick={() => appendPerk({ value: "" })}>
//                             <Plus className="h-4 w-4 mr-2" />
//                             Add Perk
//                         </Button>
//                         {errors.perks && <span className="text-red-500 text-sm">{errors.perks.message}</span>}
//                     </div>

//                     {/* Status */}
//                     <div className="flex items-center space-x-2">
//                         <Checkbox id="isActive" {...register("isActive")} defaultChecked />
//                         <Label htmlFor="isActive" className="text-sm font-medium">
//                             Active Plan
//                         </Label>
//                     </div>

//                     {/* Form Actions */}
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
//                         <Button type="button" onClick={() => reset()} className="w-full bg-gray-600 hover:bg-gray-700 text-white" variant="outline">
//                             Reset
//                         </Button>
//                         <Button type="submit" className="bg-[#14213D] text-white border border-[#C9A94D] hover:bg-[#1a2c4d] w-full">
//                             Create Subscription Plan
//                         </Button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default AddMembershipForm;

"use client";

import React from "react";
import * as z from "zod";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import PageHeader from "@/components/PageHeader";
import { X, Plus } from "lucide-react";
import { useCreateSubscriptionMutation } from "@/redux/features/subscription/subscriptionApi";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// Updated schema to match the new interface
const subscriptionSchema = z.object({
    name: z.string().min(2, { message: "Name is required" }),
    type: z.enum(["GUEST", "HOST"]),
    level: z.enum(["free", "premium", "gold"]),
    billingPeriod: z.enum(["monthly", "annual", "none"]),
    cost: z.number().min(0, { message: "Cost must be a positive number" }),
    currency: z.string().min(1, { message: "Currency is required" }),

    // GUEST specific
    bookingFee: z.union([z.number(), z.string()]).optional(),
    bookingLimit: z.number().optional(),

    // HOST specific
    commission: z.union([z.number(), z.string()]).optional(),
    freeBookings: z.number().optional(),
    listingLimit: z.number().optional(),

    description: z.string().min(5, { message: "Description is required" }),

    // Features only
    features: z
        .array(
            z.object({
                name: z.string().min(1, { message: "Feature name is required" }),
                included: z.boolean(),
            })
        )
        .min(1, { message: "At least one feature is required" }),

    badge: z.string().optional(),
    isActive: z.boolean(),
});

type SubscriptionFormValues = z.infer<typeof subscriptionSchema>;

const AddMembershipForm = () => {
    const router = useRouter();
    const [createSubscription, { isLoading }] = useCreateSubscriptionMutation();

    const {
        control,
        register,
        handleSubmit,
        reset,
        watch,
        setValue,
        formState: { errors },
    } = useForm<SubscriptionFormValues>({
        resolver: zodResolver(subscriptionSchema),
        defaultValues: {
            name: "",
            type: "GUEST",
            level: "free",
            billingPeriod: "none",
            cost: 0,
            currency: "gbp",
            bookingFee: "",
            commission: "",
            bookingLimit: undefined,
            freeBookings: undefined,
            listingLimit: undefined,
            description: "",
            features: [{ name: "", included: true }],
            badge: "",
            isActive: true,
        },
    });

    const {
        fields: featureFields,
        append: appendFeature,
        remove: removeFeature,
    } = useFieldArray({
        control,
        name: "features",
    });

    const watchType = watch("type");
    const watchLevel = watch("level");
    const watchBillingPeriod = watch("billingPeriod");

    // Auto-fill values based on selection
    React.useEffect(() => {
        const autoFillValues = () => {
            if (watchType === "GUEST") {
                switch (watchLevel) {
                    case "free":
                        setValue("bookingFee", "10%");
                        setValue("bookingLimit", undefined);
                        setValue("cost", 0);
                        setValue("billingPeriod", "none");
                        break;
                    case "premium":
                        setValue("bookingFee", "10% after 4 bookings");
                        setValue("bookingLimit", 4);
                        setValue("cost", 4.99);
                        setValue("billingPeriod", "monthly");
                        break;
                    case "gold":
                        setValue("bookingFee", 0);
                        setValue("bookingLimit", undefined);
                        setValue("cost", 49.99);
                        setValue("billingPeriod", "annual");
                        break;
                }
            } else if (watchType === "HOST") {
                switch (watchLevel) {
                    case "free":
                        setValue("commission", "10% after 10 bookings");
                        setValue("freeBookings", 10);
                        setValue("listingLimit", 1);
                        setValue("cost", 0);
                        setValue("billingPeriod", "none");
                        break;
                    case "premium":
                        setValue("commission", 5);
                        setValue("freeBookings", undefined);
                        setValue("listingLimit", 2);
                        setValue("cost", 4.99);
                        setValue("billingPeriod", "monthly");
                        break;
                    case "gold":
                        setValue("commission", 0);
                        setValue("freeBookings", undefined);
                        setValue("listingLimit", 999); // Unlimited
                        setValue("cost", 9.99);
                        setValue("billingPeriod", "monthly");
                        break;
                }
            }
        };

        autoFillValues();
    }, [watchType, watchLevel, setValue]);

    const onSubmit = async (data: SubscriptionFormValues) => {
        try {
            // Prepare the data for backend
            const submissionData = {
                ...data,
                // Ensure numeric values are properly set
                cost: Number(data.cost),
                bookingLimit: data.bookingLimit ? Number(data.bookingLimit) : undefined,
                freeBookings: data.freeBookings ? Number(data.freeBookings) : undefined,
                listingLimit: data.listingLimit ? Number(data.listingLimit) : undefined,
                // Convert commission to number if it's a number string
                commission: data.commission ? (typeof data.commission === "string" && !isNaN(Number(data.commission)) ? Number(data.commission) : data.commission) : undefined,
                // Convert bookingFee to number if it's a number string
                bookingFee: data.bookingFee ? (typeof data.bookingFee === "string" && !isNaN(Number(data.bookingFee)) ? Number(data.bookingFee) : data.bookingFee) : undefined,
            };

            console.log("Submitting data:", submissionData);

            const result = await createSubscription(submissionData).unwrap();

            toast.success(result.message || "Subscription created successfully!");
            router.push("/dashboard/memberships");
        } catch (error: any) {
            console.error("Failed to create subscription:", error);
            toast.error(error?.data?.message || "Failed to create subscription");
        }
    };

    // Helper function to get placeholder and description based on selection
    const getFieldHelpers = () => {
        if (watchType === "GUEST") {
            switch (watchLevel) {
                case "free":
                    return {
                        bookingFeeHelp: "Enter booking fee (e.g., 10%)",
                        bookingLimitHelp: "Not applicable for free tier",
                        description: "Free guest membership with standard booking fees",
                    };
                case "premium":
                    return {
                        bookingFeeHelp: "Enter booking fee structure (e.g., '10% after 4 bookings')",
                        bookingLimitHelp: "Number of free bookings (e.g., 4)",
                        description: "Premium monthly guest subscription with limited free bookings",
                    };
                case "gold":
                    return {
                        bookingFeeHelp: "Enter 0 for no booking fees",
                        bookingLimitHelp: "Leave empty for unlimited bookings",
                        description: "Premium annual guest subscription with unlimited free bookings",
                    };
            }
        } else {
            switch (watchLevel) {
                case "free":
                    return {
                        commissionHelp: "Enter commission structure (e.g., '10% after 10 bookings')",
                        freeBookingsHelp: "Number of commission-free bookings (e.g., 10)",
                        listingLimitHelp: "Maximum property listings (e.g., 1)",
                        description: "Free host subscription with limited commission-free bookings",
                    };
                case "premium":
                    return {
                        commissionHelp: "Enter commission percentage (e.g., 5)",
                        freeBookingsHelp: "Not applicable for premium tier",
                        listingLimitHelp: "Maximum property listings (e.g., 2)",
                        description: "Premium host subscription with reduced commission",
                    };
                case "gold":
                    return {
                        commissionHelp: "Enter 0 for no commission",
                        freeBookingsHelp: "Not applicable for gold tier",
                        listingLimitHelp: "Enter 999 for unlimited listings",
                        description: "Premium gold host subscription with zero commission",
                    };
            }
        }
    };

    const fieldHelpers = getFieldHelpers();

    return (
        <div className="container mx-auto">
            <PageHeader title={"Add Membership"} />

            <div className="bg-[#2D3546] border border-[#C9A94D] p-4 md:p-9 text-[#C9A94D]">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
                    <h2 className="text-2xl font-bold text-[#C9A94D] mb-6">Create Subscription Plan</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Basic Information */}
                        <div className="flex flex-col gap-3">
                            <Label htmlFor="name">Plan Name</Label>
                            <Input id="name" placeholder="e.g., Golden Key (Premium Guest)" {...register("name")} className="bg-[#2D3546] border border-[#C9A94D] placeholder:text-[#C9A94D] text-white" />
                            {errors.name && <span className="text-red-500 text-sm">{errors.name.message}</span>}
                        </div>

                        <div className="flex flex-col gap-3">
                            <Label htmlFor="type">Type</Label>
                            <Select onValueChange={(value: "GUEST" | "HOST") => setValue("type", value)} defaultValue="GUEST">
                                <SelectTrigger className="bg-[#2D3546] border border-[#C9A94D] w-full text-white">
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent className="bg-[#2D3546] border border-[#C9A94D] text-white">
                                    <SelectItem value="GUEST">Guest</SelectItem>
                                    <SelectItem value="HOST">Host</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.type && <span className="text-red-500 text-sm">{errors.type.message}</span>}
                        </div>

                        <div className="flex flex-col gap-3">
                            <Label htmlFor="level">Level</Label>
                            <Select onValueChange={(value: "free" | "premium" | "gold") => setValue("level", value)} defaultValue="free">
                                <SelectTrigger className="bg-[#2D3546] border border-[#C9A94D] w-full text-white">
                                    <SelectValue placeholder="Select level" />
                                </SelectTrigger>
                                <SelectContent className="bg-[#2D3546] border border-[#C9A94D] text-white">
                                    <SelectItem value="free">Free</SelectItem>
                                    <SelectItem value="premium">Premium</SelectItem>
                                    <SelectItem value="gold">Gold</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.level && <span className="text-red-500 text-sm">{errors.level.message}</span>}
                        </div>

                        <div className="flex flex-col gap-3">
                            <Label htmlFor="billingPeriod">Billing Period</Label>
                            <Select onValueChange={(value: "monthly" | "annual" | "none") => setValue("billingPeriod", value)} defaultValue="none">
                                <SelectTrigger className="bg-[#2D3546] border border-[#C9A94D] w-full text-white">
                                    <SelectValue placeholder="Select billing period" />
                                </SelectTrigger>
                                <SelectContent className="bg-[#2D3546] border border-[#C9A94D] text-white">
                                    <SelectItem value="monthly">Monthly</SelectItem>
                                    <SelectItem value="annual">Annual</SelectItem>
                                    <SelectItem value="none">None (Free)</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.billingPeriod && <span className="text-red-500 text-sm">{errors.billingPeriod.message}</span>}
                        </div>

                        {/* Pricing Information */}
                        <div className="flex flex-col gap-3">
                            <Label htmlFor="cost">Cost</Label>
                            <Input type="number" id="cost" step="0.01" placeholder="0.00" {...register("cost", { valueAsNumber: true })} className="bg-[#2D3546] border border-[#C9A94D] placeholder:text-[#C9A94D] text-white" />
                            {errors.cost && <span className="text-red-500 text-sm">{errors.cost.message}</span>}
                        </div>

                        <div className="flex flex-col gap-3">
                            <Label htmlFor="currency">Currency</Label>
                            <Select onValueChange={(value: string) => setValue("currency", value)} defaultValue="gbp">
                                <SelectTrigger className="bg-[#2D3546] border border-[#C9A94D] w-full text-white">
                                    <SelectValue placeholder="Select currency" />
                                </SelectTrigger>
                                <SelectContent className="bg-[#2D3546] border border-[#C9A94D] text-white">
                                    <SelectItem value="gbp">GBP (£)</SelectItem>
                                    <SelectItem value="usd">USD ($)</SelectItem>
                                    <SelectItem value="eur">EUR (€)</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.currency && <span className="text-red-500 text-sm">{errors.currency.message}</span>}
                        </div>

                        {/* Guest Specific Fields */}
                        {watchType === "GUEST" && (
                            <>
                                <div className="flex flex-col gap-3">
                                    <Label htmlFor="bookingFee">Booking Fee</Label>
                                    <Input id="bookingFee" placeholder={fieldHelpers.bookingFeeHelp} {...register("bookingFee")} className="bg-[#2D3546] border border-[#C9A94D] placeholder:text-[#C9A94D] text-white" />
                                    {errors.bookingFee && <span className="text-red-500 text-sm">{errors.bookingFee.message}</span>}
                                </div>

                                <div className="flex flex-col gap-3">
                                    <Label htmlFor="bookingLimit">Booking Limit</Label>
                                    <Input type="number" id="bookingLimit" placeholder={fieldHelpers.bookingLimitHelp} {...register("bookingLimit", { valueAsNumber: true })} className="bg-[#2D3546] border border-[#C9A94D] placeholder:text-[#C9A94D] text-white" />
                                    {errors.bookingLimit && <span className="text-red-500 text-sm">{errors.bookingLimit.message}</span>}
                                </div>
                            </>
                        )}

                        {/* Host Specific Fields */}
                        {watchType === "HOST" && (
                            <>
                                <div className="flex flex-col gap-3">
                                    <Label htmlFor="commission">Commission</Label>
                                    <Input id="commission" placeholder={fieldHelpers.commissionHelp} {...register("commission")} className="bg-[#2D3546] border border-[#C9A94D] placeholder:text-[#C9A94D] text-white" />
                                    {errors.commission && <span className="text-red-500 text-sm">{errors.commission.message}</span>}
                                </div>

                                <div className="flex flex-col gap-3">
                                    <Label htmlFor="freeBookings">Free Bookings</Label>
                                    <Input type="number" id="freeBookings" placeholder={fieldHelpers.freeBookingsHelp} {...register("freeBookings", { valueAsNumber: true })} className="bg-[#2D3546] border border-[#C9A94D] placeholder:text-[#C9A94D] text-white" />
                                    {errors.freeBookings && <span className="text-red-500 text-sm">{errors.freeBookings.message}</span>}
                                </div>

                                <div className="flex flex-col gap-3">
                                    <Label htmlFor="listingLimit">Listing Limit</Label>
                                    <Input type="number" id="listingLimit" placeholder={fieldHelpers.listingLimitHelp} {...register("listingLimit", { valueAsNumber: true })} className="bg-[#2D3546] border border-[#C9A94D] placeholder:text-[#C9A94D] text-white" />
                                    {errors.listingLimit && <span className="text-red-500 text-sm">{errors.listingLimit.message}</span>}
                                </div>
                            </>
                        )}

                        <div className="flex flex-col gap-3">
                            <Label htmlFor="badge">Badge Name</Label>
                            <Input id="badge" placeholder="e.g., Gold Guest, Gold Nest Host" {...register("badge")} className="bg-[#2D3546] border border-[#C9A94D] placeholder:text-[#C9A94D] text-white" />
                            {errors.badge && <span className="text-red-500 text-sm">{errors.badge.message}</span>}
                        </div>
                    </div>

                    {/* Description */}
                    <div className="flex flex-col gap-3">
                        <Label htmlFor="description">Description</Label>
                        <Textarea id="description" placeholder={fieldHelpers.description} {...register("description")} className="bg-[#2D3546] border border-[#C9A94D] placeholder:text-[#C9A94D] text-white min-h-[80px]" />
                        {errors.description && <span className="text-red-500 text-sm">{errors.description.message}</span>}
                    </div>

                    {/* Features */}
                    <div className="flex flex-col gap-3">
                        <Label>Features</Label>
                        <div className="space-y-3">
                            {featureFields.map((field, index) => (
                                <div key={field.id} className="flex gap-3 items-start">
                                    <Input placeholder="e.g., No booking fees, Priority support, etc." {...register(`features.${index}.name`)} className="flex-1 bg-[#2D3546] border border-[#C9A94D] placeholder:text-[#C9A94D] text-white" />
                                    <div className="flex items-center space-x-2 mt-2">
                                        <Checkbox
                                            checked={field.included}
                                            onCheckedChange={(checked) => {
                                                setValue(`features.${index}.included`, checked as boolean);
                                            }}
                                        />
                                        <Label className="text-sm text-white">Included</Label>
                                    </div>
                                    <Button type="button" variant="destructive" size="sm" onClick={() => removeFeature(index)} disabled={featureFields.length === 1}>
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                        <Button type="button" className="bg-[#C9A94D] hover:bg-[#b8973e] text-white w-fit" onClick={() => appendFeature({ name: "", included: true })}>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Feature
                        </Button>
                        {errors.features && <span className="text-red-500 text-sm">{errors.features.message}</span>}
                    </div>

                    {/* Status */}
                    <div className="flex items-center space-x-2">
                        <Checkbox id="isActive" {...register("isActive")} defaultChecked />
                        <Label htmlFor="isActive" className="text-sm font-medium text-white">
                            Active Plan
                        </Label>
                    </div>

                    {/* Form Actions */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                        <Button type="button" onClick={() => reset()} className="w-full bg-gray-600 hover:bg-gray-700 text-white" variant="outline" disabled={isLoading}>
                            Reset
                        </Button>
                        <Button type="submit" className="bg-[#14213D] text-white border border-[#C9A94D] hover:bg-[#1a2c4d] w-full" disabled={isLoading}>
                            {isLoading ? "Creating..." : "Create Subscription Plan"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddMembershipForm;
