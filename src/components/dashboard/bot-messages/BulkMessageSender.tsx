// "use client";
// import React, { useState, useEffect } from "react";
// import { Send, Users, User, Users2, Bot, AlertCircle, CheckCircle, Clock, Megaphone, MessageSquare, Settings, ArrowRight, X, Eye, FileText, Target } from "lucide-react";
// import { toast } from "sonner";
// import dynamic from "next/dynamic";

// // Dynamically import JoditEditor to avoid SSR issues
// const JoditEditor = dynamic(() => import("jodit-react"), {
//     ssr: false,
//     loading: () => <div className="h-96 w-full bg-[#434D64] animate-pulse rounded-lg"></div>,
// });

// // Import RTK Query hooks
// import { useSendMessageToAllMutation, useGetActiveMessageTemplatesQuery } from "@/redux/features/messages/messageApi";

// interface MessageTemplate {
//     _id: string;
//     name: string;
//     type: "WELCOME" | "REMINDER" | "SYSTEM";
//     content: string;
//     variables?: ("name" | "propertyNumber")[];
//     isActive: boolean;
// }

// interface SendMessageForm {
//     messageTypeId: string;
//     userType: "GUEST" | "HOST" | "BOTH";
// }

// interface SendResult {
//     messageTemplate: {
//         id: string;
//         name: string;
//         type: string;
//         content: string;
//     };
//     userType: string;
//     totalUsers: number;
//     successful: number;
//     failed: number;
//     failedUserIds: string[];
//     successfulUserIds: string[];
//     errors: string[];
// }

// const BotMessageSenderPage = () => {
//     // RTK Query hooks
//     const { data: templatesResponse, isLoading: isLoadingTemplates, error: templatesError, refetch: refetchTemplates } = useGetActiveMessageTemplatesQuery({});
//     const [sendMessageToAll, { isLoading: isSending }] = useSendMessageToAllMutation();

//     // State
//     const [formData, setFormData] = useState<SendMessageForm>({
//         messageTypeId: "",
//         userType: "BOTH",
//     });
//     const [selectedTemplate, setSelectedTemplate] = useState<MessageTemplate | null>(null);
//     const [sendResult, setSendResult] = useState<SendResult | null>(null);
//     const [showPreview, setShowPreview] = useState(false);
//     const [previewContent, setPreviewContent] = useState("");

//     // Extract templates from API response
//     const templates = React.useMemo(() => {
//         if (!templatesResponse) return [];
//         return Array.isArray(templatesResponse) ? templatesResponse : templatesResponse?.data ? templatesResponse.data : [];
//     }, [templatesResponse]);

//     // Jodit editor configuration (read-only preview)
//     const editorConfig = React.useMemo(
//         () => ({
//             readonly: true,
//             toolbar: false,
//             statusbar: false,
//             showCharsCounter: false,
//             showWordsCounter: false,
//             style: {
//                 backgroundColor: "#434D64",
//                 color: "#ffffff",
//                 minHeight: "200px",
//                 padding: "1rem",
//             },
//             theme: "dark",
//         }),
//         []
//     );

//     // Update selected template when messageTypeId changes
//     useEffect(() => {
//         if (formData.messageTypeId && templates.length > 0) {
//             const template = templates.find((t: any) => t._id === formData.messageTypeId);
//             setSelectedTemplate(template || null);
//             if (template) {
//                 setPreviewContent(template.content);
//             }
//         } else {
//             setSelectedTemplate(null);
//         }
//     }, [formData.messageTypeId, templates]);

//     // Handle form submission
//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();

//         if (!formData.messageTypeId) {
//             toast.error("Please select a message template");
//             return;
//         }

//         try {
//             const result = await sendMessageToAll(formData).unwrap();
//             setSendResult(result);

//             // Show success toast
//             toast.success(`Message sent to ${result.successful} users successfully!`, {
//                 description: result.failed > 0 ? `${result.failed} users failed to receive the message.` : "All messages delivered successfully.",
//             });

//             // Reset form after successful send
//             setFormData({
//                 messageTypeId: "",
//                 userType: "BOTH",
//             });
//             setSelectedTemplate(null);
//         } catch (error: any) {
//             console.error("Failed to send message:", error);
//             toast.error("Failed to send message", {
//                 description: error?.data?.message || "Please try again later.",
//             });
//         }
//     };

//     // Get user type icon
//     const getUserTypeIcon = (type: string) => {
//         switch (type) {
//             case "GUEST":
//                 return <User className="w-4 h-4" />;
//             case "HOST":
//                 return <Users2 className="w-4 h-4" />;
//             case "BOTH":
//                 return <Users className="w-4 h-4" />;
//             default:
//                 return <Users className="w-4 h-4" />;
//         }
//     };

