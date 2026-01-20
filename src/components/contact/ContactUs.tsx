"use client";
import Image from "next/image";
import React from "react";
import ContactUsForm from "../forms/contact/contact-us-form";
import PageHeader from "../PageHeader";

const ContactUs = () => {
    return (
        <>
            <div className="container mx-auto">
                <div className="mx-4 md:mx-0">
                    <PageHeader title={"Contact Us"}></PageHeader>

                    <div className="text-[#C9A94D]">
                        <div className="w-full relative mb-6 md:mb-14">
                            <Image src="/contact/contact-head.png" alt="contact us" width={1920} height={600} className="w-full h-40 md:h-auto rounded-[12px]" />
                        </div>
                        <h3 className="text-xl md:text-2xl mb-6 md:mb-14">Get Started</h3>
                        <h1 className="text-2xl md:text-[40px] font-bold mb-6 md:mb-14">Get in touch with us. We&apos;re here to assist you.</h1>

                        <div className="mb-6 md:mb-14">
                            <ContactUsForm></ContactUsForm>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-20">
                            <div>
                                <p className="md:text-[18px] mb-6">Contact Info</p>
                                <h2 className="text-xl md:text-[28px] font-bold">We are always happy to assist you</h2>
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="md:text-[18px] font-bold mb-6">Email Address</h3>
                                    <span className="relative block h-1 w-7 bg-[#C9A94D] mb-6" />
                                    <a href="support@letanest.com" className="md:text-[18px] hover:underline">
                                        support@letanest.com
                                    </a>
                                    <p className="md:text-[18px]">
                                        Assistance hours: <br /> Monday - Friday 8am to 10pm
                                    </p>
                                </div>
                                <div>
                                    <h3 className="md:text-[18px] font-bold mb-6">Number</h3>
                                    <span className="relative block h-1 w-7 bg-[#C9A94D] mb-6" />
                                    <a href="tel:+01312033041" className="md:text-[18px] hover:underline">
                                        0131 203 3041
                                    </a>
                                    <p className="md:text-[18px]">
                                        Assistance hours: <br /> Monday - Friday 9am to 6pm
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ContactUs;
