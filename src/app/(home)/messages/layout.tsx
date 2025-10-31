"use client";

import { useRouter, usePathname } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { currentUser, setRedirectPath } from "@/redux/features/auth/authSlice";
interface AuthProviderProps {
    children: ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
    const router = useRouter();
    const pathname = usePathname();
    const user = useSelector(currentUser);
    const dispatch = useDispatch();

    const [ready, setReady] = useState(false);

    useEffect(() => {
        if (user === undefined) return;

        if (!user) {
            dispatch(setRedirectPath(pathname));
            router.replace("/auth/login");
            return;
        }

        setReady(true);
    }, [user, pathname, router, dispatch]);

    if (!ready) return null;

    return <>{children}</>;
}
