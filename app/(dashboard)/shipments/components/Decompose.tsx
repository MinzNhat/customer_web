'use client'
import DetailPopup from "@/components/popup";
import { Button } from "@nextui-org/react";
import { FaSave } from "react-icons/fa";
import { FormattedMessage } from "react-intl";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import InputField from "@/components/fields/InputField";
import { OrdersOperation, ShipmentsOperation } from "@/TDLib/main";
import NotiPopup from "@/components/notification";
import SubmitPopup from "@/components/submit";
import { RiPhoneFindLine } from "react-icons/ri";
import { IoIosBarcode } from "react-icons/io";

const DecomposePopup = ({ setOpenDecompose, reloadData }: { setOpenDecompose: any, reloadData: any }) => {
    const [form, setCurrentForm] = useState(0)
    const [shipmentId, setShipmentId] = useState("")
    const [openError, setOpenError] = useState(false)
    const [openSubmit, setOpenSubmit] = useState(false)
    const [message, setMessage] = useState<any>("")
    const [reload, setReload] = useState(false)
    const [loading, setLoading] = useState(false)
    const shipmentsOperation = new ShipmentsOperation()
    const [orders, setOrders] = useState<any>([])
    const [orders2, setOrders2] = useState<any>([])
    const [ordersInput, setOrdersInput] = useState("")
    const ordersOperation = new OrdersOperation();

    const submitClick = () => {
        setLoading(true)
        if (form == 0) {
            handleFindShipment()
        } else if (form == 1) {
            let missingOrders = orders.filter(order => !orders2.includes(order));
            let extraOrders = orders2.filter(order => !orders.includes(order));

            if (missingOrders.length > 0 || extraOrders.length > 0) {
                setMessage(
                    <div>
                        {missingOrders.length > 0 && (
                            <div className=" flex flex-col">
                                <strong className="text-left">Thiếu các đơn hàng:</strong>
                                <ul>
                                    {missingOrders.map((order, index) => (
                                        <li key={index} className="text-red-500">{order}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        {extraOrders.length > 0 && (
                            <div>
                                <strong className="text-left">Dư các đơn hàng:</strong>
                                <ul>
                                    {extraOrders.map((order, index) => (
                                        <li key={index} className="text-yellow-500">{order}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                );
                setOpenSubmit(true);
            } else {
                setMessage("Bạn có xác nhận muốn rã lô không");
                setOpenSubmit(true);
            }
        }
    };

    const handleDecompose = async () => {
        const response = await shipmentsOperation.decompose({ shipmentId: shipmentId }, { orderIds: orders2 })
        setOpenSubmit(false)
        if (response.error) {
            setMessage(response.message || response.error.message)
            setOpenError(true)
        } else {
            console.log(response)
            setMessage("Rã lô thành công")
            setReload(true)
        }
        setLoading(false)
    };

    const handleFindShipment = async () => {
        if (shipmentId == "") {
            setMessage("Vui lòng nhập mã lô hàng")
            setOpenError(true)
        } else {
            const response = await shipmentsOperation.get({ shipmentId: shipmentId.trim() })
            if (response.error) {
                setMessage(response.error || response.error.message)
            } else {
                if (response.data[0]) {
                    setOrders(response.data[0]?.orderIds || [])
                    setCurrentForm(1)
                } else {
                    setMessage("Lô hàng này không tồn tại")
                    setOpenError(true)
                }

            }
            console.log(response);
        }
        setLoading(false)
    };

    const handleFindOrder = async () => {
        if (ordersInput == "") {
            setMessage("Vui lòng nhập mã đơn hàng")
            setOpenError(true)
            return
        }

        if (orders2.includes(ordersInput.trim())) {
            setMessage("Bạn đã thêm đơn hàng này rồi")
            setOpenError(true)
            setOrdersInput("");
            return
        }

        const exists = await ordersOperation.get({ orderId: ordersInput.trim() });
        if (!exists.error && exists.data) {
            setOrders2(prev => [...prev, ordersInput.trim()]);
            setOrdersInput("");
        } else {
            setMessage("Đơn hàng không tồn tại")
            setOpenError(true)
        }
    };

    const getOrderStatus = (orderId: string) => {
        if (orders.includes(orderId) && orders2.includes(orderId)) {
            return "green";
        } else if (orders.includes(orderId)) {
            return "red";
        } else {
            return "yellow";
        }
    };

    const handleDeleteOrder = (orderId: string) => {
        setOrders2(prev => prev.filter(order => order !== orderId));
    };

    return (
        <DetailPopup
            onClose={() => setOpenDecompose(false)}
            title="Rã lô hàng"
            className2={`${form == 0 ? "lg:w-[55%]" : "lg:w-[75%]"}`}
            className="pt-0"
            button={
                <div className="w-full flex bottom-0 bg-white pt-2 dark:bg-[#242526] gap-2">
                    <Button
                        onClick={loading ? () => { } : submitClick}
                        className="rounded-lg lg:h-11 w-full text-green-500 border-green-500 hover:border-green-600 bg-transparent hover:text-white border-2 hover:bg-green-600 hover:shadow-md flex sm:gap-2"
                    >
                        {form == 0 && !loading && <><RiPhoneFindLine className="-mr-.5" />Xác nhận tìm</>}
                        {form == 1 && !loading && <><RiPhoneFindLine />Xác nhận rã lô hàng</>}
                        {loading &&
                            <svg aria-hidden="true" className="w-14 h-6 text-gray-200 animate-spin dark:text-gray-600 fill-green-500" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                            </svg>
                        }
                    </Button>
                </div>
            }
        >
            {openSubmit && <SubmitPopup title="Xác nhận rã lô hàng?" message={message} onClose={() => { setOpenSubmit(false); setLoading(false) }} submit={handleDecompose} />}
            {openError && <NotiPopup message={message} onClose={() => { setOpenError(false) }} />}
            {reload && <NotiPopup message={message} onClose={() => { setReload(false); reloadData() }} />}
            <div className="mb-2">
                <AnimatePresence initial={false}>
                    {form == 0 && <motion.div
                        key="option0"
                        className="w-full"
                        initial={{ scale: 0, height: "0" }}
                        animate={{ scale: 1, height: "auto" }}
                        exit={{ scale: 0, height: "0" }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="h-44 flex justify-center place-items-center flex-col gap-6 w-full">
                            <div className='w-full flex text-center justify-center'>
                                <strong><FormattedMessage id="Decompose1" /></strong>
                            </div>
                            <div key="ShipmentId" className="flex gap-2 w-full flex-col lg:flex-row h-fit">
                                <div className='flex lg:justify-between place-items-center min-w-[100px]'>
                                    <strong><FormattedMessage id="Decompose2" /></strong>:
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
                    </motion.div>}
                </AnimatePresence>
            </div>
            <div className="mb-2">
                <AnimatePresence initial={false}>
                    {form == 1 && <motion.div
                        key="option0"
                        className="w-full"
                        initial={{ scale: 0, height: "0" }}
                        animate={{ scale: 1, height: "auto" }}
                        exit={{ scale: 0, height: "0" }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 justify-between w-full gap-2 h-full">
                            <div className="w-full col-span-1 h-full flex flex-col gap-1 order-last md:order-first">
                                <div className="w-full text-center flex flex-col md:h-20 pt-2 md:pt-0 md:gap-2 md:min-h-[80px]">
                                    <FormattedMessage id="Decompose2" />:{" "}
                                    <span className="font-bold">{shipmentId}</span>
                                </div>
                                <div className="border border-[#545e7b] h-44 md:h-60 md:min-h-[240px] overflow-y-auto w-full rounded-xl grow no-scrollbar flex flex-col">
                                    {orders.map((order, index) => (
                                        <div key={index} className={`relative p-2 pl-4 sm:pl-2 border-b border-[#545e7b] text-left sm:text-center text-${getOrderStatus(order)}-500`}>{order}</div>
                                    ))}
                                </div>
                            </div>
                            <div className="w-full col-span-1 h-full flex flex-col gap-1">
                                <div className="w-full text-center flex flex-col h-20 gap-2 min-h-[80px]">
                                    <FormattedMessage id="Decompose3" />:{" "}
                                    <div className="flex flex-row rounded-md gap-1">
                                        <InputField
                                            variant="auth1"
                                            id="ShipmentId"
                                            type="text"
                                            value={ordersInput}
                                            setValue={setOrdersInput}
                                            className="bg-white dark:!bg-[#3a3b3c] w-full"
                                            extra="w-full"
                                        />
                                        <Button
                                            onClick={handleFindOrder}
                                            className="flex h-full w-fit items-center justify-center gap-2 rounded-xl bg-white border hover:cursor-pointer border-green-500 text-green-500 dark:bg-[#3a3b3c]">
                                            <span className="text-[14px] lg:hidden xl:block font-medium font-sans focus:outline-none">
                                                Thêm
                                            </span>
                                        </Button>
                                    </div>
                                </div>
                                <div className="border border-[#545e7b] h-44 md:h-60 md:min-h-[240px] overflow-y-auto w-full rounded-xl grow no-scrollbar flex gap-2 flex-col">
                                    {orders2.map((order, index) => (
                                        <div key={index} className={`relative p-2 pl-4 sm:pl-2 border-b border-[#545e7b] text-left sm:text-center text-${getOrderStatus(order)}-500`}>
                                            {order}
                                            <div className="absolute right-0 top-0 h-full">
                                                <Button
                                                    onClick={() => { handleDeleteOrder(order) }}
                                                    className="flex h-full w-fit items-center justify-center gap-2 bg-white border-l hover:cursor-pointer border-[#545e7b] text-red-500 dark:bg-[#3a3b3c]">
                                                    <span className="text-[14px] lg:hidden xl:block font-medium font-sans focus:outline-none">
                                                        Xoá
                                                    </span>
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>}
                </AnimatePresence>
            </div>
        </DetailPopup>
    );
};

export default DecomposePopup;
