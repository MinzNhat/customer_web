'use client'
import DetailPopup from "@/components/popup";
import { Button } from "@nextui-org/react";
import { FaSave } from "react-icons/fa";
import { FormattedMessage } from "react-intl";
import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import InputField from "@/components/fields/InputField";
import { IoIosBarcode } from "react-icons/io";
import { ShipmentsOperation } from "@/TDLib/main";
import NotiPopup from "@/components/notification";
import SubmitPopup from "@/components/submit";

const AddShipment = ({ setOpenAdd, reloadData }: { setOpenAdd: any, reloadData: any }) => {
    const [option, setOption] = useState(0);
    const [agencyIdDest, setAgencyIdDest] = useState("")
    const [shipmentId, setShipmentId] = useState("")
    const [openError, setOpenError] = useState(false)
    const [openSubmit, setOpenSubmit] = useState(false)
    const [message, setMessage] = useState("")
    const [reload, setReload] = useState(false)
    const shipmentsOperation = new ShipmentsOperation()

    const handleSwitchOption = (option: number) => {
        setOption(option);
    };

    const submitClick = () => {
        if (option == 0 && agencyIdDest == "") {
            setMessage("Vui lòng nhập mã bưu cục đích")
            setOpenError(true)
        } else if (option == 1 && shipmentId == "") {
            setMessage("Vui lòng nhập hoặc quét mã lô hàng")
            setOpenError(true)
        } else {
            setMessage("Xác nhận tạo lô hàng?")
            setOpenSubmit(true)
        }
    };

    const createShipment = async () => {
        let response: any = {}
        if (option == 0) {
            response = await shipmentsOperation.create({ agencyIdDest: agencyIdDest })
        } else if (option == 1) {
            response = await shipmentsOperation.receive({ shipmentId: shipmentId })
        }
        setOpenSubmit(false)
        if (response.error) {
            setMessage(response.message || response.error?.message)
            setOpenError(true)
        } else {
            setMessage(response.message || response.error?.message)
            setReload(true)
        }
    };

    return (
        <DetailPopup
            onClose={() => setOpenAdd(false)}
            title="Thêm lô hàng"
            className2="lg:w-[55%]"
            button={
                <div className="w-full flex bottom-0 bg-white pt-2 dark:bg-[#242526] gap-2">
                    <Button
                        onClick={submitClick}
                        className="rounded-lg lg:h-11 w-full text-green-500 border-green-500 hover:border-green-600 bg-transparent hover:text-white border-2 hover:bg-green-600 hover:shadow-md flex sm:gap-2"
                    >
                        <FaSave />Xác nhận tạo
                    </Button>
                </div>
            }
        >
            {openSubmit && <SubmitPopup message={message} onClose={() => { setOpenSubmit(false) }} submit={createShipment} />}
            {openError && <NotiPopup message={message} onClose={() => { setOpenError(false) }} />}
            {reload && <NotiPopup message={message} onClose={() => { setReload(false); reloadData() }} />}
            <div className="mb-2">
                <div
                    onClick={() => { handleSwitchOption(0) }}
                    className={`flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-white border hover:cursor-pointer dark:bg-[#3a3b3c] ${option == 0 ? "border-green-500 text-green-500" : "text-gray-500 dark:text-white"}`}>
                    <span className="text-[14px] font-medium font-sans focus:outline-none">
                        Tạo lô hàng mới
                    </span>
                </div>
                <AnimatePresence initial={false}>
                    {option === 0 && (
                        <motion.div
                            key="option0"
                            className="w-full"
                            initial={{ scale: 0, height: "0" }}
                            animate={{ scale: 1, height: "auto" }}
                            exit={{ scale: 0, height: "0" }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className="h-44 flex justify-center place-items-center flex-col gap-6 w-full">
                                <div className='w-full flex text-center justify-center'>
                                    <strong><FormattedMessage id="AgencyIdDest2" /></strong>
                                </div>
                                <div key="AgencyIdDest" className="flex gap-2 w-full flex-col lg:flex-row h-fit">
                                    <div className='lg:w-44 lg:min-w-[11rem] flex lg:justify-between place-items-center'>
                                        <strong><FormattedMessage id="AgencyIdDest" /></strong>:
                                    </div>
                                    <p className="whitespace-nowrap flex flex-row gap-2 relative w-full">
                                        <InputField
                                            variant="auth1"
                                            id="AgencyIdDest"
                                            type="text"
                                            value={agencyIdDest}
                                            setValue={setAgencyIdDest}
                                            className="bg-white dark:!bg-[#3a3b3c] w-full"
                                            extra="w-full"
                                        />
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
                <div className="flex items-center gap-3 my-1">
                    <div className="h-px w-full bg-gray-200" />
                    <p className="text-base text-gray-500 dark:text-white">
                        {" "}
                        <FormattedMessage id="Login.Or" />{" "}
                    </p>
                    <div className="h-px w-full bg-gray-200" />
                </div>
                <div
                    onClick={() => { handleSwitchOption(1) }}
                    className={`flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-white border hover:cursor-pointer dark:bg-[#3a3b3c] ${option == 1 ? "border-green-500 text-green-500" : "text-gray-500 dark:text-white"}`}>
                    <span className="text-[14px] font-medium font-sans focus:outline-none">
                        Tạo mới dựa trên lô hàng cũ
                    </span>
                </div>
                <AnimatePresence initial={false}>
                    {option === 1 && (
                        <motion.div
                            key="option1"
                            className="w-full"
                            initial={{ scale: 0, height: "0" }}
                            animate={{ scale: 1, height: "auto" }}
                            exit={{ scale: 0, height: "0" }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className="h-44 flex justify-center place-items-center flex-col gap-6 w-full">
                                <div className='w-full flex text-center justify-center'>
                                    <strong><FormattedMessage id="ShipmentId2" /></strong>
                                </div>
                                <div key="ShipmentId" className="flex gap-2 w-full flex-col lg:flex-row h-fit">
                                    <div className='lg:w-44 lg:min-w-[11rem] flex lg:justify-between place-items-center'>
                                        <strong><FormattedMessage id="ShipmentId" /></strong>:
                                    </div>
                                    <p className="whitespace-nowrap flex flex-row gap-2 relative w-full">
                                        <InputField
                                            variant="auth1"
                                            id="ShipmentId"
                                            type="text"
                                            value={shipmentId}
                                            setValue={setShipmentId}
                                            className="bg-white dark:!bg-[#3a3b3c] w-full"
                                            extra="w-full"
                                        />
                                        <Button
                                            // onClick={fetchManagedWard}
                                            className="flex h-full w-fit items-center justify-center gap-2 rounded-xl bg-white border hover:cursor-pointer border-green-500 text-green-500 dark:bg-[#3a3b3c]">
                                            <IoIosBarcode className="h-full min-w-[24px]" />
                                            <span className="hidden sm:block text-[14px] lg:hidden xl:block font-medium font-sans focus:outline-none">
                                                Quét mã
                                            </span>
                                        </Button>
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </DetailPopup>
    );
};

export default AddShipment;
