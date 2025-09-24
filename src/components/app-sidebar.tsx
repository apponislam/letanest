"use client";

import { LayoutDashboard, MessageSquare, User, CreditCard, Star, FileText, Home, Mail, Users, Lock, Layers } from "lucide-react";
import Image from "next/image";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";

// Menu items
const items = [
    { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
    { title: "Messages", url: "/messages", icon: MessageSquare },
    { title: "User", url: "/dashboard/user", icon: User },
    { title: "Plans", url: "/dashboard/plans", icon: Layers },
    { title: "Transaction", url: "/dashboard/transaction", icon: CreditCard },
    { title: "Review", url: "/dashboard/review", icon: Star },
    { title: "Terms & Conditions", url: "/dashboard/terms-conditions", icon: FileText },
    { title: "Property Management", url: "/dashboard/property-management", icon: Home },
    { title: "Contact Letanest", url: "/dashboard/contact-letanest", icon: Mail },
    { title: "Memberships", url: "/dashboard/memberships", icon: Users },
    { title: "Authentication", url: "/dashboard/authentication", icon: Lock },
];

export function AppSidebar() {
    const pathname = usePathname();

    return (
        <Sidebar className="border-none flex flex-col h-screen">
            <div className="bg-[#14213D] flex flex-col h-full">
                {/* Fixed Logo Section */}
                <div className="pt-14 mb-8 flex justify-center shrink-0">
                    <Image src="/logo.svg" alt="Dashboard Logo" height={44} width={226} className="block" />
                </div>

                {/* Scrollable Menu */}
                <SidebarContent className="flex-1 overflow-y-auto">
                    <SidebarGroup className="p-0">
                        <SidebarGroupContent>
                            <SidebarMenu className="gap-5">
                                {items.map((item) => (
                                    <SidebarMenuItem
                                        key={item.title}
                                        className={`relative px-5 py-3 transition-colors rounded-none before:absolute before:left-1 before:top-0 before:h-full before:w-2 before:bg-[#14213D] ${
                                            (item.url === "/dashboard" ? pathname === "/dashboard" || (pathname.startsWith("/dashboard/") && !items.some((i) => i.url !== "/dashboard" && pathname.startsWith(i.url))) : pathname === item.url) ? "bg-[#C9A94D] text-white hover:text-white before:block" : "text-[#C9A94D] hover:bg-[#C9A94D] hover:text-white before:hidden hover:before:block"
                                        }`}
                                    >
                                        <SidebarMenuButton asChild>
                                            <a href={item.url} className="flex items-center gap-2 hover:text-white !p-0 !bg-transparent !hover:bg-transparent">
                                                <item.icon className="h-5 w-5" />
                                                <span>{item.title}</span>
                                            </a>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>

                {/* Fixed Footer */}
                {/* <SidebarFooter className="shrink-0 p-4 border-t border-[#C9A94D] text-white">Footer content here</SidebarFooter> */}
            </div>
        </Sidebar>
    );
}
