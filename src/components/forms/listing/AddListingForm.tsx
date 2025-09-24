// "use client";

// import React from "react";
// import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
// import { Controller, useForm } from "react-hook-form";
// import z from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import DatePicker from "react-datepicker";

// const propertySchema = z.object({
//     title: z.string().min(2, "Property title is required"),
//     description: z.string().min(10, "Description is required"),
//     location: z.string().min(2, "Location is required"),
//     postCode: z.string().min(2, "Post code is required"),
//     propertyType: z.string().min(1, "Property type is required"),
// });

// const step2Schema = z.object({
//     maxGuests: z.number().min(1, "At least 1 guest required"),
//     bedrooms: z.number().min(1, "At least 1 bedroom required"),
//     bathrooms: z.number().min(1, "At least 1 bathroom required"),
//     price: z.number().min(0, "Price must be at least 0"),

//     // Dates
//     availableFrom: z.date().refine((val) => val instanceof Date, {
//         message: "Start date is required",
//     }),
//     availableTo: z.date().refine((val) => val instanceof Date, {
//         message: "End date is required",
//     }),

//     amenities: z.array(z.string()),
// });

// const amenitiesList = ["Wifi", "Garden", "Beach Access", "Parking", "Pool", "Smoking Allowed", "Hot Tub", "Pet Friendly", "Balcony", "Towels Included", "Dryer", "Kitchen", "Tv", "Gym", "Lift Access"];

// const AddListingForm = () => {
//     const {
//         register,
//         handleSubmit,
//         formState: { errors },
//     } = useForm({
//         resolver: zodResolver(propertySchema),
//     });

//     const onSubmit = (data: unknown) => {
//         console.log("Form Data:", data);
//     };

//     const onSubmitStep2 = (data: unknown) => {
//         // data contains Step 2 fields: maxGuests, bedrooms, bathrooms, price, availableFrom, availableTo, amenities
//         console.log("Step 2 Data:", data);

//         // You can save it to state to combine with Step 1 data
//         setStep2Data(data);

//         // Move to next tab or next step
//         setActiveTab("step3"); // or however you manage tabs
//     };

//     return (
//         <Tabs defaultValue="step1" className="w-full">
//             {/* Tabs list */}
//             <TabsList className="mb-8 grid gap-3 md:grid-cols-4 grid-cols-2 bg-transparent w-full h-auto">
//                 {/* Step 1 */}
//                 <TabsTrigger
//                     value="step1"
//                     className="flex flex-col items-center justify-center
//                      data-[state=active]:bg-transparent
//                      [&[data-state=active]>div]:bg-[#C9A94D]
//                      [&[data-state=active]>div]:text-white
//                      [&[data-state=active]>p]:text-[#C9A94D]"
//                 >
//                     <div className="flex items-center justify-center bg-[#9399A6] rounded-full w-12 h-12 text-[#B6BAC3]">1</div>
//                     <p className="text-[#B6BAC3] mt-2 text-center">Basic info</p>
//                 </TabsTrigger>

//                 {/* Step 2 */}
//                 <TabsTrigger
//                     value="step2"
//                     className="flex flex-col items-center justify-center
//                      data-[state=active]:bg-transparent
//                      [&[data-state=active]>div]:bg-[#C9A94D]
//                      [&[data-state=active]>div]:text-white
//                      [&[data-state=active]>p]:text-[#C9A94D]"
//                 >
//                     <div className="flex items-center justify-center bg-[#9399A6] rounded-full w-12 h-12 text-[#B6BAC3]">2</div>
//                     <p className="text-[#B6BAC3] mt-2 text-center">Details</p>
//                 </TabsTrigger>

