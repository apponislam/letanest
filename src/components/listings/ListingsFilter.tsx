// "use client";

// import React, { useEffect, useState } from "react";
// import * as SliderPrimitive from "@radix-ui/react-slider";
// import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
// import { Button } from "@/components/ui/button";
// import { ChevronDown, ChevronLeft, ChevronRight, Home, MapPin } from "lucide-react";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import CustomDateInput from "@/utils/CustomDateInput";
// import { Property } from "@/types/proparty";
// import PropertyCard from "../PropertyCard";
// import { Input } from "../ui/input";

// const amenitiesList = ["Pet Friendly", "Free WiFi", "Onsite Parking", "Laundry Service", "TV", "Wifi", "Parking", "Hot Tub", "Towels Included", "Garden", "Pool", "Dryer", "Gym", "Beach Access", "Smoking Allowed", "Balcony", "Kitchen", "Lift Access"];
// const guestRatings = ["Good", "Above Good", "Excellent"];

// export default function ListingsFilter() {
//     const [checkIn, setCheckIn] = useState<Date | null>(null);
//     const [checkOut, setCheckOut] = useState<Date | null>(null);

//     const [properties, setProperties] = useState<Property[]>([]);
//     const [currentPage, setCurrentPage] = useState<number>(1);
//     const itemsPerPage = 10;

//     useEffect(() => {
//         const fetchProperties = async () => {
//             try {
//                 const res = await fetch("/data/proparties.json");
//                 const json = await res.json();

//                 // json.data contains the array of properties
//                 setProperties(json.data);
//             } catch (error) {
//                 console.error("Failed to fetch properties:", error);
//             }
//         };

//         fetchProperties();
//     }, []);

//     const locationOptions = ["New York", "London", "Paris"];
//     const propertyTypeOptions = ["Hotel", "Apartment", "Aparthotel", "Bed & Breakfast", "Hostel", "Guesthouse", "Entire Home", "Room Only", "Student Accommodation", "Unique Stays", "Caravan"];
//     const [value, setValue] = React.useState<[number, number]>([0, 3000]);
//     const min = 0;
//     const max = 3000;

//     const valueToPercent = (val: number) => {
//         const percent = ((val - min) / (max - min)) * 100;

//         return Math.min(100, Math.max(0, percent));
//     };

//     const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
//     const [selectedRating, setSelectedRating] = useState<string | null>(null);

//     const toggleAmenity = (amenity: string) => {
//         if (selectedAmenities.includes(amenity)) {
//             setSelectedAmenities(selectedAmenities.filter((a) => a !== amenity));
//         } else {
//             setSelectedAmenities([...selectedAmenities, amenity]);
//         }
//     };

//     // Calculate pagination
//     const indexOfLast = currentPage * itemsPerPage;
//     const indexOfFirst = indexOfLast - itemsPerPage;
//     const currentProperties = properties.slice(indexOfFirst, indexOfLast);
//     const totalPages = Math.ceil(properties.length / itemsPerPage);

//     const handlePageChange = (page: number) => {
//         setCurrentPage(page);
//     };

//     return (
//         <div className="container mx-auto py-10">
//             <div className="mx-4 md:mx-0">
//                 <div className="flex flex-col md:flex-row gap-4">
//                     <div className="md:w-2/8">
//                         <div className="md:sticky top-24 z-10">
//                             <div
//                                 className="border border-[#C9A94D] py-4 px-3 md:px-8 mb-10 md:max-h-[800px] md:overflow-y-auto"
//                                 style={{
//                                     scrollbarWidth: "thin",
//                                     scrollbarColor: "#C9A94D transparent",
//                                 }}
//                             >
//                                 <style jsx>{`
//                                     /* Chrome, Edge, Safari */
//                                     div::-webkit-scrollbar {
//                                         width: 8px;
//                                     }
//                                     div::-webkit-scrollbar-track {
//                                         background: transparent; /* make track transparent */
//                                     }
//                                     div::-webkit-scrollbar-thumb {
//                                         background-color: #c9a94d; /* gold thumb */
//                                         border-radius: 4px;
//                                     }
//                                 `}</style>

