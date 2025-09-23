"use client";
import Footer from "@/components/Footer";
import { usePathname } from "next/navigation";

const FooterWrapper = () => {
    const pathname = usePathname();

    // Render footer on all pages except "/messages"
    if (pathname === "/messages") return null;

    return <Footer />;
};

export default FooterWrapper;
