import UserConversations from "@/components/dashboard/user/UserConversions";
import UserDash from "@/components/dashboard/user/UserDash";
import React from "react";

const page = () => {
    return (
        <>
            <UserDash></UserDash>
            <UserConversations></UserConversations>
        </>
    );
};

export default page;
