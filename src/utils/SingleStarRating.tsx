// import { Star } from "lucide-react";

// const SingleStarRating = ({ rating }: { rating: number }) => {
//     const percentage = Math.min((rating / 5) * 100, 100);

//     return (
//         <div className="relative w-10 h-10">
//             <Star className="absolute w-10 h-10 text-[#D4BA71]" />

//             <div className="absolute top-0 left-0 h-full overflow-hidden" style={{ width: `${percentage}%` }}>
//                 <Star className="w-10 h-10 text-[#D4BA71] fill-[#D4BA71]" />
//             </div>
//         </div>
//     );
// };

// export default SingleStarRating;

import { Star } from "lucide-react";

type SingleStarRatingProps = {
    rating: number;
    size?: number; // optional, default to 40
};

const SingleStarRating = ({ rating, size = 40 }: SingleStarRatingProps) => {
    const percentage = Math.min((rating / 5) * 100, 100);

    return (
        <div className="relative" style={{ width: size, height: size }}>
            <Star className="absolute text-[#D4BA71]" size={size} />

            <div className="absolute top-0 left-0 h-full overflow-hidden" style={{ width: `${percentage}%` }}>
                <Star className="text-[#D4BA71] fill-[#D4BA71]" size={size} />
            </div>
        </div>
    );
};

export default SingleStarRating;