//     // Get template type icon
//     const getTemplateIcon = (type: string) => {
//         switch (type) {
//             case "WELCOME":
//                 return <MessageSquare className="w-4 h-4" />;
//             case "REMINDER":
//                 return <Clock className="w-4 h-4" />;
//             case "SYSTEM":
//                 return <Settings className="w-4 h-4" />;
//             default:
//                 return <FileText className="w-4 h-4" />;
//         }
//     };

//     // Get template type color
//     const getTemplateColor = (type: string) => {
//         switch (type) {
//             case "WELCOME":
//                 return "bg-[#C9A94D] text-[#14213D] border-[#C9A94D]";
//             case "REMINDER":
//                 return "bg-[#434D64] text-white border-[#434D64]";
//             case "SYSTEM":
//                 return "bg-[#14213D] text-white border-[#14213D]";
//             default:
//                 return "bg-[#B6BAC3] text-[#14213D] border-[#B6BAC3]";
//         }
//     };

//     if (isLoadingTemplates) {
//         return (
//             <div className="min-h-screen bg-[#14213D] p-6">
//                 <div className="max-w-6xl mx-auto">
//                     <div className="animate-pulse">
//                         <div className="h-8 bg-[#434D64] rounded w-1/4 mb-6"></div>
//                         <div className="h-64 bg-[#434D64] rounded mb-6"></div>
//                         <div className="space-y-4">
//                             {[1, 2, 3].map((i) => (
//                                 <div key={i} className="h-20 bg-[#434D64] rounded"></div>
//                             ))}
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         );
//     }

//     if (templatesError) {
//         return (
//             <div className="min-h-screen bg-[#14213D] p-6">
//                 <div className="max-w-6xl mx-auto">
//                     <div className="bg-red-500 bg-opacity-20 border border-red-500 text-red-500 px-4 py-3 rounded-lg flex items-center gap-2">
//                         <AlertCircle className="w-5 h-5" />
//                         Error loading message templates. Please try again.
//                     </div>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="min-h-screen bg-[#14213D] p-6">
//             <div className="max-w-6xl mx-auto">
//                 {/* Header */}
//                 <div className="flex justify-between items-center mb-8">
//                     <div>
//                         <h1 className="text-3xl font-bold text-white">Send Bulk Messages</h1>
//                         <p className="text-[#B6BAC3] mt-2">Send automated messages to multiple users</p>
//                     </div>
//                     <div className="flex items-center gap-2 text-[#C9A94D]">
//                         <Bot className="w-6 h-6" />
//                         <span className="font-semibold">Bot Manager</span>
//                     </div>
//                 </div>

//                 {/* Send Result Display */}
//                 {sendResult && (
//                     <div className="mb-6 bg-[#1a1a2e] rounded-lg p-6 border border-[#C9A94D]">
//                         <div className="flex items-center gap-3 mb-4">
//                             <CheckCircle className="w-6 h-6 text-[#C9A94D]" />
//                             <h3 className="text-xl font-bold text-white">Message Sent Successfully!</h3>
//                         </div>
//                         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
//                             <div className="bg-[#434D64] rounded-lg p-4">
//                                 <div className="text-sm text-[#B6BAC3]">Template</div>
//                                 <div className="text-white font-semibold">{sendResult.messageTemplate.name}</div>
//                                 <div className="text-xs text-[#C9A94D]">{sendResult.messageTemplate.type}</div>
//                             </div>
//                             <div className="bg-[#434D64] rounded-lg p-4">
//                                 <div className="text-sm text-[#B6BAC3]">Target Users</div>
//                                 <div className="text-white font-semibold">{sendResult.userType}</div>
//                                 <div className="text-xs text-[#C9A94D]">{sendResult.totalUsers} total users</div>
//                             </div>
//                             <div className="bg-[#434D64] rounded-lg p-4">
//                                 <div className="text-sm text-[#B6BAC3]">Delivery Status</div>
//                                 <div className="flex items-center gap-2">
//                                     <span className="text-white font-semibold">{sendResult.successful} sent</span>
//                                     {sendResult.failed > 0 && <span className="text-red-400 text-sm">({sendResult.failed} failed)</span>}
//                                 </div>
//                             </div>
//                         </div>
//                         <button onClick={() => setSendResult(null)} className="text-[#B6BAC3] hover:text-white text-sm flex items-center gap-1">
//                             <X className="w-4 h-4" />
//                             Clear result
//                         </button>
//                     </div>
//                 )}

//                 {/* Main Form */}
//                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//                     {/* Left Column: Form */}
//                     <div className="lg:col-span-2">
//                         <div className="bg-[#1a1a2e] rounded-lg shadow-md p-6 border border-[#434D64]">
//                             <div className="flex items-center gap-3 mb-6">
//                                 <Megaphone className="w-6 h-6 text-[#C9A94D]" />
//                                 <h2 className="text-xl font-bold text-white">Send Message</h2>
//                             </div>

