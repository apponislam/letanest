// "use client";
// import React, { useState, useEffect } from "react";
// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { ArrowLeft, CirclePlus, Eye, EyeOff } from "lucide-react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { useRegisterMutation } from "@/redux/features/auth/authApi";
// import { redirectPath, setRedirectPath, setUser } from "@/redux/features/auth/authSlice";
// import { useSelector } from "react-redux";
// import { useAppDispatch } from "@/redux/hooks";
// import { toast } from "sonner";

// const signupSchema = z.object({
//     fullName: z.string().min(2, "Full Name is required"),
//     phone: z.string().min(10, "Phone must be at least 10 digits"),
//     email: z.string().email("Invalid email"),
//     password: z.string().min(6, "Password must be at least 6 characters"),
//     acceptedTerms: z.boolean().refine((val) => val === true, { message: "You must accept terms and conditions" }),
//     role: z.enum(["GUEST", "HOST"]).refine((val) => !!val, {
//         message: "Role is required",
//     }),
// });

// type SignUpFormInputs = z.infer<typeof signupSchema>;

// // ---------------- Local Storage Helpers ----------------
// const STORAGE_KEY = "signup_form_data";

// const saveFormData = (data: Partial<SignUpFormInputs>) => {
//     if (typeof window !== "undefined") {
//         localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
//     }
// };

// const getFormData = (): Partial<SignUpFormInputs> => {
//     if (typeof window !== "undefined") {
//         const stored = localStorage.getItem(STORAGE_KEY);
//         return stored ? JSON.parse(stored) : {};
//     }
//     return {};
// };

// const clearFormData = () => {
//     if (typeof window !== "undefined") {
//         localStorage.removeItem(STORAGE_KEY);
//     }
// };

// // ---------------- Main Component ----------------
// const SignUpForm = () => {
//     const router = useRouter();
//     // const pathname = usePathname();
//     const dispatch = useAppDispatch();

//     const [showPassword, setShowPassword] = useState(false);
//     const [isInitialLoad, setIsInitialLoad] = useState(true);

//     const {
//         register,
//         handleSubmit,
//         resetField,
//         setValue,
//         watch,
//         reset,
//         formState: { errors },
//     } = useForm<SignUpFormInputs>({
//         resolver: zodResolver(signupSchema),
//         defaultValues: { role: "GUEST" },
//     });

//     const [registerUser, { isLoading }] = useRegisterMutation();
//     const path = useSelector(redirectPath);

//     // ---------------- Handle Navigation / Reload ----------------
//     useEffect(() => {
//         if (typeof window === "undefined") return;

//         const navigationEntry = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
//         const savedData = getFormData();
//         const urlParams = new URLSearchParams(window.location.search);
//         const fromTerms = urlParams.get("fromTerms") === "true";

//         if (fromTerms) {
//             // ✅ Came from Terms page — restore form data
//             console.log("📄 Came from terms page - restoring form data");
//             if (savedData && Object.keys(savedData).length > 0) {
//                 Object.entries(savedData).forEach(([key, value]) => {
//                     setValue(key as keyof SignUpFormInputs, value as any);
//                 });
//             }
//         } else if (navigationEntry?.type === "reload") {
//             // 🔄 Only clear data on true page reload
//             console.log("🔄 True page reload detected - clearing form data");
//             clearFormData();
//             reset();
//         }

//         setIsInitialLoad(false);
//     }, [setValue, reset]);

//     // ---------------- Auto-save data while typing ----------------
//     useEffect(() => {
//         if (isInitialLoad) return;
//         const subscription = watch((value) => {
//             saveFormData(value);
//         });
//         return () => subscription.unsubscribe();
//     }, [watch, isInitialLoad]);

//     // ---------------- Submit Form ----------------
//     const onSubmit = async (data: SignUpFormInputs) => {
//         const loadingToast = toast.loading("Registering...");

//         try {
//             const payload = {
//                 name: data.fullName,
//                 email: data.email,
//                 password: data.password,
//                 phone: data.phone,
//                 role: data.role,
//             };

//             const result = await registerUser(payload).unwrap();
//             console.log(result);

