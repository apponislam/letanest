"use client";
import Link from "next/link";
import React from "react";
import { ArrowLeft } from "lucide-react";

const Custom404 = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#14213D] px-4">
            <h1 className="text-8xl font-bold text-[#C9A94D] mb-6">404</h1>
            <h2 className="text-2xl md:text-4xl font-semibold text-white mb-4 text-center">Oops! Page not found</h2>
            <p className="text-gray-300 mb-8 text-center">The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.</p>
            <Link href="/" className="flex items-center gap-2 bg-[#C9A94D] hover:bg-[#b38f3e] text-white font-semibold px-6 py-3 rounded-lg transition-colors">
                <ArrowLeft size={18} />
                Go Back Home
            </Link>
        </div>
    );
};

export default Custom404;
