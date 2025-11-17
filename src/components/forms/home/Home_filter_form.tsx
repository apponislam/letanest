// "use client";
// import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu";
// import * as SliderPrimitive from "@radix-ui/react-slider";
// import { Button } from "@/components/ui/button";
// import { Home, ChevronDown, MapPin, Bed } from "lucide-react";
// import React, { useEffect, useState } from "react";
// import { Input } from "@/components/ui/input";
// import { useRouter } from "next/navigation";
// import { useGetMaxRoundedPriceQuery } from "@/redux/features/property/propertyApi";

// const HomeFilterForm = () => {
//     const router = useRouter();
//     const propertyTypeOptions = ["Hotel", "Apartment", "Aparthotel", "Bed & Breakfast", "Hostel", "Guesthouse", "Entire Home", "Room Only", "Student Accommodation", "Unique Stays", "Caravan"];
//     const locationOptions = ["London", "New York", "Paris", "Tokyo", "Sydney"];
//     const { data: maxPriceData } = useGetMaxRoundedPriceQuery();

//     const [filters, setFilters] = useState({
//         propertyTypes: [] as string[],
//         location: "",
//         bedrooms: 1,
//         minPrice: 0,
//         maxPrice: 3000,
//     });

//     const min = 0;
//     const max = maxPriceData?.data?.maxRoundedPrice || 3000;

//     // Update maxPrice when API data loads
//     useEffect(() => {
//         if (maxPriceData?.data?.maxRoundedPrice) {
//             setFilters((prev) => ({
//                 ...prev,
//                 maxPrice: maxPriceData.data.maxRoundedPrice,
//             }));
//         }
//     }, [maxPriceData?.data?.maxRoundedPrice]);

//     // Helper to convert value to % position
//     const valueToPercent = (val: number) => ((val - min) / (max - min)) * 100;

//     // Handle price range change
//     const handlePriceChange = (value: number[]) => {
//         setFilters((prev) => ({
//             ...prev,
//             minPrice: value[0],
//             maxPrice: value[1],
//         }));
//     };

//     // Handle property type change
//     const handlePropertyTypeChange = (type: string) => {
//         setFilters((prev) => ({
//             ...prev,
//             propertyTypes: prev.propertyTypes.includes(type) ? prev.propertyTypes.filter((t) => t !== type) : [...prev.propertyTypes, type],
//         }));
//     };

//     // Handle location change
//     const handleLocationChange = (location: string) => {
//         setFilters((prev) => ({ ...prev, location }));
//     };

//     // Handle bedrooms change
//     const handleBedroomsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const value = e.target.value;

//         // Allow empty string for clearing the input
//         if (value === "") {
//             setFilters((prev) => ({
//                 ...prev,
//                 bedrooms: 0, // Set to 0 temporarily to allow typing
//             }));
//             return;
//         }

//         const numValue = parseInt(value);
//         if (!isNaN(numValue) && numValue >= 0) {
//             setFilters((prev) => ({
//                 ...prev,
//                 bedrooms: numValue,
//             }));
//         }
//     };

//     // Handle blur to enforce minimum value when user leaves the field
//     const handleBedroomsBlur = () => {
//         if (filters.bedrooms < 1) {
//             setFilters((prev) => ({
//                 ...prev,
//                 bedrooms: 1, // Set to minimum when field loses focus
//             }));
//         }
//     };

//     // Handle search
//     const handleSearch = () => {
//         const params = new URLSearchParams();

//         if (filters.minPrice > 0) params.set("minPrice", filters.minPrice.toString());
//         if (filters.maxPrice < 3000) params.set("maxPrice", filters.maxPrice.toString());
//         if (filters.propertyTypes.length > 0) params.set("propertyTypes", filters.propertyTypes.join(","));
//         if (filters.location) params.set("location", filters.location);
//         if (filters.bedrooms > 1) params.set("bedrooms", filters.bedrooms.toString());

//         const queryString = params.toString();
//         router.push(`/listings${queryString ? `?${queryString}` : ""}`);
//     };

