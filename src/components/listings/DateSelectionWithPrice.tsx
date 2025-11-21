import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CalendarIcon } from "lucide-react";
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
    const [guestNumber, setGuestNumber] = useState<number>(1);

    const handleDateSelect = (date: DateRange | undefined) => {
        setSelectedDate(date);
        if (onDateSelect) {
            onDateSelect(date);
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
        const days = differenceInDays(selectedDate.to, selectedDate.from) + 1;
        return days * property.price;
    };

    const getNumberOfNights = () => {
        if (!selectedDate?.from || !selectedDate?.to) return 0;
        return differenceInDays(selectedDate.to, selectedDate.from);
    };

    return (
        <div className="mb-6">
            <p className="text-sm font-bold mb-2">Select Dates</p>

            <Popover>
                <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDate?.from ? (selectedDate.to ? `${format(selectedDate.from, "LLL dd, y")} - ${format(selectedDate.to, "LLL dd, y")}` : format(selectedDate.from, "LLL dd, y")) : "Pick your dates"}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        mode="range"
                        selected={selectedDate}
                        onSelect={handleDateSelect}
                        // disabled={{
                        //     before: new Date(property.availableFrom),
                        //     after: new Date(property.availableTo),
                        // }}
                    />
                </PopoverContent>
            </Popover>

            <p className={`text-xs mt-2 font-medium ${property?.calendarEnabled ? "text-green-600" : "text-red-600"}`}>{property?.calendarEnabled ? "Host Accepting Bookings" : " Host Not Accepting Bookings"}</p>

            {/* Guest Number Input */}
            <div className="mt-3">
                <p className="mb-2 text-xs">Guests</p>
                <Input
                    type="number"
                    min="1"
                    max="20"
                    value={guestNumber}
                    onChange={handleGuestNumberChange}
                    onBlur={(e) => {
                        const value = parseInt(e.target.value);
                        if (value < 1 || value > 20 || isNaN(value) || e.target.value === "") {
                            setGuestNumber(1);
                            if (onGuestNumberChange) {
                                onGuestNumberChange(1);
                            }
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
