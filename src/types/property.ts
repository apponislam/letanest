export interface IUser {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    profileImg?: string;
    role: "GUEST" | "HOST" | "ADMIN";
    isActive: boolean;
    isEmailVerified?: boolean;
    isVerifiedByAdmin?: boolean;
    verificationStatus?: string;
    address?: {
        street: string;
        country: string;
        city: string;
        zip: string;
    };
    gender?: "Male" | "Female" | "Other";
    createdAt?: string;
    updatedAt?: string;
}

// Predefined lists (frontend)
export const amenitiesList = ["Wifi", "Garden", "Beach Access", "Parking", "Pool", "Smoking Allowed", "Hot Tub", "Pet Friendly", "Balcony", "Towels Included", "Dryer", "Kitchen", "Tv", "Gym", "Lift Access"] as const;

export const propertyTypeOptions = ["Hotel", "Apartment", "Aparthotel", "Bed & Breakfast", "Hostel", "Guesthouse", "Entire Home", "Room Only", "Student Accommodation", "Unique Stays", "Caravan"] as const;

// Types
export type Amenity = (typeof amenitiesList)[number];
export type PropertyType = (typeof propertyTypeOptions)[number];

// Step 1: Basic property info
export interface IPropertyStep1 {
    title: string;
    description: string;
    location: string;
    postCode: string;
    propertyType: PropertyType;
    coordinates?: {
        lat: number;
        lng: number;
    };
}

// Step 2: Property details
export interface IPropertyStep2 {
    maxGuests: number;
    bedrooms: number;
    bathrooms: number;
    price: number;
    availableFrom: string; // ISO string from backend
    availableTo: string; // ISO string from backend
    amenities: Amenity[];
}

// Step 3: Media
export interface IPropertyStep3 {
    coverPhoto: string;
    photos: string[];
}

// Step 4: Terms agreement
export interface IPropertyStep4 {
    agreeTerms: boolean;
}

// Complete Property Interface (frontend)
export interface IProperty extends IPropertyStep1, IPropertyStep2, IPropertyStep3, IPropertyStep4 {
    _id: string;
    propertyNumber?: string;
    createdBy: IUser;
    // createdBy: string;
    createdAt?: string;
    updatedAt?: string;
    status?: "pending" | "published" | "rejected" | "hidden";
    isDeleted?: boolean;
}

// Query parameters for listing
export interface IPropertyQuery {
    page?: number | string;
    limit?: number | string;
    search?: string;
    status?: string;
    createdBy?: string;
    propertyType?: PropertyType;
}

// Pagination metadata
export interface IPropertyMeta {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

// Response from listing API
export interface IPropertyListResponse {
    properties: IProperty[];
    meta: IPropertyMeta;
}
