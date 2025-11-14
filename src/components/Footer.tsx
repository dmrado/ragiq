import React from 'react';
import Image from "next/image";
import Link from "next/link";

const Footer = () => {
    return (
        <footer className="text-gray-600 row-start-3 flex gap-6 flex-wrap items-center justify-center">
            <Link
                className="flex items-center gap-2 hover:underline hover:underline-offset-4"
                href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
                target="_blank"
                rel="noopener noreferrer"
            >
                <Image
                    aria-hidden
                    src="/"
                    alt="File icon"
                    width={16}
                    height={16}
                />
                сылка 1
            </Link>
            <Link
                className="flex items-center gap-2 hover:underline hover:underline-offset-4"
                href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
                target="_blank"
                rel="noopener noreferrer"
            >
                <Image
                    aria-hidden
                    src="/"
                    alt="Window icon"
                    width={16}
                    height={16}
                />
                сылка 2
            </Link>
            <Link
                className="flex items-center gap-2 hover:underline hover:underline-offset-4"
                href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
                target="_blank"
                rel="noopener noreferrer"
            >
                <Image
                    aria-hidden
                    src="/"
                    alt="Globe icon"
                    width={16}
                    height={16}
                />
                Go to сылка 3 →
            </Link>
            {/* Footer */}
            <div className="flex items-center gap-2 hover:underline hover:underline-offset-4">
                © 2025 RAGIQ. Все права защищены.
            </div>
        </footer>
    );
};

export default Footer;