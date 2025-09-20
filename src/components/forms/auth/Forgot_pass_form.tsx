"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { CirclePlus } from "lucide-react";

const forgotPassSchema = z.object({
    email: z.string().email("Invalid email"),
});

type ForgotPassFormInputs = z.infer<typeof forgotPassSchema>;

const ForgotPassForm = () => {
    const {
        register,
        handleSubmit,
        resetField,
        formState: { errors },
    } = useForm<ForgotPassFormInputs>({
        resolver: zodResolver(forgotPassSchema),
    });

    const onSubmit = (data: ForgotPassFormInputs) => {
        console.log("Forgot Password Submitted:", data);
        // You can add axios request here to trigger password recovery
    };

    return (
        <div className="flex flex-col md:min-h-screen">
            {/* Heading stays at the top */}
            <h1 className="text-[#C9A94D] text-4xl font-bold mb-8 text-left px-4 pt-6 md:pt-[70px] md:absolute">Forgot Password</h1>

            {/* Centered Form */}
            <div className="flex items-center justify-center flex-1 px-4">
                <div className="rounded-xl shadow-lg w-full">
                    <form className="flex flex-col gap-6 w-full" onSubmit={handleSubmit(onSubmit)}>
                        {/* Email */}
                        <div className="flex flex-col">
                            <label className="mb-4 text-[#C9A94D]">Email</label>
                            <div className="relative">
                                <input type="email" placeholder="Enter E-mail" {...register("email")} className="w-full px-7 py-5 border border-white rounded-[10px] bg-white text-[#D4BA71] placeholder:text-[#D4BA71] focus:outline-none focus:ring-2 focus:ring-none" />
                                <button type="button" onClick={() => resetField("email")} className="absolute right-7 top-1/2 -translate-y-1/2 text-[#D4BA71] hover:text-[#C9A94D]">
                                    <CirclePlus className="rotate-[45deg]" />
                                </button>
                            </div>
                            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                        </div>

                        {/* Submit Button */}
                        <button type="submit" className="w-full bg-[#C9A94D] text-white py-5 rounded-lg font-semibold hover:bg-[#b38f3e] transition-colors">
                            Next
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassForm;
