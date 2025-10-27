"use client";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AuthProvider from "@/providers/auth-provider";
import RoleBasedProvider from "@/providers/RoleBasedProvider";
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
                        <SidebarTrigger className="text-[#C9A94D] md:hidden border border-[#C9A94D] rounded-none mb-2" />
                        {children}
                    </main>
                </RoleBasedProvider>
            </AuthProvider>
        </SidebarProvider>
    );
}
