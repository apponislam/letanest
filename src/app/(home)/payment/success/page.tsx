"use client";

import React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Loader2, CheckCircle2 } from "lucide-react";
import { useGetCheckoutSessionQuery } from "@/redux/features/subscription/subscriptionApi";

export default function PaymentSuccessPage() {
    const searchParams = useSearchParams();
    const sessionId = searchParams.get("session_id");
    const router = useRouter();

    const { data: sessionData, isLoading, error } = useGetCheckoutSessionQuery(sessionId || "");
    console.log(sessionData);

    if (isLoading)
        return (
            <div className="flex flex-col items-center justify-center my-40">
                <Loader2 className="animate-spin w-8 h-8 text-[#C9A94D]" />
                <p className="mt-4 text-gray-400">Loading payment details...</p>
            </div>
        );

    if (error || !sessionData)
        return (
            <div className="flex flex-col items-center justify-center my-40">
                <p className="text-red-500 text-lg">Failed to load payment details. Please try again.</p>
                <button onClick={() => router.push("/")} className="mt-4 px-6 py-2 bg-[#C9A94D] text-white rounded-lg hover:bg-[#b8973e] transition-colors">
                    Go Home
                </button>
            </div>
        );

    const { subscription, customer, metadata } = sessionData;

    return (
        <div className="my-32 flex flex-col items-center justify-center px-4">
            <div className="bg-gray-800 rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
                <CheckCircle2 className="w-12 h-12 text-[#C9A94D] mx-auto mb-4" />
                <h1 className="text-2xl font-bold text-white mb-2">Payment Successful!</h1>
                <p className="text-gray-300 mb-6">Thank you for your purchase, {metadata.userName || "User"}.</p>

                <div className="text-left text-gray-200 mb-4">
                    <p>
                        <span className="font-semibold">Plan:</span> {metadata.type} - {metadata.level}
                    </p>
                    <p>
                        <span className="font-semibold">Billing Period:</span> {subscription?.items?.data[0]?.plan.interval || "N/A"}
                    </p>
                    <p>
                        <span className="font-semibold">Amount:</span> {subscription?.items?.data[0]?.plan.amount ? `$${subscription.items.data[0].plan.amount / 100}` : "Free"}
                    </p>
                    <p>
                        <span className="font-semibold">Currency:</span> {subscription?.items?.data[0]?.plan.currency?.toUpperCase() || "N/A"}
                    </p>
                    <p>
                        <span className="font-semibold">Customer Email:</span> {customer?.email || metadata.userEmail}
                    </p>
                    <p>
                        <span className="font-semibold">Subscription Status:</span> {subscription?.status || "N/A"}
                    </p>
                </div>

                <button onClick={() => router.push("/dashboard")} className="mt-4 w-full bg-[#C9A94D] text-white font-semibold py-3 rounded-lg hover:bg-[#b8973e] transition-colors">
                    Go to Dashboard
                </button>
            </div>
        </div>
    );
}
