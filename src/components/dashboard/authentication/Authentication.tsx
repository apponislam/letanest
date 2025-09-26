"use client";

import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Host } from "@/types/host";

// Zod schemas
const signUpSchema = z.object({
    title: z.string().min(2, "Title is required"),
    file: z
        .any()
        .refine((files) => files?.length === 1, "File is required")
        .refine((files) => files?.[0]?.type.startsWith("image/"), "Only image files are allowed"),
});

const signInSchema = z.object({
    title: z.string().min(2, "Title is required"),
    file: z
        .any()
        .refine((files) => files?.length === 1, "File is required")
        .refine((files) => files?.[0]?.type.startsWith("image/"), "Only image files are allowed"),
});

type SignUpForm = z.infer<typeof signUpSchema>;
type SignInForm = z.infer<typeof signInSchema>;

export default function Authentication() {
    const router = useRouter();
    const [host, setHost] = useState<Host | null>(null);

    useEffect(() => {
        const fetchHost = async () => {
            try {
                const res = await fetch("/data/host.json");
                const data: Host[] = await res.json();
                setHost(data[0]);
            } catch (error) {
                console.error(error);
            }
        };
        fetchHost();
    }, []);

    if (!host) return <div>Loading...</div>;

    return (
        <div className="container mx-auto">
            <div className="p-5 border border-[#C9A94D] flex justify-between items-center mb-6 flex-col md:flex-row gap-4">
                <div className="text-[#C9A94D] flex items-center gap-3 text-[18px] cursor-pointer hover:underline" onClick={() => router.back()}>
                    <ArrowLeft />
                    <p>Back To Previous</p>
                </div>
                <h1 className="text-2xl text-[#C9A94D]">Dashboard</h1>
                <div className="flex items-center gap-2">
                    <Image src={host.image} alt={host.name} width={30} height={30} className="rounded-full border-[0.3px] border-[#C9A94D] object-cover" />
                    <div className="text-[#C9A94D] text-[18px]">{host.role}</div>
                </div>
            </div>
            <div className=" grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                <SignUpForm />
                <SignInForm />
            </div>
        </div>
    );
}

// Sign Up Component
function SignUpForm() {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<SignUpForm>({
        resolver: zodResolver(signUpSchema),
    });

    const file = watch("file") as File[];

    // Create preview when file changes
    React.useEffect(() => {
        if (file?.[0]) {
            const objectUrl = URL.createObjectURL(file[0]);
            setPreviewUrl(objectUrl);

            // Clean up
            return () => URL.revokeObjectURL(objectUrl);
        } else {
            setPreviewUrl(null);
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
        e.stopPropagation(); // prevents file picker opening
        setValue("file", [], { shouldValidate: true });
        setPreviewUrl(null);
    };

    const onSubmit = (data: SignUpForm) => {
        console.log("Sign Up form submitted:", data);
    };

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
                    <div onDrop={handleDrop} onDragOver={(e) => e.preventDefault()} onClick={handleClick} className="w-full border border-dashed border-[#C9A94D] rounded-lg p-5 flex items-center justify-center h-60 relative cursor-pointer hover:bg-[#434D64] transition mb-4">
                        {previewUrl ? (
                            <>
                                <Image
                                    src={previewUrl}
                                    alt="Preview"
                                    fill
                                    className="object-cover rounded-lg"
                                    unoptimized // Required for blob URLs
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

                <button type="submit" className="w-full py-2 px-4 bg-[#C9A94D] text-white font-bold rounded-lg hover:bg-[#b8973e] transition">
                    Update Sign Up Content
                </button>
            </form>
        </div>
    );
}

// Sign In Component
// Sign In Component
function SignInForm() {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<SignInForm>({
        resolver: zodResolver(signInSchema),
    });

    const file = watch("file") as File[];

    // Create preview when file changes
    React.useEffect(() => {
        if (file?.[0]) {
            const objectUrl = URL.createObjectURL(file[0]);
            setPreviewUrl(objectUrl);

            // Clean up
            return () => URL.revokeObjectURL(objectUrl);
        } else {
            setPreviewUrl(null);
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
        e.stopPropagation(); // prevents file picker opening
        setValue("file", [], { shouldValidate: true });
        setPreviewUrl(null);
    };

    const onSubmit = (data: SignInForm) => {
        console.log("Sign In form submitted:", data);
    };

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
                    <div onDrop={handleDrop} onDragOver={(e) => e.preventDefault()} onClick={handleClick} className="w-full border border-dashed border-[#C9A94D] rounded-lg p-5 flex items-center justify-center h-60 relative cursor-pointer hover:bg-[#434D64] transition mb-4">
                        {previewUrl ? (
                            <>
                                <Image
                                    src={previewUrl}
                                    alt="Preview"
                                    fill
                                    className="object-cover rounded-lg"
                                    unoptimized // Required for blob URLs
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

                <button type="submit" className="w-full py-2 px-4 bg-[#C9A94D] text-white font-bold rounded-lg hover:bg-[#b8973e] transition">
                    Update Sign In Content
                </button>
            </form>
        </div>
    );
}
