"use client";

import React, { useState } from "react";
// import { useGetPaymentMethodsQuery, useDeletePaymentMethodMutation, useSetDefaultPaymentMethodMutation } from "@/redux/api/paymentMethod.api";
import PaymentMethodForm from "./PaymentMethodForm";
import { useGetPaymentMethodsQuery, useDeletePaymentMethodMutation, useSetDefaultPaymentMethodMutation } from "@/redux/features/paymentMethod/paymentMethodApi";

const PaymentMethodsList: React.FC = () => {
    const { data: paymentMethodsData, isLoading, error, refetch } = useGetPaymentMethodsQuery();
    const [deletePaymentMethod] = useDeletePaymentMethodMutation();
    const [setDefaultPaymentMethod] = useSetDefaultPaymentMethodMutation();

    const [showAddForm, setShowAddForm] = useState(false);

    const handleDelete = async (paymentMethodId: string) => {
        if (window.confirm("Are you sure you want to delete this card?")) {
            try {
                await deletePaymentMethod(paymentMethodId).unwrap();
                refetch();
            } catch (error) {
                console.error("Failed to delete payment method:", error);
                alert("Failed to delete card. Please try again.");
            }
        }
    };

    const handleSetDefault = async (paymentMethodId: string) => {
        try {
            await setDefaultPaymentMethod(paymentMethodId).unwrap();
            refetch();
        } catch (error) {
            console.error("Failed to set default payment method:", error);
            alert("Failed to set default card. Please try again.");
        }
    };

    const handleAddSuccess = () => {
        setShowAddForm(false);
        refetch();
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-8">
                <div className="text-[#E6D7AD]">Loading payment methods...</div>
            </div>
        );
    }

    if (error) {
        return <div className="bg-red-900/20 border border-red-500 text-red-200 px-4 py-3 rounded-lg">Error loading payment methods</div>;
    }

    const paymentMethods = paymentMethodsData?.data || [];

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-[#E6D7AD]">Payment Methods</h2>
                {!showAddForm && (
                    <button onClick={() => setShowAddForm(true)} className="bg-[#C9A94D] text-white py-2 px-6 rounded-lg hover:bg-[#af8d28] transition-all font-medium">
                        Add Card
                    </button>
                )}
            </div>

            {/* Add Card Form */}
            {showAddForm && (
                <div className="border border-[#C9A94D] rounded-lg p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-[#C9A94D]">Add New Card</h3>
                        <button onClick={() => setShowAddForm(false)} className="text-[#C9A94D] hover:text-[#af8d28] transition-all">
                            Cancel
                        </button>
                    </div>
                    <PaymentMethodForm onSuccess={handleAddSuccess} onCancel={() => setShowAddForm(false)} />
                </div>
            )}

            {/* Cards List */}
            {paymentMethods.length === 0 ? (
                <div className="text-center py-8 border border-[#C9A94D] rounded-lg">
                    <p className="text-[#E6D7AD] mb-4">No payment methods found</p>
                    {!showAddForm && (
                        <button onClick={() => setShowAddForm(true)} className="bg-[#C9A94D] text-white py-2 px-6 rounded-lg hover:bg-[#af8d28] transition-all font-medium">
                            Add Your First Card
                        </button>
                    )}
                </div>
            ) : (
                <div className="grid gap-4">
                    {paymentMethods.map((card) => (
                        <div key={card._id} className={`border rounded-lg p-4 ${card.isDefault ? "border-[#C9A94D] bg-[#C9A94D]/10" : "border-[#E6D7AD]"}`}>
                            <div className="flex justify-between items-start">
                                <div className="flex items-center space-x-4">
                                    {/* Card Brand Icon */}
                                    <div className="w-12 h-8 bg-white rounded flex items-center justify-center">
                                        {card.brand.toLowerCase() === "visa" && <span className="text-blue-600 font-bold text-sm">VISA</span>}
                                        {card.brand.toLowerCase() === "mastercard" && <span className="text-red-600 font-bold text-sm">MC</span>}
                                        {card.brand.toLowerCase() === "amex" && <span className="text-blue-500 font-bold text-sm">AMEX</span>}
                                        {!["visa", "mastercard", "amex"].includes(card.brand.toLowerCase()) && <span className="text-gray-600 font-bold text-sm">{card.brand}</span>}
                                    </div>

                                    <div>
                                        <div className="flex items-center space-x-2">
                                            <span className="text-[#E6D7AD] font-medium">
                                                {card.brand.charAt(0).toUpperCase() + card.brand.slice(1)} •••• {card.last4}
                                            </span>
                                            {card.isDefault && <span className="bg-[#C9A94D] text-white text-xs px-2 py-1 rounded">Default</span>}
                                        </div>
                                        <p className="text-[#E6D7AD] text-sm">
                                            Expires: {card.exp_month.toString().padStart(2, "0")}/{card.exp_year}
                                        </p>
                                        <p className="text-[#E6D7AD] text-xs">Added: {new Date(card.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>

                                <div className="flex space-x-2">
                                    {/* Set as Default Button */}
                                    {!card.isDefault && (
                                        <button onClick={() => handleSetDefault(card._id)} className="text-[#C9A94D] hover:text-[#af8d28] text-sm font-medium">
                                            Set as Default
                                        </button>
                                    )}

                                    {/* Delete Button */}
                                    <button onClick={() => handleDelete(card._id)} className="text-red-400 hover:text-red-300 text-sm font-medium">
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Security Notice */}
            <div className="text-center pt-4">
                <p className="text-xs text-[#E6D7AD] opacity-70">🔒 Your payment information is securely stored and processed by Stripe</p>
            </div>
        </div>
    );
};

export default PaymentMethodsList;
