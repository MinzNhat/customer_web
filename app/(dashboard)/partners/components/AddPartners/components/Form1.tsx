'use client'

import { FormattedMessage } from "react-intl";
import { AccountInfo } from "../AddPartners";
import InputField from "@/components/fields/InputField";

interface Props {
    data: AccountInfo;
    setData: React.Dispatch<React.SetStateAction<AccountInfo>>;
    fields: Array<{
        id: keyof AccountInfo,
        type: string,
        label: string,
        important?: boolean,
        onChange?: (id: keyof AccountInfo,
            value: string) => void,
    }>
    error: boolean
    handleChange: (id: keyof AccountInfo, value: string | number) => void
}

const AddTransportPartnerForm1: React.FC<Props> = ({ data, setData, fields, error, handleChange }) => {
    const requireFields = ["email", "phoneNumber"]
    return fields.map(({ id, type, label, important, onChange }) => (
        <>
            <div key={id} className="flex gap-2 w-full flex-col lg:flex-row">
                <div className='lg:w-44 lg:min-w-[11rem] flex lg:justify-between place-items-center'>
                    <strong className="flex gap-1"><FormattedMessage id={label} />{important && <div className="text-red-500">*</div>}</strong>:
                </div>
                <p className="whitespace-nowrap flex flex-row gap-2 relative w-full">
                    <InputField
                        variant="auth1"
                        id={label}
                        type={type}
                        state={error && requireFields.includes(id) && !data[id] ? "error" : "none"}
                        value={data[id] as string}
                        setValue={(value: string) => onChange ? onChange(id, value) : handleChange(id, value)}
                        className="bg-white dark:!bg-[#3a3b3c] w-full"
                        extra="w-full"
                    />
                </p>
            </div>
        </>
    ))
};

export default AddTransportPartnerForm1;
