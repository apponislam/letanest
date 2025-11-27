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
export const amenitiesList = [
    // Essentials
    "Wifi",
    "Towels Included",
    "Heating",
    "Air Conditioning",
    "Kitchen",
    "Washing Machine",
    "Dryer",
    "Tv",

    // Parking & Transport
    "Parking",
    "EV Charging Point",

    // Safety & Security
    "Smoke Alarm",
    "Carbon Monoxide Alarm",
    "First Aid Kit",
    "CCTV / Security Lighting",

    // Outdoor & Leisure
    "Garden",
    "Balcony / Terrace",
    "BBQ Facilities",
    "Outdoor Furniture",
    "Pool",
    "Hot Tub",
    "Beach Access",

    // Family-Friendly
    "High Chair",
    "Cot / Travel Cot",
    "Playground Nearby",

    // Extras
    "Gym",
    "Coffee Machine / Kettle",
    "Hairdryer",
    "Iron / Ironing Board",

    // Accessibility
    "Disability Access",
    "Disability Parking",
    "Lift Access",
    "Step-free Entrance",

    // Pet & Smoking Policies
    "Pet Friendly",
    "Smoking Allowed",
] as const;

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
    availableFrom: string;
    availableTo: string;
    calendarEnabled?: boolean;
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
    featured?: boolean;
    trending?: boolean;
    termsAndConditions?: any;
    nearbyPlaces?: {
        name: string;
        type: string;
        distance: number;
        lat: number;
        lng: number;
        address: string;
    }[];
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
