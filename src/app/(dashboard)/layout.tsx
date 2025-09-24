import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <AppSidebar />
            <main className="md:m-5 m-3 w-full">
                <SidebarTrigger className="text-[#C9A94D] md:hidden border border-[#C9A94D] rounded-none mb-2" />
                {children}
            </main>
        </SidebarProvider>
    );
}
