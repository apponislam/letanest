import React from "react";

const plans = [
    {
        title: "Open Door (Free)",
        description: "Booking Fee: 10% per booking (adjustable anytime)",
        price: "£0/month",
        benefits: ["Browse all homes freely", "Contact hosts after quick signup", "Standard booking with fees", "Leave reviews after stays", "Save favorites in your guest Dashboard"],
    },
    {
        title: "Golden Key (Monthly)",
        description: "Booking Fee: £0 (maximum 4 bookings, no surcharge)",
        price: "£4.99/month",
        benefits: ["No booking fees (unlimited stays)", "Priority host response (subscriber flagged as trusted)", "Priority guest support (fast-track help)", "Cashback/reward credits for future bookings", "Gold Guest Badge (shows you’re a valued guest in the community)"],
    },
    {
        title: "Forever Key (Annual)",
        description: "Booking Fee: £0 unlimited bookings, no surcharge",
        price: "£49.99/month",
        benefits: ['All "Welcome Home" monthly perks', "Annual loyalty bonus (e.g., £25 travel credit)", "Exclusive discounts with local partners (cafés, attractions, services)", "Recognition as a long-term community member", "Gold House Badge (shows you’re a valued guest in the community)", 'Access to "Nest Exclusive" properties (homes only available to premium guests)'],
    },
];

const PlansPage = () => {
    return (
        <div className="text-[#C9A94D]">
            <div className="border border-[#C9A94D] rounded-[20px] p-5">
                <h1 className="text-2xl md:text-[40px] mb-4">Guest Subscriptions (Stayers)</h1>
                <p className=" mb-6">Unlock perks, protection, and peace of mind.</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {plans.map((plan, idx) => (
                        <div key={idx} className="bg-[#2D3546] border border-[#2D3546] hover:bg-transparent hover:border-[#af8d28] p-6 rounded-[16px] flex flex-col justify-between">
                            {/* Plan Header */}
                            <div>
                                <h2 className="text-[18px]  mb-2 text-center">{plan.title}</h2>
                                <p className="mb-4 text-center">{plan.description}</p>
                                <p className="text-[33px] font-bold mb-4 text-center">{plan.price}</p>

                                {/* Benefits */}
                                <ul className="list-disc list-outside ml-4 mb-6 space-y-1 text-[14px]">
                                    {plan.benefits.map((benefit, i) => (
                                        <li key={i}>{benefit}</li>
                                    ))}
                                </ul>
                            </div>

                            {/* Get Started Button */}
                            <button className="bg-transparent text-[#C9A94D] font-bold py-3 rounded-lg hover:bg-[#C9A94D] transition-all border border-[#C9A94D] hover:text-white">Get Started</button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PlansPage;
