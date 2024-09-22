'use client'
import React, { useEffect, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import DetailPopup from "@/components/popup";
import InputField from "@/components/fields/InputField";
import { Button } from "@nextui-org/react";
import { FaPen, FaSave, FaTrash } from "react-icons/fa";
import NotiPopup from "@/components/notification";
import SubmitPopup from "@/components/submit";
import { AnimatePresence, motion } from "framer-motion";
import Checkbox from "@/components/checkbox";
import { UpdatingVehicleParams, UpdatingVehiclePayload, VehicleOperation } from "@/TDLib/main";
import ShipmentTable from "./shipment/Shipment";

interface DetailVehicleProps {
    onClose: () => void;
    dataInitial: DetailVehicle;
    reloadData: () => void;
}

interface DetailVehicle {
    agencyId: string;
    busy: number;
    createdAt: string;
    lastUpdate: string;
    licensePlate: string;
    mass: number;
    maxLoad: number;
    shipmentIds: string[];
    staffId: string;
    transportPartnerId: string;
    type: string;
    vehicleId: string;
}

const DetailVehicle: React.FC<DetailVehicleProps> = ({ onClose, dataInitial, reloadData }) => {
    const vehicleOperation = new VehicleOperation()
    const [data, setData] = useState<DetailVehicle | null>(null)
    const [message, setMessage] = useState("")
    const [openError, setOpenError] = useState(false)
    const [openError2, setOpenError2] = useState(false)
    const [openSubmit, setOpenSubmit] = useState(false)
    const [openSubmit2, setOpenSubmit2] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [openTable, setTable] = useState(false);
    const [selectedShipments, setselectedShipments] = useState<string[]>([]);
    const [reload, setReload] = useState(false)

    const intl = useIntl()

    const handleNumberChange = (id: keyof DetailVehicle, value: string) => {
        let sanitizedValue = value.replace(/^0+/, '');
        let numberValue = sanitizedValue ? parseInt(sanitizedValue, 10) : 0;
        setData(prev => ({ ...prev, [id]: numberValue }));
    };

    const fields: Array<{ id: keyof DetailVehicle, type: string, label: string, disable: boolean, onChange?: (id: keyof DetailVehicle, value: string) => void, }> = [
        { id: "agencyId", type: "text", label: "DetailVehicle.AgencyId", disable: true },
        { id: "transportPartnerId", type: "text", label: "DetailVehicle.TransportPartnerId", disable: true },
        { id: "licensePlate", type: "text", label: "DetailVehicle.LicensePlate", disable: true },
        { id: "mass", type: "text", label: "DetailVehicle.Mass", disable: true },
        { id: "maxLoad", type: "text", label: "DetailVehicle.MaxLoad", disable: isEditing ? false : true, onChange: handleNumberChange },
        { id: "type", type: "text", label: "DetailVehicle.Type", disable: isEditing ? false : true },
        { id: "createdAt", type: "text", label: "DetailVehicle.CreatedAt", disable: true },
        { id: "lastUpdate", type: "text", label: "DetailVehicle.LastUpdate", disable: true },

    ];

    const createTime = (time: string) => {
        const moment = require("moment-timezone");
        const standardDatetime = moment(time)
            .tz(moment.tz.guess())
            .format("DD/MM/YYYY HH:mm:ss");
        return standardDatetime;
    };

    const handleChange = (id: keyof DetailVehicle, value: string | number) => {
        setData(prev => ({ ...prev, [id]: value }));
    };

    const handleSubmitSave = () => {
        if (data.maxLoad == 0 || !data.type) {
            setMessage("Vui lòng điền đầy đủ thông tin của phương tiện");
            setOpenError(true);
        } else if (
            data.maxLoad != dataInitial.maxLoad ||
            data.type != dataInitial.type
        ) {
            setMessage("Xác nhận cập nhật thông tin phương tiện?");
            setOpenSubmit(true);
        } else {
            setIsEditing(false);
        }
    };

    const handleUpdate = async () => {
        const dataInfo: UpdatingVehicleParams = {
            vehicleId: dataInitial.vehicleId
        }

        const dataUpdate: UpdatingVehiclePayload = {
            type: data.type,
            maxLoad: data.maxLoad
        }
        const response = await vehicleOperation.update(dataInfo, dataUpdate)
        setOpenSubmit(false)
        if (response.error) {
            setMessage(response.message ?? response.error.message ?? "Đã có lỗi xảy ra, vui lòng thử lại sau")
            setOpenError(true)
        } else {
            setMessage("Cập nhật phương tiện thành công")
            reloadData()
            dataInitial.maxLoad = data.maxLoad
            dataInitial.type = data.type
            setOpenError(true)
        }
    }

    useEffect(() => {
        setData(dataInitial);
    }, [dataInitial]);

    const handleEditClick = () => {
        setTimeout(() => {
            const codElement = document.getElementById("DetailVehicle.MaxLoad");
            if (codElement) {
                codElement.scrollIntoView({ behavior: "smooth" });
            }
        }, 0);
        setIsEditing(true);
    };

    const handleCheckboxChange = (shipment: string) => {
        setselectedShipments((prevSelected) => {
            if (prevSelected.includes(shipment)) {
                return prevSelected.filter((selectedId) => selectedId !== shipment);
            } else {
                return [...prevSelected, shipment];
            }
        });
    };

    const handleDeleteShipmentsButton = () => {
        if (selectedShipments.length == 0) {
            setMessage("Vui lòng chọn lô hàng muốn xoá")
            setOpenError(true)
        } else {
            setMessage(`Xác nhận xoá ${selectedShipments.length} lô hàng đã chọn ra khỏi phương tiện?`)
            setOpenSubmit2(true)
        }
    };

    const handleDeleteShipments = async () => {
        const response = await vehicleOperation.removeShipments(data.vehicleId, { shipmentIds: selectedShipments })
        setOpenSubmit(false)
        console.log(response)
        if (response.error) {
            setMessage(response.message ?? response.error.message ?? "Đã xảy ra lỗi")
            setOpenError(true)
        } else {
            setMessage("Xoá thành công")
            dataInitial.shipmentIds = dataInitial.shipmentIds.filter((shipmentId) => !selectedShipments.includes(shipmentId))
            setData({ ...data, shipmentIds: data.shipmentIds.filter((shipmentId) => !selectedShipments.includes(shipmentId)) })
            setselectedShipments([])
            setOpenError(true)
            setReload(true)
        }
    };

    const handleAddShipments = (shipmentsIds: string[]) => {
        const newShipments = shipmentsIds.filter(shipmentId => !data.shipmentIds.includes(shipmentId));

        if (newShipments.length > 0) {
            setData(prevData => ({
                ...prevData,
                shipmentIds: [...prevData.shipmentIds, ...newShipments]
            }));
            dataInitial.shipmentIds = [...dataInitial.shipmentIds, ...newShipments];
        }
    };

    return (
        <DetailPopup button={
            <div className="w-full flex bottom-0 bg-white pt-2 dark:bg-[#242526] gap-2">
                <Button
                    onClick={isEditing ? handleSubmitSave : handleEditClick}
                    className="rounded-lg lg:h-11 w-full text-green-500 border-green-500 hover:border-green-600 bg-transparent hover:text-white border-2 hover:bg-green-600 hover:shadow-md flex sm:gap-2"
                >
                    {isEditing ? <><FaSave />Lưu</> : <><FaPen />Chỉnh sửa</>}
                </Button>
            </div>
        }
            onClose={onClose} title={intl.formatMessage({ id: "DetailVehicle.Detail.Title" })} >

            {openTable && <ShipmentTable setOpen={setTable} reloadData2={handleAddShipments} selectedId={dataInitial.vehicleId} />}
            {openError && <NotiPopup message={message} onClose={() => setOpenError(false)} />}
            {openError2 && <NotiPopup message={message} onClose={() => { setOpenError2(false); reloadData(); onClose() }} />}
            {openSubmit && <SubmitPopup message={message} onClose={() => setOpenSubmit(false)} submit={handleUpdate} />}
            {openSubmit2 && <SubmitPopup message={message} onClose={() => setOpenSubmit2(false)} submit={handleDeleteShipments} />}

            <div className="flex flex-col md:flex-row gap-2 md:gap-8 mb-2">
                <div className="w-full text-[#4b4b4b] dark:text-white grid md:grid-cols-2">
                    <div className="flex flex-col gap-2 border-b md:border-r md:border-b-0 md:pr-3 pb-2 md:pb-0">
                        <div className="font-bold text-lg text-center md:text-xl mb-2 flex flex-col">
                            Mã phương tiện: <p>{dataInitial.vehicleId}</p>
                        </div>
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
                                        state={!disable && data[id] == "" ? "error" : "none"}
                                        //@ts-ignore
                                        value={id == "createdAt" || id == "lastUpdate" ? createTime(data[id]) : (id == "maxLoad" || id == "type" ? data[id] as string : data[id] == "" ? "Không có thông tin" : data[id] as string)}
                                        setValue={(value: string) => onChange ? onChange(id, value) : handleChange(id, value)}
                                        className="bg-white dark:!bg-[#3a3b3c] w-full"
                                        extra="w-full"
                                    />}
                                </p>
                            </div>
                        ))}
                    </div>
                    <div className="p-2 px-0 md:px-2 md:pt-0 col-span-1 w-full h-full relative ">
                        <div className="font-bold text-lg text-center md:text-xl mb-2 flex flex-col">
                            Danh sách lô hàng
                        </div>
                        <div className="flex gap-2 flex-col sm:flex-row sticky">
                            <Button
                                onClick={() => { setTable(true) }}
                                className="rounded-md min-h-[40px] flex-1 text-green-500 border-green-500 hover:border-green-600 bg-transparent hover:text-white border-2 hover:bg-green-600 hover:shadow-md">
                                Thêm thủ công
                            </Button>
                            <div className="flex gap-2 flex-1">
                                <Button
                                    onClick={() => { console.log(data.vehicleId) }}
                                    className="rounded-md flex-1 text-green-500 border-green-500 hover:border-green-600 bg-transparent hover:text-white border-2 hover:bg-green-600 hover:shadow-md">
                                    Quét mã
                                </Button>
                                <Button
                                    onClick={handleDeleteShipmentsButton}
                                    className="rounded-md text-red-500 border-red-500 hover:border-red-600 bg-transparent hover:text-white border-2 hover:bg-red-600 hover:shadow-md">
                                    <FaTrash /> ({selectedShipments.length})
                                </Button>
                            </div>
                        </div>
                        <div className="mt-2 flex flex-col gap-2 overflow-y-scroll max-h-[400px] pr-2">
                            {data && data.shipmentIds
                                ? data.shipmentIds.length == 0
                                    ?
                                    <div className="flex justify-center place-items-center w-full h-40 gap-2 p-4 rounded-xl">
                                        Hiện phương tiện không chứa lô hàng nào
                                    </div>
                                    : <AnimatePresence initial={false}>

                                        {data.shipmentIds.map((shipment) => {
                                            return (
                                                <div className="flex relative">
                                                    <div className="absolute -top-[0.5px] h-full flex justify-center place-items-center ml-2">
                                                        <Checkbox
                                                            color="red"
                                                            className="mt-[1px] dark:border-gray-200 "
                                                            checked={selectedShipments.includes(shipment)}
                                                            onChange={() => handleCheckboxChange(shipment)}
                                                        />
                                                    </div>

                                                    <motion.div
                                                        key={shipment}
                                                        initial={{ opacity: 1 }}
                                                        animate={{ opacity: 1 }}
                                                        exit={{ opacity: 0 }}
                                                        transition={{ duration: 0.3 }}
                                                        className={`w-full border border-gray-200 pl-10 cursor-pointer dark:!border-white rounded-lg p-2 flex flex-row gap-2 ${selectedShipments.includes(shipment)
                                                            ? "bg-[#000000]/10 dark:bg-white/10"
                                                            : "dark:bg-[#242526] bg-white"
                                                            }`}
                                                    // onClick={() => handleViewOrder(order)}
                                                    >

                                                        <div className="text-center font-semibold w-full ">
                                                            {shipment}
                                                        </div>
                                                    </motion.div>
                                                </div>
                                            );
                                        })}
                                    </AnimatePresence> :
                                <div className="flex justify-center place-items-center w-full h-40 gap-2 p-4 rounded-xl">
                                    <svg aria-hidden="true" className="w-20 h-6 text-gray-200 animate-spin dark:text-gray-600 fill-red-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                                    </svg>
                                </div>}
                        </div>
                    </div>
                </div>
            </div>
        </DetailPopup>
    );
};

export default DetailVehicle;
