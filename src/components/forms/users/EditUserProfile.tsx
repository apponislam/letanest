// "use client";

// import React, { useState } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import * as z from "zod";
// import { ArrowLeft } from "lucide-react";
// import Image from "next/image";
// import { useRouter } from "next/navigation";
// import PageHeader from "@/components/PageHeader";
// import { useUpdateUserProfileMutation } from "@/redux/features/users/usersApi";
// import { toast } from "sonner";

// // --- Zod Schema ---
// const userSchema = z.object({
//     firstName: z.string().min(1, "First name is required"),
//     lastName: z.string().min(1, "Last name is required"),
//     gender: z.enum(["Male", "Female", "Other"]),
//     phone: z.string().min(1, "Phone is required"),
//     address: z.string().min(1, "Address is required"),
//     country: z.string().min(1, "Country is required"),
//     city: z.string().min(1, "City is required"),
//     zip: z.string().min(1, "Zip is required"),
// });

// type UserFormType = z.infer<typeof userSchema>;

// const EditUserProfileForm = () => {
//     const router = useRouter();
//     const [updateUserProfile, { isLoading: isUpdating }] = useUpdateUserProfileMutation();

//     // --- Default user data ---
//     const defaultUser = {
//         firstName: "John",
//         lastName: "Doe",
//         gender: "Male" as "Male" | "Female" | "Other",
//         phone: "000000000",
//         address: "BLK208 L26 Manchester Street, Grand Broadmore, Antel Grand Village",
//         country: "UK",
//         city: "General Trias",
//         zip: "4107",
//         avatarUrl: "/dashboard/profile/profileimg.png",
//     };

//     // --- Image state for preview ---
//     const [imagePreview, setImagePreview] = useState<string>(() => defaultUser?.avatarUrl ?? "");
//     const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);

//     const {
//         register,
//         handleSubmit,
//         formState: { errors },
//     } = useForm<UserFormType>({
//         resolver: zodResolver(userSchema),
//         defaultValues: defaultUser,
//     });

//     const onSubmit = async (data: UserFormType) => {
//         try {
//             const formData = new FormData();
//             formData.append("firstName", data.firstName);
//             formData.append("lastName", data.lastName);
//             formData.append("gender", data.gender);
//             formData.append("phone", data.phone);
//             formData.append("address", data.address);
//             formData.append("country", data.country);
//             formData.append("city", data.city);
//             formData.append("zip", data.zip);

//             // If new image is selected, append it
//             if (selectedImageFile) {
//                 formData.append("profileImg", selectedImageFile);
//             }

//             const result = await updateUserProfile(formData).unwrap();
//             toast.success("Profile updated successfully!");
//             console.log("Profile updated:", result);

//             // Redirect back or show success
//             router.push("/dashboard/profile");
//         } catch (error: any) {
//             console.error("Update failed:", error);
//             toast.error(error?.data?.message || "Failed to update profile. Please try again.");
//         }
//     };

//     const handleImageUpload = (file?: File) => {
//         if (!file) return;
//         if (!file.type.startsWith("image/")) {
//             toast.error("Please select a valid image file");
//             return;
//         }

//         // Validate file size (2MB)
//         if (file.size > 2 * 1024 * 1024) {
//             toast.error("Image size must be less than 2MB");
//             return;
//         }

//         const reader = new FileReader();
//         reader.onload = () => {
//             setImagePreview(reader.result as string);
//             setSelectedImageFile(file);
//         };
//         reader.readAsDataURL(file);
//     };

//     const handleClickBack = () => router.back();

//     return (
//         <div className="container mx-auto">
//             <PageHeader title="Edit Profile" isUser={false}></PageHeader>

//             {/* Form */}
//             <form onSubmit={handleSubmit(onSubmit)}>
//                 {/* Top: Image upload */}
//                 <div className="flex flex-col md:flex-row items-start md:items-center justify-center gap-5 mb-8">
//                     <div
//                         className="flex items-center gap-5 justify-center flex-col"
//                         onDragOver={(e) => e.preventDefault()}
//                         onDrop={(e) => {
//                             e.preventDefault();
//                             handleImageUpload(e.dataTransfer.files[0]);
//                         }}
//                     >
//                         {/* Avatar Preview */}
//                         <div className="relative w-[100px] h-[100px] rounded-full overflow-hidden border border-[#C9A94D]">{imagePreview && <Image src={imagePreview} alt="User Avatar" fill className="object-cover" />}</div>

//                         {/* Click to choose */}
//                         <div className="flex flex-col gap-2">
//                             <label className="cursor-pointer bg-transparent text-[#C9A94D] px-16 py-2 rounded-[10px] flex items-center gap-2 border border-[#C9A94D] justify-center">
//                                 Choose File
//                                 <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e.target.files?.[0])} className="hidden" />
//                             </label>
//                             <p className="text-sm text-[#9399A6]">Drag & drop an image here or click to select</p>
//                         </div>
//                     </div>
//                 </div>

