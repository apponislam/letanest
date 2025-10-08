import React from "react";
import Link from "next/link";

const FreeTierGuestFree = () => {
    return (
        <div className="min-h-screen  text-[#C9A94D] flex items-center justify-center p-4">
            <div className="max-w-2xl w-full">
                <div className="bg-[#2D3546] border border-[#C9A94D] rounded-[20px] p-8 text-center">
                    {/* Success Icon */}
                    <div className="mb-6">
                        <div className="w-20 h-20 bg-[#C9A94D] rounded-full flex items-center justify-center mx-auto">
                            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                    </div>

                    {/* Success Message */}
                    <h1 className="text-3xl md:text-4xl font-bold mb-4">Open Door Activated!</h1>

                    <p className="text-lg mb-6 text-gray-300">Your free guest membership is now active. Start exploring homes!</p>

                    {/* Key Features */}
                    <div className="mb-8">
                        <h3 className="text-xl font-semibold mb-4 text-[#C9A94D]">Your Free Guest Benefits:</h3>
                        <div className="space-y-3 text-left">
                            <div className="flex items-center">
                                <svg className="w-5 h-5 text-[#C9A94D] mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span className="text-gray-300">Browse all homes freely</span>
                            </div>
                            <div className="flex items-center">
                                <svg className="w-5 h-5 text-[#C9A94D] mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span className="text-gray-300">Contact hosts after quick signup</span>
                            </div>
                            <div className="flex items-center">
                                <svg className="w-5 h-5 text-[#C9A94D] mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span className="text-gray-300">Standard booking with 10% fee</span>
                            </div>
                            <div className="flex items-center">
                                <svg className="w-5 h-5 text-[#C9A94D] mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span className="text-gray-300">Leave reviews after stays</span>
                            </div>
                            <div className="flex items-center">
                                <svg className="w-5 h-5 text-[#C9A94D] mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span className="text-gray-300">Save favourites in your guest dashboard</span>
                            </div>
                        </div>
                    </div>

                    {/* Booking Fee Info */}
                    <div className="bg-[#1a1f2e] border border-[#C9A94D] rounded-[16px] p-4 mb-6">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-[#C9A94D]">10% Booking Fee</div>
                            <div className="text-sm text-gray-400">Applied to all bookings</div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/dashboard" className="bg-[#C9A94D] text-white font-bold py-3 px-8 rounded-lg hover:bg-[#af8d28] transition-colors text-center">
                            Browse Homes
                        </Link>

                        <Link href="/dashboard/memberships" className="bg-transparent border border-[#C9A94D] text-[#C9A94D] font-bold py-3 px-8 rounded-lg hover:bg-[#C9A94D] hover:text-white transition-colors text-center">
                            View Premium Plans
                        </Link>
                    </div>

                    {/* Upgrade Hint */}
                    <div className="mt-6 text-sm text-gray-400">Upgrade to premium plans to enjoy 0% booking fees and exclusive benefits</div>
                </div>
            </div>
        </div>
    );
};

export default FreeTierGuestFree;
