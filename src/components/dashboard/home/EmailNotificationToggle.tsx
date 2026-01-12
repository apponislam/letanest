import { Switch } from "@/components/ui/switch";
import { useGetEmailPreferenceQuery, useToggleEmailPreferenceMutation } from "@/redux/features/users/usersApi";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const EmailNotificationToggle = () => {
    const { data: preferenceData, isLoading } = useGetEmailPreferenceQuery();
    console.log(preferenceData);
    const [toggleEmailPreference] = useToggleEmailPreferenceMutation();
    const [enabled, setEnabled] = useState(false);

    useEffect(() => {
        if (preferenceData?.data?.receiveEmails !== undefined) {
            setEnabled(preferenceData.data.receiveEmails);
        }
    }, [preferenceData]);

    const handleToggle = async (checked: boolean) => {
        setEnabled(checked);
        try {
            await toggleEmailPreference({ forceValue: checked }).unwrap();
            toast.success(`Email notifications ${checked ? "enabled" : "disabled"}`);
        } catch (error) {
            console.error("Failed to toggle email preference:", error);
            toast.error("Failed to update email preference");
            setEnabled(!checked);
        }
    };

    return (
        <div className="flex items-center gap-3">
            <span className="text-[#C9A94D]">Email Notifications</span>
            <Switch checked={enabled} onCheckedChange={handleToggle} disabled={isLoading} className="h-7 w-12 data-[state=unchecked]:bg-gray-600 data-[state=checked]:bg-[#C9A94D] [&>span]:h-5 [&>span]:w-5 [&>span]:bg-white [&>span]:rounded-full data-[state=unchecked]:[&>span]:translate-x-1 data-[state=checked]:[&>span]:translate-x-6" />
        </div>
    );
};

export default EmailNotificationToggle;
