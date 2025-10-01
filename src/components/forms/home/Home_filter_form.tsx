"use client";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
// import { Slider, SliderTrack, SliderRange, SliderThumb } from "@/components/ui/slider";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { Button } from "@/components/ui/button";
import { Home, ChevronDown, MapPin, House } from "lucide-react";
import React from "react";

const HomeFilterForm = () => {
    // const [value, setValue] = React.useState<[number, number]>([150, 2550]);
    const propertyTypeOptions = ["Hotel", "Apartment", "Aparthotel", "Bed & Breakfast", "Hostel", "Guesthouse", "Entire Home", "Room Only", "Student Accommodation", "Unique Stays", "Caravan"];

    const [value, setValue] = React.useState<[number, number]>([0, 3000]);
    const min = 0;
    const max = 3000;

    // Helper to convert value to % position
    const valueToPercent = (val: number) => ((val - min) / (max - min)) * 100;

    return (
        <div>
            <div className="flex flex-col md:flex-row gap-4 md:w-full mb-10">
                {/* First Dropdown */}
                <div className="flex-1">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button className="flex items-center justify-between w-full bg-white text-[#14213D] hover:backdrop-blur-md hover:bg-[#C9A94D]/20 border border-[#C9A94D]">
                                <Home className="w-4 h-4" />
                                Property Type
                                <ChevronDown className="w-4 h-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)] bg-white border border-[#C9A94D] z-50 p-0">
                            {propertyTypeOptions.map((option, i) => (
                                <DropdownMenuItem className="border-b border-[#C9A94D] last:border-b-0 justify-center" key={i}>
                                    {option}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                {/* Second Dropdown */}
                <div className="flex-1">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button className="flex items-center justify-between w-full bg-white text-[#14213D] hover:backdrop-blur-md hover:bg-[#C9A94D]/20 border border-[#C9A94D]">
                                <MapPin />
                                Location
                                <ChevronDown className="w-4 h-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)] bg-white border border-[#C9A94D] z-50 p-0">
                            <DropdownMenuItem className="border-b border-[#C9A94D] last:border-b-0 ">Option A</DropdownMenuItem>
                            <DropdownMenuItem className="border-b border-[#C9A94D] last:border-b-0 ">Option B</DropdownMenuItem>
                            <DropdownMenuItem className="border-b border-[#C9A94D] last:border-b-0 ">Option C</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                {/* Third Dropdown */}
                <div className="flex-1">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button className="flex items-center justify-between w-full bg-white text-[#14213D] hover:backdrop-blur-md hover:bg-[#C9A94D]/20 border border-[#C9A94D]">
                                <House />
                                Bedrooms
                                <ChevronDown className="w-4 h-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)] bg-white border border-[#C9A94D] z-50 p-0">
                            <DropdownMenuItem className="border-b border-[#C9A94D] last:border-b-0 ">Option X</DropdownMenuItem>
                            <DropdownMenuItem className="border-b border-[#C9A94D] last:border-b-0 ">Option Y</DropdownMenuItem>
                            <DropdownMenuItem className="border-b border-[#C9A94D] last:border-b-0 ">Option Z</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
            <div className="md:mx-20 mx-4">
                <div className="w-auto relative mb-4">
                    <h1 className="text-[#C9A94D] mb-4">Price Range</h1>
                    <div className="relative w-full h-6 mb-2">
                        <span className="absolute text-[#C9A94D] font-medium" style={{ left: `${valueToPercent(value[0])}%`, transform: "translateX(-50%)" }}>
                            £{value[0]}
                        </span>
                        <span className="absolute text-[#C9A94D] font-medium" style={{ left: `${valueToPercent(value[1])}%`, transform: "translateX(-50%)" }}>
                            £{value[1]}
                        </span>
                    </div>

                    <SliderPrimitive.Root className="relative flex items-center select-none touch-none w-full h-2" value={value} min={min} max={max} step={10} onValueChange={(val: number[]) => setValue([val[0], val[1]])}>
                        <SliderPrimitive.Track className="bg-white relative flex-1 rounded-full h-2">
                            <SliderPrimitive.Range className="absolute bg-[#C9A94D] rounded-full h-2" />
                        </SliderPrimitive.Track>
                        <SliderPrimitive.Thumb className="block w-5 h-5 bg-white border border-[#C9A94D] rounded-full" />
                        <SliderPrimitive.Thumb className="block w-5 h-5 bg-white border border-[#C9A94D] rounded-full" />
                    </SliderPrimitive.Root>
                </div>
                <Button className="w-full bg-[#C9A94D] hover:bg-[#ad9038] text-white">Search</Button>
            </div>
        </div>
    );
};

export default HomeFilterForm;