//                             <form onSubmit={handleSubmit}>
//                                 {/* Template Selection */}
//                                 <div className="mb-6">
//                                     <label className="block text-sm font-medium text-[#B6BAC3] mb-2">
//                                         <div className="flex items-center gap-2">
//                                             <FileText className="w-4 h-4" />
//                                             Select Message Template *
//                                         </div>
//                                     </label>
//                                     <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
//                                         {templates.length === 0 ? (
//                                             <div className="text-center py-4 text-[#B6BAC3] border border-[#434D64] rounded-lg">No active templates available</div>
//                                         ) : (
//                                             templates.map((template: any) => (
//                                                 <div key={template._id} className={`p-4 rounded-lg cursor-pointer transition-all border ${formData.messageTypeId === template._id ? "border-[#C9A94D] bg-[#C9A94D] bg-opacity-10" : "border-[#434D64] bg-[#434D64] hover:bg-opacity-70"}`} onClick={() => setFormData({ ...formData, messageTypeId: template._id })}>
//                                                     <div className="flex justify-between items-center">
//                                                         <div>
//                                                             <div className="flex items-center gap-2 mb-1">
//                                                                 <span className="font-semibold text-white">{template.name}</span>
//                                                                 <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${getTemplateColor(template.type)}`}>
//                                                                     {getTemplateIcon(template.type)}
//                                                                     {template.type.toLowerCase()}
//                                                                 </span>
//                                                             </div>
//                                                             <div className="text-sm text-[#B6BAC3] line-clamp-2" dangerouslySetInnerHTML={{ __html: template.content }}></div>
//                                                         </div>
//                                                         {formData.messageTypeId === template._id && (
//                                                             <div className="w-5 h-5 rounded-full bg-[#C9A94D] flex items-center justify-center">
//                                                                 <div className="w-2 h-2 rounded-full bg-[#14213D]"></div>
//                                                             </div>
//                                                         )}
//                                                     </div>
//                                                 </div>
//                                             ))
//                                         )}
//                                     </div>
//                                 </div>

//                                 {/* User Type Selection */}
//                                 <div className="mb-8">
//                                     <label className="block text-sm font-medium text-[#B6BAC3] mb-2">
//                                         <div className="flex items-center gap-2">
//                                             <Target className="w-4 h-4" />
//                                             Target Audience *
//                                         </div>
//                                     </label>
//                                     <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
//                                         {[
//                                             { value: "GUEST", label: "Guests Only", icon: <User className="w-5 h-5" />, desc: "Send to all guest users" },
//                                             { value: "HOST", label: "Hosts Only", icon: <Users2 className="w-5 h-5" />, desc: "Send to all host users" },
//                                             { value: "BOTH", label: "All Users", icon: <Users className="w-5 h-5" />, desc: "Send to both guests and hosts" },
//                                         ].map((option) => (
//                                             <div key={option.value} className={`p-4 rounded-lg cursor-pointer transition-all border ${formData.userType === option.value ? "border-[#C9A94D] bg-[#C9A94D] bg-opacity-10" : "border-[#434D64] bg-[#434D64] hover:bg-opacity-70"}`} onClick={() => setFormData({ ...formData, userType: option.value as any })}>
//                                                 <div className="flex items-center gap-3 mb-2">
//                                                     <div className={`p-2 rounded-lg ${formData.userType === option.value ? "bg-[#C9A94D] text-[#14213D]" : "bg-[#2D3546] text-[#B6BAC3]"}`}>{option.icon}</div>
//                                                     <div>
//                                                         <div className="font-semibold text-white">{option.label}</div>
//                                                         <div className="text-xs text-[#B6BAC3]">{option.desc}</div>
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                         ))}
//                                     </div>
//                                 </div>

//                                 {/* Preview & Submit */}
//                                 <div className="flex flex-col sm:flex-row gap-4 justify-between items-center pt-4 border-t border-[#434D64]">
//                                     <button type="button" onClick={() => setShowPreview(!showPreview)} disabled={!selectedTemplate} className="flex items-center gap-2 text-[#B6BAC3] hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
//                                         <Eye className="w-4 h-4" />
//                                         {showPreview ? "Hide Preview" : "Preview Message"}
//                                     </button>

//                                     <button type="submit" disabled={isSending || !formData.messageTypeId} className="flex items-center gap-2 bg-[#C9A94D] text-[#14213D] px-6 py-3 rounded-lg hover:bg-[#b8973e] transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg">
//                                         {isSending ? (
//                                             <>
//                                                 <div className="w-5 h-5 border-2 border-[#14213D] border-t-transparent rounded-full animate-spin"></div>
//                                                 Sending...
//                                             </>
//                                         ) : (
//                                             <>
//                                                 <Send className="w-5 h-5" />
//                                                 Send Message to All Users
//                                                 <ArrowRight className="w-4 h-4" />
//                                             </>
//                                         )}
//                                     </button>
//                                 </div>
//                             </form>
//                         </div>
//                     </div>

