'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { BsGlobe } from 'react-icons/bs';
import Dropdown from '../dropdown';

const LanguageSwitcher = ({ message, animation, animation2, className }: { message?: string, animation?: string, animation2?: string, className?: string }) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const initialLocale = searchParams.get('locale') || 'vi';
    const [locale, setLocale] = useState(initialLocale);
    const [dropdownOpen, setDropdownOpen] = useState(true);

    useEffect(() => {
        const newSearchParams = new URLSearchParams(Array.from(searchParams.entries()));
        newSearchParams.set('locale', locale);
        const newPath = `${pathname}?${newSearchParams.toString()}`;
        router.push(newPath);
    }, [locale, pathname, router, searchParams]);

    const handleLanguageSwitch = (selectedLocale: string) => {
        setLocale(selectedLocale);
    };

    return (
        <Dropdown
            animation={animation ? animation : "origin-top transition-all duration-300 ease-in-out"}
            button={
                <button onClick={() => setDropdownOpen(true)} className={className}>
                    <BsGlobe className={message ? message : `h-4 w-4 text-gray-600 dark:text-white`} />
                </button>
            }
            className={`py-2 w-max ${dropdownOpen ? (animation2 ? animation2 : "top-8 -left-[80px]") : "hidden"}`} // Adjust dropdown position and visibility
        >
            <div className="flex w-44 !z-50 flex-col justify-start rounded-[20px] bg-white bg-cover bg-no-repeat shadow-xl shadow-shadow-500 dark:!bg-[#242526] dark:text-white dark:shadow-none">
                <div className="p-3.5">
                    <div className="flex flex-col gap-2">
                        {/* Option 1: English */}
                        <button
                            onClick={() => handleLanguageSwitch('en')}
                            className="text-sm font-medium text-navy-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg py-1 px-3"
                        >
                            English
                        </button>
                        {/* Option 2: Vietnamese */}
                        <button
                            onClick={() => handleLanguageSwitch('vi')}
                            className="text-sm font-medium text-navy-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg py-1 px-3"
                        >
                            Vietnamese
                        </button>
                    </div>
                </div>
            </div>
        </Dropdown>
    );
};

export default LanguageSwitcher;
