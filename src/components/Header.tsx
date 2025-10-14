"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, MessageSquare } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { currentUser, logOut, roles } from "@/redux/features/auth/authSlice";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import Avatar from "@/utils/Avatar";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useLogoutMutation } from "@/redux/features/auth/authApi";

const menuItems = [
    { name: "Home", href: "/" },
    { name: "Listings", href: "/listings" },
    { name: "Dashboard", href: "/dashboard" },
    // { name: "Login", href: "/auth/login" },
];

const Header = () => {
    const router = useRouter();
    const user = useSelector(currentUser);
    // console.log(user);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const y = window.scrollY;
            // console.log(y);

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

    const dispatch = useDispatch();
    const [logout] = useLogoutMutation();

    const handleLogout = async () => {
        const loadingToast = toast.loading("Logging out...");
        try {
            await logout().unwrap(); // RTK Query mutation
            dispatch(logOut()); // use your slice's action
            toast.success("Logged out successfully!", { id: loadingToast });

            router.push("/"); // optional redirect
        } catch (err: any) {
            toast.error(err?.data?.message || "Logout failed", { id: loadingToast });
        }
    };

    return (
        <header className={`w-full sticky top-0 z-50 ${scrolled ? "border-b-2 border-[#C9A94D] backdrop-blur-md bg-gradient-to-b from-[#14213D] via-[#14213D]/70 to-[#14213D]/40" : ""}`}>
            <div className={`container mx-auto  ${scrolled ? "py-4" : "md:py-10"}`}>
                <div className={`flex items-center justify-between border-b-2 border-[#C9A94D] ${scrolled ? "border-none px-3" : "md:border-2 py-7 px-6 backdrop-blur-md bg-gradient-to-b from-[#14213D] from-0% via-[#14213D] via-50% to-[#14213D]/80 to-100%"} border-[#C9A94D`}>
                    {/* <div className={`flex items-center justify-between ${scrolled ? "border-b-2" : "md:border-2 py-7 px-6"} border-[#C9A94D]`}> */}
                    {/* Left: Logo */}
                    <div className="flex items-center gap-3">
                        <Link href="/">
                            <Image
                                src="/logo.svg"
                                alt="Logo"
                                width={120}
                                height={40}
                                className="h-6 md:h-10 w-auto"
                                style={{ width: "auto" }} // ensures aspect ratio
                            />
                        </Link>
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
                                {!user && (
                                    <li key="login">
                                        <Link href="/auth/login" className="text-[#C9A94D] hover:text-[#C9A94D] font-medium">
                                            Login
                                        </Link>
                                    </li>
                                )}
                            </ul>
                        </nav>
                        {user && (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <div className="cursor-pointer">
                                        <Avatar name={user.name} profileImg={user.profileImg} size={40} />
                                    </div>
                                </DropdownMenuTrigger>

                                <DropdownMenuContent className="bg-[#14213D] text-white border border-[#C9A94D] w-48 p-0 rounded-none">
                                    <Link href="/dashboard/profile">
                                        <DropdownMenuItem className="flex items-center gap-2 hover:bg-[#C9A94D]/30 focus:bg-[#C9A94D]/30 focus:text-white rounded-none border-b border-[#C9A94D]">
                                            <Image alt="Profile" src="/dashboard/user-eye.png" height={24} width={24} />
                                            View Profile
                                        </DropdownMenuItem>
                                    </Link>
                                    <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-2 hover:bg-[#C9A94D]/30 focus:bg-[#C9A94D]/30 focus:text-white rounded-none">
                                        <Image alt="Logout" src="/dashboard/logout.png" height={24} width={24} />
                                        Logout
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}

                        <Link href="/messages">
                            <MessageSquare className="text-[#C9A94D]" />
                        </Link>

                        {user?.role !== roles.GUEST && (
                            <Link href="/dashboard/listing/add" className="border border-[#C9A94D] text-[#C9A94D] font-semibold px-4 py-2 rounded-lg hover:bg-[#C9A94D] hover:text-white transition-colors">
                                + Add Listing
                            </Link>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button className="md:hidden text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu with animation */}
            <div className={`md:hidden overflow-hidden transition-[max-height,opacity] backdrop-blur-md bg-white/20 duration-300 ease-in-out ${mobileMenuOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}>
                <nav className="flex flex-col gap-4 p-4 bg-transparent border-t border-gray-200">
                    {menuItems.map((item) => (
                        <Link key={item.name} href={item.href} className="text-[#C9A94D] hover:text-[#C9A94D] font-medium" onClick={() => setMobileMenuOpen(false)}>
                            {item.name}
                        </Link>
                    ))}

                    {user && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild className="w-10">
                                <div className="cursor-pointer">
                                    <Avatar name={user.name} profileImg={user.profileImg} size={40} />
                                </div>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent className="bg-[#14213D] text-white border border-[#C9A94D] w-48 p-0 rounded-none">
                                <Link href="/dashboard/profile">
                                    <DropdownMenuItem className="flex items-center gap-2 hover:bg-[#C9A94D]/30 focus:bg-[#C9A94D]/30 focus:text-white rounded-none border-b border-[#C9A94D]">
                                        <Image alt="Profile" src="/dashboard/user-eye.png" height={24} width={24} />
                                        View Profile
                                    </DropdownMenuItem>
                                </Link>
                                <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-2 hover:bg-[#C9A94D]/30 focus:bg-[#C9A94D]/30 focus:text-white rounded-none">
                                    <Image alt="Logout" src="/dashboard/logout.png" height={24} width={24} />
                                    Logout
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}

                    <Link href="/messages">
                        <div className="flex items-center gap-2">
                            <MessageSquare className="w-6 h-6 text-[#C9A94D]" />
                            <span className="text-[#C9A94D] font-medium">Message</span>
                        </div>
                    </Link>

                    {user?.role !== roles.GUEST && (
                        <Link href="/dashboard/listing/add" className="border border-[#C9A94D] text-[#C9A94D] text-center font-semibold px-4 py-2 rounded-lg hover:bg-[#C9A94D] hover:text-white transition-colors" onClick={() => setMobileMenuOpen(false)}>
                            + Add Listing
                        </Link>
                    )}
                </nav>
            </div>
        </header>
    );
};

export default Header;