//                     {/* Right Column: Preview & Stats */}
//                     <div className="space-y-6">
//                         {/* Message Preview */}
//                         {showPreview && selectedTemplate && (
//                             <div className="bg-[#1a1a2e] rounded-lg shadow-md p-6 border border-[#434D64]">
//                                 <div className="flex items-center justify-between mb-4">
//                                     <h3 className="text-lg font-bold text-white">Message Preview</h3>
//                                     <button onClick={() => setShowPreview(false)} className="text-[#B6BAC3] hover:text-white">
//                                         <X className="w-5 h-5" />
//                                     </button>
//                                 </div>
//                                 <div className="bg-[#434D64] rounded-lg p-4 mb-4">
//                                     <div className="flex items-center gap-3 mb-3">
//                                         <div className="w-10 h-10 rounded-full bg-[#C9A94D] flex items-center justify-center">
//                                             <Bot className="w-6 h-6 text-[#14213D]" />
//                                         </div>
//                                         <div>
//                                             <div className="font-semibold text-white">System Bot</div>
//                                             <div className="text-xs text-[#B6BAC3]">Now</div>
//                                         </div>
//                                     </div>
//                                     <div className="text-white">
//                                         <div dangerouslySetInnerHTML={{ __html: previewContent }}></div>
//                                     </div>
//                                 </div>
//                                 <div className="text-sm text-[#B6BAC3]">
//                                     <div className="flex items-center gap-2">
//                                         <div className="w-2 h-2 rounded-full bg-[#C9A94D]"></div>
//                                         This is how the message will appear to users
//                                     </div>
//                                 </div>
//                             </div>
//                         )}

//                         {/* Statistics Panel */}
//                         <div className="bg-[#1a1a2e] rounded-lg shadow-md p-6 border border-[#434D64]">
//                             <h3 className="text-lg font-bold text-white mb-4">Sending Statistics</h3>
//                             <div className="space-y-4">
//                                 <div className="flex justify-between items-center">
//                                     <div className="text-[#B6BAC3]">Available Templates</div>
//                                     <div className="text-white font-semibold">{templates.length}</div>
//                                 </div>
//                                 <div className="flex justify-between items-center">
//                                     <div className="text-[#B6BAC3]">Selected Template</div>
//                                     <div className="text-white font-semibold">{selectedTemplate ? selectedTemplate.name : "None"}</div>
//                                 </div>
//                                 <div className="flex justify-between items-center">
//                                     <div className="text-[#B6BAC3]">Target Audience</div>
//                                     <div className="flex items-center gap-2 text-white font-semibold">
//                                         {getUserTypeIcon(formData.userType)}
//                                         {formData.userType === "GUEST" && "Guests Only"}
//                                         {formData.userType === "HOST" && "Hosts Only"}
//                                         {formData.userType === "BOTH" && "All Users"}
//                                     </div>
//                                 </div>
//                                 <div className="pt-4 border-t border-[#434D64]">
//                                     <div className="text-sm text-[#B6BAC3]">
//                                         <div className="flex items-center gap-2 mb-1">
//                                             <AlertCircle className="w-4 h-4" />
//                                             Important Notes:
//                                         </div>
//                                         <ul className="list-disc list-inside text-xs space-y-1 pl-2">
//                                             <li>Messages are sent as system messages</li>
//                                             <li>Users will receive notifications</li>
//                                             <li>Messages cannot be recalled once sent</li>
//                                             <li>Delivery may take a few moments</li>
//                                         </ul>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Recent Activity (if any results) */}
//                 {sendResult && (
//                     <div className="mt-8">
//                         <h3 className="text-xl font-bold text-white mb-4">Detailed Results</h3>
//                         <div className="bg-[#1a1a2e] rounded-lg shadow-md p-6 border border-[#434D64]">
//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                                 <div>
//                                     <h4 className="text-lg font-semibold text-white mb-3">Delivery Summary</h4>
//                                     <div className="space-y-3">
//                                         <div className="flex justify-between">
//                                             <span className="text-[#B6BAC3]">Total Users Targeted:</span>
//                                             <span className="text-white font-semibold">{sendResult.totalUsers}</span>
//                                         </div>
//                                         <div className="flex justify-between">
//                                             <span className="text-[#B6BAC3]">Successfully Sent:</span>
//                                             <span className="text-green-400 font-semibold">{sendResult.successful}</span>
//                                         </div>
//                                         <div className="flex justify-between">
//                                             <span className="text-[#B6BAC3]">Failed to Send:</span>
//                                             <span className="text-red-400 font-semibold">{sendResult.failed}</span>
//                                         </div>
//                                         <div className="flex justify-between">
//                                             <span className="text-[#B6BAC3]">Success Rate:</span>
//                                             <span className="text-white font-semibold">{sendResult.totalUsers > 0 ? `${((sendResult.successful / sendResult.totalUsers) * 100).toFixed(1)}%` : "0%"}</span>
//                                         </div>
//                                     </div>
//                                 </div>
//                                 <div>
//                                     <h4 className="text-lg font-semibold text-white mb-3">Template Used</h4>
//                                     <div className="space-y-2">
//                                         <div className="text-[#B6BAC3]">
//                                             Name: <span className="text-white">{sendResult.messageTemplate.name}</span>
//                                         </div>
//                                         <div className="text-[#B6BAC3]">
//                                             Type: <span className="text-white">{sendResult.messageTemplate.type}</span>
//                                         </div>
//                                         <div className="text-[#B6BAC3]">Content Preview:</div>
//                                         <div className="text-white text-sm bg-[#434D64] p-3 rounded-lg line-clamp-3" dangerouslySetInnerHTML={{ __html: sendResult.messageTemplate.content }}></div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default BotMessageSenderPage;

