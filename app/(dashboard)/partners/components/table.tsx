"use client"
import React, { useEffect, useMemo, useState } from "react";
import Card from "@/components/card";
import {
    useGlobalFilter,
    usePagination,
    useSortBy,
    useTable,
} from "react-table";
import {
    MdNavigateNext,
    MdNavigateBefore,
    MdRestartAlt,
    MdOutlineAddCircleOutline,
    MdRadioButtonChecked,
    MdRadioButtonUnchecked,
    MdOutlineRemoveCircleOutline,
} from "react-icons/md";
import { FaTruckArrowRight } from "react-icons/fa6";
import { Button } from "@nextui-org/react";
// import DetailPopup from "./DetailPopup";
import { IoAddOutline } from "react-icons/io5";
import { FiSearch } from "react-icons/fi";
import { motion } from "framer-motion";
import NotiPopup from "@/components/notification";
import { FormattedMessage, useIntl } from "react-intl";
import Checkbox from "@/components/checkbox";
import SubmitPopup from "@/components/submit";
import { VehicleOperation } from "@/TDLib/main";
import AddTransportPartner from "./AddPartners/AddPartners";
// import AddVehicle from "./AddVehicle";

type Props = {
    columnsData: any[];
    tableData: any[];
    reloadData: any;
    openModal: any;
    setOpenModal: any;
    dataRow: any;
    setDataRow: any
};

