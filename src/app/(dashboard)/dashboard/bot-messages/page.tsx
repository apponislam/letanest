import BotMessagesPage from "@/components/dashboard/bot-messages/BotMessagesPage";
import BotMessageSenderPage from "@/components/dashboard/bot-messages/BulkMessageSender";
import React from "react";

const page = () => {
    return (
        <>
            <BotMessagesPage></BotMessagesPage>
            <BotMessageSenderPage></BotMessageSenderPage>
        </>
    );
};

export default page;