//                                 <h1 className="text-center text-[#C9A94D] pt-8 text-2xl font-semibold">Find By</h1>

//                                 {/* Price Range */}
//                                 <div className="w-auto relative mb-8">
//                                     <h1 className="text-[#C9A94D] mb-4 text-center mt-4 md:mt-8">Price Range</h1>
//                                     <div className="relative w-full h-6 mb-2">
//                                         <span className="absolute text-[#C9A94D] font-medium" style={{ left: `${valueToPercent(value[0])}%`, transform: "translateX(-50%)" }}>
//                                             £{value[0]}
//                                         </span>
//                                         <span className="absolute text-[#C9A94D] font-medium" style={{ left: `${valueToPercent(value[1])}%`, transform: "translateX(-50%)" }}>
//                                             £{value[1]}
//                                         </span>
//                                     </div>

//                                     <SliderPrimitive.Root className="relative flex items-center select-none touch-none w-full h-2" value={value} min={0} max={3000} step={10} onValueChange={(val: number[]) => setValue([val[0], val[1]])}>
//                                         <SliderPrimitive.Track className="bg-white relative flex-1 rounded-full h-2">
//                                             <SliderPrimitive.Range className="absolute bg-[#C9A94D] rounded-full h-2" />
//                                         </SliderPrimitive.Track>
//                                         <SliderPrimitive.Thumb className="block w-5 h-5 bg-white border border-[#C9A94D] rounded-full" />
//                                         <SliderPrimitive.Thumb className="block w-5 h-5 bg-white border border-[#C9A94D] rounded-full" />
//                                     </SliderPrimitive.Root>
//                                 </div>

//                                 {/* Amenities */}
//                                 <div>
//                                     <h1 className="text-[#C9A94D] pt-8 text-xl font-semibold mb-4">Amenities</h1>
//                                     <div className="grid grid-cols-2 md:grid-cols-1 gap-4">
//                                         {amenitiesList.map((amenity, idx) => (
//                                             <div
//                                                 key={idx}
//                                                 className="flex items-center gap-2 cursor-pointer" // whole row clickable
//                                                 onClick={() => toggleAmenity(amenity)}
//                                             >
//                                                 <button type="button" className={`w-5 h-5 border rounded-xs border-[#C9A94D] flex items-center justify-center transition-all ${selectedAmenities.includes(amenity) ? "bg-[#14213D]" : "bg-transparent"}`}>
//                                                     {selectedAmenities.includes(amenity) && <div className="w-[14px] h-[14px] bg-[#C9A94D] rounded-xs" />}
//                                                 </button>
//                                                 <span className="text-[#C9A94D]">{amenity}</span>
//                                             </div>
//                                         ))}
//                                     </div>
//                                 </div>

//                                 {/* Guest Star Rating */}
//                                 <div className="mb-8">
//                                     <h1 className="text-[#C9A94D] pt-8 text-xl font-semibold mb-4">Guest Star Rating</h1>
//                                     <div className="grid grid-cols-1 gap-4">
//                                         {guestRatings.map((rating, idx) => (
//                                             <div
//                                                 key={idx}
//                                                 className="flex items-center gap-2 cursor-pointer" // whole row clickable
//                                                 onClick={() => setSelectedRating((prev) => (prev === rating ? null : rating))}
//                                             >
//                                                 <button type="button" className={`w-5 h-5 border rounded-xs border-[#C9A94D] flex items-center justify-center transition-all ${selectedRating === rating ? "bg-[#14213D]" : "bg-transparent"}`}>
//                                                     {selectedRating === rating && <div className="w-[14px] h-[14px] bg-[#C9A94D] rounded-xs" />}
//                                                 </button>
//                                                 <span className="text-[#C9A94D]">{rating}</span>
//                                             </div>
//                                         ))}
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                     <div className="md:w-6/8 p-2 md:p-5 ">
//                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
//                             {/* Check In */}
//                             <div>
//                                 <label className="block text-[#C9A94D] font-medium mb-2">Check In</label>
//                                 <DatePicker selected={checkIn} wrapperClassName="w-full" onChange={(date) => setCheckIn(date)} placeholderText="Select date" customInput={<CustomDateInput label="Check In" />} calendarClassName="border border-[#C9A94D] rounded-lg" />
//                             </div>

