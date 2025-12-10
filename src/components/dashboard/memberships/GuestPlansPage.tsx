// import React, { useState } from "react";
// import { useGetSubscriptionsByTypeQuery, useCreateCheckoutSessionMutation } from "@/redux/features/subscription/subscriptionApi";
// import { ISubscription } from "@/redux/features/subscription/subscriptionApi";
// import { ChevronDown, ChevronUp } from "lucide-react";
// import { useGetAllMySubscriptionsQuery, useActivateFreeTierMutation } from "@/redux/features/users/usersApi";
// import PageHeader from "@/components/PageHeader";

// const GuestPlansPage = () => {
//     const { data: guestSubscriptions, isLoading, error } = useGetSubscriptionsByTypeQuery("GUEST");
//     const { data: userSubscribedResponse, isLoading: isUserLoading, error: userError } = useGetAllMySubscriptionsQuery();
//     const [createCheckoutSession, { isLoading: isCreatingCheckout }] = useCreateCheckoutSessionMutation();
//     const [activateFreeTier, { isLoading: isActivatingFreeTier }] = useActivateFreeTierMutation();
//     const [expandedPlan, setExpandedPlan] = useState<string | null>(null);

//     // Type assertion to handle the actual response structure
//     const userSubscriptionsData = (userSubscribedResponse as any)?.data;

//     console.log("User subscribed response:", userSubscribedResponse);

//     const formatPrice = (cost: number, currency: string, billingPeriod: string) => {
//         const currencySymbol = currency === "gbp" ? "£" : currency === "usd" ? "$" : currency === "eur" ? "€" : currency;
//         const period = billingPeriod === "monthly" ? "/month" : billingPeriod === "annual" ? "/year" : "";
//         return `${currencySymbol}${cost}${period}`;
//     };

//     const formatBookingFee = (bookingFee: string | number | undefined) => {
//         if (bookingFee === undefined) return "Not set";
//         if (typeof bookingFee === "number") {
//             return bookingFee === 0 ? "0%" : `${bookingFee}%`;
//         }
//         return bookingFee;
//     };

//     const toggleExpand = (planId: string) => {
//         setExpandedPlan(expandedPlan === planId ? null : planId);
//     };

//     // Check if user is subscribed to a specific plan
//     const isUserSubscribedToPlan = (planId: string) => {
//         if (!userSubscriptionsData?.subscriptions) return false;

//         return userSubscriptionsData.subscriptions.some((sub: any) => {
//             const subscriptionData = sub.subscription;
//             // Add null check for subscriptionData
//             if (!subscriptionData) return false;

//             const subscriptionId = subscriptionData.subscription;
//             // Add null check for subscriptionId and other required fields
//             if (!subscriptionId || !subscriptionData.status || !subscriptionData.currentPeriodEnd) return false;

//             return subscriptionId === planId && subscriptionData.status === "active" && new Date(subscriptionData.currentPeriodEnd) > new Date();
//         });
//     };

//     // Get subscription status for a specific plan
//     const getSubscriptionStatus = (planId: string) => {
//         if (!userSubscriptionsData?.subscriptions) return null;

//         const userSubscription = userSubscriptionsData.subscriptions.find((sub: any) => {
//             const subscriptionData = sub.subscription;
//             // Add null check for subscriptionData
//             if (!subscriptionData) return false;

//             const subscriptionId = subscriptionData.subscription;
//             // Add null check for subscriptionId
//             if (!subscriptionId) return false;

//             return subscriptionId === planId;
//         });

//         if (!userSubscription) return null;

//         const subscriptionData = userSubscription.subscription;
//         // Add null check for subscriptionData and its properties
//         if (!subscriptionData || !subscriptionData.status || !subscriptionData.currentPeriodEnd) return null;

//         const isActive = subscriptionData.status === "active" && new Date(subscriptionData.currentPeriodEnd) > new Date();

//         return {
//             status: subscriptionData.status,
//             currentPeriodEnd: subscriptionData.currentPeriodEnd,
//             isActive: isActive,
//         };
//     };

//     const handleSubscribe = async (plan: ISubscription) => {
//         try {
//             // For free tiers, handle differently
//             if (plan.cost === 0 || plan.paymentLink.startsWith("free-tier-")) {
//                 console.log("Free tier selected:", plan.name);

//                 // Activate free tier
//                 try {
//                     const result = await activateFreeTier({
//                         subscriptionId: plan._id!,
//                     }).unwrap();

