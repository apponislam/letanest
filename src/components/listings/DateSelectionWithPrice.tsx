import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CalendarIcon, Check, X } from "lucide-react";
import { format, differenceInDays } from "date-fns";
import { useState } from "react";
import { DateRange } from "react-day-picker";

interface DateSelectionWithPriceProps {
    property: {
        price: number;
        availableFrom: string;
        availableTo: string;
        calendarEnabled?: boolean;
    };
    onDateSelect?: (dates: DateRange | undefined) => void;
    onGuestNumberChange?: (guestNumber: number) => void;
}

const DateSelectionWithPrice = ({ property, onDateSelect, onGuestNumberChange }: DateSelectionWithPriceProps) => {
    const [selectedDate, setSelectedDate] = useState<DateRange | undefined>();
    const [tempDate, setTempDate] = useState<DateRange | undefined>();
    const [guestNumber, setGuestNumber] = useState<number>(1);
    const [isOpen, setIsOpen] = useState(false);

    const handleDateSelect = (date: DateRange | undefined) => {
        setTempDate(date);
    };

    const handleConfirmDates = () => {
        setSelectedDate(tempDate);
        setIsOpen(false);
        if (onDateSelect) {
            onDateSelect(tempDate);
        }
    };

    const handleCancelSelection = () => {
        setTempDate(selectedDate);
        setIsOpen(false);
    };

    const handleClearDates = () => {
        setSelectedDate(undefined);
        setTempDate(undefined);
        if (onDateSelect) {
            onDateSelect(undefined);
        }
    };

    const handleGuestNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value) || 1;
        setGuestNumber(value);
        if (onGuestNumberChange) {
            onGuestNumberChange(value);
        }
    };

    const calculateTotalPrice = () => {
        if (!selectedDate?.from || !selectedDate?.to) return 0;
        const nights = differenceInDays(selectedDate.to, selectedDate.from) + 1;
        return nights * property.price;
    };

    const getNumberOfNights = () => {
        if (!selectedDate?.from || !selectedDate?.to) return 0;
        return differenceInDays(selectedDate.to, selectedDate.from) + 1;
    };

    const formatDateRange = (date: DateRange | undefined) => {
        if (!date?.from) return "Pick your dates";
        if (!date?.to) return format(date.from, "LLL dd, y");
        return `${format(date.from, "LLL dd, y")} - ${format(date.to, "LLL dd, y")}`;
    };

    return (
        <div className="mb-6">
            <p className="text-sm font-bold mb-2">Select Dates</p>

            <Popover open={isOpen} onOpenChange={setIsOpen}>
                <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formatDateRange(selectedDate)}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <div className="flex flex-col">
                        <Calendar
                            mode="range"
                            selected={tempDate}
                            onSelect={handleDateSelect}
                            numberOfMonths={1}
                            disabled={{ before: new Date() }}
                            // disabled={{
                            //     before: new Date(property.availableFrom),
                            //     after: new Date(property.availableTo),
                            // }}
                        />
                        <div className="flex justify-end gap-2 p-3 border-t">
                            <Button variant="outline" size="sm" onClick={handleCancelSelection}>
                                <X className="h-4 w-4 mr-1" />
                                Cancel
                            </Button>
                            <Button size="sm" onClick={handleConfirmDates} disabled={!tempDate?.from || !tempDate?.to}>
                                <Check className="h-4 w-4 mr-1" />
                                Confirm
                            </Button>
                        </div>
                    </div>
                </PopoverContent>
            </Popover>

            {selectedDate && (
                <div className="mt-2 flex items-center justify-between">
                    <span className="text-sm text-green-600">✓ Dates selected</span>
                    <Button variant="ghost" size="sm" onClick={handleClearDates} className="h-6 px-2 text-xs text-red-600 hover:text-red-700 hover:bg-red-50">
                        Clear
                    </Button>
                </div>
            )}

            <p className={`text-xs mt-2 font-medium ${property?.calendarEnabled ? "text-green-600" : "text-red-600"}`}>{property?.calendarEnabled ? "Host Accepting Bookings" : "Host Not Accepting Bookings"}</p>

            {/* Guest Number Input */}
            <div className="mt-3">
                <p className="mb-2 text-xs">Guests</p>
                <Input
                    type="number"
                    min="1"
                    max="20"
                    value={guestNumber}
                    onChange={(e) => {
                        const value = e.target.value;
                        // Just update the display value immediately
                        setGuestNumber(parseInt(value) || 0);
                    }}
                    onBlur={(e) => {
                        const value = parseInt(e.target.value);
                        // Validate on blur only
                        if (isNaN(value) || value < 1) {
                            setGuestNumber(1);
                            if (onGuestNumberChange) onGuestNumberChange(1);
                        } else if (value > 20) {
                            setGuestNumber(20);
                            if (onGuestNumberChange) onGuestNumberChange(20);
                        } else {
                            if (onGuestNumberChange) onGuestNumberChange(value);
                        }
                    }}
                    placeholder="Enter number of guests (1-20)"
                    className="w-full text-[#14213D] border-[#C9A94D] placeholder:text-[#14213D] focus:ring-[#C9A94D] focus:border-[#C9A94D]"
                />
            </div>

            {/* Price Display */}
            {selectedDate?.from && selectedDate?.to && (
                <div className="mt-4 p-3 bg-gray-100 rounded-lg">
                    <div className="flex justify-between text-sm">
                        <span>
                            £{property.price} × {getNumberOfNights()} nights
                        </span>
                        <span className="font-bold">£{calculateTotalPrice()}</span>
                    </div>
                    <div className="flex justify-between text-sm mt-1">
                        <span>Guests:</span>
                        <span className="font-bold">{guestNumber}</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DateSelectionWithPrice;
