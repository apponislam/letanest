import Link from "next/link";
import React from "react";

const HomeFooter = () => {
    return (
        <div className="container mx-auto">
            <div className="mx-4 md:mx-0">
                <div className="grid grid-cols-2 md:grid-cols-4 py-6 md:py-10">
                    <div>
                        <h1 className="text-[24px] text-[#C9A94D] mb-2 uppercase font-bold">LETANEST</h1>
                        <p className="text-[18px] text-[#C9A94D]">Your trusted platform for unique accommodations worldwide.</p>
                    </div>
                    <div>
                        <h1 className="text-[24px] text-[#C9A94D] mb-2 uppercase font-bold">For Guests</h1>
                        <ul className="list-disc list-inside text-[#C9A94D] text-[18px] space-y-1">
                            <li>
                                <Link href="/search-properties" className="hover:underline">
                                    Search Properties
                                </Link>
                            </li>
                            <li>
                                <Link href="/reviews" className="hover:underline">
                                    Leave Reviews
                                </Link>
                            </li>
                            <li>
                                <Link href="/support" className="hover:underline">
                                    Get Support
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h1 className="text-[24px] text-[#C9A94D] mb-2 uppercase font-bold">For Hosts</h1>
                        <ul className="list-disc list-inside text-[#C9A94D] text-[18px] space-y-1">
                            <li>
                                <Link href="/list-property" className="hover:underline">
                                    List Property
                                </Link>
                            </li>
                            <li>
                                <Link href="/manage-bookings" className="hover:underline">
                                    Manage Bookings
                                </Link>
                            </li>
                            <li>
                                <Link href="/subscription-plans" className="hover:underline">
                                    Subscription Plans
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h1 className="text-[24px] text-[#C9A94D] mb-2 uppercase font-bold">Company</h1>
                        <ul className="list-disc list-inside text-[#C9A94D] text-[18px] space-y-1">
                            <li>
                                <Link href="/privacy-policy" className="hover:underline">
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link href="/terms-of-service" className="hover:underline">
                                    Terms of Service
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="hover:underline">
                                    Contact
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomeFooter;