//             toast.success(result?.message || "Registered successfully!", { id: loadingToast });

//             clearFormData(); // ✅ Clear form data only after successful registration

//             if (path) {
//                 dispatch(setRedirectPath(null));
//                 router.push(path);
//             } else {
//                 router.push("/");
//             }

//             dispatch(
//                 setUser({
//                     user: result.data.user,
//                     token: result.data.accessToken,
//                 })
//             );
//         } catch (err: any) {
//             toast.error(err?.data?.message || "Registration failed", { id: loadingToast });
//         }
//     };

//     // ---------------- Handle Role Change ----------------
//     const handleRoleChange = (role: "GUEST" | "HOST") => {
//         setValue("role", role);
//         toast.success(`Role changed to ${role === "GUEST" ? "Guest" : "Host"}!`);
//     };

//     // ---------------- Handle Terms Click ----------------
//     const handleTermsClick = (e: React.MouseEvent) => {
//         const formData = watch();
//         saveFormData(formData);
//         // Navigate to terms with a return flag
//         router.push(`/terms-of-conditions?role=${watch("role").toLowerCase()}&returnTo=register`);
//     };

//     // ---------------- Handle Back Button ----------------
//     const handleBack = () => {
//         router.back();
//     };

//     // ---------------- UI ----------------
//     return (
//         <div className="flex flex-col md:min-h-screen">
//             {/* Heading */}
//             <h1 className="text-[#C9A94D] text-4xl font-bold mb-8 text-left px-4 pt-6 md:pt-[70px] md:absolute" onClick={handleBack}>
//                 <ArrowLeft />
//             </h1>

//             {/* Centered Form */}
//             <div className="flex items-center justify-center flex-1 px-4">
//                 <div className="rounded-xl w-full">
//                     <form className="flex flex-col gap-3 w-full" onSubmit={handleSubmit(onSubmit)}>
//                         <div className="flex justify-center mb-6">
//                             <div className="flex border border-[#C9A94D] rounded-lg overflow-hidden bg-white">
//                                 <button type="button" onClick={() => handleRoleChange("GUEST")} className={`px-6 py-2 font-semibold transition-colors ${watch("role") === "GUEST" ? "bg-[#C9A94D] text-white rounded-lg" : "bg-white text-[#C9A94D]"}`}>
//                                     Guest
//                                 </button>

//                                 <button type="button" onClick={() => handleRoleChange("HOST")} className={`px-6 py-2 font-semibold transition-colors ${watch("role") === "HOST" ? "bg-[#C9A94D] text-white rounded-lg" : "bg-white text-[#C9A94D]"}`}>
//                                     Host
//                                 </button>
//                             </div>
//                         </div>

//                         {/* Full Name */}
//                         <div className="flex flex-col">
//                             <label className="mb-4 text-[#C9A94D]">Full Name</label>
//                             <input type="text" placeholder="Enter your full name" {...register("fullName")} className="w-full px-7 py-5 border border-white rounded-[10px] bg-white text-[#D4BA71] placeholder:text-[#D4BA71] focus:outline-none focus:ring-2 focus:ring-[#C9A94D]" />
//                             {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>}
//                         </div>

//                         {/* Phone */}
//                         <div className="flex flex-col">
//                             <label className="mb-4 text-[#C9A94D]">Phone</label>
//                             <input type="tel" placeholder="Enter your phone number" {...register("phone")} className="w-full px-7 py-5 border border-white rounded-[10px] bg-white text-[#D4BA71] placeholder:text-[#D4BA71] focus:outline-none focus:ring-2 focus:ring-[#C9A94D]" />
//                             {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
//                         </div>

//                         {/* Email */}
//                         <div className="flex flex-col">
//                             <label className="mb-4 text-[#C9A94D]">Email</label>
//                             <div className="relative">
//                                 <input type="email" placeholder="Enter your email" {...register("email")} className="w-full px-7 py-5 border border-white rounded-[10px] bg-white text-[#D4BA71] placeholder:text-[#D4BA71] focus:outline-none focus:ring-2 focus:ring-[#C9A94D]" />
//                                 <button type="button" onClick={() => resetField("email")} className="absolute right-7 top-1/2 -translate-y-1/2 text-[#D4BA71] hover:text-[#C9A94D]">
//                                     <CirclePlus className="rotate-[45deg]" />
//                                 </button>
//                             </div>
//                             {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
//                         </div>

