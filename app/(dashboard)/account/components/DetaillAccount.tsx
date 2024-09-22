'use client'

import InputField from "@/components/fields/InputField";
import NotiPopup from "@/components/notification";
import DetailPopup from "@/components/popup";
import SubmitPopup from "@/components/submit";
import { AccountOperation, Role, UpdateAccountPayload } from "@/TDLib/main";
import { Button } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { FaPen, FaSave } from "react-icons/fa";
import { FormattedMessage, useIntl } from "react-intl";

interface DetailAccountProps {
    onClose: () => void;
    reloadData: () => void;
    dataInitial: AccountInfo;
}

interface AccountInfo {
    id?: string;
    username: string;
    email: string;
    phoneNumber: string;
    role: string;
}

const DetailAccount: React.FC<DetailAccountProps> = ({ onClose, reloadData, dataInitial }) => {
    const intl = useIntl()
    const [isEditing, setIsEditing] = useState(false)
    const [message, setMessage] = useState("")
    const [openError, setOpenError] = useState(false)
    const [openError2, setOpenError2] = useState(false)
    const [openSubmit, setOpenSubmit] = useState(false)
    const emailRegex = /^[a-zA-Z0-9._-]{1,64}@[a-zA-Z0-9._-]{1,255}\.[a-zA-Z]{2,4}$/;
    const phoneNumberRegex = /^[0-9]{10,11}$/;
    const accountOperation = new AccountOperation()
    const [data, setData] = useState<AccountInfo>({
        username: "",
        email: "",
        phoneNumber: "",
        role: "",
    });

    const handleNumberChange = (id: keyof AccountInfo, value: string) => {
        const numericValue = value.replace(/\D/g, '');
        setData(prev => ({ ...prev, [id]: numericValue }));
    };

    const fields: Array<{ id: keyof AccountInfo, type: string, label: string, disable: boolean, onChange?: (id: keyof AccountInfo, value: string) => void, }> = [
        { id: "username", type: "text", label: "AddAccount.Username", disable: true },
        { id: "email", type: "text", label: "AddAccount.Email", disable: isEditing ? false : true },
        { id: "phoneNumber", type: "text", label: "AddAccount.PhoneNumber", disable: isEditing ? false : true, onChange: handleNumberChange },
        { id: "role", type: "text", label: "AddAccount.Role", disable: true },
    ];

    const handleChange = (id: keyof AccountInfo, value: string | number) => {
        setData(prev => ({ ...prev, [id]: value }));
    };

    const handleUpdate = async () => {
        const updateInfo: UpdateAccountPayload = {
            phoneNumber: data.phoneNumber,
            email: data.email
        }
        const response = await accountOperation.updateInfo(dataInitial.id, updateInfo)
        setOpenSubmit(false)
        if (response.error) {
            setMessage(response.message ?? response.error.message ?? "Đã có lỗi xảy ra, vui lòng thử lại sau")
            setOpenError(true)
        } else {
            setMessage("Cập nhật tài khoản thành công")
            setOpenError2(true)
        }
    }

    const handleSubmitSave = () => {
        if (data.phoneNumber == "" || data.email == "") {
            setMessage("Vui lòng điền đầy đủ thông tin của tài khoản");
            setOpenError(true);
            return
        } else if (!emailRegex.test(data.email)) {
            setMessage("Vui lòng nhập đúng định dạng email");
            setOpenError(true)
            return;
        } else if (!phoneNumberRegex.test(data.phoneNumber)) {
            setMessage("Vui lòng nhập đúng định dạng số điện thoại");
            setOpenError(true)
            return;
        }
        else if (
            data.email != dataInitial.email ||
            data.phoneNumber != dataInitial.phoneNumber
        ) {
            setMessage("Xác nhận cập nhật thông tin tài khoản?");
            setOpenSubmit(true);
        } else {
            setIsEditing(false);
        }
    };

    useEffect(() => {
        setData(dataInitial)
    }, []);
    return (
        <DetailPopup
            onClose={onClose}
            title={intl.formatMessage({ id: "DetailAccount.Title" })}
            className2="lg:w-[55%]"
            button={
                <div className="w-full flex bottom-0 bg-white pt-2 dark:bg-[#242526] gap-2">
                    <Button
                        onClick={isEditing ? handleSubmitSave : () => setIsEditing(true)}
                        className="rounded-lg lg:h-11 w-full text-green-500 border-green-500 hover:border-green-600 bg-transparent hover:text-white border-2 hover:bg-green-600 hover:shadow-md flex sm:gap-2"
                    >
                        {isEditing ? <><FaSave />Lưu</> : <><FaPen />Chỉnh sửa</>}
                    </Button>
                </div>
            }
        >
            {openError && <NotiPopup message={message} onClose={() => setOpenError(false)} />}
            {openError2 && <NotiPopup message={message} onClose={() => { setOpenError2(false); reloadData(); onClose() }} />}
            {openSubmit && <SubmitPopup message={message} onClose={() => setOpenSubmit(false)} submit={handleUpdate} />}
            <div className="flex flex-col gap-2 mb-2">

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
                                value={id == "role" ? `${intl.formatMessage({ id: dataInitial.role })} (${dataInitial.role})` : data[id]}
                                setValue={(value: string) => onChange ? onChange(id, value) : handleChange(id, value)}
                                className="bg-white dark:!bg-[#3a3b3c] w-full"
                                extra="w-full"
                            />}
                        </p>
                    </div>
                ))}
            </div>
        </DetailPopup>
    );
};

export default DetailAccount;
