// "use client";
// import React from "react";
// import { SquarePen } from "lucide-react";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Trash2 } from "lucide-react";
// import Link from "next/link";
// import PageHeader from "@/components/PageHeader";
// import { useAppSelector } from "@/redux/hooks";
// import { currentUser } from "@/redux/features/auth/authSlice";

// const guestPlans = [
//     {
//         title: "Open Door (Free)",
//         description: "Booking Fee: 10% per booking (adjustable anytime)",
//         price: "£0/month",
//         benefits: ["Browse all homes freely", "Contact hosts after quick signup", "Standard booking with fees", "Leave reviews after stays", "Save favorites in your guest Dashboard"],
//     },
//     {
//         title: "Golden Key (Monthly)",
//         description: "Booking Fee: £0 (maximum 4 bookings, no surcharge)",
//         price: "£4.99/month",
//         benefits: ["No booking fees (unlimited stays)", "Priority host response (subscriber flagged as trusted)", "Priority guest support (fast-track help)", "Cashback/reward credits for future bookings", "Gold Guest Badge"],
//     },
//     {
//         title: "Forever Key (Annual)",
//         description: "Booking Fee: £0 unlimited bookings, no surcharge",
//         price: "£49.99/month",
//         benefits: ['All "Welcome Home" monthly perks', "Annual loyalty bonus (£25 travel credit)", "Exclusive discounts with local partners", "Recognition as a long-term member", "Gold House Badge", 'Access to "Nest Exclusive" properties'],
//     },
// ];

// const hostPlans = [
//     {
//         title: "Starter Host",
//         description: "Free basic plan for new hosts",
//         price: "£0/month",
//         benefits: ["List up to 2 properties", "Standard booking fees", "Basic support"],
//     },
//     {
//         title: "Pro Host",
//         description: "For growing hosts with more listings",
//         price: "£14.99/month",
//         benefits: ["List up to 10 properties", "Reduced booking fees", "Priority support", "Host badge"],
//     },
//     {
//         title: "Elite Host",
//         description: "Premium plan for top hosts",
//         price: "£49.99/month",
//         benefits: ["Unlimited property listings", "No booking fees", "Dedicated account manager", "Elite Host badge"],
//     },
// ];

// const MemberShip = () => {
//     const mainuser = useAppSelector(currentUser);
//     console.log(mainuser);

//     return (
//         <div className="container mx-auto">
//             <PageHeader title={"Memberships"}></PageHeader>
//             <div className="text-[#C9A94D]">
//                 <div className="mb-8 flex justify-between flex-col md:flex-row gap-4">
//                     <div>
//                         <h1 className="font-bold text-[30px] mb-4">Admin Dashboard</h1>
//                         <p>Welcome back, {mainuser?.name} ! Here’s what’s happening with your account.</p>
//                     </div>
//                 </div>

//                 <div className="text-[#C9A94D]">
//                     <Tabs defaultValue="guest" className="w-full">
//                         {/* Tab Triggers */}
//                         <TabsList className="flex w-full h-auto overflow-hidden bg-transparent gap-3 mb-5 md:mb-10">
//                             <TabsTrigger value="guest" className="p-3 h-auto rounded-[10px] w-full  md:w-1/2 text-white data-[state=active]:bg-[#135E9A] data-[state=active]:border-[#C9A94D] data-[state=active]:text-white bg-[#434D64] border-r border-[#C9A94D] ">
//                                 Guest Membership
//                             </TabsTrigger>
//                             <TabsTrigger value="host" className="p-3 h-auto rounded-[10px] w-full  md:w-1/2 text-white data-[state=active]:bg-[#135E9A] data-[state=active]:border-[#C9A94D] data-[state=active]:text-white bg-[#434D64]">
//                                 Host Membership
//                             </TabsTrigger>
//                         </TabsList>

//                         {/* Guest Plans */}
//                         <TabsContent value="guest">
//                             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                                 {guestPlans.map((plan, idx) => (
//                                     <div key={idx} className="bg-[#2D3546] border border-[#2D3546] hover:bg-transparent hover:border-[#af8d28] p-6 rounded-[16px] flex flex-col justify-between">
//                                         {/* Plan Info */}
//                                         <div>
//                                             <h2 className="text-[18px] mb-2 text-center">{plan.title}</h2>
//                                             <p className="mb-4 text-center">{plan.description}</p>
//                                             <p className="text-[33px] font-bold mb-4 text-center">{plan.price}</p>

