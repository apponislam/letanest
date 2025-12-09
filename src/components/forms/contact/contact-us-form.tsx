"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useCreateContactMutation } from "@/redux/features/contact/contactApi";
import { useRouter } from "next/navigation";
import { countryCodes } from "../users/CountryCodes";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const contactSchema = z.object({
    firstName: z.string().min(2, "First name is required"),
    lastName: z.string().min(2, "Last name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(1, "Phone number is required"),
    message: z.string().min(5, "Message must be at least 5 characters"),
});

type ContactFormData = z.infer<typeof contactSchema>;

const ContactUsForm: React.FC = () => {
    const [createContact, { isLoading }] = useCreateContactMutation();
    const router = useRouter();

    const {
        register,
        handleSubmit,
        getValues,
        setValue,
        watch,
        formState: { errors },
        reset,
    } = useForm<ContactFormData>({
        resolver: zodResolver(contactSchema),
        defaultValues: {
            phone: "+1 ", // Default with country code and space
        },
    });

    const phoneValue = watch("phone") || "";
    const [selectedCountryCode, setSelectedCountryCode] = useState("+1");

    // Handle country code change
    const handleCountryCodeChange = (code: string) => {
        setSelectedCountryCode(code);
        const currentPhone = getValues("phone") || "";
        const phoneWithoutCode = currentPhone.replace(/^\+\d+\s?/, "");
        setValue("phone", code + " " + phoneWithoutCode, { shouldValidate: true });
    };

    // Handle phone input - SIMPLE AND WORKING
    const handlePhoneInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setValue("phone", value, { shouldValidate: true });
    };

    const onSubmit = async (data: ContactFormData) => {
        try {
            await createContact(data).unwrap();
            toast.success("Message sent successfully!");
            router.push("/");
            reset();
        } catch (error: any) {
            console.error("Failed to send message:", error);
            toast.error(error?.data?.message || "Failed to send message. Please try again.");
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="mx-auto space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* First Name */}
                <div>
                    <label className="block mb-1 text-[#C9A94D] font-medium">First Name</label>
                    <input type="text" placeholder="Enter your first name" {...register("firstName")} className="rounded-[8px] w-full border border-[#C9A94D] px-2 py-2 text-[#E6D7AD] placeholder-[#E6D7AD] focus:outline-none" />
                    {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>}
                </div>

                {/* Last Name */}
                <div>
                    <label className="block mb-1 text-[#C9A94D] font-medium">Last Name</label>
                    <input type="text" placeholder="Enter your last name" {...register("lastName")} className="rounded-[8px] w-full border border-[#C9A94D] px-2 py-2 text-[#E6D7AD] placeholder-[#E6D7AD] focus:outline-none" />
                    {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>}
                </div>

                {/* Email */}
                <div>
                    <label className="block mb-1 text-[#C9A94D] font-medium">Email</label>
                    <input type="email" placeholder="Enter your email" {...register("email")} className="rounded-[8px] w-full border border-[#C9A94D] px-2 py-2 text-[#E6D7AD] placeholder-[#E6D7AD] focus:outline-none" />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                </div>

                {/* Phone - SIMPLE WORKING VERSION */}
                <div>
                    <label className="block mb-1 text-[#C9A94D] font-medium">Phone</label>
                    <div className="flex gap-2 items-stretch">
                        {/* Country Code Dropdown */}
                        <Select onValueChange={handleCountryCodeChange}>
                            <SelectTrigger className="w-28 rounded-[8px] border border-[#C9A94D] text-[#E6D7AD] h-auto!">
                                <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#14213D] text-[#E6D7AD]">
                                {countryCodes.map((country) => (
                                    <SelectItem key={country.code} value={country.code} className="hover:bg-[#C9A94D] hover:text-[#14213D]">
                                        {country.code} {country.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {/* Phone Number Input - JUST LET USER TYPE */}
                        <input type="text" value={phoneValue} onChange={handlePhoneInput} placeholder="Enter phone number" className="rounded-[8px] flex-1 border border-[#C9A94D] px-2 py-2 text-[#E6D7AD] placeholder-[#E6D7AD] focus:outline-none" />
                    </div>
                    {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
                </div>
            </div>

            {/* Message */}
            <div>
                <label className="block mb-1 text-[#C9A94D] font-medium">Message</label>
                <textarea {...register("message")} rows={5} placeholder="Write your message..." className="rounded-[8px] w-full border border-[#C9A94D] px-2 py-2 text-[#E6D7AD] placeholder-[#E6D7AD] focus:outline-none"></textarea>
                {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>}
            </div>

            {/* Submit */}
            <button type="submit" disabled={isLoading} className="bg-[#C9A94D] text-white py-4 px-10 rounded-lg hover:bg-[#af8d28] transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                {isLoading ? "Sending..." : "Leave us a Message"}
            </button>
        </form>
    );
};

export default ContactUsForm;