//     return (
//         <div>
//             <div className="flex flex-col md:flex-row gap-4 md:w-full mb-10">
//                 <div className="flex-1">
//                     <DropdownMenu>
//                         <DropdownMenuTrigger asChild>
//                             <Button className="flex items-center justify-between w-full bg-white text-[#14213D] hover:backdrop-blur-md hover:bg-[#C9A94D]/20 hover:text-white border border-[#C9A94D]">
//                                 <Home className="w-4 h-4" />
//                                 {filters.propertyTypes.length === 0 ? "Property Type" : filters.propertyTypes.length === 1 ? filters.propertyTypes[0] : `${filters.propertyTypes.length} Selected`}
//                                 <ChevronDown className="w-4 h-4" />
//                             </Button>
//                         </DropdownMenuTrigger>
//                         <DropdownMenuContent className="w-64 bg-white border border-[#C9A94D] z-50 p-0">
//                             {propertyTypeOptions.map((option, i) => (
//                                 <label key={i} className="flex rounded-[6px] items-center gap-2 p-2 border-b border-[#C9A94D] last:border-b-0 cursor-pointer hover:bg-gray-100">
//                                     <input type="checkbox" checked={filters.propertyTypes.includes(option)} onChange={() => handlePropertyTypeChange(option)} className="hidden" />
//                                     <div className={`w-5 h-5 border rounded-xs border-[#C9A94D] flex items-center justify-center transition-all ${filters.propertyTypes.includes(option) ? "" : "bg-transparent"}`}>{filters.propertyTypes.includes(option) && <div className="w-[14px] h-[14px] bg-[#C9A94D] rounded-xs" />}</div>
//                                     <span>{option}</span>
//                                 </label>
//                             ))}
//                         </DropdownMenuContent>
//                     </DropdownMenu>
//                 </div>

//                 {/* Location Dropdown */}
//                 <div className="flex-1">
//                     <DropdownMenu>
//                         <DropdownMenuTrigger asChild>
//                             <Button className="flex items-center justify-between text-center w-full bg-white text-[#14213D] hover:backdrop-blur-md hover:bg-[#C9A94D]/20 hover:text-white border border-[#C9A94D]">
//                                 <MapPin className="w-4 h-4" />
//                                 {filters.location || "Location"}
//                                 <ChevronDown className="w-4 h-4" />
//                             </Button>
//                         </DropdownMenuTrigger>
//                         <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)] bg-white border border-[#C9A94D] z-50 p-0">
//                             {locationOptions.map((option, i) => (
//                                 <DropdownMenuItem key={i} className="border-b border-[#C9A94D] last:border-b-0 justify-center cursor-pointer text-center" onClick={() => handleLocationChange(option)}>
//                                     {option}
//                                 </DropdownMenuItem>
//                             ))}
//                         </DropdownMenuContent>
//                     </DropdownMenu>
//                 </div>

//                 {/* Bedrooms Number Input */}
//                 <div className="flex-1">
//                     <div className="relative group">
//                         <Input
//                             type="number"
//                             value={filters.bedrooms === 0 ? "" : filters.bedrooms} // Show empty when 0
//                             onChange={handleBedroomsChange}
//                             onBlur={handleBedroomsBlur} // Add blur handler
//                             min={1}
//                             className="flex items-center justify-between w-full bg-white text-[#14213D] group-hover:bg-[#C9A94D]/20 group-hover:text-white border border-[#C9A94D] rounded-lg pl-10 pr-4 py-2 h-auto [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield] transition-colors duration-200"
//                             placeholder="Bedrooms"
//                         />
//                         <Bed className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#14213D] group-hover:text-white transition-colors duration-200" />
//                     </div>
//                 </div>
//             </div>

