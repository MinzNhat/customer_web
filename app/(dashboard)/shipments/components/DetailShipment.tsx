'use client'
import React, { useEffect, useState } from "react";
import DetailPopup from "@/components/popup";
import { Button } from "@nextui-org/react";
import { FaSave, FaTrash } from "react-icons/fa";
import SubmitPopup from "@/components/submit";
import NotiPopup from "@/components/notification";
import { ShipmentsOperation } from "@/TDLib/main";
import Timeline from "@/components/timeline";
import { AnimatePresence, motion } from "framer-motion";
import { FormattedMessage, useIntl } from "react-intl";
import Checkbox from "@/components/checkbox";
import DetailOrder from "./DetailOrder";
import OrderTable from "./order/Order";

interface DetailShipmentProps {
    onClose: () => void;
    dataInitial: any;
    reloadData: any;
}

const DetailShipment: React.FC<DetailShipmentProps> = ({ onClose, dataInitial, reloadData }) => {
    const [timeline, setTimeLine] = useState(false);
    const [openError, setOpenError] = useState(false);
    const [openSubmit, setOpenSubmit] = useState(false);
    const [openSubmit2, setOpenSubmit2] = useState(false);
    const [reload, setReload] = useState(false)
    const [openTable, setTable] = useState(false);
    const [message, setMessage] = useState("");
    const [orders, setOrders] = useState<any[] | null>(null);
    const [order, setOrder] = useState<any>(null);
    const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
    const shipmentsOperation = new ShipmentsOperation();

    const handleFetchData = async () => {
        const response = await shipmentsOperation.getOrdersFromShipment({ shipmentId: dataInitial.shipmentId });
        if (!response.error) setOrders(response.data);
    };

    useEffect(() => {
        handleFetchData();
    }, []);

    const handleCheckboxChange = (orderId: string) => {
        setSelectedOrders((prevSelected) => {
            if (prevSelected.includes(orderId)) {
                return prevSelected.filter((selectedId) => selectedId !== orderId);
            } else {
                return [...prevSelected, orderId];
            }
        });
    };

    const handleViewOrder = (order: any) => {
        setOrder(order)
    };

    const handleDeleteOrdersButton = () => {
        if (selectedOrders.length == 0) {
            setMessage("Vui lòng chọn đơn hàng muốn xoá")
            setOpenError(true)
        } else {
            setMessage(`Xác nhận xoá ${selectedOrders.length} đơn hàng đã chọn ra khỏi lô hàng?`)
            setOpenSubmit(true)
        }
    };

    const handleDeleteOrders = async () => {
        const response = await shipmentsOperation.deleteOrderFromShipment({ shipmentId: dataInitial.shipmentId }, { orderIds: selectedOrders })
        setOpenSubmit(false)
        if (response.error) {
            setMessage(response.message ?? response.error.message ?? "Đã xảy ra lỗi")
            setOpenError(true)
        } else {
            setMessage("Xoá thành công")
            setOpenError(true)
            handleFetchData()
        }
    };

    const handleCreateButton = () => {
        setMessage(`Xác nhận tạo lô hàng trong dữ liệu ở tổng cục ?`)
        setOpenSubmit2(true)
    };

    const handleCreate = async () => {
        const response = await shipmentsOperation.confirmCreate({ shipmentId: dataInitial.shipmentId })
        setOpenSubmit(false)
        if (response.error) {
            setMessage(response.message ?? response.error.message ?? "Đã xảy ra lỗi")
            setOpenError(true)
        } else {
            setMessage("Tạo thành công")
            setReload(true)
            setOpenError(true)
        }
    };

    return (
        <>
            {openTable && <OrderTable reloadData2={handleFetchData} setOpen={setTable} selectedId={dataInitial.shipmentId} />}
            {openError && <NotiPopup message={message} onClose={() => setOpenError(false)} />}
            {openSubmit && <SubmitPopup message={message} submit={handleDeleteOrders} onClose={() => { setOpenSubmit(false) }} />}
            {openSubmit2 && <SubmitPopup message={message} submit={handleCreate} onClose={() => { setOpenSubmit2(false) }} />}
            {order != null && <DetailOrder dataInitial={order} onClose={() => setOrder(null)} />}
            <DetailPopup
                className2="sm:w-full lg:w-5/6"
                onClose={() => {
                    if (reload) reloadData();
                    onClose();
                }}
                title={"Thông tin lô hàng"}
                button={
                    <div className="w-full flex bottom-0 bg-white pt-2 dark:bg-[#242526] gap-2">
                        <Button
                            onClick={handleCreateButton}
                            className="rounded-lg lg:h-11 w-full text-green-500 border-green-500 hover:border-green-600 bg-transparent hover:text-white border-2 hover:bg-green-600 hover:shadow-md flex sm:gap-2"
                        >
                            <FaSave />Xác nhận tạo lô hàng ở tổng cục
                        </Button>
                    </div>
                }
            >
                {timeline &&
                    <DetailPopup
                        className2="sm:w-full lg:w-5/6"
                        onClose={() => { setTimeLine(false) }}
                        title={"Thông tin lộ trình lô hàng"}>
                        <Timeline journey={[...dataInitial.journey].reverse()} />
                    </DetailPopup>
                }
                <div className="grid md:grid-cols-2 pb-2">
                    <div className="p-2 pt-0 col-span-1 border-b md:border-r md:border-b-0  border-gray-200 dark:!border-[#3A3B3C]">
                        <div className="mb-4 flex flex-col">
                            <div className="font-bold text-lg text-center md:text-xl mb-2 flex flex-col">Mã lô hàng: <p>{dataInitial.shipmentId}</p></div>
                            <div className="mb-2">+ Mã vạch:</div>
                            <div className="mb-2">+ Khối lượng (g): {dataInitial.mass ?? "Chưa có thông tin"}</div>
                            <div className="mb-2">+ Mã đối tác vận chuyển: {dataInitial.transportPartnerId ?? "Chưa có thông tin"}</div>
                            <div className="flex self-center">
                                <span className="font-bold mr-2 whitespace-nowrap">Trạng thái:</span>
                                {(() => {
                                    let statusLabel = "";
                                    let statusColor = "";

                                    switch (dataInitial.status) {
                                        case 1:
                                            statusLabel = "Chưa được tổng cục tiếp nhận";
                                            statusColor = "text-green-500";
                                            break;

                                        case 2:
                                            statusLabel = "Đã được tổng cục phê duyệt";
                                            statusColor = "text-green-500";
                                            break;
                                        case 3:
                                            statusLabel = "Đã được tiếp nhận bởi nhân viên vận tải";
                                            statusColor = "text-green-500";
                                            break;
                                        case 4:
                                            statusLabel = "Đang được vận chuyển";
                                            statusColor = "text-green-500";
                                            break;
                                        case 5:
                                            statusLabel = "Đã tới bưu cục đích";
                                            statusColor = "text-green-500";
                                            break;
                                        case 6:
                                            statusLabel = "Đã rã lô";
                                            statusColor = "text-green-500";
                                            break;
                                        case 0:
                                            statusLabel = "Đã tạo ở bưu cục";
                                            statusColor = "text-green-500";
                                            break;

                                        default:
                                            statusLabel = "Chưa rã lô"
                                            statusColor = "text-black";
                                    }

                                    return (
                                        <span className={`${statusColor} font-semibold`}>
                                            {statusLabel}
                                        </span>
                                    );
                                })()}
                            </div>
                        </div>
                        <div className="w-full flex justify-center">
                            <Button
                                onClick={() => { setTimeLine(true) }}
                                className="text-green-500 rounded-md border-green-500 hover:border-green-600 bg-transparent hover:text-white border-2 hover:bg-green-600 hover:shadow-md">
                                Xem hành trình
                            </Button>
                        </div>
                    </div>
                    <div className="p-2 px-0 md:px-2 md:pt-0 col-span-1 w-full h-full relative ">
                        <div className="font-bold text-lg text-center md:text-xl mb-2 flex flex-col">Danh sách đơn hàng</div>
                        <div className="flex gap-2 flex-col sm:flex-row sticky">
                            <Button
                                onClick={() => { setTable(true) }}
                                className="rounded-md min-h-[40px] flex-1 text-green-500 border-green-500 hover:border-green-600 bg-transparent hover:text-white border-2 hover:bg-green-600 hover:shadow-md">
                                Thêm thủ công
                            </Button>
                            <div className="flex gap-2 flex-1">
                                <Button
                                    onClick={() => { console.log(orders) }}
                                    className="rounded-md flex-1 text-green-500 border-green-500 hover:border-green-600 bg-transparent hover:text-white border-2 hover:bg-green-600 hover:shadow-md">
                                    Quét mã
                                </Button>
                                <Button
                                    onClick={handleDeleteOrdersButton}
                                    className="rounded-md text-red-500 border-red-500 hover:border-red-600 bg-transparent hover:text-white border-2 hover:bg-red-600 hover:shadow-md">
                                    <FaTrash /> ({selectedOrders.length})
                                </Button>
                            </div>
                        </div>
                        <div className="mt-2 flex flex-col gap-2 overflow-y-scroll max-h-[400px] pr-2">
                            {orders ? orders.length == 0 ?
                                <div className="flex justify-center place-items-center w-full h-40 gap-2 p-4 rounded-xl">
                                    Hiện lô hàng không chứa đơn hàng nào
                                </div>
                                :
                                <AnimatePresence initial={false}>
                                    {orders.map((order) => {
                                        return (
                                            <div className="flex relative">
                                                <div className="absolute -top-[0.5px] h-full flex justify-center place-items-center ml-2">
                                                    <Checkbox
                                                        color="red"
                                                        className="mt-[1px] dark:border-gray-200 "
                                                        checked={selectedOrders.includes(order.orderId)}
                                                        onChange={() => handleCheckboxChange(order.orderId)}
                                                    />
                                                </div>

                                                <motion.div
                                                    key={order.orderId}
                                                    initial={{ opacity: 1 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    transition={{ duration: 0.3 }}
                                                    className={`w-full border border-gray-200 pl-10 cursor-pointer dark:!border-white rounded-lg p-2 flex flex-row gap-2 ${selectedOrders.includes(order.orderId)
                                                        ? "bg-[#000000]/10 dark:bg-white/10"
                                                        : "dark:bg-[#242526] bg-white"
                                                        }`}
                                                    onClick={() => handleViewOrder(order)}
                                                >

                                                    <div className="text-center font-semibold w-full ">
                                                        {order.orderId}
                                                    </div>
                                                </motion.div></div>

                                        );
                                    })}
                                </AnimatePresence> : <div className="flex justify-center place-items-center w-full h-40 gap-2 p-4 rounded-xl">
                                <svg aria-hidden="true" className="w-20 h-6 text-gray-200 animate-spin dark:text-gray-600 fill-red-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                                </svg>
                            </div>}
                        </div>
                    </div>
                </div>
            </DetailPopup>
        </>
    );
};

export default DetailShipment;
