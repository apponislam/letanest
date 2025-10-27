import { roles } from "@/redux/features/auth/authSlice";
import { LayoutDashboard, MessageSquare, User, CreditCard, Star, FileText, Home, Mail, Users, Lock, Layers, BadgeCheck, Flag, Bookmark } from "lucide-react";

export const menuItems = {
    [roles.ADMIN]: [
        { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
        { title: "Messages", url: "/messages", icon: MessageSquare },
        { title: "Contacts", url: "/dashboard/contacts", icon: Mail },
        { title: "User", url: "/dashboard/user", icon: User },
        { title: "Transaction", url: "/dashboard/transaction", icon: CreditCard },
        { title: "Review", url: "/dashboard/review", icon: Star },
        { title: "Reports", url: "/dashboard/reports", icon: Flag },
        { title: "Terms & Conditions", url: "/dashboard/terms-conditions", icon: FileText },
        { title: "Property Management", url: "/dashboard/property-management", icon: Home },
        { title: "Membership", url: "/dashboard/memberships", icon: Users },
        { title: "Authentication", url: "/dashboard/authentication", icon: Lock },
        { title: "Host Verify", url: "/dashboard/host-verify", icon: BadgeCheck },
    ],
    [roles.HOST]: [
        { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
        { title: "Messages", url: "/messages", icon: MessageSquare },
        { title: "Transaction", url: "/dashboard/transaction", icon: CreditCard },
        { title: "Memberships", url: "/dashboard/memberships", icon: Users },
        { title: "Property Listing", url: "/dashboard/property-listing", icon: Home },
        { title: "Terms & Conditions", url: "/dashboard/terms-conditions", icon: FileText },
        { title: "Saved Cards", url: "/dashboard/payment-methods", icon: Bookmark },
    ],
    [roles.GUEST]: [
        { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
        { title: "Messages", url: "/messages", icon: MessageSquare },
        { title: "Contact Letanest", url: "/contact", icon: Mail },
        { title: "Memberships", url: "/dashboard/memberships", icon: Users },
        { title: "Saved Cards", url: "/dashboard/payment-methods", icon: Bookmark },
    ],
};

export const roleRoutes = {
    [roles.GUEST]: ["/dashboard", "/messages", "/contact", "/dashboard/memberships", "/dashboard/payment-methods"],
    [roles.HOST]: ["/dashboard", "/messages", "/dashboard/transaction", "/dashboard/memberships", "/dashboard/property-listing", "/dashboard/terms-conditions", "/dashboard/payment-methods"],
    [roles.ADMIN]: ["/dashboard", "/messages", "/dashboard/contacts", "/dashboard/user", "/dashboard/transaction", "/dashboard/review", "/dashboard/reports", "/dashboard/terms-conditions", "/dashboard/property-management", "/dashboard/memberships", "/dashboard/authentication", "/dashboard/host-verify"],
};
