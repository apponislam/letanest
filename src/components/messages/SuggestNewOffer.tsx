import { useState, useEffect } from "react";
import { PoundSterling, Calendar, Users } from "lucide-react";
import { format } from "date-fns";

const SuggestNewOfferModal = ({ message, isOpen, onClose, onSend, isSending }: { message: any; isOpen: boolean; onClose: () => void; onSend: (data: any) => void; isSending: boolean }) => {
    const [newPrice, setNewPrice] = useState<number>(0);

    useEffect(() => {
        if (isOpen && message) {
            setNewPrice(message.agreedFee);
        }
    }, [isOpen, message]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        onSend({
            agreedFee: newPrice,
            // checkInDate: message.checkInDate,
            // checkOutDate: message.checkOutDate,
            // guestNo: message.guestNo,
            // propertyId: message.propertyId._id,
        });
    };

    if (!isOpen) return null;

    const originalCheckIn = new Date(message.checkInDate);
    const originalCheckOut = new Date(message.checkOutDate);
    const nights = Math.ceil((originalCheckOut.getTime() - originalCheckIn.getTime()) / (1000 * 60 * 60 * 24));
    const priceDifference = newPrice - message.agreedFee;
    const priceChangePercent = ((priceDifference / message.agreedFee) * 100).toFixed(1);

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-md shadow-xl">
                <div className="bg-[#14213D] p-4 rounded-t-lg">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-white">Suggest New Price</h2>
                        <button onClick={onClose} className="text-white hover:text-gray-300">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                <div className="p-4">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Dates Display */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-[#14213D]">Booking Dates</label>
                            <div className="flex items-center gap-3 p-3 border border-[#C9A94D] rounded-lg">
                                <Calendar className="h-4 w-4 text-[#C9A94D]" />
                                <div className="text-sm">
                                    <div className="font-medium">
                                        {format(originalCheckIn, "MMM dd, yyyy")} - {format(originalCheckOut, "MMM dd, yyyy")}
                                    </div>
                                    <div className="text-xs text-gray-600">
                                        {nights} night{nights !== 1 ? "s" : ""}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Guests Display */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-[#14213D]">Number of Guests</label>
                            <div className="flex items-center gap-3 p-3 border border-[#C9A94D] rounded-lg">
                                <Users className="h-4 w-4 text-[#C9A94D]" />
                                <div className="text-sm font-medium">
                                    {message.guestNo} {message.guestNo === "1" ? "guest" : "guests"}
                                </div>
                            </div>
                        </div>

                        {/* Price Input */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-[#14213D]">New Total Price</label>
                            <div className="relative">
                                <PoundSterling className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input type="number" value={newPrice} onChange={(e) => setNewPrice(parseFloat(e.target.value) || 0)} className="w-full pl-10 pr-4 py-2 border border-[#C9A94D] rounded-lg focus:ring-2 focus:ring-[#C9A94D] focus:border-[#C9A94D] text-lg font-semibold" min="0" step="0.01" />
                            </div>
                        </div>

                        {/* Price Summary */}
                        <div className="bg-[#C9A94D]/10 border border-[#C9A94D] rounded-lg p-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-[#14213D]">New Total Price</span>
                                <span className="text-xl font-bold text-[#14213D]">£{newPrice.toFixed(2)}</span>
                            </div>
                        </div>

                        {/* Comparison */}
                        <div className="border-t pt-3">
                            <div className="text-sm">
                                <h4 className="font-semibold text-[#14213D] mb-2">Price Change</h4>
                                <div className="grid grid-cols-2 gap-2 text-xs">
                                    <div className="text-gray-600">Original:</div>
                                    <div className="text-right font-bold">£{message.agreedFee}</div>

                                    <div className="text-gray-600">New:</div>
                                    <div className="text-right font-bold text-[#C9A94D]">£{newPrice.toFixed(2)}</div>

                                    <div className="text-gray-600">Difference:</div>
                                    <div className={`text-right font-bold ${priceDifference > 0 ? "text-green-600" : priceDifference < 0 ? "text-red-600" : "text-gray-600"}`}>
                                        {priceDifference > 0 ? "+" : ""}£{Math.abs(priceDifference).toFixed(2)}
                                    </div>

                                    <div className="text-gray-600">Change:</div>
                                    <div className={`text-right font-bold ${priceDifference > 0 ? "text-green-600" : priceDifference < 0 ? "text-red-600" : "text-gray-600"}`}>
                                        {priceDifference > 0 ? "+" : ""}
                                        {priceChangePercent}%
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2 pt-2">
                            <button type="button" onClick={onClose} className="flex-1 border border-gray-300 text-gray-700 py-2 rounded hover:bg-gray-50 text-sm font-medium" disabled={isSending}>
                                Cancel
                            </button>
                            <button type="submit" className="flex-1 bg-[#14213D] text-white py-2 rounded hover:bg-[#1a2a4a] text-sm font-medium disabled:opacity-50" disabled={isSending || newPrice === message.agreedFee || newPrice <= 0}>
                                {isSending ? "Sending..." : "Send New Price"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SuggestNewOfferModal;
