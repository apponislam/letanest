"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

// --- Zod Schema ---
const userSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    gender: z.enum(["Male", "Female", "Other"]),
    contact: z.string().min(1, "Contact is required"),
    address: z.string().min(1, "Address is required"),
    country: z.string().min(1, "Country is required"),
    city: z.string().min(1, "City is required"),
    zip: z.string().min(1, "Zip is required"),
});

type UserFormType = z.infer<typeof userSchema>;

const EditUserProfileForm = () => {
    const router = useRouter();

    // --- Default user data ---
    const defaultUser = {
        firstName: "John",
        lastName: "Doe",
        gender: "Male" as "Male" | "Female" | "Other",
        contact: "000000000",
        address: "BLK208 L26 Manchester Street, Grand Broadmore, Antel Grand Village",
        country: "UK",
        city: "General Trias",
        zip: "4107",
        avatarUrl: "/dashboard/profile/profileimg.png",
        isVerified: true,
    };

    // --- Image state for preview ---
    const [imagePreview, setImagePreview] = useState<string>(() => defaultUser?.avatarUrl ?? "");

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<UserFormType>({
        resolver: zodResolver(userSchema),
        defaultValues: defaultUser,
    });

    const onSubmit = (data: UserFormType) => {
        console.log("Form submitted:", data);
        alert("Form submitted! Check console for data.");
    };

    const handleImageUpload = (file?: File) => {
        if (!file) return;
        if (!file.type.startsWith("image/")) return;

        const reader = new FileReader();
        reader.onload = () => setImagePreview(reader.result as string);
        reader.readAsDataURL(file);
    };

    const handleClickBack = () => router.back();

    return (
        <div className="container mx-auto">
            {/* Header */}
            <div className="p-5 border border-[#C9A94D] flex justify-between items-center mb-6 flex-col md:flex-row gap-4">
                <div className="text-[#C9A94D] flex items-center gap-3 text-[18px] cursor-pointer hover:underline" onClick={handleClickBack}>
                    <ArrowLeft />
                    <p>Back</p>
                </div>
                <h1 className="text-2xl text-[#C9A94D]">Edit Profile</h1>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)}>
                {/* Top: Image upload */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-center gap-5 mb-8">
                    <div
                        className="flex items-center gap-5 justify-center flex-col"
                        onDragOver={(e) => e.preventDefault()} // Allow drop
                        onDrop={(e) => {
                            e.preventDefault();
                            handleImageUpload(e.dataTransfer.files[0]);
                        }}
                    >
                        {/* Avatar Preview */}
                        <div className="relative w-[100px] h-[100px] rounded-full overflow-hidden border border-[#C9A94D]">{imagePreview && <Image src={imagePreview} alt="User Avatar" fill className="object-cover" />}</div>

                        {/* Click to choose */}
                        <div className="flex flex-col gap-2">
                            <label className="cursor-pointer bg-transparent text-[#C9A94D] px-16 py-2 rounded-[10px] flex items-center gap-2 border border-[#C9A94D] justify-center">
                                Choose File
                                <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e.target.files?.[0])} className="hidden" />
                            </label>
                            <p className="text-sm text-[#9399A6]">Drag & drop an image here or click to select</p>
                        </div>
                    </div>
                </div>

                <h1 className="mb-4 font-bold text-[#C9A94D]">Basic Information</h1>
                {/* Grid Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* First Name */}
                    <div className="flex flex-col md:gap-1">
                        <label className="text-[#C9A94D]">First Name(*)</label>
                        <input type="text" {...register("firstName")} placeholder="Enter first name" className="bg-white border rounded px-3 py-2 text-[#9399A6] placeholder-[#9399A6]" />
                        {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>}
                    </div>

                    {/* Last Name */}
                    <div className="flex flex-col md:gap-1">
                        <label className="text-[#C9A94D]">Last Name</label>
                        <input type="text" {...register("lastName")} placeholder="Enter last name" className="bg-white border rounded px-3 py-2 text-[#9399A6] placeholder-[#9399A6]" />
                        {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>}
                    </div>

                    {/* Gender */}
                    <div className="flex flex-col md:gap-1">
                        <label className="text-[#C9A94D]">Gender</label>
                        <select {...register("gender")} className="bg-white border rounded px-3 py-2 text-[#9399A6]">
                            <option>Male</option>
                            <option>Female</option>
                            <option>Other</option>
                        </select>
                    </div>

                    {/* Contact */}
                    <div className="flex flex-col md:gap-1">
                        <label className="text-[#C9A94D]">Contact</label>
                        <input type="text" {...register("contact")} placeholder="Enter contact number" className="bg-white border rounded px-3 py-2 text-[#9399A6] placeholder-[#9399A6]" />
                        {errors.contact && <p className="text-red-500 text-sm mt-1">{errors.contact.message}</p>}
                    </div>

                    {/* Complete Address */}
                    <div className="flex flex-col md:gap-1 md:col-span-2">
                        <label className="text-[#C9A94D]">Complete Address</label>
                        <input type="text" {...register("address")} placeholder="Enter full address" className="bg-white border rounded px-3 py-2 text-[#9399A6] placeholder-[#9399A6]" />
                        {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>}
                    </div>

                    {/* Country */}
                    <div className="flex flex-col md:gap-1">
                        <label className="text-[#C9A94D]">Country</label>
                        <input type="text" {...register("country")} placeholder="Enter country" className="bg-white border rounded px-3 py-2 text-[#9399A6] placeholder-[#9399A6]" />
                        {errors.country && <p className="text-red-500 text-sm mt-1">{errors.country.message}</p>}
                    </div>

                    {/* City */}
                    <div className="flex flex-col md:gap-1">
                        <label className="text-[#C9A94D]">City</label>
                        <input type="text" {...register("city")} placeholder="Enter city" className="bg-white border rounded px-3 py-2 text-[#9399A6] placeholder-[#9399A6]" />
                        {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>}
                    </div>

                    {/* Zip */}
                    <div className="flex flex-col md:gap-1">
                        <label className="text-[#C9A94D]">Zip/Postal Code</label>
                        <input type="text" {...register("zip")} placeholder="Enter zip code" className="bg-white border rounded px-3 py-2 text-[#9399A6] placeholder-[#9399A6]" />
                        {errors.zip && <p className="text-red-500 text-sm mt-1">{errors.zip.message}</p>}
                    </div>
                </div>

                {/* Submit Button */}
                <div className="mt-6 flex justify-center">
                    <button type="submit" className="bg-[#C9A94D] text-white rounded-[4px] px-10 py-2 flex items-center gap-2 text-base">
                        Save
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditUserProfileForm;
