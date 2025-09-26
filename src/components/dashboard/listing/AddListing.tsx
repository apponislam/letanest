"use client";
import React from "react";

import AddListingForm from "@/components/forms/listing/AddListingForm";
import PageHeader from "@/components/PageHeader";

const AddListing = () => {
    return (
        <div className="container mx-auto">
            <PageHeader title={"Add Listing"}></PageHeader>
            <div>
                <AddListingForm></AddListingForm>
            </div>
        </div>
    );
};

export default AddListing;
