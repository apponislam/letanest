// "use client";
// import React from "react";
// import PageHeader from "../PageHeader";
// import { useAppSelector } from "@/redux/hooks";
// import { currentUser } from "@/redux/features/auth/authSlice";

// const TermsCondition = () => {
//     const user = useAppSelector(currentUser);
//     console.log(user);

//     return (
//         <>
//             <div className="container mx-auto">
//                 <div className="mx-4 md:mx-0">
//                     <PageHeader title={"Terms & Condition"}></PageHeader>

//                     <div className="text-[#C9A94D]">
//                         <h1 className="text-[32px] mb-4">Terms & Conditions</h1>
//                         <p className="mb-3">
//                             Welcome to LETANEST. By using our website and services, you <br className="md:block none" /> agree to the following Terms & Conditions. Please read carefully.
//                         </p>
//                         <div className="p-5">
//                             <div className="mb-6">
//                                 <h1 className="text-2xl mb-4">1. Booking & Payment</h1>
//                                 <ul className="list-disc ml-4">
//                                     <li>Your booking is confirmed once payment is received and approved by the host.</li>
//                                     <li>Please notify the host in advance if you need different timings.</li>
//                                 </ul>
//                             </div>
//                             <div className="mb-6">
//                                 <h1 className="text-2xl mb-4">2. Check-In & Check-Out</h1>
//                                 <ul className="list-disc ml-4">
//                                     <li>Check-in: [Insert time] | Check-out: [Insert time]</li>
//                                     <li>Please notify the host in advance if you need different timings.</li>
//                                 </ul>
//                             </div>
//                             <div className="mb-6">
//                                 <h1 className="text-2xl mb-4">3. House Rules</h1>
//                                 <ul className="list-disc ml-4">
//                                     <li>No smoking inside the property.</li>
//                                     <li>Pets only if agreed in advance.</li>
//                                     <li>Respect neighbours; keep noise to a minimum.</li>
//                                     <li>Maximum occupancy: [Insert number].</li>
//                                 </ul>
//                             </div>
//                             <div className="mb-6">
//                                 <h1 className="text-2xl mb-4">4. Cancellations & Refunds</h1>
//                                 <ul className="list-disc ml-4">
//                                     <li>Cancel at least [Insert timeframe] before check-in for a full refund.</li>
//                                     <li>Late cancellations or no-shows may not be refundable.</li>
//                                 </ul>
//                             </div>
//                             <div className="mb-6">
//                                 <h1 className="text-2xl mb-4">5. Damage & Liability</h1>
//                                 <ul className="list-disc ml-4">
//                                     <li>Guests are responsible for any damage during their stay.</li>
//                                     <li>Hosts are not liable for loss or theft of personal belongings.</li>
//                                 </ul>
//                             </div>
//                             <div className="mb-6">
//                                 <h1 className="text-2xl mb-4">6. Safety & Emergencies</h1>
//                                 <ul className="list-disc ml-4">
//                                     <li>Familiarise yourself with fire exits and emergency procedures.</li>
//                                     <li>Contact the host immediately in case of an emergency.</li>
//                                 </ul>
//                             </div>
//                             <div className="mb-6">
//                                 <h1 className="text-2xl mb-4">7. Questions & Communication</h1>
//                                 <ul className="list-disc ml-4">
//                                     <li>Direct any questions about the property or stay to the host.</li>
//                                     <li>Hosts may communicate updates or instructions via the website or booking platform</li>
//                                 </ul>
//                             </div>
//                             <div className="mb-6">
//                                 <h1 className="text-2xl mb-4">8. Additional Terms</h1>
//                                 <ul className="list-disc ml-4">
//                                     <li>[Insert property-specific rules, e.g., parking, pool, garden, shared spaces.]</li>
//                                 </ul>
//                             </div>
//                             <div className="mb-6">
//                                 <h1 className="text-2xl mb-4">9. Contact Us</h1>
//                                 <ul className="list-disc ml-4">
//                                     <li>For questions, please contact: </li>
//                                     <li>📧 Email: support@[yourwebsitename].com</li>
//                                 </ul>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </>
//     );
// };

// export default TermsCondition;

