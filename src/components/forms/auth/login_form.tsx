"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { CirclePlus, Eye, EyeOff } from "lucide-react";

const loginSchema = z.object({
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

const LoginForm = () => {
    const [showPassword, setShowPassword] = useState(false);
    const {
        register,
        handleSubmit,
        resetField,
        formState: { errors },
    } = useForm<LoginFormInputs>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = (data: LoginFormInputs) => {
        console.log("Form Submitted:", data);
        // You can add axios login request here
    };

    return (
        <div className="flex flex-col md:min-h-screen">
            {/* Heading stays at the top */}
            <h1 className="text-[#C9A94D] text-4xl font-bold mb-8 text-left px-4 pt-[70px] md:absolute">Sign In</h1>

            {/* Centered Form */}
            <div className="flex items-center justify-center flex-1 px-4 ">
                <div className="rounded-xl shadow-lg w-full pt-[-70px]">
                    <form className="flex flex-col gap-3 w-full" onSubmit={handleSubmit(onSubmit)}>
                        {/* Email */}
                        <div className="flex flex-col">
                            <label className="mb-4 text-[#C9A94D]">Email</label>
                            <div className="relative">
                                <input type="email" placeholder="Enter your email" {...register("email")} className="w-full px-7 py-5 border border-white rounded-[10px] bg-white text-[#D4BA71] placeholder:text-[#D4BA71] focus:outline-none focus:ring-2 focus:ring-none" />

                                <button type="button" onClick={() => resetField("email")} className="absolute right-7 top-1/2 -translate-y-1/2 text-[#D4BA71] hover:text-[#C9A94D]">
                                    {/* &#10005; */}
                                    <CirclePlus className="rotate-[45deg]" />
                                </button>
                            </div>
                            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                        </div>

                        {/* Password */}
                        <div className="flex flex-col">
                            <label className="mb-4 text-[#C9A94D]">Password</label>
                            <div className="relative">
                                <input type={showPassword ? "text" : "password"} placeholder="Enter your password" {...register("password")} className="w-full px-7 py-5 border border-white rounded-[10px] bg-white text-[#D4BA71] placeholder:text-[#D4BA71] focus:outline-none focus:ring-2 focus:ring-none" />

                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-7 top-1/2 -translate-y-1/2 text-[#D4BA71] hover:text-[#C9A94D]">
                                    {showPassword ? <EyeOff /> : <Eye />}
                                </button>
                            </div>
                            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
                        </div>

                        <Link href="/auth/forgot-pass" className="text-right text-[#C9A94D]">
                            Recovery Password
                        </Link>

                        {/* Login Button */}
                        <button type="submit" className="w-full bg-[#C9A94D] text-white py-5 rounded-lg font-semibold hover:bg-[#b38f3e] transition-colors">
                            Login
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;