//                 <h1 className="mb-4 font-bold text-[#C9A94D]">Basic Information</h1>

//                 {/* Grid Form Fields */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                     {/* First Name */}
//                     <div className="flex flex-col md:gap-1">
//                         <label className="text-[#C9A94D]">First Name(*)</label>
//                         <input type="text" {...register("firstName")} placeholder="Enter first name" className="bg-white border rounded px-3 py-2 text-[#9399A6] placeholder-[#9399A6]" />
//                         {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>}
//                     </div>

//                     {/* Last Name */}
//                     <div className="flex flex-col md:gap-1">
//                         <label className="text-[#C9A94D]">Last Name</label>
//                         <input type="text" {...register("lastName")} placeholder="Enter last name" className="bg-white border rounded px-3 py-2 text-[#9399A6] placeholder-[#9399A6]" />
//                         {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>}
//                     </div>

//                     {/* Gender */}
//                     <div className="flex flex-col md:gap-1">
//                         <label className="text-[#C9A94D]">Gender</label>
//                         <select {...register("gender")} className="bg-white border rounded px-3 py-2 text-[#9399A6]">
//                             <option value="Male">Male</option>
//                             <option value="Female">Female</option>
//                             <option value="Other">Other</option>
//                         </select>
//                     </div>

//                     {/* Phone */}
//                     <div className="flex flex-col md:gap-1">
//                         <label className="text-[#C9A94D]">Phone</label>
//                         <input type="text" {...register("phone")} placeholder="Enter phone number" className="bg-white border rounded px-3 py-2 text-[#9399A6] placeholder-[#9399A6]" />
//                         {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
//                     </div>

//                     {/* Complete Address */}
//                     <div className="flex flex-col md:gap-1 md:col-span-2">
//                         <label className="text-[#C9A94D]">Complete Address</label>
//                         <input type="text" {...register("address")} placeholder="Enter full address" className="bg-white border rounded px-3 py-2 text-[#9399A6] placeholder-[#9399A6]" />
//                         {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>}
//                     </div>

//                     {/* Country */}
//                     <div className="flex flex-col md:gap-1">
//                         <label className="text-[#C9A94D]">Country</label>
//                         <input type="text" {...register("country")} placeholder="Enter country" className="bg-white border rounded px-3 py-2 text-[#9399A6] placeholder-[#9399A6]" />
//                         {errors.country && <p className="text-red-500 text-sm mt-1">{errors.country.message}</p>}
//                     </div>

//                     {/* City */}
//                     <div className="flex flex-col md:gap-1">
//                         <label className="text-[#C9A94D]">City</label>
//                         <input type="text" {...register("city")} placeholder="Enter city" className="bg-white border rounded px-3 py-2 text-[#9399A6] placeholder-[#9399A6]" />
//                         {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>}
//                     </div>

//                     {/* Zip */}
//                     <div className="flex flex-col md:gap-1">
//                         <label className="text-[#C9A94D]">Zip/Postal Code</label>
//                         <input type="text" {...register("zip")} placeholder="Enter zip code" className="bg-white border rounded px-3 py-2 text-[#9399A6] placeholder-[#9399A6]" />
//                         {errors.zip && <p className="text-red-500 text-sm mt-1">{errors.zip.message}</p>}
//                     </div>
//                 </div>

//                 {/* Submit Button */}
//                 <div className="mt-6 flex justify-center">
//                     <button type="submit" disabled={isUpdating} className="bg-[#C9A94D] text-white rounded-[4px] px-10 py-2 flex items-center gap-2 text-base disabled:opacity-50">
//                         {isUpdating ? "Updating..." : "Save"}
//                     </button>
//                 </div>
//             </form>
//         </div>
//     );
// };

// export default EditUserProfileForm;

"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import { useUpdateUserProfileMutation, useGetSingleUserQuery } from "@/redux/features/users/usersApi";
import { currentUser, setUser } from "@/redux/features/auth/authSlice";
import { useAppSelector } from "@/redux/hooks";
import { toast } from "sonner";
import { splitFullName } from "@/utils/splitFullName";
import { useDispatch } from "react-redux";
import { useRefreshTokenMutation } from "@/redux/features/auth/authApi";

// --- Zod Schema ---
const userSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    gender: z.enum(["Male", "Female", "Other"]),
    phone: z.string().min(1, "Phone is required"),
    address: z.string().min(1, "Address is required"),
    country: z.string().min(1, "Country is required"),
    city: z.string().min(1, "City is required"),
    zip: z.string().min(1, "Zip is required"),
});

type UserFormType = z.infer<typeof userSchema>;