//                     console.log(result);

//                     if (result.success) {
//                         console.log("Free tier activated successfully:", result.data);
//                         window.location.href = `/${plan.paymentLink}`;
//                     } else {
//                         alert(result.message || "Failed to activate free tier");
//                     }
//                 } catch (activationError: any) {
//                     console.error("Free tier activation error:", activationError);
//                     alert(activationError?.data?.message || "Failed to activate free tier");
//                 }
//                 return;
//             }

//             // For paid subscriptions, create checkout session
//             const result = await createCheckoutSession({
//                 subscriptionId: plan._id!,
//             }).unwrap();

//             // Redirect to Stripe checkout
//             window.location.href = result.data.url;
//         } catch (error: any) {
//             console.error("Failed to create checkout session:", error);
//             // Handle error (show toast, etc.)
//             alert(error?.data?.message || "Failed to process subscription");
//         }
//     };

//     if (isLoading) {
//         return (
//             <div className="flex justify-center items-center h-64">
//                 <div className="text-[#C9A94D]">Loading guest plans...</div>
//             </div>
//         );
//     }

//     if (error) {
//         return (
//             <div className="flex justify-center items-center h-64">
//                 <div className="text-red-500">Failed to load guest plans</div>
//             </div>
//         );
//     }

//     const plans = guestSubscriptions || [];

//     return (
//         <div>
//             <PageHeader title="Guest Memberships"></PageHeader>
//             <div className="text-[#C9A94D]">
//                 <div className="border border-[#C9A94D] rounded-[20px] p-5">
//                     <h1 className="text-2xl md:text-[40px] mb-4">Guest Memberships (Stayers)</h1>
//                     <p className="mb-6">Unlock perks, protection, and peace of mind.</p>

//                     {(isCreatingCheckout || isActivatingFreeTier) && (
//                         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//                             <div className="bg-[#2D3546] p-6 rounded-lg border border-[#C9A94D]">
//                                 <div className="text-[#C9A94D] text-center">
//                                     <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C9A94D] mx-auto mb-4"></div>
//                                     <p>{isActivatingFreeTier ? "Activating free tier..." : "Redirecting to checkout..."}</p>
//                                 </div>
//                             </div>
//                         </div>
//                     )}

//                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                         {plans.map((plan: ISubscription) => {
//                             const subscriptionStatus = getSubscriptionStatus(plan._id!);
//                             const isSubscribed = isUserSubscribedToPlan(plan._id!);
//                             const isProcessing = isCreatingCheckout || isActivatingFreeTier;

//                             return (
//                                 <div key={plan._id} className="bg-[#2D3546] border border-[#2D3546] hover:bg-transparent hover:border-[#af8d28] p-6 rounded-[16px] flex flex-col justify-between">
//                                     {/* Plan Header */}
//                                     <div>
//                                         <h2 className="text-[18px] mb-2 text-center">{plan.name}</h2>
//                                         <p className="mb-4 text-center">
//                                             {plan.bookingFee !== undefined && plan.bookingFee !== null
//                                                 ? plan.bookingLimit
//                                                     ? plan.bookingFee === 0
//                                                         ? `Booking Fee: 0% (up to ${plan.bookingLimit} booking${plan.bookingLimit > 1 ? "s" : ""})`
//                                                         : `Booking Fee: ${formatBookingFee(plan.bookingFee)} after ${plan.bookingLimit} booking${plan.bookingLimit > 1 ? "s" : ""}`
//                                                     : `Booking Fee: ${formatBookingFee(plan.bookingFee)}`
//                                                 : "Booking Fee: Not set"}
//                                         </p>

//                                         <p className="text-[33px] font-bold mb-4 text-center">{formatPrice(plan.cost, plan.currency, plan.billingPeriod)}</p>

//                                         <p className="text-sm  mb-4">{plan.description}</p>

//                                         {/* Benefits - Expandable */}
//                                         <div className="mb-4">
//                                             <ul className="list-disc list-outside ml-4 space-y-1 text-[14px]">
//                                                 {plan.features.slice(0, 5).map((feature, index) => (
//                                                     <li key={index}>{feature.name}</li>
//                                                 ))}

//                                                 {/* Show remaining features when expanded */}
//                                                 {expandedPlan === plan._id && plan.features.slice(5).map((feature, index) => <li key={index + 5}>{feature.name}</li>)}
//                                             </ul>

