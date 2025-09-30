import NonAuthProvider from "@/providers/non-auth-provider";
import { ReactNode } from "react";

interface AuthLayoutProps {
    children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
    return <NonAuthProvider>{children}</NonAuthProvider>;
}
