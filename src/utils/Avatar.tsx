"use client";

import React, { forwardRef } from "react";
import Image from "next/image";

interface AvatarProps {
    name: string;
    profileImg?: string;
    size?: number;
}

// Forward ref for compatibility with DropdownMenuTrigger
const Avatar = forwardRef<HTMLDivElement, AvatarProps>(({ name, profileImg, size = 40 }, ref) => {
    const initials = name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase();

    const imageUrl = profileImg ? `${process.env.NEXT_PUBLIC_BASE_API}${profileImg}` : null;

    return imageUrl ? (
        <div ref={ref} className="relative rounded-full overflow-hidden" style={{ width: size, height: size }}>
            <Image src={imageUrl} alt={name} fill style={{ objectFit: "cover" }} className="rounded-full h-[30px] w-[30px]" />
        </div>
    ) : (
        <div ref={ref} className="rounded-full bg-[#C9A94D] flex items-center justify-center text-white font-semibold select-none" style={{ width: size, height: size }}>
            {initials}
        </div>
    );
});

Avatar.displayName = "Avatar";

export default Avatar;
