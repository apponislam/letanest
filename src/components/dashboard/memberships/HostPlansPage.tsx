// import React, { useState } from "react";
// import { useGetSubscriptionsByTypeQuery } from "@/redux/features/subscription/subscriptionApi";
// import { ISubscription } from "@/redux/features/subscription/subscriptionApi";
// import { ChevronDown, ChevronUp } from "lucide-react";

// const HostPlansPage = () => {
//     const { data: hostSubscriptions, isLoading, error } = useGetSubscriptionsByTypeQuery("HOST");
//     const [expandedPlan, setExpandedPlan] = useState<string | null>(null);

//     const formatPrice = (cost: number, currency: string, billingPeriod: string) => {
//         const currencySymbol = currency === "gbp" ? "£" : currency === "usd" ? "$" : currency === "eur" ? "€" : currency;
//         const period = billingPeriod === "monthly" ? "/month" : billingPeriod === "annual" ? "/year" : "";
//         return `${currencySymbol}${cost}${period}`;
//     };

//     const formatCommission = (commission: string | number | undefined) => {
//         if (commission === undefined) return "Not set";
//         if (typeof commission === "number") {
//             return commission === 0 ? "0%" : `${commission}%`;
//         }
//         return commission;
//     };

//     const toggleExpand = (planId: string) => {
//         setExpandedPlan(expandedPlan === planId ? null : planId);
//     };

//     if (isLoading) {
//         return (
//             <div className="flex justify-center items-center h-64">
//                 <div className="text-[#C9A94D]">Loading host plans...</div>
//             </div>
//         );
//     }

//     if (error) {
//         return (
//             <div className="flex justify-center items-center h-64">
//                 <div className="text-red-500">Failed to load host plans</div>
//             </div>
//         );
//     }

//     const plans = hostSubscriptions || [];

//     return (
//         <div className="text-[#C9A94D]">
//             <div className="border border-[#C9A94D] rounded-[20px] p-5">
//                 <h1 className="text-2xl md:text-[40px] mb-4">Host Subscriptions (Nest Series)</h1>
//                 <p className="mb-6">Maximize your earnings and grow your hosting business.</p>

//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                     {plans.map((plan: ISubscription) => (
//                         <div key={plan._id} className="bg-[#2D3546] border border-[#2D3546] hover:bg-transparent hover:border-[#af8d28] p-6 rounded-[16px] flex flex-col justify-between">
//                             {/* Plan Header */}
//                             <div>
//                                 <h2 className="text-[18px] mb-2 text-center">{plan.name}</h2>

//                                 <p className="mb-4 text-center">
//                                     {plan.commission !== undefined && `Commission: ${formatCommission(plan.commission)} per booking`}
//                                     {plan.freeBookings && ` (${plan.freeBookings} free bookings)`}
//                                     {plan.listingLimit && ` | ${plan.listingLimit === 999 ? "Unlimited" : plan.listingLimit} active listings`}
//                                 </p>

//                                 <p className="text-[33px] font-bold mb-4 text-center">{formatPrice(plan.cost, plan.currency, plan.billingPeriod)}</p>

//                                 {/* Benefits - Expandable */}
//                                 <div className="mb-4">
//                                     <ul className="list-disc list-outside ml-4 space-y-1 text-[14px]">
//                                         {plan.features.slice(0, 5).map((feature, index) => (
//                                             <li key={index}>{feature.name}</li>
//                                         ))}

//                                         {/* Show remaining features when expanded */}
//                                         {expandedPlan === plan._id && plan.features.slice(5).map((feature, index) => <li key={index + 5}>{feature.name}</li>)}
//                                     </ul>

//                                     {/* Expand/Collapse Button */}
//                                     {plan.features.length > 5 && (
//                                         <button onClick={() => toggleExpand(plan._id!)} className="flex items-center justify-center gap-1 w-full mt-3 text-[#C9A94D] hover:text-[#af8d28] transition-colors text-sm">
//                                             {expandedPlan === plan._id ? (
//                                                 <>
//                                                     Show Less <ChevronUp className="w-4 h-4" />
//                                                 </>
//                                             ) : (
//                                                 <>
//                                                     +{plan.features.length - 5} more benefits <ChevronDown className="w-4 h-4" />
//                                                 </>
//                                             )}
//                                         </button>
//                                     )}
//                                 </div>
//                             </div>

//                             {/* Get Started Button */}
//                             <button
//                                 className="bg-transparent text-[#C9A94D] font-bold py-3 rounded-lg hover:bg-[#C9A94D] transition-all border border-[#C9A94D] hover:text-white"
//                                 onClick={() => {
//                                     if (plan.paymentLink && plan.paymentLink !== "free_tier") {
//                                         window.open(plan.paymentLink, "_blank");
//                                     } else {
//                                         // Handle free tier subscription
//                                         console.log("Free tier selected");
//                                     }
//                                 }}
//                             >
//                                 {plan.cost === 0 ? "Get Started Free" : "Subscribe Now"}
//                             </button>
//                         </div>
//                     ))}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default HostPlansPage;