//                 {/* Step 3 */}
//                 <TabsTrigger
//                     value="step3"
//                     className="flex flex-col items-center justify-center
//                      data-[state=active]:bg-transparent
//                      [&[data-state=active]>div]:bg-[#C9A94D]
//                      [&[data-state=active]>div]:text-white
//                      [&[data-state=active]>p]:text-[#C9A94D]"
//                 >
//                     <div className="flex items-center justify-center bg-[#9399A6] rounded-full w-12 h-12 text-[#B6BAC3]">3</div>
//                     <p className="text-[#B6BAC3] mt-2 text-center">Photos</p>
//                 </TabsTrigger>

//                 {/* Step 4 */}
//                 <TabsTrigger
//                     value="step4"
//                     className="flex flex-col items-center justify-center
//                      data-[state=active]:bg-transparent
//                      [&[data-state=active]>div]:bg-[#C9A94D]
//                      [&[data-state=active]>div]:text-white
//                      [&[data-state=active]>p]:text-[#C9A94D]"
//                 >
//                     <div className="flex items-center justify-center bg-[#9399A6] rounded-full w-12 h-12 text-[#B6BAC3]">4</div>
//                     <p className="text-[#B6BAC3] mt-2 text-center">Review</p>
//                 </TabsTrigger>
//             </TabsList>

//             {/* Tabs content */}
//             <TabsContent value="step1" className="text-[#C9A94D] border border-[#C9A94D] p-6 rounded-[20px]">
//                 <h1 className="text-[28px] font-bold mb-2">Basic Information</h1>
//                 <p className="mb-8">Let’s start with the basics about your property</p>
//                 <div>
//                     <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
//                         {/* Property Title */}
//                         <div>
//                             <label className="block text-sm font-medium">Property Title (admin only)</label>
//                             <input type="text" placeholder="e.g. Crozy town" {...register("title")} className="mt-1 block w-full rounded-lg border border-[#C9A94D] p-3 focus:ring-2 focus:ring-[#C9A94D] focus:outline-none" />
//                             {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
//                         </div>

//                         {/* Description */}
//                         <div>
//                             <label className="block text-sm font-medium">Description</label>
//                             <textarea placeholder="e.g. Relax and unwind in our bright, comfortable apartment..." {...register("description")} className="mt-1 block w-full rounded-lg border border-[#C9A94D] p-3 focus:ring-2 focus:ring-[#C9A94D] focus:outline-none" rows={5} />
//                             {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
//                         </div>

//                         {/* Location */}
//                         <div>
//                             <label className="block text-sm font-medium">Location</label>
//                             <input type="text" placeholder="e.g. Edinburgh" {...register("location")} className="mt-1 block w-full rounded-lg border border-[#C9A94D] p-3 focus:ring-2 focus:ring-[#C9A94D] focus:outline-none" />
//                             {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location.message}</p>}
//                         </div>

//                         {/* Post Code */}
//                         <div>
//                             <label className="block text-sm font-medium">Post Code</label>
//                             <input type="text" placeholder="e.g. EH1" {...register("postCode")} className="mt-1 block w-full rounded-lg border border-[#C9A94D] p-3 focus:ring-2 focus:ring-[#C9A94D] focus:outline-none" />
//                             {errors.postCode && <p className="text-red-500 text-sm mt-1">{errors.postCode.message}</p>}
//                         </div>

//                         {/* Property Type */}
//                         <div>
//                             <label className="block text-sm font-medium">Property Type</label>
//                             <select {...register("propertyType")} className="mt-1 block w-full rounded-lg border border-[#C9A94D] p-3 focus:ring-2 focus:ring-[#C9A94D] focus:outline-none">
//                                 <option value="">Select Type</option>
//                                 <option value="House">House</option>
//                                 <option value="Apartment">Apartment</option>
//                                 <option value="Villa">Villa</option>
//                                 <option value="Studio">Studio</option>
//                             </select>
//                             {errors.propertyType && <p className="text-red-500 text-sm mt-1">{errors.propertyType.message}</p>}
//                         </div>