//                             {/* Check Out */}
//                             <div>
//                                 <label className="block text-[#C9A94D] font-medium mb-2">Check Out</label>
//                                 <DatePicker selected={checkOut} wrapperClassName="w-full" onChange={(date) => setCheckOut(date)} placeholderText="Select date" customInput={<CustomDateInput label="Check Out" />} calendarClassName="border border-[#C9A94D] rounded-lg" />
//                             </div>

//                             {/* Guest */}

//                             <div>
//                                 <label className="block text-[#C9A94D] font-medium mb-2">Guest</label>
//                                 <Input
//                                     type="number"
//                                     defaultValue={1}
//                                     min={1} // prevents negative values
//                                     className="flex items-center justify-between w-full h-auto bg-white text-[#14213D] hover:backdrop-blur-md hover:bg-[#C9A94D]/20 border border-[#C9A94D] rounded-lg px-4 p-[6px] md:py-[10px] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
//                                 />
//                             </div>

//                             {/* Location */}
//                             <div>
//                                 <label className="block text-[#C9A94D] font-medium mb-2">Location</label>
//                                 <DropdownMenu>
//                                     <DropdownMenuTrigger asChild>
//                                         <Button className="flex items-center justify-between w-full bg-white text-[#14213D] hover:backdrop-blur-md hover:bg-[#C9A94D]/20 border border-[#C9A94D]">
//                                             <MapPin className="w-4 h-4" />
//                                             Location
//                                             <ChevronDown className="w-4 h-4" />
//                                         </Button>
//                                     </DropdownMenuTrigger>
//                                     <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)] bg-white border border-[#C9A94D] z-50 p-0">
//                                         {locationOptions.map((option, i) => (
//                                             <DropdownMenuItem className="border-b border-[#C9A94D] last:border-b-0 " key={i}>
//                                                 {option}
//                                             </DropdownMenuItem>
//                                         ))}
//                                     </DropdownMenuContent>
//                                 </DropdownMenu>
//                             </div>

//                             {/* Bedroom */}

//                             <div>
//                                 <label className="block text-[#C9A94D] font-medium mb-2">Guest</label>
//                                 <Input type="number" defaultValue={1} min={1} className="flex items-center justify-between w-full bg-white text-[#14213D] hover:backdrop-blur-md hover:bg-[#C9A94D]/20 border border-[#C9A94D] rounded-lg px-4 py-3 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]" />
//                             </div>

//                             {/* Property Type */}
//                             <div>
//                                 <label className="block text-[#C9A94D] font-medium mb-2">Property Type</label>
//                                 <DropdownMenu>
//                                     <DropdownMenuTrigger asChild>
//                                         <Button className="flex items-center justify-between w-full bg-white text-[#14213D] hover:backdrop-blur-md hover:bg-[#C9A94D]/20 border border-[#C9A94D]">
//                                             <Home className="w-4 h-4" />
//                                             Property Type
//                                             <ChevronDown className="w-4 h-4" />
//                                         </Button>
//                                     </DropdownMenuTrigger>
//                                     <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)] bg-white border border-[#C9A94D] z-50 p-0:">
//                                         {propertyTypeOptions.map((option, i) => (
//                                             <DropdownMenuItem className="border-b border-[#C9A94D] last:border-b-0 justify-center" key={i}>
//                                                 {option}
//                                             </DropdownMenuItem>
//                                         ))}
//                                     </DropdownMenuContent>
//                                 </DropdownMenu>
//                             </div>
//                         </div>
//                         <div>
//                             <h1 className="text-[30px] text-[#C9A94D] font-bold mb-6">List of Properties</h1>
//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                                 {currentProperties.map((property, i) => (
//                                     <PropertyCard key={i} property={property} />
//                                 ))}
//                             </div>

