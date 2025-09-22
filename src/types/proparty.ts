export interface Property {
    _id: string;
    title: string;
    token: string;
    rating: number;
    reviews: number;
    price_per_night: number;
    rooms: number;
    bathrooms: number;
    guests: number;
    area: string;
    description: string;
    images: string[];
    address: string;
    amenities: string[];
    sleeping_arrangements: {
        bedroom: string;
        beds: string;
        images: string[];
    }[];
    host: {
        name: string;
        role: string;
        totalrating: number;
        createdAt?: Date;
        profile_image: string;
        reviews: {
            reviewer: string;
            rating: number;
            comment: string;
        }[];
    };
    location: {
        map: string;
        nearby: {
            place: string;
            distance: string;
        }[];
    };
}
