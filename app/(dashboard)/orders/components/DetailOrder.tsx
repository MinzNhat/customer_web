'use client'
import React, { useEffect, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import DetailPopup from "@/components/popup";
import JourneyTimeline from "@/components/timeline";
import InputField from "@/components/fields/InputField";
import { Button } from "@nextui-org/react";
import { FaPen, FaSave } from "react-icons/fa";
import NotiPopup from "@/components/notification";
import SubmitPopup from "@/components/submit";
import { GettingOrderImageParams, OrdersOperation, UpdatingOrderPayload } from "@/TDLib/main";
import { CarouselSlider } from "@/components/slider";
import Image from 'next/image'
import axios from 'axios';
import JSZip from 'jszip';
import { motion } from "framer-motion";
import Dropzone from "@/components/dropzone";

interface DetailOrderProps {
    onClose: () => void;
    dataInitial: DetailOrder;
    reloadData: () => void;
}

interface DetailOrder {
    orderId: string;
    nameSender: string;
    phoneNumberSender: string;
    nameReceiver: string;
    phoneNumberReceiver: string;
    detailSource: string;
    wardSource: string;
    districtSource: string;
    provinceSource: string;
    detailDest: string;
    wardDest: string;
    districtDest: string;
    provinceDest: string;
    mass: number;
    weight: number;
    height: number;
    length: number;
    width: number;
    fee: number;
    cod: number;
    serviceType: string;
    journey: string[];
}

const DetailOrder: React.FC<DetailOrderProps> = ({ onClose, dataInitial, reloadData }) => {
    const [data, setData] = useState<DetailOrder | null>(null)
    const [message, setMessage] = useState("")
    const [openError, setOpenError] = useState(false)
    const [openError2, setOpenError2] = useState(false)
    const [openSubmit, setOpenSubmit] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const ordersOperation = new OrdersOperation()
    const imgUrl = `https://api2.tdlogistics.net.vn/v2/orders/image/get?orderId=`
    const [sendImg, setSendImg] = useState<string[] | null>(null)
    const [receiImg, setReceiveImg] = useState<string[] | null>(null)
    const [option, setOption] = useState(0)

    const intl = useIntl()

    const handleNumberChange = (id: keyof DetailOrder | "Source" | "Destination", value: string) => {
        let sanitizedValue = value.replace(/^0+/, '');
        let numberValue = sanitizedValue ? parseInt(sanitizedValue, 10) : 0;
        setData(prev => ({ ...prev, [id]: numberValue }));
    };

    const fields: Array<{ id: keyof DetailOrder | "Source" | "Destination", type: string, label: string, disable: boolean, onChange?: (id: keyof DetailOrder | "Source" | "Destination", value: string) => void, }> = [
        { id: "nameSender", type: "text", label: "History.NameSender", disable: true },
        { id: "phoneNumberSender", type: "text", label: "History.PhoneNumSender", disable: true },
        { id: "nameReceiver", type: "text", label: "History.NameReceiver", disable: true },
        { id: "phoneNumberReceiver", type: "text", label: "History.PhoneNumReceiver", disable: true },
        { id: "Source", type: "text", label: "History.SenderAddr", disable: true },
        { id: "Destination", type: "text", label: "History.ReceiverAddr", disable: true },
        { id: "mass", type: "text", label: "History.Mass", disable: isEditing ? false : true, onChange: handleNumberChange },
        { id: "height", type: "text", label: "History.Height", disable: isEditing ? false : true, onChange: handleNumberChange },
        { id: "width", type: "text", label: "History.Width", disable: isEditing ? false : true, onChange: handleNumberChange },
        { id: "length", type: "text", label: "History.Length", disable: isEditing ? false : true, onChange: handleNumberChange },
        { id: "fee", type: "number", label: "History.Fee", disable: true },
        { id: "cod", type: "text", label: "History.COD", disable: isEditing ? false : true, onChange: handleNumberChange },
        { id: "serviceType", type: "text", label: "History.ServiceType", disable: true },
    ];

    const handleChange = (id: keyof DetailOrder | "Source" | "Destination", value: string | number) => {
        setData(prev => ({ ...prev, [id]: value }));
    };

    const parseJourney = [...dataInitial.journey].reverse().map((item: string) => {
        const [time, message] = item.split(': ');
        return { time, message };
    });

    // const areImagesEqual = (images1: string[], images2: string[]): boolean => {
    //     if (images1.length !== images2.length) {
    //         return false;
    //     }

    //     for (let i = 0; i < images1.length; i++) {
    //         if (images1[i] !== images2[i]) {
    //             return false;
    //         }
    //     }
    //     return true;
    // };

    const handleSubmitSave = () => {
        // const sendImagesNeedUpdate = !areImagesEqual(sendImg, sendImg2);
        // const receiImagesNeedUpdate = !areImagesEqual(receiImg, receiImg2);

        // const imagesNeedUpdate = sendImagesNeedUpdate || receiImagesNeedUpdate;

        if (data.mass == 0 || data.height == 0 || data.width == 0 || data.length == 0) {
            setMessage("Vui lòng điền đầy đủ thông tin của đơn hàng");
            setOpenError(true);
        } else if (
            data.mass != dataInitial.mass ||
            data.height != dataInitial.height ||
            data.width != dataInitial.width ||
            data.length != dataInitial.length ||
            data.cod != dataInitial.cod
        ) {
            setMessage("Xác nhận cập nhật thông tin đơn hàng?");
            setOpenSubmit(true);
        } else {
            setIsEditing(false);
        }
    };

    const handleUpdate = async () => {
        const dataUpdate: UpdatingOrderPayload = {
            mass: data.mass,
            height: data.height,
            width: data.width,
            length: data.length,
            cod: data.cod,
        }
        console.log(dataUpdate)
        const response = await ordersOperation.update(dataUpdate, { orderId: dataInitial.orderId })
        setOpenSubmit(false)
        if (response.error) {
            setMessage(response.message ?? response.error.message ?? "Đã có lỗi xảy ra, vui lòng thử lại sau")
            setOpenError(true)
        } else {
            setMessage("Cập nhật đơn hàng thành công")
            setOpenError2(true)
        }
    }

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const url = `${imgUrl}${dataInitial.orderId}&type=send`;
                const response = await axios.get(url, {
                    responseType: 'arraybuffer',
                    withCredentials: true,
                });
                const blob = new Blob([response.data], { type: 'application/zip' });
                const zip = await JSZip.loadAsync(blob);
                const filePromises = Object.keys(zip.files).map(async (filename) => {
                    const file = zip.files[filename];
                    if (!file.dir) {
                        const fileBlob = await file.async('blob');
                        const url = URL.createObjectURL(fileBlob);
                        return { filename, url };
                    }
                });
                const files = await Promise.all(filePromises);
                setSendImg(files.map(file => file.url));
            } catch (e: any) {
                console.error('Error getting image:', e);
                return { error: e.toString() };
            }
        };

        const fetchImages2 = async () => {
            try {
                const url = `${imgUrl}${dataInitial.orderId}&type=receive`;
                const response = await axios.get(url, {
                    responseType: 'arraybuffer',
                    withCredentials: true,
                });
                const blob = new Blob([response.data], { type: 'application/zip' });
                const zip = await JSZip.loadAsync(blob);
                const filePromises = Object.keys(zip.files).map(async (filename) => {
                    const file = zip.files[filename];
                    if (!file.dir) {
                        const fileBlob = await file.async('blob');
                        const url = URL.createObjectURL(fileBlob);
                        return { filename, url };
                    }
                });
                const files = await Promise.all(filePromises);
                setReceiveImg(files.map(file => file.url));
            } catch (e: any) {
                console.error('Error getting image:', e);
                return { error: e.toString() };
            }
        };

        if (dataInitial.orderId) {
            fetchImages();
            fetchImages2();
        }

    }, [dataInitial.orderId]);

    useEffect(() => {
        setData(dataInitial);
    }, [dataInitial]);

    const handleEditClick = () => {
        setTimeout(() => {
            const codElement = document.getElementById("History.COD");
            if (codElement) {
                codElement.scrollIntoView({ behavior: "smooth" });
            }
        }, 0);
        setIsEditing(true);
    };

    return (
        <DetailPopup className2="sm:w-fit" button={
            <div className="w-full flex bottom-0 bg-white pt-2 dark:bg-[#242526] gap-2">
                <Button
                    onClick={isEditing ? handleSubmitSave : handleEditClick}
                    className="rounded-lg lg:h-11 w-full text-green-500 border-green-500 hover:border-green-600 bg-transparent hover:text-white border-2 hover:bg-green-600 hover:shadow-md flex sm:gap-2"
                >
                    {isEditing ? <><FaSave />Lưu</> : <><FaPen />Chỉnh sửa</>}
                </Button>
            </div>
        }
            onClose={onClose} title={intl.formatMessage({ id: "History.Detail.Title" })} >
            {openError && <NotiPopup message={message} onClose={() => setOpenError(false)} />}
            {openError2 && <NotiPopup message={message} onClose={() => { setOpenError2(false); reloadData(); onClose() }} />}
            {openSubmit && <SubmitPopup message={message} onClose={() => setOpenSubmit(false)} submit={handleUpdate} />}
            <div className="flex flex-col md:flex-row gap-2 md:gap-8 mb-2">
                <div className="flex flex-col gap-8 px-0.5">
                    <div className="flex flex-col relative rounded-xl p-4 pt-2 lg:mt-0 h-fit outline outline-[1px] outline-gray-300 md:w-80 lg:w-96">
                        <div className="relative top-0 w-full flex bg-white dark:bg-[#242526] mb-2 z-10">
                            <Button className={`w-full flex flex-row p-2 ${option === 0 ? "text-red-500 font-semibold" : "text-black"}`} onClick={() => setOption(0)}>
                                <span className="text-sm sm:text-base">Ảnh gửi</span>
                            </Button>
                            <Button className={`w-full flex flex-row p-2 ${option === 1 ? "text-red-500 font-semibold" : "text-black"}`} onClick={() => setOption(1)}>
                                <span className="text-sm sm:text-base">Ảnh nhận</span>
                            </Button>
                            <motion.div
                                className={`w-1/2 bg-red-500 bottom-0 h-[2px] ${option === 1 ? "right-0" : "left-0"} absolute`}
                                initial={{ width: 0 }}
                                animate={{ width: "50%" }}
                                exit={{ width: 0 }}
                                transition={{ duration: 0.3 }}
                                variants={{
                                    left: { width: "50%", left: 0, right: "auto" },
                                    right: { width: "50%", left: "auto", right: 0 }
                                }}
                                //@ts-ignore
                                initial="left"
                                animate={option === 1 ? "right" : "left"}
                                exit="left"
                            />
                        </div>
                        {/* {isEditing ?
                            <>
                                <Dropzone files={option == 0 ? sendImg2 : receiImg2} setFiles={option == 0 ? setSendImg2 : setReceiveImg2} className={`${(option == 0 && sendImg2.length == 0) || (option == 1 && receiImg2.length == 0) ? "h-60" : "h-44 px-3"}  flex justify-center place-items-center mt-1`} />
                            </>
                            : */}
                        <div className="relative grow">
                            <CarouselSlider urls={(option == 0 ? sendImg : receiImg) || []} />
                        </div>
                        {/* } */}

                    </div>
                    <JourneyTimeline journey={parseJourney} order={true} />
                </div>

                <div className="w-full text-[#4b4b4b] dark:text-white">
                    <div className="flex flex-col gap-2">
                        <div className="font-bold text-lg text-center md:text-xl mb-2 flex flex-col">Mã đơn hàng: <p>{dataInitial.orderId}</p></div>
                        {fields.map(({ id, type, label, disable, onChange }) => (
                            <div key={id} className="flex gap-2 w-full flex-col lg:flex-row">
                                <div className='lg:w-44 lg:min-w-[11rem] flex lg:justify-between place-items-center'>
                                    <strong><FormattedMessage id={label} /></strong>:
                                </div>
                                <p className="whitespace-nowrap flex flex-row gap-2 relative w-full">
                                    {data && <InputField
                                        variant="auth1"
                                        id={label}
                                        type={type}
                                        disabled={disable}
                                        state={!disable && id != "cod" && data[id] == 0 ? "error" : "none"}
                                        //@ts-ignore
                                        value={
                                            id == "Source" ? `${dataInitial.detailSource ?? "Không có thông tin"}, ${dataInitial.wardSource ?? "Không có thông tin"}, ${dataInitial.districtSource ?? "Không có thông tin"}, ${dataInitial.provinceSource ?? "Không có thông tin"}`
                                                : id == "Destination" ? `${dataInitial.detailDest ?? "Không có thông tin"}, ${dataInitial.wardDest ?? "Không có thông tin"}, ${dataInitial.districtDest ?? "Không có thông tin"}, ${dataInitial.provinceDest ?? "Không có thông tin"}`
                                                    : id == "serviceType" ? (dataInitial.serviceType === "CPN" ?
                                                        intl.formatMessage({ id: 'OrderForm.MoreDetailsForm.typesOfDelivery1' })
                                                        : dataInitial.serviceType === "TTk" ?
                                                            intl.formatMessage({ id: 'OrderForm.MoreDetailsForm.typesOfDelivery3' })
                                                            :
                                                            intl.formatMessage({ id: 'OrderForm.MoreDetailsForm.typesOfDelivery4' })) : data[id] ? data[id] : disable != false ? "Không có thông tin" : 0
                                        }
                                        setValue={(value: string) => onChange ? onChange(id, value) : handleChange(id, value)}
                                        className="bg-white dark:!bg-[#3a3b3c] w-full"
                                        extra="w-full"
                                    />}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </DetailPopup>
    );
};

export default DetailOrder;
