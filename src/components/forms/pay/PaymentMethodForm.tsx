"use client";

import React, { useState } from "react";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useCreatePaymentMethodMutation } from "@/redux/features/paymentMethod/paymentMethodApi";
import { useConfirmPaymentMutation, useCreatePaymentMutation } from "@/redux/features/propertyPayment/propertyPaymentApi";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

// Payment Form Component
const PaymentFormContent: React.FC<{
    onSuccess?: () => void;
    onCancel?: () => void;
    showCheckout?: boolean;
    paymentData?: any;
}> = ({ onSuccess, onCancel, showCheckout = false, paymentData }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [createPaymentMethod, { isLoading: isSavingCard }] = useCreatePaymentMethodMutation();
    const [createPayment, { isLoading: isCreatingPayment }] = useCreatePaymentMutation();
    const [confirmPayment, { isLoading: isConfirming }] = useConfirmPaymentMutation();

    const [cardError, setCardError] = useState<string>("");
    const [nameOnCard, setNameOnCard] = useState("");
    const [email, setEmail] = useState("");
    const router = useRouter();

    const isLoading = isSavingCard || isCreatingPayment || isConfirming;

    // Handle save card only
    const handleSaveCard = async (event: React.FormEvent) => {
        event.preventDefault();

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

        setCardError("");

        try {
            const cardElement = elements.getElement(CardElement);
            if (!cardElement) {
                throw new Error("Card element not found");
            }

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

            // Save to backend
            await createPaymentMethod({
                paymentMethodId: paymentMethod.id,
                isDefault: true,
            }).unwrap();

            // Clear form
            cardElement.clear();
            setNameOnCard("");
            setEmail("");

            toast.success("Card saved successfully!");
            if (onSuccess) onSuccess();
        } catch (err: any) {
            console.error("Error saving card:", err);
            const errorMessage = err.data?.message || err.message || "Something went wrong. Please try again.";
            setCardError(errorMessage);
        }
    };

    // Handle checkout with current card
    const handleCheckout = async () => {
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

        setCardError("");

        try {
            // Step 1: Create payment method using Stripe Elements
            const cardElement = elements.getElement(CardElement);
            if (!cardElement) {
                throw new Error("Card element not found");
            }

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

            console.log("Created temporary payment method:", paymentMethod.id);

            // Step 2: Create payment intent
            const paymentResponse = await createPayment(paymentData).unwrap();

            if (!paymentResponse.success || !paymentResponse.data) {
                setCardError(paymentResponse.message || "Payment creation failed");
                return;
            }

            const paymentIntentId = paymentResponse.data.paymentIntentId;

            // Step 3: Confirm payment with the temporary payment method
            const confirmResponse = await confirmPayment({
                paymentIntentId,
                paymentMethodId: paymentMethod.id,
            }).unwrap();

            if (confirmResponse.success) {
                router.push("");
                toast.success("Payment completed successfully!");

                // Clear form
                cardElement.clear();
                setNameOnCard("");
                setEmail("");

                // Call success callback
                if (onSuccess) {
                    onSuccess();
                }
            } else {
                setCardError(confirmResponse.message || "Payment confirmation failed");
            }
        } catch (err: any) {
            console.error("Error processing payment:", err);
            const errorMessage = err.data?.message || err.message || "Something went wrong. Please try again.";
            setCardError(errorMessage);
        }
    };

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

    return (
        <form onSubmit={handleSaveCard} className="mx-auto space-y-6 max-w-lg">
            {/* Billing Details Section */}
            <div className="pb-2 mb-0">
                <h3 className="text-[#C9A94D] text-lg font-semibold mb-4">Billing Details</h3>

                {/* Email */}
                <div className="mb-4">
                    <label className="block mb-2 text-[#C9A94D] font-medium">Email</label>
                    <input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} className="rounded-[8px] w-full border border-[#C9A94D] bg-transparent px-3 py-2 text-[#E6D7AD] placeholder-[#E6D7AD] focus:outline-none focus:ring-1 focus:ring-[#C9A94D]" />
                </div>
            </div>

            {/* Card Info Section */}
            <div className="border-b border-[#C9A94D] pb-2 mb-0">
                {/* Card Number (Stripe Element) */}
                <div className="mb-4">
                    <label className="block mb-2 text-[#C9A94D] font-medium">Card Number</label>
                    <div className="rounded-[8px] border border-[#C9A94D] bg-transparent px-3 py-3">
                        <CardElement options={cardElementOptions} />
                    </div>
                    <p className="text-xs text-[#E6D7AD] mt-1 opacity-70">Enter your 16-digit card number</p>
                </div>

                {/* Name on Card */}
                <div className="mb-4">
                    <label className="block mb-2 text-[#C9A94D] font-medium">Name On Card</label>
                    <input type="text" placeholder="Enter name on card" value={nameOnCard} onChange={(e) => setNameOnCard(e.target.value)} className="rounded-[8px] w-full border border-[#C9A94D] bg-transparent px-3 py-2 text-[#E6D7AD] placeholder-[#E6D7AD] focus:outline-none focus:ring-1 focus:ring-[#C9A94D]" />
                </div>
            </div>

            {/* Error Message */}
            {cardError && <div className="bg-red-900/20 border border-red-500 text-red-200 px-4 py-3 my-2 rounded-lg">{cardError}</div>}

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
                <button type="submit" disabled={!stripe || isLoading || !nameOnCard.trim() || !email.trim()} className="flex-1 bg-[#C9A94D] text-white py-3 px-6 rounded-lg hover:bg-[#af8d28] transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium">
                    {isLoading ? "Saving Card..." : "Save Card"}
                </button>

                {showCheckout && (
                    <button type="button" onClick={handleCheckout} disabled={!stripe || isLoading || !nameOnCard.trim() || !email.trim()} className="flex-1 bg-[#C9A94D] text-white py-3 px-6 rounded-lg hover:bg-[#af8d28] transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed">
                        {isLoading ? "Processing..." : "Check Out"}
                    </button>
                )}

                {onCancel && (
                    <button type="button" onClick={onCancel} className="flex-1 bg-transparent border border-[#C9A94D] text-[#C9A94D] py-3 px-6 rounded-lg hover:bg-[#C9A94D] hover:text-white transition-all disabled:opacity-50 font-medium" disabled={isLoading}>
                        Cancel
                    </button>
                )}
            </div>

            {/* Security Notice */}
            <div className="text-center">
                <p className="text-xs text-[#E6D7AD] opacity-70">🔒 Your card details are securely processed by Stripe</p>
            </div>
        </form>
    );
};

// Main Payment Method Form Component
interface PaymentMethodFormProps {
    onSuccess?: () => void;
    onCancel?: () => void;
    showCheckout?: boolean;
    paymentData?: any;
}

const PaymentMethodForm: React.FC<PaymentMethodFormProps> = ({ onSuccess, onCancel, showCheckout = false, paymentData }) => {
    return (
        <Elements stripe={stripePromise}>
            <PaymentFormContent onSuccess={onSuccess} onCancel={onCancel} showCheckout={showCheckout} paymentData={paymentData} />
        </Elements>
    );
};

export default PaymentMethodForm;
