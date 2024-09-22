'use client'
import DetailPopup from "@/components/popup";
import { Button } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import NotiPopup from "@/components/notification";
import SubmitPopup from "@/components/submit";
import { RiPhoneFindLine } from "react-icons/ri";
import { FaSave, FaTrash } from "react-icons/fa";
import InputField from "@/components/fields/InputField";
import { FormattedMessage, useIntl } from "react-intl";
import RenderCase from "@/components/rendercase";
import { AdministrativeOperation, AgencyOperation, AgencyType, CreatingAgencyPayload } from "@/TDLib/main";
import Checkbox from "@/components/checkbox";
import { IoIosArrowBack } from "react-icons/io";

interface AgencyAdmin {
    fullname: string,
    phoneNumber: string,
    email: string,
    dateOfBirth?: string,
    cccd: string,
    province?: string,
    district?: string,
    town?: string,
    detailAddress?: string,
    position?: string,
    salary?: number,
    bin?: string,
    bank?: string
}

interface AgencyInfo {
    type: AgencyType | null,
    level: number,
    postalCode: string,
    agencyName: string,
    province: string,
    district: string,
    town: string,
    detailAddress: string,
    latitude?: number,
    longitude?: number,
    managedWards?: string[],
    phoneNumber: string,
    email: string,
    commissionRate?: number,
    bin?: string,
    bank?: string,
    individualCompany: boolean,
    companyName: string,
    taxNumber: string
}