//                         <button type="submit" className="w-full bg-[#C9A94D] text-white py-3 rounded-lg font-semibold hover:bg-[#bfa14a] transition-all">
//                             Submit
//                         </button>
//                     </form>
//                 </div>
//             </TabsContent>

//             <TabsContent value="step2" className="text-[#C9A94D] border border-[#C9A94D] p-6 rounded-[20px]">
//                 <h1 className="text-[28px] font-bold mb-2">Property Details</h1>
//                 <p className="mb-8">Tell us about the capacity and layout</p>
//                 <div>
//                     {/* Step 2 Form */}
//                     <form onSubmit={handleSubmit(onSubmitStep2)} className="space-y-5">
//                         {/* Numeric Inputs */}
//                         <div className="grid grid-cols-3 gap-4">
//                             <div>
//                                 <label className="block text-sm font-medium">Maximum Guests</label>
//                                 <input type="number" {...register("maxGuests", { valueAsNumber: true })} className="mt-1 block w-full rounded-lg border border-[#C9A94D] p-3 focus:ring-2 focus:ring-[#C9A94D] focus:outline-none" />
//                                 {errors.maxGuests && <p className="text-red-500 text-sm mt-1">{errors.maxGuests.message}</p>}
//                             </div>

//                             <div>
//                                 <label className="block text-sm font-medium">Bedrooms</label>
//                                 <input type="number" {...register("bedrooms", { valueAsNumber: true })} className="mt-1 block w-full rounded-lg border border-[#C9A94D] p-3 focus:ring-2 focus:ring-[#C9A94D] focus:outline-none" />
//                                 {errors.bedrooms && <p className="text-red-500 text-sm mt-1">{errors.bedrooms.message}</p>}
//                             </div>

//                             <div>
//                                 <label className="block text-sm font-medium">Bathrooms</label>
//                                 <input type="number" {...register("bathrooms", { valueAsNumber: true })} className="mt-1 block w-full rounded-lg border border-[#C9A94D] p-3 focus:ring-2 focus:ring-[#C9A94D] focus:outline-none" />
//                                 {errors.bathrooms && <p className="text-red-500 text-sm mt-1">{errors.bathrooms.message}</p>}
//                             </div>
//                         </div>

//                         {/* Price */}
//                         <div>
//                             <label className="block text-sm font-medium">Price (Starting From)</label>
//                             <input type="number" {...register("price", { valueAsNumber: true })} className="mt-1 block w-full rounded-lg border border-[#C9A94D] p-3 focus:ring-2 focus:ring-[#C9A94D] focus:outline-none" />
//                             {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>}
//                         </div>

//                         {/* Available Dates */}
//                         <div className="grid grid-cols-2 gap-4">
//                             <div>
//                                 <label className="block text-sm font-medium">From</label>
//                                 <Controller control={control} name="availableFrom" render={({ field }) => <DatePicker placeholderText="Select start date" selected={field.value} onChange={(date) => field.onChange(date)} className="mt-1 block w-full rounded-lg border border-[#C9A94D] p-3 focus:ring-2 focus:ring-[#C9A94D] focus:outline-none" />} />
//                                 {errors.availableFrom && <p className="text-red-500 text-sm mt-1">{errors.availableFrom.message}</p>}
//                             </div>

//                             <div>
//                                 <label className="block text-sm font-medium">To</label>
//                                 <Controller control={control} name="availableTo" render={({ field }) => <DatePicker placeholderText="Select end date" selected={field.value} onChange={(date) => field.onChange(date)} className="mt-1 block w-full rounded-lg border border-[#C9A94D] p-3 focus:ring-2 focus:ring-[#C9A94D] focus:outline-none" />} />
//                                 {errors.availableTo && <p className="text-red-500 text-sm mt-1">{errors.availableTo.message}</p>}
//                             </div>
//                         </div>

