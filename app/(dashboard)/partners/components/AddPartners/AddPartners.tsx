'use client'
import DetailPopup from "@/components/popup";
import { Button } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import NotiPopup from "@/components/notification";
import SubmitPopup from "@/components/submit";
import { FaSave, FaTrash } from "react-icons/fa";
import InputField from "@/components/fields/InputField";
import { FormattedMessage } from "react-intl";
import RenderCase from "@/components/rendercase";
import { AdministrativeOperation, CreatingTransportPartnerByAdminPayload, CreatingTransportPartnerByAgencyPayload, TransportPartnerOperation } from "@/TDLib/main";
import { IoIosArrowBack } from "react-icons/io";
import AddTransportPartnerForm1 from "./components/Form1";
import AddTransportPartnerForm2 from "./components/Form2";
import { usePassDataContext } from "@/providers/PassedData";

interface Props {
    setOpenAdd: React.Dispatch<React.SetStateAction<boolean>>;
    reloadData: () => void;
}

export interface AccountInfo {
    phoneNumber: string,
    email: string
}

export interface RepresentorInfo {
    cccd: string,
    dateOfBirth?: string,
    province?: string,
    district?: string,
    town?: string,
    detailAddress?: string,
    position?: string,
    bin?: string,
    bank?: string,
    account: AccountInfo
}

export interface TransportPartnersInfo {
    agencyId?: string,
    transportPartnerName: string,
    province?: string,
    district?: string,
    town?: string;
    detailAddress?: string,
    taxCode: string
    phoneNumber: string,
    email: string,
    bin?: string,
    bank?: string,
    debit?: number,
}

