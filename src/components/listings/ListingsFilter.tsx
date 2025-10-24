"use client";

import React, { useEffect, useState } from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronLeft, ChevronRight, Home, MapPin } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import CustomDateInput from "@/utils/CustomDateInput";
import PropertyCard2 from "../PropertyCard2";
import { Input } from "../ui/input";
import { useGetAllPropertiesQuery, useGetMaxRoundedPriceQuery } from "@/redux/features/property/propertyApi";
import { useRouter, useSearchParams } from "next/navigation";

const amenitiesList = ["Wifi", "Garden", "Beach Access", "Parking", "Pool", "Smoking Allowed", "Hot Tub", "Pet Friendly", "Balcony", "Towels Included", "Dryer", "Kitchen", "Tv", "Gym", "Lift Access", "Disability Access", "Disability Parking"];
const guestRatings = ["Good", "Above Good", "Excellent"];

export default function ListingsFilter() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const locationOptions = ["New York", "London", "Paris"];
    const propertyTypeOptions = ["Hotel", "Apartment", "Aparthotel", "Bed & Breakfast", "Hostel", "Guesthouse", "Entire Home", "Room Only", "Student Accommodation", "Unique Stays", "Caravan"];

    const { data: maxPriceData } = useGetMaxRoundedPriceQuery();
    console.log(maxPriceData);

    // Get dynamic max price from API or use fallback
    const dynamicMaxPrice = maxPriceData?.data?.maxRoundedPrice || 3000;
    useEffect(() => {
        if (maxPriceData?.data?.maxRoundedPrice) {
            setFilters((prev) => ({
                ...prev,
                maxPrice: maxPriceData.data.maxRoundedPrice,
            }));
            setPriceRange([priceRange[0], maxPriceData.data.maxRoundedPrice]); // ADD THIS LINE
        }
    }, [maxPriceData?.data?.maxRoundedPrice]);

    // Get initial values from URL params
    const getInitialCheckIn = () => {
        const checkInParam = searchParams.get("checkIn");
        return checkInParam ? new Date(checkInParam) : null;
    };

    const getInitialCheckOut = () => {
        const checkOutParam = searchParams.get("checkOut");
        return checkOutParam ? new Date(checkOutParam) : null;
    };

    const getInitialAmenities = () => {
        const amenitiesParam = searchParams.get("amenities");
        return amenitiesParam ? decodeURIComponent(amenitiesParam).split(",") : [];
    };

    const getInitialPropertyTypes = () => {
        const propertyTypesParam = searchParams.get("propertyTypes");
        return propertyTypesParam ? decodeURIComponent(propertyTypesParam).split(",") : [];
    };

    const getInitialPriceRange = (): [number, number] => {
        const minPrice = searchParams.get("minPrice");
        const maxPrice = searchParams.get("maxPrice");
        return [minPrice ? parseInt(minPrice) : 0, maxPrice ? parseInt(maxPrice) : dynamicMaxPrice];
    };

    const [checkIn, setCheckIn] = useState<Date | null>(getInitialCheckIn());
    const [checkOut, setCheckOut] = useState<Date | null>(getInitialCheckOut());
    const [selectedAmenities, setSelectedAmenities] = useState<string[]>(getInitialAmenities());
    const [selectedPropertyTypes, setSelectedPropertyTypes] = useState<string[]>(getInitialPropertyTypes());
    const [selectedRating, setSelectedRating] = useState<string | null>(searchParams.get("rating"));
    const [priceRange, setPriceRange] = useState<[number, number]>(getInitialPriceRange());
    const [selectedLocation, setSelectedLocation] = useState<string | null>(searchParams.get("location"));
    const min = 0;
    const max = dynamicMaxPrice;

    console.log("Selected Amenities:", selectedAmenities);
    console.log("Selected Property Types:", selectedPropertyTypes);

    const [filters, setFilters] = useState({
        page: parseInt(searchParams.get("page") || "1"),
        limit: 10,
        search: searchParams.get("search") || "",
        status: "published",
        minPrice: getInitialPriceRange()[0],
        maxPrice: getInitialPriceRange()[1],
        propertyTypes: getInitialPropertyTypes(),
        guests: parseInt(searchParams.get("guests") || "1"),
        bedrooms: parseInt(searchParams.get("bedrooms") || "1"),
        amenities: getInitialAmenities(),
    });

    const { data, isLoading, error } = useGetAllPropertiesQuery(filters);

    const properties = data?.data || [];
    const meta = data?.meta;

    console.log("API Response:", data);

    // Update URL when filters change
    // useEffect(() => {
    //     const params = new URLSearchParams();

    //     if (filters.search) params.set("search", filters.search);
    //     if (filters.page > 1) params.set("page", filters.page.toString());
    //     if (filters.minPrice > 0) params.set("minPrice", filters.minPrice.toString());
    //     if (filters.maxPrice < dynamicMaxPrice) params.set("maxPrice", filters.maxPrice.toString());
    //     if (filters.propertyTypes.length > 0) params.set("propertyTypes", filters.propertyTypes.join(","));
    //     if (filters.guests > 1) params.set("guests", filters.guests.toString());
    //     if (filters.bedrooms > 1) params.set("bedrooms", filters.bedrooms.toString());
    //     if (checkIn) params.set("checkIn", checkIn.toISOString().split("T")[0]);
    //     if (checkOut) params.set("checkOut", checkOut.toISOString().split("T")[0]);
    //     if (selectedAmenities.length > 0) params.set("amenities", selectedAmenities.join(","));
    //     if (selectedRating) params.set("rating", selectedRating);
    //     if (selectedLocation) params.set("location", selectedLocation);

    //     const newUrl = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ""}`;
    //     router.replace(newUrl, { scroll: false });
    // }, [filters, checkIn, checkOut, selectedAmenities, selectedRating, selectedLocation, router, dynamicMaxPrice]);

    useEffect(() => {
        const params = new URLSearchParams();

        if (filters.search) params.set("search", filters.search);
        if (filters.page > 1) params.set("page", filters.page.toString());
        if (filters.minPrice > 0) params.set("minPrice", filters.minPrice.toString());

        // Only set maxPrice if user has actively changed it from the API max
        if (filters.maxPrice < dynamicMaxPrice) {
            params.set("maxPrice", filters.maxPrice.toString());
        }

        if (filters.propertyTypes.length > 0) params.set("propertyTypes", filters.propertyTypes.join(","));
        if (filters.guests > 1) params.set("guests", filters.guests.toString());
        if (filters.bedrooms > 1) params.set("bedrooms", filters.bedrooms.toString());
        if (checkIn) params.set("checkIn", checkIn.toISOString().split("T")[0]);
        if (checkOut) params.set("checkOut", checkOut.toISOString().split("T")[0]);
        if (selectedAmenities.length > 0) params.set("amenities", selectedAmenities.join(","));
        if (selectedRating) params.set("rating", selectedRating);
        if (selectedLocation) params.set("location", selectedLocation);

        const newUrl = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ""}`;
        router.replace(newUrl, { scroll: false });
    }, [filters, checkIn, checkOut, selectedAmenities, selectedRating, selectedLocation, router, dynamicMaxPrice]);

    const valueToPercent = (val: number) => {
        const percent = ((val - min) / (max - min)) * 100;
        return Math.min(100, Math.max(0, percent));
    };

    const toggleAmenity = (amenity: string) => {
        const newAmenities = selectedAmenities.includes(amenity) ? selectedAmenities.filter((a) => a !== amenity) : [...selectedAmenities, amenity];

        setSelectedAmenities(newAmenities);
        setFilters((prev) => ({
            ...prev,
            amenities: newAmenities,
            page: 1,
        }));
    };

    // Handle property type change (multiple selection)
    const handlePropertyTypeChange = (type: string) => {
        const newPropertyTypes = selectedPropertyTypes.includes(type) ? selectedPropertyTypes.filter((t) => t !== type) : [...selectedPropertyTypes, type];

        setSelectedPropertyTypes(newPropertyTypes);
        setFilters((prev) => ({
            ...prev,
            propertyTypes: newPropertyTypes,
            page: 1,
        }));
    };

    // Handle price range change
    const handlePriceChange = (value: [number, number]) => {
        setPriceRange(value);
        setFilters((prev) => ({
            ...prev,
            minPrice: value[0],
            maxPrice: value[1],
            page: 1,
        }));
    };

    // Handle page change
    const handlePageChange = (page: number) => {
        setFilters((prev) => ({ ...prev, page }));
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // Handle search
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilters((prev) => ({ ...prev, search: e.target.value, page: 1 }));
    };

    // Handle guest count change
    const handleGuestsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const guests = parseInt(e.target.value) || 1;
        setFilters((prev) => ({ ...prev, guests, page: 1 }));
    };

    // Handle bedroom count change
    const handleBedroomsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const bedrooms = parseInt(e.target.value) || 1;
        setFilters((prev) => ({ ...prev, bedrooms, page: 1 }));
    };

    // Handle location change
    const handleLocationChange = (location: string) => {
        const newLocation = selectedLocation === location ? null : location;
        setSelectedLocation(newLocation);
        setFilters((prev) => ({ ...prev, location: newLocation || "", page: 1 }));
    };

    // Handle check-in date change
    const handleCheckInChange = (date: Date | null) => {
        setCheckIn(date);
        setFilters((prev) => ({
            ...prev,
            availableFrom: date ? date.toISOString().split("T")[0] : "",
            page: 1,
        }));
    };

    // Handle check-out date change
    const handleCheckOutChange = (date: Date | null) => {
        setCheckOut(date);
        setFilters((prev) => ({
            ...prev,
            availableTo: date ? date.toISOString().split("T")[0] : "",
            page: 1,
        }));
    };

    // Handle rating change
    const handleRatingChange = (rating: string) => {
        const newRating = selectedRating === rating ? null : rating;
        setSelectedRating(newRating);
        setFilters((prev) => ({ ...prev, rating: newRating || "", page: 1 }));
    };

    const totalPages = meta?.totalPages || 1;
    const currentPage = filters.page;

    return (
        <div className="container mx-auto py-10">
            <div className="mx-4 md:mx-0">
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Filters Sidebar */}
                    <div className="md:w-1/4">
                        <div className="md:sticky top-24 z-10">
                            <div
                                className="border border-[#C9A94D] py-4 px-3 md:px-8 mb-10 md:max-h-[800px] md:overflow-y-auto"
                                style={{
                                    scrollbarWidth: "thin",
                                    scrollbarColor: "#C9A94D transparent",
                                }}
                            >
                                <style jsx>{`
                                    div::-webkit-scrollbar {
                                        width: 8px;
                                    }
                                    div::-webkit-scrollbar-track {
                                        background: transparent;
                                    }
                                    div::-webkit-scrollbar-thumb {
                                        background-color: #c9a94d;
                                        border-radius: 4px;
                                    }
                                `}</style>

                                <h1 className="text-center text-[#C9A94D] pt-8 text-2xl font-semibold">Find By</h1>

                                {/* Search */}
                                <div className="mb-6 mt-4">
                                    <Input placeholder="Search properties..." value={filters.search} onChange={handleSearch} className="border-[#C9A94D] text-white placeholder:text-white" />
                                </div>

                                {/* Price Range */}
                                <div className="w-auto relative mb-8">
                                    <h1 className="text-[#C9A94D] mb-4 text-center mt-4 md:mt-8">Your budget (per night)</h1>
                                    <div className="relative w-full h-6 mb-2">
                                        <span className="absolute text-[#C9A94D] font-medium" style={{ left: `${valueToPercent(priceRange[0])}%`, transform: "translateX(-50%)" }}>
                                            £{priceRange[0]}
                                        </span>
                                        <span className="absolute text-[#C9A94D] font-medium" style={{ left: `${valueToPercent(priceRange[1])}%`, transform: "translateX(-50%)" }}>
                                            £{priceRange[1]}
                                        </span>
                                    </div>

                                    <SliderPrimitive.Root className="relative flex items-center select-none touch-none w-full h-2" value={priceRange} min={0} max={dynamicMaxPrice} step={10} onValueChange={handlePriceChange}>
                                        <SliderPrimitive.Track className="bg-white relative flex-1 rounded-full h-2">
                                            <SliderPrimitive.Range className="absolute bg-[#C9A94D] rounded-full h-2" />
                                        </SliderPrimitive.Track>
                                        <SliderPrimitive.Thumb className="block w-5 h-5 bg-white border border-[#C9A94D] rounded-full" />
                                        <SliderPrimitive.Thumb className="block w-5 h-5 bg-white border border-[#C9A94D] rounded-full" />
                                    </SliderPrimitive.Root>
                                </div>

                                {/* Amenities */}
                                <div>
                                    <h1 className="text-[#C9A94D] pt-8 text-xl font-semibold mb-4">Amenities</h1>
                                    <div className="grid grid-cols-2 md:grid-cols-1 gap-4">
                                        {amenitiesList.map((amenity, idx) => (
                                            <div key={idx} className="flex items-center gap-2 cursor-pointer" onClick={() => toggleAmenity(amenity)}>
                                                <button type="button" className={`w-5 h-5 border rounded-xs border-[#C9A94D] flex items-center justify-center transition-all ${selectedAmenities.includes(amenity) ? "bg-[#14213D]" : "bg-transparent"}`}>
                                                    {selectedAmenities.includes(amenity) && <div className="w-[14px] h-[14px] bg-[#C9A94D] rounded-xs" />}
                                                </button>
                                                <span className="text-[#C9A94D]">{amenity}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Guest Star Rating */}
                                <div className="mb-8">
                                    <h1 className="text-[#C9A94D] pt-8 text-xl font-semibold mb-4">Guest Star Rating</h1>
                                    <div className="grid grid-cols-1 gap-4">
                                        {guestRatings.map((rating, idx) => (
                                            <div key={idx} className="flex items-center gap-2 cursor-pointer" onClick={() => handleRatingChange(rating)}>
                                                <button type="button" className={`w-5 h-5 border rounded-xs border-[#C9A94D] flex items-center justify-center transition-all ${selectedRating === rating ? "bg-[#14213D]" : "bg-transparent"}`}>
                                                    {selectedRating === rating && <div className="w-[14px] h-[14px] bg-[#C9A94D] rounded-xs" />}
                                                </button>
                                                <span className="text-[#C9A94D]">{rating}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="md:w-3/4 p-2 md:p-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                            {/* Check In */}
                            <div>
                                <label className="block text-[#C9A94D] font-medium mb-2 transition-colors duration-200">Check In</label>
                                <DatePicker selected={checkIn} wrapperClassName="w-full" onChange={handleCheckInChange} placeholderText="Select date" customInput={<CustomDateInput label="Check In" />} calendarClassName="border border-[#C9A94D] rounded-lg transition-colors duration-200" />
                            </div>

                            {/* Check Out */}
                            <div>
                                <label className="block text-[#C9A94D] font-medium mb-2">Check Out</label>
                                <DatePicker selected={checkOut} wrapperClassName="w-full" onChange={handleCheckOutChange} placeholderText="Select date" customInput={<CustomDateInput label="Check Out" />} calendarClassName="border border-[#C9A94D] rounded-lg" />
                            </div>

                            {/* Guest */}
                            <div>
                                <label className="block text-[#C9A94D] font-medium mb-2">Guest</label>
                                <Input
                                    type="number"
                                    value={filters.guests}
                                    onChange={handleGuestsChange}
                                    min={1}
                                    className="flex items-center justify-between w-full h-auto bg-white text-[#14213D] hover:backdrop-blur-md hover:bg-[#C9A94D]/20 hover:text-white border border-[#C9A94D] rounded-lg px-4 p-[6px] md:py-[10px] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
                                />
                            </div>

                            {/* Location */}
                            <div>
                                <label className="block text-[#C9A94D] font-medium mb-2">Location</label>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button className="flex items-center justify-between w-full bg-white text-[#14213D] hover:backdrop-blur-md hover:bg-[#C9A94D]/20 hover:text-white border border-[#C9A94D]">
                                            <MapPin className="w-4 h-4" />
                                            {selectedLocation || "Location"}
                                            <ChevronDown className="w-4 h-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)] bg-white border border-[#C9A94D] z-50 p-0">
                                        {locationOptions.map((option, i) => (
                                            <DropdownMenuItem className="border-b border-[#C9A94D] last:border-b-0 justify-center cursor-pointer" key={i} onClick={() => handleLocationChange(option)}>
                                                {option}
                                            </DropdownMenuItem>
                                        ))}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>

                            {/* Bedroom */}
                            <div>
                                <label className="block text-[#C9A94D] font-medium mb-2">Bedrooms</label>
                                <Input
                                    type="number"
                                    value={filters.bedrooms}
                                    onChange={handleBedroomsChange}
                                    min={1}
                                    className="flex items-center justify-between w-full bg-white text-[#14213D] hover:backdrop-blur-md hover:bg-[#C9A94D]/20 hover:text-white border border-[#C9A94D] rounded-lg px-4 py-3 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
                                />
                            </div>

                            {/* Property Type - Multiple Selection */}
                            <div>
                                <label className="block text-[#C9A94D] font-medium mb-2">Property Type</label>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button className="flex items-center justify-between w-full bg-white text-[#14213D] hover:backdrop-blur-md hover:bg-[#C9A94D]/20 hover:text-white border border-[#C9A94D]">
                                            <Home className="w-4 h-4" />
                                            {selectedPropertyTypes.length === 0 ? "Property Type" : selectedPropertyTypes.length === 1 ? selectedPropertyTypes[0] : `${selectedPropertyTypes.length} Selected`}
                                            <ChevronDown className="w-4 h-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)] bg-white border border-[#C9A94D] z-50 p-0">
                                        {propertyTypeOptions.map((option, i) => (
                                            <label key={i} className="flex rounded-[6px] items-center gap-2 p-2 border-b border-[#C9A94D] last:border-b-0 cursor-pointer hover:bg-gray-100">
                                                <input type="checkbox" checked={selectedPropertyTypes.includes(option)} onChange={() => handlePropertyTypeChange(option)} className="hidden" />
                                                <div className={`w-5 h-5 border rounded-xs border-[#C9A94D] flex items-center justify-center transition-all ${selectedPropertyTypes.includes(option) ? "" : "bg-transparent"}`}>{selectedPropertyTypes.includes(option) && <div className="w-[14px] h-[14px] bg-[#C9A94D] rounded-xs" />}</div>
                                                <span>{option}</span>
                                            </label>
                                        ))}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                        <div>
                            <h1 className="text-[30px] text-[#C9A94D] font-bold mb-6">List of Properties</h1>

                            {isLoading ? (
                                <div className="text-center py-12">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C9A94D] mx-auto"></div>
                                    <p className="mt-4 text-[#C9A94D]">Loading properties...</p>
                                </div>
                            ) : error ? (
                                <div className="text-center py-12">
                                    <p className="text-red-500">Failed to load properties</p>
                                </div>
                            ) : properties.length === 0 ? (
                                <div className="text-center py-12">
                                    <p className="text-[#C9A94D] text-lg">No properties found matching your criteria</p>
                                </div>
                            ) : (
                                <>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {properties.map((property) => (
                                            <PropertyCard2 key={property._id} property={property} />
                                        ))}
                                    </div>

                                    {totalPages > 1 && (
                                        <div className="flex justify-end items-center mt-6 gap-2">
                                            <button onClick={() => handlePageChange(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="p-2 text-[#C9A94D] disabled:opacity-50">
                                                <ChevronLeft className="w-8 h-8" />
                                            </button>

                                            {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((page) => {
                                                if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                                                    return (
                                                        <button key={page} onClick={() => handlePageChange(page)} className={`px-4 py-2 rounded-full font-medium ${currentPage === page ? "bg-[#C9A94D] text-white border border-[#C9A94D]" : "bg-transparent text-white border-[#C9A94D] hover:bg-[#C9A94D]/20"}`}>
                                                            {page}
                                                        </button>
                                                    );
                                                } else if (page === currentPage - 2 || page === currentPage + 2) {
                                                    return (
                                                        <span key={page} className="px-2 text-white">
                                                            ...
                                                        </span>
                                                    );
                                                } else {
                                                    return null;
                                                }
                                            })}

                                            <button onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="p-2 text-[#C9A94D] disabled:opacity-50">
                                                <ChevronRight className="w-8 h-8" />
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