//             {/* Price Range Slider */}
//             <div className="md:mx-20 mx-4">
//                 <div className="w-auto relative mb-4">
//                     <h1 className="text-[#C9A94D] mb-4 text-center">Your budget (per night)</h1>
//                     <div className="relative w-full h-6 mb-2">
//                         <span className="absolute text-[#C9A94D] font-medium" style={{ left: `${valueToPercent(filters.minPrice)}%`, transform: "translateX(-50%)" }}>
//                             £{filters.minPrice}
//                         </span>
//                         <span className="absolute text-[#C9A94D] font-medium" style={{ left: `${valueToPercent(filters.maxPrice)}%`, transform: "translateX(-50%)" }}>
//                             £{filters.maxPrice}
//                         </span>
//                     </div>

//                     <SliderPrimitive.Root className="relative flex items-center select-none touch-none w-full h-2" value={[filters.minPrice, filters.maxPrice]} min={min} max={max} step={10} onValueChange={handlePriceChange}>
//                         <SliderPrimitive.Track className="bg-white relative flex-1 rounded-full h-2">
//                             <SliderPrimitive.Range className="absolute bg-[#C9A94D] rounded-full h-2" />
//                         </SliderPrimitive.Track>
//                         <SliderPrimitive.Thumb className="block w-5 h-5 bg-white border border-[#C9A94D] rounded-full cursor-pointer" />
//                         <SliderPrimitive.Thumb className="block w-5 h-5 bg-white border border-[#C9A94D] rounded-full cursor-pointer" />
//                     </SliderPrimitive.Root>
//                 </div>

//                 {/* Search Button */}
//                 <Button className="w-full bg-[#C9A94D] hover:bg-[#ad9038] text-white" onClick={handleSearch}>
//                     Search
//                 </Button>
//             </div>
//         </div>
//     );
// };

// export default HomeFilterForm;

"use client";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { Button } from "@/components/ui/button";
import { Home, ChevronDown, MapPin, Bed, Search } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useGetMaxRoundedPriceQuery } from "@/redux/features/property/propertyApi";
import { useGetAllLocationsQuery } from "@/redux/features/location/locationApi";

