"use client";
import Image from "next/image";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useSelector } from "react-redux";
import { currentUser, roles } from "@/redux/features/auth/authSlice";
import { menuItems } from "@/config/menuConfig";

// Menu items
// const items = [
//     { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
//     { title: "Messages", url: "/messages", icon: MessageSquare },
//     { title: "User", url: "/dashboard/user", icon: User },
//     { title: "Plans", url: "/dashboard/plans", icon: Layers },
//     { title: "Transaction", url: "/dashboard/transaction", icon: CreditCard },
//     { title: "Review", url: "/dashboard/review", icon: Star },
//     { title: "Terms & Conditions", url: "/dashboard/terms-conditions", icon: FileText },
//     { title: "Property Management", url: "/dashboard/property-management", icon: Home },
//     { title: "Contact Letanest", url: "/contact", icon: Mail },
//     { title: "Memberships", url: "/dashboard/memberships", icon: Users },
//     { title: "Host Verify", url: "/dashboard/host-verify", icon: BadgeCheck },
//     { title: "Authentication", url: "/dashboard/authentication", icon: Lock },
// ];

export function AppSidebar() {
    const pathname = usePathname();
    const user = useSelector(currentUser);
    const role = user?.role || roles.GUEST;
    const items = menuItems[role];

    return (
        <Sidebar className="border-none flex flex-col h-screen">
            <div className="bg-[#14213D] flex flex-col h-full">
                {/* Fixed Logo Section */}
                <div className="pt-14 mb-8 flex justify-center shrink-0">
                    <Link href="/">
                        <Image src="/logo.svg" alt="Dashboard Logo" height={44} width={226} className="block" />
                    </Link>
                </div>

                {/* Scrollable Menu */}
                <SidebarContent className="flex-1 max-h-[800px] overflow-y-auto p-0 scrollbar-thin scrollbar-thumb-[#C9A94D] scrollbar-track-transparent">
                    <SidebarGroup className="p-0">
                        <SidebarGroupContent>
                            <SidebarMenu className="gap-4">
                                {items.map((item) => (
                                    <SidebarMenuItem
                                        key={item.title}
                                        className={`relative px-5 py-2 transition-colors rounded-none before:absolute before:left-1 before:top-0 before:h-full before:w-2 before:bg-[#14213D] ${
                                            (item.url === "/dashboard" ? pathname === "/dashboard" || (pathname.startsWith("/dashboard/") && !items.some((i) => i.url !== "/dashboard" && pathname.startsWith(i.url))) : pathname === item.url) ? "bg-[#C9A94D] text-white hover:text-white before:block" : "text-[#C9A94D] hover:bg-[#C9A94D] hover:text-white before:hidden hover:before:block"
                                        }`}
                                    >
                                        <SidebarMenuButton asChild>
                                            <Link href={item.url} className="flex items-center gap-2 hover:text-white !p-0 !bg-transparent !hover:bg-transparent focus-visible:shadow-none active:text-white">
                                                <item.icon className="h-5 w-5" />
                                                <span>{item.title}</span>
                                            </Link>
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
