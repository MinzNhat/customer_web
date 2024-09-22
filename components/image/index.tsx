import React, { useRef, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { IoMdClose } from "react-icons/io";
import { Button } from "@nextui-org/react";
import Image from 'next/image'

interface ImageViewProps {
    onClose: () => void;
    url: string;
}

const ImageView: React.FC<ImageViewProps> = ({ onClose, url }) => {
    const notificationRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(true);

    const handleAnimationComplete = () => {
        if (!isVisible) {
            onClose();
        }
    };

    const handleClose = () => {
        setIsVisible(false);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
                handleClose();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [onClose]);
    return (
        <motion.div
            className={`fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-black bg-opacity-10 z-50 p-4 sm:p-8 lg:p-14`}
            initial={{ opacity: 0 }}
            animate={{ opacity: isVisible ? 1 : 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            style={{
                backdropFilter: "blur(6px)",
            }}
            onAnimationComplete={handleAnimationComplete}
        >
            <motion.div
                ref={notificationRef}
                className={`relative w-full h-full bg-white dark:bg-[#242526] rounded-xl p-2 flex flex-col`}
                initial={{ scale: 0 }}
                animate={{ scale: isVisible ? 1 : 0 }}
                exit={{ scale: 0 }}
                transition={{ duration: 0.5 }}
            >
                <button
                    className="absolute text-[#000000] dark:text-white right-6 top-6 w-8 h-8 rounded-full mb-2 z-30 bg-white dark:bg-[#242526] shadow flex justify-center place-items-center"
                    onClick={handleClose}
                >
                    <IoMdClose className="w-5/6 h-5/6 text-[#000000] dark:text-white" />
                </button>
                <div className="w-full h-full relative flex flex-col dark:bg-[#3A3B3C] bg-gray-200 px-2 py-2 rounded-md gap-1">
                    <Image
                        src={url}
                        alt={`Image full`}
                        width={10000}
                        height={10000}
                        className='h-full w-full rounded-md object-contain'
                    />
                </div>
            </motion.div>
        </motion.div>
    );
};

export default ImageView;