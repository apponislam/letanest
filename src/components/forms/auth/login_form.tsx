"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { ArrowLeft, CirclePlus, Eye, EyeOff } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useLoginMutation } from "@/redux/features/auth/authApi";
import { toast } from "sonner";
import { redirectPath, setRedirectPath, setUser } from "@/redux/features/auth/authSlice";
import { useRouter } from "next/navigation";

const loginSchema = z.object({
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

const LoginForm = () => {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const {
        register,
        handleSubmit,
        resetField,
        formState: { errors },
    } = useForm<LoginFormInputs>({
        resolver: zodResolver(loginSchema),
    });
    const dispatch = useDispatch();
    const [loginUser, { isLoading }] = useLoginMutation();

    const path = useSelector(redirectPath);

    const onSubmit = async (data: LoginFormInputs) => {
        const loadingToast = toast.loading("Logging in...");

        try {
            // payload directly from form
            const payload = {
                email: data.email,
                password: data.password,
            };

            // call the RTK Query login mutation
            const result = await loginUser(payload).unwrap();

            // show success toast
            toast.success(result?.message || "Logged in successfully!", { id: loadingToast });

            // save user and token in Redux
            dispatch(
                setUser({
                    user: result.data.user,
                    token: result.data.accessToken,
                })
            );

            console.log("Logged in user:", result);
            if (path) {
                dispatch(setRedirectPath(null));
                router.push(path);
            } else {
                router.push("/");
            }
        } catch (err: any) {
            toast.error(err?.data?.message || "Login failed", { id: loadingToast });
        }
    };

    return (
        <div className="flex flex-col md:min-h-screen relative">
            {/* Heading stays at the top */}
            <div className="md:absolute p-4 md:p-0 left-4 top-6 md:top-[70px] flex items-center gap-4 text-4xl">
                <div onClick={() => router.back()} className="cursor-pointer">
                    <ArrowLeft className="text-[#C9A94D] w-8 h-8" />
                </div>
                <h1 className="text-[#C9A94D]  font-bold">Sign In</h1>
            </div>

            {/* Centered Form */}
            <div className="flex items-center justify-center flex-1 px-4 ">
                <div className="rounded-xl shadow-lg w-full pt-[-70px]">
                    <form className="flex flex-col gap-3 w-full" onSubmit={handleSubmit(onSubmit)}>
                        {/* Email */}
                        <div className="flex flex-col">
                            <label className="mb-4 text-[#C9A94D]">Email</label>
                            <div className="relative">
                                <input type="email" placeholder="Enter E-mail" {...register("email")} className="w-full px-7 py-5 border border-white rounded-[10px] bg-white text-[#D4BA71] placeholder:text-[#D4BA71] focus:outline-none focus:ring-2 focus:ring-none" />

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
                                <input type={showPassword ? "text" : "password"} placeholder="Enter password" {...register("password")} className="w-full px-7 py-5 border border-white rounded-[10px] bg-white text-[#D4BA71] placeholder:text-[#D4BA71] focus:outline-none focus:ring-2 focus:ring-none" />

                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-7 top-1/2 -translate-y-1/2 text-[#D4BA71] hover:text-[#C9A94D]">
                                    {showPassword ? <EyeOff /> : <Eye />}
                                </button>
                            </div>
                            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
                        </div>

                        <Link href="/auth/forget-pass" className="text-right text-[#C9A94D]">
                            Recovery Password
                        </Link>

                        {/* Login Button */}
                        <button type="submit" className="w-full bg-[#C9A94D] text-white py-5 rounded-lg font-semibold hover:bg-[#b38f3e] transition-colors" disabled={isLoading}>
                            {isLoading ? "Signing In..." : "Sign In"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;