//                         {/* Amenities */}
//                         <div>
//                             <label className="block text-sm font-medium mb-2">Amenities</label>
//                             <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto border border-[#C9A94D] rounded-lg p-3">
//                                 {["Wifi", "Garden", "Beach Access", "Parking", "Pool", "Smoking Allowed", "Hot Tub", "Pet Friendly", "Balcony", "Towels Included", "Dryer", "Kitchen", "Tv", "Gym", "Lift Access"].map((amenity) => (
//                                     <label key={amenity} className="flex items-center gap-2">
//                                         <input type="checkbox" value={amenity} {...register("amenities")} className="accent-[#C9A94D]" />
//                                         <span>{amenity}</span>
//                                     </label>
//                                 ))}
//                             </div>
//                             {errors.amenities && <p className="text-red-500 text-sm mt-1">{errors.amenities.message}</p>}
//                         </div>

//                         {/* Navigation Buttons */}
//                         <div className="flex justify-between mt-4">
//                             <button type="button" onClick={onPrevious} className="bg-gray-200 text-gray-700 py-2 px-6 rounded-lg font-semibold hover:bg-gray-300 transition">
//                                 Previous
//                             </button>
//                             <button type="submit" className="bg-[#C9A94D] text-white py-2 px-6 rounded-lg font-semibold hover:bg-[#bfa14a] transition">
//                                 Next
//                             </button>
//                         </div>
//                     </form>
//                 </div>
//             </TabsContent>

//             <TabsContent value="step3" className="text-[#C9A94D] border border-[#C9A94D] p-6 rounded-[20px]">
//                 <h1 className="text-6xl">3rd form</h1>
//             </TabsContent>

//             <TabsContent value="step4" className="text-[#C9A94D] border border-[#C9A94D] p-6 rounded-[20px]">
//                 <h1 className="text-6xl">4th form</h1>
//             </TabsContent>
//         </Tabs>
//     );
// };

// export default AddListingForm;

"use client";

import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// Step 1 schema
const step1Schema = z.object({
    title: z.string().min(2),
    description: z.string().min(10),
    location: z.string().min(2),
    postCode: z.string().min(2),
    propertyType: z.string().min(1),
});

// Step 2 schema
const step2Schema = z.object({
    maxGuests: z.number().min(1),
    bedrooms: z.number().min(1),
    bathrooms: z.number().min(1),
    price: z.number().min(0),
    availableFrom: z.date(),
    availableTo: z.date(),
    amenities: z.array(z.string()),
});

type Step1Data = z.infer<typeof step1Schema>;
type Step2Data = z.infer<typeof step2Schema>;

const amenitiesList = ["Wifi", "Garden", "Beach Access", "Parking", "Pool", "Smoking Allowed", "Hot Tub", "Pet Friendly", "Balcony", "Towels Included", "Dryer", "Kitchen", "Tv", "Gym", "Lift Access"];

