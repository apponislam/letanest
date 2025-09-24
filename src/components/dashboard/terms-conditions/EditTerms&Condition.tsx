// "use client";
// import { Host } from "@/types/host";
// import { ArrowLeft, Check } from "lucide-react";
// import Image from "next/image";
// import React, { useEffect, useRef, useState } from "react";
// import JoditEditor from "jodit-react";

// const EditTermsCondition = () => {
//     const [host, setHost] = useState<Host | null>(null);
//     const [isEditing, setIsEditing] = useState(false);
//     const [content, setContent] = useState("");
//     const editor = useRef(null);

//     const contentData = "";

//     useEffect(() => {
//         fetch("/data/host.json")
//             .then((res) => res.json())
//             .then((data: Host[]) => setHost(data[0]))
//             .catch((err) => console.error(err));
//     }, []);

//     useEffect(() => {
//         if (contentData) {
//             setContent(contentData || "No privacy policy content available. Please edit to add content.");
//         }
//     }, [contentData]);

//     const handleClickBack = () => history.back();

//     if (!host) return <p>Loading...</p>;

//     const handleCancel = () => {
//         setIsEditing(false);
//         // Reset to original content
//         if (contentData) {
//             setContent(contentData || "");
//         }
//     };

//     const handleSave = async () => {
//         console.log("hii");
//     };

//     const config = {
//         readonly: false,
//         placeholder: "Start typing privacy policy content...",
//         buttons: ["bold", "italic", "underline", "link", "unlink", "ul", "ol", "font", "fontsize"],
//         height: 400,
//         theme: "default",
//     };

//     return (
//         <div className="container mx-auto">
//             <div className="p-5 border border-[#C9A94D] flex justify-between items-center mb-6 flex-col md:flex-row gap-4">
//                 <div className="text-[#C9A94D] flex items-center gap-3 text-[18px] cursor-pointer hover:underline" onClick={handleClickBack}>
//                     <ArrowLeft />
//                     <p>Back To Previous</p>
//                 </div>
//                 <h1 className="text-2xl text-[#C9A94D]">Dashboard</h1>
//                 <div className="flex items-center gap-2">
//                     <Image src={host.image} alt={host.name} width={30} height={30} className="rounded-full border-[0.3px] border-[#C9A94D] object-cover" />
//                     <div className="text-[#C9A94D] text-[18px]">{host.role}</div>
//                 </div>
//             </div>
//             <div className="bg-[#2D3546] p-5 rounded-[4px]">
//                 <h1 className="text-2xl font-bold text-[#C9A94D] mb-4">Manage Terms & Conditions</h1>
//                 <p className="text-[#B6BAC3]">Use this section to write or update the Terms and Conditions for your app. These terms will be displayed to users within the app and must be accepted during registration or major updates.</p>
//                 <div className="flex items-center gap-4 bg-[#DAEEDF] rounded-[12px] p-[10px] mb-4">
//                     <div className="w-6 h-6 bg-[#00A62C] text-white rounded-full flex items-center justify-center">
//                         <Check className="w-5 h-5" />
//                     </div>
//                     <p className="text-[#00A62C] font-medium">Your Terms & Conditions have been successfully updated and will now appear in the app.</p>
//                 </div>

//                 <div>
//                     <div className="bg-transparent rounded-2xl p-[10px] text-[#B6BAC3] md:text-lg font-medium">
//                         {isEditing ? (
//                             <>
//                                 <div className="space-y-4">
//                                     {/* <label className="block font-semibold">Privacy Policy Content:</label> */}
//                                     <JoditEditor ref={editor} value={content} config={config} onBlur={(newContent) => setContent(newContent)} className="bg-transparent" />
//                                 </div>

