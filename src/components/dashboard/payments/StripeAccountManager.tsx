"use client";
import { useState, useEffect } from "react";
import { CheckCircle, XCircle, ExternalLink, CreditCard, Shield, X } from "lucide-react";
import { useGetStripeAccountStatusQuery, useGetStripeDashboardQuery, useConnectStripeAccountMutation, useDisconnectStripeAccountMutation } from "@/redux/features/users/usersApi";
import { toast } from "sonner";

const StripeAccountManager = () => {
    // API Hooks
    const { data: accountStatus, refetch: refetchStatus } = useGetStripeAccountStatusQuery();
    const { data: dashboardData } = useGetStripeDashboardQuery();
    const [connectStripe, { isLoading: isConnecting }] = useConnectStripeAccountMutation();
    const [disconnectStripe, { isLoading: isDisconnecting }] = useDisconnectStripeAccountMutation();

    const [isModalOpen, setIsModalOpen] = useState(false);

    // Derived state from API
    const isConnected = accountStatus?.data?.status === "verified";
    const isLoading = isConnecting || isDisconnecting;
    const accountData = accountStatus?.data;

    console.log(accountStatus);

    const handleConnectAccount = async () => {
        try {
            const result = await connectStripe().unwrap();
            // console.log(result);
            if (result.data?.onboardingUrl) {
                window.open(result.data.onboardingUrl, "_blank");
                toast.success("Redirected to Stripe onboarding");
            }
            // Status will update automatically via the query
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to connect Stripe account");
        }
    };

    const handleDisconnectAccount = async () => {
        try {
            await disconnectStripe().unwrap();
            toast.success("Stripe account disconnected successfully");

            // Force refetch and close modal
            await refetchStatus();
            setIsModalOpen(false);

            // Optional: Add small delay to ensure cache is updated
            setTimeout(() => {
                refetchStatus();
            }, 500);
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to disconnect Stripe account");
        }
    };

    const handleViewDashboard = () => {
        if (dashboardData?.data?.dashboardUrl) {
            window.open(dashboardData.data.dashboardUrl, "_blank");
        } else {
            toast.error("Dashboard URL not available");
        }
    };

    return (
        <>
            {/* Status Button */}
            <button onClick={() => setIsModalOpen(true)} className="bg-white border border-[#C9A94D] text-[#14213D] py-2 px-6 rounded-2xl hover:bg-[#C9A94D] hover:text-white transition-all duration-300 flex items-center gap-3 shadow-sm hover:shadow-md">
                <div className={`p-2 rounded-full ${isConnected ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}>{isConnected ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}</div>
                <div className="text-left">
                    <div className="font-semibold">Payment Account</div>
                    <div className={`text-xs ${isConnected ? "text-green-600" : "text-red-600"}`}>{isConnected ? "✓ Active & Connected" : "✗ Not Connected"}</div>
                </div>
            </button>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-auto animate-in fade-in-90 zoom-in-90">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-[#C9A94D]/10 rounded-lg">
                                    <CreditCard className="w-5 h-5 text-[#C9A94D]" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-[#14213D]">Payment Account</h2>
                                    <p className="text-[#6B7280] text-sm">Manage your payment settings</p>
                                </div>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                <X className="w-5 h-5 text-gray-400" />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6">
                            {/* Status */}
                            <div className={`p-4 rounded-xl border-2 mb-4 ${isConnected ? "border-green-200 bg-green-50" : "border-[#C9A94D]/30 bg-[#f8f6f0]"}`}>
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-full ${isConnected ? "bg-green-100" : "bg-gray-100"}`}>{isConnected ? <CheckCircle className="w-5 h-5 text-green-600" /> : <XCircle className="w-5 h-5 text-gray-400" />}</div>
                                    <div>
                                        <p className="font-semibold text-[#14213D]">{isConnected ? "Account Connected" : "Account Not Connected"}</p>
                                        <p className="text-sm text-[#6B7280]">{isConnected ? "Ready to receive payments" : "Connect to start receiving payouts"}</p>
                                        {/* {accountData?.stripeStatus && (
                                            <div className="text-xs text-gray-500 mt-1">
                                                Charges: {accountData.stripeStatus.chargesEnabled ? "✅" : "❌"} | Payouts: {accountData.stripeStatus.payoutsEnabled ? "✅" : "❌"}
                                            </div>
                                        )} */}
                                    </div>
                                </div>
                            </div>

                            {/* Features */}
                            <div className="grid grid-cols-2 gap-3 mb-6">
                                <div className="text-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                                    <Shield className="w-4 h-4 text-[#C9A94D] mx-auto mb-1" />
                                    <p className="text-xs text-gray-600">Secure</p>
                                </div>
                                <div className="text-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                                    <CreditCard className="w-4 h-4 text-[#C9A94D] mx-auto mb-1" />
                                    <p className="text-xs text-gray-600">Fast Payouts</p>
                                </div>
                            </div>

                            {/* Buttons */}
                            <div className="space-y-3">
                                {!isConnected ? (
                                    <button onClick={handleConnectAccount} disabled={isLoading} className="w-full bg-[#C9A94D] text-white py-3 px-4 rounded-lg font-medium hover:bg-[#b8973e] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2">
                                        {isLoading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : null}
                                        {isLoading ? "Connecting..." : "Connect Payment Account"}
                                    </button>
                                ) : (
                                    <>
                                        <button onClick={handleViewDashboard} className="w-full bg-[#C9A94D] text-white py-3 px-4 rounded-lg font-medium hover:bg-[#b8973e] transition-colors flex items-center justify-center gap-2">
                                            View Dashboard
                                            <ExternalLink className="w-4 h-4" />
                                        </button>
                                        <button onClick={handleDisconnectAccount} disabled={isLoading} className="w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2">
                                            {isLoading ? <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" /> : null}
                                            {isLoading ? "Disconnecting..." : "Disconnect Account"}
                                        </button>
                                    </>
                                )}
                            </div>

                            {/* Security Note */}
                            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                                <div className="flex items-start gap-2">
                                    <Shield className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                    <p className="text-xs text-blue-700">All payment information is protected with bank-level security.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default StripeAccountManager;
