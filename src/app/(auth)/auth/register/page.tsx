import DynamicAuthContent from "@/components/auth/DynamicAuthContent";
import SignUpForm from "@/components/forms/auth/Register_form";
import Image from "next/image";
import React from "react";

const page = () => {
    return (
        <div className="relative w-full h-screen">
            <div className="absolute inset-0 bg-[url('/auth_bg.jpg')] bg-cover bg-center opacity-50"></div>
            <div className="absolute inset-0 bg-black/50"></div>

            <div className="relative z-10 flex h-full flex-col lg:flex-row justify-between">
                {/* <div className="w-full md:w-full lg:w-1/2 py-4 px-4 md:pt-[100px] md:px-[100px] md:pb-[100px]">
                    <Image src="/logo.svg" width={307} height={61} alt="Letanest Logo" className="mb-4 md:mb-6 h-11 w-auto md:h-[61px]"></Image>
                    <h1 className="text-white text-3xl md:text-[57px] mb-5">Your next stay starts here. Fill out the form, start chatting with hosts, and book the perfect nest for you.</h1>
                </div> */}
                <DynamicAuthContent pageType="signup" />
                <div className="w-full md:w-full lg:w-1/2 bg-[#14213D] rounded-tl-[40px] rounded-tr-[40px] lg:rounded-tl-[40px] lg:rounded-bl-[40px] lg:rounded-tr-none lg:rounded-br-none lg:px-[90px]">
                    <SignUpForm></SignUpForm>
                </div>
            </div>
        </div>
    );
};

export default page;
