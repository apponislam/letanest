import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Users, PoundSterling } from "lucide-react";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";

const SuggestNewOfferModal = ({ message, isOpen, onClose, onSend, isSending }: { message: any; isOpen: boolean; onClose: () => void; onSend: (data: any) => void; isSending: boolean }) => {
    const [selectedDate, setSelectedDate] = useState<DateRange | undefined>();
    const [calculatedPrice, setCalculatedPrice] = useState<number>(0);
    const [guestNumber, setGuestNumber] = useState<number>(1);

    // Calculate nights INCLUDING both start and end dates
    const calculateNights = (checkIn: Date, checkOut: Date) => {
        // Count each day from check-in to check-out as a night
        const timeDiff = checkOut.getTime() - checkIn.getTime();
        const daysDiff = timeDiff / (1000 * 60 * 60 * 24);
        return Math.ceil(daysDiff); // This gives 3 for Nov 01-Nov 04
    };

    // But we need 4 nights for Nov 01-Nov 04, so let's add 1
    const calculateNightsInclusive = (checkIn: Date, checkOut: Date) => {
        const timeDiff = checkOut.getTime() - checkIn.getTime();
        const daysDiff = timeDiff / (1000 * 60 * 60 * 24);
        return Math.ceil(daysDiff) + 1; // Add 1 to include both start and end dates
    };

    // Get the ACTUAL price per night from original offer
    const getActualPricePerNight = () => {
        const originalCheckIn = new Date(message.checkInDate);
        const originalCheckOut = new Date(message.checkOutDate);
        const originalNights = calculateNightsInclusive(originalCheckIn, originalCheckOut);
        return message.agreedFee / originalNights;
    };

    // Initialize form data when modal opens
    useEffect(() => {
        if (isOpen && message) {
            const checkIn = new Date(message.checkInDate);
            const checkOut = new Date(message.checkOutDate);

            setSelectedDate({
                from: checkIn,
                to: checkOut,
            });
            setGuestNumber(parseInt(message.guestNo) || 1);

            // Set initial price to match original offer
            setCalculatedPrice(message.agreedFee);
        }
    }, [isOpen, message]);

    // Calculate price using INCLUSIVE night calculation
    const calculateTotalPrice = () => {
        if (!selectedDate?.from || !selectedDate?.to) return 0;

        const nights = calculateNightsInclusive(selectedDate.from, selectedDate.to);
        const actualPricePerNight = getActualPricePerNight();

        return nights * actualPricePerNight;
    };

    const getNumberOfNights = () => {
        if (!selectedDate?.from || !selectedDate?.to) return 0;
        return calculateNightsInclusive(selectedDate.from, selectedDate.to);
    };

    // Update calculated price when dates change
    useEffect(() => {
        if (selectedDate?.from && selectedDate?.to) {
            const newPrice = calculateTotalPrice();
            setCalculatedPrice(newPrice);
        }
    }, [selectedDate]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedDate?.from || !selectedDate?.to) {
            alert("Please select check-in and check-out dates");
            return;
        }

        onSend({
            agreedFee: calculatedPrice,
            checkInDate: selectedDate.from.toISOString(),
            checkOutDate: selectedDate.to.toISOString(),
            guestNo: guestNumber.toString(),
            propertyId: message.propertyId._id,
        });
    };

    const getOriginalNights = () => {
        const checkIn = new Date(message.checkInDate);
        const checkOut = new Date(message.checkOutDate);
        return calculateNightsInclusive(checkIn, checkOut);
    };

    if (!isOpen) return null;

    const originalNights = getOriginalNights();
    const newNights = getNumberOfNights();
    const actualPricePerNight = getActualPricePerNight();

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-md shadow-xl">
                {/* Header */}
                <div className="bg-[#14213D] p-4 rounded-t-lg">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-white">Suggest New Offer</h2>
                        <button onClick={onClose} className="text-white hover:text-gray-300 transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                <div className="p-4">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Date Selection */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-[#14213D]">Select Dates</label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" className="w-full justify-start text-left border-[#C9A94D] hover:border-[#B89A45]">
                                        <CalendarIcon className="mr-2 h-4 w-4 text-[#C9A94D]" />
                                        {selectedDate?.from ? (selectedDate.to ? `${format(selectedDate.from, "MMM dd")} - ${format(selectedDate.to, "MMM dd, yyyy")}` : format(selectedDate.from, "MMM dd, yyyy")) : "Select dates"}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar mode="range" selected={selectedDate} onSelect={setSelectedDate} numberOfMonths={1} />
                                </PopoverContent>
                            </Popover>
                        </div>

                        {/* Guest Selection */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-[#14213D]">Number of Guests</label>
                            <div className="relative">
                                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <select value={guestNumber} onChange={(e) => setGuestNumber(parseInt(e.target.value))} className="w-full pl-10 pr-4 py-2 border border-[#C9A94D] rounded-lg focus:ring-2 focus:ring-[#C9A94D] focus:border-[#C9A94D] appearance-none bg-white">
                                    {[1, 2, 3, 4, 5, 6].map((num) => (
                                        <option key={num} value={num}>
                                            {num} {num === 1 ? "guest" : "guests"}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Price Summary */}
                        {selectedDate?.from && selectedDate?.to && (
                            <div className="bg-[#C9A94D]/10 border border-[#C9A94D] rounded-lg p-3">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-sm font-medium text-[#14213D]">New Total Price</span>
                                    <PoundSterling className="h-4 w-4 text-[#C9A94D]" />
                                </div>
                                <div className="text-xl font-bold text-[#14213D]">£{calculatedPrice}</div>
                                <div className="text-xs text-[#14213D]/70 mt-1">
                                    {newNights} night{newNights !== 1 ? "s" : ""} × £{actualPricePerNight.toFixed(2)}/night
                                </div>
                            </div>
                        )}

                        {/* Comparison */}
                        <div className="border-t pt-3 space-y-3">
                            {/* Original Offer */}
                            <div className="text-sm">
                                <h4 className="font-semibold text-[#14213D] mb-2">Original Offer</h4>
                                <div className="grid grid-cols-2 gap-1 text-xs">
                                    <div className="text-gray-600">Dates:</div>
                                    <div className="text-right">
                                        {format(new Date(message.checkInDate), "MMM dd")} - {format(new Date(message.checkOutDate), "MMM dd, yyyy")}
                                    </div>

                                    <div className="text-gray-600">Nights:</div>
                                    <div className="text-right">{originalNights}</div>

                                    <div className="text-gray-600">Price/night:</div>
                                    <div className="text-right">£{actualPricePerNight.toFixed(2)}</div>

                                    <div className="text-gray-600">Guests:</div>
                                    <div className="text-right">{message.guestNo}</div>

                                    <div className="text-gray-600 font-medium">Total:</div>
                                    <div className="text-right font-bold">£{message.agreedFee}</div>
                                </div>
                            </div>

                            {/* New Offer Preview */}
                            {selectedDate?.from && selectedDate?.to && (
                                <div className="text-sm">
                                    <h4 className="font-semibold text-[#14213D] mb-2">New Offer</h4>
                                    <div className="grid grid-cols-2 gap-1 text-xs">
                                        <div className="text-gray-600">Dates:</div>
                                        <div className="text-right">
                                            {format(selectedDate.from, "MMM dd")} - {format(selectedDate.to, "MMM dd, yyyy")}
                                        </div>

                                        <div className="text-gray-600">Nights:</div>
                                        <div className="text-right">{newNights}</div>

                                        <div className="text-gray-600">Price/night:</div>
                                        <div className="text-right">£{actualPricePerNight.toFixed(2)}</div>

                                        <div className="text-gray-600">Guests:</div>
                                        <div className="text-right">{guestNumber}</div>

                                        <div className="text-gray-600 font-medium">Total:</div>
                                        <div className="text-right font-bold text-[#C9A94D]">£{calculatedPrice}</div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2 pt-2">
                            <button type="button" onClick={onClose} className="flex-1 border border-gray-300 text-gray-700 py-2 rounded hover:bg-gray-50 transition-colors text-sm font-medium disabled:opacity-50" disabled={isSending}>
                                Cancel
                            </button>
                            <button type="submit" className="flex-1 bg-[#14213D] text-white py-2 rounded hover:bg-[#1a2a4a] transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed" disabled={isSending || !selectedDate?.from || !selectedDate?.to}>
                                {isSending ? (
                                    <div className="flex items-center justify-center gap-1">
                                        <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Sending...
                                    </div>
                                ) : (
                                    "Send New Offer"
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SuggestNewOfferModal;
