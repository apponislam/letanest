"use client";
import { Check, X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import PageHeader from "@/components/PageHeader";
import "jodit/es2021/jodit.fat.min.css";
import { useCreateOrUpdatePrivacyPolicyMutation, useGetPrivacyPolicyQuery, useUpdatePrivacyPolicyMutation } from "@/redux/features/PrivacyPolicy/privacyPolicyApi";

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

const EditPrivacyPolicy = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [content, setContent] = useState("");
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const editor = useRef(null);

    const { data: privacyData, isLoading, refetch } = useGetPrivacyPolicyQuery(undefined as void);
    const [createOrUpdatePrivacy, { isLoading: isCreating }] = useCreateOrUpdatePrivacyPolicyMutation();
    const [updatePrivacy, { isLoading: isUpdating }] = useUpdatePrivacyPolicyMutation();

    useEffect(() => {
        if (privacyData?.data) {
            setContent(privacyData.data.content || "");
        } else {
            setContent("");
        }
    }, [privacyData]);

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
                effectiveDate: new Date(),
            };

            if (privacyData?.data) {
                await updatePrivacy(payload).unwrap();
            } else {
                await createOrUpdatePrivacy(payload).unwrap();
            }

            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
            setIsEditing(false);
            refetch();
        } catch (err: any) {
            setError(err?.data?.message || "Failed to save Privacy Policy.");
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
            <PageHeader title="Privacy Policy" />

            <div className="bg-[#2D3546] p-5 rounded-[4px]">
                <h1 className="text-2xl font-bold text-[#C9A94D] mb-4">Manage Privacy Policy</h1>
                <p className="text-[#B6BAC3] mb-4">This is the platform's Privacy Policy that applies to all users.</p>

                {success && (
                    <div className="flex items-center gap-4 bg-[#DAEEDF] rounded-[12px] p-[10px] mb-6">
                        <div className="w-6 h-6 bg-[#00A62C] text-white rounded-full flex items-center justify-center">
                            <Check className="w-5 h-5" />
                        </div>
                        <p className="text-[#00A62C] font-medium">Privacy Policy {privacyData?.data ? "updated" : "created"} successfully.</p>
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
                        <p className="text-[#B6BAC3]">Loading Privacy Policy...</p>
                    </div>
                ) : (
                    <div className="bg-[#1F2738] rounded-2xl p-4 text-[#B6BAC3] md:text-lg font-medium">
                        {isEditing ? (
                            <>
                                <JoditEditor ref={editor} value={content} config={config} onBlur={(newContent) => setContent(newContent)} className="bg-[#1F2738] text-[#C9A94D] border border-[#C9A94D] rounded-xl" />
                                <div className="flex gap-4 justify-start mt-6">
                                    <button onClick={handleSave} className="bg-[#C9A94D] hover:bg-[#af8d28] text-white px-6 py-2 rounded-[10px] font-medium disabled:opacity-50 disabled:cursor-not-allowed" disabled={isCreating || isUpdating}>
                                        {isCreating || isUpdating ? "Saving..." : `${privacyData?.data ? "Update" : "Create"} Privacy Policy`}
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
                                                <p>No Privacy Policy set yet.</p>
                                                <p class="text-sm mt-2">Click "Create Privacy Policy" to set up the official platform privacy policy.</p>
                                            </div>
                                        `,
                                    }}
                                />
                                <div className="flex justify-end mt-6">
                                    <button onClick={() => setIsEditing(true)} className="bg-[#C9A94D] hover:bg-[#af8d28] text-white px-6 py-2 rounded-[10px] transition-colors">
                                        {content ? "Edit Privacy Policy" : "Create Privacy Policy"}
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

export default EditPrivacyPolicy;
