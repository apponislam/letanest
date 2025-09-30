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

    return profileImg ? (
        <div ref={ref} className="relative rounded-full overflow-hidden" style={{ width: size, height: size }}>
            <Image src={profileImg} alt={name} fill style={{ objectFit: "cover" }} className="rounded-full" />
        </div>
    ) : (
        <div ref={ref} className="rounded-full bg-[#C9A94D] flex items-center justify-center text-white font-semibold select-none" style={{ width: size, height: size }}>
            {initials}
        </div>
    );
});

Avatar.displayName = "Avatar";

export default Avatar;