//                                 <div className="flex gap-4 justify-start mt-6">
//                                     <button onClick={handleSave} className="bg-[#C9A94D] hover:bg-[#C9A94D] text-white px-6 py-2 rounded-xl font-medium disabled:bg-gray-400 disabled:cursor-not-allowed">
//                                         {/* {isUpdating ? "Saving..." : "Save Changes"} */}
//                                         Save Terms & Conditions
//                                     </button>
//                                     <button onClick={handleCancel} className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-xl font-medium">
//                                         Cancel
//                                     </button>
//                                 </div>
//                             </>
//                         ) : (
//                             <>
//                                 <div className="self-stretch text-justify justify-start md:leading-7 tracking-tight whitespace-pre-line" dangerouslySetInnerHTML={{ __html: content }} />

//                                 <div className="flex justify-end mt-6">
//                                     <button onClick={() => setIsEditing(true)} className="bg-[#00A430] hover:bg-green-700 text-white px-6 py-2 rounded-xl font-medium">
//                                         Edit Details
//                                     </button>
//                                 </div>
//                             </>
//                         )}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default EditTermsCondition;

"use client";
import { Host } from "@/types/host";
import { ArrowLeft, Check } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import JoditEditor from "jodit-react";

const EditTermsCondition = () => {
    const [host, setHost] = useState<Host | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [content, setContent] = useState("");
    const editor = useRef(null);

    // Default content for Terms & Conditions
    const defaultContent = `
<div style="color:#C9A94D; font-family: sans-serif;">
  <p style="margin-bottom:12px;">
    Welcome to LETANEST. By using our website and services, you agree to the following Terms & Conditions. Please read carefully.
  </p>

  <div style="padding:10px;">
    <h2 style="font-size:20px; margin-bottom:6px;">1. Booking & Payment</h2>
    <ul style="margin-left:16px; margin-bottom:10px;">
      <li>Your booking is confirmed once payment is received and approved by the host.</li>
      <li>Please notify the host in advance if you need different timings.</li>
    </ul>

    <h2 style="font-size:20px; margin-bottom:6px;">2. Check-In & Check-Out</h2>
    <ul style="margin-left:16px; margin-bottom:10px;">
      <li>Check-in: [Insert time] | Check-out: [Insert time]</li>
      <li>Please notify the host in advance if you need different timings.</li>
    </ul>

    <h2 style="font-size:20px; margin-bottom:6px;">3. House Rules</h2>
    <ul style="margin-left:16px; margin-bottom:10px;">
      <li>No smoking inside the property.</li>
      <li>Pets only if agreed in advance.</li>
      <li>Respect neighbours; keep noise to a minimum.</li>
      <li>Maximum occupancy: [Insert number].</li>
    </ul>

    <h2 style="font-size:20px; margin-bottom:6px;">4. Cancellations & Refunds</h2>
    <ul style="margin-left:16px; margin-bottom:10px;">
      <li>Cancel at least [Insert timeframe] before check-in for a full refund.</li>
      <li>Late cancellations or no-shows may not be refundable.</li>
    </ul>

    <h2 style="font-size:20px; margin-bottom:6px;">5. Damage & Liability</h2>
    <ul style="margin-left:16px; margin-bottom:10px;">
      <li>Guests are responsible for any damage during their stay.</li>
      <li>Hosts are not liable for loss or theft of personal belongings.</li>
    </ul>

    <h2 style="font-size:20px; margin-bottom:6px;">6. Safety & Emergencies</h2>
    <ul style="margin-left:16px; margin-bottom:10px;">
      <li>Familiarise yourself with fire exits and emergency procedures.</li>
      <li>Contact the host immediately in case of an emergency.</li>
    </ul>

    <h2 style="font-size:20px; margin-bottom:6px;">7. Questions & Communication</h2>
    <ul style="margin-left:16px; margin-bottom:10px;">
      <li>Direct any questions about the property or stay to the host.</li>
      <li>Hosts may communicate updates or instructions via the website or booking platform.</li>
    </ul>

    <h2 style="font-size:20px; margin-bottom:6px;">8. Additional Terms</h2>
    <ul style="margin-left:16px; margin-bottom:10px;">
      <li>[Insert property-specific rules, e.g., parking, pool, garden, shared spaces.]</li>
    </ul>

    <h2 style="font-size:20px; margin-bottom:6px;">9. Contact Us</h2>
    <ul style="margin-left:16px; margin-bottom:10px;">
      <li>For questions, please contact:</li>
      <li>📧 Email: support@[yourwebsitename].com</li>
    </ul>
  </div>
</div>
`;

    useEffect(() => {
        fetch("/data/host.json")
            .then((res) => res.json())
            .then((data: Host[]) => setHost(data[0]))
            .catch((err) => console.error(err));
    }, []);

    useEffect(() => {
        setContent(defaultContent);
    }, [defaultContent]);

    const handleClickBack = () => history.back();

    if (!host) return <p>Loading...</p>;

    const handleCancel = () => {
        setIsEditing(false);
        setContent(defaultContent);
    };

    const handleSave = async () => {
        console.log("Saved content:", content);
        setIsEditing(false);
        // Here you can implement API call to save content
    };

    const config = {
        readonly: false,
        placeholder: "Start typing Terms & Conditions...",
        buttons: ["bold", "italic", "underline", "link", "unlink", "ul", "ol", "font", "fontsize"],
        height: 400,
        theme: "default",
        color: "#C9A94D",
        style: {
            color: "#C9A94D",
            backgroundColor: "transparent",
            border: "1px solid #C9A94D",
        },
    };

    return (
        <div className="container mx-auto px-4 md:px-0 py-6">
            {/* Header */}
            <div className="p-5 border border-[#C9A94D] flex justify-between items-center mb-6 flex-col md:flex-row gap-4">
                <div className="text-[#C9A94D] flex items-center gap-3 text-[18px] cursor-pointer hover:underline" onClick={handleClickBack}>
                    <ArrowLeft />
                    <p>Back To Previous</p>
                </div>
                <h1 className="text-2xl text-[#C9A94D]">Dashboard</h1>
                <div className="flex items-center gap-2">
                    <Image src={host.image} alt={host.name} width={30} height={30} className="rounded-full border-[0.3px] border-[#C9A94D] object-cover" />
                    <div className="text-[#C9A94D] text-[18px]">{host.role}</div>
                </div>
            </div>

            {/* Editor Section */}
            <div className="bg-[#2D3546] p-5 rounded-[4px]">
                <h1 className="text-2xl font-bold text-[#C9A94D] mb-4">Manage Terms & Conditions</h1>
                <p className="text-[#B6BAC3] mb-4">Use this section to write or update the Terms and Conditions for your app. These terms will be displayed to users within the app and must be accepted during registration or major updates.</p>

                {/* Success Message */}
                <div className="flex items-center gap-4 bg-[#DAEEDF] rounded-[12px] p-[10px] mb-6">
                    <div className="w-6 h-6 bg-[#00A62C] text-white rounded-full flex items-center justify-center">
                        <Check className="w-5 h-5" />
                    </div>
                    <p className="text-[#00A62C] font-medium">Your Terms & Conditions have been successfully updated and will now appear in the app.</p>
                </div>

                {/* Editor */}
                <div className="bg-[#1F2738] rounded-2xl p-4 text-[#B6BAC3] md:text-lg font-medium">
                    {isEditing ? (
                        <>
                            <JoditEditor ref={editor} value={content} config={config} onBlur={(newContent) => setContent(newContent)} className="bg-[#1F2738] text-[#C9A94D] border border-[#C9A94D] rounded-xl" />

                            <div className="flex gap-4 justify-start mt-6">
                                <button onClick={handleSave} className="bg-[#C9A94D] hover:bg-[#af8d28] text-white px-6 py-2 rounded-xl font-medium">
                                    Save Terms & Conditions
                                </button>
                                <button onClick={handleCancel} className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-xl font-medium">
                                    Cancel
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="self-stretch text-justify justify-start md:leading-7 tracking-tight whitespace-pre-line" dangerouslySetInnerHTML={{ __html: content }} />
                            <div className="flex justify-end mt-6">
                                <button onClick={() => setIsEditing(true)} className="bg-[#C9A94D] hover:bg-[#af8d28] text-white px-6 py-2 rounded-xl font-medium">
                                    Edit Details
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EditTermsCondition;
