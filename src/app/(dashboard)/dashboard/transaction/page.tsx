"use client";
import React from "react";
import { useSelector } from "react-redux";
import TransectionView from "@/components/dashboard/transaction/TransectionView";
import HostTransectionView from "@/components/dashboard/transaction/HostTransactionView";
import { currentUser } from "@/redux/features/auth/authSlice";

const TransactionPage = () => {
    const user = useSelector(currentUser);
    const userRole = user?.role;

    return (
        <>
            {userRole === "ADMIN" ? (
                <TransectionView />
            ) : userRole === "HOST" ? (
                <HostTransectionView />
            ) : (
                <div className="container mx-auto p-6">
                    <div className="bg-[#2D3546] border border-[#C9A94D] rounded-[20px] p-6 text-center">
                        <h1 className="text-2xl font-bold text-[#C9A94D] mb-4">Access Denied</h1>
                        <p className="text-white">You don't have permission to view transactions.</p>
                    </div>
                </div>
            )}
        </>
    );
};

export default TransactionPage;