const CheckTable = (props: Props) => {
    const { columnsData, tableData, reloadData, openModal, setOpenModal, dataRow, setDataRow } = props;
    const [openReload, setOpenReload] = useState(false);
    const [openError, setOpenError] = useState(false);
    const [message, setMessage] = useState("");
    const columns = useMemo(() => columnsData, [columnsData]);
    const data = useMemo(() => tableData, [tableData]);
    const [searchValue, setSearchValue] = useState("");
    const [selectedRows, setSelectedRows] = useState<Map<number, Set<number>>>(new Map());
    const [currentPageInput, setCurrentPageInput] = useState(1);
    const [openAdd, setOpenAdd] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const tableInstance = useTable(
        {
            columns,
            data,
        },
        useGlobalFilter,
        useSortBy,
        usePagination
    );
    const intl = useIntl();
    const vehicleOperation = new VehicleOperation()
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        page,
        prepareRow,
        canPreviousPage,
        canNextPage,
        nextPage,
        previousPage,
        gotoPage,
        pageCount,
        state: { pageIndex },
        setGlobalFilter,
    } = tableInstance;

    useEffect(() => {
        setCurrentPageInput(pageIndex + 1);
    }, [pageIndex]);

    const selectAllRows = () => {
        const newSelectedRows = new Map(selectedRows);
        const currentSelectedRows = newSelectedRows.get(pageIndex) || new Set<number>();

        if (currentSelectedRows.size === page.length) {
            newSelectedRows.delete(pageIndex);
        } else {
            const newPageSelectedRows = new Set<number>();
            page.forEach((_, index) => {
                newPageSelectedRows.add(index);
            });
            newSelectedRows.set(pageIndex, newPageSelectedRows);
        }

        setSelectedRows(newSelectedRows);
    };

    const toggleRowSelection = (rowIndex: number) => {
        const newSelectedRows = new Map(selectedRows);
        const currentSelectedRows = newSelectedRows.get(pageIndex) || new Set<number>();

        if (currentSelectedRows.has(rowIndex)) {
            currentSelectedRows.delete(rowIndex);
        } else {
            currentSelectedRows.add(rowIndex);
        }

        newSelectedRows.set(pageIndex, currentSelectedRows);
        setSelectedRows(newSelectedRows);
    };

    const isRowSelected = (rowIndex: number) => {
        const currentSelectedRows = selectedRows.get(pageIndex) || new Set<number>();
        return currentSelectedRows.has(rowIndex);
    };

    const handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Number(e.target.value);
        if (value > 0 && value <= pageCount) {
            setCurrentPageInput(value);
            gotoPage(value - 1);
        } else if (e.target.value === '') {
            setCurrentPageInput(0);
        }
    };

    const handleDelete = async () => {
        const selectedIds = [];
        selectedRows.forEach((rows) => {
            rows.forEach(rowIndex => {
                selectedIds.push(tableData[rowIndex].vehicleId);
            });
        });
        let error = false;

        const responses = await Promise.all(selectedIds.map(async (id) => {
            if (id) {
                const response = await vehicleOperation.deleteVehicle({ vehicleId: id });
                return !!response.error
            } else return { error: true };
        }));

        error = responses.some(response => !!response);

        setOpenDelete(false);

        if (error) {
            setMessage("Đã có lỗi xảy ra khi xoá phương tiện.");
            setOpenError(true);
        } else {
            setMessage("Xoá các phương tiện đã chọn thành công.");
            setOpenReload(true);
            setSelectedRows(new Map());
        }
    };

    return (
        <Card className={"h-full w-full p-4 overflow-auto no-scrollbar"}>
            {openAdd && <AddTransportPartner reloadData={reloadData} setOpenAdd={setOpenAdd} />}
            {openDelete && <SubmitPopup message={message} onClose={() => { setOpenDelete(false) }} submit={handleDelete} />}
            {openError && <NotiPopup message={message} onClose={() => { setOpenError(false) }} />}
            {openReload && <NotiPopup message={message} onClose={() => { setOpenReload(false); reloadData() }} />}
            <div className="flex justify-between items-center flex-col lg:flex-row">
                <div className="flex flex-col lg:flex-row gap-3 h-full mb-2 lg:mb-0 w-full place-items-center">
                    <div
                        className={`relative flex items-center bg-lightPrimary rounded-full text-navy-700 dark:bg-[#3A3B3C] dark:text-white lg:w-[300px] w-full`}
                    >
                        <motion.button
                            className={`text lg h-10 w-8 px-2 ml-2 flex justify-center rounded-full place-items-center`}
                            initial={{ left: 2 }}
                        >
                            <FiSearch
                                className={`h-4 w-4 text-navy-800 dark:text-white `}
                            />
                        </motion.button>
                        <input
                            value={searchValue}
                            onChange={(e) => {
                                setSearchValue(e.target.value);
                                setGlobalFilter(e.target.value)
                            }}
                            type="text"
                            placeholder={intl.formatMessage({ id: "Navbar.Search" })}
                            className={`block h-full w-full rounded-full bg-lightPrimary text-sm font-medium text-navy-800 dark:text-white  placeholder:text-navy-800 placeholder:dark:text-gray-300
            outline-none dark:bg-[#3A3B3C]  pl-1 pr-3`}
                        />
                    </div>
                    <div className="grid grid-cols-2 lg:flex gap-3 h-full mb-2 lg:mb-0 w-full place-items-center">
                        <Button className={`col-span-1 w-full lg:w-fit flex items-center text-md hover:cursor-pointer bg-lightPrimary p-2 hover:bg-gray-100 dark:bg-[#3A3B3C] dark:hover:bg-white/20 dark:active:bg-white/10
              linear justify-center rounded-lg font-medium dark:font-base transition duration-200`}
                            onClick={reloadData}>
                            <MdRestartAlt />Tải lại
                        </Button>
                        <Button className={`col-span-1 w-full lg:w-fit flex items-center text-md hover:cursor-pointer bg-lightPrimary p-2 hover:bg-gray-100 dark:bg-[#3A3B3C] dark:hover:bg-white/20 dark:active:bg-white/10
              linear justify-center rounded-lg font-medium dark:font-base transition duration-200`}
                            onClick={() => { setOpenAdd(true) }}>
                            <MdOutlineAddCircleOutline /><p className="flex gap-1">Thêm <p className="hidden sm:block">đối tác vận tải</p></p>
                        </Button>
                        {Array.from(selectedRows.values()).reduce((total, set) => total + set.size, 0) != 0 &&
                            <Button className={`w-full lg:w-fit col-span-2 flex items-center text-md hover:cursor-pointer bg-lightPrimary p-2 text-red-500 hover:bg-gray-100 dark:bg-[#3A3B3C] dark:hover:bg-white/20 dark:active:bg-white/10
              linear justify-center rounded-lg font-medium dark:font-base transition duration-200`}
                                onClick={() => { setMessage(`Xác nhận xoá ${Array.from(selectedRows.values()).reduce((total, set) => total + set.size, 0)} phương tiện đã chọn?`); setOpenDelete(true) }}>
                                <MdOutlineRemoveCircleOutline />Xoá ({Array.from(selectedRows.values()).reduce((total, set) => total + set.size, 0)})
                            </Button>
                        }
                    </div>
                </div>
                <div className="gap-2 h-full hidden lg:flex">
                    <input
                        type="string"
                        value={currentPageInput}
                        onChange={handlePageInputChange}
                        className="w-10 text-center focus:outline-none font-semibold dark:bg-[#3A3B3C] bg-lightPrimary dark:text-white flex items-center rounded-full"
                    />
                    <Button className={`flex items-center text-md hover:cursor-pointer bg-lightPrimary p-2 text-navy-800 dark:text-white  border 
            border-gray-200 dark:!border-none hover:bg-gray-100 dark:bg-[#3A3B3C] dark:hover:bg-white/20 dark:active:bg-white/10
              linear justify-center rounded-full font-bold transition duration-200`} onClick={() => previousPage()} disabled={!canPreviousPage}>
                        <MdNavigateBefore className="w-6 h-6" />
                    </Button>

                    <Button className={`flex items-center text-md hover:cursor-pointer bg-lightPrimary p-2 text-navy-800 dark:text-white  border 
            border-gray-200 dark:!border-none hover:bg-gray-100 dark:bg-[#3A3B3C] dark:hover:bg-white/20 dark:active:bg-white/10
              linear justify-center rounded-full font-bold transition duration-200`} onClick={() => nextPage()} disabled={!canNextPage}>
                        <MdNavigateNext className="w-6 h-6" />
                    </Button>
                </div>
            </div>
            {tableData.length == 0 ? <div className="h-full flex w-full place-items-center text-center justify-center"><FormattedMessage id="History.Message" /></div>
                : <div className="mt-4 sm:mt-8 overflow-x-auto no-scrollbar relative h-full">
                    <table {...getTableProps()} className="w-full sticky" color="gray-500">
                        <thead>
                            {headerGroups.map((headerGroup, index) => {
                                const newSelectedRows = new Map(selectedRows);
                                const currentSelectedRows = newSelectedRows.get(pageIndex) || new Set<number>();
                                return (
                                    <tr {...headerGroup.getHeaderGroupProps()} key={index}>
                                        {headerGroup.headers.map((column, index) => (
                                            <th
                                                {...column.getHeaderProps(column.getSortByToggleProps())}
                                                className={`sticky top-0 z-10 border-b border-gray-200 bg-white dark:!bg-[#242526] pb-[10px] dark:!border-[#3A3B3C]`}
                                                key={index}
                                            >
                                                <div className={`text-xs font-bold tracking-wide text-gray-600 lg:text-xs whitespace-nowrap ${column.render("Header") == "detail" ? "text-end" : column.render("Header") == "vehicle.busy" ? "text-center pr-2" : "text-start pr-2"}`}>
                                                    {column.render("Header") == "Checkbox" ? <Checkbox checked={currentSelectedRows.size === page.length} onChange={() => selectAllRows()} />
                                                        : intl.formatMessage({ id: column.render("Header")?.toString() })}
                                                </div>
                                            </th>
                                        ))}
                                    </tr>
                                )
                            })}
                        </thead>

                        <tbody {...getTableBodyProps()}>
                            {page.map((row, rowIndex) => {
                                prepareRow(row);
                                const rowClassName = isRowSelected(rowIndex)
                                    ? `dark:bg-[#3A3B3C] bg-gray-200`
                                    : ``;
                                return (
                                    <tr
                                        {...row.getRowProps()}
                                        key={rowIndex}
                                        className={rowClassName}
                                    >
                                        {row.cells.map((cell, cellIndex) => {
                                            let renderData;
                                            if (!cell.value
                                                && cell.column.Header != "vehicle.busy"
                                                && cell.column.Header != "detail"
                                                && cell.column.Header != "Checkbox"
                                            ) {
                                                renderData = (
                                                    <p className="mt-1 text-sm font-bold dark:text-white whitespace-nowrap flex pr-2">
                                                        Không có thông tin
                                                    </p>
                                                );
                                            } else if (cell.column.Header === "Checkbox") {
                                                renderData = (
                                                    <div className="pr-2">
                                                        <Checkbox
                                                            checked={isRowSelected(rowIndex)}
                                                            onChange={() => toggleRowSelection(rowIndex)}
                                                        />
                                                    </div>
                                                );
                                            } else if (cell.column.Header == "vehicle.busy") {
                                                renderData = (
                                                    <p className="mt-1 text-sm font-bold dark:text-white whitespace-nowrap flex justify-center">
                                                        {cell.value ? <MdRadioButtonChecked className="text-red-500" /> : <MdRadioButtonUnchecked className="text-gray-300" />}
                                                    </p>
                                                );
                                            } else if (cell.column.Header !== "detail") {
                                                renderData = (
                                                    <p className="mt-1 text-sm font-bold text-navy-700 dark:text-white pr-4 whitespace-nowrap">
                                                        {cell.value}
                                                    </p>
                                                );
                                            } else if (cell.column.Header === "detail") {
                                                renderData = (
                                                    <div className="w-full flex justify-end">
                                                        <Button
                                                            onClick={() => {
                                                                setDataRow(row.original)
                                                                setOpenModal(true);
                                                            }}
                                                            className={`flex items-center hover:cursor-pointer bg-lightPrimary p-2 h-8 w-8 rounded-full text-navy-800 dark:text-white  border 
                            border-gray-200 dark:!border-none hover:bg-gray-100 dark:bg-[#3A3B3C] dark:hover:bg-white/20 dark:active:bg-white/10
                              linear justify-center font-bold transition duration-200 mr-2`}
                                                        >
                                                            <IoAddOutline className="w-full h-full font-bold" />
                                                        </Button>
                                                    </div>
                                                );
                                            }
                                            return (
                                                <td
                                                    {...cell.getCellProps()}
                                                    key={cellIndex}
                                                    className="pt-[14px] pb-[16px] sm:text-[14px]"
                                                >
                                                    {renderData}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>}
            <div className="gap-2 justify-center flex lg:hidden h-12 pt-2">
                <Button className={`flex items-center text-md hover:cursor-pointer bg-lightPrimary p-2 text-navy-800 dark:text-white  border 
            border-gray-200 dark:!border-none hover:bg-gray-100 dark:bg-[#3A3B3C] dark:hover:bg-white/20 dark:active:bg-white/10
              linear justify-center rounded-full font-bold transition duration-200`} onClick={() => previousPage()} disabled={!canPreviousPage}>
                    <MdNavigateBefore className="w-6 h-6" />
                </Button>
                <input
                    type="string"
                    value={currentPageInput}
                    onChange={handlePageInputChange}
                    className="w-10 text-center focus:outline-none font-semibold dark:bg-[#3A3B3C] bg-lightPrimary dark:text-white flex items-center rounded-full"
                />
                <Button className={`flex items-center text-md hover:cursor-pointer bg-lightPrimary p-2 text-navy-800 dark:text-white  border 
            border-gray-200 dark:!border-none hover:bg-gray-100 dark:bg-[#3A3B3C] dark:hover:bg-white/20 dark:active:bg-white/10
              linear justify-center rounded-full font-bold transition duration-200`} onClick={() => nextPage()} disabled={!canNextPage}>
                    <MdNavigateNext className="w-6 h-6" />
                </Button>
            </div>
        </Card>
    );
};

export default CheckTable;
