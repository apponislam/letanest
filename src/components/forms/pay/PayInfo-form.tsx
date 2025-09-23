"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// ✅ Zod schema
const payFormSchema = z.object({
    firstName: z.string().min(2, "First name is required"),
    lastName: z.string().min(2, "Last name is required"),
    email: z.string().email("Invalid email address"),
});

type PayFormData = z.infer<typeof payFormSchema>;

const PayInfoForm: React.FC = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<PayFormData>({
        resolver: zodResolver(payFormSchema),
    });

    const onSubmit = (data: PayFormData) => {
        console.log("Form submitted:", data);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="mx-auto space-y-6 max-w-lg">
            {/* First Name | Last Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block mb-10 text-[#C9A94D] font-medium">First Name</label>
                    <input type="text" placeholder="Enter your first name" {...register("firstName")} className="rounded-[8px] w-full border border-[#C9A94D] px-2 py-2 text-[#E6D7AD] placeholder-[#E6D7AD] focus:outline-none" />
                    {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>}
                </div>

                <div>
                    <label className="block mb-10 text-[#C9A94D] font-medium">Last Name</label>
                    <input type="text" placeholder="Enter your last name" {...register("lastName")} className="rounded-[8px] w-full border border-[#C9A94D] px-2 py-2 text-[#E6D7AD] placeholder-[#E6D7AD] focus:outline-none" />
                    {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>}
                </div>
            </div>

            {/* Email */}
            <div>
                <label className="block mb-10 text-[#C9A94D] font-medium">Email</label>
                <input type="email" placeholder="Enter your email" {...register("email")} className="rounded-[8px] w-full border border-[#C9A94D] px-2 py-2 text-[#E6D7AD] placeholder-[#E6D7AD] focus:outline-none" />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            </div>

            {/* Checkout button */}
            <button type="submit" className="bg-[#C9A94D] text-white py-4 px-10 rounded-lg hover:bg-[#af8d28] transition-all w-full mt-10">
                Check out
            </button>
        </form>
    );
};

export default PayInfoForm;
