// "use client";

// import React, { useRef } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import * as z from "zod";
// import Image from "next/image";

// import PageHeader from "@/components/PageHeader";

// // Zod schemas
// const signUpSchema = z.object({
//     title: z.string().min(2, "Title is required"),
//     file: z
//         .any()
//         .refine((files) => files?.length === 1, "File is required")
//         .refine((files) => files?.[0]?.type.startsWith("image/"), "Only image files are allowed"),
// });

// const signInSchema = z.object({
//     title: z.string().min(2, "Title is required"),
//     file: z
//         .any()
//         .refine((files) => files?.length === 1, "File is required")
//         .refine((files) => files?.[0]?.type.startsWith("image/"), "Only image files are allowed"),
// });

// type SignUpForm = z.infer<typeof signUpSchema>;
// type SignInForm = z.infer<typeof signInSchema>;

// export default function Authentication() {
//     return (
//         <div className="container mx-auto">
//             <PageHeader title={"Authentication"}></PageHeader>
//             <div className=" grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
//                 <SignUpForm />
//                 <SignInForm />
//             </div>
//         </div>
//     );
// }

// // Sign Up Component
// function SignUpForm() {
//     const inputRef = useRef<HTMLInputElement | null>(null);
//     const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);

//     const {
//         register,
//         handleSubmit,
//         setValue,
//         watch,
//         formState: { errors },
//     } = useForm<SignUpForm>({
//         resolver: zodResolver(signUpSchema),
//     });

//     const file = watch("file") as File[];

//     // Create preview when file changes
//     React.useEffect(() => {
//         if (file?.[0]) {
//             const objectUrl = URL.createObjectURL(file[0]);
//             setPreviewUrl(objectUrl);

//             // Clean up
//             return () => URL.revokeObjectURL(objectUrl);
//         } else {
//             setPreviewUrl(null);
//         }
//     }, [file]);

//     const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
//         e.preventDefault();
//         if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
//             setValue("file", [e.dataTransfer.files[0]], { shouldValidate: true });
//         }
//     };

//     const handleClick = () => {
//         inputRef.current?.click();
//     };

//     const handleRemoveImage = (e: React.MouseEvent) => {
//         e.stopPropagation(); // prevents file picker opening
//         setValue("file", [], { shouldValidate: true });
//         setPreviewUrl(null);
//     };

//     const onSubmit = (data: SignUpForm) => {
//         console.log("Sign Up form submitted:", data);
//     };

//     return (
//         <div className="w-full p-3 md:p-6 border border-[#C9A94D] rounded-lg text-center bg-[#2D3546] text-[#F5F5F5]">
//             <h1 className="text-2xl font-bold mb-4 text-[#C9A94D]">Sign Up Page</h1>

//             <form onSubmit={handleSubmit(onSubmit)}>
//                 <div className="mb-4">
//                     <label htmlFor="title" className="block text-xl md:text-[30px] font-bold text-[#C9A94D] mb-2 text-left">
//                         Sign Up Page Title
//                     </label>
//                     <input type="text" placeholder="Sign Up Title" {...register("title")} className="w-full p-3 rounded-lg border border-[#C9A94D] bg-[#2D3546] text-[#F5F5F5] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C9A94D]" />
//                 </div>
//                 {errors.title?.message && <p className="text-red-500 mt-1 text-sm mb-1">{errors.title.message}</p>}

//                 <div>
//                     <label htmlFor="file" className="block text-xl md:text-[30px] font-bold text-[#C9A94D] mb-2 text-left">
//                         Sign Up Page Photo
//                     </label>

//                     {/* Drag & Drop Area */}
//                     <div onDrop={handleDrop} onDragOver={(e) => e.preventDefault()} onClick={handleClick} className="w-full border border-dashed border-[#C9A94D] rounded-lg p-5 flex items-center justify-center h-60 relative cursor-pointer hover:bg-[#434D64] transition mb-4">
//                         {previewUrl ? (
//                             <>
//                                 <Image
//                                     src={previewUrl}
//                                     alt="Preview"
//                                     fill
//                                     className="object-cover rounded-lg"
//                                     unoptimized // Required for blob URLs
//                                 />
//                                 {/* Cross Button */}
//                                 <div className="w-6 h-6 absolute top-3 right-3 bg-[#D00000] text-white rounded-full flex items-center justify-center cursor-pointer z-10" onClick={handleRemoveImage}>
//                                     ×
//                                 </div>
//                             </>
//                         ) : (
//                             <span className="text-gray-400 text-center">Drag & Drop or Click to Upload</span>
//                         )}