//                                             {/* Expand/Collapse Button */}
//                                             {plan.features.length > 5 && (
//                                                 <button onClick={() => toggleExpand(plan._id!)} className="flex items-center justify-center gap-1 w-full mt-3 text-[#C9A94D] hover:text-[#af8d28] transition-colors text-sm">
//                                                     {expandedPlan === plan._id ? (
//                                                         <>
//                                                             Show Less <ChevronUp className="w-4 h-4" />
//                                                         </>
//                                                     ) : (
//                                                         <>
//                                                             +{plan.features.length - 5} more benefits <ChevronDown className="w-4 h-4" />
//                                                         </>
//                                                     )}
//                                                 </button>
//                                             )}
//                                         </div>
//                                     </div>

//                                     {/* Conditional Button */}
//                                     {isSubscribed ? (
//                                         <div className="text-center">
//                                             <button className="bg-[#C9A94D] text-white font-bold py-3 rounded-lg border border-[#C9A94D] w-full cursor-default" disabled>
//                                                 Currently Active
//                                             </button>
//                                             {subscriptionStatus?.currentPeriodEnd && <p className="text-xs mt-2 text-gray-400">Renews on {new Date(subscriptionStatus.currentPeriodEnd).toLocaleDateString()}</p>}
//                                         </div>
//                                     ) : userSubscriptionsData?.freeTireUsed && userSubscriptionsData?.freeTireExpiry && new Date(userSubscriptionsData.freeTireExpiry) > new Date() && plan.cost === 0 ? (
//                                         <div className="text-center">
//                                             <button className="bg-[#C9A94D] text-white font-bold py-3 rounded-lg border border-[#C9A94D] w-full cursor-default" disabled>
//                                                 Free Tier Active
//                                             </button>
//                                             {userSubscriptionsData.freeTireExpiry && <p className="text-xs mt-2 text-gray-400">Expires on {new Date(userSubscriptionsData.freeTireExpiry).toLocaleDateString()}</p>}
//                                         </div>
//                                     ) : subscriptionStatus ? (
//                                         <button className="bg-gray-600 text-gray-300 font-bold py-3 rounded-lg border border-gray-600 w-full cursor-not-allowed" disabled>
//                                             {subscriptionStatus.status === "canceled" ? "Subscription Canceled" : "Subscription Expired"}
//                                         </button>
//                                     ) : (
//                                         <button className={`bg-transparent text-[#C9A94D] font-bold py-3 rounded-lg transition-all border border-[#C9A94D] ${plan.cost === 0 ? "hover:bg-[#C9A94D] hover:text-white" : "hover:bg-[#C9A94D] hover:text-white"} ${isProcessing ? "opacity-50 cursor-not-allowed" : ""}`} onClick={() => handleSubscribe(plan)} disabled={isProcessing}>
//                                             {isProcessing ? (
//                                                 <div className="flex items-center justify-center gap-2">
//                                                     <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
//                                                     {isActivatingFreeTier ? "Activating..." : "Processing..."}
//                                                 </div>
//                                             ) : plan.cost === 0 ? (
//                                                 "Get Started Free"
//                                             ) : (
//                                                 "Subscribe Now"
//                                             )}
//                                         </button>
//                                     )}
//                                 </div>
//                             );
//                         })}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default GuestPlansPage;

import React, { useState } from "react";
import { useGetSubscriptionsByTypeQuery, useCreateCheckoutSessionMutation } from "@/redux/features/subscription/subscriptionApi";
import { ISubscription } from "@/redux/features/subscription/subscriptionApi";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useGetAllMySubscriptionsQuery, useActivateFreeTierMutation } from "@/redux/features/users/usersApi";
import PageHeader from "@/components/PageHeader";
import { useCancelSubscriptionMutation } from "@/redux/features/subscribed/subscribedApi";
import Swal from "sweetalert2";

