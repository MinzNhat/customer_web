'use client'

import { FormattedMessage, useIntl } from "react-intl";
import { RepresentorInfo, TransportPartnersInfo } from "../AddPartners";
import InputField from "@/components/fields/InputField";
import RenderCase from "@/components/rendercase";

interface Props {
    data: RepresentorInfo | TransportPartnersInfo;
    setData: React.Dispatch<React.SetStateAction<RepresentorInfo | TransportPartnersInfo>>;
    fields: Array<{
        id: keyof RepresentorInfo | keyof TransportPartnersInfo,
        type: string,
        label: string,
        important?: boolean,
        onChange?: (id: keyof RepresentorInfo | keyof TransportPartnersInfo,
            value: string) => void,
    }>;
    error: boolean;
    handleChange: (id: keyof RepresentorInfo | keyof TransportPartnersInfo, value: string | number) => void;
    provinces: string[];
    districts: string[];
    wards: string[];
    handleProvinceChange: (string) => void
    handleDistrictChange: (string) => void
    handleWardChange: (string) => void
    form: number
}

const AddTransportPartnerForm2: React.FC<Props> = ({ data, setData, fields, error, handleChange, districts, handleDistrictChange, handleProvinceChange, handleWardChange, provinces, wards, form }) => {
    const intl = useIntl()
    const requireFields = form == 1 ? ["cccd"] : ["agencyId", "transportPartnerName", "taxCode", "phoneNumber", "email", "bin", "bank"]
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
            <RenderCase renderIf={id == "detailAddress"}>
                <div className="grid gap-6 lg:gap-2 lg:grid-flow-col lg:grid-cols-3 lg:pl-[11.5rem] w-full">
                    <InputField
                        variant="auth1"
                        id="province"
                        type="select"
                        options={provinces}
                        placeholder={intl.formatMessage({ id: 'OrderForm.LocationForm.SelectProvince' })}
                        value={data.province || ""}
                        setValue={handleProvinceChange}
                        className="bg-white dark:!bg-[#3a3b3c]"
                        extra="w-full"
                    />
                    <InputField
                        variant="auth1"
                        id="district"
                        type="select"
                        options={districts}
                        placeholder={intl.formatMessage({ id: 'OrderForm.LocationForm.SelectDistrict' })}
                        value={data.district || ""}
                        setValue={handleDistrictChange}
                        className="bg-white dark:!bg-[#3a3b3c]"
                        extra="w-full"
                    />
                    <InputField
                        variant="auth1"
                        id="province"
                        type="select"
                        options={wards}
                        placeholder={intl.formatMessage({ id: 'OrderForm.LocationForm.SelectWard' })}
                        value={data.town || ""}
                        setValue={handleWardChange}
                        className="bg-white dark:!bg-[#3a3b3c]"
                        extra="w-full"
                    />
                </div>
            </RenderCase>
        </>
    ))
};

export default AddTransportPartnerForm2;