//                         <input
//                             type="file"
//                             accept="image/*"
//                             className="hidden"
//                             {...register("file")}
//                             ref={(e) => {
//                                 register("file").ref(e);
//                                 inputRef.current = e;
//                             }}
//                             onChange={(e) => {
//                                 if (e.target.files && e.target.files.length > 0) {
//                                     setValue("file", [e.target.files[0]], { shouldValidate: true });
//                                 }
//                             }}
//                         />
//                     </div>
//                 </div>
//                 {errors.file && typeof errors.file === "object" && "message" in errors.file && <p className="text-red-500 mt-1 text-sm mb-1">{errors.file.message as string}</p>}

//                 <button type="submit" className="w-full py-2 px-4 bg-[#C9A94D] text-white font-bold rounded-lg hover:bg-[#b8973e] transition">
//                     Update Sign Up Content
//                 </button>
//             </form>
//         </div>
//     );
// }

// function SignInForm() {
//     const inputRef = useRef<HTMLInputElement | null>(null);
//     const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);

//     const {
//         register,
//         handleSubmit,
//         setValue,
//         watch,
//         formState: { errors },
//     } = useForm<SignInForm>({
//         resolver: zodResolver(signInSchema),
//     });

//     const file = watch("file") as File[];

//     // Create preview when file changes
//     React.useEffect(() => {
//         if (file?.[0]) {
//             const objectUrl = URL.createObjectURL(file[0]);
//             setPreviewUrl(objectUrl);

//             // Clean up
//             return () => URL.revokeObjectURL(objectUrl);
//         } else {
//             setPreviewUrl(null);
//         }
//     }, [file]);

//     const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
//         e.preventDefault();
//         if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
//             setValue("file", [e.dataTransfer.files[0]], { shouldValidate: true });
//         }
//     };

//     const handleClick = () => {
//         inputRef.current?.click();
//     };

//     const handleRemoveImage = (e: React.MouseEvent) => {
//         e.stopPropagation(); // prevents file picker opening
//         setValue("file", [], { shouldValidate: true });
//         setPreviewUrl(null);
//     };

//     const onSubmit = (data: SignInForm) => {
//         console.log("Sign In form submitted:", data);
//     };

//     return (
//         <div className="w-full p-3 md:p-6 border border-[#C9A94D] rounded-lg text-center bg-[#2D3546] text-[#F5F5F5]">
//             <h1 className="text-2xl font-bold mb-4 text-[#C9A94D]">Sign In Page</h1>

//             <form onSubmit={handleSubmit(onSubmit)}>
//                 <div className="mb-4">
//                     <label htmlFor="title" className="block text-xl md:text-[30px] font-bold text-[#C9A94D] mb-2 text-left">
//                         Sign In Page Title
//                     </label>
//                     <input type="text" placeholder="Sign In Title" {...register("title")} className="w-full p-3 rounded-lg border border-[#C9A94D] bg-[#2D3546] text-[#F5F5F5] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C9A94D]" />
//                 </div>
//                 {errors.title?.message && <p className="text-red-500 mt-1 text-sm mb-1">{errors.title.message}</p>}

//                 <div>
//                     <label htmlFor="file" className="block text-xl md:text-[30px] font-bold text-[#C9A94D] mb-2 text-left">
//                         Sign In Page Photo
//                     </label>

//                     {/* Drag & Drop Area */}
//                     <div onDrop={handleDrop} onDragOver={(e) => e.preventDefault()} onClick={handleClick} className="w-full border border-dashed border-[#C9A94D] rounded-lg p-5 flex items-center justify-center h-60 relative cursor-pointer hover:bg-[#434D64] transition mb-4">
//                         {previewUrl ? (
//                             <>
//                                 <Image
//                                     src={previewUrl}
//                                     alt="Preview"
//                                     fill
//                                     className="object-cover rounded-lg"
//                                     unoptimized // Required for blob URLs
//                                 />
//                                 {/* Cross Button */}
//                                 <div className="w-6 h-6 absolute top-3 right-3 bg-[#D00000] text-white rounded-full flex items-center justify-center cursor-pointer z-10" onClick={handleRemoveImage}>
//                                     ×
//                                 </div>
//                             </>
//                         ) : (
//                             <span className="text-gray-400 text-center">Drag & Drop or Click to Upload</span>
//                         )}

//                         <input
//                             type="file"
//                             accept="image/*"
//                             className="hidden"
//                             {...register("file")}
//                             ref={(e) => {
//                                 register("file").ref(e);
//                                 inputRef.current = e;
//                             }}
//                             onChange={(e) => {
//                                 if (e.target.files && e.target.files.length > 0) {
//                                     setValue("file", [e.target.files[0]], { shouldValidate: true });
//                                 }
//                             }}
//                         />
//                     </div>
//                 </div>
//                 {errors.file && typeof errors.file === "object" && "message" in errors.file && <p className="text-red-500 mt-1 text-sm mb-1">{errors.file.message as string}</p>}