const GuestPlansPage = () => {
    const { data: guestSubscriptions, isLoading, error } = useGetSubscriptionsByTypeQuery("GUEST");
    const { data: userSubscribedResponse, refetch, isLoading: isUserLoading, error: userError } = useGetAllMySubscriptionsQuery();
    const [createCheckoutSession, { isLoading: isCreatingCheckout }] = useCreateCheckoutSessionMutation();
    const [activateFreeTier, { isLoading: isActivatingFreeTier }] = useActivateFreeTierMutation();
    const [cancelSubscription, { isLoading: isCancelling }] = useCancelSubscriptionMutation();
    const [expandedPlan, setExpandedPlan] = useState<string | null>(null);

    console.log(userSubscribedResponse);

    // Get current subscription data - using same structure as HostPlansPage
    const userData = userSubscribedResponse?.data;
    const currentSubscription = userData?.currentSubscription;
    const isCurrentSubscriptionActive = currentSubscription?.status === "active" && new Date(currentSubscription.currentPeriodEnd) > new Date();

    console.log("User subscription data:", userSubscribedResponse);
    console.log("Current subscription:", currentSubscription);

    const formatPrice = (cost: number, currency: string, billingPeriod: string) => {
        const currencySymbol = currency === "gbp" ? "£" : currency === "usd" ? "$" : currency === "eur" ? "€" : currency;
        const period = billingPeriod === "monthly" ? "/month" : billingPeriod === "annual" ? "/year" : "";
        return `${currencySymbol}${cost}${period}`;
    };

    const formatBookingFee = (bookingFee: string | number | undefined) => {
        if (bookingFee === undefined) return "Not set";
        if (typeof bookingFee === "number") {
            return bookingFee === 0 ? "0%" : `${bookingFee}%`;
        }
        return bookingFee;
    };

    const toggleExpand = (planId: string) => {
        setExpandedPlan(expandedPlan === planId ? null : planId);
    };

    const isUserSubscribedToPlan = (planId: string) => {
        // Check if this is the current subscription - same logic as HostPlansPage
        if (currentSubscription?.subscription === planId) {
            return isCurrentSubscriptionActive;
        }
        return false;
    };

    // Get subscription status for a specific plan
    const getSubscriptionStatus = (planId: string) => {
        if (currentSubscription?.subscription === planId) {
            return {
                status: currentSubscription.status,
                currentPeriodEnd: currentSubscription.currentPeriodEnd,
                isActive: isCurrentSubscriptionActive,
            };
        }
        return null;
    };

    const handleSubscribe = async (plan: ISubscription) => {
        try {
            if (plan.cost === 0 || plan.paymentLink.startsWith("free-tier-")) {
                try {
                    const result = await activateFreeTier({
                        subscriptionId: plan._id!,
                    }).unwrap();
                    if (result.success) {
                        console.log("Free tier activated successfully:", result.data);
                        window.location.href = `/${plan.paymentLink}`;
                    } else {
                        alert(result.message || "Failed to activate free tier");
                    }
                } catch (activationError: any) {
                    console.error("Free tier activation error:", activationError);
                    alert(activationError?.data?.message || "Failed to activate free tier");
                }
                return;
            }
            const result = await createCheckoutSession({
                subscriptionId: plan._id!,
            }).unwrap();
            window.location.href = result.data.url;
        } catch (error: any) {
            console.error("Failed to create checkout session:", error);
        }
    };

    const handleCancelSubscription = async () => {
        try {
            if (!currentSubscription?._id) {
                Swal.fire({
                    title: "Error!",
                    text: "No active subscription found",
                    icon: "error",
                    confirmButtonColor: "#C9A94D",
                    confirmButtonText: "OK",
                    background: "#2D3546",
                    color: "#FFFFFF",
                    customClass: {
                        popup: "border border-[#C9A94D] rounded-[20px]",
                        title: "text-[#C9A94D]",
                        htmlContainer: "text-gray-300",
                        confirmButton: "bg-[#C9A94D] hover:bg-[#b8973e] text-white font-medium py-2 px-6 rounded-lg transition",
                        icon: "text-[#C9A94D]",
                    },
                    buttonsStyling: false,
                });
                return;
            }

            const result = await Swal.fire({
                title: "Are you sure?",
                text: "Do you want to cancel your current subscription?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#C9A94D",
                cancelButtonColor: "#434D64",
                confirmButtonText: "Yes, cancel it!",
                cancelButtonText: "No, keep it",
                background: "#2D3546",
                color: "#FFFFFF",
                customClass: {
                    popup: "border border-[#C9A94D] rounded-[20px]",
                    title: "text-[#C9A94D]",
                    htmlContainer: "text-gray-300",
                    confirmButton: "bg-[#C9A94D] hover:bg-[#b8973e] text-white font-medium py-2 px-6 rounded-lg transition",
                    cancelButton: "bg-[#434D64] hover:bg-[#535a6b] text-white font-medium py-2 px-6 rounded-lg transition",
                    icon: "text-[#C9A94D]",
                    actions: "gap-3 mt-4",
                },
                buttonsStyling: false,
                reverseButtons: true,
            });

            if (result.isConfirmed) {
                await cancelSubscription(currentSubscription._id).unwrap();
                refetch();

                Swal.fire({
                    title: "Cancelled!",
                    text: "Your subscription has been cancelled.",
                    icon: "success",
                    confirmButtonColor: "#C9A94D",
                    confirmButtonText: "OK",
                    background: "#2D3546",
                    color: "#FFFFFF",
                    customClass: {
                        popup: "border border-[#C9A94D] rounded-[20px]",
                        title: "text-[#C9A94D]",
                        htmlContainer: "text-gray-300",
                        confirmButton: "bg-[#C9A94D] hover:bg-[#b8973e] text-white font-medium py-2 px-6 rounded-lg transition",
                        icon: "text-[#C9A94D]",
                    },
                    buttonsStyling: false,
                });
            }
        } catch (error: any) {
            Swal.fire({
                title: "Error!",
                text: error?.data?.message || "Failed to cancel subscription",
                icon: "error",
                confirmButtonColor: "#C9A94D",
                confirmButtonText: "OK",
                background: "#2D3546",
                color: "#FFFFFF",
                customClass: {
                    popup: "border border-[#C9A94D] rounded-[20px]",
                    title: "text-[#C9A94D]",
                    htmlContainer: "text-gray-300",
                    confirmButton: "bg-[#C9A94D] hover:bg-[#b8973e] text-white font-medium py-2 px-6 rounded-lg transition",
                    icon: "text-[#C9A94D]",
                },
                buttonsStyling: false,
            });
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-[#C9A94D]">Loading guest plans...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-red-500">Failed to load guest plans</div>
            </div>
        );
    }

    const plans = guestSubscriptions || [];

    return (
        <div>
            <PageHeader title="Guest Memberships"></PageHeader>
            <div className="text-[#C9A94D]">
                <div className="border border-[#C9A94D] rounded-[20px] p-5">
                    <h1 className="text-2xl md:text-[40px] mb-4">Guest Memberships (Stayers)</h1>
                    <p className="mb-6">Unlock perks, protection, and peace of mind.</p>

                    {(isCreatingCheckout || isActivatingFreeTier) && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                            <div className="bg-[#2D3546] p-6 rounded-lg border border-[#C9A94D]">
                                <div className="text-[#C9A94D] text-center">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C9A94D] mx-auto mb-4"></div>
                                    <p>{isActivatingFreeTier ? "Activating free tier..." : "Redirecting to checkout..."}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {plans.map((plan: ISubscription) => {
                            const subscriptionStatus = getSubscriptionStatus(plan._id!);
                            const isSubscribed = isUserSubscribedToPlan(plan._id!);
                            const isProcessing = isCreatingCheckout || isActivatingFreeTier;
                            const isCurrentPlan = currentSubscription?.subscription === plan._id;

                            return (
                                <div key={plan._id} className={`bg-[#2D3546] border p-6 rounded-[16px] flex flex-col justify-between ${isCurrentPlan ? "border-[#C9A94D] border-2" : "border-[#2D3546] hover:border-[#af8d28]"}`}>
                                    {/* Plan Header */}
                                    <div>
                                        <h2 className="text-[18px] mb-2 text-center">{plan.name}</h2>

                                        {/* <p className="mb-4 text-center">
                                            {plan.bookingFee !== undefined && plan.bookingFee !== null
                                                ? plan.bookingLimit
                                                    ? plan.bookingFee === 0
                                                        ? `Booking Fee: 0% (up to ${plan.bookingLimit} booking${plan.bookingLimit > 1 ? "s" : ""})`
                                                        : `Booking Fee: ${formatBookingFee(plan.bookingFee)} after ${plan.bookingLimit} booking${plan.bookingLimit > 1 ? "s" : ""}`
                                                    : `Booking Fee: ${formatBookingFee(plan.bookingFee)}`
                                                : "Booking Fee: Not set"}
                                        </p> */}
                                        <p className="mb-4 text-center">
                                            {plan.bookingFee !== undefined && plan.bookingFee !== null ? (plan.bookingLimit ? (plan.bookingFee === 0 ? `Booking Fee: 0% | Unlimited free bookings` : `Booking Fee: ${formatBookingFee(plan.bookingFee)} after ${plan.bookingLimit} booking${plan.bookingLimit > 1 ? "s" : ""}`) : `Booking Fee: ${formatBookingFee(plan.bookingFee)}`) : "Booking Fee: Not set"}
                                        </p>

                                        <p className="text-[33px] font-bold mb-4 text-center">{formatPrice(plan.cost, plan.currency, plan.billingPeriod)}</p>

                                        <p className="text-sm mb-4">{plan.description}</p>

                                        {/* Benefits - Expandable */}
                                        <div className="mb-4">
                                            <ul className="list-disc list-outside ml-4 space-y-1 text-[14px]">
                                                {plan.features.slice(0, 5).map((feature, index) => (
                                                    <li key={index}>{feature.name}</li>
                                                ))}
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
                                                            +{plan.features.length - 5} more benefits <ChevronDown className="w-4 h-4" />
                                                        </>
                                                    )}
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    {isSubscribed ? (
                                        // --- Current Active Subscription ---
                                        // <div className="text-center">
                                        //     <button className="bg-[#C9A94D] text-white font-bold py-3 rounded-lg border border-[#C9A94D] w-full cursor-default" disabled>
                                        //         Currently Active
                                        //     </button>
                                        //     <button onClick={() => handleCancelSubscription()} disabled={isCancelling} className="bg-red-600 text-white font-bold py-2 px-4 mt-2 rounded-lg hover:bg-red-700 transition-colors w-full">
                                        //         {isCancelling ? (
                                        //             <div className="flex items-center justify-center gap-2">
                                        //                 <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                        //                 Cancelling...
                                        //             </div>
                                        //         ) : (
                                        //             "Cancel Subscription"
                                        //         )}
                                        //     </button>

                                        //     {subscriptionStatus?.currentPeriodEnd && <p className="text-xs mt-2 text-gray-400">Renews on {new Date(subscriptionStatus.currentPeriodEnd).toLocaleDateString()}</p>}
                                        // </div>
                                        <div className="text-center">
                                            <button className="bg-[#C9A94D]/20 text-[#C9A94D] font-medium py-3 rounded-lg border border-[#C9A94D] w-full cursor-default" disabled>
                                                Currently Active
                                            </button>
                                            <button onClick={() => handleCancelSubscription()} disabled={isCancelling} className="bg-transparent text-red-500 font-medium py-3 mt-3 rounded-lg border border-red-500 hover:bg-red-500/10 transition-colors w-full">
                                                {isCancelling ? (
                                                    <div className="flex items-center justify-center gap-2">
                                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-500"></div>
                                                        Cancelling...
                                                    </div>
                                                ) : (
                                                    "Cancel Subscription"
                                                )}
                                            </button>

                                            {subscriptionStatus?.currentPeriodEnd && <p className="text-xs mt-3 text-gray-400">Renews on {new Date(subscriptionStatus.currentPeriodEnd).toLocaleDateString()}</p>}
                                        </div>
                                    ) : userData?.freeTireUsed && userData?.freeTireExpiry && new Date(userData.freeTireExpiry) > new Date() && plan.cost === 0 ? (
                                        <div className="text-center">
                                            <button className="bg-[#C9A94D]/30 text-[#C9A94D] py-3 rounded-lg border border-[#C9A94D] w-full cursor-default" disabled>
                                                Free Tier Active
                                            </button>
                                        </div>
                                    ) : userData?.freeTireUsed && plan.cost === 0 ? (
                                        <div className="text-center">
                                            <button className="bg-gray-600 text-gray-300 font-bold py-3 rounded-lg border border-gray-600 w-full cursor-not-allowed" disabled>
                                                Free Tier Expired
                                            </button>
                                        </div>
                                    ) : (
                                        <button className={`bg-transparent text-[#C9A94D] font-bold py-3 rounded-lg transition-all border border-[#C9A94D] ${plan.cost === 0 ? "hover:bg-[#C9A94D] hover:text-white" : "hover:bg-[#C9A94D] hover:text-white"} ${isProcessing ? "opacity-50 cursor-not-allowed" : ""}`} onClick={() => handleSubscribe(plan)} disabled={isProcessing}>
                                            {isProcessing ? (
                                                <div className="flex items-center justify-center gap-2">
                                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                                                    {isActivatingFreeTier ? "Activating..." : "Processing..."}
                                                </div>
                                            ) : plan.cost === 0 ? (
                                                "Get Started Free"
                                            ) : (
                                                "Subscribe Now"
                                            )}
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GuestPlansPage;
