"use client";
import React from "react";

import AddListingForm2 from "@/components/forms/listing/AddListingForm2";
import PageHeader from "@/components/PageHeader";

const AddListing = () => {
    return (
        <div className="container mx-auto">
            <PageHeader title={"Add Listing"}></PageHeader>
            <div>
                <AddListingForm2></AddListingForm2>
            </div>
        </div>
    );
};

export default AddListing;
