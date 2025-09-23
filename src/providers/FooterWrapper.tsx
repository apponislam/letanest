"use client";
import Footer from "@/components/Footer";
import { usePathname } from "next/navigation";

const FooterWrapper = () => {
    const pathname = usePathname();

    // Hide footer on /messages and any /messages/:id pages
    if (pathname.startsWith("/messages")) return null;

    return <Footer />;
};

export default FooterWrapper;
