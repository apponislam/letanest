import { useState, useRef, useMemo } from "react";
import { toast } from "sonner";
import dynamic from "next/dynamic";
import { useCreateTermsMutation, useDeleteTermMutation } from "@/redux/features/public/publicApi";

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

interface TermsSelectionProps {
    onTermsChange: (termsId: string | null) => void;
    selectedCustomTermsId: string | null;
    setSelectedCustomTermsId: (id: string | null) => void;
}

const TermsSelection: React.FC<TermsSelectionProps> = ({ onTermsChange, selectedCustomTermsId, setSelectedCustomTermsId }) => {
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [editorContent, setEditorContent] = useState("");
    const [deleteTerm] = useDeleteTermMutation();
    const editorRef = useRef<any>(null);

    // Use the mutation to create terms
    const [createTerms, { isLoading: isCreating }] = useCreateTermsMutation();

    const handleUploadTerms = async () => {
        if (!editorContent.trim()) {
            toast.error("Please enter terms and conditions content");
            return;
        }

        try {
            // Create the terms using the mutation
            const result = await createTerms({
                content: editorContent,
                creatorType: "HOST",
                hostTarget: "property",
            }).unwrap();

            if (result.success && result.data?._id) {
                // Pass the actual _id from the API response
                onTermsChange(result.data._id);
                toast.success("Custom terms and conditions uploaded!");
                setShowUploadModal(false);
                setEditorContent("");
            } else {
                toast.error("Failed to upload terms and conditions");
            }
        } catch (error: any) {
            console.error("Error creating terms:", error);
            toast.error(error?.data?.message || "Failed to upload terms and conditions");
        }
    };

    const handleRemoveCustom = async () => {
        if (!selectedCustomTermsId) return;

        // Store the ID before setting to null
        const termsIdToDelete = selectedCustomTermsId;

        // Set to null immediately
        setSelectedCustomTermsId(null);
        onTermsChange(null);
        toast.info("Custom terms and conditions removed!");

        // Delete using the stored ID
        try {
            await deleteTerm(termsIdToDelete).unwrap();
        } catch (error: any) {
            console.error("Error deleting terms:", error);
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
            // Simplified config to avoid cursor issues
            enableDragAndDropFileToEditor: false,
            askBeforePasteHTML: false,
            askBeforePasteFromWord: false,
            allowTabNavigation: false,
            autofocus: false, // Disable autofocus as it can cause issues
            saveHeightInStorage: false,
            toolbarAdaptive: false,
            disablePlugins: ["mobile", "speechRecognize", "wrapNodes"], // Disable problematic plugins
        }),
        []
    );

    // Handle editor instance creation
    const handleEditorInstance = (editor: any) => {
        editorRef.current = editor;

        // Add event listeners to prevent cursor issues
        if (editor) {
            editor.events.on("afterInit", () => {
                console.log("Editor initialized");
            });
        }
    };

    return (
        <div>
            <div className="flex items-center justify-end gap-2 flex-col md:flex-row">
                {!selectedCustomTermsId ? (
                    <button className="bg-[#626A7D] py-1 px-7 text-white rounded-[8px] w-full md:w-auto hover:bg-[#535a6b] transition" onClick={() => setShowUploadModal(true)}>
                        Upload Your Own Host T&Cs
                    </button>
                ) : (
                    <button className="w-full bg-red-600 py-1 px-7 text-white rounded-[8px] hover:bg-red-700 transition" onClick={handleRemoveCustom}>
                        Remove Custom T&Cs
                    </button>
                )}
            </div>

            {/* Upload Modal */}
            {showUploadModal && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-[8px] w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                        <div className="bg-[#626A7D] text-white p-4">
                            <h3 className="text-lg font-semibold">Upload Your Own Terms & Conditions</h3>
                            <p className="text-sm opacity-90">Create or paste your custom terms and conditions</p>
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
                                    setShowUploadModal(false);
                                    setEditorContent("");
                                }}
                                disabled={isCreating}
                            >
                                Cancel
                            </button>
                            <button className="bg-[#C9A94D] text-white py-2 px-6 rounded-[8px] hover:bg-[#bfa14a] transition disabled:opacity-50 disabled:cursor-not-allowed" onClick={handleUploadTerms} disabled={!editorContent.trim() || isCreating}>
                                {isCreating ? "Uploading..." : "Upload Terms"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TermsSelection;
