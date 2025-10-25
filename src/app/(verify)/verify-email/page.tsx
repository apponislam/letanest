"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle, XCircle, Loader2, MailCheck } from "lucide-react";
import Image from "next/image";
import { useVerifyEmailQuery } from "@/redux/features/auth/authApi";
import Link from "next/link";

const VerifyEmailPage = () => {
    const searchParams = useSearchParams();
    const router = useRouter();

    const token = searchParams.get("token");
    const userId = searchParams.get("id");

    const { data, isLoading, isError, error } = useVerifyEmailQuery({ userId: userId!, token: token! }, { skip: !token || !userId });
    console.log(data);

    const [status, setStatus] = useState<"loading" | "success" | "error" | "already_verified">("loading");
    const [message, setMessage] = useState("Verifying your email...");

    useEffect(() => {
        if (!token || !userId) {
            setStatus("error");
            setMessage("Invalid verification link. Please check your email and try again.");
            return;
        }

        if (isLoading) {
            setStatus("loading");
            setMessage("Verifying your email...");
        } else if (data?.success) {
            setStatus("success");
            setMessage("Email verified successfully! You can now login to your account.");
        } else if (isError) {
            // Check if it's "already verified" error
            const errorData = (error as any)?.data;
            const errorMessage = errorData?.message || "Verification failed. Please try again.";

            if (errorMessage.toLowerCase().includes("already verified")) {
                setStatus("already_verified");
                setMessage("Your email has already been verified. You can login to your account.");
            } else {
                setStatus("error");
                setMessage(errorMessage);
            }
        }
    }, [token, userId, isLoading, data, isError, error]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#14213D] via-[#2D3546] to-[#434D64] flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                        <Image src="/logo.png" alt="Logo" width={80} height={80} className="rounded-lg" />
                    </div>
                    <h1 className="text-2xl font-bold text-[#C9A94D]">Email Verification</h1>
                </div>

                {/* Verification Card */}
                <div className="bg-[#2D3546] border border-[#C9A94D] rounded-2xl p-8 shadow-lg">
                    <div className="text-center">
                        {/* Status Icon */}
                        <div className="mb-6 flex justify-center">
                            {status === "loading" && (
                                <div className="w-20 h-20 rounded-full bg-[#434D64] flex items-center justify-center">
                                    <Loader2 className="w-10 h-10 text-[#C9A94D] animate-spin" />
                                </div>
                            )}
                            {status === "success" && (
                                <div className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center">
                                    <CheckCircle className="w-10 h-10 text-white" />
                                </div>
                            )}
                            {status === "already_verified" && (
                                <div className="w-20 h-20 rounded-full bg-blue-500 flex items-center justify-center">
                                    <MailCheck className="w-10 h-10 text-white" />
                                </div>
                            )}
                            {status === "error" && (
                                <div className="w-20 h-20 rounded-full bg-red-500 flex items-center justify-center">
                                    <XCircle className="w-10 h-10 text-white" />
                                </div>
                            )}
                        </div>

                        {/* Message */}
                        <div className="mb-8">
                            <h2 className={`text-xl font-semibold mb-3 ${status === "success" ? "text-green-400" : status === "already_verified" ? "text-blue-400" : status === "error" ? "text-red-400" : "text-[#C9A94D]"}`}>
                                {status === "loading" && "Verifying Email"}
                                {status === "success" && "Verification Successful!"}
                                {status === "already_verified" && "Already Verified"}
                                {status === "error" && "Verification Failed"}
                            </h2>
                            <p className="text-gray-300 leading-relaxed">{message}</p>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-4">
                            {(status === "success" || status === "already_verified") && (
                                <div className="space-y-3">
                                    <Link href="/auth/login" className="w-full bg-[#C9A94D] text-white py-3 px-6 rounded-lg hover:bg-[#b8973e] transition-colors font-medium block text-center shadow-md hover:shadow-lg">
                                        Continue to Login
                                    </Link>
                                    <Link href="/" className="w-full bg-transparent border-2 border-[#C9A94D] text-[#C9A94D] py-3 px-6 rounded-lg hover:bg-[#C9A94D] hover:text-white transition-colors font-medium block text-center">
                                        Back to Home
                                    </Link>
                                </div>
                            )}

                            {status === "error" && (
                                <div className="space-y-3">
                                    <Link href="/auth/register" className="w-full bg-[#C9A94D] text-white py-3 px-6 rounded-lg hover:bg-[#b8973e] transition-colors font-medium block text-center">
                                        Register Again
                                    </Link>
                                    <Link href="/contact" className="w-full border border-[#C9A94D] text-[#C9A94D] py-3 px-6 rounded-lg hover:bg-[#C9A94D] hover:text-white transition-colors font-medium block text-center">
                                        Contact Support
                                    </Link>
                                </div>
                            )}

                            {status === "loading" && <div className="w-full bg-[#434D64] text-gray-400 py-3 px-6 rounded-lg font-medium text-center">Please wait...</div>}
                        </div>

                        {/* Additional Info */}
                        <div className="mt-6 pt-6 border-t border-[#434D64]">
                            <p className="text-sm text-gray-400">
                                Having trouble?{" "}
                                <Link href="/contact" className="text-[#C9A94D] hover:underline">
                                    Contact our support team
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center mt-6">
                    <p className="text-gray-400 text-sm">© {new Date().getFullYear()} Letanest. All rights reserved.</p>
                </div>
            </div>
        </div>
    );
};

export default VerifyEmailPage;
