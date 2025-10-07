import React, { useState } from "react";
import { useGetSubscriptionsByTypeQuery, useCreateCheckoutSessionMutation } from "@/redux/features/subscription/subscriptionApi";
import { ISubscription } from "@/redux/features/subscription/subscriptionApi";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useGetMySubscriptionsQuery } from "@/redux/features/users/usersApi";

const GuestPlansPage = () => {
    const { data: guestSubscriptions, isLoading, error } = useGetSubscriptionsByTypeQuery("GUEST");
    const { data: userSubscribedResponse, isLoading: isUserLoading, error: userError } = useGetMySubscriptionsQuery();
    const [createCheckoutSession, { isLoading: isCreatingCheckout }] = useCreateCheckoutSessionMutation();
    const [expandedPlan, setExpandedPlan] = useState<string | null>(null);

    // Type assertion to handle the actual response structure
    const userSubscriptionsData = (userSubscribedResponse as any)?.data;

    console.log("User subscribed response:", userSubscribedResponse);

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

    // Check if user is subscribed to a specific plan
    const isUserSubscribedToPlan = (planId: string) => {
        if (!userSubscriptionsData?.subscriptions) return false;

        return userSubscriptionsData.subscriptions.some((sub: any) => {
            const subscriptionData = sub.subscription;
            const subscriptionId = subscriptionData.subscription;

            return subscriptionId === planId && subscriptionData.status === "active" && subscriptionData.currentPeriodEnd && new Date(subscriptionData.currentPeriodEnd) > new Date();
        });
    };

    // Get subscription status for a specific plan
    const getSubscriptionStatus = (planId: string) => {
        if (!userSubscriptionsData?.subscriptions) return null;

        const userSubscription = userSubscriptionsData.subscriptions.find((sub: any) => {
            const subscriptionData = sub.subscription;
            return subscriptionData.subscription === planId;
        });

        if (!userSubscription) return null;

        const subscriptionData = userSubscription.subscription;
        const isActive = subscriptionData.status === "active" && subscriptionData.currentPeriodEnd && new Date(subscriptionData.currentPeriodEnd) > new Date();

        return {
            status: subscriptionData.status,
            currentPeriodEnd: subscriptionData.currentPeriodEnd,
            isActive: isActive,
        };
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
        <div className="text-[#C9A94D]">
            <div className="border border-[#C9A94D] rounded-[20px] p-5">
                <h1 className="text-2xl md:text-[40px] mb-4">Guest Subscriptions (Stayers)</h1>
                <p className="mb-6">Unlock perks, protection, and peace of mind.</p>

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
                    {plans.map((plan: ISubscription) => {
                        const subscriptionStatus = getSubscriptionStatus(plan._id!);
                        const isSubscribed = isUserSubscribedToPlan(plan._id!);

                        return (
                            <div key={plan._id} className="bg-[#2D3546] border border-[#2D3546] hover:bg-transparent hover:border-[#af8d28] p-6 rounded-[16px] flex flex-col justify-between">
                                {/* Plan Header */}
                                <div>
                                    <h2 className="text-[18px] mb-2 text-center">{plan.name}</h2>
                                    <p className="mb-4 text-center">
                                        {plan.bookingFee !== undefined && plan.bookingFee !== null
                                            ? plan.bookingLimit
                                                ? plan.bookingFee === 0
                                                    ? `Booking Fee: 0% (up to ${plan.bookingLimit} booking${plan.bookingLimit > 1 ? "s" : ""})`
                                                    : `Booking Fee: ${formatBookingFee(plan.bookingFee)} after ${plan.bookingLimit} booking${plan.bookingLimit > 1 ? "s" : ""}`
                                                : `Booking Fee: ${formatBookingFee(plan.bookingFee)}`
                                            : "Booking Fee: Not set"}
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

                                {/* Conditional Button */}
                                {isSubscribed ? (
                                    <div className="text-center">
                                        <button className="bg-[#C9A94D] text-white font-bold py-3 rounded-lg border border-[#C9A94D] w-full cursor-default" disabled>
                                            Currently Active
                                        </button>
                                        {subscriptionStatus?.currentPeriodEnd && <p className="text-xs mt-2 text-gray-400">Renews on {new Date(subscriptionStatus.currentPeriodEnd).toLocaleDateString()}</p>}
                                    </div>
                                ) : subscriptionStatus ? (
                                    <button className="bg-gray-600 text-gray-300 font-bold py-3 rounded-lg border border-gray-600 w-full cursor-not-allowed" disabled>
                                        {subscriptionStatus.status === "canceled" ? "Subscription Canceled" : "Subscription Expired"}
                                    </button>
                                ) : (
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
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default GuestPlansPage;