import React, { useState } from "react";
import { useGetSubscriptionsByTypeQuery, useCreateCheckoutSessionMutation } from "@/redux/features/subscription/subscriptionApi";
import { ISubscription } from "@/redux/features/subscription/subscriptionApi";
import { ChevronDown, ChevronUp } from "lucide-react";

const HostPlansPage = () => {
    const { data: hostSubscriptions, isLoading, error } = useGetSubscriptionsByTypeQuery("HOST");
    const [createCheckoutSession, { isLoading: isCreatingCheckout }] = useCreateCheckoutSessionMutation();
    const [expandedPlan, setExpandedPlan] = useState<string | null>(null);

    const formatPrice = (cost: number, currency: string, billingPeriod: string) => {
        const currencySymbol = currency === "gbp" ? "£" : currency === "usd" ? "$" : currency === "eur" ? "€" : currency;
        const period = billingPeriod === "monthly" ? "/month" : billingPeriod === "annual" ? "/year" : "";
        return `${currencySymbol}${cost}${period}`;
    };

    const formatCommission = (commission: string | number | undefined) => {
        if (commission === undefined) return "Not set";
        if (typeof commission === "number") {
            return commission === 0 ? "0%" : `${commission}%`;
        }
        return commission;
    };

    const toggleExpand = (planId: string) => {
        setExpandedPlan(expandedPlan === planId ? null : planId);
    };

    const handleSubscribe = async (plan: ISubscription) => {
        try {
            // For free tiers, handle differently
            if (plan.cost === 0 || plan.paymentLink.startsWith("free-tier-")) {
                console.log("Free tier selected:", plan.name);
                // TODO: Implement free tier activation logic
                return;
            }

            // For paid subscriptions, create checkout session
            const result = await createCheckoutSession({
                subscriptionId: plan._id!,
            }).unwrap();

            // Redirect to Stripe checkout
            window.location.href = result.data.url;
        } catch (error: any) {
            console.error("Failed to create checkout session:", error);
            // Handle error (show toast, etc.)
            alert(error?.data?.message || "Failed to create checkout session");
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-[#C9A94D]">Loading host plans...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-red-500">Failed to load host plans</div>
            </div>
        );
    }

    const plans = hostSubscriptions || [];

    return (
        <div className="text-[#C9A94D]">
            <div className="border border-[#C9A94D] rounded-[20px] p-5">
                <h1 className="text-2xl md:text-[40px] mb-4">Host Subscriptions (Nest Series)</h1>
                <p className="mb-6">Maximize your earnings and grow your hosting business.</p>

                {isCreatingCheckout && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-[#2D3546] p-6 rounded-lg border border-[#C9A94D]">
                            <div className="text-[#C9A94D] text-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C9A94D] mx-auto mb-4"></div>
                                <p>Redirecting to checkout...</p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {plans.map((plan: ISubscription) => (
                        <div key={plan._id} className="bg-[#2D3546] border border-[#2D3546] hover:bg-transparent hover:border-[#af8d28] p-6 rounded-[16px] flex flex-col justify-between">
                            {/* Plan Header */}
                            <div>
                                <h2 className="text-[18px] mb-2 text-center">{plan.name}</h2>

                                <p className="mb-4 text-center">
                                    {plan.commission !== undefined && `Commission: ${formatCommission(plan.commission)} per booking`}
                                    {plan.freeBookings && ` (${plan.freeBookings} free bookings)`}
                                    {plan.listingLimit && ` | ${plan.listingLimit === 999 ? "Unlimited" : plan.listingLimit} active listings`}
                                </p>

                                <p className="text-[33px] font-bold mb-4 text-center">{formatPrice(plan.cost, plan.currency, plan.billingPeriod)}</p>

                                {/* Benefits - Expandable */}
                                <div className="mb-4">
                                    <ul className="list-disc list-outside ml-4 space-y-1 text-[14px]">
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
                                                    +{plan.features.length - 5} more benefits <ChevronDown className="w-4 h-4" />
                                                </>
                                            )}
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Get Started Button */}
                            <button className={`bg-transparent text-[#C9A94D] font-bold py-3 rounded-lg transition-all border border-[#C9A94D] ${plan.cost === 0 ? "hover:bg-[#C9A94D] hover:text-white" : "hover:bg-[#C9A94D] hover:text-white"} ${isCreatingCheckout ? "opacity-50 cursor-not-allowed" : ""}`} onClick={() => handleSubscribe(plan)} disabled={isCreatingCheckout}>
                                {isCreatingCheckout ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                                        Processing...
                                    </div>
                                ) : plan.cost === 0 ? (
                                    "Get Started Free"
                                ) : (
                                    "Subscribe Now"
                                )}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default HostPlansPage;
