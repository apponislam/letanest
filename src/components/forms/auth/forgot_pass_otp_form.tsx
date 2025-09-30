"use client";
import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useResendResetOtpMutation, useVerifyOtpMutation } from "@/redux/features/auth/authApi";
import { toast } from "sonner";

const otpSchema = z.object({
    otp: z
        .string()
        .length(6, "OTP must be 6 digits")
        .regex(/^\d{6}$/, "OTP must contain only numbers"),
});

type OtpFormInputs = z.infer<typeof otpSchema>;

const OtpForm = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get("email");
    const {
        setError,
        clearErrors,
        formState: { errors },
    } = useForm<OtpFormInputs>({
        defaultValues: { otp: "" },
    });

    const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
    const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

    if (!email) {
        toast.error("Email is missing");
        router.push("/auth/forgot-password");
        return;
    }

    const handleChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        clearErrors("otp");
        if (value && index < 5) inputsRef.current[index + 1]?.focus();
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputsRef.current[index - 1]?.focus();
        }
    };

    const [verifyOtp] = useVerifyOtpMutation();
    const [resendResetOtp] = useResendResetOtpMutation();

    const handleSubmit = async () => {
        const enteredOtp = otp.join(""); // join 6 digits
        const validation = otpSchema.safeParse({ otp: enteredOtp });

        if (!validation.success) {
            setError("otp", { type: "manual", message: validation.error.issues[0].message });
            return;
        }

        const loadingToast = toast.loading("Verifying OTP...");
        try {
            const result = await verifyOtp({ email, otp: enteredOtp }).unwrap();

            toast.success("OTP verified!", { id: loadingToast });
            router.push(`/auth/new-pass?token=${encodeURIComponent(result?.data?.resetToken)}`);
        } catch (err: any) {
            toast.error(err?.data?.message || "OTP verification failed", { id: loadingToast });
        }
    };

    const handleResend = async () => {
        const loadingToast = toast.loading("Resending OTP...");
        try {
            await resendResetOtp({ email }).unwrap();
            toast.success("OTP resent to your email", { id: loadingToast });
        } catch (err: any) {
            toast.error(err?.data?.message || "Failed to resend OTP", { id: loadingToast });
        }
    };

    return (
        <div className="flex flex-col md:min-h-screen relative">
            <div className="md:absolute p-4 md:p-0 left-4 top-6 md:top-[70px] flex items-center gap-4 text-4xl">
                <div onClick={() => router.back()} className="cursor-pointer">
                    <ArrowLeft className="text-[#C9A94D] w-8 h-8" />
                </div>
                <h1 className="text-[#C9A94D]  font-bold">Enter OTP</h1>
            </div>

            <div className="flex items-center justify-center flex-1 px-4">
                <div className="rounded-xl w-full p-6">
                    <form
                        className="flex flex-col gap-6 w-full"
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleSubmit();
                        }}
                    >
                        <div>
                            <h2 className="text-xl text-center text-[#C9A94D] mb-2">Please check your email</h2>
                            <p className="text-center text-[#C9A94D]">A 6-digit code has been sent to your email</p>
                        </div>

                        <div className="flex justify-center gap-2">
                            {otp.map((digit, index) => (
                                <input
                                    key={index}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={1}
                                    value={digit}
                                    ref={(el) => {
                                        inputsRef.current[index] = el;
                                    }}
                                    onChange={(e) => handleChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    className="w-14 h-14 text-center border-2 border-[#C9A94D] rounded-[10px] bg-white text-[#D4BA71] placeholder:text-[#D4BA71] focus:outline-none text-xl"
                                />
                            ))}
                        </div>

                        {errors.otp && <p className="text-red-500 text-sm mt-1 text-center">{errors.otp.message}</p>}

                        <button type="submit" className="w-full bg-[#C9A94D] text-white py-5 rounded-lg font-semibold hover:bg-[#b38f3e] transition-colors">
                            Verify Email
                        </button>

                        <p className="text-center text-[#C9A94D] mt-4">
                            Don’t receive any code?{" "}
                            <button type="button" onClick={handleResend} className="font-semibold">
                                RESEND
                            </button>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default OtpForm;
