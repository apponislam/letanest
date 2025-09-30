"use client";

import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { currentUser } from "@/redux/features/auth/authSlice";
import { toast } from "sonner";

interface NonAuthProviderProps {
    children: ReactNode;
}

export default function NonAuthProvider({ children }: NonAuthProviderProps) {
    const router = useRouter();
    const user = useSelector(currentUser);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        if (user === undefined) return;

        if (user) {
            toast("You are already signed in ⚠️");
            router.push("/");
            return;
        }

        setReady(true);
    }, [user, router]);

    if (!ready) return null;

    return <>{children}</>;
}