const EditUserProfileForm = () => {
    const router = useRouter();
    const mainuser = useAppSelector(currentUser);
    const [updateUserProfile, { isLoading: isUpdating }] = useUpdateUserProfileMutation();

    // Fetch current user data
    const { data: userData, isLoading: isLoadingUser } = useGetSingleUserQuery(mainuser?._id!);

    // --- Image state for preview ---
    const [imagePreview, setImagePreview] = useState<string>("/dashboard/profile/profileimg.png");
    const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<UserFormType>({
        resolver: zodResolver(userSchema),
    });

    // Set form values when user data is loaded
    useEffect(() => {
        if (userData?.data) {
            const user = userData.data;
            const { firstName, lastName } = splitFullName(user.name || "");

            // Set form values
            reset({
                firstName: firstName || "",
                lastName: lastName || "",
                gender: user.gender || "Male",
                phone: user.phone || "",
                address: user.address?.street || "",
                country: user.address?.country || "",
                city: user.address?.city || "",
                zip: user.address?.zip || "",
            });

            // Set profile image
            if (user.profileImg) {
                setImagePreview(`${process.env.NEXT_PUBLIC_BASE_API}${user.profileImg}`);
            } else {
                setImagePreview("/dashboard/profile/profileimg.png");
            }
        }
    }, [userData, reset]);

    const dispatch = useDispatch();
    const [refreshToken] = useRefreshTokenMutation();

    const onSubmit = async (data: UserFormType) => {
        try {
            const formData = new FormData();
            formData.append("firstName", data.firstName);
            formData.append("lastName", data.lastName);
            formData.append("gender", data.gender);
            formData.append("phone", data.phone);
            formData.append("address", data.address);
            formData.append("country", data.country);
            formData.append("city", data.city);
            formData.append("zip", data.zip);

            // If new image is selected, append it
            if (selectedImageFile) {
                formData.append("profileImg", selectedImageFile);
            }

            const result = await updateUserProfile(formData).unwrap();
            toast.success("Profile updated successfully!");
            console.log("Profile updated:", result);

            try {
                const refreshResult = await refreshToken().unwrap();

                if (refreshResult.data) {
                    const backendData = refreshResult.data;
                    const user = backendData.user;
                    const accessToken = backendData.accessToken;

                    console.log("Refreshed user:", user);
                    console.log("New access token:", accessToken);

                    // Update user and token in Redux store
                    dispatch(setUser({ user, token: accessToken }));

                    toast.success("Profile and session updated successfully!");
                }
            } catch (refreshError) {
                console.warn("Token refresh failed, but profile was updated:", refreshError);
                // Continue even if token refresh fails since profile update was successful
            }

            // Redirect back to profile
            router.push("/dashboard/profile");
        } catch (error: any) {
            console.error("Update failed:", error);
            toast.error(error?.data?.message || "Failed to update profile. Please try again.");
        }
    };

    const handleImageUpload = (file?: File) => {
        if (!file) return;
        if (!file.type.startsWith("image/")) {
            toast.error("Please select a valid image file");
            return;
        }

        // Validate file size (2MB)
        if (file.size > 2 * 1024 * 1024) {
            toast.error("Image size must be less than 2MB");
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            setImagePreview(reader.result as string);
            setSelectedImageFile(file);
        };
        reader.readAsDataURL(file);
    };

    const handleClickBack = () => router.back();

    if (isLoadingUser) {
        return (
            <div className="container mx-auto">
                <PageHeader title="Edit Profile" isUser={false} />
                <div className="flex justify-center items-center h-64">
                    <p className="text-[#C9A94D]">Loading user data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto">
            <PageHeader title="Edit Profile" isUser={false} />

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)}>
                {/* Top: Image upload */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-center gap-5 mb-8">
                    <div
                        className="flex items-center gap-5 justify-center flex-col"
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                            e.preventDefault();
                            handleImageUpload(e.dataTransfer.files[0]);
                        }}
                    >
                        {/* Avatar Preview */}
                        <div className="relative w-[100px] h-[100px] rounded-full overflow-hidden border border-[#C9A94D]">
                            <Image src={imagePreview} alt="User Avatar" fill className="object-cover" />
                        </div>

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
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    {/* Phone */}
                    <div className="flex flex-col md:gap-1">
                        <label className="text-[#C9A94D]">Phone</label>
                        <input type="text" {...register("phone")} placeholder="Enter phone number" className="bg-white border rounded px-3 py-2 text-[#9399A6] placeholder-[#9399A6]" />
                        {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
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
                    <button type="submit" disabled={isUpdating} className="bg-[#C9A94D] text-white rounded-[4px] px-10 py-2 flex items-center gap-2 text-base disabled:opacity-50">
                        {isUpdating ? "Updating..." : "Save"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditUserProfileForm;
