"use client";

import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { currentUser, justLoggedIn, clearJustLoggedIn } from "@/redux/features/auth/authSlice";
import { toast } from "sonner";

interface NonAuthProviderProps {
    children: ReactNode;
}

export default function NonAuthProvider({ children }: NonAuthProviderProps) {
    const router = useRouter();
    const dispatch = useDispatch();
    const user = useSelector(currentUser);
    const justLogged = useSelector(justLoggedIn);

    const [ready, setReady] = useState(false); // allow children to render
    const [handled, setHandled] = useState(false); // ensure toast & redirect only once

    useEffect(() => {
        // Wait until Redux finishes loading user state
        if (user === undefined) return;

        console.log("first ", justLogged);
        // User is logged in
        if (user && !handled) {
            if (!justLogged) {
                console.log("why ", justLogged);
                toast("You are already signed in ⚠️");
            } else {
                dispatch(clearJustLoggedIn()); // clear after first login
            }
            router.replace("/"); // redirect immediately
            setHandled(true); // prevent future triggers
            return;
        }

        // User not logged in
        if (!user && !handled) {
            setReady(true); // safe to render children
            setHandled(true);
        }
    }, [user, justLogged, router, dispatch, handled]);

    if (!ready && !user) return null; // prevent login page flash

    return <>{children}</>;
}
