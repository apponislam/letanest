"use client";
import React, { useState } from "react";
import { useGetPaymentMethodsQuery, useSetDefaultPaymentMethodMutation, useDeletePaymentMethodMutation, useCreatePaymentMethodMutation } from "@/redux/features/paymentMethod/paymentMethodApi";
import { useAlertModal } from "@/hooks/use-alert-modal";
import { AlertModal } from "@/components/alert-modal";
import PageHeader from "@/components/PageHeader";
import { Loader2, Plus, Trash2, Star, CreditCard, X } from "lucide-react";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const PaymentMethodsPage = () => {
    const { modalState, showError, showSuccess, showWarning, closeAlert } = useAlertModal();
    const { data, isLoading, refetch } = useGetPaymentMethodsQuery();
    const [setDefaultPaymentMethod, { isLoading: settingDefault }] = useSetDefaultPaymentMethodMutation();
    const [deletePaymentMethod, { isLoading: deleting }] = useDeletePaymentMethodMutation();

    const [showAddForm, setShowAddForm] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const paymentMethods = data?.data || [];

    const handleSetDefault = async (paymentMethodId: string) => {
        try {
            await setDefaultPaymentMethod(paymentMethodId).unwrap();
            showSuccess("Success", "Default payment method updated successfully");
            refetch();
        } catch (error: any) {
            showError("Error", error?.data?.message || "Failed to set default payment method");
        }
    };

    const handleDelete = async (paymentMethodId: string) => {
        setDeletingId(paymentMethodId);
        try {
            await deletePaymentMethod(paymentMethodId).unwrap();
            showSuccess("Success", "Payment method deleted successfully");
            refetch();
        } catch (error: any) {
            showError("Error", error?.data?.message || "Failed to delete payment method");
        } finally {
            setDeletingId(null);
        }
    };

    const confirmDelete = (paymentMethod: any) => {
        showWarning("Delete Payment Method", `Are you sure you want to delete your ${paymentMethod.brand} card ending in ${paymentMethod.last4}?`, () => handleDelete(paymentMethod._id), "Delete");
    };

    const getCardIcon = (brand: string) => {
        const brandLower = brand.toLowerCase();
        if (brandLower.includes("visa")) return "VISA";
        if (brandLower.includes("mastercard")) return "MC";
        if (brandLower.includes("amex") || brandLower.includes("american express")) return "AMEX";
        if (brandLower.includes("discover")) return "DISC";
        return brand.substring(0, 4).toUpperCase();
    };

    const getCardColor = (brand: string) => {
        const brandLower = brand.toLowerCase();
        if (brandLower.includes("visa")) return "bg-blue-600";
        if (brandLower.includes("mastercard")) return "bg-red-600";
        if (brandLower.includes("amex") || brandLower.includes("american express")) return "bg-green-600";
        if (brandLower.includes("discover")) return "bg-orange-600";
        return "bg-gray-600";
    };

    if (isLoading) {
        return (
            <div className="container mx-auto py-8">
                <div className="flex justify-center items-center min-h-64">
                    <Loader2 className="w-8 h-8 animate-spin text-[#C9A94D]" />
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="container mx-auto py-8">
                <div className="mx-4 md:mx-0">
                    <PageHeader title="Payment Methods" />

                    <div className="max-w-4xl mx-auto">
                        {/* Add New Card Button */}
                        <div className="mb-8">
                            <button onClick={() => setShowAddForm(true)} className="flex items-center gap-2 bg-[#C9A94D] text-white px-6 py-3 rounded-lg hover:bg-[#af8d28] transition-all font-medium">
                                <Plus className="w-5 h-5" />
                                Add New Card
                            </button>
                        </div>

                        {/* Payment Methods List */}
                        <div className="space-y-4">
                            {paymentMethods.length === 0 ? (
                                <div className="text-center py-12 bg-[#2D3546] rounded-lg">
                                    <CreditCard className="w-16 h-16 text-[#C9A94D] mx-auto mb-4" />
                                    <h3 className="text-xl font-semibold text-white mb-2">No payment methods</h3>
                                    <p className="text-[#E6D7AD] mb-6">You haven't added any payment methods yet.</p>
                                    <button onClick={() => setShowAddForm(true)} className="bg-[#C9A94D] text-white px-6 py-2 rounded-lg hover:bg-[#af8d28] transition-all">
                                        Add Your First Card
                                    </button>
                                </div>
                            ) : (
                                paymentMethods.map((card) => (
                                    <div key={card._id} className={`bg-[#2D3546] rounded-lg p-6 border-2 transition-all ${card.isDefault ? "border-[#C9A94D] bg-[#C9A94D]/10" : "border-transparent hover:border-[#C9A94D]/50"}`}>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-4">
                                                {/* Card Brand Icon */}
                                                <div className={`w-12 h-8 rounded flex items-center justify-center text-white text-xs font-bold ${getCardColor(card.brand)}`}>{getCardIcon(card.brand)}</div>

                                                {/* Card Details */}
                                                <div>
                                                    <div className="flex items-center space-x-2 mb-1">
                                                        <span className="text-white font-medium">
                                                            {card.brand} •••• {card.last4}
                                                        </span>
                                                        {card.isDefault && (
                                                            <span className="bg-[#C9A94D] text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                                                                <Star className="w-3 h-3 fill-current" />
                                                                Default
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-[#E6D7AD] text-sm">
                                                        Expires: {card.exp_month.toString().padStart(2, "0")}/{card.exp_year}
                                                    </p>
                                                    <p className="text-[#E6D7AD] text-xs mt-1">Added: {new Date(card.createdAt).toLocaleDateString()}</p>
                                                </div>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex items-center space-x-3">
                                                {!card.isDefault && (
                                                    <button onClick={() => handleSetDefault(card._id)} disabled={settingDefault} className="text-[#C9A94D] hover:text-[#af8d28] transition-all disabled:opacity-50 flex items-center gap-1 text-sm font-medium">
                                                        <Star className="w-4 h-4" />
                                                        Set Default
                                                    </button>
                                                )}

                                                <button onClick={() => confirmDelete(card)} disabled={deletingId === card._id} className="text-red-400 hover:text-red-300 transition-all disabled:opacity-50 flex items-center gap-1 text-sm font-medium">
                                                    {deletingId === card._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Security Notice */}
                        {paymentMethods.length > 0 && (
                            <div className="mt-8 p-4 bg-[#2D3546] rounded-lg border border-[#C9A94D]">
                                <div className="flex items-start space-x-3">
                                    <div className="w-6 h-6 bg-[#C9A94D] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <span className="text-white text-xs font-bold">i</span>
                                    </div>
                                    <div>
                                        <h4 className="text-white font-semibold mb-1">Security Information</h4>
                                        <p className="text-[#E6D7AD] text-sm">Your payment information is securely stored and encrypted. We use Stripe, a PCI-compliant payment processor, to ensure your data is always protected.</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Add Payment Method Modal with Stripe Integration */}
            {showAddForm && (
                <Elements stripe={stripePromise}>
                    <AddPaymentMethodModal
                        onClose={() => setShowAddForm(false)}
                        onSuccess={() => {
                            setShowAddForm(false);
                            refetch();
                            showSuccess("Success", "Payment method added successfully");
                        }}
                    />
                </Elements>
            )}

            <AlertModal isOpen={modalState.isOpen} onClose={closeAlert} title={modalState.title} description={modalState.description} type={modalState.type} confirmText={modalState.confirmText} onConfirm={modalState.onConfirm} cancelText={modalState.cancelText} isLoading={modalState.isLoading} />
        </>
    );
};

// Add Payment Method Modal Component with Stripe Integration
const AddPaymentMethodModal: React.FC<{
    onClose: () => void;
    onSuccess: () => void;
}> = ({ onClose, onSuccess }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [createPaymentMethod, { isLoading }] = useCreatePaymentMethodMutation();

    const [cardError, setCardError] = useState("");
    const [nameOnCard, setNameOnCard] = useState("");
    const [email, setEmail] = useState("");

    const cardElementOptions = {
        style: {
            base: {
                fontSize: "16px",
                color: "#E6D7AD",
                fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
                fontSmoothing: "antialiased",
                "::placeholder": {
                    color: "#E6D7AD",
                    opacity: 0.7,
                },
                backgroundColor: "transparent",
            },
            invalid: {
                color: "#ff7b7b",
                iconColor: "#ff7b7b",
            },
        },
        hidePostalCode: true,
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setCardError("");

        if (!stripe || !elements) {
            setCardError("Stripe has not been properly initialized");
            return;
        }

        if (!nameOnCard.trim()) {
            setCardError("Name on card is required");
            return;
        }

        if (!email.trim()) {
            setCardError("Email is required");
            return;
        }

        try {
            const cardElement = elements.getElement(CardElement);
            if (!cardElement) {
                throw new Error("Card element not found");
            }

            // Create Stripe PaymentMethod
            const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
                type: "card",
                card: cardElement,
                billing_details: {
                    name: nameOnCard,
                    email: email,
                },
            });

            if (stripeError) {
                setCardError(stripeError.message || "Failed to process card details");
                return;
            }

            if (!paymentMethod) {
                setCardError("Failed to create payment method");
                return;
            }

            console.log("Created Stripe PaymentMethod:", paymentMethod.id);

            // Save to backend using the actual Stripe PaymentMethod ID
            await createPaymentMethod({
                paymentMethodId: paymentMethod.id, // Use the actual Stripe ID
                isDefault: true, // Or implement logic to check if it's the first card
            }).unwrap();

            // Clear form
            cardElement.clear();
            setNameOnCard("");
            setEmail("");

            onSuccess();
        } catch (error: any) {
            console.error("Error creating payment method:", error);
            const errorMessage = error?.data?.message || error?.message || "Failed to add payment method";
            setCardError(errorMessage);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-[#2D3546] rounded-lg max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-white">Add New Card</h3>
                    <button onClick={onClose} className="text-[#E6D7AD] hover:text-white transition-all p-1 rounded">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Billing Details */}
                    <div className="pb-2">
                        <h4 className="text-[#C9A94D] font-medium mb-4">Billing Details</h4>

                        {/* Email */}
                        <div>
                            <label className="block mb-2 text-[#C9A94D] font-medium">Email</label>
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-[#1a202c] border border-[#C9A94D] rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#C9A94D] placeholder-[#E6D7AD]" placeholder="Enter your email" required />
                        </div>
                    </div>

                    {/* Card Information */}
                    <div className="border-b border-[#C9A94D] pb-2">
                        {/* <h4 className="text-[#C9A94D] font-medium mb-4">Card Information</h4> */}

                        {/* Card Number (Stripe Element) */}
                        <div className="mb-4">
                            <label className="block mb-2 text-[#C9A94D] font-medium">Card Number</label>
                            <div className="rounded-lg border border-[#C9A94D] bg-[#1a202c] px-3 py-3">
                                <CardElement options={cardElementOptions} />
                            </div>
                            <p className="text-xs text-[#E6D7AD] mt-1 opacity-70">Enter your 16-digit card number</p>
                        </div>

                        {/* Name on Card */}
                        <div className="mb-4">
                            <label className="block mb-2 text-[#C9A94D] font-medium">Name on Card</label>
                            <input type="text" value={nameOnCard} onChange={(e) => setNameOnCard(e.target.value)} className="w-full bg-[#1a202c] border border-[#C9A94D] rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#C9A94D] placeholder-[#E6D7AD]" placeholder="Enter name as shown on card" required />
                        </div>
                    </div>

                    {/* Error Message */}
                    {cardError && <div className="bg-red-900/20 border border-red-500 text-red-200 px-4 py-3 rounded-lg">{cardError}</div>}

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4">
                        <button type="button" onClick={onClose} className="flex-1 bg-transparent border border-[#C9A94D] text-[#C9A94D] py-3 rounded-lg hover:bg-[#C9A94D] hover:text-white transition-all font-medium" disabled={isLoading}>
                            Cancel
                        </button>
                        <button type="submit" disabled={!stripe || isLoading} className="flex-1 bg-[#C9A94D] text-white py-3 rounded-lg hover:bg-[#af8d28] transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed">
                            {isLoading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Adding...
                                </span>
                            ) : (
                                "Add Card"
                            )}
                        </button>
                    </div>

                    {/* Security Notice */}
                    <div className="text-center pt-4">
                        <p className="text-xs text-[#E6D7AD] opacity-70">🔒 Your card details are securely processed by Stripe</p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PaymentMethodsPage;
