import Image from "next/image";
import Link from "next/link";
import React from "react";

const Footer = () => {
    return (
        <div className="border-t border-[#C9A94D]">
            <div className="container mx-auto md:my-8 my-4">
                <div className="flex justify-between items-center flex-col md:flex-row gap-4">
                    <p className="text-[#C9A94D] text-center md:text-left">Copyright LETA NEST 2024. All rights reserved.</p>
                    <div className="flex items-center gap-3">
                        <Link href="/" target="_blank">
                            <Image src="/footer/Twitter.png" alt="Twitter" width={26} height={26}></Image>
                        </Link>
                        <Link href="/" target="_blank">
                            <Image src="/footer/Linkedin.png" alt="Twitter" width={26} height={26}></Image>
                        </Link>
                        <Link href="/" target="_blank">
                            <Image src="/footer/Facebook.png" alt="Twitter" width={26} height={26}></Image>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Footer;
