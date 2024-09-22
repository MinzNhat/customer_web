import { useState } from "react";
import Carousel from "react-multi-carousel";
import Image from 'next/image';
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { MdRadioButtonChecked, MdRadioButtonUnchecked } from "react-icons/md";
import { Button } from "@nextui-org/react";
import ImageView from "../image";

interface CarouselSliderProps {
    urls: string[];
}

export function CarouselSlider({ urls }: CarouselSliderProps) {
    const [urlState, setUrlState] = useState<string>("");
    const [openModal, setIsOpenModal] = useState(false);

    const handleOpenImgClick = (url: string) => {
        setUrlState(url);
        setIsOpenModal(true);
    };

    const CustomDot = ({ onMove, index, onClick, active }: any) => {
        return (
            <div className="h-full flex justify-center w-full items-center mt-5">
                <div
                    className="dark:text-white text-[#000000]"
                    onClick={() => onClick()}
                >
                    {active ? <MdRadioButtonChecked /> : <MdRadioButtonUnchecked />}
                </div>
            </div>
        );
    };

    const CustomButtonGroup = ({ next, previous }: any) => {
        return (
            <div className="w-full h-10 -mt-7 -mb-2 flex justify-between place-items-center">
                <Button className="relative left rounded-full h-10 w-10" type="button" onClick={() => previous()}>
                    <FiChevronLeft className="absolute h-full w-5 text-[#000000] dark:text-white" />
                </Button>
                <Button className="relative right rounded-full h-10 w-10" type="button" onClick={() => next()}>
                    <FiChevronRight className="absolute h-full w-5 text-[#000000] dark:text-white" />
                </Button>
            </div>
        );
    };

    return (
        <div className="h-full w-full">
            {openModal && <ImageView url={urlState} onClose={() => setIsOpenModal(false)} />}
            <Carousel
                additionalTransfrom={0} draggable keyBoardControl
                autoPlay showDots={true}
                autoPlaySpeed={3000}
                shouldResetAutoplay={true}
                swipeable minimumTouchDrag={80} pauseOnHover
                renderArrowsWhenDisabled={false}
                renderButtonGroupOutside={true}
                renderDotsOutside={true}
                customDot={<CustomDot />}
                customButtonGroup={<CustomButtonGroup />}
                responsive={{
                    res1: { breakpoint: { max: 40000, min: 0 }, items: 1, partialVisibilityGutter: 0 },
                }}
                containerClass="w-full h-60 rounded-md mt-2"
                rewind={true}
                rewindWithAnimation={true}
                arrows={false}
                transitionDuration={1000}
                dotListClass="flex justify-between gap-1"
            >
                {urls.length !== 0 ? urls.map((url, index) => (
                    <div key={index} className='rounded-t-xl px-2'>
                        <Image
                            onClick={() => handleOpenImgClick(url)}
                            src={url}
                            alt={`Order Image ${index}`}
                            width={10000}
                            height={10000}
                            className='w-full h-60 rounded-md object-contain'
                        />
                    </div>
                )) : (
                    <div className="flex justify-center text-center h-60 place-items-center">
                        <p>Chưa có ảnh</p>
                    </div>
                )}
            </Carousel>
        </div>
    );
}
