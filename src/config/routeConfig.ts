export const roleRoutes: Record<string, string[]> = {
    ADMIN: ["/dashboard", "/messages", "/dashboard/user", "/dashboard/plans", "/dashboard/transaction", "/dashboard/review", "/dashboard/terms-conditions", "/dashboard/property-management", "/dashboard/memberships", "/dashboard/authentication"],
    HOST: ["/dashboard", "/dashboard/transaction", "/dashboard/property-management", "/dashboard/terms-conditions"],
    GUEST: ["/dashboard", "/dashboard/terms-conditions", "/contact", "/dashboard/memberships"],
};
