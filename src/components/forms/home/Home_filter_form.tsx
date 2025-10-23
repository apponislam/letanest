"use client";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { Button } from "@/components/ui/button";
import { Home, ChevronDown, MapPin, Bed } from "lucide-react";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

const HomeFilterForm = () => {
    const router = useRouter();
    const propertyTypeOptions = ["Hotel", "Apartment", "Aparthotel", "Bed & Breakfast", "Hostel", "Guesthouse", "Entire Home", "Room Only", "Student Accommodation", "Unique Stays", "Caravan"];
    const locationOptions = ["London", "New York", "Paris", "Tokyo", "Sydney"];

    const [filters, setFilters] = useState({
        propertyType: "",
        location: "",
        bedrooms: 1,
        minPrice: 0,
        maxPrice: 3000,
    });

    const min = 0;
    const max = 3000;

    // Helper to convert value to % position
    const valueToPercent = (val: number) => ((val - min) / (max - min)) * 100;

    // Handle price range change
    const handlePriceChange = (value: number[]) => {
        setFilters((prev) => ({
            ...prev,
            minPrice: value[0],
            maxPrice: value[1],
        }));
    };

    // Handle property type change
    const handlePropertyTypeChange = (type: string) => {
        setFilters((prev) => ({ ...prev, propertyType: type }));
    };

    // Handle location change
    const handleLocationChange = (location: string) => {
        setFilters((prev) => ({ ...prev, location }));
    };

    // Handle bedrooms change
    const handleBedroomsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value) || 1;
        setFilters((prev) => ({
            ...prev,
            bedrooms: Math.max(1, value), // Ensure minimum value is 1
        }));
    };

    // Handle search
    const handleSearch = () => {
        const params = new URLSearchParams();

        if (filters.minPrice > 0) params.set("minPrice", filters.minPrice.toString());
        if (filters.maxPrice < 3000) params.set("maxPrice", filters.maxPrice.toString());
        if (filters.propertyType) params.set("propertyType", filters.propertyType);
        if (filters.location) params.set("location", filters.location);
        if (filters.bedrooms > 1) params.set("bedrooms", filters.bedrooms.toString());

        const queryString = params.toString();
        router.push(`/listings${queryString ? `?${queryString}` : ""}`);
    };

    return (
        <div>
            <div className="flex flex-col md:flex-row gap-4 md:w-full mb-10">
                {/* Property Type Dropdown */}
                <div className="flex-1">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button className="flex items-center justify-between w-full bg-white text-[#14213D] hover:backdrop-blur-md hover:bg-[#C9A94D]/20 hover:text-white border border-[#C9A94D]">
                                <Home className="w-4 h-4" />
                                {filters.propertyType || "Property Type"}
                                <ChevronDown className="w-4 h-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)] bg-white border border-[#C9A94D] z-50 p-0">
                            {propertyTypeOptions.map((option, i) => (
                                <DropdownMenuItem key={i} className="border-b border-[#C9A94D] last:border-b-0 justify-center cursor-pointer text-center" onClick={() => handlePropertyTypeChange(option)}>
                                    {option}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                {/* Location Dropdown */}
                <div className="flex-1">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button className="flex items-center justify-between text-center w-full bg-white text-[#14213D] hover:backdrop-blur-md hover:bg-[#C9A94D]/20 hover:text-white border border-[#C9A94D]">
                                <MapPin className="w-4 h-4" />
                                {filters.location || "Location"}
                                <ChevronDown className="w-4 h-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)] bg-white border border-[#C9A94D] z-50 p-0">
                            {locationOptions.map((option, i) => (
                                <DropdownMenuItem key={i} className="border-b border-[#C9A94D] last:border-b-0 justify-center cursor-pointer text-center" onClick={() => handleLocationChange(option)}>
                                    {option}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                {/* Bedrooms Number Input */}
                <div className="flex-1">
                    <div className="relative group">
                        <Input
                            type="number"
                            value={filters.bedrooms}
                            onChange={handleBedroomsChange}
                            min={1}
                            className="flex items-center justify-between w-full bg-white text-[#14213D] group-hover:bg-[#C9A94D]/20 group-hover:text-white border border-[#C9A94D] rounded-lg pl-10 pr-4 py-2 h-auto [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield] transition-colors duration-200"
                            placeholder="Bedrooms"
                        />
                        <Bed className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#14213D] group-hover:text-white transition-colors duration-200" />
                    </div>
                </div>
            </div>

            {/* Price Range Slider */}
            <div className="md:mx-20 mx-4">
                <div className="w-auto relative mb-4">
                    <h1 className="text-[#C9A94D] mb-4 text-center">Your budget (per night)</h1>
                    <div className="relative w-full h-6 mb-2">
                        <span className="absolute text-[#C9A94D] font-medium" style={{ left: `${valueToPercent(filters.minPrice)}%`, transform: "translateX(-50%)" }}>
                            £{filters.minPrice}
                        </span>
                        <span className="absolute text-[#C9A94D] font-medium" style={{ left: `${valueToPercent(filters.maxPrice)}%`, transform: "translateX(-50%)" }}>
                            £{filters.maxPrice}
                        </span>
                    </div>

                    <SliderPrimitive.Root className="relative flex items-center select-none touch-none w-full h-2" value={[filters.minPrice, filters.maxPrice]} min={min} max={max} step={10} onValueChange={handlePriceChange}>
                        <SliderPrimitive.Track className="bg-white relative flex-1 rounded-full h-2">
                            <SliderPrimitive.Range className="absolute bg-[#C9A94D] rounded-full h-2" />
                        </SliderPrimitive.Track>
                        <SliderPrimitive.Thumb className="block w-5 h-5 bg-white border border-[#C9A94D] rounded-full cursor-pointer" />
                        <SliderPrimitive.Thumb className="block w-5 h-5 bg-white border border-[#C9A94D] rounded-full cursor-pointer" />
                    </SliderPrimitive.Root>
                </div>

                {/* Search Button */}
                <Button className="w-full bg-[#C9A94D] hover:bg-[#ad9038] text-white" onClick={handleSearch}>
                    Search
                </Button>
            </div>
        </div>
    );
};

export default HomeFilterForm;
