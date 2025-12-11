"use client";

import { useState, useRef, useMemo, useEffect } from "react";
import { toast } from "sonner";
import dynamic from "next/dynamic";
import { useCreateTermsMutation } from "@/redux/features/public/publicApi";

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

interface DefaultTermsEditModalProps {
    defaultTermsResponse: any;
    setSelectedTermsId: (id: string | null) => void;
    setSelectedCustomTermsId: (id: string | null) => void;
    setShowOptions: (show: boolean) => void;
    isOpen: boolean;
    onClose: () => void;
}

const DefaultTermsEditModal: React.FC<DefaultTermsEditModalProps> = ({ defaultTermsResponse, setSelectedTermsId, setSelectedCustomTermsId, setShowOptions, isOpen, onClose }) => {
    const [editorContent, setEditorContent] = useState("");
    const editorRef = useRef<any>(null);

    // Use the mutation to create terms
    const [createTerms, { isLoading: isCreating }] = useCreateTermsMutation();

    // Load default terms content when modal opens
    useEffect(() => {
        if (isOpen && defaultTermsResponse?.data?.content) {
            setEditorContent(defaultTermsResponse.data.content);
        } else {
            setEditorContent("");
        }
    }, [isOpen, defaultTermsResponse]);

    const handleEditDefaultTerms = async () => {
        if (!editorContent.trim()) {
            toast.error("Please enter terms and conditions content");
            return;
        }

        try {
            // Create NEW terms from edited default
            const result = await createTerms({
                content: editorContent,
                creatorType: "HOST",
                hostTarget: "property",
            }).unwrap();

            if (result.success && result.data?._id) {
                // Set as selectedTermsId (this will be the new edited default)
                setSelectedTermsId(result.data._id);
                setSelectedCustomTermsId(null); // Clear custom if selected
                toast.success("Default terms and conditions updated!");
                onClose();
                setShowOptions(false);
                setEditorContent("");
            } else {
                toast.error("Failed to update default terms and conditions");
            }
        } catch (error: any) {
            console.error("Error creating terms:", error);
            toast.error(error?.data?.message || "Failed to update default terms and conditions");
        }
    };

    // Use useMemo to prevent config recreation on every render
    const editorConfig = useMemo(
        () => ({
            readonly: false,
            height: 400,
            theme: "default",
            buttons: ["bold", "italic", "underline", "strikethrough", "|", "ul", "ol", "|", "outdent", "indent", "|", "font", "fontsize", "brush", "|", "align", "|", "link", "|", "undo", "redo", "|", "preview", "fullscreen"],
            style: {
                background: "#ffffff",
                color: "#626A7D",
            },
            enableDragAndDropFileToEditor: false,
            askBeforePasteHTML: false,
            askBeforePasteFromWord: false,
            allowTabNavigation: false,
            autofocus: false,
            saveHeightInStorage: false,
            toolbarAdaptive: false,
            disablePlugins: ["mobile", "speechRecognize", "wrapNodes"],
        }),
        []
    );

    // Handle editor instance creation
    const handleEditorInstance = (editor: any) => {
        editorRef.current = editor;
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-[8px] w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                <div className="bg-[#626A7D] text-white p-4">
                    <h3 className="text-lg font-semibold">Edit Default Terms & Conditions</h3>
                    <p className="text-sm opacity-90">Edit and create new default terms and conditions</p>
                </div>

                <div className="p-4 flex-1 overflow-hidden">
                    <div className="mb-4 h-full">
                        <label className="block text-sm font-medium text-[#626A7D] mb-2">Terms & Conditions Content</label>
                        <div className="h-96 border border-gray-300 rounded">
                            <JoditEditor ref={handleEditorInstance} value={editorContent} config={editorConfig} onBlur={(newContent) => setEditorContent(newContent)} tabIndex={1} />
                        </div>
                    </div>
                </div>

                <div className="bg-gray-50 p-4 flex justify-end gap-3">
                    <button
                        className="bg-[#B6BAC3] text-[#626A7D] py-2 px-6 rounded-[8px] hover:bg-gray-300 transition"
                        onClick={() => {
                            onClose();
                            setEditorContent("");
                        }}
                        disabled={isCreating}
                    >
                        Cancel
                    </button>
                    <button className="bg-[#C9A94D] text-white py-2 px-6 rounded-[8px] hover:bg-[#bfa14a] transition disabled:opacity-50 disabled:cursor-not-allowed" onClick={handleEditDefaultTerms} disabled={!editorContent.trim() || isCreating}>
                        {isCreating ? "Creating..." : "Create New Default Terms"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DefaultTermsEditModal;
