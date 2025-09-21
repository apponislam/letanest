import type { Metadata } from "next";
import Header from "@/components/Header";

export const metadata: Metadata = {
    title: "LetANest - Short-Term Lets & Festival Stays",
    description: "Find your next nest anywhere with LetANest. Short-term lets, festival stays, and unique experiences.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <Header></Header>
            {children}
        </>
    );
}