//                             {/* Pagination controls */}
//                             <div className="flex justify-end items-center mt-6 gap-2">
//                                 {/* Left Arrow */}
//                                 <button onClick={() => handlePageChange(Math.max(1, currentPage - 1))} className="p-2 text-[#C9A94D]">
//                                     <ChevronLeft className="w-8 h-8" />
//                                 </button>

//                                 {/* Page numbers with ellipsis */}
//                                 {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((page) => {
//                                     if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
//                                         return (
//                                             <button key={page} onClick={() => handlePageChange(page)} className={`px-4 py-2  rounded-full font-medium ${currentPage === page ? "bg-[#C9A94D] text-white border border-[#C9A94D]" : "bg-transparent text-white border-[#C9A94D] hover:bg-[#C9A94D]/20"}`}>
//                                                 {page}
//                                             </button>
//                                         );
//                                     } else if (page === currentPage - 2 || page === currentPage + 2) {
//                                         return (
//                                             <span key={page} className="px-2 text-white">
//                                                 ...
//                                             </span>
//                                         );
//                                     } else {
//                                         return null;
//                                     }
//                                 })}

//                                 {/* Right Arrow */}
//                                 <button onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))} className="p-2 text-[#C9A94D]">
//                                     <ChevronRight className="w-8 h-8" />
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }

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
import { useGetAllPropertiesQuery } from "@/redux/features/property/propertyApi";

const amenitiesList = ["Pet Friendly", "Free WiFi", "Onsite Parking", "Laundry Service", "TV", "Wifi", "Parking", "Hot Tub", "Towels Included", "Garden", "Pool", "Dryer", "Gym", "Beach Access", "Smoking Allowed", "Balcony", "Kitchen", "Lift Access"];
const guestRatings = ["Good", "Above Good", "Excellent"];