"use client";
import React, { useState, useEffect } from "react";
import { Send, Users, User, Users2, Bot, AlertCircle, CheckCircle, Clock, Megaphone, MessageSquare, Settings, ArrowRight, X, Eye, FileText, Target } from "lucide-react";
import { toast } from "sonner";
import dynamic from "next/dynamic";

// Dynamically import JoditEditor to avoid SSR issues
const JoditEditor = dynamic(() => import("jodit-react"), {
    ssr: false,
    loading: () => <div className="h-96 w-full bg-[#434D64] animate-pulse rounded-lg"></div>,
});

// Import RTK Query hooks
import { useSendMessageToAllMutation, useGetActiveMessageTemplatesQuery } from "@/redux/features/messages/messageApi";

interface MessageTemplate {
    _id: string;
    name: string;
    type: "WELCOME" | "REMINDER" | "SYSTEM";
    content: string;
    variables?: ("name" | "propertyNumber")[];
    isActive: boolean;
}

interface SendMessageForm {
    messageTypeId: string;
    userType: "GUEST" | "HOST" | "BOTH";
}

interface SendResult {
    messageTemplate: {
        id: string;
        name: string;
        type: string;
        content: string;
    };
    userType: string;
    totalUsers: number;
    successful: number;
    failed: number;
    failedUserIds: string[];
    successfulUserIds: string[];
    errors: string[];
}