// "use client";
// import React, { useEffect, useState } from "react";
// import { useSearchParams } from "next/navigation";
// import PageHeader from "../PageHeader";
// import { useAppSelector } from "@/redux/hooks";
// import { currentUser } from "@/redux/features/auth/authSlice";
// import { useGetTermsByTargetQuery } from "@/redux/features/public/publicApi";

// const TermsCondition = () => {
//     const user = useAppSelector(currentUser);
//     const searchParams = useSearchParams();
//     const [target, setTarget] = useState<"GUEST" | "HOST">("GUEST");

//     // Check URL params for role, default to GUEST
//     useEffect(() => {
//         const roleParam = searchParams.get("role");
//         if (roleParam === "host") {
//             setTarget("HOST");
//         } else {
//             setTarget("GUEST"); // Always default to GUEST
//         }
//     }, [searchParams]);

//     // Fetch terms based on target
//     const { data: termsData, isLoading, error } = useGetTermsByTargetQuery(target);

//     console.log("User:", user);
//     console.log("Target:", target);
//     console.log("Terms Data:", termsData);

//     // Get the appropriate terms content
//     const getTermsContent = () => {
//         if (isLoading) {
//             return "<p>Loading terms and conditions...</p>";
//         }

//         if (error) {
//             return "<p>Failed to load terms and conditions.</p>";
//         }

//         // For GUEST, always return null to show default content
//         if (target === "GUEST") {
//             return null;
//         }

//         // For HOST, try to find custom terms
//         const termsArray = termsData?.data || [];
//         const relevantTerm = termsArray.find((t) => t.creatorType === "ADMIN" && t.target === target);
//         return relevantTerm?.content || null;
//     };

//     const termsContent = getTermsContent();

//     return (
//         <>
//             <div className="container mx-auto">
//                 <div className="mx-4 md:mx-0">
//                     <PageHeader title={"Terms & Conditions"} />

//                     <div className="text-[#C9A94D]">
//                         <h1 className="text-[32px] mb-4">Terms & Conditions {target === "HOST" ? "for Hosts" : "for Guests"}</h1>

//                         {isLoading ? (
//                             <p className="mb-3">Loading terms and conditions...</p>
//                         ) : termsContent ? (
//                             <div className="rich-text-content" dangerouslySetInnerHTML={{ __html: termsContent }} />
//                         ) : (
//                             <>
//                                 <p className="mb-3">
//                                     Welcome to LETANEST. By using our website and services, you <br className="md:block hidden" /> agree to the following Terms & Conditions. Please read carefully.
//                                 </p>
//                                 <div className="p-5">
//                                     <div className="mb-6">
//                                         <h1 className="text-2xl mb-4">1. Booking & Payment</h1>
//                                         <ul className="list-disc ml-4">
//                                             <li>Your booking is confirmed once payment is received and approved by the host.</li>
//                                             <li>Please notify the host in advance if you need different timings.</li>
//                                         </ul>
//                                     </div>
//                                     <div className="mb-6">
//                                         <h1 className="text-2xl mb-4">2. Check-In & Check-Out</h1>
//                                         <ul className="list-disc ml-4">
//                                             <li>Check-in: [Insert time] | Check-out: [Insert time]</li>
//                                             <li>Please notify the host in advance if you need different timings.</li>
//                                         </ul>
//                                     </div>
//                                     <div className="mb-6">
//                                         <h1 className="text-2xl mb-4">3. House Rules</h1>
//                                         <ul className="list-disc ml-4">
//                                             <li>No smoking inside the property.</li>
//                                             <li>Pets only if agreed in advance.</li>
//                                             <li>Respect neighbours; keep noise to a minimum.</li>
//                                             <li>Maximum occupancy: [Insert number].</li>
//                                         </ul>
//                                     </div>
//                                     <div className="mb-6">
//                                         <h1 className="text-2xl mb-4">4. Cancellations & Refunds</h1>
//                                         <ul className="list-disc ml-4">
//                                             <li>Cancel at least [Insert timeframe] before check-in for a full refund.</li>
//                                             <li>Late cancellations or no-shows may not be refundable.</li>
//                                         </ul>
//                                     </div>
//                                     <div className="mb-6">
//                                         <h1 className="text-2xl mb-4">5. Damage & Liability</h1>
//                                         <ul className="list-disc ml-4">
//                                             <li>Guests are responsible for any damage during their stay.</li>
//                                             <li>Hosts are not liable for loss or theft of personal belongings.</li>
//                                         </ul>
//                                     </div>
//                                     <div className="mb-6">
//                                         <h1 className="text-2xl mb-4">6. Safety & Emergencies</h1>
//                                         <ul className="list-disc ml-4">
//                                             <li>Familiarise yourself with fire exits and emergency procedures.</li>
//                                             <li>Contact the host immediately in case of an emergency.</li>
//                                         </ul>
//                                     </div>
//                                     <div className="mb-6">
//                                         <h1 className="text-2xl mb-4">7. Questions & Communication</h1>
//                                         <ul className="list-disc ml-4">
//                                             <li>Direct any questions about the property or stay to the host.</li>
//                                             <li>Hosts may communicate updates or instructions via the website or booking platform</li>
//                                         </ul>
//                                     </div>
//                                     <div className="mb-6">
//                                         <h1 className="text-2xl mb-4">8. Additional Terms</h1>
//                                         <ul className="list-disc ml-4">
//                                             <li>[Insert property-specific rules, e.g., parking, pool, garden, shared spaces.]</li>
//                                         </ul>
//                                     </div>
//                                     <div className="mb-6">
//                                         <h1 className="text-2xl mb-4">9. Contact Us</h1>
//                                         <ul className="list-disc ml-4">
//                                             <li>For questions, please contact: </li>
//                                             <li>📧 Email: support@letanest.com</li>
//                                         </ul>
//                                     </div>
//                                 </div>
//                             </>
//                         )}
//                     </div>
//                 </div>
//             </div>
//         </>
//     );
// };

