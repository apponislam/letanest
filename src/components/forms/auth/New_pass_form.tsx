"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useResetPasswordWithTokenMutation } from "@/redux/features/auth/authApi";
import { toast } from "sonner";

const resetPasswordSchema = z
    .object({
        newPassword: z.string().min(6, "Password must be at least 6 characters"),
        confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

type ResetPasswordFormInputs = z.infer<typeof resetPasswordSchema>;

const ResetPasswordForm = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const resetToken = searchParams.get("token");
    const [showPassword, setShowPassword] = useState(false);
    const [showPassword2, setShowPassword2] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ResetPasswordFormInputs>({
        resolver: zodResolver(resetPasswordSchema),
    });
    const [resetPasswordWithToken, { isLoading }] = useResetPasswordWithTokenMutation();

    const onSubmit = async (data: ResetPasswordFormInputs) => {
        if (!resetToken) {
            toast.error("Invalid or missing token");
            return;
        }
        const loadingToast = toast.loading("Resetting password...");
        try {
            await resetPasswordWithToken({ resetToken, newPassword: data.newPassword }).unwrap();
            toast.success("Password reset successfully", { id: loadingToast });
            router.push("/auth/login");
        } catch (err: any) {
            toast.error(err?.data?.message || "Failed to reset password", { id: loadingToast });
        }
    };

    return (
        <div className="flex flex-col md:min-h-screen relative">
            <div className="md:absolute p-4 md:p-0 left-4 top-6 md:top-[70px] flex items-center gap-4 text-4xl">
                <div onClick={() => router.back()} className="cursor-pointer">
                    <ArrowLeft className="text-[#C9A94D] w-8 h-8" />
                </div>
                <h1 className="text-[#C9A94D]  font-bold">Reset Password</h1>
            </div>

            {/* Centered Form */}
            <div className="flex items-center justify-center flex-1 px-4">
                <div className="rounded-xl shadow-lg w-full">
                    <form className="flex flex-col gap-6 w-full" onSubmit={handleSubmit(onSubmit)}>
                        {/* New Password */}
                        <div className="flex flex-col">
                            <label className="mb-4 text-[#C9A94D]">New Password</label>
                            <div className="relative">
                                <input type={showPassword ? "text" : "password"} placeholder="Enter new password" {...register("newPassword")} className="w-full px-7 py-5 border border-white rounded-[10px] bg-white text-[#D4BA71] placeholder:text-[#D4BA71] focus:outline-none focus:ring-2 focus:ring-none" />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-7 top-1/2 -translate-y-1/2 text-[#D4BA71] hover:text-[#C9A94D]">
                                    {showPassword ? <EyeOff /> : <Eye />}
                                </button>
                            </div>
                            {errors.newPassword && <p className="text-red-500 text-sm mt-1">{errors.newPassword.message}</p>}
                        </div>

                        {/* Confirm Password */}
                        <div className="flex flex-col">
                            <label className="mb-4 text-[#C9A94D]">Confirm Password</label>
                            <div className="relative">
                                <input type={showPassword2 ? "text" : "password"} placeholder="Confirm password" {...register("confirmPassword")} className="w-full px-7 py-5 border border-white rounded-[10px] bg-white text-[#D4BA71] placeholder:text-[#D4BA71] focus:outline-none focus:ring-2 focus:ring-none" />
                                <button type="button" onClick={() => setShowPassword2(!showPassword2)} className="absolute right-7 top-1/2 -translate-y-1/2 text-[#D4BA71] hover:text-[#C9A94D]">
                                    {showPassword2 ? <EyeOff /> : <Eye />}
                                </button>
                            </div>
                            {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>}
                        </div>

                        {/* Submit Button */}
                        <button type="submit" className="w-full bg-[#C9A94D] text-white py-5 rounded-lg font-semibold hover:bg-[#b38f3e] transition-colors">
                            Reset Password
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ResetPasswordForm;
