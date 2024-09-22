"use client";
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
    MdRadioButtonChecked,
    MdRadioButtonUnchecked,
    MdRestartAlt,
} from "react-icons/md";
import { Button } from "@nextui-org/react";
import { FiSearch } from "react-icons/fi";
import { motion } from "framer-motion";
import { FormattedMessage, useIntl } from "react-intl";
import Checkbox from "@/components/checkbox";
import { StaffOperation } from "@/TDLib/main";
import NotiPopup from "@/components/notification";

type Props = {
    columnsData: any[];
    tableData: any[];
    reloadData: any;
    setSelectedId: any;
    selectedId: any
};

const CheckTable = (props: Props) => {
    const { columnsData, tableData, reloadData, setSelectedId, selectedId } = props;
    const staffOperation = new StaffOperation();
    const columns = useMemo(() => columnsData, [columnsData]);
    const data = useMemo(() => tableData, [tableData]);
    const [searchValue, setSearchValue] = useState("");
    const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null);
    const [currentPageInput, setCurrentPageInput] = useState(1);
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
    const agencyRole = ["AGENCY_MANAGER", "AGENCY_HUMAN_RESOURCE_MANAGER", "AGENCY_TELLER", "AGENCY_COMPLAINTS_SOLVER"];
    const adminRole = ["ADMIN", "MANAGER", "HUMAN_RESOURCE_MANAGER", "TELLER", "COMPLAINTS_SOLVER"];
    const [message, setMessage] = useState("")
    const [error, setError] = useState(false)
    const toggleRowSelection = (rowIndex: number) => {
        if (selectedRowIndex === rowIndex) {
            setSelectedRowIndex(null);
            setSelectedId({
                ...selectedId!,
                account: {
                    id: null
                },
                role: null,
            });
        } else {
            setSelectedRowIndex(rowIndex);
            setSelectedId({
                ...selectedId!,
                account: {
                    id: tableData[rowIndex]?.id
                },
                role: tableData[rowIndex]?.role,
            })
        }
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

    return (
        <>
            {error && <NotiPopup message={message} onClose={() => { setError(false) }} />}
            <div className="flex justify-between items-center flex-col lg:flex-row">
                <div className="flex flex-col lg:flex-row gap-3 h-full mb-2 lg:mb-0 w-full place-items-center">
                    <div
                        className={`relative flex items-center bg-lightPrimary rounded-full text-navy-700 dark:bg-[#3A3B3C] dark:text-white lg:w-[300px] w-full`}
                    >
                        <motion.button
                            className={`text-xl h-10 w-8 px-2 ml-2 flex justify-center rounded-full place-items-center`}
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
                                setGlobalFilter(e.target.value);
                            }}
                            type="text"
                            placeholder={intl.formatMessage({ id: "Navbar.Search" })}
                            className={`block h-full w-full rounded-full bg-lightPrimary text-sm font-medium text-navy-800 dark:text-white placeholder:text-navy-800 placeholder:dark:text-gray-300 outline-none dark:bg-[#3A3B3C] pl-1 pr-3`}
                        />
                    </div>
                    <div className="grid grid-cols-1 lg:flex gap-3 h-full mb-2 lg:mb-0 w-full place-items-center">
                        <Button className={`col-span-1 w-full lg:w-fit flex items-center text-md hover:cursor-pointer bg-lightPrimary p-2 hover:bg-gray-100 dark:bg-[#3A3B3C] dark:hover:bg-white/20 dark:active:bg-white/10 linear justify-center rounded-lg font-medium dark:font-base transition duration-200`}
                            onClick={reloadData}>
                            <MdRestartAlt />Tải lại
                        </Button>
                    </div>
                </div>
                <div className="gap-2 h-full hidden lg:flex">
                    <input
                        type="string"
                        value={currentPageInput}
                        onChange={handlePageInputChange}
                        className="w-10 text-center focus:outline-none font-semibold dark:bg-[#3A3B3C] bg-lightPrimary dark:text-white flex items-center rounded-full"
                    />
                    <Button className={`flex items-center text-md hover:cursor-pointer bg-lightPrimary p-2 text-navy-800 dark:text-white border border-gray-200 dark:!border-none hover:bg-gray-100 dark:bg-[#3A3B3C] dark:hover:bg-white/20 dark:active:bg-white/10 linear justify-center rounded-full font-bold transition duration-200`} onClick={() => previousPage()} disabled={!canPreviousPage}>
                        <MdNavigateBefore className="w-6 h-6" />
                    </Button>
                    <Button className={`flex items-center text-md hover:cursor-pointer bg-lightPrimary p-2 text-navy-800 dark:text-white border border-gray-200 dark:!border-none hover:bg-gray-100 dark:bg-[#3A3B3C] dark:hover:bg-white/20 dark:active:bg-white/10 linear justify-center rounded-full font-bold transition duration-200`} onClick={() => nextPage()} disabled={!canNextPage}>
                        <MdNavigateNext className="w-6 h-6" />
                    </Button>
                </div>
            </div>
            {tableData.length == 0 ? <div className="h-full flex w-full place-items-center text-center justify-center"><FormattedMessage id="History.Message" /></div>
                : <div className="mt-4 sm:mt-8 overflow-x-auto no-scrollbar relative h-full">
                    <table {...getTableProps()} className="w-full sticky" color="gray-500">
                        <thead>
                            {headerGroups.map((headerGroup, index) => (
                                <tr {...headerGroup.getHeaderGroupProps()} key={index}>
                                    {headerGroup.headers.map((column, index) => (
                                        <th
                                            {...column.getHeaderProps(column.getSortByToggleProps())}
                                            className={`sticky top-0 z-10 bg-white dark:!bg-[#242526] border-b border-gray-200 pb-[10px] dark:!border-[#3A3B3C]`}
                                            key={index}
                                        >
                                            <div className={`text-xs font-bold tracking-wide text-gray-600 lg:text-xs whitespace-nowrap ${column.render("Header") === "detail" ? "text-end" : (column.render("Header") === "active" ? "text-center pr-4 lg:pr-0" : "text-start pr-4 lg:pr-0")}`}>
                                                {column.render("Header") === "Checkbox" ? "Chọn một"
                                                    : intl.formatMessage({ id: column.render("Header")?.toString() })}
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody {...getTableBodyProps()}>
                            {page.map((row, rowIndex) => {
                                prepareRow(row);
                                const isSelected = selectedRowIndex === rowIndex;
                                const rowClassName = isSelected ? `dark:bg-[#3A3B3C] bg-gray-200` : ``;
                                return (
                                    <tr
                                        {...row.getRowProps()}
                                        key={rowIndex}
                                        className={rowClassName}
                                    >
                                        {row.cells.map((cell, cellIndex) => {
                                            let renderData;
                                            if (cell.column.Header === "Checkbox") {
                                                renderData = (
                                                    <Checkbox
                                                        checked={isSelected}
                                                        onChange={() => toggleRowSelection(rowIndex)}
                                                    />
                                                );
                                            } else if (cell.column.Header === "active") {
                                                renderData = (
                                                    <p className="mt-1 text-sm font-bold dark:text-white whitespace-nowrap flex justify-center">
                                                        {cell.value ? <MdRadioButtonChecked className="text-green-500" /> : <MdRadioButtonUnchecked className="text-gray-300" />}
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
                                                        {/* Add any detail component if needed */}
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
                <Button className={`flex items-center text-md hover:cursor-pointer bg-lightPrimary p-2 text-navy-800 dark:text-white border border-gray-200 dark:!border-none hover:bg-gray-100 dark:bg-[#3A3B3C] dark:hover:bg-white/20 dark:active:bg-white/10 linear justify-center rounded-full font-bold transition duration-200`} onClick={() => previousPage()} disabled={!canPreviousPage}>
                    <MdNavigateBefore className="w-6 h-6" />
                </Button>
                <input
                    type="string"
                    value={currentPageInput}
                    onChange={handlePageInputChange}
                    className="w-10 text-center focus:outline-none font-semibold dark:bg-[#3A3B3C] bg-lightPrimary dark:text-white flex items-center rounded-full"
                />
                <Button className={`flex items-center text-md hover:cursor-pointer bg-lightPrimary p-2 text-navy-800 dark:text-white border border-gray-200 dark:!border-none hover:bg-gray-100 dark:bg-[#3A3B3C] dark:hover:bg-white/20 dark:active:bg-white/10 linear justify-center rounded-full font-bold transition duration-200`} onClick={() => nextPage()} disabled={!canNextPage}>
                    <MdNavigateNext className="w-6 h-6" />
                </Button>
            </div>
        </>
    );
};

export default CheckTable;