// export default TermsCondition;

"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import PageHeader from "../PageHeader";
import { useAppSelector } from "@/redux/hooks";
import { currentUser } from "@/redux/features/auth/authSlice";
import { useGetTermsByTargetQuery } from "@/redux/features/public/publicApi";

const TermsCondition = () => {
    const user = useAppSelector(currentUser);
    const searchParams = useSearchParams();
    const [target, setTarget] = useState<"GUEST" | "HOST">("GUEST");

    // Check URL params for role AND user role
    useEffect(() => {
        const roleParam = searchParams.get("role");

        // Priority: URL param > User role > Default GUEST
        if (roleParam === "host" || user?.role === "HOST") {
            setTarget("HOST"); // Show HOST terms for host users OR ?role=host
        } else {
            setTarget("GUEST"); // Default to GUEST for everyone else
        }
    }, [searchParams, user]);

    // Fetch terms based on target
    const { data: termsData, isLoading, error } = useGetTermsByTargetQuery(target);

    console.log("User:", user);
    console.log("Target:", target);
    console.log("Terms Data:", termsData);

    // Get the appropriate terms content
    const getTermsContent = () => {
        if (isLoading) {
            return "<p>Loading terms and conditions...</p>";
        }

        if (error) {
            return "<p>Failed to load terms and conditions.</p>";
        }

        const termsArray = termsData?.data || [];

        // Look for ADMIN-created terms for the current target
        const relevantTerm = termsArray.find((t) => t.creatorType === "ADMIN" && t.target === target);

        return relevantTerm?.content || "<p>No terms and conditions available.</p>";
    };

    const termsContent = getTermsContent();

    return (
        <>
            <div className="container mx-auto">
                <div className="mx-4 md:mx-0">
                    <PageHeader title={"Terms & Conditions"} />

                    <div className="text-[#C9A94D]">
                        <h1 className="text-[32px] mb-4">Terms & Conditions {target === "HOST" ? "for Hosts" : "for Guests"}</h1>

                        {isLoading ? <p className="mb-3">Loading terms and conditions...</p> : <div className="rich-text-content text-[#C9A94D]" dangerouslySetInnerHTML={{ __html: termsContent }} />}
                    </div>
                </div>
            </div>
        </>
    );
};

export default TermsCondition;
