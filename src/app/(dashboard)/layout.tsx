import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <AppSidebar />
            <main className="md:m-5 m-3 w-full">
                <SidebarTrigger className="text-white md:hidden border rounded-none mb-2" />
                {children}
            </main>
        </SidebarProvider>
    );
}
