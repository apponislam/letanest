import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
    weight: ["100", "300", "400", "500", "700", "900"],
    subsets: ["latin", "latin-ext"],
    variable: "--font-montserrat",
    display: "swap",
});

export const metadata: Metadata = {
    title: "Letanest – Unique Travel Experiences",
    description: "Explore rare travel destinations and curated experiences with Letanest.",
    icons: {
        icon: "/favicon.svg",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${montserrat.className}  antialiased bg-[#14213D]`}>{children}</body>
        </html>
    );
}
