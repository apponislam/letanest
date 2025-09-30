"use client";

import React from "react";
import { useSelector } from "react-redux";
import { currentUser } from "@/redux/features/auth/authSlice";

import AdminDash from "@/components/dashboard/home/AdminDash";
import HostDash from "@/components/dashboard/home/HostDash";
import Guest from "./guest";

const DashboardPage = () => {
    const user = useSelector(currentUser);

    if (!user) return null;

    switch (user.role) {
        case "ADMIN":
            return <AdminDash />;
        case "HOST":
            return <HostDash />;
        default:
            return <Guest />;
    }
};

export default DashboardPage;
