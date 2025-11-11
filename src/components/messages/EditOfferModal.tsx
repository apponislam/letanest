import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CalendarIcon } from "lucide-react";
import { format, differenceInDays } from "date-fns";
import { DateRange } from "react-day-picker";

const EditOfferModal = ({ message, isOpen, onClose, onSave, isEditing }: { message: any; isOpen: boolean; onClose: () => void; onSave: (data: any) => void; isEditing: boolean }) => {
    const [selectedDate, setSelectedDate] = useState<DateRange | undefined>();
    const [guestNumber, setGuestNumber] = useState<number>(1);

    // Initialize form data when modal opens or message changes
    useEffect(() => {
        if (isOpen && message) {
            setSelectedDate({
                from: message.checkInDate ? new Date(message.checkInDate) : undefined,
                to: message.checkOutDate ? new Date(message.checkOutDate) : undefined,
            });
            setGuestNumber(parseInt(message.guestNo) || 1);
        }
    }, [isOpen, message]);

    // Calculate price based on selected dates and property price
    const calculateTotalPrice = () => {
        if (!selectedDate?.from || !selectedDate?.to || !message?.propertyId?.price) return 0;
        const days = differenceInDays(selectedDate.to, selectedDate.from) + 1;
        return days * message.propertyId.price;
    };

    const getNumberOfNights = () => {
        if (!selectedDate?.from || !selectedDate?.to) return 0;
        return differenceInDays(selectedDate.to, selectedDate.from);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedDate?.from || !selectedDate?.to) {
            alert("Please select check-in and check-out dates");
            return;
        }

        if (guestNumber < 1 || guestNumber > 20) {
            alert("Please enter a valid number of guests (1-20)");
            return;
        }

        onSave({
            agreedFee: calculateTotalPrice(),
            checkInDate: selectedDate.from.toISOString(),
            checkOutDate: selectedDate.to.toISOString(),
            guestNo: guestNumber,
        });
    };

    const handleGuestNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value) || 1;
        setGuestNumber(value);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-md">
                <div className="p-6">
                    <h2 className="text-xl font-bold mb-4">Edit Offer</h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Date Selection */}
                        <div>
                            <label className="block text-sm font-medium mb-1">Select Dates</label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" className="w-full justify-start text-left">
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {selectedDate?.from ? (selectedDate.to ? `${format(selectedDate.from, "LLL dd, y")} - ${format(selectedDate.to, "LLL dd, y")}` : format(selectedDate.from, "LLL dd, y")) : "Pick your dates"}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar mode="range" selected={selectedDate} onSelect={setSelectedDate} numberOfMonths={2} />
                                </PopoverContent>
                            </Popover>
                        </div>

                        {/* Nights Display */}
                        {selectedDate?.from && selectedDate?.to && (
                            <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                                <div className="flex justify-between">
                                    <span>Number of nights:</span>
                                    <span className="font-semibold">
                                        {getNumberOfNights()} night{getNumberOfNights() !== 1 ? "s" : ""}
                                    </span>
                                </div>
                                {message?.propertyId?.price && (
                                    <div className="flex justify-between mt-1">
                                        <span>Price per night:</span>
                                        <span className="font-semibold">£{message.propertyId.price}</span>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Total Price Display (Read-only) */}
                        {selectedDate?.from && selectedDate?.to && message?.propertyId?.price && (
                            <div className="border border-gray-200 rounded p-3 bg-gray-50">
                                <label className="block text-sm font-medium mb-1 text-gray-700">Total Price</label>
                                <div className="text-2xl font-bold text-gray-900">£{calculateTotalPrice()}</div>
                                <p className="text-xs text-gray-500 mt-1">
                                    {getNumberOfNights()} nights × £{message.propertyId.price}
                                </p>
                            </div>
                        )}

                        {/* Number of Guests */}
                        <div>
                            <label className="block text-sm font-medium mb-1">Number of Guests</label>
                            <input
                                type="number"
                                min="1"
                                max="20"
                                value={guestNumber}
                                onChange={handleGuestNumberChange}
                                onBlur={(e) => {
                                    const value = parseInt(e.target.value);
                                    if (value < 1 || value > 20 || isNaN(value) || e.target.value === "") {
                                        setGuestNumber(1);
                                    }
                                }}
                                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#16223D] focus:border-transparent"
                                required
                            />
                        </div>

                        {/* Price Summary */}
                        {selectedDate?.from && selectedDate?.to && message?.propertyId?.price && (
                            <div className="mt-4 p-3 bg-gray-100 rounded-lg">
                                <div className="flex justify-between text-sm">
                                    <span>
                                        £{message.propertyId.price} × {getNumberOfNights()} nights
                                    </span>
                                    <span className="font-bold">£{calculateTotalPrice()}</span>
                                </div>
                                <div className="flex justify-between text-sm mt-1">
                                    <span>Guests:</span>
                                    <span className="font-bold">{guestNumber}</span>
                                </div>
                                <div className="border-t border-gray-300 mt-2 pt-2 flex justify-between text-sm font-semibold">
                                    <span>Total Amount:</span>
                                    <span>£{calculateTotalPrice()}</span>
                                </div>
                            </div>
                        )}

                        {/* Buttons */}
                        <div className="flex gap-3 pt-4">
                            <button type="button" onClick={onClose} className="flex-1 border border-gray-300 text-gray-700 py-2 rounded hover:bg-gray-50 transition-colors disabled:opacity-50" disabled={isEditing}>
                                Cancel
                            </button>
                            <button type="submit" className="flex-1 bg-[#16223D] text-white py-2 rounded hover:bg-[#1a2a4a] transition-colors disabled:opacity-50" disabled={isEditing || !selectedDate?.from || !selectedDate?.to}>
                                {isEditing ? "Updating..." : "Update Offer"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditOfferModal;
