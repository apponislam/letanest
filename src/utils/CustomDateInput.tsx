import React, { forwardRef } from "react";
import { ChevronDown, Calendar } from "lucide-react";

// Define props interface
interface CustomDateInputProps {
    value?: string;
    onClick?: () => void;
    label: string;
}

// Properly type the forwarded ref as HTMLButtonElement
const CustomDateInput = forwardRef<HTMLButtonElement, CustomDateInputProps>(({ value, onClick, label }, ref) => (
    <button type="button" onClick={onClick} ref={ref} className="flex items-center justify-between w-full bg-white text-[#14213D] hover:backdrop-blur-md hover:bg-[#C9A94D]/20 hover:text-white border border-[#C9A94D] rounded-lg px-3 py-2">
        <Calendar className="w-4 h-4" />
        {value || label}
        <ChevronDown className="w-4 h-4" />
    </button>
));

// Give a display name to satisfy ESLint
CustomDateInput.displayName = "CustomDateInput";

export default CustomDateInput;
