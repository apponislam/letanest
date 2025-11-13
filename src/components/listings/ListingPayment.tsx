"use client";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { Switch } from "@/components/ui/switch";
import PageHeader from "../PageHeader";
import PaymentMethodForm from "../forms/pay/PaymentMethodForm";
import { useGetPaymentMethodsQuery } from "@/redux/features/paymentMethod/paymentMethodApi";
import { useGetMessageByIdQuery } from "@/redux/features/messages/messageApi";
import { format } from "date-fns";
import { useConfirmPaymentMutation, useCreatePaymentMutation } from "@/redux/features/propertyPayment/propertyPaymentApi";
import { useAlertModal } from "@/hooks/use-alert-modal";
import { AlertModal } from "../alert-modal";

const ListingPayment = () => {
    const { modalState, showError, showSuccess, showWarning, closeAlert } = useAlertModal();
    const [selected, setSelected] = useState<string | null>(null);
    const [showRules, setShowRules] = useState(false);
    const [showAddForm, setShowAddForm] = useState(false);
    const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
    const params = useParams();
    const router = useRouter();
    const { id } = params;

    // Get real message data
    const { data: messageData, isLoading: messageLoading } = useGetMessageByIdQuery(id as string);
    const { data, refetch: refetchPaymentMethods } = useGetPaymentMethodsQuery();

    // ✅ Change this line - set enabled to true by default
    const [enabled, setEnabled] = useState(true); // Changed from false to true

    // Auto-select default card when data loads
    useEffect(() => {
        if (data?.data && data.data.length > 0) {
            const defaultCard = data.data.find((card: any) => card.isDefault);
            if (defaultCard) {
                setSelectedCardId(defaultCard._id);
            } else {
                // If no default card, select the first one
                setSelectedCardId(data.data[0]._id);
            }
        }
    }, [data]);

    console.log(messageData);

    const property = messageData?.data?.propertyId;
    const agreedFee = messageData?.data?.agreedFee ? parseInt(messageData.data.agreedFee) : 0;
    const bookingFee = messageData?.data?.bookingFee ? parseInt(messageData.data.bookingFee) : 0;
    const peaceOfMindFee = 5;

    const checkIn = messageData?.data?.checkInDate ? new Date(messageData.data.checkInDate) : null;
    const checkOut = messageData?.data?.checkOutDate ? new Date(messageData.data.checkOutDate) : null;

    const formattedDates = checkIn && checkOut ? `${format(checkIn, "MMM d")} - ${format(checkOut, "MMM d")}` : "N/A";

    const total = useMemo(() => {
        return agreedFee + bookingFee + (enabled ? peaceOfMindFee : 0);
    }, [agreedFee, bookingFee, enabled]);

    // Check if user has any saved cards
    const hasCards = data?.data && data.data.length > 0;

    const [createPayment, { isLoading }] = useCreatePaymentMutation();
    const [confirmPayment, { isLoading: confirming }] = useConfirmPaymentMutation();

    // Payment handler function
    const handleCheckout = async () => {
        if (!selectedCardId) {
            showWarning("Payment Required", "Please select a card to proceed with checkout");
            return;
        }

        try {
            // Find the selected card to get the Stripe paymentMethodId
            const selectedCard = data?.data?.find((card: any) => card._id === selectedCardId);

            if (!selectedCard?.paymentMethodId) {
                showError("Card Error", "Selected card not found or missing Stripe payment method ID");
                return;
            }

            const stripePaymentMethodId = selectedCard.paymentMethodId;

            // 1️⃣ Create payment
            const paymentResponse = await createPayment({
                agreedFee,
                bookingFee,
                extraFee: enabled ? peaceOfMindFee : 0, // This will now include the £5 since enabled is true by default
                totalAmount: total,
                propertyId: property._id,
                conversationId: messageData.data.conversationId,
                messageId: messageData.data._id,
                checkInDate: messageData.data.checkInDate,
                checkOutDate: messageData.data.checkOutDate,
            }).unwrap();

            if (!paymentResponse.success || !paymentResponse.data) {
                showError("Payment Failed", paymentResponse.message || "Payment creation failed");
                return;
            }

            console.log("Payment creation response:", paymentResponse);

            const paymentIntentId = paymentResponse.data.paymentIntentId;
            const clientSecret = paymentResponse.data.clientSecret;

            if (!paymentIntentId) {
                showError("Payment Error", "Missing payment information from server");
                return;
            }

            // 2️⃣ Confirm payment with the actual Stripe paymentMethodId
            const confirmResponse = await confirmPayment({
                paymentIntentId,
                paymentMethodId: stripePaymentMethodId,
            }).unwrap();

            if (confirmResponse.success) {
                showSuccess("Payment Successful", "Your payment has been confirmed successfully!", () => {
                    console.log("Confirmed payment:", confirmResponse.data);
                    router.push("/messages");
                });
            } else {
                showError("Payment Failed", confirmResponse.message || "Payment confirmation failed");
            }
        } catch (error: any) {
            showError("Payment Failed", error?.data?.message || error.message || "Payment failed. Please try again.");
        }
    };

    if (messageLoading) return <p>Loading...</p>;
    if (!property) return <p>Loading...</p>;

    return (
        <>
            <div className="container mx-auto">
                <div className="mx-4 md:mx-0">
                    <PageHeader title={"Listing Payment"}></PageHeader>
                    <div className="text-[#C9A94D]">
                        <div className="max-w-[466px] bg-[#2D3546] mb-6 py-3 md:py-5 px-4 md:px-14 rounded-[12px] mx-auto">
                            <h1 className="font-bold text-center mb-2 text-[18px]">Nest Offer</h1>
                            <div className="flex items-center justify-center mb-2">
                                <Image alt="Property id" src="/listing/pay/home-roof.png" height={24} width={24}></Image>
                                <p>Property ID : {property.propertyNumber}</p>
                            </div>
                            <div className="flex flex-col gap-2 font-bold text-[18px]">
                                <div className="flex items-center justify-between ">
                                    <h1>Agreed dates</h1>
                                    <h1>{formattedDates}</h1>
                                </div>
                                <div className="flex items-center justify-between ">
                                    <h1>Agreed Fee</h1>
                                    <h1>£{agreedFee}</h1>
                                </div>
                                <div className="flex items-center justify-between">
                                    <h1>Booking Fee</h1>
                                    <h1>£{bookingFee}</h1>
                                </div>
                                {/* ✅ This section will now always show since enabled is true by default */}
                                <div className="flex items-center justify-between">
                                    <h1>Peace of Mind Guarantee</h1>
                                    <h1>£{peaceOfMindFee}</h1>
                                </div>
                                <div className="flex items-center justify-between">
                                    <h1>Total</h1>
                                    <h1>£{total}</h1>
                                </div>
                            </div>
                        </div>

                        <div className=" bg-[#2D3546] mb-6 p-[10px] rounded-[8px]">
                            <div className="flex md:items-center justify-between mb-8 flex-col md:flex-row gap-3">
                                <div className="flex items-center gap-3">
                                    <Image alt="Property id" src="/listing/pay/shield.png" height={32} width={32} className="w-8 h-8"></Image>
                                    <div>
                                        <div className="flex items-center gap-5">
                                            <h1 className="text-[18px] font-bold">Peace of Mind Guarantee +£{peaceOfMindFee}</h1>
                                            <div className="relative" onMouseEnter={() => setShowRules(true)} onMouseLeave={() => setShowRules(false)} onClick={() => setShowRules(!showRules)}>
                                                <Image alt="Info" src="/listing/pay/info-circle.png" height={24} width={24} className="cursor-pointer w-6" />

                                                {showRules && (
                                                    <div className="absolute right-0 md:left-1/2 top-0 md:top-full z-50 mt-2 w-64 md:w-[520px] bg-[#14213D] text-white text-sm p-6 rounded-[10px] shadow-lg -translate-x-0 md:-translate-x-1/2 border border-[#C9A94D]">
                                                        <h2 className="font-bold mb-2 text-[14px]">Peace of Mind Guarantee</h2>
                                                        <p className="mb-2">Book your stay with confidence! For just £5 per booking, our Peace of Mind Guarantee ensures you're protected if anything goes wrong.</p>

                                                        <h3 className="font-semibold mb-1 text-[13px]">What's Covered:</h3>
                                                        <ol className="list-decimal list-outside ml-4 mb-2 text-[13px] space-y-1">
                                                            <li>Host Cancellation - We'll help you rebook a similar property or provide a full refund.</li>
                                                            <li>Denied Access - Assistance and compensation if you can't access the property.</li>
                                                            <li>Fraudulent Listings - Refund and help to find a safe alternative.</li>
                                                            <li>Last-Minute Issues - Quick help for cancellations or problems.</li>
                                                        </ol>

                                                        <h3 className="font-semibold mb-1 text-[13px]">How It Works:</h3>
                                                        <ul className="list-disc list-outside text-[13px] ml-4">
                                                            <li>Add the Peace of Mind Guarantee for £5 when confirming your booking.</li>
                                                            <li>Contact us immediately if an issue arises-we handle refunds or rebooking.</li>
                                                            <li>Valid only for bookings made through our platform.</li>
                                                        </ul>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <p>Protect your booking with comprehensive coverage</p>
                                    </div>
                                </div>
                                <div>
                                    {/* ✅ Switch will now be checked by default */}
                                    <Switch checked={enabled} onCheckedChange={setEnabled} className="scale-110 p-1 h-auto w-10 bg-[#626A7D]" />
                                </div>
                            </div>
                            {/* ✅ This section will now always show since enabled is true by default */}
                            <div className="flex bg-[#626A7D] rounded-[8px] px-5 py-2 gap-5 flex-col md:flex-row">
                                <Image alt="Property id" src="/listing/pay/shield.png" height={24} width={24}></Image>
                                <p className="text-black">Peace of Mind Guarantee added to your booking</p>
                            </div>
                        </div>

                        {/* ... rest of your JSX remains the same ... */}
                        <div className="rounded-[4px] border border-[#C9A94D] p-5 mb-20">
                            <div>
                                <h1 className="text-center font-medium text-xl md:text-3xl mb-8 py-3 border-b border-[#414652]">Payment Method</h1>
                            </div>
                            <div className="bg-[#FAF6ED] px-5 py-3 rounded-[12px]">
                                <div className="flex items-center gap-3">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <span className="w-5 h-5 rounded-full border-2 border-black flex items-center justify-center">{selected === "debit" && <span className="w-3 h-3 rounded-full bg-black"></span>}</span>
                                        <h1 className=" md:text-[24px] font-bold text-black ">Debit/Credit Card</h1>
                                        <input type="radio" name="payment" className="hidden" value="debit" checked={selected === "debit"} onChange={() => setSelected("debit")} />
                                    </label>
                                </div>
                                <p className="text-[#090D15] mt-2 text-[14px] md:text-[16px]">
                                    Safe payment Online Credit card needed. Stripe <br className="hidden md:block" /> account needed{" "}
                                </p>
                            </div>
                        </div>

                        {selected && (
                            <div className="flex items-center gap-4 flex-col md:flex-row">
                                <div className="max-w-[540px] w-full bg-[#2D3546] mb-6 p-5 mx-auto">
                                    {hasCards && !showAddForm ? (
                                        <div className="space-y-4">
                                            <div className="space-y-3">
                                                {data.data.map((card: any) => (
                                                    <div key={card._id} className={`border rounded-lg p-4 cursor-pointer transition-all ${selectedCardId === card._id ? "border-[#C9A94D] bg-[#C9A94D]/20 border-2" : card.isDefault ? "border-[#C9A94D] bg-[#C9A94D]/10" : "border-[#E6D7AD] hover:border-[#C9A94D]"}`} onClick={() => setSelectedCardId(card._id)}>
                                                        <div className="flex justify-between items-center">
                                                            <div className="flex items-center space-x-3">
                                                                <div className="flex items-center">
                                                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedCardId === card._id ? "border-[#C9A94D]" : "border-[#E6D7AD]"}`}>{selectedCardId === card._id && <div className="w-2.5 h-2.5 rounded-full bg-[#C9A94D]"></div>}</div>
                                                                </div>

                                                                <div className="w-10 h-7 bg-white rounded flex items-center justify-center">
                                                                    {card.brand.toLowerCase() === "visa" && <span className="text-blue-600 font-bold text-xs">VISA</span>}
                                                                    {card.brand.toLowerCase() === "mastercard" && <span className="text-red-600 font-bold text-xs">MC</span>}
                                                                    {!["visa", "mastercard"].includes(card.brand.toLowerCase()) && <span className="text-gray-600 font-bold text-xs">{card.brand}</span>}
                                                                </div>
                                                                <div>
                                                                    <div className="flex items-center space-x-2">
                                                                        <span className="text-[#E6D7AD] font-medium">
                                                                            {card.brand} •••• {card.last4}
                                                                        </span>
                                                                        {card.isDefault && <span className="bg-[#C9A94D] text-white text-xs px-2 py-1 rounded">Default</span>}
                                                                    </div>
                                                                    <p className="text-[#E6D7AD] text-sm">
                                                                        Expires: {card.exp_month.toString().padStart(2, "0")}/{card.exp_year}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="flex gap-3">
                                                <button onClick={() => setShowAddForm(true)} className="flex-1 bg-transparent border border-[#C9A94D] text-[#C9A94D] py-2 px-4 rounded-lg hover:bg-[#C9A94D] hover:text-white transition-all font-medium">
                                                    Add New Card
                                                </button>

                                                <button onClick={handleCheckout} disabled={!selectedCardId || isLoading} className="flex-1 bg-[#C9A94D] text-white py-2 px-4 rounded-lg hover:bg-[#af8d28] transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed">
                                                    {isLoading ? "Processing..." : "Check Out"}
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div>
                                            <PaymentMethodForm
                                                onSuccess={() => {
                                                    setShowAddForm(false);
                                                    refetchPaymentMethods();
                                                }}
                                                onCancel={hasCards ? () => setShowAddForm(false) : undefined}
                                                showCheckout={!hasCards}
                                                paymentData={
                                                    !hasCards
                                                        ? {
                                                              agreedFee,
                                                              bookingFee,
                                                              extraFee: enabled ? peaceOfMindFee : 0, // This will now include £5 by default
                                                              totalAmount: total,
                                                              propertyId: property._id,
                                                              conversationId: messageData.data.conversationId,
                                                              messageId: messageData.data._id,
                                                              checkInDate: messageData.data.checkInDate,
                                                              checkOutDate: messageData.data.checkOutDate,
                                                          }
                                                        : undefined
                                                }
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                    <AlertModal isOpen={modalState.isOpen} onClose={closeAlert} title={modalState.title} description={modalState.description} type={modalState.type} confirmText={modalState.confirmText} onConfirm={modalState.onConfirm} cancelText={modalState.cancelText} isLoading={modalState.isLoading} />
                </div>
            </div>
        </>
    );
};

export default ListingPayment;
