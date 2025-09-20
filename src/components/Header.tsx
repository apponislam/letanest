"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, MessageSquare } from "lucide-react";

const menuItems = [
    { name: "Home", href: "/" },
    { name: "Listing", href: "/listing" },
    { name: "Dashboard", href: "/dashboard" },
    { name: "Login", href: "/auth/login" },
];

const Header = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const y = window.scrollY;
            console.log(y);

            // Hysteresis: different thresholds for on/off
            if (y > 180 && !scrolled) {
                setScrolled(true);
            } else if (y < 60 && scrolled) {
                setScrolled(false);
            }
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        handleScroll(); // initial check
        return () => window.removeEventListener("scroll", handleScroll);
    }, [scrolled]);

    return (
        <header className={`w-full bg-transparent sticky top-0 z-50 ${scrolled ? "border-b-2 border-[#C9A94D] backdrop-blur-md bg-[#C9A94D]/20" : ""}`}>
            <div className={`container mx-auto  ${scrolled ? "py-4" : "md:py-10"}`}>
                <div className={`flex items-center justify-between border-b-2  ${scrolled ? "border-none" : "md:border-2 py-7 px-6 backdrop-blur-md bg-[#C9A94D]/20"} border-[#C9A94D] `}>
                    {/* <div className={`flex items-center justify-between ${scrolled ? "border-b-2" : "md:border-2 py-7 px-6"} border-[#C9A94D]`}> */}
                    {/* Left: Logo */}
                    <div className="flex items-center gap-3">
                        <Image src="/logo.png" alt="Logo" width={120} height={40} className="h-10 w-auto" />
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-9">
                        <nav>
                            <ul className="flex gap-9">
                                {menuItems.map((item) => (
                                    <li key={item.name}>
                                        <Link href={item.href} className="text-[#C9A94D] hover:text-[#C9A94D] font-medium">
                                            {item.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </nav>

                        <MessageSquare className="text-[#C9A94D]" />

                        <Link href="/listing/add" className="border border-[#C9A94D] text-[#C9A94D] font-semibold px-4 py-2 rounded-lg hover:bg-[#C9A94D] hover:text-white transition-colors">
                            + Add Listing
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button className="md:hidden text-gray-700" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu with animation */}
            <div className={`md:hidden overflow-hidden transition-[max-height,opacity] backdrop-blur-md bg-[#C9A94D]/20 duration-300 ease-in-out ${mobileMenuOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}>
                <nav className="flex flex-col gap-4 p-4 bg-transparent border-t border-gray-200">
                    {menuItems.map((item) => (
                        <Link key={item.name} href={item.href} className="text-[#C9A94D] hover:text-[#C9A94D] font-medium" onClick={() => setMobileMenuOpen(false)}>
                            {item.name}
                        </Link>
                    ))}

                    <div className="flex items-center gap-2">
                        <MessageSquare className="w-6 h-6 text-[#C9A94D]" />
                        <span className="text-[#C9A94D] font-medium">Message</span>
                    </div>

                    <Link href="/listing/add" className="border border-[#C9A94D] text-[#C9A94D] text-center font-semibold px-4 py-2 rounded-lg hover:bg-[#C9A94D] hover:text-white transition-colors" onClick={() => setMobileMenuOpen(false)}>
                        + Add Listing
                    </Link>
                </nav>
            </div>
        </header>
    );
};

export default Header;
