// "use client";

// import { useRouter, usePathname } from "next/navigation";
// import { ReactNode, useEffect } from "react";
// import { useAppSelector } from "@/redux/hooks";
// import { currentUser } from "@/redux/features/auth/authSlice";
// import { toast } from "sonner";
// import { roleRoutes } from "@/config/menuConfig";

// interface RoleBasedProviderProps {
//     children: ReactNode;
// }

// export default function RoleBasedProvider({ children }: RoleBasedProviderProps) {
//     const router = useRouter();
//     const pathname = usePathname();
//     const user = useAppSelector(currentUser);

//     useEffect(() => {
//         if (user && pathname) {
//             console.log("🛡️ Checking permissions...");
//             const role = user.role;
//             const allowedRoutes = roleRoutes[role] || [];

//             console.log("User role:", role);
//             console.log("Current path:", pathname);
//             console.log("Allowed routes:", allowedRoutes);

//             // FIXED: Only allow exact matches or explicit sub-routes
//             const isRouteAllowed = allowedRoutes.some((route) => {
//                 // Exact match
//                 if (pathname === route) return true;

//                 // Sub-route match, but only if the parent route is explicitly allowed
//                 // AND the sub-route doesn't contain additional path segments that aren't allowed
//                 if (pathname.startsWith(route + "/")) {
//                     // For GUEST: /dashboard is allowed but /dashboard/user should NOT be allowed
//                     // So we need to check if the specific sub-route is explicitly in allowedRoutes
//                     const pathSegments = pathname.split("/").filter(Boolean);
//                     const routeSegments = route.split("/").filter(Boolean);

//                     // If the route is just "/dashboard", don't allow any sub-routes like "/dashboard/user"
//                     if (routeSegments.length === 1 && pathSegments.length > 1) {
//                         return false;
//                     }

//                     return true;
//                 }

//                 return false;
//             });

//             console.log("Is route allowed?", isRouteAllowed);

//             if (!isRouteAllowed) {
//                 console.log("🚫 ACCESS DENIED - Redirecting to /dashboard");
//                 toast.error("Access denied! You don't have permission to view this page.");
//                 router.replace("/dashboard");
//             }
//         }
//     }, [user, pathname, router]);

//     // Show loading while checking permissions
//     if (user && pathname) {
//         const role = user.role;
//         const allowedRoutes = roleRoutes[role] || [];

//         const isRouteAllowed = allowedRoutes.some((route) => {
//             if (pathname === route) return true;
//             if (pathname.startsWith(route + "/")) {
//                 const pathSegments = pathname.split("/").filter(Boolean);
//                 const routeSegments = route.split("/").filter(Boolean);
//                 if (routeSegments.length === 1 && pathSegments.length > 1) {
//                     return false;
//                 }
//                 return true;
//             }
//             return false;
//         });

//         if (!isRouteAllowed) {
//             return (
//                 <div className="flex justify-center items-center min-h-screen">
//                     <div className="text-center">
//                         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C9A94D] mx-auto mb-4"></div>
//                         <p className="text-[#C9A94D]">Redirecting...</p>
//                     </div>
//                 </div>
//             );
//         }
//     }

//     return <>{children}</>;
// }

"use client";

import { useRouter, usePathname } from "next/navigation";
import { ReactNode, useEffect } from "react";
import { useAppSelector } from "@/redux/hooks";
import { currentUser } from "@/redux/features/auth/authSlice";
import { toast } from "sonner";
import { roleRoutes } from "@/config/menuConfig";

interface RoleBasedProviderProps {
    children: ReactNode;
}

export default function RoleBasedProvider({ children }: RoleBasedProviderProps) {
    const router = useRouter();
    const pathname = usePathname();
    const user = useAppSelector(currentUser);

    useEffect(() => {
        if (user && pathname) {
            const role = user.role;

            // ADMIN has access to everything
            if (role === "ADMIN") {
                return;
            }

            const allowedRoutes = roleRoutes[role] || [];

            // Check if the current path is allowed
            const isRouteAllowed = allowedRoutes.some((route: string) => {
                if (pathname === route) return true;
                if (pathname.startsWith(route + "/")) {
                    const pathSegments = pathname.split("/").filter(Boolean);
                    const routeSegments = route.split("/").filter(Boolean);
                    if (routeSegments.length === 1 && pathSegments.length > 1) {
                        return false;
                    }
                    return true;
                }
                return false;
            });

            if (!isRouteAllowed) {
                toast.error("Access denied! You don't have permission to view this page.");
                router.replace("/dashboard");
            }
        }
    }, [user, pathname, router]);

    // Show loading while checking permissions (only for non-admin users)
    if (user && pathname && user.role !== "ADMIN") {
        const allowedRoutes = roleRoutes[user.role] || [];
        const isRouteAllowed = allowedRoutes.some((route: string) => {
            if (pathname === route) return true;
            if (pathname.startsWith(route + "/")) {
                const pathSegments = pathname.split("/").filter(Boolean);
                const routeSegments = route.split("/").filter(Boolean);
                if (routeSegments.length === 1 && pathSegments.length > 1) {
                    return false;
                }
                return true;
            }
            return false;
        });

        if (!isRouteAllowed) {
            return (
                <div className="flex justify-center items-center min-h-screen">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C9A94D] mx-auto mb-4"></div>
                        <p className="text-[#C9A94D]">Redirecting...</p>
                    </div>
                </div>
            );
        }
    }

    return <>{children}</>;
}
