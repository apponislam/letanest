"use client";

import { useSelector } from "react-redux";
import PageHeader from "../PageHeader";
import MessagesLayout2 from "./MessageLayout2";
import { RootState } from "@/redux/store";

import { useSendWelcomeMessageMutation } from "@/redux/features/messages/messageApi";
import { useEffect, useRef } from "react";
// import MessagesLayout2 from "./MessagesLayout";

const MessageViews = () => {
    const { user } = useSelector((state: RootState) => state.auth);

    const [sendWelcomeMessage] = useSendWelcomeMessageMutation();

    const welcomeSentRef = useRef(false);

    useEffect(() => {
        // Only send if user exists and welcome hasn't been sent yet
        if (!user?._id || welcomeSentRef.current) return;

        const welcomeKey = `welcomeTime_${user._id}`;
        const lastWelcome = localStorage.getItem(welcomeKey);
        const now = Date.now();
        const tenMinutes = 10 * 60 * 1000;

        if (!lastWelcome || now - parseInt(lastWelcome) > tenMinutes) {
            console.log("🎉 Sending welcome message");
            welcomeSentRef.current = true; // Mark as sent immediately

            sendWelcomeMessage({})
                .unwrap()
                .then(() => {
                    localStorage.setItem(welcomeKey, now.toString());
                    console.log("✅ Welcome message sent");
                })
                .catch((error) => {
                    // Reset the ref if there's an error so it can retry
                    welcomeSentRef.current = false;
                    if (error?.data?.message?.includes("duplicate key error")) {
                        console.log("✅ Conversation already exists (this is expected)");
                        localStorage.setItem(welcomeKey, now.toString());
                    } else {
                        console.error("❌ Failed to send welcome message:", error);
                    }
                });
        }
    }, [user?._id, sendWelcomeMessage]);

    return (
        <>
            <div className="container mx-auto">
                <div className="mx-4 md:mx-0">
                    <PageHeader title={"Messages"} isUser={false}></PageHeader>

                    {/* <MessagesLayout></MessagesLayout> */}
                    <MessagesLayout2></MessagesLayout2>
                </div>
            </div>
        </>
    );
};

export default MessageViews;
