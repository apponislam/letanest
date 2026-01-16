"use client";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AuthProvider from "@/providers/auth-provider";
import RoleBasedProvider from "@/providers/RoleBasedProvider";
import Image from "next/image";
// import { Metadata } from "next";

// export const metadata: Metadata = {
//     title: "Dashboard - Letanest – Unique Travel Experiences",
//     description: "Explore rare travel destinations and curated experiences with Letanest.",
//     icons: {
//         icon: "/favicon.svg",
//     },
// };

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <AuthProvider>
                <RoleBasedProvider>
                    <AppSidebar />
                    <main className="md:m-5 m-3 w-full">
                        <div className="flex items-center justify-between mb-2 md:hidden">
                            <SidebarTrigger className="hidden md:inline-flex" />

                            {/* Custom 3-line button for mobile */}
                            <button
                                onClick={() => {
                                    const trigger = document.querySelector('[data-sidebar="trigger"]');
                                    if (trigger) (trigger as HTMLButtonElement).click();
                                }}
                                className="md:hidden text-[#C9A94D] rounded-none flex flex-col justify-center items-center gap-1 w-10 h-10"
                            >
                                <span className="w-6 h-0.5 bg-current"></span>
                                <span className="w-6 h-0.5 bg-current"></span>
                                <span className="w-6 h-0.5 bg-current"></span>
                            </button>
                            {/* <SidebarTrigger className="text-[#C9A94D] md:hidden border border-[#C9A94D] rounded-none mb-2" /> */}
                            <Image src="/logo.png" alt="Logo" height={32} width={150} className="h-8"></Image>
                        </div>
                        {children}
                    </main>
                </RoleBasedProvider>
            </AuthProvider>
        </SidebarProvider>
    );
}
