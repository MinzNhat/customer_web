'use client'

import { AuthOperation, RegisteringPayload, Role, StaffOperation, TransportPartnerStaffOperation } from "@/TDLib/main";
import InputField from "@/components/fields/InputField";
import NotiPopup from "@/components/notification";
import DetailPopup from "@/components/popup";
import SubmitPopup from "@/components/submit";
import { usePassDataContext } from "@/providers/PassedData";
import { useThemeContext } from "@/providers/ThemeProvider";
import { Button } from "@nextui-org/react";
import { useState } from "react";
import { FaSave } from "react-icons/fa";
import { FormattedMessage, useIntl } from "react-intl";
import Select from "react-select";
import { customStyles } from "../../staff/styles/styles";
const AddAccount = ({ setOpenAdd, reloadData }: { setOpenAdd: any, reloadData: any }) => {
    const intl = useIntl();
    const { passData, setPassData } = usePassDataContext();
    const [registerInfo, setRegisterInfo] = useState<RegisteringPayload>({
        username: "",
        password: "",
        email: "",
        phoneNumber: "",
        role: Role.SHIPPER
    });
    const { theme } = useThemeContext()
    const [openSubmit, setOpenSubmit] = useState(false)
    const [openError, setOpenError] = useState(false)
    const [openError2, setOpenError2] = useState(false)
    const adminRole = ["ADMIN", "MANAGER", "HUMAN_RESOURCE_MANAGER", "TELLER", "COMPLAINTS_SOLVER"];
    const agencyRole = ["AGENCY_MANAGER", "AGENCY_HUMAN_RESOURCE_MANAGER", "AGENCY_TELLER", "AGENCY_COMPLAINTS_SOLVER"];
    const [message, setMessage] = useState<any>("")
    const emailRegex = /^[a-zA-Z0-9._-]{1,64}@[a-zA-Z0-9._-]{1,255}\.[a-zA-Z]{2,4}$/;
    const phoneNumberRegex = /^[0-9]{10,11}$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d])\S{8,}$/;

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

    const handlePhoneNumberChange = (value: string) => {
        const numericValue = value.replace(/\D/g, ''); // Remove non-numeric characters
        setRegisterInfo(prev => ({ ...prev, phoneNumber: numericValue }));
    };

    const fields: Array<{ id: keyof RegisteringPayload, type: string, label: string, onChange?: (value: string) => void }> = [
        { id: "username", type: "text", label: "AddAccount.Username" },
        { id: "password", type: "password", label: "AddAccount.Password" },
        { id: "email", type: "email", label: "AddAccount.Email" },
        { id: "phoneNumber", type: "text", label: "AddAccount.PhoneNumber", onChange: handlePhoneNumberChange }
    ];

    const submitClick = () => {
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
    };

    const createAccount = async () => {
        const authOperation = new AuthOperation()
        const response = await authOperation.register(registerInfo)
        setOpenSubmit(false)
        if (!response.error) {
            setMessage("Tạo tài khoản thành công")
            setOpenError2(true)
        } else {
            setMessage(response.message || response.error.message)
            setOpenError(true)
        }
    };

    return (
        <DetailPopup
            onClose={() => setOpenAdd(false)}
            title={intl.formatMessage({ id: "AddAccount.Title" })}
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
            {openError && <NotiPopup message={message} onClose={() => setOpenError(false)} />}
            {openError2 && <NotiPopup message={message} onClose={() => { setOpenError2(false); reloadData() }} />}
            {openSubmit && <SubmitPopup message={message} onClose={() => setOpenSubmit(false)} submit={createAccount} />}
            <div className="flex flex-col gap-2 mb-2">

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
                        <strong><FormattedMessage id="AddAccount.Role" /></strong>:
                    </div>
                    <p className="whitespace-nowrap flex flex-row gap-2 relative w-full">
                        <Select
                            id="roleSelect"
                            instanceId="roleSelect"
                            isSearchable={false}
                            className={`flex items-center h-10 text-navy-800 dark:bg-[#3a3b3c] dark:text-white w-full rounded-xl bg-white`}
                            styles={customStyles(theme)}
                            menuPlacement="top"
                            placeholder={intl.formatMessage({ id: 'AddAccount.SelectRole' })}
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
            </div>
        </DetailPopup>
    );
};

export default AddAccount;