//                 <button type="submit" className="w-full py-2 px-4 bg-[#C9A94D] text-white font-bold rounded-lg hover:bg-[#b8973e] transition">
//                     Update Sign In Content
//                 </button>
//             </form>
//         </div>
//     );
// }

"use client";

import React, { useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Image from "next/image";
import Swal from "sweetalert2";
import PageHeader from "@/components/PageHeader";
import { useGetPageConfigQuery, useUpdatePageConfigMutation } from "@/redux/features/pageconfig/pageConfigApi";

// Base URL configuration
const BASE_URL = process.env.NEXT_PUBLIC_BASE_API || "http://localhost:5000";

// Zod schemas
const signUpSchema = z.object({
    title: z.string().min(2, "Title is required"),
    file: z
        .any()
        .optional()
        .refine((files) => !files || files.length === 0 || files?.[0]?.type.startsWith("image/"), "Only image files are allowed"),
});

const signInSchema = z.object({
    title: z.string().min(2, "Title is required"),
    file: z
        .any()
        .optional()
        .refine((files) => !files || files.length === 0 || files?.[0]?.type.startsWith("image/"), "Only image files are allowed"),
});

type SignUpForm = z.infer<typeof signUpSchema>;
type SignInForm = z.infer<typeof signInSchema>;

export default function Authentication() {
    return (
        <div className="container mx-auto">
            <PageHeader title={"Authentication"}></PageHeader>
            <div className=" grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                <SignUpForm />
                <SignInForm />
            </div>
        </div>
    );
}

// Helper function to get full image URL
const getFullImageUrl = (imagePath: string | undefined): string | null => {
    if (!imagePath) return null;

    // If it's already a full URL, return as is
    if (imagePath.startsWith("http")) {
        return imagePath;
    }

    // If it starts with /uploads, add base URL
    if (imagePath.startsWith("/uploads")) {
        return `${BASE_URL}${imagePath}`;
    }

    // For any other case, assume it's relative to base URL
    return `${BASE_URL}/${imagePath}`;
};

// Sign Up Component
function SignUpForm() {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);

    // RTK Query hooks
    const { data: pageConfig, isLoading } = useGetPageConfigQuery({ pageType: "signup" });
    const [updatePageConfig, { isLoading: isUpdating }] = useUpdatePageConfigMutation();

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
        reset,
    } = useForm<SignUpForm>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            title: pageConfig?.data?.title || "",
        },
    });

    // Update form when data loads
    React.useEffect(() => {
        if (pageConfig?.data) {
            reset({
                title: pageConfig.data.title || "",
            });
            if (pageConfig.data.logo) {
                const fullLogoUrl = getFullImageUrl(pageConfig.data.logo);
                setPreviewUrl(fullLogoUrl);
            } else {
                setPreviewUrl(null);
            }
        }
    }, [pageConfig, reset]);

    const file = watch("file") as File[];

    // Create preview when file changes
    React.useEffect(() => {
        if (file?.[0]) {
            const objectUrl = URL.createObjectURL(file[0]);
            setPreviewUrl(objectUrl);

            // Clean up
            return () => URL.revokeObjectURL(objectUrl);
        }
    }, [file]);

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            setValue("file", [e.dataTransfer.files[0]], { shouldValidate: true });
        }
    };

    const handleClick = () => {
        inputRef.current?.click();
    };

    const handleRemoveImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setValue("file", [], { shouldValidate: true });
        setPreviewUrl(null);
    };

    const onSubmit = async (data: SignUpForm) => {
        try {
            const formData = new FormData();
            formData.append("title", data.title);

            if (data.file?.[0]) {
                formData.append("logo", data.file[0]);
            }

            await updatePageConfig({
                pageType: "signup",
                data: formData,
            }).unwrap();

            Swal.fire({
                title: "Success!",
                text: "Sign Up page updated successfully!",
                icon: "success",
                draggable: true,
                background: "#2D3546",
                color: "#F5F5F5",
                confirmButtonColor: "#C9A94D",
                confirmButtonText: "OK",
                iconColor: "#C9A94D",
            });

            // Reset file input after successful upload
            setValue("file", []);
        } catch (error) {
            console.error("Failed to update Sign Up page:", error);
            Swal.fire({
                title: "Error!",
                text: "Failed to update Sign Up page",
                icon: "error",
                draggable: true,
                background: "#2D3546",
                color: "#F5F5F5",
                confirmButtonColor: "#D00000",
                confirmButtonText: "Try Again",
                iconColor: "#D00000",
            });
        }
    };

    if (isLoading) {
        return (
            <div className="w-full p-3 md:p-6 border border-[#C9A94D] rounded-lg text-center bg-[#2D3546] text-[#F5F5F5]">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-700 rounded mb-4"></div>
                    <div className="h-4 bg-gray-700 rounded mb-2"></div>
                    <div className="h-40 bg-gray-700 rounded mb-4"></div>
                    <div className="h-10 bg-gray-700 rounded"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full p-3 md:p-6 border border-[#C9A94D] rounded-lg text-center bg-[#2D3546] text-[#F5F5F5]">
            <h1 className="text-2xl font-bold mb-4 text-[#C9A94D]">Sign Up Page</h1>

            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-4">
                    <label htmlFor="title" className="block text-xl md:text-[30px] font-bold text-[#C9A94D] mb-2 text-left">
                        Sign Up Page Title
                    </label>
                    <input type="text" placeholder="Sign Up Title" {...register("title")} className="w-full p-3 rounded-lg border border-[#C9A94D] bg-[#2D3546] text-[#F5F5F5] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C9A94D]" />
                </div>
                {errors.title?.message && <p className="text-red-500 mt-1 text-sm mb-1">{errors.title.message}</p>}

                <div>
                    <label htmlFor="file" className="block text-xl md:text-[30px] font-bold text-[#C9A94D] mb-2 text-left">
                        Sign Up Page Photo
                    </label>

                    {/* Drag & Drop Area */}
                    <div onDrop={handleDrop} onDragOver={(e) => e.preventDefault()} onClick={handleClick} className="w-full border border-dashed border-[#C9A94D] rounded-lg p-5 flex items-center justify-center h-20 relative cursor-pointer hover:bg-[#434D64] transition mb-4">
                        {previewUrl ? (
                            <>
                                <Image
                                    src={previewUrl}
                                    alt="Preview"
                                    fill
                                    className="object-cover rounded-lg"
                                    unoptimized={previewUrl.startsWith("blob:")} // Only unoptimized for blob URLs
                                />
                                {/* Cross Button */}
                                <div className="w-6 h-6 absolute top-3 right-3 bg-[#D00000] text-white rounded-full flex items-center justify-center cursor-pointer z-10" onClick={handleRemoveImage}>
                                    ×
                                </div>
                            </>
                        ) : (
                            <span className="text-gray-400 text-center">Drag & Drop or Click to Upload</span>
                        )}

                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            {...register("file")}
                            ref={(e) => {
                                register("file").ref(e);
                                inputRef.current = e;
                            }}
                            onChange={(e) => {
                                if (e.target.files && e.target.files.length > 0) {
                                    setValue("file", [e.target.files[0]], { shouldValidate: true });
                                }
                            }}
                        />
                    </div>
                </div>
                {errors.file && typeof errors.file === "object" && "message" in errors.file && <p className="text-red-500 mt-1 text-sm mb-1">{errors.file.message as string}</p>}

                <button type="submit" disabled={isUpdating} className="w-full py-2 px-4 bg-[#C9A94D] text-white font-bold rounded-lg hover:bg-[#b8973e] transition disabled:opacity-50 disabled:cursor-not-allowed">
                    {isUpdating ? "Updating..." : "Update Sign Up Content"}
                </button>
            </form>
        </div>
    );
}

function SignInForm() {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);

    // RTK Query hooks
    const { data: pageConfig, isLoading } = useGetPageConfigQuery({ pageType: "signin" });
    const [updatePageConfig, { isLoading: isUpdating }] = useUpdatePageConfigMutation();

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
        reset,
    } = useForm<SignInForm>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            title: pageConfig?.data?.title || "",
        },
    });

    // Update form when data loads
    React.useEffect(() => {
        if (pageConfig?.data) {
            reset({
                title: pageConfig.data.title || "",
            });
            if (pageConfig.data.logo) {
                const fullLogoUrl = getFullImageUrl(pageConfig.data.logo);
                setPreviewUrl(fullLogoUrl);
            } else {
                setPreviewUrl(null);
            }
        }
    }, [pageConfig, reset]);

    const file = watch("file") as File[];

    // Create preview when file changes
    React.useEffect(() => {
        if (file?.[0]) {
            const objectUrl = URL.createObjectURL(file[0]);
            setPreviewUrl(objectUrl);

            // Clean up
            return () => URL.revokeObjectURL(objectUrl);
        }
    }, [file]);

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            setValue("file", [e.dataTransfer.files[0]], { shouldValidate: true });
        }
    };

    const handleClick = () => {
        inputRef.current?.click();
    };

    const handleRemoveImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setValue("file", [], { shouldValidate: true });
        setPreviewUrl(null);
    };

    const onSubmit = async (data: SignInForm) => {
        try {
            const formData = new FormData();
            formData.append("title", data.title);

            if (data.file?.[0]) {
                formData.append("logo", data.file[0]);
            }

            await updatePageConfig({
                pageType: "signin",
                data: formData,
            }).unwrap();

            Swal.fire({
                title: "Success!",
                text: "Sign In page updated successfully!",
                icon: "success",
                draggable: true,
                background: "#2D3546",
                color: "#F5F5F5",
                confirmButtonColor: "#C9A94D",
                confirmButtonText: "OK",
                iconColor: "#C9A94D",
            });

            // Reset file input after successful upload
            setValue("file", []);
        } catch (error) {
            console.error("Failed to update Sign In page:", error);
            Swal.fire({
                title: "Error!",
                text: "Failed to update Sign In page",
                icon: "error",
                draggable: true,
                background: "#2D3546",
                color: "#F5F5F5",
                confirmButtonColor: "#D00000",
                confirmButtonText: "Try Again",
                iconColor: "#D00000",
            });
        }
    };

    if (isLoading) {
        return (
            <div className="w-full p-3 md:p-6 border border-[#C9A94D] rounded-lg text-center bg-[#2D3546] text-[#F5F5F5]">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-700 rounded mb-4"></div>
                    <div className="h-4 bg-gray-700 rounded mb-2"></div>
                    <div className="h-40 bg-gray-700 rounded mb-4"></div>
                    <div className="h-10 bg-gray-700 rounded"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full p-3 md:p-6 border border-[#C9A94D] rounded-lg text-center bg-[#2D3546] text-[#F5F5F5]">
            <h1 className="text-2xl font-bold mb-4 text-[#C9A94D]">Sign In Page</h1>

            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-4">
                    <label htmlFor="title" className="block text-xl md:text-[30px] font-bold text-[#C9A94D] mb-2 text-left">
                        Sign In Page Title
                    </label>
                    <input type="text" placeholder="Sign In Title" {...register("title")} className="w-full p-3 rounded-lg border border-[#C9A94D] bg-[#2D3546] text-[#F5F5F5] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C9A94D]" />
                </div>
                {errors.title?.message && <p className="text-red-500 mt-1 text-sm mb-1">{errors.title.message}</p>}

                <div>
                    <label htmlFor="file" className="block text-xl md:text-[30px] font-bold text-[#C9A94D] mb-2 text-left">
                        Sign In Page Photo
                    </label>

                    {/* Drag & Drop Area */}
                    <div onDrop={handleDrop} onDragOver={(e) => e.preventDefault()} onClick={handleClick} className="w-full border border-dashed border-[#C9A94D] rounded-lg p-5 flex items-center justify-center h-20 relative cursor-pointer hover:bg-[#434D64] transition mb-4">
                        {previewUrl ? (
                            <>
                                <Image
                                    src={previewUrl}
                                    alt="Preview"
                                    fill
                                    className="object-cover rounded-lg"
                                    unoptimized={previewUrl.startsWith("blob:")} // Only unoptimized for blob URLs
                                />
                                {/* Cross Button */}
                                <div className="w-6 h-6 absolute top-3 right-3 bg-[#D00000] text-white rounded-full flex items-center justify-center cursor-pointer z-10" onClick={handleRemoveImage}>
                                    ×
                                </div>
                            </>
                        ) : (
                            <span className="text-gray-400 text-center">Drag & Drop or Click to Upload</span>
                        )}

                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            {...register("file")}
                            ref={(e) => {
                                register("file").ref(e);
                                inputRef.current = e;
                            }}
                            onChange={(e) => {
                                if (e.target.files && e.target.files.length > 0) {
                                    setValue("file", [e.target.files[0]], { shouldValidate: true });
                                }
                            }}
                        />
                    </div>
                </div>
                {errors.file && typeof errors.file === "object" && "message" in errors.file && <p className="text-red-500 mt-1 text-sm mb-1">{errors.file.message as string}</p>}

                <button type="submit" disabled={isUpdating} className="w-full py-2 px-4 bg-[#C9A94D] text-white font-bold rounded-lg hover:bg-[#b8973e] transition disabled:opacity-50 disabled:cursor-not-allowed">
                    {isUpdating ? "Updating..." : "Update Sign In Content"}
                </button>
            </form>
        </div>
    );
}
