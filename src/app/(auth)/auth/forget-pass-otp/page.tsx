import OtpForm from "@/components/forms/auth/forgot_pass_otp_form";
import Image from "next/image";
import React from "react";

const page = () => {
    return (
        <div className="relative w-full h-screen">
            <div className="absolute inset-0 bg-[url('/auth_bg.jpg')] bg-cover bg-center opacity-50"></div>
            <div className="absolute inset-0 bg-black/50"></div>
            <div className="relative z-10 flex h-full flex-col lg:flex-row justify-between">
                <div className="w-full md:w-full lg:w-1/2 py-4 px-4 pt-[100px] md:pl-[100px] md:pb-[100px] flex items-center justify-center">
                    <Image src="/logo.png" width={307} height={61} alt="Letanest Logo" className="mb-4 md:mb-6 h-11 w-auto md:h-[61px]"></Image>
                </div>

                <div className="w-full md:w-full lg:w-1/2 bg-[#14213D] rounded-tl-[40px] rounded-tr-[40px] lg:rounded-tl-[40px] lg:rounded-bl-[40px] lg:rounded-tr-none lg:rounded-br-none lg:px-[90px]">
                    <OtpForm></OtpForm>
                </div>
            </div>
        </div>
    );
};

export default page;
