'use client'
import React, { useEffect, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import DetailPopup from "@/components/popup";
import { AgencyOperation, Role, StaffOperation, UpdatingStaffPayload } from "@/TDLib/main";
import { usePassDataContext } from "@/providers/PassedData";
import InputField from "@/components/fields/InputField";
import Select from "react-select";
import { useThemeContext } from "@/providers/ThemeProvider";
import { Button } from "@nextui-org/react";
import { FaSave } from "react-icons/fa";
import { motion } from "framer-motion";
import { RiImageEditLine } from "react-icons/ri";
import { IoCloudUploadOutline } from "react-icons/io5";
import { customStyles } from "../styles/styles";
import _ from 'lodash';
import SubmitPopup from "@/components/submit";
import NotiPopup from "@/components/notification";
interface DetailStaffProps {
    onClose: () => void;
    dataInitial: any;
    reloadData: () => void;
}

const DetailStaff: React.FC<DetailStaffProps> = ({ onClose, dataInitial, reloadData }) => {
    const intl = useIntl();
    const [avatarUpload, setavatarUpload] = useState<File | "">("");
    const [profilePicture, setProfilePicture] = useState<any>(
        "/img/avatars/avatar_4.jpg"
    );
    const [openError, setOpenError] = useState(false);
    const [openError2, setOpenError2] = useState(false);
    const [message, setMessage] = useState("");
    const [openSubmit, setOpenSubmit] = useState(false);
    const { theme } = useThemeContext()
    const imgURL = "https://api2.tdlogistics.net.vn/v2/staffs/avatar/get?staffId="
    const [loading, setLoading] = useState(false)
    const staffOperation = new StaffOperation()
    const [data, setData] = useState<UpdatingStaffPayload>({
        fullname: "",
        username: "",
        dateOfBirth: "",
        role: 0,
        salary: 0,
        paidSalary: 0,
        province: "",
        district: "",
        town: "",
        detailAddress: "",
        managedWards: []
    });
    const [managedWard, setManagedWard] = useState<any>();
    const [data2, setData2] = useState<UpdatingStaffPayload>({
        fullname: "",
        username: "",
        dateOfBirth: "",
        role: 0,
        salary: 0,
        paidSalary: 0,
        province: "",
        district: "",
        town: "",
        detailAddress: "",
        managedWards: []
    });
    const [agencyId, setAgencyId] = useState({
        agencyId: "",
        cccd: ""
    });

    const handleSalaryChange = (value: string) => {
        const numericValue = value.replace(/\D/g, ''); // Remove non-numeric characters
        setData(prev => ({ ...prev, salary: parseFloat(numericValue) }));
    };

    const handlePaidSalaryChange = (value: string) => {
        const numericValue = value.replace(/\D/g, ''); // Remove non-numeric characters
        setData(prev => ({ ...prev, paidSalary: parseFloat(numericValue) }));
    };

    const fields: Array<{ id: any, type: string, label: string, onChange?: (value: string) => void }> = [
        { id: "staffId", type: "text", label: "AddStaff.StaffId" },
        { id: "username", type: "text", label: "AddStaff.Username" },
        { id: "fullname", type: "text", label: "AddStaff.FullName" },
        { id: "cccd", type: "text", label: "AddStaff.CCCD" },
        { id: "dateOfBirth", type: "date", label: "AddStaff.DateOfBirth" },
        { id: "position", type: "text", label: "AddStaff.Position" },
        { id: "role", type: "text", label: "AddStaff.Role" },
        { id: "salary", type: "text", label: "AddStaff.Salary", onChange: handleSalaryChange },
        { id: "paidSalary", type: "text", label: "AddStaff.PaidSalary", onChange: handlePaidSalaryChange },
        { id: "detailAddress", type: "text", label: "AddStaff.DetailAddress" }
    ];

    const handleFetchManagedWard = async () => {
        const agencyOperation = new AgencyOperation()
        const response2 = await staffOperation.getManagedWards(dataInitial.staffId)
        if (!response2.error) {
            setData({
                fullname: dataInitial.fullname ?? "",
                username: dataInitial.account?.username ?? "",
                dateOfBirth: dataInitial.dateOfBirth ?? "",
                role: dataInitial.account?.role ?? 0,
                salary: dataInitial.salary ?? 0,
                paidSalary: dataInitial.paidSalary ?? 0,
                province: dataInitial.province ?? "",
                district: dataInitial.district ?? "",
                town: dataInitial.town ?? "",
                detailAddress: dataInitial.detailAddress ?? "",
                managedWards: response2.data
            });
            setData2({
                fullname: dataInitial.fullname ?? "",
                username: dataInitial.account?.username ?? "",
                dateOfBirth: dataInitial.dateOfBirth ?? "",
                role: dataInitial.account?.role ?? 0,
                salary: dataInitial.salary ?? 0,
                paidSalary: dataInitial.paidSalary ?? 0,
                province: dataInitial.province ?? "",
                district: dataInitial.district ?? "",
                town: dataInitial.town ?? "",
                detailAddress: dataInitial.detailAddress ?? "",
                managedWards: response2.data
            })
        }
        const response = await agencyOperation.search({ agencyId: dataInitial.agencyId })
        setManagedWard(response.data[0]?.managedWards)
    };

    useEffect(() => {
        if (dataInitial.staffId && dataInitial.account.role == "SHIPPER") handleFetchManagedWard()
        else {
            setData({
                fullname: dataInitial.fullname ?? "",
                username: dataInitial.account?.username ?? "",
                dateOfBirth: dataInitial.dateOfBirth ?? "",
                role: dataInitial.account?.role ?? 0,
                salary: dataInitial.salary ?? 0,
                paidSalary: dataInitial.paidSalary ?? 0,
                province: dataInitial.province ?? "",
                district: dataInitial.district ?? "",
                town: dataInitial.town ?? "",
                detailAddress: dataInitial.detailAddress ?? "",
                managedWards: dataInitial.managedWards ?? []
            });
            setData2({
                fullname: dataInitial.fullname ?? "",
                username: dataInitial.account?.username ?? "",
                dateOfBirth: dataInitial.dateOfBirth ?? "",
                role: dataInitial.account?.role ?? 0,
                salary: dataInitial.salary ?? 0,
                paidSalary: dataInitial.paidSalary ?? 0,
                province: dataInitial.province ?? "",
                district: dataInitial.district ?? "",
                town: dataInitial.town ?? "",
                detailAddress: dataInitial.detailAddress ?? "",
                managedWards: dataInitial.managedWards ?? []
            })
        }
        if (dataInitial.avatar) setProfilePicture(`${imgURL}${dataInitial.staffId}`)

        setAgencyId({
            agencyId: dataInitial.agencyId ?? "",
            cccd: dataInitial.cccd ?? ""
        });
    }, [dataInitial]);

    const areEqual = (obj1: any, obj2: any) => {
        return _.isEqual(obj1, obj2);
    };


    const handleUpdate = () => {
        const isDataEqual = areEqual(data, data2);
        if (isDataEqual) {
            onClose();
        } else {
            setMessage("Xác nhận cập nhật thông tin nhân viên?")
            setOpenSubmit(true)
        }
    };

    const handleUpdate2 = async () => {
        console.log(dataInitial)
        const response = await staffOperation.update(data, { staffId: dataInitial.staffId })
        setOpenSubmit(false)
        if (!response.error) {
            setData2(data)
            setMessage("Cập nhật thông tin thành công")
            setOpenError2(true)
        } else {
            setMessage(response.message || response.error.message)
            setOpenError(true)
        }
    };


    const handleChange = (id: keyof UpdatingStaffPayload, value: string | number) => {
        setData(prev => ({ ...prev, [id]: value }));
    };

    const handleUploadAvatar = async () => {
        if (!avatarUpload) return;
        setLoading(true)
        const response = await staffOperation.updateAvatar({ avatar: avatarUpload }, { staffId: dataInitial.staffId })
        if (!response.error && !response.error?.error) {
            setProfilePicture(`${imgURL}${dataInitial.staffId}`)
            setavatarUpload("")
        }
        setLoading(false)
    };

    return (
        <>
            {openError && <NotiPopup message={message} onClose={() => setOpenError(false)} />}
            {openError2 && <NotiPopup message={message} onClose={() => { setOpenError2(false); reloadData(); onClose() }} />}
            {openSubmit && <SubmitPopup message={message} onClose={() => setOpenSubmit(false)} submit={handleUpdate2} />}
            <DetailPopup className2="sm:w-full md:w-2/3" onClose={onClose} title={"Thông tin nhân viên"}
                button={
                    <div className="w-full flex bottom-0 bg-white pt-2 dark:bg-[#242526] gap-2">
                        <Button
                            onClick={handleUpdate}
                            className="rounded-lg lg:h-11 w-full text-green-500 border-green-500 hover:border-green-600 bg-transparent hover:text-white border-2 hover:bg-green-600 hover:shadow-md flex sm:gap-2"
                        >
                            <FaSave />Lưu
                        </Button>
                    </div>
                }>

                <div className="flex flex-col gap-4 mb-2">
                    <div className="w-full flex justify-center flex-col place-items-center gap-4">
                        <div className="relative flex w-40 h-40 lg:w-60 lg:h-60 hover:cursor-pointer rounded-full overflow-hidden transition-all duration-500 cursor-pointer">
                            <motion.img
                                initial="initial"
                                animate="enter"
                                exit="exit"
                                transition={{ duration: 0.7 }}
                                className="w-full h-full object-cover"
                                height={2000}
                                width={2000}
                                src={avatarUpload ? URL.createObjectURL(avatarUpload) : (profilePicture ? profilePicture : '/img/avatars/avatar_4.jpg')}
                            // onClick={() => setModalIsOpen(true)}
                            />
                            <label className="absolute w-full h-20px py-2.5 bottom-0 inset-x-0 bg-[#000000]/50 
                  text-white text-2xl flex items-center hover:cursor-pointer justify-center 
                  active:scale-150 transition-all ease-in-out duration-500">
                                <RiImageEditLine />
                                <input
                                    type="file"
                                    className="hidden"
                                    onChange={(e) => {
                                        const file = e.target?.files ? e.target?.files[0] : "";
                                        setavatarUpload(file);
                                    }}
                                />
                            </label>
                        </div>
                        {avatarUpload &&
                            <div className="w-full flex justify-center">
                                <button
                                    onClick={loading ? () => { } : handleUploadAvatar}
                                    className="linear w-full sm:w-2/3 border-2 rounded-xl h-10 text-base font-medium transition duration-200 dark:text-white flex justify-center place-items-center"
                                >
                                    {loading ? <svg aria-hidden="true" className="w-20 h-6 text-gray-200 animate-spin dark:text-gray-600 fill-red-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                                    </svg> : <div className="flex gap-2 justify-center place-items-center"><IoCloudUploadOutline />Xác nhận tải lên</div>}
                                </button>
                            </div>
                        }
                    </div>
                    {fields.map(({ id, type, label, onChange }) => (
                        <div key={id} className="flex gap-2 w-full flex-col lg:flex-row">
                            <div className='lg:w-44 lg:min-w-[11rem] flex lg:justify-between place-items-center'>
                                <strong><FormattedMessage id={label} /></strong>:
                            </div>
                            <p className="whitespace-nowrap flex flex-row gap-2 relative w-full">
                                {label == "AddStaff.CCCD" || label == "AddStaff.Role" || label == "AddStaff.StaffId" ?
                                    (<InputField
                                        variant="auth1"
                                        id={label}
                                        type={type}
                                        disabled={true}
                                        //@ts-ignore
                                        value={label == "AddStaff.CCCD" ? agencyId.cccd : label == "AddStaff.StaffId" ? dataInitial.staffId : `${intl.formatMessage({ id: dataInitial.account.role })} (${dataInitial.account.role})`}
                                        className="bg-white dark:!bg-[#3a3b3c] w-full"
                                        extra="w-full"
                                    />)
                                    : (
                                        <InputField
                                            variant="auth1"
                                            id={id}
                                            type={type}
                                            //@ts-ignore
                                            value={data[id] as string}
                                            setValue={(value: string) => onChange ? onChange(value) : handleChange(id, value)}
                                            className="bg-white dark:!bg-[#3a3b3c] w-full"
                                            extra="w-full"
                                        />
                                    )}
                            </p>
                        </div>
                    ))}
                    {dataInitial.account.role && dataInitial.account.role == "SHIPPER" &&
                        <div className="flex gap-2 w-full flex-col lg:flex-row">
                            <div className='lg:w-44 lg:min-w-[11rem] flex lg:justify-between place-items-center'>
                                <strong><FormattedMessage id="OrderForm.LocationForm.SelectManagedWard" /></strong>:
                            </div>
                            <p className="whitespace-nowrap flex flex-row gap-2 relative w-full">
                                <Select
                                    noOptionsMessage={() => "Đã hết khu vực có thể chọn"}
                                    id="ward"
                                    instanceId="ward"
                                    isSearchable={true}
                                    isMulti
                                    menuPlacement="top"
                                    className={`flex items-center text-navy-800 dark:bg-[#3a3b3c] dark:text-white w-full rounded-xl bg-white`}
                                    styles={customStyles(theme)}
                                    placeholder={intl.formatMessage({ id: 'OrderForm.LocationForm.SelectManagedWard' })}
                                    //@ts-ignore
                                    value={data.managedWards?.map((ward) => ({ value: ward, label: ward }))}
                                    onChange={(selectedOptions) =>
                                        setData({
                                            ...data,
                                            managedWards: selectedOptions ? selectedOptions.map(option => option.value) : []
                                        })
                                    }
                                    options={managedWard?.map((ward: string) => ({ value: ward, label: ward }))}
                                    components={{ DropdownIndicator: () => null, IndicatorSeparator: () => null }}
                                    formatOptionLabel={(option: { value: string, label: string }) => (
                                        <div className="flex items-center space-x-2">
                                            <span className="ml-2 text-sm font-medium">{option.label}</span>
                                        </div>
                                    )}
                                />
                            </p>
                        </div>
                    }
                </div>
            </DetailPopup></>

    );
};

export default DetailStaff;
