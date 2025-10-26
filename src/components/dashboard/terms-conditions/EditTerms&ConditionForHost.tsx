"use client";
import { Check, X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import PageHeader from "@/components/PageHeader";
import { useGetDefaultHostTermsQuery, useCreateTermsMutation, useUpdateTermMutation, useGetMyDefaultHostTermsQuery } from "@/redux/features/public/publicApi";
import "jodit/es2021/jodit.fat.min.css";

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

const EditTermsConditionForHost = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [content, setContent] = useState("");
    const [success, setSuccess] = useState(false);
    const [termId, setTermId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const editor = useRef(null);

    const { data: defaultHostTerm, isLoading, refetch } = useGetMyDefaultHostTermsQuery();
    console.log(defaultHostTerm);
    const [createTerm, { isLoading: isCreating }] = useCreateTermsMutation();
    const [updateTerm, { isLoading: isUpdating }] = useUpdateTermMutation();

    useEffect(() => {
        if (defaultHostTerm?.data) {
            setContent(defaultHostTerm.data.content);
            setTermId(defaultHostTerm.data._id || null);
        } else {
            setContent("");
            setTermId(null);
        }
    }, [defaultHostTerm]);

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
                target: "GUEST" as const, // Cast to literal type
                creatorType: "HOST" as const,
                hostTarget: "default" as const,
            };

            console.log("💾 Saving host terms:", payload);

            if (termId) {
                await updateTerm({ id: termId, data: payload }).unwrap();
            } else {
                const res = await createTerm(payload).unwrap();
                setTermId(res?.data?._id || null);
            }

            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
            setIsEditing(false);
            refetch();
        } catch (error: any) {
            console.error("❌ Save error:", error);
            setError(error?.data?.message || "Failed to save Host Terms & Conditions");
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
            <PageHeader title="Host Terms & Conditions" />

            <div className="bg-[#2D3546] p-5 rounded-[4px]">
                <h1 className="text-2xl font-bold text-[#C9A94D] mb-4">Manage Host Default Terms & Conditions</h1>
                <p className="text-[#B6BAC3] mb-4">This is the default T&C for all host properties. Hosts can also create property-specific T&C separately.</p>

                {success && (
                    <div className="flex items-center gap-4 bg-[#DAEEDF] rounded-[12px] p-[10px] mb-6">
                        <div className="w-6 h-6 bg-[#00A62C] text-white rounded-full flex items-center justify-center">
                            <Check className="w-5 h-5" />
                        </div>
                        <p className="text-[#00A62C] font-medium">Default Host Terms & Conditions saved successfully.</p>
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
                    <p className="text-[#B6BAC3]">Loading...</p>
                ) : (
                    <div className="bg-[#1F2738] rounded-2xl p-4 text-[#B6BAC3] md:text-lg font-medium">
                        {isEditing ? (
                            <>
                                <JoditEditor ref={editor} value={content} config={config} onBlur={(newContent) => setContent(newContent)} />
                                <div className="flex gap-4 mt-6">
                                    <button onClick={handleSave} className="bg-[#C9A94D] hover:bg-[#af8d28] text-white px-6 py-2 rounded-[10px] font-medium" disabled={isUpdating || isCreating}>
                                        {isUpdating || isCreating ? "Saving..." : "Save Changes"}
                                    </button>
                                    <button onClick={handleCancel} className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-xl font-medium">
                                        Cancel
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="rich-text-content text-justify leading-7 tracking-tight" dangerouslySetInnerHTML={{ __html: content || "<p>No default T&C set yet.</p>" }} />
                                <div className="flex justify-end mt-6">
                                    <button onClick={() => setIsEditing(true)} className="bg-[#C9A94D] hover:bg-[#af8d28] text-white px-6 py-2 rounded-[10px]">
                                        {content ? "Edit Default Host T&C" : "Create Default Host T&C"}
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

export default EditTermsConditionForHost;
