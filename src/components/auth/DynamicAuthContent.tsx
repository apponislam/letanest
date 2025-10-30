"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useGetPageConfigQuery } from "@/redux/features/pageconfig/pageConfigApi";
import { House } from "lucide-react";

interface DynamicAuthContentProps {
    pageType: "signin" | "signup";
}

const DynamicAuthContent: React.FC<DynamicAuthContentProps> = ({ pageType }) => {
    const { data: pageConfig, isLoading, error } = useGetPageConfigQuery({ pageType });
    console.log(pageConfig);

    // Default content
    const defaultContent = {
        logo: "/logo.svg",
        title: pageType === "signin" ? "Hosting made simple - list your nest in minutes." : "Your next stay starts here. Fill out the form, start chatting with hosts, and book the perfect nest for you.",
        showLink: pageType === "signin", // Only show link for signin page
        description: pageType === "signin" ? "if you don't have an account you can Register here!" : "",
        linkText: "Register here!",
        linkHref: "/auth/register",
    };

    // Use dynamic content if available and no error, otherwise use default
    const content =
        pageConfig?.data && !error
            ? {
                  logo: pageConfig.data.logo || defaultContent.logo,
                  title: pageConfig.data.title || defaultContent.title,
                  showLink: defaultContent.showLink,
                  description: defaultContent.description,
                  linkText: defaultContent.linkText,
                  linkHref: defaultContent.linkHref,
              }
            : defaultContent;

    // Get full image URL
    const getFullImageUrl = (imagePath: string): string => {
        if (!imagePath) return defaultContent.logo;
        if (imagePath.startsWith("http")) return imagePath;
        if (imagePath.startsWith("/uploads")) return `${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"}${imagePath}`;
        return imagePath;
    };

    if (isLoading) {
        return (
            <div className="w-full md:w-full lg:w-1/2 py-4 px-4 md:pt-[100px] md:pl-[100px] md:pb-[100px]">
                <div className="animate-pulse">
                    <div className="h-11 w-48 bg-gray-600 rounded mb-4 md:mb-6"></div>
                    <div className="h-16 bg-gray-600 rounded mb-5"></div>
                    {pageType === "signin" && <div className="h-6 bg-gray-600 rounded"></div>}
                </div>
            </div>
        );
    }

    return (
        <div className="w-full md:w-full lg:w-1/2 py-4 px-4 md:pt-[100px] md:pl-[100px] md:pb-[100px]">
            <Link href="/">
                <div className="flex items-center gap-4 text-[#D4BA71] mb-4 uppercase">
                    <House /> Back To Home
                </div>
            </Link>
            <Link href="/" className="cursor-pointer">
                <Image
                    src={getFullImageUrl(content.logo)}
                    width={307}
                    height={61}
                    alt="Letanest Logo"
                    className="mb-4 md:mb-6 h-11 w-auto md:h-[61px]"
                    onError={(e) => {
                        // Fallback to default logo if image fails to load
                        e.currentTarget.src = defaultContent.logo;
                    }}
                />
            </Link>
            <h1 className="text-white text-3xl md:text-5xl mb-5">{content.title}</h1>

            {/* Only show the link paragraph for signin page */}
            {content.showLink && (
                <p className="text-xl md:text-[28px] text-white">
                    {content.description.split(content.linkText)[0]}
                    <Link href={content.linkHref} className="text-[#135E9A]">
                        {content.linkText}
                    </Link>
                    {content.description.split(content.linkText)[1]}
                </p>
            )}
        </div>
    );
};

export default DynamicAuthContent;
