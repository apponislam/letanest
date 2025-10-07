import { roles } from "@/redux/features/auth/authSlice";
import { LayoutDashboard, MessageSquare, User, CreditCard, Star, FileText, Home, Mail, Users, Lock, Layers, BadgeCheck } from "lucide-react";

export const menuItems = {
    [roles.ADMIN]: [
        { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
        { title: "Messages", url: "/messages", icon: MessageSquare },
        { title: "User", url: "/dashboard/user", icon: User },
        { title: "Transaction", url: "/dashboard/transaction", icon: CreditCard },
        { title: "Review", url: "/dashboard/review", icon: Star },
        { title: "Terms & Conditions", url: "/dashboard/terms-conditions", icon: FileText },
        { title: "Property Management", url: "/dashboard/property-management", icon: Home },
        { title: "Membership", url: "/dashboard/memberships", icon: Users },
        { title: "Authentication", url: "/dashboard/authentication", icon: Lock },
        { title: "Host Verify", url: "/dashboard/host-verify", icon: BadgeCheck },
    ],
    [roles.HOST]: [
        { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
        { title: "Transaction", url: "/dashboard/transaction", icon: CreditCard },
        { title: "Memberships", url: "/dashboard/memberships", icon: Users },
        { title: "Property Listing", url: "/dashboard/property-listing", icon: Home },
        { title: "Terms & Conditions", url: "/dashboard/terms-conditions", icon: FileText },
    ],
    [roles.GUEST]: [
        { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
        { title: "Terms & Conditions", url: "/dashboard/terms-conditions", icon: FileText },
        { title: "Contact Letanest", url: "/contact", icon: Mail },
        { title: "Memberships", url: "/dashboard/memberships", icon: Users },
    ],
};
