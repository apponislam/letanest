"use client";

import React, { useState } from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";

const amenitiesList = ["Pet Friendly", "Free WiFi", "Onsite Parking", "Laundry Service", "TV", "Wifi", "Parking", "Hot Tub", "Towels Included", "Garden", "Pool", "Dryer", "Gym", "Beach Access", "Smoking Allowed", "Balcony", "Kitchen", "Lift Access"];

const guestRatings = ["Good", "Above Good", "Excellent"];

export default function ListingsFilter() {
    const [value, setValue] = React.useState<[number, number]>([0, 3000]);
    const min = 0;
    const max = 3000;

    // Helper to convert value to % position
    const valueToPercent = (val: number) => {
        // map value to 0-100%
        const percent = ((val - min) / (max - min)) * 100;
        // optional: clamp to 0-100 to avoid overflow
        return Math.min(100, Math.max(0, percent));
    };

    const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
    const [selectedRating, setSelectedRating] = useState<string | null>(null);

    const toggleAmenity = (amenity: string) => {
        if (selectedAmenities.includes(amenity)) {
            setSelectedAmenities(selectedAmenities.filter((a) => a !== amenity));
        } else {
            setSelectedAmenities([...selectedAmenities, amenity]);
        }
    };

    return (
        <div className="container mx-auto py-10">
            <div className="mx-4 md:mx-0">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="md:w-2/8">
                        <div className="md:sticky top-24 z-10">
                            <div className="border border-[#C9A94D] py-4 px-8 mb-10">
                                <h1 className="text-center text-[#C9A94D] pt-8 text-2xl font-semibold">Find By</h1>
                                <div className="w-auto relative mb-8">
                                    <h1 className="text-[#C9A94D] mb-4">Price Range</h1>
                                    <div className="relative w-full h-6 mb-2">
                                        <span className="absolute text-[#C9A94D] font-medium" style={{ left: `${valueToPercent(value[0])}%`, transform: "translateX(-50%)" }}>
                                            ${value[0]}
                                        </span>
                                        <span className="absolute text-[#C9A94D] font-medium" style={{ left: `${valueToPercent(value[1])}%`, transform: "translateX(-50%)" }}>
                                            ${value[1]}
                                        </span>
                                    </div>

                                    <SliderPrimitive.Root className="relative flex items-center select-none touch-none w-full h-2" value={value} min={0} max={3000} step={10} onValueChange={(val: number[]) => setValue([val[0], val[1]])}>
                                        <SliderPrimitive.Track className="bg-white relative flex-1 rounded-full h-2">
                                            <SliderPrimitive.Range className="absolute bg-[#C9A94D] rounded-full h-2" />
                                        </SliderPrimitive.Track>
                                        <SliderPrimitive.Thumb className="block w-5 h-5 bg-white border border-[#C9A94D] rounded-full" />
                                        <SliderPrimitive.Thumb className="block w-5 h-5 bg-white border border-[#C9A94D] rounded-full" />
                                    </SliderPrimitive.Root>
                                </div>
                                <div>
                                    <h1 className=" text-[#C9A94D] pt-8 text-xl font-semibold mb-4">Amenities</h1>
                                    <div className="grid grid-cols-2 md:grid-cols-1 gap-4">
                                        {amenitiesList.map((amenity, idx) => (
                                            <div key={idx} className="flex items-center gap-2">
                                                <button type="button" onClick={() => toggleAmenity(amenity)} className={`w-5 h-5 border rounded-xs border-[#C9A94D] flex items-center justify-center cursor-pointer transition-all ${selectedAmenities.includes(amenity) ? "bg-[#14213D]" : "bg-transparent"}`}>
                                                    {selectedAmenities.includes(amenity) && <div className="w-[14px] h-[14px] bg-[#C9A94D] rounded-xs" />}
                                                </button>
                                                <span className="text-[#C9A94D]">{amenity}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="mb-8">
                                    <h1 className="text-[#C9A94D] pt-8 text-xl font-semibold mb-4">Guest Star Rating</h1>

                                    <div className="grid grid-cols-3 md:grid-cols-1 gap-4">
                                        {guestRatings.map((rating, idx) => (
                                            <div key={idx} className="flex items-center gap-2">
                                                <button type="button" onClick={() => setSelectedRating(rating)} className={`w-5 h-5 border rounded-xs border-[#C9A94D] flex items-center justify-center cursor-pointer transition-all ${selectedRating === rating ? "bg-[#14213D]" : "bg-transparent"}`}>
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
                    <div className="md:w-6/8 p-2 md:p-5 ">
                        <h1 className="text-9xl">hiii</h1>
                        <h1 className="text-9xl">hiii</h1>
                        <h1 className="text-9xl">hiii</h1>
                        <h1 className="text-9xl">hiii</h1>
                        <h1 className="text-9xl">hiii</h1>
                        <h1 className="text-9xl">hiii</h1>
                        <h1 className="text-9xl">hiii</h1>
                        <h1 className="text-9xl">hiii</h1>
                        <h1 className="text-9xl">hiii</h1>
                        <h1 className="text-9xl">hiii</h1>
                        <h1 className="text-9xl">hiii</h1>
                        <h1 className="text-9xl">hiii</h1>
                        <h1 className="text-9xl">hiii</h1>
                        <h1 className="text-9xl">hiii</h1>
                        <h1 className="text-9xl">hiii</h1>
                        <h1 className="text-9xl">hiii</h1>
                        <h1 className="text-9xl">hiii</h1>
                        <h1 className="text-9xl">hiii</h1>
                        <h1 className="text-9xl">hiii</h1>
                        <h1 className="text-9xl">hiii</h1>
                        <h1 className="text-9xl">hiii</h1>
                        <h1 className="text-9xl">hiii</h1>
                    </div>
                </div>
            </div>
        </div>
    );
}