const AddTransportPartner: React.FC<Props> = ({ setOpenAdd, reloadData }) => {
    const { passData, setPassData } = usePassDataContext()
    const [form, setCurrentForm] = useState<number>(0)
    const [openError, setOpenError] = useState<boolean>(false)
    const [openSubmit, setOpenSubmit] = useState<boolean>(false)
    const [message, setMessage] = useState<string | JSX.Element>("")
    const [reload, setReload] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)
    const [provinces, setProvinces] = useState<string[]>([]);
    const [districts, setDistricts] = useState<string[]>([]);
    const [districts2, setDistricts2] = useState<string[]>([]);
    const [wards, setWards] = useState<string[]>([]);
    const [wards2, setWards2] = useState<string[]>([]);
    const adminOperation = new AdministrativeOperation()
    const [error, setError] = useState<boolean>(false);
    const emailRegex = /^[a-zA-Z0-9._-]{1,64}@[a-zA-Z0-9._-]{1,255}\.[a-zA-Z]{2,4}$/;
    const phoneNumberRegex = /^[0-9]{10,11}$/;
    const taxCodeRegex = /^[0-9]{10}$|^[0-9]{13}$/
    const cccdRegex = /^[0-9]{12}$/;
    const requireFields = ["email", "phoneNumber"]
    const requireFields2 = ["cccd"]
    const requireFields3 = ["transportPartnerName", "taxCode", "phoneNumber", "email", "bin", "bank"]
    const adminRole = ["ADMIN", "MANAGER", "HUMAN_RESOURCE_MANAGER", "TELLER", "COMPLAINTS_SOLVER"];
    const [data, setData] = useState<AccountInfo>({
        email: "",
        phoneNumber: ""
    })
    const [data2, setData2] = useState<RepresentorInfo>({
        cccd: "",
        dateOfBirth: "",
        province: "",
        district: "",
        town: "",
        detailAddress: "",
        position: "",
        bin: "",
        bank: "",
        account: data
    })
    const [data3, setData3] = useState<TransportPartnersInfo>({
        agencyId: "",
        transportPartnerName: "",
        province: "",
        district: "",
        town: "",
        detailAddress: "",
        taxCode: "",
        phoneNumber: "",
        email: "",
        bin: "",
        bank: "",
        debit: 0,
    })

    const sortData = (data: string[]) => {
        const cities = data.filter((item: string) => item.startsWith("Thành phố"));
        const provinces = data.filter((item: string) => !item.startsWith("Thành phố"));
        return cities.concat(provinces);
    };

    const fetchData = async () => {
        const response = await adminOperation.get({});
        if (response.data) {
            const data = sortData(response.data);
            setProvinces(data);
        }
    };

    const handleProvinceChange = async (selectedOption: string) => {
        const a = { province: selectedOption };
        setData2((prevState: RepresentorInfo) => ({
            ...prevState,
            province: selectedOption,
            district: "",
            town: "",
        }));
        const response = await adminOperation.get(a);
        setDistricts(response.data);
    };

    const handleDistrictChange = async (selectedOption: string) => {
        const a = { province: data2.province, district: selectedOption };
        setData2((prevState: RepresentorInfo) => ({
            ...prevState,
            district: selectedOption,
            town: "",
        }));
        const response = await adminOperation.get(a);
        setWards(response.data);
    };

    const handleWardChange = async (selectedOption: string) => {
        setData2((prevState: RepresentorInfo) => ({
            ...prevState,
            town: selectedOption,
        }));
    };

    const handleProvinceChange2 = async (selectedOption: string) => {
        const a = { province: selectedOption };
        setData3((prevState: TransportPartnersInfo) => ({
            ...prevState,
            province: selectedOption,
            district: "",
            town: "",
        }));
        const response = await adminOperation.get(a);
        setDistricts2(response.data);
    };

    const handleDistrictChange2 = async (selectedOption: string) => {
        const a = { province: data2.province, district: selectedOption };
        setData3((prevState: TransportPartnersInfo) => ({
            ...prevState,
            district: selectedOption,
            town: "",
        }));
        const response = await adminOperation.get(a);
        setWards2(response.data);
    };

    const handleWardChange2 = async (selectedOption: string) => {
        setData3((prevState: TransportPartnersInfo) => ({
            ...prevState,
            town: selectedOption,
        }));
    };

    const handleNumberChange = (id: keyof AccountInfo, value: string) => {
        const numericValue = value.replace(/\D/g, '');
        setData(prev => ({ ...prev, [id]: numericValue }));
    };

    const handleNumberChange2 = (id: keyof RepresentorInfo, value: string) => {
        const numericValue = value.replace(/\D/g, '');
        setData2(prev => ({ ...prev, [id]: numericValue }));
    };

    const handleNumberChange3 = (id: keyof TransportPartnersInfo, value: string) => {
        const numericValue = value.replace(/\D/g, '');
        setData3(prev => ({ ...prev, [id]: numericValue }));
    };

    const handleNumberChange4 = (id: keyof TransportPartnersInfo, value: string) => {
        let sanitizedValue = value.replace(/^0+/, '');
        let numberValue = sanitizedValue ? parseInt(sanitizedValue, 10) : 0;
        setData3(prev => ({ ...prev, [id]: numberValue }));
    };

    const createHandleChange = (setter: React.Dispatch<React.SetStateAction<any>>) => (id: string, value: string | number) => {
        setter((prev: any) => ({ ...prev, [id]: value }));
    };

    const handleChange = createHandleChange(setData);
    const handleChange2 = createHandleChange(setData2);
    const handleChange3 = createHandleChange(setData3);

    const fields: Array<{ id: keyof AccountInfo, type: string, label: string, important?: boolean, onChange?: (id: keyof AccountInfo, value: string) => void, }> = [
        { id: "email", type: "text", label: "AddTransportPartners.email", important: true },
        { id: "phoneNumber", type: "text", label: "AddTransportPartners.phoneNumber", important: true, onChange: handleNumberChange },
    ];

    const fields2: Array<{ id: keyof RepresentorInfo, type: string, label: string, important?: boolean, onChange?: (id: keyof RepresentorInfo, value: string) => void, }> = [
        { id: "cccd", type: "text", label: "AddTransportPartners.cccd", important: true, onChange: handleNumberChange2 },
        { id: "dateOfBirth", type: "date", label: "AddTransportPartners.dateOfBirth" },
        { id: "detailAddress", type: "text", label: "AddTransportPartners.detailAddress" },
        { id: "position", type: "text", label: "AddTransportPartners.position" },
        { id: "bank", type: "text", label: "AddTransportPartners.bank" },
        { id: "bin", type: "text", label: "AddTransportPartners.bin" },
    ];

    const fields3: Array<{ id: keyof TransportPartnersInfo, type: string, label: string, important?: boolean, onChange?: (id: keyof TransportPartnersInfo, value: string) => void, }> = [
        ...(passData && adminRole.includes(passData.role) ? [{ id: "agencyId" as keyof TransportPartnersInfo, type: "text", label: "AddTransportPartners.agencyId", important: true }] : []),
        { id: "transportPartnerName", type: "text", label: "AddTransportPartners.transportPartnerName", important: true },
        { id: "detailAddress", type: "text", label: "AddTransportPartners.detailAddress" },
        { id: "taxCode", type: "text", label: "AddTransportPartners.taxCode", important: true, onChange: handleNumberChange3 },
        { id: "phoneNumber", type: "text", label: "AddTransportPartners.phoneNumber", important: true, onChange: handleNumberChange3 },
        { id: "email", type: "text", label: "AddTransportPartners.email", important: true },
        { id: "bank", type: "text", label: "AddTransportPartners.bank", important: true },
        { id: "bin", type: "text", label: "AddTransportPartners.bin", important: true },
        { id: "debit", type: "text", label: "AddTransportPartners.debit", onChange: handleNumberChange4 },
    ];

    const checkRequiredFields = (data: any, fields: string[]) => {
        return fields.some((field) => !data[field]);
    };

    const validateField = (regex: RegExp, value: string, errorMsg: string) => {
        if (!regex.test(value)) {
            setMessage(errorMsg);
            setOpenError(true);
            setLoading(false);
            return false;
        }
        return true;
    };

    const handleFormValidation = (formNumber: number) => {
        if (formNumber === 0) {
            if (checkRequiredFields(data, requireFields)) {
                setMessage("Vui lòng nhập đầy đủ các trường thông tin yêu cầu");
                setError(true)
                return false;
            }

            if (!validateField(phoneNumberRegex, data.phoneNumber, "Vui lòng nhập đúng định dạng số điện thoại")) return false;
            if (!validateField(emailRegex, data.email, "Vui lòng nhập đúng định dạng email")) return false;
        } else if (formNumber === 1) {
            if (checkRequiredFields(data2, requireFields2)) {
                setMessage("Vui lòng nhập đầy đủ các trường thông tin yêu cầu");
                setError(true)
                return false;
            }

            if (!validateField(cccdRegex, data2.cccd, "Vui lòng nhập đúng định dạng căn cước công dân")) return false;
        } else if (formNumber === 2) {
            if (checkRequiredFields(data3, passData && adminRole.includes(passData.role) ? [...requireFields3, "agencyId"] : requireFields3)) {
                setMessage("Vui lòng nhập đầy đủ các trường thông tin yêu cầu");
                setError(true)
                return false;
            }

            if (!validateField(phoneNumberRegex, data3.phoneNumber, "Vui lòng nhập đúng định dạng số điện thoại")) return false;
            if (!validateField(emailRegex, data3.email, "Vui lòng nhập đúng định dạng email")) return false;
            if (!validateField(taxCodeRegex, data3.taxCode, "Vui lòng nhập đúng định dạng mã số thuế")) return false;
        }
        return true;
    };

    const submitClick = () => {
        setLoading(true);
        if (!handleFormValidation(form)) {
            setOpenError(true);
            setLoading(false);
            return;
        }
        if (form != 2) setCurrentForm(form + 1);
        else {
            setMessage("Xác nhận tạo đối tác vận tải?")
            setOpenSubmit(true)
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchData()
    }, []);

    const handleCreate = async () => {
        let createData;

        const transportPartnerOp = new TransportPartnerOperation();
        let response;

        if (passData && adminRole.includes(passData.role)) {
            createData = {
                ...data3,
                representor: data2
            } as CreatingTransportPartnerByAdminPayload;
            response = await transportPartnerOp.createByAdmin(createData);
        } else {
            const { agencyId, ...restData } = data3;
            createData = {
                ...restData,
                representor: data2
            } as CreatingTransportPartnerByAgencyPayload;
            response = await transportPartnerOp.createByAgency(createData);
        }
        setOpenSubmit(false)
        if (response && response.error) {
            setMessage(response.message || response.error.message)
            setOpenError(true)
        } else {
            setMessage("Tạo đối tác vận tải mới thành công!")
            setReload(true)
        }
    };

    return (
        <DetailPopup
            onClose={() => setOpenAdd(false)}
            title="Tạo đối tác vận tải"
            className2={`${form == 0 ? "lg:w-[55%]" : "lg:w-[75%]"}`}
            className="pt-0"
            button={
                <div className="w-full flex bottom-0 bg-white pt-2 dark:bg-[#242526] gap-2">
                    <RenderCase renderIf={form > 0}>
                        <Button
                            onClick={loading ? () => { } : () => setCurrentForm(form - 1)}
                            className="rounded-lg lg:h-11 w-fit text-red-500 border-red-500 hover:border-red-600 bg-transparent hover:text-white border-2 hover:bg-red-600 hover:shadow-md flex sm:gap-2"
                        >
                            <IoIosArrowBack />
                        </Button>
                    </RenderCase>
                    <Button
                        onClick={loading ? () => { } : submitClick}
                        className="rounded-lg lg:h-11 w-full text-green-500 border-green-500 hover:border-green-600 bg-transparent hover:text-white border-2 hover:bg-green-600 hover:shadow-md flex sm:gap-2"
                    >
                        <RenderCase renderIf={!loading}>
                            <><FaSave className="-mr-.5" />Xác nhận</>
                        </RenderCase>

                        <RenderCase renderIf={loading}>
                            <svg aria-hidden="true" className="w-14 h-6 text-gray-200 animate-spin dark:text-gray-600 fill-green-500" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                            </svg>
                        </RenderCase>
                    </Button>
                </div>
            }
        >
            <RenderCase renderIf={openSubmit}>
                <SubmitPopup message={message} onClose={() => { setOpenSubmit(false); setLoading(false) }} submit={handleCreate} />
            </RenderCase>

            <RenderCase renderIf={openError}>
                <NotiPopup message={message} onClose={() => { setOpenError(false) }} />
            </RenderCase>

            <RenderCase renderIf={reload}>
                <NotiPopup message={message} onClose={() => { setReload(false); reloadData() }} />
            </RenderCase>

            <div className="mb-2">
                <AnimatePresence initial={false}>
                    <RenderCase renderIf={form == 0}><motion.div
                        key="option0"
                        className="w-full"
                        initial={{ scale: 0, height: "0" }}
                        animate={{ scale: 1, height: "auto" }}
                        exit={{ scale: 0, height: "0" }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="flex justify-center place-items-center flex-col gap-6 w-full">
                            <div className='w-full flex text-center justify-center mt-4'>
                                <strong>Thông tin tài khoản đối tác vận tải</strong>
                            </div>

                            <AddTransportPartnerForm1 data={data} setData={setData} error={error} fields={fields} handleChange={handleChange} />
                        </div>
                    </motion.div>
                    </RenderCase>
                </AnimatePresence>
            </div>

            <div className="mb-2">
                <AnimatePresence initial={false}>
                    <RenderCase renderIf={form == 1}><motion.div
                        key="option0"
                        className="w-full"
                        initial={{ scale: 0, height: "0" }}
                        animate={{ scale: 1, height: "auto" }}
                        exit={{ scale: 0, height: "0" }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="flex justify-center place-items-center flex-col gap-6 w-full">
                            <div className='w-full flex text-center justify-center mt-4'>
                                <strong>Thông tin người quản ý đối tác vận tải</strong>
                            </div>

                            <AddTransportPartnerForm2 data={data2} setData={setData2} error={error} fields={fields2} handleChange={handleChange2} form={form}
                                districts={districts} provinces={provinces} wards={wards} handleDistrictChange={handleDistrictChange} handleProvinceChange={handleProvinceChange} handleWardChange={handleWardChange} />
                        </div>
                    </motion.div>
                    </RenderCase>
                </AnimatePresence>
            </div>

            <div className="mb-2">
                <AnimatePresence initial={false}>
                    <RenderCase renderIf={form == 2}><motion.div
                        key="option0"
                        className="w-full"
                        initial={{ scale: 0, height: "0" }}
                        animate={{ scale: 1, height: "auto" }}
                        exit={{ scale: 0, height: "0" }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="flex justify-center place-items-center flex-col gap-6 w-full">
                            <div className='w-full flex text-center justify-center mt-4'>
                                <strong>Thông tin đối tác vận tải</strong>
                            </div>

                            <AddTransportPartnerForm2 data={data3} setData={setData3} error={error} fields={fields3} handleChange={handleChange3} form={form}
                                districts={districts2} provinces={provinces} wards={wards2} handleDistrictChange={handleDistrictChange2} handleProvinceChange={handleProvinceChange2} handleWardChange={handleWardChange2} />
                        </div>
                    </motion.div>
                    </RenderCase>
                </AnimatePresence>
            </div>

        </DetailPopup>
    );
};

export default AddTransportPartner;
