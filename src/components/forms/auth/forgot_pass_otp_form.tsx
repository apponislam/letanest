// "use client";
// import React, { useRef, useState } from "react";
// import { useForm, Controller } from "react-hook-form";
// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useRouter } from "next/navigation";

// const otpSchema = z.object({
//     otp: z.string().length(6, "OTP must be 6 digits").regex(/^\d+$/, "OTP must contain only numbers"),
// });

// type OtpFormInputs = z.infer<typeof otpSchema>;

// const OtpForm = () => {
//     const router = useRouter();
//     const {
//         handleSubmit,
//         control,

//         formState: { errors },
//     } = useForm<OtpFormInputs>({
//         resolver: zodResolver(otpSchema),
//         defaultValues: { otp: "" },
//     });

//     const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
//     const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

//     const handleChange = (index: number, value: string) => {
//         if (!/^\d*$/.test(value)) return;
//         const newOtp = [...otp];
//         newOtp[index] = value;
//         setOtp(newOtp);
//         if (value && index < 5) inputsRef.current[index + 1]?.focus();
//     };

//     const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
//         if (e.key === "Backspace" && !otp[index] && index > 0) {
//             inputsRef.current[index - 1]?.focus();
//         }
//     };

//     const onSubmit = () => {
//         const enteredOtp = otp.join("");
//         console.log("OTP Submitted:", enteredOtp);
//         router.push("/auth/new-pass");
//         // axios request can go here
//     };

//     const handleResend = () => {
//         console.log("Resend OTP clicked");
//         // Add resend OTP logic here (axios request)
//     };

//     return (
//         <div className="flex flex-col md:min-h-screen">
//             <h1 className="text-[#C9A94D] text-4xl font-bold mb-8 text-left px-4 pt-6 md:pt-[70px] md:absolute">Enter OTP</h1>

//             <div className="flex items-center justify-center flex-1 px-4">
//                 <div className="rounded-xl  w-full p-6">
//                     <form className="flex flex-col gap-6 w-full" onSubmit={handleSubmit(onSubmit)}>
//                         <div>
//                             <h1 className="text-xl text-center text-[#C9A94D] mb-4">Please check your email</h1>
//                             <p className="text-center text-[#C9A94D]">A 6 digits code has sanded to your email</p>
//                         </div>
//                         <Controller
//                             name="otp"
//                             control={control}
//                             render={() => (
//                                 <div className="flex justify-center gap-2">
//                                     {otp.map((digit, index) => (
//                                         <div key={index} className="relative w-14 h-14 ">
//                                             <input
//                                                 type="text"
//                                                 inputMode="numeric"
//                                                 maxLength={1}
//                                                 value={digit}
//                                                 ref={(el: HTMLInputElement | null) => {
//                                                     inputsRef.current[index] = el;
//                                                 }}
//                                                 onChange={(e) => handleChange(index, e.target.value)}
//                                                 onKeyDown={(e) => handleKeyDown(index, e)}
//                                                 className="w-full h-14 text-center border-2 border-[#C9A94D] rounded-[10px] bg-white text-[#D4BA71] placeholder:text-[#D4BA71] focus:outline-none text-xl "
//                                             />
//                                         </div>
//                                     ))}
//                                 </div>
//                             )}
//                         />
//                         {errors.otp && <p className="text-red-500 text-sm mt-1">{errors.otp.message}</p>}

//                         {/* Full Width Submit Button */}
//                         <button type="submit" className="w-full bg-[#C9A94D] text-white py-5 rounded-lg font-semibold hover:bg-[#b38f3e] transition-colors">
//                             Verify email
//                         </button>
//                         <p className="text-center text-[#C9A94D] mt-4">
//                             Don’t receive any code?{" "}
//                             <button type="button" onClick={handleResend} className=" font-semibold">
//                                 RESEND
//                             </button>
//                         </p>
//                     </form>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default OtpForm;

"use client";
import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";

const otpSchema = z.object({
    otp: z
        .string()
        .length(6, "OTP must be 6 digits")
        .regex(/^\d{6}$/, "OTP must contain only numbers"),
});

type OtpFormInputs = z.infer<typeof otpSchema>;

const OtpForm = () => {
    const router = useRouter();
    const {
        setError,
        clearErrors,
        formState: { errors },
    } = useForm<OtpFormInputs>({
        defaultValues: { otp: "" },
    });

    const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
    const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

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

    const handleSubmit = () => {
        const enteredOtp = otp.join(""); // join 6 digits into one string
        const validation = otpSchema.safeParse({ otp: enteredOtp });
        if (!validation.success) {
            setError("otp", { type: "manual", message: validation.error.issues[0].message });
            return;
        }

        console.log("OTP Submitted:", enteredOtp);
        router.push("/auth/new-pass");
    };

    const handleResend = () => {
        console.log("Resend OTP clicked");
    };

    return (
        <div className="flex flex-col md:min-h-screen">
            <h1 className="text-[#C9A94D] text-4xl font-bold mb-8 text-left px-4 pt-6 md:pt-[70px] md:absolute">Enter OTP</h1>

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