const HomeFilterForm = () => {
    const router = useRouter();
    const propertyTypeOptions = ["Hotel", "Apartment", "Aparthotel", "Bed & Breakfast", "Hostel", "Guesthouse", "Entire Home", "Room Only", "Student Accommodation", "Unique Stays", "Caravan"];

    // Dynamic locations from API
    const { data: locationsData } = useGetAllLocationsQuery({
        isActive: true,
        limit: 100,
    });
    const locationOptions = locationsData?.data?.map((location: any) => location.name) || [];

    const [locationSearch, setLocationSearch] = useState("");
    const { data: maxPriceData } = useGetMaxRoundedPriceQuery();

    const [filters, setFilters] = useState({
        propertyTypes: [] as string[],
        location: "",
        bedrooms: 1,
        minPrice: 0,
        maxPrice: 3000,
    });

    // Filter locations based on search
    const filteredLocations = locationOptions.filter((location: any) => location.toLowerCase().includes(locationSearch.toLowerCase()));

    const min = 0;
    const max = maxPriceData?.data?.maxRoundedPrice || 3000;

    // Update maxPrice when API data loads
    useEffect(() => {
        if (maxPriceData?.data?.maxRoundedPrice) {
            setFilters((prev) => ({
                ...prev,
                maxPrice: maxPriceData.data.maxRoundedPrice,
            }));
        }
    }, [maxPriceData?.data?.maxRoundedPrice]);

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
        setFilters((prev) => ({
            ...prev,
            propertyTypes: prev.propertyTypes.includes(type) ? prev.propertyTypes.filter((t) => t !== type) : [...prev.propertyTypes, type],
        }));
    };

    // Handle location change
    const handleLocationChange = (location: string) => {
        setFilters((prev) => ({ ...prev, location }));
        setLocationSearch(""); // Clear search when location is selected
    };

    // Handle bedrooms change
    const handleBedroomsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;

        // Allow empty string for clearing the input
        if (value === "") {
            setFilters((prev) => ({
                ...prev,
                bedrooms: 0,
            }));
            return;
        }

        const numValue = parseInt(value);
        if (!isNaN(numValue) && numValue >= 0) {
            setFilters((prev) => ({
                ...prev,
                bedrooms: numValue,
            }));
        }
    };

    // Handle blur to enforce minimum value when user leaves the field
    const handleBedroomsBlur = () => {
        if (filters.bedrooms < 1) {
            setFilters((prev) => ({
                ...prev,
                bedrooms: 1,
            }));
        }
    };

    // Handle search
    const handleSearch = () => {
        const params = new URLSearchParams();

        if (filters.minPrice > 0) params.set("minPrice", filters.minPrice.toString());
        if (filters.maxPrice < 3000) params.set("maxPrice", filters.maxPrice.toString());
        if (filters.propertyTypes.length > 0) params.set("propertyTypes", filters.propertyTypes.join(","));
        if (filters.location) params.set("location", filters.location);
        if (filters.bedrooms > 1) params.set("bedrooms", filters.bedrooms.toString());

        const queryString = params.toString();
        router.push(`/listings${queryString ? `?${queryString}` : ""}`);
    };

    return (
        <div>
            <div className="flex flex-col md:flex-row gap-4 md:w-full mb-10">
                <div className="flex-1">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button className="flex items-center justify-between w-full bg-white text-[#14213D] hover:backdrop-blur-md hover:bg-[#C9A94D]/20 hover:text-white border border-[#C9A94D]">
                                <Home className="w-4 h-4" />
                                {filters.propertyTypes.length === 0 ? "Property Type" : filters.propertyTypes.length === 1 ? filters.propertyTypes[0] : `${filters.propertyTypes.length} Selected`}
                                <ChevronDown className="w-4 h-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-64 bg-white border border-[#C9A94D] z-50 p-0">
                            {propertyTypeOptions.map((option, i) => (
                                <label key={i} className="flex rounded-[6px] items-center gap-2 p-2 border-b border-[#C9A94D] last:border-b-0 cursor-pointer hover:bg-gray-100">
                                    <input type="checkbox" checked={filters.propertyTypes.includes(option)} onChange={() => handlePropertyTypeChange(option)} className="hidden" />
                                    <div className={`w-5 h-5 border rounded-xs border-[#C9A94D] flex items-center justify-center transition-all ${filters.propertyTypes.includes(option) ? "" : "bg-transparent"}`}>{filters.propertyTypes.includes(option) && <div className="w-[14px] h-[14px] bg-[#C9A94D] rounded-xs" />}</div>
                                    <span>{option}</span>
                                </label>
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
                        <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)] bg-white border border-[#C9A94D] z-50 p-0 max-h-60 overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-[#C9A94D] [&::-webkit-scrollbar-thumb]:rounded-full">
                            {/* Search inside dropdown - matching your design */}
                            <div className="p-1 border-b border-[#C9A94D] bg-white">
                                <div className="relative">
                                    <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#14213D]" />
                                    <Input placeholder="Search locations..." value={locationSearch} onChange={(e) => setLocationSearch(e.target.value)} className="pl-8 w-full text-sm border-0 focus:ring-0 focus:outline-none focus-visible:ring-0 bg-white text-[#14213D] placeholder:text-[#14213D]" />
                                </div>
                            </div>

                            {filteredLocations.length === 0 ? (
                                <div className="p-2 text-center text-[#14213D] border-b border-[#C9A94D] last:border-b-0">No locations found</div>
                            ) : (
                                filteredLocations.map((option: any, i: any) => (
                                    <DropdownMenuItem key={i} className="border-b border-[#C9A94D] last:border-b-0 justify-center cursor-pointer text-center text-[#14213D] hover:bg-[#C9A94D]/20 focus:bg-[#C9A94D]/20 focus:text-[#14213D]" onClick={() => handleLocationChange(option)}>
                                        {option}
                                    </DropdownMenuItem>
                                ))
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                {/* Bedrooms Number Input */}
                <div className="flex-1">
                    <div className="relative group">
                        <Input
                            type="number"
                            value={filters.bedrooms === 0 ? "" : filters.bedrooms}
                            onChange={handleBedroomsChange}
                            onBlur={handleBedroomsBlur}
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
