import { Star } from "lucide-react";

const SingleStarRating = ({ rating }: { rating: number }) => {
    // rating is out of 5 → convert to percentage (0–100)
    const percentage = Math.min((rating / 5) * 100, 100);

    return (
        <div className="relative w-10 h-10">
            {/* outline star */}
            <Star className="absolute w-10 h-10 text-gray-300" />

            {/* filled part */}
            <div className="absolute top-0 left-0 h-full overflow-hidden" style={{ width: `${percentage}%` }}>
                <Star className="w-10 h-10 text-[#D4BA71] fill-[#D4BA71]" />
            </div>
        </div>
    );
};

export default SingleStarRating;