const AddPostOffice = ({ setOpenAdd, reloadData }: { setOpenAdd: any, reloadData: any }) => {
    const [form, setCurrentForm] = useState(0)
    const [openError, setOpenError] = useState(false)
    const [openSubmit, setOpenSubmit] = useState(false)
    const [message, setMessage] = useState<any>("")
    const [reload, setReload] = useState(false)
    const [loading, setLoading] = useState(false)
    const adminOperation = new AdministrativeOperation();
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [districts2, setDistricts2] = useState([]);
    const [wards2, setWards2] = useState([]);
    const [districts3, setDistricts3] = useState([]);
    const [wards3, setWards3] = useState([]);
    const [selectedProvince, setSelectedProvince] = useState("");
    const [selectedDistrict, setSelectedDistrict] = useState("");
    const [selectedWard, setSelectedWard] = useState("");
    const [error, setError] = useState(false);
    const intl = useIntl()
    const [selectedManagedWard, setSelectedManagedWard] = useState([])
    const emailRegex = /^[a-zA-Z0-9._-]{1,64}@[a-zA-Z0-9._-]{1,255}\.[a-zA-Z]{2,4}$/;
    const phoneNumberRegex = /^[0-9]{10,11}$/;
    const postalCodeRegex = /^\d{5}$/;
    const taxCodeRegex = /^[0-9]{10}$|^[0-9]{13}$/
    const cccdRegex = /^[0-9]{12}$/;
    const requireFields = ["fullname", "phoneNumber", "email", "cccd"]
    const requireFields2 = ["type", "level", "postalCode", "agencyName", "province", "district", "town", "detailAddress",
        "phoneNumber", "email", "bank", "bin", "commissionRate", "companyName", "taxNumber"]
    const [data, setData] = useState<AgencyAdmin>({
        fullname: "",
        phoneNumber: "",
        email: "",
        dateOfBirth: "",
        cccd: "",
        province: "",
        district: "",
        town: "",
        detailAddress: "",
        position: "",
        salary: 0,
        bin: "",
        bank: ""
    })
    const [data2, setData2] = useState<AgencyInfo>({
        type: null,
        level: 1,
        postalCode: "",
        agencyName: "",
        province: "",
        district: "",
        town: "",
        detailAddress: "",
        managedWards: [],
        phoneNumber: "",
        email: "",
        commissionRate: null,
        bin: "",
        bank: "",
        individualCompany: false,
        companyName: "",
        taxNumber: ""
    })

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

    const handleProvinceChange = async (selectedOption: any) => {
        const a = { province: selectedOption };
        setData((prevState: any) => ({
            ...prevState,
            province: selectedOption,
            district: "",
            town: "",
        }));
        const response = await adminOperation.get(a);
        setDistricts(response.data);
    };

    const handleDistrictChange = async (selectedOption: any) => {
        const a = { province: data.province, district: selectedOption };
        setData((prevState: any) => ({
            ...prevState,
            district: selectedOption,
            town: "",
        }));
        const response = await adminOperation.get(a);
        setWards(response.data);
    };

    const handleWardChange = async (selectedOption: any) => {
        setData((prevState: any) => ({
            ...prevState,
            town: selectedOption,
        }));
    };

    const handleProvinceChange2 = async (selectedOption: any) => {
        const a = { province: selectedOption };
        setData2((prevState: any) => ({
            ...prevState,
            province: selectedOption,
            district: "",
            town: "",
        }));
        const response = await adminOperation.get(a);
        setDistricts2(response.data);
    };

    const handleDistrictChange2 = async (selectedOption: any) => {
        const a = { province: data2.province, district: selectedOption };
        setData2((prevState: any) => ({
            ...prevState,
            district: selectedOption,
            town: "",
        }));
        const response = await adminOperation.get(a);
        setWards2(response.data);
    };

    const handleWardChange2 = async (selectedOption: any) => {
        setData2((prevState: any) => ({
            ...prevState,
            town: selectedOption,
        }));
    };

    const handleProvinceChange3 = async (selectedOption: any) => {
        const a = { province: selectedOption };
        setSelectedProvince(selectedOption)
        setSelectedDistrict("")
        setSelectedWard("")
        const response = await adminOperation.get(a);
        setDistricts3(response.data);
    };

    const handleDistrictChange3 = async (selectedOption: any) => {
        const a = { province: selectedProvince, district: selectedOption };
        setSelectedDistrict(selectedOption)
        setSelectedWard("")
        const response = await adminOperation.get(a);
        setWards3(response.data);
    };

    const handleWardChange3 = async (selectedOption: any) => {
        setSelectedWard(selectedOption)
    };

    const handleNumberChange = (id: keyof AgencyAdmin, value: string) => {
        let sanitizedValue = value.replace(/^0+/, '');
        let numberValue = sanitizedValue ? parseInt(sanitizedValue, 10) : 0;
        setData(prev => ({ ...prev, [id]: numberValue }));
    };

    const handleNumberChange2 = (id: keyof AgencyAdmin, value: string) => {
        const numericValue = value.replace(/\D/g, '');
        setData(prev => ({ ...prev, [id]: numericValue }));
    };

    const handleChange = (id: keyof AgencyAdmin, value: string | number) => {
        setData(prev => ({ ...prev, [id]: value }));
    };

    const handleChange2 = (id: keyof AgencyInfo, value: string | number) => {
        setData2(prev => ({ ...prev, [id]: value }));
    };

    const handleChangeLevel = (id: keyof AgencyInfo, value: string) => {
        let sanitizedValue = value.replace(/[^0-9]/g, '');
        let numberValue = sanitizedValue ? parseInt(sanitizedValue, 10) : 1;
        numberValue = Math.max(numberValue, 1);
        setData2(prev => ({ ...prev, [id]: numberValue }));
    };

    const handleChangeCommissionRate = (id: keyof AgencyInfo, value: string) => {
        let sanitizedValue = value.replace(/[^0-9.]/g, '');
        setData2(prev => ({ ...prev, [id]: sanitizedValue }));
    };

    const fields: Array<{ id: keyof AgencyAdmin, type: string, label: string, important?: boolean, onChange?: (id: keyof AgencyAdmin, value: string) => void, }> = [
        { id: "fullname", type: "text", label: "AddAgency.fullname", important: true },
        { id: "phoneNumber", type: "text", label: "AddAgency.phoneNumber", important: true, onChange: handleNumberChange2 },
        { id: "email", type: "text", label: "AddAgency.email", important: true },
        { id: "dateOfBirth", type: "date", label: "AddAgency.dateOfBirth" },
        { id: "cccd", type: "text", label: "AddAgency.cccd", important: true, onChange: handleNumberChange2 },
        { id: "detailAddress", type: "text", label: "AddAgency.detailAddress" },
        { id: "position", type: "text", label: "AddAgency.position" },
        { id: "salary", type: "text", label: "AddAgency.salary", onChange: handleNumberChange },
        { id: "bank", type: "text", label: "AddAgency.bank" },
        { id: "bin", type: "text", label: "AddAgency.bin" },
    ];

    const fields2: Array<{ id: keyof AgencyInfo, type: string, label: string, important?: boolean, onChange?: (id: keyof AgencyInfo, value: string) => void, }> = [
        { id: "type", type: "select", label: "AddAgency.type", important: true },
        { id: "level", type: "text", label: "AddAgency.level", important: true, onChange: handleChangeLevel },
        { id: "postalCode", type: "text", label: "AddAgency.postalCode", important: true },
        { id: "agencyName", type: "text", label: "AddAgency.agencyName", important: true },
        { id: "detailAddress", type: "text", label: "AddAgency.detailAddress2", important: true },
        { id: "phoneNumber", type: "text", label: "AddAgency.phoneNumber", important: true },
        { id: "email", type: "text", label: "AddAgency.email", important: true },
        { id: "commissionRate", type: "text", label: "AddAgency.commissionRate", onChange: handleChangeCommissionRate, important: true },
        { id: "bank", type: "text", label: "AddAgency.bank", important: true },
        { id: "bin", type: "text", label: "AddAgency.bin", important: true },
        { id: "individualCompany", type: "select", label: "AddAgency.individualCompany", important: true },
        { id: "companyName", type: "text", label: "AddAgency.companyName", important: true },
        { id: "taxNumber", type: "text", label: "AddAgency.taxNumber", important: true },
    ];

    const submitClick = () => {
        setLoading(true);

        if (form === 0) {
            const requiredMissing = requireFields.some((field) => !data[field as keyof AgencyAdmin]);

            if (requiredMissing) {
                setError(true);
                setMessage("Vui lòng nhập đầy đủ các trường thông tin yêu cầu");
                setOpenError(true);
                setLoading(false);
                return;
            }

            setError(false);

            const validationChecks = [
                { regex: phoneNumberRegex, value: data.phoneNumber, errorMsg: "Vui lòng nhập đúng định dạng số điện thoại" },
                { regex: emailRegex, value: data.email, errorMsg: "Vui lòng nhập đúng định dạng email" },
                { regex: cccdRegex, value: data.cccd, errorMsg: "Vui lòng nhập đúng định dạng số căn cước" },
            ];

            const invalidCheck = validationChecks.find(({ regex, value }) => !regex.test(value));

            if (invalidCheck) {
                setMessage(invalidCheck.errorMsg);
                setOpenError(true);
                setLoading(false);
                return;
            }

            setCurrentForm(1);
        } else if (form == 1) {
            const requiredMissing = requireFields2.some((field) => !data2[field as keyof AgencyInfo]);

            if (requiredMissing) {
                setError(true);
                setMessage("Vui lòng nhập đầy đủ các trường thông tin yêu cầu");
                setOpenError(true);
                setLoading(false);
                return;
            }

            if (data2.commissionRate == null || data2.commissionRate < 0 || data2.commissionRate > 1) {
                setError(true);
                setMessage("Vui lòng nhập tỷ lệ hoa hồng >= 0 và <= 1, ngăn cách bằng dấu ' . ' ");
                setOpenError(true);
                setLoading(false);
                return;
            }

            const validationChecks = [
                { regex: phoneNumberRegex, value: data2.phoneNumber, errorMsg: "Vui lòng nhập đúng định dạng số điện thoại" },
                { regex: emailRegex, value: data2.email, errorMsg: "Vui lòng nhập đúng định dạng email" },
                { regex: postalCodeRegex, value: data2.postalCode, errorMsg: "Vui lòng nhập đúng định dạng mã bưu chính" },
                { regex: taxCodeRegex, value: data2.taxNumber, errorMsg: "Vui lòng nhập đúng định dạng mã số thuế" }
            ];

            const invalidCheck = validationChecks.find(({ regex, value }) => !regex.test(value));

            if (invalidCheck) {
                setMessage(invalidCheck.errorMsg);
                setOpenError(true);
                setLoading(false);
                return;
            }

            setCurrentForm(2);
        } else {
            setMessage("Xác nhận tạo bưu cục - đại lý?")
            setOpenSubmit(true)
        }

        setLoading(false);
    };

    useEffect(() => {
        fetchData()
    }, []);

    const handleCreate = async () => {
        const {
            fullname, phoneNumber, email, dateOfBirth, cccd, province, district, town, detailAddress, position, salary, bin, bank
        } = data;

        const {
            type, level, postalCode, agencyName, province: agencyProvince, district: agencyDistrict, town: agencyTown, detailAddress: agencyDetailAddress, latitude, longitude, managedWards, phoneNumber: agencyPhoneNumber, email: agencyEmail, commissionRate, bin: agencyBin, bank: agencyBank, individualCompany, companyName, taxNumber
        } = data2;

        const agencyCompany = { companyName, taxNumber }

        const createData: CreatingAgencyPayload = {
            agencyAdmin: {
                fullname,
                phoneNumber,
                email,
                dateOfBirth: dateOfBirth || undefined,
                cccd,
                province: province || undefined,
                district: district || undefined,
                town: town || undefined,
                detailAddress: detailAddress || undefined,
                position: position || undefined,
                salary: salary || undefined,
                bin: bin || undefined,
                bank: bank || undefined
            },
            type: type!,
            level,
            postalCode,
            agencyName,
            province: agencyProvince,
            district: agencyDistrict,
            town: agencyTown,
            detailAddress: agencyDetailAddress,
            latitude: 0,
            longitude: 0,
            managedWards: managedWards,
            phoneNumber: agencyPhoneNumber,
            email: agencyEmail,
            commissionRate: commissionRate || undefined,
            bin: agencyBin || undefined,
            bank: agencyBank || undefined,
            individualCompany,
            agencyCompany
        };

        console.log(createData)

        const agencyOperation = new AgencyOperation()
        const response = await agencyOperation.create(createData)

        console.log(response)
        setOpenSubmit(false)
        if (response && response.error) {
            setMessage(response.message || response.error.message)
            setOpenError(true)
        } else {
            setMessage("Tạo bưu cục mới thành công!")
            setReload(true)
        }
    };

    const handleAddManagedWard = () => {
        if (selectedWard == "") {
            setMessage("Vui lòng chọn khu vực muốn thêm");
            setOpenError(true);
            return;
        }
        setData2((prevData2) => {
            if (prevData2.managedWards.includes(selectedWard)) {
                setMessage("Bạn đã thêm khu vực này rồi");
                setOpenError(true);
                return prevData2
            }
            else return { ...prevData2, managedWards: [...prevData2.managedWards, selectedWard] };
        });
    };

    const handleDeleteManagedWard = () => {
        if (selectedManagedWard.length === 0) {
            setMessage("Vui lòng chọn khu vực muốn xoá");
            setOpenError(true);
            return;
        }
        setData2((prevData2) => {
            const updatedManagedWards = prevData2.managedWards.filter(
                (ward) => !selectedManagedWard.includes(ward)
            );

            setSelectedManagedWard([])

            if (updatedManagedWards.length === prevData2.managedWards.length) {
                setMessage("Không có khu vực nào trong danh sách để xoá");
                setOpenError(true);
                return prevData2;
            }

            return { ...prevData2, managedWards: updatedManagedWards };
        });
    };

    const handleCheckboxChange = (managedWard: string) => {
        setSelectedManagedWard((prevSelected) => {
            if (prevSelected.includes(managedWard)) {
                return prevSelected.filter((selectedName) => selectedName !== managedWard);
            } else {
                return [...prevSelected, managedWard];
            }
        });
    };

    return (
        <DetailPopup
            onClose={() => setOpenAdd(false)}
            title="Tạo bưu cục - đại lý"
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
                        {!loading && <><FaSave className="-mr-.5" />Xác nhận</>}
                        {loading &&
                            <svg aria-hidden="true" className="w-14 h-6 text-gray-200 animate-spin dark:text-gray-600 fill-green-500" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                            </svg>
                        }
                    </Button>
                </div>
            }
        >
            {openSubmit && <SubmitPopup message={message} onClose={() => { setOpenSubmit(false); setLoading(false) }} submit={handleCreate} />}
            {openError && <NotiPopup message={message} onClose={() => { setOpenError(false) }} />}
            {reload && <NotiPopup message={message} onClose={() => { setReload(false); reloadData() }} />}
            <div className="mb-2">
                <AnimatePresence initial={false}>
                    {form == 0 && <motion.div
                        key="option0"
                        className="w-full"
                        initial={{ scale: 0, height: "0" }}
                        animate={{ scale: 1, height: "auto" }}
                        exit={{ scale: 0, height: "0" }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="flex justify-center place-items-center flex-col gap-6 w-full">
                            <div className='w-full flex text-center justify-center mt-4'>
                                <strong>Thông tin người đứng đầu bưu cục - đại lý</strong>
                            </div>
                            {fields.map(({ id, type, label, important, onChange }) => (
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
                            ))}
                        </div>
                    </motion.div>}
                </AnimatePresence>
            </div>
            <div className="mb-2">
                <AnimatePresence initial={false}>
                    {
                        form == 1 && <motion.div
                            key="option0"
                            className="w-full"
                            initial={{ scale: 0, height: "0" }}
                            animate={{ scale: 1, height: "auto" }}
                            exit={{ scale: 0, height: "0" }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className="flex justify-center place-items-center flex-col gap-6 w-full">
                                <div className='w-full flex text-center justify-center mt-4'>
                                    <strong>Thông tin bưu cục - đại lý</strong>
                                </div>
                                {fields2.map(({ id, type, label, important, onChange }) => (
                                    <>
                                        <div key={id} className="flex gap-2 w-full flex-col lg:flex-row">
                                            <div className='lg:w-56 lg:min-w-[14rem] flex lg:justify-between place-items-center'>
                                                <strong className="flex gap-1 whitespace-nowrap"><FormattedMessage id={label} />{important && <div className="text-red-500">*</div>}</strong>:
                                            </div>
                                            <p className="whitespace-nowrap flex flex-row gap-2 relative w-full">
                                                <RenderCase renderIf={id == "type"}>
                                                    <InputField
                                                        variant="auth1"
                                                        id="type"
                                                        type="select"
                                                        state={error && !data2[id] ? "error" : "none"}
                                                        options={Object.values(AgencyType).filter((value) => typeof value === "string")}
                                                        placeholder="Chọn..."
                                                        value={data2.type || ""}
                                                        setValue={(value: string) => handleChange2(id, value)}
                                                        className="bg-white dark:!bg-[#3a3b3c] border-red-500"
                                                        extra="w-full"
                                                    />
                                                </RenderCase>

                                                <RenderCase renderIf={type != "select"}>
                                                    <InputField
                                                        variant="auth1"
                                                        id={label}
                                                        type={type}
                                                        state={error && (requireFields2.includes(id) || id == "taxNumber" || id == "companyName") && !data2[id] ? "error" : "none"}
                                                        value={data2[id] as string}
                                                        setValue={(value: string) => onChange ? onChange(id, value) : handleChange2(id, value)}
                                                        className="bg-white dark:!bg-[#3a3b3c] w-full"
                                                        extra="w-full"
                                                    />
                                                </RenderCase>

                                                <RenderCase renderIf={id == "individualCompany"}>
                                                    <InputField
                                                        variant="auth1"
                                                        id="indi"
                                                        type="select"
                                                        options={[{
                                                            value: true,
                                                            label: "IndividualCompany"
                                                        }, {
                                                            value: false,
                                                            label: "CoopCompany"
                                                        }]}
                                                        placeholder="Chọn..."
                                                        value={data2.individualCompany}
                                                        setValue={(value: string) => handleChange2(id, value)}
                                                        className="bg-white dark:!bg-[#3a3b3c]"
                                                        extra="w-full"
                                                    />
                                                </RenderCase>
                                            </p>

                                        </div>
                                        <RenderCase renderIf={id == "detailAddress"}>
                                            <div className="grid gap-6 lg:gap-2 lg:grid-flow-col lg:grid-cols-3 lg:pl-[14.5rem] w-full">
                                                <InputField
                                                    variant="auth1"
                                                    id="province2"
                                                    type="select"
                                                    state={error && !data2["province"] ? "error" : "none"}
                                                    options={provinces}
                                                    placeholder={intl.formatMessage({ id: 'OrderForm.LocationForm.SelectProvince' })}
                                                    value={data2.province || ""}
                                                    setValue={handleProvinceChange2}
                                                    className="bg-white dark:!bg-[#3a3b3c]"
                                                    extra="w-full"
                                                />
                                                <InputField
                                                    variant="auth1"
                                                    id="district2"
                                                    type="select"
                                                    state={error && !data2["district"] ? "error" : "none"}
                                                    options={districts2}
                                                    placeholder={intl.formatMessage({ id: 'OrderForm.LocationForm.SelectDistrict' })}
                                                    value={data2.district || ""}
                                                    setValue={handleDistrictChange2}
                                                    className="bg-white dark:!bg-[#3a3b3c]"
                                                    extra="w-full"
                                                />
                                                <InputField
                                                    variant="auth1"
                                                    id="town2"
                                                    type="select"
                                                    state={error && !data2["town"] ? "error" : "none"}
                                                    options={wards2}
                                                    placeholder={intl.formatMessage({ id: 'OrderForm.LocationForm.SelectWard' })}
                                                    value={data2.town || ""}
                                                    setValue={handleWardChange2}
                                                    className="bg-white dark:!bg-[#3a3b3c]"
                                                    extra="w-full"
                                                />
                                            </div>

                                        </RenderCase>
                                    </>
                                )
                                )}
                            </div>
                        </motion.div>
                    }
                </AnimatePresence>
            </div>
            <div className="mb-2">
                <AnimatePresence initial={false}>
                    {
                        form == 2 && <motion.div
                            key="option0"
                            className="w-full"
                            initial={{ scale: 0, height: "0" }}
                            animate={{ scale: 1, height: "auto" }}
                            exit={{ scale: 0, height: "0" }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className="flex justify-center place-items-center flex-col gap-6 w-full">
                                <div className='w-full flex text-center justify-center mt-4'>
                                    <strong>Chọn khu vực quản lý (có thể bỏ qua)</strong>
                                </div>
                                <p className="whitespace-nowrap flex flex-col gap-2 relative w-full">
                                    <div className="grid gap-6 lg:gap-2 lg:grid-flow-col lg:grid-cols-3 w-full">
                                        <InputField
                                            variant="auth1"
                                            id="province3"
                                            type="select"
                                            state={error && !selectedProvince ? "error" : "none"}
                                            options={provinces}
                                            placeholder={intl.formatMessage({ id: 'OrderForm.LocationForm.SelectProvince' })}
                                            value={selectedProvince}
                                            setValue={handleProvinceChange3}
                                            className="bg-white dark:!bg-[#3a3b3c]"
                                            extra="w-full"
                                        />
                                        <InputField
                                            variant="auth1"
                                            id="district2"
                                            type="select"
                                            state={error && !selectedDistrict ? "error" : "none"}
                                            options={districts3}
                                            placeholder={intl.formatMessage({ id: 'OrderForm.LocationForm.SelectDistrict' })}
                                            value={selectedDistrict}
                                            setValue={handleDistrictChange3}
                                            className="bg-white dark:!bg-[#3a3b3c]"
                                            extra="w-full"
                                        />
                                        <InputField
                                            variant="auth1"
                                            id="town3"
                                            type="select"
                                            state={error && !selectedWard ? "error" : "none"}
                                            options={wards3}
                                            placeholder={intl.formatMessage({ id: 'OrderForm.LocationForm.SelectWard' })}
                                            value={selectedWard}
                                            setValue={handleWardChange3}
                                            className="bg-white dark:!bg-[#3a3b3c]"
                                            extra="w-full"
                                        />
                                    </div>
                                    <div className="flex gap-2 flex-1">
                                        <Button
                                            onClick={handleAddManagedWard}
                                            className="rounded-md flex-1 text-green-500 border-green-500 hover:border-green-600 bg-transparent hover:text-white border-2 hover:bg-green-600 hover:shadow-md">
                                            Thêm
                                        </Button>
                                        <Button
                                            onClick={handleDeleteManagedWard}
                                            className="rounded-md text-red-500 border-red-500 hover:border-red-600 bg-transparent hover:text-white border-2 hover:bg-red-600 hover:shadow-md">
                                            <FaTrash /> ({selectedManagedWard.length})
                                        </Button>
                                    </div>
                                    <div className="mt-2 flex flex-col gap-2 overflow-y-scroll max-h-[400px] pr-2">
                                        {data2.managedWards.length == 0 ?
                                            <div className="flex justify-center place-items-center w-full h-40 gap-2 p-4 rounded-xl">
                                                Hiện chưa thêm khu vực quản lý nào
                                            </div>
                                            :
                                            <AnimatePresence initial={false}>
                                                {data2.managedWards.map((managedWard) => {
                                                    return (
                                                        <div className="flex relative ">
                                                            <motion.div
                                                                onClick={() => handleCheckboxChange(managedWard)}

                                                                key={managedWard}
                                                                initial={{ opacity: 1 }}
                                                                animate={{ opacity: 1 }}
                                                                exit={{ opacity: 0 }}
                                                                transition={{ duration: 0.3 }}
                                                                className={`w-full border border-gray-200 cursor-pointer dark:!border-white rounded-lg p-2 flex flex-row gap-2 ${selectedManagedWard.includes(managedWard)
                                                                    ? "bg-[#000000]/10 dark:bg-white/10"
                                                                    : "dark:bg-[#242526] bg-white"
                                                                    }`}
                                                            >
                                                                <Checkbox
                                                                    color="red"
                                                                    className="mt-[2px] dark:border-gray-200 "
                                                                    checked={selectedManagedWard.includes(managedWard)}
                                                                    onChange={() => { }}
                                                                />
                                                                <div className="text-center font-semibold w-full ">
                                                                    {managedWard}
                                                                </div>
                                                            </motion.div></div>

                                                    );
                                                })}
                                            </AnimatePresence>}
                                    </div>
                                </p>
                            </div>
                        </motion.div>
                    }
                </AnimatePresence>
            </div>
        </DetailPopup>
    );
};

export default AddPostOffice;
