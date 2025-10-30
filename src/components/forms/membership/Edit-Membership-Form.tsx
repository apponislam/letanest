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
import { useUpdateSubscriptionMutation, useGetSingleSubscriptionQuery, ISubscription } from "@/redux/features/subscription/subscriptionApi";
import { toast } from "sonner";
import { useRouter, useParams } from "next/navigation";

// Updated schema to match the new interface
const subscriptionSchema = z.object({
    name: z.string().min(2, { message: "Name is required" }),
    type: z.enum(["GUEST", "HOST"]),
    level: z.enum(["free", "premium", "gold"]),
    billingPeriod: z.enum(["monthly", "annual", "none"]),
    cost: z.number().min(0, { message: "Cost must be a positive number" }),
    currency: z.string().min(1, { message: "Currency is required" }),

    // GUEST specific
    bookingFee: z.number().optional(),
    bookingLimit: z.number().optional(),

    // HOST specific
    commission: z.number().optional(),
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

const EditMembershipForm = () => {
    const router = useRouter();
    const params = useParams();
    const subscriptionId = params.id as string;

    const { data: subscription, isLoading: isLoadingSubscription, error } = useGetSingleSubscriptionQuery(subscriptionId);
    const [updateSubscription, { isLoading }] = useUpdateSubscriptionMutation();

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
            bookingFee: undefined,
            commission: undefined,
            bookingLimit: undefined,
            freeBookings: undefined,
            listingLimit: undefined,
            description: "",
            features: [{ name: "", included: true }],
            badge: "",
            isActive: true,
        },
    });

    // Reset form when subscription data is loaded
    React.useEffect(() => {
        if (subscription) {
            console.log(subscription);
            reset({
                name: subscription.name,
                type: subscription.type,
                level: subscription.level,
                billingPeriod: subscription.billingPeriod,
                cost: subscription.cost,
                currency: subscription.currency,
                bookingFee: subscription.bookingFee || undefined,
                commission: subscription.commission || undefined,
                bookingLimit: subscription.bookingLimit,
                freeBookings: subscription.freeBookings,
                listingLimit: subscription.listingLimit,
                description: subscription.description,
                features: subscription.features.length > 0 ? subscription.features : [{ name: "", included: true }],
                badge: subscription.badge || "",
                isActive: subscription.isActive,
            });
        }
    }, [subscription, reset]);

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
                        setValue("bookingFee", 10);
                        setValue("bookingLimit", 0);
                        setValue("cost", 0);
                        setValue("billingPeriod", "none");
                        break;
                    case "premium":
                        setValue("bookingFee", 10);
                        setValue("bookingLimit", 4);
                        setValue("cost", 4.99);
                        setValue("billingPeriod", "monthly");
                        break;
                    case "gold":
                        setValue("bookingFee", 0);
                        setValue("bookingLimit", 999);
                        setValue("cost", 49.99);
                        setValue("billingPeriod", "annual");
                        break;
                    default:
                        break;
                }
            } else if (watchType === "HOST") {
                switch (watchLevel) {
                    case "free":
                        setValue("commission", 10);
                        setValue("freeBookings", 10);
                        setValue("listingLimit", 1);
                        setValue("cost", 0);
                        setValue("billingPeriod", "none");
                        break;
                    case "premium":
                        setValue("commission", 5);
                        setValue("freeBookings", 0);
                        setValue("listingLimit", 2);
                        setValue("cost", 4.99);
                        setValue("billingPeriod", "monthly");
                        break;
                    case "gold":
                        setValue("commission", 0);
                        setValue("freeBookings", 0);
                        setValue("listingLimit", 999);
                        setValue("cost", 9.99);
                        setValue("billingPeriod", "monthly");
                        break;
                    default:
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
                commission: data.commission ? (typeof data.commission === "string" && !isNaN(Number(data.commission)) ? Number(data.commission) : data.commission) : undefined,
                bookingFee: data.bookingFee ? (typeof data.bookingFee === "string" && !isNaN(Number(data.bookingFee)) ? Number(data.bookingFee) : data.bookingFee) : undefined,
            };

            console.log("Updating subscription with data:", submissionData);

            const result = await updateSubscription({
                id: subscriptionId,
                data: submissionData,
            }).unwrap();
            console.log(result);

            toast.success(result.message || "Subscription updated successfully!");
            router.push("/dashboard/memberships");
        } catch (error: any) {
            console.error("Failed to update subscription:", error);
            toast.error(error?.data?.message || "Failed to update subscription");
        }
    };

    // Helper function to get placeholder and description based on selection
    const getFieldHelpers = () => {
        const defaultHelpers = {
            bookingFeeHelp: "Enter booking fee",
            bookingLimitHelp: "Enter booking limit",
            commissionHelp: "Enter commission",
            freeBookingsHelp: "Enter free bookings",
            listingLimitHelp: "Enter listing limit",
            description: "Enter plan description",
        };

        if (watchType === "GUEST") {
            switch (watchLevel) {
                case "free":
                    return {
                        ...defaultHelpers,
                        bookingFeeHelp: "Enter booking fee (e.g., 10%)",
                        bookingLimitHelp: "Not applicable for free tier",
                        description: "Free guest membership with standard booking fees",
                    };
                case "premium":
                    return {
                        ...defaultHelpers,
                        bookingFeeHelp: "Enter booking fee structure (e.g., '10% after 4 bookings')",
                        bookingLimitHelp: "Number of free bookings (e.g., 4)",
                        description: "Premium monthly guest subscription with limited free bookings",
                    };
                case "gold":
                    return {
                        ...defaultHelpers,
                        bookingFeeHelp: "Enter 0 for no booking fees",
                        bookingLimitHelp: "Leave empty for unlimited bookings",
                        description: "Premium annual guest subscription with unlimited free bookings",
                    };
                default:
                    return defaultHelpers;
            }
        } else if (watchType === "HOST") {
            switch (watchLevel) {
                case "free":
                    return {
                        ...defaultHelpers,
                        commissionHelp: "Enter commission structure (e.g., '10% after 10 bookings')",
                        freeBookingsHelp: "Number of commission-free bookings (e.g., 10)",
                        listingLimitHelp: "Maximum property listings (e.g., 1)",
                        description: "Free host subscription with limited commission-free bookings",
                    };
                case "premium":
                    return {
                        ...defaultHelpers,
                        commissionHelp: "Enter commission percentage (e.g., 5)",
                        freeBookingsHelp: "Not applicable for premium tier",
                        listingLimitHelp: "Maximum property listings (e.g., 2)",
                        description: "Premium host subscription with reduced commission",
                    };
                case "gold":
                    return {
                        ...defaultHelpers,
                        commissionHelp: "Enter 0 for no commission",
                        freeBookingsHelp: "Not applicable for gold tier",
                        listingLimitHelp: "Enter 999 for unlimited listings",
                        description: "Premium gold host subscription with zero commission",
                    };
                default:
                    return defaultHelpers;
            }
        }

        return defaultHelpers;
    };

    const fieldHelpers = getFieldHelpers();

    if (isLoadingSubscription) {
        return (
            <div className="container mx-auto">
                <PageHeader title={"Edit Membership"} />
                <div className="bg-[#2D3546] border border-[#C9A94D] p-4 md:p-9 text-[#C9A94D]">
                    <div className="flex justify-center items-center h-32">
                        <p>Loading subscription data...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto">
                <PageHeader title={"Edit Membership"} />
                <div className="bg-[#2D3546] border border-[#C9A94D] p-4 md:p-9 text-[#C9A94D]">
                    <div className="flex justify-center items-center h-32">
                        <p className="text-red-500">Error loading subscription data. Please try again.</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto">
            <PageHeader title={"Edit Membership"} />

            <div className="bg-[#2D3546] border border-[#C9A94D] p-4 md:p-9 text-[#C9A94D]">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
                    <h2 className="text-2xl font-bold text-[#C9A94D] mb-6">Update Subscription Plan</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Basic Information */}
                        <div className="flex flex-col gap-3">
                            <Label htmlFor="name">Plan Name</Label>
                            <Input id="name" placeholder="e.g., Golden Key (Premium Guest)" {...register("name")} className="bg-[#2D3546] border border-[#C9A94D] placeholder:text-[#C9A94D] text-white" />
                            {errors.name && <span className="text-red-500 text-sm">{errors.name.message}</span>}
                        </div>

                        <div className="flex flex-col gap-3">
                            <Label htmlFor="type">Type</Label>
                            <Select onValueChange={(value: "GUEST" | "HOST") => setValue("type", value)} value={watchType}>
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
                            <Select onValueChange={(value: "free" | "premium" | "gold") => setValue("level", value)} value={watchLevel}>
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
                            <Select onValueChange={(value: "monthly" | "annual" | "none") => setValue("billingPeriod", value)} value={watchBillingPeriod}>
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
                            <Select onValueChange={(value: string) => setValue("currency", value)} value={watch("currency")}>
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
                                    <Input type="number" id="bookingFee" placeholder={fieldHelpers.bookingFeeHelp} {...register("bookingFee", { valueAsNumber: true })} className="bg-[#2D3546] border border-[#C9A94D] placeholder:text-[#C9A94D] text-white" />
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
                        <Checkbox id="isActive" {...register("isActive")} />
                        <Label htmlFor="isActive" className="text-sm font-medium text-white">
                            Active Plan
                        </Label>
                    </div>

                    {/* Form Actions */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                        <Button type="button" onClick={() => router.back()} className="w-full bg-gray-600 hover:bg-gray-700 text-white" variant="outline" disabled={isLoading}>
                            Cancel
                        </Button>
                        <Button type="submit" className="bg-[#14213D] text-white border border-[#C9A94D] hover:bg-[#1a2c4d] w-full" disabled={isLoading}>
                            {isLoading ? "Updating..." : "Update Subscription Plan"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditMembershipForm;
