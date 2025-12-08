"use client";
import React, { useState, useEffect, useRef, useMemo } from "react";
import { Plus, Edit, Trash2, Save, X, Bot, MessageSquare, Bell, Clock, Megaphone, Settings } from "lucide-react";
import { useCreateMessageTypeMutation, useUpdateMessageTypeMutation, useDeleteMessageTypeMutation, IMessageType, CreateMessageTypeDto, UpdateMessageTypeDto, useGetAllMessageTypesQuery } from "@/redux/features/messagetypes/messageTypesApi";
import dynamic from "next/dynamic";

// Dynamically import JoditEditor to avoid SSR issues
const JoditEditor = dynamic(() => import("jodit-react"), {
    ssr: false,
    loading: () => <div className="h-96 w-full bg-[#434D64] animate-pulse rounded-lg"></div>,
});

// Import Jodit type
import { Jodit } from "jodit-react";

const BotMessagesPage = () => {
    const { data: response, isLoading, error, refetch } = useGetAllMessageTypesQuery();

    const [createMessageType, { isLoading: isCreatingLoading }] = useCreateMessageTypeMutation();
    const [updateMessageType, { isLoading: isUpdatingLoading }] = useUpdateMessageTypeMutation();
    const [deleteMessageType, { isLoading: isDeletingLoading }] = useDeleteMessageTypeMutation();

    const [isCreating, setIsCreating] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState<CreateMessageTypeDto>({
        name: "",
        type: "WELCOME",
        content: "",
    });

    // Jodit editor configuration - properly typed
    const editorConfig = useMemo(() => {
        const config = {
            readonly: false,
            placeholder: "Enter your message content here...",
            toolbarAdaptive: true,
            toolbarSticky: true,

            // Basic text formatting buttons only - no upload buttons
            buttons: ["bold", "italic", "underline", "strikethrough", "|", "ul", "ol", "|", "fontsize", "font", "brush", "paragraph", "|", "align", "outdent", "indent", "|", "link", "|", "undo", "redo", "|", "selectall", "copyformat", "|", "hr", "|", "source", "preview", "fullsize"],

            // Remove upload/file/image related features
            showXPathInStatusbar: false,
            askBeforePasteHTML: false,
            askBeforePasteFromWord: false,

            // Optimize for text editing
            disablePlugins: ["image", "file", "media", "video", "imageProcessor", "image-properties", "paste", "pasteStorage", "clipboard"],

            // Style configuration
            height: 400,
            minHeight: 200,
            maxHeight: 600,

            // Focus and cursor management
            autofocus: true,

            // Styling
            style: {
                backgroundColor: "#434D64",
                color: "#ffffff",
                minHeight: "200px",
            },

            // Color scheme
            colors: {
                backgroundColor: "#434D64",
                color: "#ffffff",
            },

            // Remove uploader completely
            uploader: undefined,
            filebrowser: undefined,

            // Performance optimizations
            statusbar: true,
            showCharsCounter: false,
            showWordsCounter: false,
            showPlaceholder: true,

            theme: "dark",

            // Event handlers for better cursor management
            events: {
                afterInit: function (editor: any) {
                    // Ensure cursor is visible and working
                    editor.editor.setAttribute("contenteditable", "true");
                },
                blur: function () {
                    // Handle blur event if needed
                },
                focus: function () {
                    // Ensure focus stays
                },
            },
        };
        return config;
    }, []);

    // Reset form when creating is cancelled
    useEffect(() => {
        if (!isCreating) {
            setFormData({
                name: "",
                type: "WELCOME",
                content: "",
            });
        }
    }, [isCreating]);

    // Extract message types from API response
    const messageTypes = React.useMemo(() => {
        if (!response) return [];
        return Array.isArray(response) ? response : response?.data ? response.data : [];
    }, [response]);

    const handleCreate = async () => {
        if (!formData.name.trim() || !formData.type.trim() || !formData.content.trim()) {
            alert("Please fill in all required fields: Name, Type, and Content");
            return;
        }

        try {
            await createMessageType(formData).unwrap();
            setIsCreating(false);
            setFormData({ name: "", type: "WELCOME", content: "" });
            refetch();
        } catch (error) {
            console.error("Failed to create message type:", error);
            alert("Failed to create template. Please try again.");
        }
    };

    const handleUpdate = async (id: string, data: UpdateMessageTypeDto) => {
        try {
            await updateMessageType({ id, data }).unwrap();
            setEditingId(null);
            refetch();
        } catch (error) {
            console.error("Failed to update message type:", error);
            alert("Failed to update template. Please try again.");
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm("Are you sure you want to delete this message type?")) {
            try {
                await deleteMessageType(id).unwrap();
                refetch();
            } catch (error) {
                console.error("Failed to delete message type:", error);
                alert("Failed to delete template. Please try again.");
            }
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case "WELCOME":
                return <MessageSquare className="w-4 h-4" />;
            case "REMINDER":
                return <Clock className="w-4 h-4" />;
            case "SYSTEM":
                return <Settings className="w-4 h-4" />;
            default:
                return <Bot className="w-4 h-4" />;
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case "WELCOME":
                return "bg-[#C9A94D] text-[#14213D] border-[#C9A94D] font-bold";
            case "REMINDER":
                return "bg-[#434D64] text-white border-[#434D64] font-bold";
            case "SYSTEM":
                return "bg-[#14213D] text-white border-[#14213D] font-bold";
            default:
                return "bg-[#B6BAC3] text-[#14213D] border-[#B6BAC3] font-bold";
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#14213D] p-6">
                <div className="max-w-6xl mx-auto">
                    <div className="animate-pulse">
                        <div className="h-8 bg-[#434D64] rounded w-1/4 mb-6"></div>
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-20 bg-[#434D64] rounded"></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#14213D] p-6">
                <div className="max-w-6xl mx-auto">
                    <div className="bg-red-500 bg-opacity-20 border border-red-500 text-red-500 px-4 py-3 rounded">Error loading bot messages</div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#14213D] p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Bot Messages</h1>
                        <p className="text-[#B6BAC3] mt-2">Manage automated bot message templates</p>
                    </div>
                    <button onClick={() => setIsCreating(true)} disabled={isCreatingLoading} className="flex items-center gap-2 bg-[#C9A94D] text-[#14213D] px-4 py-2 rounded-lg hover:bg-[#b8973e] transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed">
                        <Plus className="w-5 h-5" />
                        {isCreatingLoading ? "Creating..." : "Add New Template"}
                    </button>
                </div>

                {/* Create Form */}
                {isCreating && (
                    <div className="bg-[#1a1a2e] rounded-lg shadow-md p-6 mb-6 border border-[#C9A94D]">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-white">Create New Template</h3>
                            <button onClick={() => setIsCreating(false)} disabled={isCreatingLoading} className="text-[#B6BAC3] hover:text-white disabled:opacity-50">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-[#B6BAC3] mb-1">Name *</label>
                                <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full bg-[#434D64] border border-[#434D64] text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#C9A94D] focus:border-transparent placeholder-[#B6BAC3]" placeholder="Template name" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[#B6BAC3] mb-1">Type *</label>
                                <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value as "WELCOME" | "REMINDER" | "SYSTEM" })} className="w-full bg-[#434D64] border border-[#434D64] text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#C9A94D] focus:border-transparent" required>
                                    <option value="WELCOME">Welcome</option>
                                    <option value="REMINDER">Reminder</option>
                                    <option value="SYSTEM">System</option>
                                </select>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-[#B6BAC3] mb-1">Content *</label>
                                <div className="jodit-editor-container">
                                    <JoditEditor
                                        value={formData.content}
                                        config={editorConfig as any}
                                        onBlur={(newContent: string) => setFormData({ ...formData, content: newContent })}
                                        onChange={(newContent: string) => {
                                            setFormData({ ...formData, content: newContent });
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 mt-6">
                            <button onClick={() => setIsCreating(false)} disabled={isCreatingLoading} className="px-4 py-2 text-[#B6BAC3] border border-[#434D64] rounded-lg hover:bg-[#434D64] transition-colors disabled:opacity-50">
                                Cancel
                            </button>
                            <button onClick={handleCreate} disabled={isCreatingLoading || !formData.name.trim() || !formData.type.trim() || !formData.content.trim()} className="flex items-center gap-2 bg-[#C9A94D] text-[#14213D] px-4 py-2 rounded-lg hover:bg-[#b8973e] transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed">
                                <Save className="w-4 h-4" />
                                {isCreatingLoading ? "Creating..." : "Create Template"}
                            </button>
                        </div>
                    </div>
                )}

                {/* Message Types List */}
                <div className="bg-[#1a1a2e] rounded-lg shadow-md overflow-hidden">
                    {messageTypes.length === 0 ? (
                        <div className="text-center py-12">
                            <Bot className="w-16 h-16 text-[#434D64] mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-white mb-2">No templates yet</h3>
                            <p className="text-[#B6BAC3] mb-4">Create your first bot message template to get started</p>
                            <button onClick={() => setIsCreating(true)} className="bg-[#C9A94D] text-[#14213D] px-4 py-2 rounded-lg hover:bg-[#b8973e] transition-colors font-semibold">
                                Create Template
                            </button>
                        </div>
                    ) : (
                        <div className="divide-y divide-[#434D64]">
                            {messageTypes.map((template: IMessageType) => (
                                <div key={template._id} className="p-6 transition-colors">
                                    {editingId === template._id ? (
                                        <EditForm template={template} onSave={(data) => handleUpdate(template._id, data)} onCancel={() => setEditingId(null)} isLoading={isUpdatingLoading} editorConfig={editorConfig} />
                                    ) : (
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="text-lg font-semibold text-white">{template.name}</h3>
                                                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold border ${getTypeColor(template.type)}`}>
                                                        {getTypeIcon(template.type)}
                                                        {template.type.toLowerCase()}
                                                    </span>
                                                    {!template.isActive && <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-red-500 text-white border border-red-500">Inactive</span>}
                                                </div>
                                                <div className="text-white bg-[#434D64] p-3 rounded-lg border border-[#434D64] mb-2 prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: template.content }}></div>
                                                {template.variables && template.variables.length > 0 && (
                                                    <div className="mt-2">
                                                        <span className="text-sm text-[#B6BAC3]">Variables: </span>
                                                        {template.variables.map((variable, index) => (
                                                            <span key={index} className="inline-block bg-[#C9A94D] bg-opacity-20 text-[#C9A94D] text-xs px-2 py-1 rounded mr-2">
                                                                {variable}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2 ml-4">
                                                <button onClick={() => setEditingId(template._id)} disabled={isDeletingLoading} className="p-2 text-white bg-[#C9A94D] rounded-lg hover:bg-[#b8973e] transition-colors disabled:opacity-50 shadow-md border border-[#C9A94D]" title="Edit template">
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => handleDelete(template._id)} disabled={isDeletingLoading} className="p-2 text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 shadow-md border border-red-500" title="Delete template">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// Edit Form Component
const EditForm = ({ template, onSave, onCancel, isLoading, editorConfig }: { template: IMessageType; onSave: (data: UpdateMessageTypeDto) => void; onCancel: () => void; isLoading: boolean; editorConfig: any }) => {
    const [formData, setFormData] = useState<UpdateMessageTypeDto>({
        name: template.name,
        type: template.type,
        content: template.content,
        isActive: template.isActive,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    const isFormValid = formData.name?.trim() && formData.type?.trim() && formData.content?.trim();

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-[#B6BAC3] mb-1">Name *</label>
                    <input type="text" value={formData.name || ""} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full bg-[#434D64] border border-[#434D64] text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#C9A94D] focus:border-transparent" required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-[#B6BAC3] mb-1">Type *</label>
                    <select value={formData.type || "WELCOME"} onChange={(e) => setFormData({ ...formData, type: e.target.value as "WELCOME" | "REMINDER" | "SYSTEM" })} className="w-full bg-[#434D64] border border-[#434D64] text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#C9A94D] focus:border-transparent" required>
                        <option value="WELCOME">Welcome</option>
                        <option value="REMINDER">Reminder</option>
                        <option value="SYSTEM">System</option>
                    </select>
                </div>
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-[#B6BAC3] mb-1">Content *</label>
                    <div className="jodit-editor-container">
                        <JoditEditor
                            value={formData.content || ""}
                            config={editorConfig as any}
                            onBlur={(newContent: string) => setFormData({ ...formData, content: newContent })}
                            onChange={(newContent: string) => {
                                setFormData({ ...formData, content: newContent });
                            }}
                        />
                    </div>
                </div>
                <div className="flex items-center">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={formData.isActive || false} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} className="rounded border-[#434D64] bg-[#434D64] text-[#C9A94D] focus:ring-[#C9A94D]" />
                        <span className="text-sm text-[#B6BAC3]">Active</span>
                    </label>
                </div>
            </div>
            <div className="flex justify-end gap-3">
                <button type="button" onClick={onCancel} disabled={isLoading} className="px-4 py-2 text-[#B6BAC3] border border-[#434D64] rounded-lg hover:bg-[#434D64] transition-colors disabled:opacity-50">
                    Cancel
                </button>
                <button type="submit" disabled={isLoading || !isFormValid} className="flex items-center gap-2 bg-[#C9A94D] text-[#14213D] px-4 py-2 rounded-lg hover:bg-[#b8973e] transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed">
                    <Save className="w-4 h-4" />
                    {isLoading ? "Saving..." : "Save Changes"}
                </button>
            </div>
        </form>
    );
};

export default BotMessagesPage;