//                                             <ul className="list-disc list-outside ml-4 mb-6 space-y-1 text-[14px]">
//                                                 {plan.benefits.map((benefit, i) => (
//                                                     <li key={i}>{benefit}</li>
//                                                 ))}
//                                             </ul>
//                                         </div>

//                                         {/* Bottom Edit/Delete buttons */}
//                                         <div className="flex mt-4 flex-col gap-3">
//                                             <button className="flex items-center justify-center gap-2 bg-[#C9A94D] text-white font-semibold py-3 px-6 rounded-[10px] hover:bg-[#b8973e] transition-colors shadow-sm">
//                                                 <SquarePen className="w-5 h-5" />
//                                                 Edit
//                                             </button>
//                                             <button className="flex items-center justify-center gap-2 bg-[#C9A94D] text-white font-semibold py-3 px-6 rounded-[10px] hover:bg-[#b8973e] transition-colors shadow-sm">
//                                                 <Trash2 className="w-5 h-5" />
//                                                 Delete
//                                             </button>
//                                         </div>
//                                     </div>
//                                 ))}
//                             </div>
//                         </TabsContent>

//                         {/* Host Plans */}
//                         <TabsContent value="host">
//                             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                                 {hostPlans.map((plan, idx) => (
//                                     <div key={idx} className="bg-[#2D3546] border border-[#2D3546] hover:bg-transparent hover:border-[#af8d28] p-6 rounded-[16px] flex flex-col justify-between">
//                                         {/* Plan Info */}
//                                         <div>
//                                             <h2 className="text-[18px] mb-2 text-center">{plan.title}</h2>
//                                             <p className="mb-4 text-center">{plan.description}</p>
//                                             <p className="text-[33px] font-bold mb-4 text-center">{plan.price}</p>

//                                             <ul className="list-disc list-outside ml-4 mb-6 space-y-1 text-[14px]">
//                                                 {plan.benefits.map((benefit, i) => (
//                                                     <li key={i}>{benefit}</li>
//                                                 ))}
//                                             </ul>
//                                         </div>

//                                         {/* Bottom Edit/Delete buttons */}
//                                         <div className="flex mt-4 flex-col gap-3">
//                                             <button className="flex items-center justify-center gap-2 bg-[#C9A94D] text-white font-semibold py-3 px-6 rounded-[10px] hover:bg-[#b8973e] transition-colors shadow-sm">
//                                                 <SquarePen className="w-5 h-5" />
//                                                 Edit
//                                             </button>
//                                             <button className="flex items-center justify-center gap-2 bg-[#C9A94D] text-white font-semibold py-3 px-6 rounded-[10px] hover:bg-[#b8973e] transition-colors shadow-sm">
//                                                 <Trash2 className="w-5 h-5" />
//                                                 Delete
//                                             </button>
//                                         </div>
//                                     </div>
//                                 ))}
//                             </div>
//                         </TabsContent>
//                     </Tabs>
//                     <div className="mt-5">
//                         <Link href="/dashboard/memberships/add">
//                             <button className="flex items-center gap-2 bg-[#C9A94D] text-white font-semibold py-3 px-20 rounded-[10px] hover:bg-[#b8973e] transition-colors shadow-sm">
//                                 <SquarePen className="w-5 h-5" />
//                                 Add
//                             </button>
//                         </Link>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default MemberShip;

