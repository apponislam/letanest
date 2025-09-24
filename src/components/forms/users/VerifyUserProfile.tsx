"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

// --- Zod Schema ---
const verifySchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    dob: z.string().min(1, "Date of birth is required"),
    countryOfBirth: z.string().min(1, "Country of birth is required"),
    cityOfBirth: z.string().min(1, "City of birth is required"),
    zip: z.string().min(1, "Zip code is required"),
    proofAddress: z.instanceof(File, { message: "Proof of Address is required" }),
    proofID: z.instanceof(File, { message: "Proof of ID is required" }),
});

type VerifyFormType = z.infer<typeof verifySchema>;

const VerifyUserProfileForm = () => {
    const router = useRouter();

    const [proofAddress, setProofAddress] = useState<File | null>(null);
    const [proofID, setProofID] = useState<File | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm<VerifyFormType>({
        resolver: zodResolver(verifySchema),
    });

    const handleFileUpload = (file: File | undefined, field: "proofAddress" | "proofID") => {
        if (!file) return;
        if (field === "proofAddress") {
            setProofAddress(file);
            setValue("proofAddress", file);
        } else {
            setProofID(file);
            setValue("proofID", file);
        }
    };

    const onSubmit = (data: VerifyFormType) => {
        console.log("Form submitted:", data);
        alert("Application submitted! Check console for details.");
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
                <h1 className="text-2xl text-[#C9A94D]">Verify Profile</h1>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)}>
                <h1 className="mb-4 font-bold text-[#C9A94D]">Personal Information</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* First Name */}
                    <div className="flex flex-col md:gap-1">
                        <label className="text-[#C9A94D]">First Name *</label>
                        <input type="text" {...register("firstName")} placeholder="Enter first name" className="bg-white border rounded px-3 py-2 text-[#9399A6] placeholder-[#9399A6]" />
                        {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>}
                    </div>

                    {/* Last Name */}
                    <div className="flex flex-col md:gap-1">
                        <label className="text-[#C9A94D]">Last Name *</label>
                        <input type="text" {...register("lastName")} placeholder="Enter last name" className="bg-white border rounded px-3 py-2 text-[#9399A6] placeholder-[#9399A6]" />
                        {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>}
                    </div>

                    {/* Date of Birth */}
                    <div className="flex flex-col md:gap-1">
                        <label className="text-[#C9A94D]">Date of Birth</label>
                        <input type="text" {...register("dob")} placeholder="XX-XX-XXXX" className="bg-white border rounded px-3 py-2 text-[#9399A6] placeholder-[#9399A6]" />
                        {errors.dob && <p className="text-red-500 text-sm mt-1">{errors.dob.message}</p>}
                    </div>

                    {/* Country of Birth */}
                    <div className="flex flex-col md:gap-1">
                        <label className="text-[#C9A94D]">Country of Birth</label>
                        <input type="text" {...register("countryOfBirth")} placeholder="Enter country" className="bg-white border rounded px-3 py-2 text-[#9399A6] placeholder-[#9399A6]" />
                        {errors.countryOfBirth && <p className="text-red-500 text-sm mt-1">{errors.countryOfBirth.message}</p>}
                    </div>

                    {/* City of Birth */}
                    <div className="flex flex-col md:gap-1">
                        <label className="text-[#C9A94D]">City of Birth</label>
                        <input type="text" {...register("cityOfBirth")} placeholder="Enter city" className="bg-white border rounded px-3 py-2 text-[#9399A6] placeholder-[#9399A6]" />
                        {errors.cityOfBirth && <p className="text-red-500 text-sm mt-1">{errors.cityOfBirth.message}</p>}
                    </div>

                    {/* Zip Code */}
                    <div className="flex flex-col md:gap-1">
                        <label className="text-[#C9A94D]">Zip Code</label>
                        <input type="text" {...register("zip")} placeholder="Enter zip code" className="bg-white border rounded px-3 py-2 text-[#9399A6] placeholder-[#9399A6]" />
                        {errors.zip && <p className="text-red-500 text-sm mt-1">{errors.zip.message}</p>}
                    </div>
                </div>

                {/* Document Uploads */}
                <h1 className="mb-4 mt-8 font-bold text-[#C9A94D]">Documents</h1>
                <div className="grid grid-cols-1 gap-8">
                    {/* Proof of Address */}
                    <div className="flex flex-col gap-2">
                        <label className="text-[#C9A94D]">Proof of Address</label>
                        <label
                            className="border border-[#C9A94D] rounded-[10px] p-4 text-center cursor-pointer bg-white text-[#9399A6] relative"
                            onDrop={(e) => {
                                e.preventDefault();
                                const file = e.dataTransfer?.files[0];
                                if (file) handleFileUpload(file, "proofAddress");
                            }}
                            onDragOver={(e) => e.preventDefault()}
                        >
                            <div className="flex items-center gap-2 justify-center">
                                <Image src="/dashboard/profile/folder-upload.png" alt="Folder Upload" height={20} width={20}></Image>
                                <span>{proofAddress ? proofAddress.name : "Drop file here or choose file to upload your documents"}</span>
                            </div>
                            <input
                                type="file"
                                accept="image/*,application/pdf"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) handleFileUpload(file, "proofAddress");
                                }}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                        </label>
                        {errors.proofAddress && <p className="text-red-500 text-sm mt-1">{errors.proofAddress.message}</p>}
                    </div>

                    {/* Proof of ID */}
                    <div className="flex flex-col gap-2">
                        <label className="text-[#C9A94D]">Proof of Person (ID)</label>
                        <label
                            className="border border-[#C9A94D] rounded-[10px] p-4 text-center cursor-pointer bg-white text-[#9399A6] relative"
                            onDrop={(e) => {
                                e.preventDefault();
                                const file = e.dataTransfer?.files[0];
                                if (file) handleFileUpload(file, "proofID");
                            }}
                            onDragOver={(e) => e.preventDefault()}
                        >
                            <div className="flex items-center gap-2 justify-center">
                                <Image src="/dashboard/profile/folder-upload.png" alt="Folder Upload" height={20} width={20}></Image>
                                <span>{proofID ? proofID.name : "Drop file here or choose file to upload your documents"}</span>
                            </div>

                            <input
                                type="file"
                                accept="image/*,application/pdf"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) handleFileUpload(file, "proofID");
                                }}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                        </label>
                        {errors.proofID && <p className="text-red-500 text-sm mt-1">{errors.proofID.message}</p>}
                    </div>
                </div>

                {/* Submit Button */}
                <div className="mt-6 flex">
                    <button type="submit" className="bg-[#C9A94D] text-white rounded-[4px] px-10 py-2 flex items-center gap-2 text-base">
                        Submit Application
                    </button>
                </div>
            </form>
        </div>
    );
};

export default VerifyUserProfileForm;
