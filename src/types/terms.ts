export type UserRole = "GUEST" | "HOST" | "ADMIN";

export type TermsCreator = Extract<UserRole, "ADMIN" | "HOST">;

export type TermsTarget = "GUEST" | "HOST" | "property";

export type HostTCTarget = "default" | "property";

export interface TermsAndConditions {
    _id: string;
    content: string;
    version?: string;
    effectiveDate?: string;
    createdBy: string;
    creatorType: TermsCreator;
    target: TermsTarget;
    hostTarget?: HostTCTarget;
    propertyId?: string;
    createdAt?: string;
    updatedAt?: string;
}
