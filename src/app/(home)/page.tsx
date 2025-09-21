import FeaturedNests from "@/components/forms/home/FeaturedNests";
import HomeCount from "@/components/forms/home/HomeCount";
import HomeFooter from "@/components/forms/home/HomeFooter";
import HomeReviewClient from "@/components/forms/home/HomeReviewClient";
import TrendingListing from "@/components/forms/home/TrendingListing";
import BookingCards from "@/components/home/BookingCards";
import Heroarea from "@/components/home/Heroarea";
import React from "react";

const page = () => {
    return (
        <>
            <Heroarea></Heroarea>

            <main className="relative z-10 mt-[900px] md:mt-[100vh]">
                <HomeCount></HomeCount>
                <FeaturedNests></FeaturedNests>
                <BookingCards></BookingCards>
                <TrendingListing></TrendingListing>
                <HomeReviewClient></HomeReviewClient>
                <HomeFooter></HomeFooter>
            </main>
        </>
    );
};

export default page;
