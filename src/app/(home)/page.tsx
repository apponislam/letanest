import FeaturedNests from "@/components/home/FeaturedNests";
import HomeCount from "@/components/home/HomeCount";
import HomeFooter from "@/components/home/HomeFooter";
import HomeReviewClient from "@/components/home/HomeReviewClient";
import TrendingListing from "@/components/home/TrendingListing";
import BookingCards from "@/components/home/BookingCards";
import Heroarea from "@/components/home/Heroarea";
import React from "react";

const page = () => {
    return (
        <>
            <div className="relative -mt-20 md:-mt-46">
                <Heroarea />
            </div>
            <HomeCount />
            <FeaturedNests />
            <BookingCards />
            <TrendingListing />
            <HomeReviewClient />
            <HomeFooter />
        </>
    );
};

export default page;
