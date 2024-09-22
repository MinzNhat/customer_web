'use client'
import { OrdersOperation, Role, ShipmentsOperation } from "@/TDLib/main";
import Card from "@/components/card";
import { useCallback, useEffect, useState } from "react";
import { usePassDataContext } from "@/providers/PassedData";
import CheckTable from "./table";
import { columnsData } from "./columnsData";
import DetailPopup from "@/components/popup";
import { Button } from "@nextui-org/react";
import NotiPopup from "@/components/notification";
import SubmitPopup from "@/components/submit";

const OrderTable = ({ selectedId, setOpen, reloadData2 }: { selectedId: any, setOpen: any, reloadData2: any }) => {
    const ordersOperation = new OrdersOperation();
    const shipmentsOperation = new ShipmentsOperation();
    const [data, setData] = useState<any>(null);
    const { passData } = usePassDataContext();
    const [fetched, setFetched] = useState(false);
    const [openError, setOpenError] = useState(false);
    const [openSubmit, setOpenSubmit] = useState(false);
    const [message, setMessage] = useState<any>("");
    const [openReload, setOpenReload] = useState(false);
    const [selectedOrders, setSelectedOrders] = useState([]);
    const handleFetchData = async () => {
        setData(null)
        //@ts-ignore
        const response = await ordersOperation.get({})
        setData(response.data)
    };

    const reloadData = useCallback(() => {
        if (passData && passData.account.role) handleFetchData()
    }, [passData]);

    const handleSubmit = async () => {
        if (selectedOrders.length == 0) {
            setMessage("Vui lòng chọn đơn hàng")
            setOpenError(true)
            return;
        } else {
            setMessage(`Xác nhận thêm ${selectedOrders.length} đơn hàng đã chọn vào lô hàng có mã: ${selectedId}`)
            setOpenSubmit(true)
        }
    }

    const handleSubmit2 = async () => {
        const response = await shipmentsOperation.addOrdersToShipment({ shipmentId: selectedId }, { orderIds: selectedOrders })
        setOpenSubmit(false)
        if (response.error) {
            setMessage(response.message || response.error.message)
            setOpenError(true)
        } else {
            setMessage("Thêm vào lô hàng thành công")
            setOpenReload(true)
        }
    }

    const loading = () => {
        return <svg
            aria-hidden="true"
            className="w-20 h-10 text-gray-200 animate-spin dark:text-gray-600 fill-red-600"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
            />
            <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
            />
        </svg>
    };

    const [table, setTable] = useState(loading());

    useEffect(() => {
        if (passData && passData.account.role && !fetched) {
            handleFetchData();
            setFetched(true);
        }
    }, [passData]);

    return (
        <DetailPopup
            button={
                <div className="w-full flex bottom-0 bg-white pt-2 dark:bg-[#242526] gap-2">
                    <Button
                        onClick={handleSubmit}
                        className="rounded-lg lg:h-11 w-full text-green-500 border-green-500 hover:border-green-600 bg-transparent hover:text-white border-2 hover:bg-green-600 hover:shadow-md flex sm:gap-2"
                    >
                        Xác nhận
                    </Button>
                </div>
            }
            onClose={() => setOpen(false)}
            title={`Chọn phương tiện`}>
            {openReload && <NotiPopup message={message} onClose={() => { setOpen(false); reloadData2() }} />}
            {openError && <NotiPopup message={message} onClose={() => { setOpenError(false) }} />}
            {openSubmit && <SubmitPopup message={message} onClose={() => { setOpenSubmit(false); }} submit={handleSubmit2} />}

            {passData ? (
                data ? (
                    <CheckTable columnsData={columnsData} tableData={data} reloadData={reloadData} selectedId={selectedOrders} setSelectedId={setSelectedOrders} />
                ) : (
                    <Card className="h-full w-full text-red-500 flex justify-center place-items-center mb-2">
                        {table}
                    </Card>
                )
            ) : (
                <Card className="h-full w-full text-red-500 flex justify-center place-items-center mb-2">
                    {loading()}
                </Card>
            )}
        </DetailPopup>

    );
};

export default OrderTable;
