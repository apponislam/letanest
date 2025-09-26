"use client";

import React from "react";
import * as z from "zod";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import PageHeader from "@/components/PageHeader";
import { X } from "lucide-react";

const subscriptionSchema = z.object({
    title: z.string().min(2, { message: "Title is required" }),
    details: z.string().min(5, { message: "Details are required" }),
    price: z.string().min(1, { message: "Price is required" }),
    duration: z.string().min(1, { message: "Duration is required" }),
    services: z.array(
        z.object({
            name: z.string().min(1, { message: "Service name is required" }),
        })
    ),
});

type SubscriptionFormValues = z.infer<typeof subscriptionSchema>;

const AddMembershipForm = () => {
    const {
        control,
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<SubscriptionFormValues>({
        resolver: zodResolver(subscriptionSchema),
        defaultValues: {
            title: "",
            details: "",
            price: "",
            duration: "",
            services: [{ name: "" }],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "services",
    });

    const onSubmit = (data: SubscriptionFormValues) => {
        // convert price to number here manually
        const processedData = {
            ...data,
            price: Number(data.price),
        };
        console.log("Form Data:", processedData);
        reset();
    };

    return (
        <div className="container mx-auto">
            <PageHeader title={"Add Membership"}></PageHeader>

            <div className="bg-[#2D3546] border border-[#C9A94D] p-4 md:p-9 text-[#C9A94D]">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 w-full md:max-w-96">
                    <h2 className="text-2xl font-bold text-[#C9A94D] mb-4">Add Subscription</h2>

                    <div className="flex flex-col gap-3">
                        <Label htmlFor="title">Title</Label>
                        <Input id="title" placeholder="eg. Home" {...register("title")} className="bg-[#2D3546] border border-[#C9A94D] placeholder:text-[#C9A94D]" />
                        {errors.title && <span className="text-red-500 text-sm">{errors.title.message}</span>}
                    </div>

                    <div className="flex flex-col gap-3">
                        <Label htmlFor="details">Details</Label>
                        <Textarea id="details" placeholder="eg. Home" {...register("details")} className="bg-[#2D3546] border border-[#C9A94D] placeholder:text-[#C9A94D]" />
                        {errors.details && <span className="text-red-500 text-sm">{errors.details.message}</span>}
                    </div>

                    <div className="flex flex-col gap-3">
                        <Label htmlFor="price">Price</Label>
                        <Input type="number" id="price" placeholder="0" {...register("price")} className="bg-[#2D3546] border border-[#C9A94D] placeholder:text-[#C9A94D]" />
                        {errors.price && <span className="text-red-500 text-sm">{errors.price.message}</span>}
                    </div>

                    <div className="flex flex-col gap-3 ">
                        <Label htmlFor="duration">Duration</Label>
                        <Select {...register("duration")}>
                            <SelectTrigger className="bg-[#2D3546] border border-[#C9A94D] w-full placeholder:text-[#C9A94D] text-[#C9A94D]">
                                <SelectValue placeholder="Select duration" className="placeholder:text-[#C9A94D] text-[#C9A94D]" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#2D3546]  border border-[#C9A94D] placeholder:text-[#C9A94D] text-[#C9A94D]">
                                <SelectItem value="1 Month">1 Month</SelectItem>
                                <SelectItem value="3 Months">3 Months</SelectItem>
                                <SelectItem value="6 Months">6 Months</SelectItem>
                                <SelectItem value="12 Months">12 Months</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.duration && <span className="text-red-500 text-sm">{errors.duration.message}</span>}
                    </div>

                    <div className="flex flex-col gap-3 space-y-2">
                        <Label>Services</Label>
                        {fields.map((field, index) => (
                            <div key={field.id} className="flex gap-2">
                                <Input placeholder="eg. Cleaning" {...register(`services.${index}.name` as const)} className="flex-1 bg-[#2D3546] border border-[#C9A94D] placeholder:text-[#C9A94D] text-[#C9A94D]" />
                                <Button variant="destructive" onClick={() => remove(index)}>
                                    <X />
                                </Button>
                            </div>
                        ))}
                        <Button type="button" className="bg-[#C9A94D] hover:bg-[#b8973e] text-white" onClick={() => append({ name: "" })}>
                            Add More
                        </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-4">
                        <Button type="button" onClick={() => reset()} className="w-full bg-[#C9A94D] hover:bg-[#C9A94D]">
                            Reset
                        </Button>
                        <Button type="submit" className="bg-[#14213D] text-white border border-[#C9A94D] hover:bg-[#14213D] w-full">
                            Save
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddMembershipForm;
