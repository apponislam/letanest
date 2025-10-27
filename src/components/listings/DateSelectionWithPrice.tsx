import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { format, differenceInDays } from "date-fns";
import { useState } from "react";
import { DateRange } from "react-day-picker";

interface DateSelectionWithPriceProps {
    property: {
        price: number;
        availableFrom: string;
        availableTo: string;
    };
    onDateSelect?: (dates: DateRange | undefined) => void;
}

const DateSelectionWithPrice = ({ property, onDateSelect }: DateSelectionWithPriceProps) => {
    const [selectedDate, setSelectedDate] = useState<DateRange | undefined>();

    const handleDateSelect = (date: DateRange | undefined) => {
        setSelectedDate(date);
        if (onDateSelect) {
            onDateSelect(date);
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
                        disabled={{
                            before: new Date(property.availableFrom),
                            after: new Date(property.availableTo),
                        }}
                    />
                </PopoverContent>
            </Popover>

            <p className="text-xs mt-1">
                Available: {new Date(property.availableFrom).toLocaleDateString()} - {new Date(property.availableTo).toLocaleDateString()}
            </p>

            {/* Price Display */}
            {selectedDate?.from && selectedDate?.to && (
                <div className="mt-4 p-3 bg-gray-100 rounded-lg">
                    <div className="flex justify-between text-sm">
                        <span>
                            £{property.price} × {getNumberOfNights()} nights
                        </span>
                        <span className="font-bold">£{calculateTotalPrice()}</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DateSelectionWithPrice;