//                         {/* Password */}
//                         <div className="flex flex-col">
//                             <label className="mb-4 text-[#C9A94D]">Password</label>
//                             <div className="relative">
//                                 <input type={showPassword ? "text" : "password"} placeholder="Enter your password" {...register("password")} className="w-full px-7 py-5 border border-white rounded-[10px] bg-white text-[#D4BA71] placeholder:text-[#D4BA71] focus:outline-none focus:ring-2 focus:ring-[#C9A94D]" />
//                                 <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-7 top-1/2 -translate-y-1/2 text-[#D4BA71] hover:text-[#C9A94D]">
//                                     {showPassword ? <EyeOff /> : <Eye />}
//                                 </button>
//                             </div>
//                             {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
//                         </div>

//                         {/* Terms */}
//                         <div className="flex items-center gap-2">
//                             <input type="checkbox" {...register("acceptedTerms")} className="accent-[#C9A94D]" />
//                             <label className="text-[#C9A94D]">
//                                 I accept the
//                                 <button type="button" className="ml-1 hover:underline" onClick={handleTermsClick}>
//                                     terms and conditions
//                                 </button>
//                             </label>
//                         </div>
//                         {errors.acceptedTerms && <p className="text-red-500 text-sm mt-1">{errors.acceptedTerms.message}</p>}

//                         {/* Sign Up Button */}
//                         <button type="submit" className="w-full bg-[#C9A94D] text-white py-5 rounded-lg font-semibold hover:bg-[#b38f3e] transition-colors" disabled={isLoading}>
//                             {isLoading ? "Registering..." : "Sign Up"}
//                         </button>

//                         <p className="text-[#C9A94D] mb-2">
//                             Already have an account?{" "}
//                             <Link href="/auth/login" className="text-[#135E9A]">
//                                 Sign In
//                             </Link>
//                         </p>
//                     </form>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default SignUpForm;

"use client";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, CirclePlus, Eye, EyeOff, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRegisterMutation } from "@/redux/features/auth/authApi";
import { redirectPath, setRedirectPath, setUser } from "@/redux/features/auth/authSlice";
import { useSelector } from "react-redux";
import { useAppDispatch } from "@/redux/hooks";
import { toast } from "sonner";

const signupSchema = z.object({
    fullName: z.string().min(2, "Full Name is required"),
    phone: z.string().min(10, "Phone must be at least 10 digits"),
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    acceptedTerms: z.boolean().refine((val) => val === true, { message: "You must accept terms and conditions" }),
    role: z.enum(["GUEST", "HOST"]).refine((val) => !!val, {
        message: "Role is required",
    }),
});

type SignUpFormInputs = z.infer<typeof signupSchema>;

// ---------------- Local Storage Helpers ----------------
const STORAGE_KEY = "signup_form_data";

const saveFormData = (data: Partial<SignUpFormInputs>) => {
    if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
};

const getFormData = (): Partial<SignUpFormInputs> => {
    if (typeof window !== "undefined") {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : {};
    }
    return {};
};

const clearFormData = () => {
    if (typeof window !== "undefined") {
        localStorage.removeItem(STORAGE_KEY);
    }
};

