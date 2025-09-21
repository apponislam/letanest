import React from "react";
import HomeFilterForm from "../forms/home/Home_filter_form";

const Heroarea = () => {
    return (
        <section className="absolute inset-0 h-[900px] md:min-h-screen md:w-full z-0">
            <div className="absolute inset-0 bg-[url('/herobg.jpg')] bg-cover bg-center z-0" />
            {/* Optional overlay */}
            <div className="absolute inset-0 bg-black/20 z-10" />
            <div className=" container md:mx-auto p-4 relative z-20 min-h-full flex flex-col md:flex-row gap-6 mt-[120px] md:mt-[240px]">
                <div className="md:flex-1">
                    <h1 className="text-[#D4AF37] text-3xl md:text-5xl font-bold mb-5">Short-Term Lets & Festival Stays </h1>
                    <p className="text-white text-xl md:text-3xl">Nest Anywhere with LetANest.</p>
                </div>
                <div className="w-full md:flex-1">
                    <div className="w-full border border-[#C9A94D] py-9 px-5 backdrop-blur-md bg-[#C9A94D]/20">
                        <h1 className="text-center font-semibold mb-3 text-3xl text-[#C9A94D] ">Find A Nest Anywhere</h1>
                        <p className="text-center text-[#C9A94D] mb-10">Your next adventure starts here - find a nest today.</p>
                        <HomeFilterForm></HomeFilterForm>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Heroarea;
