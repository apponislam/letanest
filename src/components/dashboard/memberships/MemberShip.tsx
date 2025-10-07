"use client";
import React, { useState } from "react";
import { SquarePen, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import { useAppSelector } from "@/redux/hooks";
import { currentUser } from "@/redux/features/auth/authSlice";
import { useGetAllSubscriptionsAdminQuery, useGetSubscriptionsByTypeForAdminQuery, useToggleSubscriptionStatusMutation } from "@/redux/features/subscription/subscriptionApi";
import { toast } from "sonner";
import { ISubscription } from "@/redux/features/subscription/subscriptionApi";

const MemberShip = () => {
    const mainuser = useAppSelector(currentUser);
    const [activeTab, setActiveTab] = useState<"GUEST" | "HOST">("GUEST");
    const [expandedPlan, setExpandedPlan] = useState<string | null>(null);

    // Fetch all subscriptions
    const {
        data: subscriptionsData,
        isLoading,
        refetch,
    } = useGetAllSubscriptionsAdminQuery({
        type: activeTab,
    });

    // Fetch subscriptions by type for better organization
    const { data: guestSubscriptions } = useGetSubscriptionsByTypeForAdminQuery("GUEST");
    const { data: hostSubscriptions } = useGetSubscriptionsByTypeForAdminQuery("HOST");

    // Mutations
    const [toggleStatus] = useToggleSubscriptionStatusMutation();

    const subscriptions = subscriptionsData || [];
    const guestPlans = guestSubscriptions || [];
    const hostPlans = hostSubscriptions || [];

    console.log("subscription data", subscriptionsData);

    const toggleExpand = (planId: string) => {
        setExpandedPlan(expandedPlan === planId ? null : planId);
    };

    const handleToggleStatus = async (id: string, name: string, currentStatus: boolean) => {
        try {
            await toggleStatus(id).unwrap();
            toast.success(`Subscription ${currentStatus ? "deactivated" : "activated"} successfully`);
            refetch();
        } catch (error) {
            console.error("Status toggle failed:", error);
            toast.error("Failed to update subscription status");
        }
    };

    const formatPrice = (cost: number, currency: string, billingPeriod: string) => {
        const currencySymbol = currency === "gbp" ? "£" : currency === "usd" ? "$" : currency === "eur" ? "€" : currency;
        const period = billingPeriod === "monthly" ? "/month" : billingPeriod === "annual" ? "/year" : "";
        return `${currencySymbol}${cost}${period}`;
    };

    const formatBookingFee = (bookingFee: string | number | undefined) => {
        if (bookingFee === undefined) return "Not set";
        if (typeof bookingFee === "number") {
            return bookingFee === 0 ? "£0" : `${bookingFee}%`;
        }
        return bookingFee;
    };

    const formatCommission = (commission: number | string | undefined) => {
        if (commission === undefined) return "Not set";
        if (typeof commission === "number") {
            return commission === 0 ? "0%" : `${commission}%`;
        }
        return commission;
    };

    const getSubscriptionDetails = (plan: ISubscription) => {
        const details = [];

        if (plan.type === "GUEST") {
            if (plan.bookingFee !== undefined) {
                details.push(`Booking Fee: ${formatBookingFee(plan.bookingFee)}`);
            }
            if (plan.bookingLimit) {
                details.push(`Max ${plan.bookingLimit} bookings`);
            }
        } else {
            if (plan.commission !== undefined) {
                details.push(`Commission: ${formatCommission(plan.commission)}`);
            }
            if (plan.freeBookings) {
                details.push(`${plan.freeBookings} free bookings`);
            }
            if (plan.listingLimit) {
                details.push(`${plan.listingLimit === 999 ? "Unlimited" : plan.listingLimit} listings`);
            }
        }

        return details.join(" | ");
    };

    const renderPlanCard = (plan: ISubscription) => (
        <div key={plan._id} className="bg-[#2D3546] border border-[#2D3546] hover:bg-transparent hover:border-[#af8d28] p-6 rounded-[16px] flex flex-col justify-between">
            {/* Plan Info */}
            <div>
                <div className="flex justify-between items-start mb-2">
                    <h2 className="text-[18px] font-semibold text-white">{plan.name}</h2>
                    {plan.badge && <span className="bg-[#C9A94D] text-white text-xs px-2 py-1 rounded-full">{plan.badge}</span>}
                </div>

                <p className="mb-2 text-sm text-gray-300">{getSubscriptionDetails(plan)}</p>

                <p className="text-[33px] font-bold mb-4 text-white">{formatPrice(plan.cost, plan.currency, plan.billingPeriod)}</p>

                <p className="text-sm text-gray-300 mb-4">{plan.description}</p>

                {/* Features List - Expandable */}
                <div className="mb-4">
                    <ul className="list-disc list-outside ml-4 space-y-1 text-[14px] text-gray-300">
                        {plan.features.slice(0, 5).map((feature, index) => (
                            <li key={index}>{feature.name}</li>
                        ))}

                        {/* Show remaining features when expanded */}
                        {expandedPlan === plan._id && plan.features.slice(5).map((feature, index) => <li key={index + 5}>{feature.name}</li>)}
                    </ul>

                    {/* Expand/Collapse Button */}
                    {plan.features.length > 5 && (
                        <button onClick={() => toggleExpand(plan._id!)} className="flex items-center justify-center gap-1 w-full mt-3 text-[#C9A94D] hover:text-[#af8d28] transition-colors text-sm">
                            {expandedPlan === plan._id ? (
                                <>
                                    Show Less <ChevronUp className="w-4 h-4" />
                                </>
                            ) : (
                                <>
                                    +{plan.features.length - 5} more features <ChevronDown className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    )}
                </div>
            </div>

            {/* Bottom Action buttons */}
            <div className="flex mt-4 flex-col gap-3">
                {/* <Link href={`/dashboard/memberships/edit/${plan._id}`}>
                    <button className="flex items-center justify-center gap-2 bg-[#C9A94D] text-white font-semibold py-3 px-6 rounded-[10px] hover:bg-[#b8973e] transition-colors shadow-sm w-full">
                        <SquarePen className="w-5 h-5" />
                        Edit
                    </button>
                </Link>

                <div className="flex gap-2">
                    <button onClick={() => handleToggleStatus(plan._id!, plan.name, plan.isActive)} className={`flex-1 py-2 px-4 rounded-[10px] font-semibold transition-colors ${plan.isActive ? "bg-green-600 hover:bg-green-700 text-white" : "bg-gray-600 hover:bg-gray-700 text-white"}`}>
                        {plan.isActive ? "Active" : "Inactive"}
                    </button>
                </div> */}

                <div className="flex items-center justify-between gap-4 w-full">
                    {/* Left: Edit Button */}
                    <Link href={`/dashboard/memberships/edit/${plan._id}`} className="flex-1">
                        <button className="flex items-center justify-center gap-2 bg-[#C9A94D] text-white font-semibold py-3 px-6 rounded-[10px] hover:bg-[#b8973e] transition-colors shadow-sm w-full">
                            <SquarePen className="w-5 h-5" />
                            Edit
                        </button>
                    </Link>

                    {/* Right: Toggle Status Button */}
                    <button onClick={() => handleToggleStatus(plan._id!, plan.name, plan.isActive)} className={`flex-1 py-3 px-6 rounded-[10px] font-semibold transition-colors shadow-sm w-full ${plan.isActive ? "bg-green-600 hover:bg-green-700 text-white" : "bg-gray-600 hover:bg-gray-700 text-white"}`}>
                        {plan.isActive ? "Active" : "Inactive"}
                    </button>
                </div>

                {/* Stripe Info */}
                <div className="mt-2 text-xs text-gray-400">
                    <p>Stripe: {plan.stripeProductId ? "Connected" : "Not connected"}</p>
                    {plan.paymentLink && plan.paymentLink !== "free_tier" && (
                        <a href={plan.paymentLink} target="_blank" rel="noopener noreferrer" className="text-[#C9A94D] hover:underline block mt-1">
                            View Payment Link
                        </a>
                    )}
                </div>
            </div>
        </div>
    );

    if (isLoading) {
        return (
            <div className="container mx-auto">
                <PageHeader title="Memberships" />
                <div className="flex justify-center items-center h-64">
                    <div className="text-[#C9A94D]">Loading subscriptions...</div>
                </div>
            </div>
        );
    }

    // console.log(subscriptions);

    return (
        <div className="container mx-auto">
            <PageHeader title="Memberships" />

            <div className="text-white">
                <div className="mb-8 flex justify-between flex-col md:flex-row gap-4">
                    <div>
                        <h1 className="font-bold text-[30px] mb-4 text-white">Admin Dashboard</h1>
                        <p className="text-gray-300">Welcome back, {mainuser?.name}! Manage your subscription plans.</p>
                    </div>

                    <div className="text-sm text-gray-300">
                        <p>Total Plans: {subscriptions?.length}</p>
                        <p>Active: {subscriptions?.filter((s: ISubscription) => s.isActive).length}</p>
                    </div>
                </div>

                <div className="text-white">
                    <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "GUEST" | "HOST")} className="w-full">
                        {/* Tab Triggers */}
                        <TabsList className="flex w-full h-auto overflow-hidden bg-transparent gap-3 mb-5 md:mb-10">
                            <TabsTrigger value="GUEST" className="p-3 h-auto rounded-[10px] w-full md:w-1/2 text-white data-[state=active]:bg-[#135E9A] data-[state=active]:border-[#C9A94D] data-[state=active]:text-white bg-[#434D64] border-r border-[#C9A94D]">
                                Guest Membership ({guestPlans.length})
                            </TabsTrigger>
                            <TabsTrigger value="HOST" className="p-3 h-auto rounded-[10px] w-full md:w-1/2 text-white data-[state=active]:bg-[#135E9A] data-[state=active]:border-[#C9A94D] data-[state=active]:text-white bg-[#434D64]">
                                Host Membership ({hostPlans.length})
                            </TabsTrigger>
                        </TabsList>

                        {/* Guest Plans */}
                        <TabsContent value="GUEST">
                            {guestPlans.length === 0 ? (
                                <div className="text-center py-12 text-gray-400">
                                    <p>No guest subscription plans found.</p>
                                    <p className="text-sm">Create your first guest plan to get started.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{guestPlans.map(renderPlanCard)}</div>
                            )}
                        </TabsContent>

                        {/* Host Plans */}
                        <TabsContent value="HOST">
                            {hostPlans.length === 0 ? (
                                <div className="text-center py-12 text-gray-400">
                                    <p>No host subscription plans found.</p>
                                    <p className="text-sm">Create your first host plan to get started.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{hostPlans.map(renderPlanCard)}</div>
                            )}
                        </TabsContent>
                    </Tabs>

                    <div className="mt-5">
                        <Link href="/dashboard/memberships/add">
                            <button className="flex items-center gap-2 bg-[#C9A94D] text-white font-semibold py-3 px-20 rounded-[10px] hover:bg-[#b8973e] transition-colors shadow-sm">
                                <SquarePen className="w-5 h-5" />
                                Add New Plan
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MemberShip;
