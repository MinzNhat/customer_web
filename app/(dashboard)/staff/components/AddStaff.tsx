'use client'

import { AdministrativeOperation, AgencyOperation, AuthOperation, RegisteringPayload, Role, StaffOperation, TransportPartnerStaffOperation } from "@/TDLib/main";
import InputField from "@/components/fields/InputField";
import NotiPopup from "@/components/notification";
import DetailPopup from "@/components/popup";
import SubmitPopup from "@/components/submit";
import { usePassDataContext } from "@/providers/PassedData";
import { useThemeContext } from "@/providers/ThemeProvider";
import { Button } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { FaSave } from "react-icons/fa";
import { FormattedMessage, useIntl } from "react-intl";
import Select from "react-select";
import AccountTable from "./account/Account";
import Image from "next/image";
import { motion } from "framer-motion";
import { customStyles } from "../styles/styles";
import RenderCase from "@/components/rendercase";
interface CreatingStaff {
    account: {
        id: string | null
    },
    fullname: string,
    dateOfBirth: string,
    cccd: string,
    role: string,
    position: string,
    salary: number,
    paidSalary: number,
    province: string,
    district: string,
    town: string,
    detailAddress: string,
}
interface AdditionalInfo {
    agencyId: string,
    partnerId: string,
    bin: string,
    bank: string,
    managedWards: string[],
}
const AddStaff = ({ setOpenAdd, reloadData }: { setOpenAdd: any, reloadData: any }) => {
    const intl = useIntl();
    const { passData, setPassData } = usePassDataContext();
    const [registerInfo, setRegisterInfo] = useState<RegisteringPayload>({
        username: "",
        password: "",
        email: "",
        phoneNumber: "",
        role: Role.SHIPPER
    });
    const [option, setOption] = useState(0)
    const { theme } = useThemeContext()
    const [openSubmit, setOpenSubmit] = useState(false)
    const [openSubmit2, setOpenSubmit2] = useState(false)
    const [openError, setOpenError] = useState(false)
    const [openError2, setOpenError2] = useState(false)
    const adminRole = ["ADMIN", "MANAGER", "HUMAN_RESOURCE_MANAGER", "TELLER", "COMPLAINTS_SOLVER"];
    const agencyRole = ["AGENCY_MANAGER", "AGENCY_HUMAN_RESOURCE_MANAGER", "AGENCY_TELLER", "AGENCY_COMPLAINTS_SOLVER"];
    const [openSelectAccount, setOpenSelectAccount] = useState(false);
    const [idAccount, setIdAccount] = useState<CreatingStaff>(
        {
            account: {
                id: null
            },
            fullname: "",
            dateOfBirth: "",
            cccd: "",
            role: "",
            position: "",
            salary: 0,
            paidSalary: 0,
            province: "",
            district: "",
            town: "",
            detailAddress: "",
        }
    )
    const [additionalInfo, setAdditionalInfo] = useState<AdditionalInfo>(
        {
            agencyId: "",
            bank: "",
            bin: "",
            partnerId: "",
            managedWards: []
        }
    )
    const [message, setMessage] = useState<any>("")
    const [currentForm, setCurrentForm] = useState(0)
    const emailRegex = /^[a-zA-Z0-9._-]{1,64}@[a-zA-Z0-9._-]{1,255}\.[a-zA-Z]{2,4}$/;
    const phoneNumberRegex = /^[0-9]{10,11}$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d])\S{8,}$/;
    const agencyRegex = /^(TD|BC|DL)_\d{5}_\d{12}$/;
    const adminOperation = new AdministrativeOperation();
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [selectedProvince, setSelectedProvince] = useState<any>("");
    const [selectedDistrict, setSelectedDistrict] = useState<any>("");
    const [selectedWard, setSelectedWard] = useState<any>("");
    const [managedWard, setManagedWard] = useState<any>();
    const handleProvinceChange = async (selectedOption: any) => {
        setSelectedProvince(selectedOption);
        const a = { province: selectedOption.value };
        setIdAccount((prevState: any) => ({
            ...prevState,
            province: selectedOption.value,
            district: "",
            town: "",
        }));
        const response = await adminOperation.get(a);
        setDistricts(response.data);
        setSelectedDistrict(null);
        setSelectedWard(null)
    };

    const handleDistrictChange = async (selectedOption: any) => {
        setSelectedDistrict(selectedOption);
        const a = { province: selectedProvince.value, district: selectedOption.value };
        setIdAccount((prevState: any) => ({
            ...prevState,
            district: selectedOption.value,
            town: "",
        }));
        const response = await adminOperation.get(a);
        setWards(response.data);
        setSelectedWard(null)
    };

    const fetchManagedWard = async () => {
        const agencyOperation = new AgencyOperation()
        if (adminRole.includes(passData.account.role) && additionalInfo.agencyId == "") {
            setMessage("Vui lòng điền mã bưu cục")
            setOpenError(true)
            return
        } else if (adminRole.includes(passData.account.role) && !agencyRegex.test(additionalInfo.agencyId)) {
            setMessage("Mã bưu cục không hợp lệ")
            setOpenError(true)
            return
        }
        if (adminRole.includes(passData.account.role)) {
            const response = await agencyOperation.search({ agencyId: additionalInfo.agencyId })
            setManagedWard(response.data[0]?.managedWards)
        } else {
            const response = await agencyOperation.search({ agencyId: passData.agencyId })
            setManagedWard(response.data[0]?.managedWards)
        }
    };

    const sortData = (data: any) => {
        const cities = data.filter((item: any) => item.startsWith("Thành phố"));
        const provinces = data.filter((item: any) => !item.startsWith("Thành phố"));
        return cities.concat(provinces);
    };

    const fetchData = async () => {
        const response = await adminOperation.get({});
        if (response.data) {
            const data = sortData(response.data);
            setProvinces(data);
        }
    };

    const handleWardChange = (selectedOption: any) => {
        setSelectedWard(selectedOption);
        setIdAccount((prevState: any) => ({
            ...prevState,
            town: selectedOption.value,
        }));
    };
    const role = [
        { value: Role.CUSTOMER.toString(), label: "CUSTOMER" },
        { value: Role.ADMIN.toString(), label: "ADMIN" },
        { value: Role.MANAGER.toString(), label: "MANAGER" },
        { value: Role.HUMAN_RESOURCE_MANAGER.toString(), label: "HUMAN_RESOURCE_MANAGER" },
        { value: Role.TELLER.toString(), label: "TELLER" },
        { value: Role.COMPLAINTS_SOLVER.toString(), label: "COMPLAINTS_SOLVER" },
        { value: Role.AGENCY_MANAGER.toString(), label: "AGENCY_MANAGER" },
        { value: Role.AGENCY_HUMAN_RESOURCE_MANAGER.toString(), label: "AGENCY_HUMAN_RESOURCE_MANAGER" },
        { value: Role.AGENCY_TELLER.toString(), label: "AGENCY_TELLER" },
        { value: Role.AGENCY_COMPLAINTS_SOLVER.toString(), label: "AGENCY_COMPLAINTS_SOLVER" },
        { value: Role.SHIPPER.toString(), label: "SHIPPER" },
        { value: Role.DRIVER.toString(), label: "DRIVER" },
        { value: Role.TRANSPORT_PARTNER_REPRESENTOR.toString(), label: "TRANSPORT_PARTNER_REPRESENTOR" }
    ];

    const getAvailableRoles = () => {
        if (adminRole.includes(passData.account.role)) {
            return role;
        } else if (agencyRole.includes(passData.account.role)) {
            return role.filter(r => r.label.startsWith("AGENCY") || r.label == "SHIPPER" || r.label == "DRIVER");
        }
        return [];
    };

    const handleChange = (field: keyof RegisteringPayload, value: string | number) => {
        setRegisterInfo(prev => ({ ...prev, [field]: value }));
    };

    const handleChange2 = (field: keyof CreatingStaff, value: string | number) => {
        setIdAccount(prev => ({ ...prev, [field]: value }));
    };

    const handleChange3 = (field: keyof AdditionalInfo, value: string | number) => {
        setAdditionalInfo(prev => ({ ...prev, [field]: value }));
    };

    const handlePhoneNumberChange = (value: string) => {
        const numericValue = value.replace(/\D/g, ''); // Remove non-numeric characters
        setRegisterInfo(prev => ({ ...prev, phoneNumber: numericValue }));
    };

    const handleSalaryChange = (value: string) => {
        const numericValue = value.replace(/\D/g, ''); // Remove non-numeric characters
        setIdAccount(prev => ({ ...prev, salary: parseFloat(numericValue) }));
    };

    const handlePaidSalaryChange = (value: string) => {
        const numericValue = value.replace(/\D/g, ''); // Remove non-numeric characters
        setIdAccount(prev => ({ ...prev, paidSalary: parseFloat(numericValue) }));
    };

    const fields: Array<{ id: keyof RegisteringPayload, type: string, label: string, onChange?: (value: string) => void }> = [
        { id: "username", type: "text", label: "AddStaff.Username" },
        { id: "password", type: "password", label: "AddStaff.Password" },
        { id: "email", type: "email", label: "AddStaff.Email" },
        { id: "phoneNumber", type: "text", label: "AddStaff.PhoneNumber", onChange: handlePhoneNumberChange }
    ];

    const fields2: Array<{ id: keyof CreatingStaff, type: string, label: string, onChange?: (value: string) => void }> = [
        { id: "fullname", type: "text", label: "AddStaff.FullName" },
        { id: "dateOfBirth", type: "date", label: "AddStaff.DateOfBirth" },
        { id: "cccd", type: "text", label: "AddStaff.CCCD" },
        { id: "position", type: "text", label: "AddStaff.Position" },
        { id: "salary", type: "text", label: "AddStaff.Salary", onChange: handleSalaryChange },
        { id: "paidSalary", type: "text", label: "AddStaff.PaidSalary", onChange: handlePaidSalaryChange },
        { id: "detailAddress", type: "text", label: "AddStaff.DetailAddress" }
    ];

    const [fields3, setFields3] = useState<Array<{ id: keyof AdditionalInfo, type: string, label: string, onChange?: (value: string) => void }>>()

    const getAvailableFields = () => {
        let fields: Array<{ id: keyof AdditionalInfo, type: string, label: string, onChange?: (value: string) => void }> = [
            { id: "bank", type: "text", label: "AddStaff.Bank" },
            { id: "bin", type: "text", label: "AddStaff.Bin" },
            { id: "agencyId", type: "text", label: "AddStaff.AgencyId" },
            { id: "partnerId", type: "text", label: "AddStaff.PartnerId" },
        ];
        if (option === 0) {
            fields = fields.filter(field => field.id !== "partnerId");
        }
        if (idAccount.role !== "SHIPPER") {
            fields = fields.filter(field => field.id !== "bin" && field.id !== "bank");
        }
        if (!adminRole.includes(passData.account.role)) {
            fields = fields.filter(field => field.id !== "agencyId");
        }
        return fields;
    };

    useEffect(() => {
        if (passData.account.role) setFields3(getAvailableFields())
    }, [option, idAccount.role, passData.account.role]);

    const submitClick = () => {
        if (currentForm == 0 && !idAccount.account.id) {
            if (!registerInfo.username) {
                setMessage("Vui lòng nhập tên tài khoản");
                setOpenError(true)
                return;
            }
            if (!registerInfo.password) {
                setMessage("Vui lòng nhập mật khẩu");
                setOpenError(true)
                return;
            }
            if (!registerInfo.email) {
                setMessage("Vui lòng nhập email");
                setOpenError(true)
                return;
            }
            if (!registerInfo.phoneNumber) {
                setMessage("Vui lòng nhập số điện thoại");
                setOpenError(true)
                return;
            }
            if (!passwordRegex.test(registerInfo.password)) {
                setMessage(<div className="bg-red-100 border border-red-400 text-red-700 dark:text-red-500 dark:!bg-white/0 px-4 py-3 rounded relative">
                    <p className="font-bold">Mật khẩu không hợp lệ, vui lòng nhập mật khẩu khác:</p>
                    <ul className="list-disc list-inside mt-2 text-left w-full">
                        <li>Có ít nhất một chữ thường.</li>
                        <li>Có ít nhất một chữ hoa.</li>
                        <li>Có ít nhất một chữ số.</li>
                        <li>Có ít nhất một ký tự đặc biệt.</li>
                        <li>Không có khoảng trắng.</li>
                        <li>Độ dài tối thiểu là 8 ký tự.</li>
                    </ul>
                </div>);
                setOpenError(true)
                return;
            }
            if (!emailRegex.test(registerInfo.email)) {
                setMessage("Vui lòng nhập đúng định dạng email");
                setOpenError(true)
                return;
            }
            if (!phoneNumberRegex.test(registerInfo.phoneNumber)) {
                setMessage("Vui lòng nhập đúng định dạng số điện thoại");
                setOpenError(true)
                return;
            }
            setMessage("Xác nhận tạo tài khoản?")
            setOpenSubmit(true)
        } else if (currentForm == 1) {
            if (idAccount.fullname == "" || idAccount.dateOfBirth == "" || idAccount.cccd == "" || idAccount.position == "" || idAccount.province == ""
                || idAccount.district == "" || idAccount.town == "" || idAccount.detailAddress == "" || idAccount.salary == 0) {
                setMessage("Vui lòng điền đầy đủ các trường thông tin, tiền lương phải là một con số khác 0")
                setOpenError(true)
                return
            }
            if (adminRole.includes(passData.account.role) && additionalInfo.agencyId == "") {
                setMessage("Vui lòng điền mã bưu cục")
                setOpenError(true)
                return
            } else if (adminRole.includes(passData.account.role) && !agencyRegex.test(additionalInfo.agencyId)) {
                setMessage("Mã bưu cục không hợp lệ")
                setOpenError(true)
                return
            }
            if (idAccount.role == "SHIPPER" && additionalInfo.managedWards.length == 0) {
                setMessage("Vui lòng chọn khu vực hoạt động cho nhân viên")
                setOpenError(true)
                return
            }
            if (option == 1 && !additionalInfo.partnerId) {
                setMessage("Vui lòng nhập mã đối tác vận chuyển")
                setOpenError(true)
                return
            }
            setMessage("Xác nhận tạo nhân viên?")
            setOpenSubmit2(true)
        }
    };

    const submitClick2 = () => {
        if (idAccount.account.id && idAccount.role) {
            setOpenSelectAccount(false)
            setCurrentForm(1)
        }
        setOpenSelectAccount(false)
    };

    const createAccount = async () => {
        const authOperation = new AuthOperation()
        const response = await authOperation.register(registerInfo)
        if (!response.error) {
            setIdAccount({
                ...idAccount!,
                account: {
                    id: response.data.id
                },
                role: Role[registerInfo.role],
            })
            setCurrentForm(1)
        } else {
            setOpenSubmit(false)
            setMessage(response.message || response.error.message)
            setOpenError(true)
        }
        setOpenSubmit(false)
    };

    const getRoleIndex = (role: string): number | undefined => {
        const roleIndex = Object.values(Role).indexOf(role);
        if (roleIndex !== -1) {
            return roleIndex;
        }
        return undefined;
    };

    const createStaff = async () => {
        const staffOperation = new StaffOperation()
        const transportOperation = new TransportPartnerStaffOperation()
        let submitInfo: any = { ...idAccount, role: getRoleIndex(idAccount.role) }
        let response: any
        if (idAccount.role == "SHIPPER") {
            submitInfo.managedWards = additionalInfo.managedWards
            if (additionalInfo.bank != "") submitInfo.bank = additionalInfo.bank
            if (additionalInfo.bin != "") submitInfo.bin = additionalInfo.bin
        }
        if (option == 0) {
            if (adminRole.includes(passData.account.role)) {
                submitInfo.agencyId = additionalInfo.agencyId
                response = await staffOperation.createByAdmin(submitInfo)
            } else {
                response = await staffOperation.createByAgency(submitInfo)
            }
        } else if (option == 1) {
            submitInfo.partnerId = additionalInfo.partnerId
            if (adminRole.includes(passData.account.role)) {
                submitInfo.agencyId = additionalInfo.agencyId
                response = await transportOperation.createByAdmin(submitInfo)
            } else {
                response = await transportOperation.createByAgency(submitInfo)
            }
        }
        setOpenSubmit2(false)
        if (response && response.error) {
            setMessage(response.message || response.error.message)
            setOpenError(true)
        } else {
            setMessage("Tạo nhân viên mới thành công!")
            setOpenError2(true)
        }
    };

    useEffect(() => {
        fetchData()
    }, []);

    return (
        <DetailPopup
            onClose={() => setOpenAdd(false)}
            title={intl.formatMessage({ id: "AddStaff.Title" })}
            className2="lg:w-[55%]"
            className={currentForm == 0 ? undefined : "pt-0"}
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
            {openSelectAccount && <DetailPopup
                button={
                    <div className="w-full flex bottom-0 bg-white pt-2 dark:bg-[#242526] gap-2">
                        <Button
                            onClick={submitClick2}
                            className="rounded-lg lg:h-11 w-full text-green-500 border-green-500 hover:border-green-600 bg-transparent hover:text-white border-2 hover:bg-green-600 hover:shadow-md flex sm:gap-2"
                        >
                            Xác nhận
                        </Button>
                    </div>
                }
                onClose={() => setOpenSelectAccount(false)}
                title={`Chọn tài khoản`}>
                <AccountTable setSelectedId={setIdAccount} selectedId={idAccount} />
            </DetailPopup>}
            {openError && <NotiPopup message={message} onClose={() => setOpenError(false)} />}
            {openError2 && <NotiPopup message={message} onClose={() => { setOpenError2(false); reloadData() }} />}
            {openSubmit && <SubmitPopup message={message} onClose={() => setOpenSubmit(false)} submit={createAccount} />}
            {openSubmit2 && <SubmitPopup message={message} onClose={() => setOpenSubmit2(false)} submit={createStaff} />}
            {currentForm == 0 &&
                <div className="flex flex-col gap-2 mb-2">
                    <div
                        onClick={() => { setOpenSelectAccount(true) }}
                        className="flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-white border hover:cursor-pointer dark:bg-[#3a3b3c]">
                        <Image src="/Logo.png" alt="Your image" width={20} height={20} />
                        <span className="text-[14px] font-medium text-[#000000] dark:text-white font-sans focus:outline-none">
                            Chọn tài khoản đã tạo
                        </span>
                    </div>
                    <div className="flex items-center gap-3 my-1">
                        <div className="h-px w-full bg-gray-200" />
                        <p className="text-base text-gray-600 dark:text-white">
                            {" "}
                            <FormattedMessage id="Login.Or" />{" "}
                        </p>
                        <div className="h-px w-full bg-gray-200" />
                    </div>

                    {fields.map(({ id, type, label, onChange }) => (
                        <div key={id} className="flex gap-2 w-full flex-col lg:flex-row">
                            <div className='lg:w-44 lg:min-w-[11rem] flex lg:justify-between place-items-center'>
                                <strong><FormattedMessage id={label} /></strong>:
                            </div>
                            <p className="whitespace-nowrap flex flex-row gap-2 relative w-full">
                                <InputField
                                    variant="auth1"
                                    id={id}
                                    type={type}
                                    value={registerInfo[id] as string}
                                    setValue={(value: string) => onChange ? onChange(value) : handleChange(id, value)}
                                    className="bg-white dark:!bg-[#3a3b3c] w-full"
                                    extra="w-full"
                                />
                            </p>
                        </div>
                    ))}
                    <div className="flex gap-2 w-full flex-col lg:flex-row">
                        <div className='lg:w-44 lg:min-w-[11rem] flex lg:justify-between place-items-center'>
                            <strong><FormattedMessage id="AddStaff.Role" /></strong>:
                        </div>
                        <p className="whitespace-nowrap flex flex-row gap-2 relative w-full">
                            <Select
                                id="roleSelect"
                                instanceId="roleSelect"
                                isSearchable={false}
                                className={`flex items-center h-10 text-navy-800 dark:bg-[#3a3b3c] dark:text-white w-full rounded-xl bg-white`}
                                styles={customStyles(theme)}
                                menuPlacement="top"
                                placeholder={intl.formatMessage({ id: 'AddStaff.SelectRole' })}
                                value={role.find((option: any) => parseFloat(option.value) == registerInfo.role)}
                                onChange={(selectedOption: any) => handleChange("role", parseFloat(selectedOption.value))}
                                options={getAvailableRoles()}
                                formatOptionLabel={(option: { value: string, label: string }) => (
                                    <div className="flex items-center space-x-2 truncate">
                                        <span className="ml-2 text-sm font-medium"><FormattedMessage id={option.label} /> ({option.label})</span>
                                    </div>
                                )}
                            />
                        </p>
                    </div>

                </div>}
            {currentForm == 1 &&
                <div className="flex flex-col gap-2 mb-2">
                    <div className="sticky top-0 w-full flex bg-white dark:bg-[#242526] mb-2 z-10">
                        <Button className={`w-full flex flex-row p-2 ${option === 0 ? "text-red-500 font-semibold" : "text-black"}`} onClick={() => setOption(0)}>
                            <span className="text-sm sm:text-base"><FormattedMessage id="Mission.Pickup" /></span>
                        </Button>
                        <Button className={`w-full flex flex-row p-2 ${option === 1 ? "text-red-500 font-semibold" : "text-black"}`} onClick={() => setOption(1)}>
                            <span className="text-sm sm:text-base"><FormattedMessage id="Mission.Receive" /></span>
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
                    {fields2.map(({ id, type, label, onChange }) => (
                        <div key={id} className="flex gap-2 w-full flex-col lg:flex-row">
                            <div className='lg:w-44 lg:min-w-[11rem] flex lg:justify-between place-items-center'>
                                <strong><FormattedMessage id={label} /></strong>:
                            </div>
                            <p className="whitespace-nowrap flex flex-row gap-2 relative w-full">
                                <InputField
                                    variant="auth1"
                                    id={id}
                                    type={type}
                                    value={idAccount[id] as string}
                                    setValue={(value: string) => onChange ? onChange(value) : handleChange2(id, value)}
                                    className="bg-white dark:!bg-[#3a3b3c] w-full"
                                    extra="w-full"
                                />
                            </p>
                        </div>
                    ))}
                    <div className="flex gap-2 w-full flex-col lg:flex-row">
                        <div className='lg:w-44 lg:min-w-[11rem] flex lg:justify-between place-items-center'>
                            <strong><FormattedMessage id="OrderForm.LocationForm.SelectProvince" /></strong>:
                        </div>
                        <p className="whitespace-nowrap flex flex-row gap-2 relative w-full">
                            <Select
                                id="city"
                                instanceId="city"
                                isSearchable={true}
                                className={`flex items-center h-10 text-navy-800 dark:bg-[#3a3b3c] dark:text-white w-full rounded-xl bg-white`}
                                styles={customStyles(theme)}
                                placeholder={intl.formatMessage({ id: 'OrderForm.LocationForm.SelectProvince' })}
                                onChange={handleProvinceChange}
                                value={selectedProvince}
                                options={provinces?.map((city) => ({ value: city, label: city }))}
                                components={{ DropdownIndicator: () => null, IndicatorSeparator: () => null }}
                                formatOptionLabel={(option: { value: string, label: string }) => (
                                    <div className="flex items-center space-x-2">
                                        <span className="ml-2 text-sm font-medium">{option.label}</span>
                                    </div>
                                )}
                            />
                        </p>
                    </div>
                    <div className="flex gap-2 w-full flex-col lg:flex-row">
                        <div className='lg:w-44 lg:min-w-[11rem] flex lg:justify-between place-items-center'>
                            <strong><FormattedMessage id="OrderForm.LocationForm.SelectDistrict" /></strong>:
                        </div>
                        <p className="whitespace-nowrap flex flex-row gap-2 relative w-full">
                            <Select
                                id="district"
                                instanceId="district"
                                isSearchable={true}
                                className={`flex items-center h-10 text-navy-800 dark:bg-[#3a3b3c] dark:text-white w-full rounded-xl bg-white`}
                                styles={customStyles(theme)}
                                placeholder={intl.formatMessage({ id: 'OrderForm.LocationForm.SelectDistrict' })}
                                value={selectedDistrict}
                                onChange={handleDistrictChange}
                                options={districts?.map((district) => ({
                                    value: district,
                                    label: district,
                                }))}
                                components={{ DropdownIndicator: () => null, IndicatorSeparator: () => null }}
                                formatOptionLabel={(option: { value: string, label: string }) => (
                                    <div className="flex items-center space-x-2">
                                        <span className="ml-2 text-sm font-medium">{option.label}</span>
                                    </div>
                                )}
                            />
                        </p>
                    </div>
                    <div className="flex gap-2 w-full flex-col lg:flex-row">
                        <div className='lg:w-44 lg:min-w-[11rem] flex lg:justify-between place-items-center'>
                            <strong><FormattedMessage id="OrderForm.LocationForm.SelectWard" /></strong>:
                        </div>
                        <p className="whitespace-nowrap flex flex-row gap-2 relative w-full">
                            <Select
                                id="ward"
                                instanceId="ward"
                                isSearchable={true}
                                className={`flex items-center h-10 text-navy-800 dark:bg-[#3a3b3c] dark:text-white w-full rounded-xl bg-white`}
                                styles={customStyles(theme)}
                                placeholder={intl.formatMessage({ id: 'OrderForm.LocationForm.SelectWard' })}
                                value={selectedWard}
                                onChange={handleWardChange}
                                options={wards?.map((ward) => ({ value: ward, label: ward }))}
                                components={{ DropdownIndicator: () => null, IndicatorSeparator: () => null }}
                                formatOptionLabel={(option: { value: string, label: string }) => (
                                    <div className="flex items-center space-x-2">
                                        <span className="ml-2 text-sm font-medium">{option.label}</span>
                                    </div>
                                )}
                            />
                        </p>
                    </div>
                    {fields3?.map(({ id, type, label, onChange }) => (
                        <div key={id} className="flex gap-2 w-full flex-col lg:flex-row">
                            <div className='lg:w-44 lg:min-w-[11rem] flex lg:justify-between place-items-center'>
                                <strong><FormattedMessage id={label} /></strong>:
                            </div>
                            <p className="whitespace-nowrap flex flex-row gap-2 relative w-full">
                                <InputField
                                    variant="auth1"
                                    id={id}
                                    type={type}
                                    value={additionalInfo[id] as string}
                                    setValue={(value: string) => onChange ? onChange(value) : handleChange3(id, value)}
                                    className="bg-white dark:!bg-[#3a3b3c] w-full"
                                    extra="w-full"
                                />
                            </p>
                        </div>
                    ))}
                    {idAccount.role && idAccount.role == "SHIPPER" &&
                        <div className="flex gap-2 w-full flex-col lg:flex-row">
                            <div className='lg:w-44 lg:min-w-[11rem] flex lg:justify-between place-items-center'>
                                <strong><FormattedMessage id="OrderForm.LocationForm.SelectManagedWard" /></strong>:
                            </div>
                            <p className="whitespace-nowrap flex flex-row gap-2 relative w-full">
                                <Select
                                    noOptionsMessage={() => "Vui lòng nhấn nút để tìm kiếm các khu vực khả dụng trước"}
                                    id="ward"
                                    instanceId="ward"
                                    isSearchable={true}
                                    isMulti
                                    className={`flex items-center text-navy-800 dark:bg-[#3a3b3c] dark:text-white w-full rounded-xl bg-white`}
                                    styles={customStyles(theme)}
                                    placeholder={intl.formatMessage({ id: 'OrderForm.LocationForm.SelectManagedWard' })}
                                    value={additionalInfo.managedWards.map((ward) => ({ value: ward, label: ward }))}
                                    onChange={(selectedOptions) =>
                                        setAdditionalInfo({
                                            ...additionalInfo,
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
                                <Button
                                    onClick={fetchManagedWard}
                                    className="flex h-full w-16 min-h-[40px]  items-center justify-center gap-2 rounded-xl bg-white border hover:cursor-pointer border-red-500 text-red-500 dark:bg-[#3a3b3c]">
                                    <span className="text-[14px] font-medium font-sans focus:outline-none">
                                        Tìm
                                    </span>
                                </Button>
                            </p>
                        </div>
                    }
                </div>}

        </DetailPopup>
    );
};

export default AddStaff;