// ---------------- Main Component ----------------
const SignUpForm = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();

    const [showPassword, setShowPassword] = useState(false);
    const [isInitialLoad, setIsInitialLoad] = useState(true);
    const [showRoleModal, setShowRoleModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        resetField,
        setValue,
        watch,
        reset,
        trigger,
        formState: { errors },
    } = useForm<SignUpFormInputs>({
        resolver: zodResolver(signupSchema),
        defaultValues: { role: "GUEST" },
    });

    const [registerUser, { isLoading }] = useRegisterMutation();
    const path = useSelector(redirectPath);

    // ---------------- Handle Navigation / Reload ----------------
    useEffect(() => {
        if (typeof window === "undefined") return;

        const navigationEntry = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
        const savedData = getFormData();
        const urlParams = new URLSearchParams(window.location.search);
        const fromTerms = urlParams.get("fromTerms") === "true";

        if (fromTerms) {
            // ✅ Came from Terms page — restore form data
            console.log("📄 Came from terms page - restoring form data");
            if (savedData && Object.keys(savedData).length > 0) {
                Object.entries(savedData).forEach(([key, value]) => {
                    setValue(key as keyof SignUpFormInputs, value as any);
                });
            }
        } else if (navigationEntry?.type === "reload") {
            // 🔄 Only clear data on true page reload
            console.log("🔄 True page reload detected - clearing form data");
            clearFormData();
            reset();
        }

        setIsInitialLoad(false);
    }, [setValue, reset]);

    // ---------------- Auto-save data while typing ----------------
    useEffect(() => {
        if (isInitialLoad) return;
        const subscription = watch((value) => {
            saveFormData(value);
        });
        return () => subscription.unsubscribe();
    }, [watch, isInitialLoad]);

    // ---------------- Role Selection Modal ----------------
    const RoleSelectionModal = () => {
        if (!showRoleModal) return null;

        const handleRoleSelect = (role: "GUEST" | "HOST") => {
            setValue("role", role);
            toast.success(`Role set to ${role === "GUEST" ? "Guest" : "Host"}!`);
            setShowRoleModal(false);

            // Proceed with registration after role selection
            const formData = watch();
            onSubmit(formData as SignUpFormInputs);
        };

        // return (
        //     <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
        //         <div className="bg-white rounded-2xl max-w-md w-full p-6" style={{ borderColor: "#C9A94D", borderWidth: "1px" }}>
        //             <div className="flex justify-between items-center mb-6">
        //                 <h2 className="text-2xl font-bold text-[#C9A94D]">Select Your Role</h2>
        //                 <button onClick={() => setShowRoleModal(false)} className="text-[#C9A94D] hover:text-[#b38f3e]">
        //                     <X size={24} />
        //                 </button>
        //             </div>

        //             <p className="text-[#C9A94D] mb-8 text-center">How would you like to use our platform?</p>

        //             <div className="space-y-4">
        //                 {/* Guest Option */}
        //                 <button onClick={() => handleRoleSelect("GUEST")} className={`w-full p-6 rounded-xl border-2 transition-all duration-200 ${watch("role") === "GUEST" ? "border-[#C9A94D] bg-[#FFF9E6]" : "border-[#C9A94D] hover:bg-[#FFF9E6]"}`}>
        //                     <div className="flex items-start gap-4">
        //                         <div className={`w-12 h-12 rounded-full flex items-center justify-center ${watch("role") === "GUEST" ? "bg-[#C9A94D]" : "bg-[#F5EEC6]"}`}>
        //                             <span className="text-white font-bold text-lg">👤</span>
        //                         </div>
        //                         <div className="text-left flex-1">
        //                             <h3 className="font-bold text-lg text-[#C9A94D]">Guest</h3>
        //                             <p className="text-[#D4BA71] mt-1">I want to book stays and experiences</p>
        //                             <ul className="text-sm text-[#D4BA71] mt-2 space-y-1">
        //                                 <li>• Book accommodations</li>
        //                                 <li>• Discover experiences</li>
        //                                 <li>• Connect with hosts</li>
        //                             </ul>
        //                         </div>
        //                     </div>
        //                 </button>

        //                 {/* Host Option */}
        //                 <button onClick={() => handleRoleSelect("HOST")} className={`w-full p-6 rounded-xl border-2 transition-all duration-200 ${watch("role") === "HOST" ? "border-[#C9A94D] bg-[#FFF9E6]" : "border-[#C9A94D] hover:bg-[#FFF9E6]"}`}>
        //                     <div className="flex items-start gap-4">
        //                         <div className={`w-12 h-12 rounded-full flex items-center justify-center ${watch("role") === "HOST" ? "bg-[#C9A94D]" : "bg-[#F5EEC6]"}`}>
        //                             <span className="text-white font-bold text-lg">🏠</span>
        //                         </div>
        //                         <div className="text-left flex-1">
        //                             <h3 className="font-bold text-lg text-[#C9A94D]">Host</h3>
        //                             <p className="text-[#D4BA71] mt-1">I want to list my property</p>
        //                             <ul className="text-sm text-[#D4BA71] mt-2 space-y-1">
        //                                 <li>• List your property</li>
        //                                 <li>• Set your prices</li>
        //                                 <li>• Earn extra income</li>
        //                             </ul>
        //                         </div>
        //                     </div>
        //                 </button>
        //             </div>
        //         </div>
        //     </div>
        // );

        return (
            <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                <div className="bg-[#1a2c4d] rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto border border-[#C9A94D]">
                    <div className="flex justify-between items-center mb-4 p-6 pb-0">
                        <h2 className="text-xl sm:text-2xl font-bold text-white">Select Your Role</h2>
                        <button onClick={() => setShowRoleModal(false)} className="text-white hover:text-[#C9A94D] transition-colors ml-2">
                            <X size={20} className="sm:size-6" />
                        </button>
                    </div>

                    <div className="p-6 pt-4">
                        <p className="text-white mb-6 font-medium text-sm sm:text-base">How would you like to use our platform?</p>

                        <div className="space-y-4">
                            {/* Guest Option */}
                            <button onClick={() => handleRoleSelect("GUEST")} className={`w-full p-4 sm:p-6 rounded-xl border-2 transition-all duration-200 ${watch("role") === "GUEST" ? "border-[#C9A94D] bg-gradient-to-r from-[#FFF9E6] to-[#F0F4FF]" : "border-[#3a4c6d] hover:border-[#C9A94D] bg-[#2a3c5d] hover:bg-[#3a4c6d]"}`}>
                                <div className="flex items-start gap-3 sm:gap-4">
                                    <div className={`flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-colors ${watch("role") === "GUEST" ? "bg-gradient-to-br from-[#C9A94D] to-[#1a2c4d]" : "bg-gradient-to-br from-[#3a4c6d] to-[#2a3c5d]"}`}>
                                        <span className="text-white font-bold text-base sm:text-lg">👤</span>
                                    </div>
                                    <div className="text-left flex-1 min-w-0">
                                        <h3 className={`font-bold text-base sm:text-lg transition-colors ${watch("role") === "GUEST" ? "text-[#1a2c4d]" : "text-white"}`}>Guest</h3>
                                        <p className={`mt-1 text-xs sm:text-sm transition-colors ${watch("role") === "GUEST" ? "text-[#1a2c4d]" : "text-gray-300"}`}>I want to book stays and experiences</p>
                                        <ul className="text-xs sm:text-sm mt-2 space-y-1">
                                            <li className={`transition-colors ${watch("role") === "GUEST" ? "text-[#1a2c4d]" : "text-gray-400"}`}>• Book accommodations</li>
                                            <li className={`transition-colors ${watch("role") === "GUEST" ? "text-[#1a2c4d]" : "text-gray-400"}`}>• Discover experiences</li>
                                            <li className={`transition-colors ${watch("role") === "GUEST" ? "text-[#1a2c4d]" : "text-gray-400"}`}>• Connect with hosts</li>
                                        </ul>
                                    </div>
                                </div>
                            </button>

                            {/* Host Option */}
                            <button onClick={() => handleRoleSelect("HOST")} className={`w-full p-4 sm:p-6 rounded-xl border-2 transition-all duration-200 ${watch("role") === "HOST" ? "border-[#C9A94D] bg-gradient-to-r from-[#FFF9E6] to-[#F0F4FF]" : "border-[#3a4c6d] hover:border-[#C9A94D] bg-[#2a3c5d] hover:bg-[#3a4c6d]"}`}>
                                <div className="flex items-start gap-3 sm:gap-4">
                                    <div className={`flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-colors ${watch("role") === "HOST" ? "bg-gradient-to-br from-[#C9A94D] to-[#1a2c4d]" : "bg-gradient-to-br from-[#3a4c6d] to-[#2a3c5d]"}`}>
                                        <span className="text-white font-bold text-base sm:text-lg">🏠</span>
                                    </div>
                                    <div className="text-left flex-1 min-w-0">
                                        <h3 className={`font-bold text-base sm:text-lg transition-colors ${watch("role") === "HOST" ? "text-[#1a2c4d]" : "text-white"}`}>Host</h3>
                                        <p className={`mt-1 text-xs sm:text-sm transition-colors ${watch("role") === "HOST" ? "text-[#1a2c4d]" : "text-gray-300"}`}>I want to list my property</p>
                                        <ul className="text-xs sm:text-sm mt-2 space-y-1">
                                            <li className={`transition-colors ${watch("role") === "HOST" ? "text-[#1a2c4d]" : "text-gray-400"}`}>• List your property</li>
                                            <li className={`transition-colors ${watch("role") === "HOST" ? "text-[#1a2c4d]" : "text-gray-400"}`}>• Set your prices</li>
                                            <li className={`transition-colors ${watch("role") === "HOST" ? "text-[#1a2c4d]" : "text-gray-400"}`}>• Earn extra income</li>
                                        </ul>
                                    </div>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // ---------------- Submit Form ----------------
    const onSubmit = async (data: SignUpFormInputs) => {
        if (isSubmitting) return;

        setIsSubmitting(true);
        const loadingToast = toast.loading("Registering...");

        try {
            const payload = {
                name: data.fullName,
                email: data.email,
                password: data.password,
                phone: data.phone,
                role: data.role,
            };

            const result = await registerUser(payload).unwrap();
            console.log(result);

            toast.success(result?.message || "Registered successfully!", { id: loadingToast });

            clearFormData(); // ✅ Clear form data only after successful registration

            if (path) {
                dispatch(setRedirectPath(null));
                router.push(path);
            } else {
                router.push("/");
            }

            dispatch(
                setUser({
                    user: result.data.user,
                    token: result.data.accessToken,
                }),
            );
        } catch (err: any) {
            toast.error(err?.data?.message || "Registration failed", { id: loadingToast });
            setIsSubmitting(false);
        }
    };

    // ---------------- Handle Form Submission ----------------
    const onFormSubmit = async (data: SignUpFormInputs) => {
        // Show role selection modal at the end
        setShowRoleModal(true);
    };

    // ---------------- Handle Terms Click ----------------
    const handleTermsClick = (e: React.MouseEvent) => {
        const formData = watch();
        saveFormData(formData);
        // Navigate to terms with a return flag
        router.push(`/terms-of-conditions?role=${watch("role").toLowerCase()}&returnTo=register`);
    };

    // ---------------- Handle Back Button ----------------
    const handleBack = () => {
        router.back();
    };

    // ---------------- UI ----------------
    return (
        <div className="flex flex-col md:min-h-screen">
            {/* Heading */}
            <h1 className="text-[#C9A94D] text-4xl font-bold mb-8 text-left px-4 pt-6 md:pt-[70px] md:absolute" onClick={handleBack}>
                <ArrowLeft />
            </h1>

            {/* Centered Form */}
            <div className="flex items-center justify-center flex-1 px-4">
                <div className="rounded-xl w-full">
                    <form className="flex flex-col gap-3 w-full" onSubmit={handleSubmit(onFormSubmit)}>
                        {/* Removed role selection from top */}

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
                            <label className="text-[#C9A94D]">
                                I accept the
                                <button type="button" className="ml-1 hover:underline" onClick={handleTermsClick}>
                                    terms and conditions
                                </button>
                            </label>
                        </div>
                        {errors.acceptedTerms && <p className="text-red-500 text-sm mt-1">{errors.acceptedTerms.message}</p>}

                        {/* Sign Up Button */}
                        <button type="submit" className="w-full bg-[#C9A94D] text-white py-5 rounded-lg font-semibold hover:bg-[#b38f3e] transition-colors" disabled={isLoading || isSubmitting}>
                            {isLoading || isSubmitting ? "Processing..." : "Sign Up"}
                        </button>

                        <p className="text-[#C9A94D] mb-2">
                            Already have an account?{" "}
                            <Link href="/auth/login" className="text-[#135E9A]">
                                Sign In
                            </Link>
                        </p>
                    </form>
                </div>
            </div>

            {/* Role Selection Modal */}
            <RoleSelectionModal />
        </div>
    );
};

export default SignUpForm;