"use client";
import React, { useState } from "react";
import { SquarePen, Trash2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import { useAppSelector } from "@/redux/hooks";
import { currentUser } from "@/redux/features/auth/authSlice";
import { useGetAllSubscriptionsQuery, useGetSubscriptionsByTypeQuery, useDeleteSubscriptionMutation, useToggleSubscriptionStatusMutation } from "@/redux/features/subscription/subscriptionApi";
import { toast } from "sonner";

const MemberShip = () => {
    const mainuser = useAppSelector(currentUser);
    const [activeTab, setActiveTab] = useState<"GUEST" | "HOST">("GUEST");

    // Fetch all subscriptions
    const {
        data: subscriptionsData,
        isLoading,
        refetch,
    } = useGetAllSubscriptionsQuery({
        type: activeTab,
        isActive: "true",
    });

    // Fetch subscriptions by type for better organization
    const { data: guestSubscriptions } = useGetSubscriptionsByTypeQuery("GUEST");
    const { data: hostSubscriptions } = useGetSubscriptionsByTypeQuery("HOST");
    console.log(guestSubscriptions);

    // Mutations
    const [deleteSubscription] = useDeleteSubscriptionMutation();
    const [toggleStatus] = useToggleSubscriptionStatusMutation();

    const subscriptions = subscriptionsData?.data || [];
    const guestPlans = guestSubscriptions || [];
    const hostPlans = hostSubscriptions || [];

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

        try {
            await deleteSubscription(id).unwrap();
            toast.success("Subscription deleted successfully");
            refetch();
        } catch (error) {
            console.error("Delete failed:", error);
            toast.error("Failed to delete subscription");
        }
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

    const formatBookingFee = (bookingFee: number | string) => {
        if (typeof bookingFee === "number") {
            return bookingFee === 0 ? "£0" : `${bookingFee}%`;
        }
        return bookingFee;
    };

    const renderPlanCard = (plan: any) => (
        <div key={plan._id} className="bg-[#2D3546] border border-[#2D3546] hover:bg-transparent hover:border-[#af8d28] p-6 rounded-[16px] flex flex-col justify-between">
            {/* Plan Info */}
            <div>
                <div className="flex justify-between items-start mb-2">
                    <h2 className="text-[18px]">{plan.name}</h2>
                    {plan.badge && <span className="bg-[#C9A94D] text-white text-xs px-2 py-1 rounded-full">{plan.badge}</span>}
                </div>

                <p className="mb-2 text-sm text-gray-300">
                    Booking Fee: {formatBookingFee(plan.bookingFee)}
                    {plan.commission !== undefined && ` | Commission: ${plan.commission}%`}
                    {plan.bookingLimit && ` | Max ${plan.bookingLimit} bookings`}
                </p>

                <p className="text-[33px] font-bold mb-4">{formatPrice(plan.cost, plan.currency, plan.billingPeriod)}</p>

                <p className="text-sm text-gray-300 mb-4">{plan.description}</p>

                <ul className="list-disc list-outside ml-4 mb-6 space-y-1 text-[14px]">
                    {plan.perks.slice(0, 5).map((benefit: string, i: number) => (
                        <li key={i}>{benefit}</li>
                    ))}
                    {plan.perks.length > 5 && <li className="text-[#C9A94D]">+{plan.perks.length - 5} more benefits</li>}
                </ul>
            </div>

            {/* Bottom Action buttons */}
            <div className="flex mt-4 flex-col gap-3">
                <Link href={`/dashboard/memberships/edit/${plan._id}`}>
                    <button className="flex items-center justify-center gap-2 bg-[#C9A94D] text-white font-semibold py-3 px-6 rounded-[10px] hover:bg-[#b8973e] transition-colors shadow-sm w-full">
                        <SquarePen className="w-5 h-5" />
                        Edit
                    </button>
                </Link>

                <div className="flex gap-2">
                    <button onClick={() => handleToggleStatus(plan._id, plan.name, plan.isActive)} className={`flex-1 py-2 px-4 rounded-[10px] font-semibold transition-colors ${plan.isActive ? "bg-green-600 hover:bg-green-700 text-white" : "bg-gray-600 hover:bg-gray-700 text-white"}`}>
                        {plan.isActive ? "Active" : "Inactive"}
                    </button>

                    <button onClick={() => handleDelete(plan._id, plan.name)} className="flex items-center justify-center gap-2 bg-red-600 text-white font-semibold py-2 px-4 rounded-[10px] hover:bg-red-700 transition-colors">
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>

                {/* Stripe Info */}
                <div className="mt-2 text-xs text-gray-400">
                    <p>Stripe: {plan.stripeProductId ? "Connected" : "Not connected"}</p>
                    {plan.paymentLink && plan.paymentLink !== "free_tier" && (
                        <a href={plan.paymentLink} target="_blank" rel="noopener noreferrer" className="text-[#C9A94D] hover:underline">
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

    return (
        <div className="container mx-auto">
            <PageHeader title="Memberships" />

            <div className="text-[#C9A94D]">
                <div className="mb-8 flex justify-between flex-col md:flex-row gap-4">
                    <div>
                        <h1 className="font-bold text-[30px] mb-4">Admin Dashboard</h1>
                        <p>Welcome back, {mainuser?.name}! Manage your subscription plans.</p>
                    </div>

                    <div className="text-sm text-gray-300">
                        <p>Total Plans: {subscriptions.length}</p>
                        <p>Active: {subscriptions.filter((s: any) => s.isActive).length}</p>
                    </div>
                </div>

                <div className="text-[#C9A94D]">
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
