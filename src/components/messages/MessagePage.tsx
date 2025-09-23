"use client";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import MessagesLayout2 from "./MessageLayout2";

const MessageViews = () => {
    const router = useRouter();

    const handleClick = () => {
        router.push("/");
    };

    return (
        <>
            <div className="container mx-auto">
                <div className="mx-4 md:mx-0">
                    <div className="p-5 border border-[#FFFFFF59] flex justify-between items-center mb-8 flex-col md:flex-row gap-4">
                        <div className="text-[#C9A94D] flex items-center gap-3 text-[18px] cursor-pointer hover:underline" onClick={handleClick}>
                            <ArrowLeft />
                            <p>Back To Home</p>
                        </div>
                        <h1 className="text-2xl text-[#C9A94D]">Messages</h1>
                    </div>

                    <MessagesLayout2></MessagesLayout2>
                </div>
            </div>
        </>
    );
};

export default MessageViews;