const AddListingForm: React.FC = () => {
    const [activeTab, setActiveTab] = useState("step1");
    const [step1Data, setStep1Data] = useState<Step1Data | null>(null);
    const [step2Data, setStep2Data] = useState<Step2Data | null>(null);
    console.log(step2Data);

    const step1Form = useForm<Step1Data>({
        resolver: zodResolver(step1Schema),
        defaultValues: { title: "", description: "", location: "", postCode: "", propertyType: "" },
    });

    const step2Form = useForm<Step2Data>({
        resolver: zodResolver(step2Schema),
        defaultValues: { maxGuests: 1, bedrooms: 1, bathrooms: 1, price: 0, availableFrom: new Date(), availableTo: new Date(), amenities: [] },
    });

    const onSubmitStep1 = (data: Step1Data) => {
        setStep1Data(data);
        setActiveTab("step2");
    };

    const onSubmitStep2 = (data: Step2Data) => {
        setStep2Data(data);
        console.log("Final Data:", { ...step1Data, ...data });
        setActiveTab("step3");
    };

    return (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-8 grid gap-3 md:grid-cols-4 grid-cols-2 bg-transparent w-full h-auto">
                {["Basic info", "Details", "Photos", "Review"].map((label, i) => (
                    <TabsTrigger key={i} value={`step${i + 1}`} className="flex flex-col items-center justify-center data-[state=active]:bg-transparent [&[data-state=active]>div]:bg-[#C9A94D] [&[data-state=active]>div]:text-white [&[data-state=active]>p]:text-[#C9A94D]">
                        <div className="flex items-center justify-center bg-[#9399A6] rounded-full w-12 h-12 text-[#B6BAC3]">{i + 1}</div>
                        <p className="text-[#B6BAC3] mt-2 text-center">{label}</p>
                    </TabsTrigger>
                ))}
            </TabsList>

            {/* Step 1 */}
            <TabsContent value="step1" className="text-[#C9A94D] border border-[#C9A94D] p-6 rounded-[20px]">
                <form onSubmit={step1Form.handleSubmit(onSubmitStep1)} className="space-y-5">
                    {["title", "description", "location", "postCode"].map((field) => (
                        <div key={field}>
                            <label className="block text-sm font-medium">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                            {field === "description" ? (
                                <textarea {...step1Form.register(field as keyof Step1Data)} rows={5} className="mt-1 block w-full rounded-lg border border-[#C9A94D] p-3 focus:ring-2 focus:ring-[#C9A94D] focus:outline-none" />
                            ) : (
                                <input {...step1Form.register(field as keyof Step1Data)} className="mt-1 block w-full rounded-lg border border-[#C9A94D] p-3 focus:ring-2 focus:ring-[#C9A94D] focus:outline-none" />
                            )}
                            {step1Form.formState.errors[field as keyof Step1Data] && <p className="text-red-500 text-sm mt-1">{step1Form.formState.errors[field as keyof Step1Data]?.message}</p>}
                        </div>
                    ))}
                    <div>
                        <label className="block text-sm font-medium">Property Type</label>
                        <select {...step1Form.register("propertyType")} className="mt-1 block w-full rounded-lg border border-[#C9A94D] p-3 focus:ring-2 focus:ring-[#C9A94D] focus:outline-none">
                            <option value="">Select Type</option>
                            <option value="House">House</option>
                            <option value="Apartment">Apartment</option>
                            <option value="Villa">Villa</option>
                            <option value="Studio">Studio</option>
                        </select>
                        {step1Form.formState.errors.propertyType && <p className="text-red-500 text-sm mt-1">{step1Form.formState.errors.propertyType?.message}</p>}
                    </div>
                    <button type="submit" className="w-full bg-[#C9A94D] text-white py-3 rounded-lg font-semibold hover:bg-[#bfa14a] transition-all">
                        Next
                    </button>
                </form>
            </TabsContent>

            {/* Step 2 */}
            <TabsContent value="step2" className="text-[#C9A94D] border border-[#C9A94D] p-6 rounded-[20px]">
                <form onSubmit={step2Form.handleSubmit(onSubmitStep2)} className="space-y-5">
                    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                        {/* maxGuests */}
                        <div>
                            <label className="block text-sm font-medium">Maximum Guests</label>
                            <input type="number" {...step2Form.register("maxGuests", { valueAsNumber: true })} className="mt-1 block w-full rounded-lg border border-[#C9A94D] p-3 focus:ring-2 focus:ring-[#C9A94D] focus:outline-none" />
                            {step2Form.formState.errors.maxGuests && <p className="text-red-500 text-sm mt-1">{step2Form.formState.errors.maxGuests?.message}</p>}
                        </div>

                        {/* bedrooms */}
                        <div>
                            <label className="block text-sm font-medium">Bedrooms</label>
                            <input type="number" {...step2Form.register("bedrooms", { valueAsNumber: true })} className="mt-1 block w-full rounded-lg border border-[#C9A94D] p-3 focus:ring-2 focus:ring-[#C9A94D] focus:outline-none" />
                            {step2Form.formState.errors.bedrooms && <p className="text-red-500 text-sm mt-1">{step2Form.formState.errors.bedrooms?.message}</p>}
                        </div>

                        {/* bathrooms */}
                        <div>
                            <label className="block text-sm font-medium">Bathrooms</label>
                            <input type="number" {...step2Form.register("bathrooms", { valueAsNumber: true })} className="mt-1 block w-full rounded-lg border border-[#C9A94D] p-3 focus:ring-2 focus:ring-[#C9A94D] focus:outline-none" />
                            {step2Form.formState.errors.bathrooms && <p className="text-red-500 text-sm mt-1">{step2Form.formState.errors.bathrooms?.message}</p>}
                        </div>

                        {/* price */}
                        <div>
                            <label className="block text-sm font-medium">Price (Starting From)</label>
                            <input type="number" {...step2Form.register("price", { valueAsNumber: true })} className="mt-1 block w-full rounded-lg border border-[#C9A94D] p-3 focus:ring-2 focus:ring-[#C9A94D] focus:outline-none" />
                            {step2Form.formState.errors.price && <p className="text-red-500 text-sm mt-1">{step2Form.formState.errors.price?.message}</p>}
                        </div>

                        {/* availableFrom */}
                        <div className="w-full">
                            <label className="block text-sm font-medium mb-1">From</label>
                            <Controller
                                control={step2Form.control}
                                name="availableFrom"
                                render={({ field }) => (
                                    <div className="w-full">
                                        <DatePicker placeholderText="From" selected={field.value} onChange={(date: Date | null) => date && field.onChange(date)} wrapperClassName="w-full" className="w-full mt-1 block rounded-lg border border-[#C9A94D] p-3 focus:ring-2 focus:ring-[#C9A94D] focus:outline-none" />
                                    </div>
                                )}
                            />
                            {step2Form.formState.errors.availableFrom && <p className="text-red-500 text-sm mt-1">{step2Form.formState.errors.availableFrom?.message}</p>}
                        </div>

                        {/* availableTo */}
                        <div className="w-full">
                            <label className="block text-sm font-medium mb-1">To</label>
                            <Controller
                                control={step2Form.control}
                                name="availableTo"
                                render={({ field }) => (
                                    <div className="w-full">
                                        <DatePicker placeholderText="To" selected={field.value} onChange={(date: Date | null) => date && field.onChange(date)} wrapperClassName="w-full" className="w-full mt-1 block rounded-lg border border-[#C9A94D] p-3 focus:ring-2 focus:ring-[#C9A94D] focus:outline-none" />
                                    </div>
                                )}
                            />
                            {step2Form.formState.errors.availableTo && <p className="text-red-500 text-sm mt-1">{step2Form.formState.errors.availableTo?.message}</p>}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Amenities</label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 rounded-lg p-3">
                            {amenitiesList.map((amenity) => (
                                <label key={amenity} className="flex items-center gap-2">
                                    <input type="checkbox" value={amenity} {...step2Form.register("amenities")} className="accent-[#C9A94D]" />
                                    <span>{amenity}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-between mt-4">
                        <button type="button" onClick={() => setActiveTab("step1")} className="bg-[#B6BAC3] text-[#626A7D] py-2 px-6 rounded-lg hover:bg-gray-300 transition">
                            Previous
                        </button>
                        <button type="submit" className="bg-[#C9A94D] text-white py-[10px] px-10 rounded-lg  hover:bg-[#bfa14a] transition">
                            Next
                        </button>
                    </div>
                </form>
            </TabsContent>

            <TabsContent value="step3" className="text-[#C9A94D] border border-[#C9A94D] p-6 rounded-[20px]">
                Step 3 Placeholder
            </TabsContent>
            <TabsContent value="step4" className="text-[#C9A94D] border border-[#C9A94D] p-6 rounded-[20px]">
                Step 4 Placeholder
            </TabsContent>
        </Tabs>
    );
};

export default AddListingForm;