const BotMessageSenderPage = () => {
    // RTK Query hooks
    const { data: templatesResponse, isLoading: isLoadingTemplates, error: templatesError, refetch: refetchTemplates } = useGetActiveMessageTemplatesQuery({});
    const [sendMessageToAll, { isLoading: isSending }] = useSendMessageToAllMutation();

    // State
    const [formData, setFormData] = useState<SendMessageForm>({
        messageTypeId: "",
        userType: "BOTH",
    });
    const [selectedTemplate, setSelectedTemplate] = useState<MessageTemplate | null>(null);
    const [sendResult, setSendResult] = useState<SendResult | null>(null);
    const [showPreview, setShowPreview] = useState(false);
    const [previewContent, setPreviewContent] = useState("");

    // Extract templates from API response - FIXED
    const templates = React.useMemo(() => {
        if (!templatesResponse) return [];

        // Handle different possible response structures
        if (Array.isArray(templatesResponse)) {
            return templatesResponse;
        } else if (templatesResponse?.data) {
            // Check if data is an array or has a data property
            if (Array.isArray(templatesResponse.data)) {
                return templatesResponse.data;
            } else if (templatesResponse.data?.data) {
                return templatesResponse.data.data;
            }
        }
        return [];
    }, [templatesResponse]);

    // Jodit editor configuration (read-only preview)
    const editorConfig = React.useMemo(
        () => ({
            readonly: true,
            toolbar: false,
            statusbar: false,
            showCharsCounter: false,
            showWordsCounter: false,
            style: {
                backgroundColor: "#2D3546", // Changed for better contrast
                color: "#ffffff",
                minHeight: "200px",
                padding: "1rem",
                borderRadius: "0.5rem",
            },
            theme: "dark",
        }),
        []
    );

    // Update selected template when messageTypeId changes
    useEffect(() => {
        if (formData.messageTypeId && templates.length > 0) {
            const template = templates.find((t: any) => t._id === formData.messageTypeId);
            setSelectedTemplate(template || null);
            if (template) {
                setPreviewContent(template.content);
            }
        } else {
            setSelectedTemplate(null);
        }
    }, [formData.messageTypeId, templates]);

    // Handle form submission - FIXED error handling
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.messageTypeId) {
            toast.error("Please select a message template");
            return;
        }

        try {
            const result = await sendMessageToAll(formData).unwrap();

            // FIX: Handle nested data structure from your API response
            const resultData = result.data || result;
            setSendResult(resultData);

            // Show success toast
            const successful = resultData.successful || resultData.data?.successful || 0;
            const failed = resultData.failed || resultData.data?.failed || 0;

            toast.success(`Message sent to ${successful} users successfully!`, {
                description: failed > 0 ? `${failed} users failed to receive the message.` : "All messages delivered successfully.",
            });

            // Reset form after successful send
            setFormData({
                messageTypeId: "",
                userType: "BOTH",
            });
            setSelectedTemplate(null);
        } catch (error: any) {
            console.error("Failed to send message:", error);
            // FIX: Handle nested error structure
            const errorMessage = error?.data?.message || error?.data?.data?.message || error?.message || "Please try again later.";
            toast.error("Failed to send message", {
                description: errorMessage,
            });
        }
    };

    // Get user type icon
    const getUserTypeIcon = (type: string) => {
        switch (type) {
            case "GUEST":
                return <User className="w-4 h-4" />;
            case "HOST":
                return <Users2 className="w-4 h-4" />;
            case "BOTH":
                return <Users className="w-4 h-4" />;
            default:
                return <Users className="w-4 h-4" />;
        }
    };

    // Get template type icon
    const getTemplateIcon = (type: string) => {
        switch (type) {
            case "WELCOME":
                return <MessageSquare className="w-4 h-4" />;
            case "REMINDER":
                return <Clock className="w-4 h-4" />;
            case "SYSTEM":
                return <Settings className="w-4 h-4" />;
            default:
                return <FileText className="w-4 h-4" />;
        }
    };

    // Get template type color - FIXED for better visibility
    const getTemplateColor = (type: string) => {
        switch (type) {
            case "WELCOME":
                return "bg-[#C9A94D] text-[#000000] border-[#C9A94D]"; // Brighter yellow
            case "REMINDER":
                return "bg-[#4A90E2] text-white border-[#4A90E2]"; // Bright blue
            case "SYSTEM":
                return "bg-[#14213D] text-white border-[#14213D]";
            default:
                return "bg-[#667085] text-white border-[#667085]"; // Better contrast gray
        }
    };

    if (isLoadingTemplates) {
        return (
            <div className="min-h-screen bg-[#14213D] p-6">
                <div className="max-w-6xl mx-auto">
                    <div className="animate-pulse">
                        <div className="h-8 bg-[#434D64] rounded w-1/4 mb-6"></div>
                        <div className="h-64 bg-[#434D64] rounded mb-6"></div>
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

    if (templatesError) {
        return (
            <div className="min-h-screen bg-[#14213D] p-6">
                <div className="max-w-6xl mx-auto">
                    <div className="bg-red-500 bg-opacity-20 border border-red-500 text-red-500 px-4 py-3 rounded-lg flex items-center gap-2">
                        <AlertCircle className="w-5 h-5" />
                        Error loading message templates. Please try again.
                    </div>
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
                        <h1 className="text-3xl font-bold text-white">Send Bulk Messages</h1>
                        <p className="text-[#E5E7EB] mt-2">Send automated messages to multiple users</p> {/* Brighter text */}
                    </div>
                    <div className="flex items-center gap-2 text-[#C9A94D]">
                        {" "}
                        {/* Brighter gold */}
                        <Bot className="w-6 h-6" />
                        <span className="font-semibold">Bot Manager</span>
                    </div>
                </div>

                {/* Send Result Display - FIXED optional chaining */}
                {sendResult && sendResult.messageTemplate && (
                    <div className="mb-6 bg-[#1a1a2e] rounded-lg p-6 border border-[#C9A94D]">
                        <div className="flex items-center gap-3 mb-4">
                            <CheckCircle className="w-6 h-6 text-[#C9A94D]" />
                            <h3 className="text-xl font-bold text-white">Message Sent Successfully!</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div className="bg-[#2D3546] rounded-lg p-4">
                                {" "}
                                {/* Darker background for contrast */}
                                <div className="text-sm text-[#E5E7EB]">Template</div> {/* Brighter text */}
                                <div className="text-white font-semibold">{sendResult.messageTemplate.name}</div>
                                <div className="text-xs text-[#C9A94D]">{sendResult.messageTemplate.type}</div>
                            </div>
                            <div className="bg-[#2D3546] rounded-lg p-4">
                                <div className="text-sm text-[#E5E7EB]">Target Users</div>
                                <div className="text-white font-semibold">{sendResult.userType}</div>
                                <div className="text-xs text-[#C9A94D]">{sendResult.totalUsers} total users</div>
                            </div>
                            <div className="bg-[#2D3546] rounded-lg p-4">
                                <div className="text-sm text-[#E5E7EB]">Delivery Status</div>
                                <div className="flex items-center gap-2">
                                    <span className="text-white font-semibold">{sendResult.successful} sent</span>
                                    {sendResult.failed > 0 && <span className="text-red-400 text-sm">({sendResult.failed} failed)</span>}
                                </div>
                            </div>
                        </div>
                        <button onClick={() => setSendResult(null)} className="text-[#E5E7EB] hover:text-white text-sm flex items-center gap-1">
                            <X className="w-4 h-4" />
                            Clear result
                        </button>
                    </div>
                )}

                {/* Main Form */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column: Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-[#1a1a2e] rounded-lg shadow-md p-6 border border-[#434D64]">
                            <div className="flex items-center gap-3 mb-6">
                                <Megaphone className="w-6 h-6 text-[#C9A94D]" />
                                <h2 className="text-xl font-bold text-white">Send Message</h2>
                            </div>

                            <form onSubmit={handleSubmit}>
                                {/* Template Selection */}
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-[#E5E7EB] mb-2">
                                        {" "}
                                        {/* Brighter text */}
                                        <div className="flex items-center gap-2">
                                            <FileText className="w-4 h-4" />
                                            Select Message Template *
                                        </div>
                                    </label>
                                    <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                                        {templates.length === 0 ? (
                                            <div className="text-center py-4 text-[#E5E7EB] border border-[#434D64] rounded-lg">No active templates available</div>
                                        ) : (
                                            templates.map((template: any) => (
                                                <div key={template._id} className={`p-4 rounded-lg cursor-pointer transition-all border ${formData.messageTypeId === template._id ? "border-[#C9A94D] bg-[#C9A94D] bg-opacity-10" : "border-[#2D3546] bg-[#2D3546] hover:bg-opacity-70"}`} onClick={() => setFormData({ ...formData, messageTypeId: template._id })}>
                                                    <div className="flex justify-between items-center">
                                                        <div>
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <span className="font-semibold text-white">{template.name}</span>
                                                                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${getTemplateColor(template.type)}`}>
                                                                    {getTemplateIcon(template.type)}
                                                                    {template.type.toLowerCase()}
                                                                </span>
                                                            </div>
                                                            <div className="text-sm text-[#E5E7EB] line-clamp-2" dangerouslySetInnerHTML={{ __html: template.content }}></div> {/* Brighter text */}
                                                        </div>
                                                        {formData.messageTypeId === template._id && (
                                                            <div className="w-5 h-5 rounded-full bg-[#C9A94D] flex items-center justify-center">
                                                                <div className="w-2 h-2 rounded-full bg-[#14213D]"></div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>

                                {/* User Type Selection */}
                                <div className="mb-8">
                                    <label className="block text-sm font-medium text-[#E5E7EB] mb-2">
                                        {" "}
                                        {/* Brighter text */}
                                        <div className="flex items-center gap-2">
                                            <Target className="w-4 h-4" />
                                            Target Audience *
                                        </div>
                                    </label>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                        {[
                                            { value: "GUEST", label: "Guests Only", icon: <User className="w-5 h-5" />, desc: "Send to all guest users" },
                                            { value: "HOST", label: "Hosts Only", icon: <Users2 className="w-5 h-5" />, desc: "Send to all host users" },
                                            { value: "BOTH", label: "All Users", icon: <Users className="w-5 h-5" />, desc: "Send to both guests and hosts" },
                                        ].map((option) => (
                                            <div key={option.value} className={`p-4 rounded-lg cursor-pointer transition-all border ${formData.userType === option.value ? "border-[#C9A94D] bg-[#C9A94D] bg-opacity-10" : "border-[#2D3546] bg-[#2D3546] hover:bg-opacity-70"}`} onClick={() => setFormData({ ...formData, userType: option.value as any })}>
                                                <div className="flex items-center gap-3 mb-2">
                                                    <div className={`p-2 rounded-lg ${formData.userType === option.value ? "bg-[#C9A94D] text-[#14213D]" : "bg-[#2D3546] text-[#E5E7EB]"}`}>{option.icon}</div> {/* Brighter text */}
                                                    <div>
                                                        <div className="font-semibold text-white">{option.label}</div>
                                                        <div className="text-xs text-[#E5E7EB]">{option.desc}</div> {/* Brighter text */}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Preview & Submit */}
                                <div className="flex flex-col sm:flex-row gap-4 justify-between items-center pt-4 border-t border-[#434D64]">
                                    <button type="button" onClick={() => setShowPreview(!showPreview)} disabled={!selectedTemplate} className="flex items-center gap-2 text-[#E5E7EB] hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                                        {" "}
                                        {/* Brighter text */}
                                        <Eye className="w-4 h-4" />
                                        {showPreview ? "Hide Preview" : "Preview Message"}
                                    </button>

                                    <button type="submit" disabled={isSending || !formData.messageTypeId} className="flex items-center gap-2 bg-[#C9A94D] text-[#14213D] px-6 py-3 rounded-lg hover:bg-[#E6C200] transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg">
                                        {isSending ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-[#14213D] border-t-transparent rounded-full animate-spin"></div>
                                                Sending...
                                            </>
                                        ) : (
                                            <>
                                                <Send className="w-5 h-5" />
                                                Send Message to All Users
                                                <ArrowRight className="w-4 h-4" />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Right Column: Preview & Stats */}
                    <div className="space-y-6">
                        {/* Message Preview */}
                        {showPreview && selectedTemplate && (
                            <div className="bg-[#1a1a2e] rounded-lg shadow-md p-6 border border-[#434D64]">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-bold text-white">Message Preview</h3>
                                    <button onClick={() => setShowPreview(false)} className="text-[#E5E7EB] hover:text-white">
                                        {" "}
                                        {/* Brighter text */}
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                                <div className="bg-[#2D3546] rounded-lg p-4 mb-4">
                                    {" "}
                                    {/* Darker background */}
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-10 h-10 rounded-full bg-[#C9A94D] flex items-center justify-center">
                                            <Bot className="w-6 h-6 text-[#14213D]" />
                                        </div>
                                        <div>
                                            <div className="font-semibold text-white">System Bot</div>
                                            <div className="text-xs text-[#E5E7EB]">Now</div> {/* Brighter text */}
                                        </div>
                                    </div>
                                    <div className="text-white">
                                        <div dangerouslySetInnerHTML={{ __html: previewContent }}></div>
                                    </div>
                                </div>
                                <div className="text-sm text-[#E5E7EB]">
                                    {" "}
                                    {/* Brighter text */}
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-[#C9A94D]"></div>
                                        This is how the message will appear to users
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Statistics Panel */}
                        <div className="bg-[#1a1a2e] rounded-lg shadow-md p-6 border border-[#434D64]">
                            <h3 className="text-lg font-bold text-white mb-4">Sending Statistics</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <div className="text-[#E5E7EB]">Available Templates</div> {/* Brighter text */}
                                    <div className="text-white font-semibold">{templates.length}</div>
                                </div>
                                <div className="flex justify-between items-center">
                                    <div className="text-[#E5E7EB]">Selected Template</div> {/* Brighter text */}
                                    <div className="text-white font-semibold">{selectedTemplate ? selectedTemplate.name : "None"}</div>
                                </div>
                                <div className="flex justify-between items-center">
                                    <div className="text-[#E5E7EB]">Target Audience</div> {/* Brighter text */}
                                    <div className="flex items-center gap-2 text-white font-semibold">
                                        {getUserTypeIcon(formData.userType)}
                                        {formData.userType === "GUEST" && "Guests Only"}
                                        {formData.userType === "HOST" && "Hosts Only"}
                                        {formData.userType === "BOTH" && "All Users"}
                                    </div>
                                </div>
                                <div className="pt-4 border-t border-[#434D64]">
                                    <div className="text-sm text-[#E5E7EB]">
                                        {" "}
                                        {/* Brighter text */}
                                        <div className="flex items-center gap-2 mb-1">
                                            <AlertCircle className="w-4 h-4" />
                                            Important Notes:
                                        </div>
                                        <ul className="list-disc list-inside text-xs space-y-1 pl-2">
                                            <li>Messages are sent as system messages</li>
                                            <li>Users will receive notifications</li>
                                            <li>Messages cannot be recalled once sent</li>
                                            <li>Delivery may take a few moments</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Activity (if any results) - FIXED optional chaining */}
                {sendResult && sendResult.messageTemplate && (
                    <div className="mt-8">
                        <h3 className="text-xl font-bold text-white mb-4">Detailed Results</h3>
                        <div className="bg-[#1a1a2e] rounded-lg shadow-md p-6 border border-[#434D64]">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h4 className="text-lg font-semibold text-white mb-3">Delivery Summary</h4>
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-[#E5E7EB]">Total Users Targeted:</span> {/* Brighter text */}
                                            <span className="text-white font-semibold">{sendResult.totalUsers || 0}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-[#E5E7EB]">Successfully Sent:</span> {/* Brighter text */}
                                            <span className="text-green-400 font-semibold">{sendResult.successful || 0}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-[#E5E7EB]">Failed to Send:</span> {/* Brighter text */}
                                            <span className="text-red-400 font-semibold">{sendResult.failed || 0}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-[#E5E7EB]">Success Rate:</span> {/* Brighter text */}
                                            <span className="text-white font-semibold">{sendResult.totalUsers > 0 ? `${(((sendResult.successful || 0) / (sendResult.totalUsers || 1)) * 100).toFixed(1)}%` : "0%"}</span>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-lg font-semibold text-white mb-3">Template Used</h4>
                                    <div className="space-y-2">
                                        <div className="text-[#E5E7EB]">
                                            {" "}
                                            {/* Brighter text */}
                                            Name: <span className="text-white">{sendResult.messageTemplate.name}</span>
                                        </div>
                                        <div className="text-[#E5E7EB]">
                                            {" "}
                                            {/* Brighter text */}
                                            Type: <span className="text-white">{sendResult.messageTemplate.type}</span>
                                        </div>
                                        <div className="text-[#E5E7EB]">Content Preview:</div> {/* Brighter text */}
                                        <div className="text-white text-sm bg-[#2D3546] p-3 rounded-lg line-clamp-3" dangerouslySetInnerHTML={{ __html: sendResult.messageTemplate.content || "" }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BotMessageSenderPage;
