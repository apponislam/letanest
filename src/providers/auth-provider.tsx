"use client";

import { useRouter, usePathname } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { currentUser, setRedirectPath } from "@/redux/features/auth/authSlice";
import { roleRoutes } from "@/config/menuConfig";

interface AuthProviderProps {
    children: ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
    const router = useRouter();
    const pathname = usePathname();
    const user = useSelector(currentUser);
    const dispatch = useDispatch();

    // Track if we are ready to render children
    const [ready, setReady] = useState(false);

    useEffect(() => {
        if (user === undefined) return; // wait for redux state

        if (!user) {
            dispatch(setRedirectPath(pathname));
            router.replace("/auth/login");
            return;
        }

        const role = user.role;
        const allowedRoutes = roleRoutes[role] || [];
        if (!allowedRoutes.some((route) => pathname.startsWith(route))) {
            router.replace("/dashboard");
            return;
        }

        setReady(true); // user exists and route allowed
    }, [user, pathname, router, dispatch]);

    // don’t render anything until ready
    if (!ready) return null;

    return <>{children}</>;
}
