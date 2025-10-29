"use client";

import PageHeader from "../PageHeader";
import MessagesLayout2 from "./MessageLayout2";
// import MessagesLayout from "./MessagesLayout";

const MessageViews = () => {
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