export default function ListingsFilter() {
    const [checkIn, setCheckIn] = useState<Date | null>(null);
    const [checkOut, setCheckOut] = useState<Date | null>(null);

    const [filters, setFilters] = useState({
        page: 1,
        limit: 10, // Changed to 10 to match your original
        search: "",
        status: "published",
        minPrice: 0,
        maxPrice: 3000,
        propertyType: "",
        guests: 1,
        bedrooms: 1,
    });

    const { data, isLoading, error } = useGetAllPropertiesQuery(filters);

    const properties = data?.data || [];
    const meta = data?.meta;

    const locationOptions = ["New York", "London", "Paris"];
    const propertyTypeOptions = ["Hotel", "Apartment", "Aparthotel", "Bed & Breakfast", "Hostel", "Guesthouse", "Entire Home", "Room Only", "Student Accommodation", "Unique Stays", "Caravan"];

    const [priceRange, setPriceRange] = React.useState<[number, number]>([0, 3000]);
    const min = 0;
    const max = 3000;

    const valueToPercent = (val: number) => {
        const percent = ((val - min) / (max - min)) * 100;
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

    // Handle property type filter
    const handlePropertyTypeChange = (type: string) => {
        setFilters((prev) => ({ ...prev, propertyType: type, page: 1 }));
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

    const totalPages = meta?.totalPages || 1;
    const currentPage = filters.page;

    return (
        <div className="container mx-auto py-10">
            <div className="mx-4 md:mx-0">
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Filters Sidebar - Fixed width to match original */}
                    <div className="md:w-1/4">
                        {" "}
                        {/* Changed from 2/8 to 1/4 */}
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
                                    <Input placeholder="Search properties..." value={filters.search} onChange={handleSearch} className="border-[#C9A94D] text-[#14213D]" />
                                </div>

                                {/* Price Range */}
                                <div className="w-auto relative mb-8">
                                    <h1 className="text-[#C9A94D] mb-4 text-center mt-4 md:mt-8">Price Range</h1>
                                    <div className="relative w-full h-6 mb-2">
                                        <span className="absolute text-[#C9A94D] font-medium" style={{ left: `${valueToPercent(priceRange[0])}%`, transform: "translateX(-50%)" }}>
                                            £{priceRange[0]}
                                        </span>
                                        <span className="absolute text-[#C9A94D] font-medium" style={{ left: `${valueToPercent(priceRange[1])}%`, transform: "translateX(-50%)" }}>
                                            £{priceRange[1]}
                                        </span>
                                    </div>

                                    <SliderPrimitive.Root className="relative flex items-center select-none touch-none w-full h-2" value={priceRange} min={0} max={3000} step={10} onValueChange={handlePriceChange}>
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
                                            <div key={idx} className="flex items-center gap-2 cursor-pointer" onClick={() => setSelectedRating((prev) => (prev === rating ? null : rating))}>
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

                    {/* Main Content - Fixed width to match original */}
                    <div className="md:w-3/4 p-2 md:p-5">
                        {" "}
                        {/* Changed from 6/8 to 3/4 */}
                        {/* Filter Grid - Fixed to match your original layout */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                            {/* Check In */}
                            <div>
                                <label className="block text-[#C9A94D] font-medium mb-2">Check In</label>
                                <DatePicker selected={checkIn} wrapperClassName="w-full" onChange={(date) => setCheckIn(date)} placeholderText="Select date" customInput={<CustomDateInput label="Check In" />} calendarClassName="border border-[#C9A94D] rounded-lg" />
                            </div>

                            {/* Check Out */}
                            <div>
                                <label className="block text-[#C9A94D] font-medium mb-2">Check Out</label>
                                <DatePicker selected={checkOut} wrapperClassName="w-full" onChange={(date) => setCheckOut(date)} placeholderText="Select date" customInput={<CustomDateInput label="Check Out" />} calendarClassName="border border-[#C9A94D] rounded-lg" />
                            </div>

                            {/* Guest */}
                            <div>
                                <label className="block text-[#C9A94D] font-medium mb-2">Guest</label>
                                <Input
                                    type="number"
                                    value={filters.guests}
                                    onChange={handleGuestsChange}
                                    min={1}
                                    className="flex items-center justify-between w-full h-auto bg-white text-[#14213D] hover:backdrop-blur-md hover:bg-[#C9A94D]/20 border border-[#C9A94D] rounded-lg px-4 p-[6px] md:py-[10px] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
                                />
                            </div>

                            {/* Location */}
                            <div>
                                <label className="block text-[#C9A94D] font-medium mb-2">Location</label>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button className="flex items-center justify-between w-full bg-white text-[#14213D] hover:backdrop-blur-md hover:bg-[#C9A94D]/20 border border-[#C9A94D]">
                                            <MapPin className="w-4 h-4" />
                                            Location
                                            <ChevronDown className="w-4 h-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)] bg-white border border-[#C9A94D] z-50 p-0">
                                        {locationOptions.map((option, i) => (
                                            <DropdownMenuItem className="border-b border-[#C9A94D] last:border-b-0 " key={i}>
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
                                    className="flex items-center justify-between w-full bg-white text-[#14213D] hover:backdrop-blur-md hover:bg-[#C9A94D]/20 border border-[#C9A94D] rounded-lg px-4 py-3 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
                                />
                            </div>

                            {/* Property Type */}
                            <div>
                                <label className="block text-[#C9A94D] font-medium mb-2">Property Type</label>
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
                                            <DropdownMenuItem className="border-b border-[#C9A94D] last:border-b-0 justify-center cursor-pointer" key={i} onClick={() => handlePropertyTypeChange(option)}>
                                                {option}
                                            </DropdownMenuItem>
                                        ))}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                        <div>
                            <h1 className="text-[30px] text-[#C9A94D] font-bold mb-6">List of Properties {meta?.total && `(${meta.total} found)`}</h1>

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
                                    {/* Fixed grid to show 2 columns on desktop like your original */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {properties.map((property) => (
                                            <PropertyCard2 key={property._id} property={property} />
                                        ))}
                                    </div>

                                    {/* Pagination controls */}
                                    {totalPages > 1 && (
                                        <div className="flex justify-end items-center mt-6 gap-2">
                                            {/* Left Arrow */}
                                            <button onClick={() => handlePageChange(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="p-2 text-[#C9A94D] disabled:opacity-50">
                                                <ChevronLeft className="w-8 h-8" />
                                            </button>

                                            {/* Page numbers with ellipsis */}
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

                                            {/* Right Arrow */}
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
