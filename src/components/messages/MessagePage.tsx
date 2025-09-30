"use client";
import MessagesLayout2 from "./MessageLayout2";
import PageHeader from "../PageHeader";

const MessageViews = () => {
    return (
        <>
            <div className="container mx-auto">
                <div className="mx-4 md:mx-0">
                    <PageHeader title={"Messages"} isUser={false}></PageHeader>

                    <MessagesLayout2></MessagesLayout2>
                </div>
            </div>
        </>
    );
};

export default MessageViews;
