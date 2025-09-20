"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { CirclePlus, Eye, EyeOff } from "lucide-react";
import Link from "next/link";

const signupSchema = z.object({
    fullName: z.string().min(2, "Full Name is required"),
    phone: z.string().min(10, "Phone must be at least 10 digits"),
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    acceptedTerms: z.boolean().refine((val) => val === true, { message: "You must accept terms and conditions" }),
});

type SignUpFormInputs = z.infer<typeof signupSchema>;

const SignUpForm = () => {
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        resetField,
        formState: { errors },
    } = useForm<SignUpFormInputs>({
        resolver: zodResolver(signupSchema),
    });

    const onSubmit = (data: SignUpFormInputs) => {
        console.log("Sign Up Form Submitted:", data);
        // Add axios/fetch request here
    };

    return (
        <div className="flex flex-col md:min-h-screen">
            {/* Heading */}
            <h1 className="text-[#C9A94D] text-4xl font-bold mb-8 text-left px-4 pt-6 md:pt-[70px] md:absolute">Sign Up</h1>

            {/* Centered Form */}
            <div className="flex items-center justify-center flex-1 px-4">
                <div className="rounded-xl w-full">
                    <form className="flex flex-col gap-3 w-full" onSubmit={handleSubmit(onSubmit)}>
                        {/* Full Name */}
                        <div className="flex flex-col">
                            <label className="mb-4 text-[#C9A94D]">Full Name</label>
                            <input type="text" placeholder="Enter your full name" {...register("fullName")} className="w-full px-7 py-5 border border-white rounded-[10px] bg-white text-[#D4BA71] placeholder:text-[#D4BA71] focus:outline-none focus:ring-2 focus:ring-[#C9A94D]" />
                            {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>}
                        </div>

                        {/* Phone */}
                        <div className="flex flex-col">
                            <label className="mb-4 text-[#C9A94D]">Phone</label>
                            <input type="tel" placeholder="Enter your phone number" {...register("phone")} className="w-full px-7 py-5 border border-white rounded-[10px] bg-white text-[#D4BA71] placeholder:text-[#D4BA71] focus:outline-none focus:ring-2 focus:ring-[#C9A94D]" />
                            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
                        </div>

                        {/* Email */}
                        <div className="flex flex-col">
                            <label className="mb-4 text-[#C9A94D]">Email</label>
                            <div className="relative">
                                <input type="email" placeholder="Enter your email" {...register("email")} className="w-full px-7 py-5 border border-white rounded-[10px] bg-white text-[#D4BA71] placeholder:text-[#D4BA71] focus:outline-none focus:ring-2 focus:ring-[#C9A94D]" />
                                <button type="button" onClick={() => resetField("email")} className="absolute right-7 top-1/2 -translate-y-1/2 text-[#D4BA71] hover:text-[#C9A94D]">
                                    <CirclePlus className="rotate-[45deg]" />
                                </button>
                            </div>
                            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                        </div>

                        {/* Password */}
                        <div className="flex flex-col">
                            <label className="mb-4 text-[#C9A94D]">Password</label>
                            <div className="relative">
                                <input type={showPassword ? "text" : "password"} placeholder="Enter your password" {...register("password")} className="w-full px-7 py-5 border border-white rounded-[10px] bg-white text-[#D4BA71] placeholder:text-[#D4BA71] focus:outline-none focus:ring-2 focus:ring-[#C9A94D]" />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-7 top-1/2 -translate-y-1/2 text-[#D4BA71] hover:text-[#C9A94D]">
                                    {showPassword ? <EyeOff /> : <Eye />}
                                </button>
                            </div>
                            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
                        </div>

                        {/* Terms */}
                        <div className="flex items-center gap-2">
                            <input type="checkbox" {...register("acceptedTerms")} className="accent-[#C9A94D]" />
                            <label className="text-[#C9A94D]">I accept the terms and conditions</label>
                        </div>
                        {errors.acceptedTerms && <p className="text-red-500 text-sm mt-1">{errors.acceptedTerms.message}</p>}

                        {/* Sign Up Button */}
                        <button type="submit" className="w-full bg-[#C9A94D] text-white py-5 rounded-lg font-semibold hover:bg-[#b38f3e] transition-colors">
                            Sign Up
                        </button>
                        <p className="text-[#C9A94D]">
                            Already have an account?{" "}
                            <Link href="/auth/login" className="text-[#135E9A]">
                                Sign In
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SignUpForm;
