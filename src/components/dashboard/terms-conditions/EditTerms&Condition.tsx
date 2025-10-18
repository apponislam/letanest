"use client";
import { Check, X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import PageHeader from "@/components/PageHeader";
import { useCreateTermsMutation, useUpdateTermMutation, useGetTermsByTargetQuery } from "@/redux/features/public/publicApi";
import "jodit/es2021/jodit.fat.min.css";

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

type TermsTarget = "GUEST" | "HOST";

const EditTermsCondition = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [content, setContent] = useState("");
    const [role, setRole] = useState<TermsTarget>("GUEST");
    const [termId, setTermId] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const editor = useRef(null);

    const { data: termsData, isLoading, refetch } = useGetTermsByTargetQuery(role);
    const [createTerm, { isLoading: isCreating }] = useCreateTermsMutation();
    const [updateTerm, { isLoading: isUpdating }] = useUpdateTermMutation();

    useEffect(() => {
        const termsArray = termsData?.data || [];
        console.log("🔍 FULL TERMS DATA for role", role, ":", termsArray);
        console.log("🔍 Looking for admin terms with target:", role);

        const adminTerm = termsArray.find((t) => t.creatorType === "ADMIN" && t.target === role);
        console.log("🔍 Found admin term:", adminTerm);

        if (adminTerm) {
            setContent(adminTerm.content);
            setTermId(adminTerm._id || null);
            console.log("🔍 Set content and termId for", role, "termId:", adminTerm._id);
            return;
        }

        console.log("🔍 No admin term found for role:", role);
        setContent("");
        setTermId(null);
    }, [termsData, role]);

    const handleCancel = () => {
        setIsEditing(false);
        refetch();
    };

    const handleSave = async () => {
        setError(null);

        if (!content.trim()) {
            setError("Content cannot be empty");
            return;
        }

        try {
            const payload = {
                content: content.trim(),
                target: role,
                creatorType: "ADMIN" as const,
            };

            console.log("💾 SAVE START - Role:", role, "Payload:", payload, "Current termId:", termId);

            if (termId) {
                console.log("💾 UPDATING existing term:", termId);
                await updateTerm({ id: termId, data: payload }).unwrap();
                console.log("💾 UPDATE SUCCESS");
            } else {
                console.log("💾 CREATING new term");
                const res = await createTerm(payload).unwrap();
                console.log("💾 CREATE SUCCESS - Response:", res);
                setTermId(res.data?._id || null);
            }

            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
            setIsEditing(false);
            console.log("💾 Refetching after save...");
            refetch();
        } catch (err: any) {
            console.error("❌ SAVE ERROR:", err);
            console.error("❌ Error details:", err.data);
            setError(err?.data?.message || "Failed to save Terms & Conditions.");
        }
    };

    const config = {
        readonly: false,
        toolbarSticky: false,
        height: 400,
        theme: "dark",
        color: "#C9A94D",
        toolbarAdaptive: false,
        buttons: ["source", "|", "bold", "italic", "underline", "strikethrough", "|", "ul", "ol", "outdent", "indent", "|", "font", "fontsize", "brush", "paragraph", "|", "table", "link", "hr", "|", "align", "undo", "redo", "|", "copyformat", "fullsize", "selectall", "print", "preview", "find"],
        uploader: { insertImageAsBase64URI: true },
    };

    return (
        <div className="container mx-auto px-4 md:px-0 py-6">
            <PageHeader title="Terms & Conditions" />

            <div className="flex justify-center mb-6">
                <div className="flex border border-[#C9A94D] rounded-lg overflow-hidden bg-white">
                    {["GUEST", "HOST"].map((r) => (
                        <button
                            key={r}
                            type="button"
                            onClick={() => {
                                console.log("🔄 SWITCHING ROLE to:", r);
                                setRole(r as TermsTarget);
                            }}
                            className={`px-6 py-2 font-semibold transition-colors ${role === r ? "bg-[#C9A94D] text-white rounded-lg" : "bg-white text-[#C9A94D] hover:bg-gray-50"}`}
                            disabled={isLoading}
                        >
                            {r.charAt(0) + r.slice(1).toLowerCase()}
                        </button>
                    ))}
                </div>
            </div>

            <div className="bg-[#2D3546] p-5 rounded-[4px]">
                <h1 className="text-2xl font-bold text-[#C9A94D] mb-4">Manage Admin Terms & Conditions {role === "GUEST" ? "for Guests" : "for Hosts"}</h1>
                <p className="text-[#B6BAC3] mb-4">
                    This is the default Terms & Conditions for {role === "GUEST" ? "all guests" : "all hosts"}.{role === "HOST" ? " Hosts can also create property-specific T&C separately." : ""}
                </p>

                {success && (
                    <div className="flex items-center gap-4 bg-[#DAEEDF] rounded-[12px] p-[10px] mb-6">
                        <div className="w-6 h-6 bg-[#00A62C] text-white rounded-full flex items-center justify-center">
                            <Check className="w-5 h-5" />
                        </div>
                        <p className="text-[#00A62C] font-medium">
                            {role} Terms & Conditions {termId ? "updated" : "created"} successfully.
                        </p>
                    </div>
                )}

                {error && (
                    <div className="flex items-center gap-4 bg-[#FFE1E1] rounded-[12px] p-[10px] mb-6">
                        <div className="w-6 h-6 bg-[#FF4D4D] text-white rounded-full flex items-center justify-center">
                            <X className="w-5 h-5" />
                        </div>
                        <p className="text-[#FF4D4D] font-medium">{error}</p>
                        <button onClick={() => setError(null)} className="ml-auto text-[#FF4D4D] hover:text-[#ff1a1a]">
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                )}

                {isLoading ? (
                    <div className="flex justify-center items-center py-8">
                        <p className="text-[#B6BAC3]">Loading Terms & Conditions...</p>
                    </div>
                ) : (
                    <div className="bg-[#1F2738] rounded-2xl p-4 text-[#B6BAC3] md:text-lg font-medium">
                        {isEditing ? (
                            <>
                                <JoditEditor ref={editor} value={content} config={config} onBlur={(newContent) => setContent(newContent)} className="bg-[#1F2738] text-[#C9A94D] border border-[#C9A94D] rounded-xl" />
                                <div className="flex gap-4 justify-start mt-6">
                                    <button onClick={handleSave} className="bg-[#C9A94D] hover:bg-[#af8d28] text-white px-6 py-2 rounded-[10px] font-medium disabled:opacity-50 disabled:cursor-not-allowed" disabled={isCreating || isUpdating}>
                                        {isCreating || isUpdating ? "Saving..." : `${termId ? "Update" : "Create"} Admin ${role} Terms & Conditions`}
                                    </button>
                                    <button onClick={handleCancel} className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-xl font-medium disabled:opacity-50" disabled={isCreating || isUpdating}>
                                        Cancel
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <div
                                    className="rich-text-content self-stretch text-justify justify-start md:leading-7 tracking-tight whitespace-pre-line min-h-[200px]"
                                    dangerouslySetInnerHTML={{
                                        __html:
                                            content ||
                                            `
                                            <div class="text-center py-8 text-gray-400">
                                                <p>No Admin Terms & Conditions set yet for ${role.toLowerCase()}s.</p>
                                                <p class="text-sm mt-2">Click "Create Terms & Conditions" to set up the official platform terms.</p>
                                            </div>
                                        `,
                                    }}
                                />
                                <div className="flex justify-end mt-6">
                                    <button
                                        onClick={() => {
                                            console.log("✏️ EDIT CLICKED - Current state:", { role, termId, contentLength: content.length });
                                            setIsEditing(true);
                                        }}
                                        className="bg-[#C9A94D] hover:bg-[#af8d28] text-white px-6 py-2 rounded-[10px] transition-colors"
                                    >
                                        {content ? "Edit Admin Terms" : "Create Admin Terms"}
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default EditTermsCondition;
