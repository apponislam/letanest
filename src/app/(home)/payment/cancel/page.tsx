"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { XCircle, Home } from "lucide-react";

export default function PaymentCancelPage() {
    const router = useRouter();

    return (
        <div className="my-32 flex flex-col items-center justify-center px-4">
            <div className="bg-[#2B3243] rounded-2xl shadow-lg p-8 max-w-md w-full text-center border border-[#C9A94D]/30">
                <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h1 className="text-2xl font-bold text-white mb-2">Payment Canceled</h1>
                <p className="text-gray-300 mb-6">It looks like you canceled your checkout process. Don’t worry — no charges were made.</p>

                <div className="bg-[#1F2633] p-4 rounded-lg mb-6 border border-[#C9A94D]/20">
                    <p className="text-gray-400 text-sm">You can return to your dashboard or choose a different plan anytime.</p>
                </div>

                <button onClick={() => router.push("/dashboard")} className="w-full flex items-center justify-center gap-2 bg-transparent border border-[#C9A94D] text-[#C9A94D] font-semibold py-3 rounded-lg hover:bg-[#C9A94D] hover:text-white transition-all">
                    <Home className="w-5 h-5" />
                    Back to Dashboard
                </button>

                <button onClick={() => router.push("/")} className="mt-3 w-full bg-[#C9A94D] text-white font-semibold py-3 rounded-lg hover:bg-[#b8973e] transition-colors">
                    Return Home
                </button>
            </div>
        </div>
    );
}
