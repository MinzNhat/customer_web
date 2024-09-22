'use client'

import { AuthOperation, RegisteringPayload, Role, StaffOperation, TransportPartnerStaffOperation, VehicleOperation } from "@/TDLib/main";
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

interface CreateVehicle {
    transportPartnerId?: string,
    agencyId?: string,
    staffId: string,
    type: string,
    licensePlate: string,
    maxLoad: string
}
const AddVehicle = ({ setOpenAdd, reloadData }: { setOpenAdd: any, reloadData: any }) => {
    const intl = useIntl();
    const { passData, setPassData } = usePassDataContext();
    const [vehicleInfo, setVehicleInfo] = useState<CreateVehicle>({
        transportPartnerId: "",
        agencyId: "",
        staffId: "",
        type: "",
        licensePlate: "",
        maxLoad: "0"
    });
    const { theme } = useThemeContext()
    const [openSubmit, setOpenSubmit] = useState(false)
    const [openError, setOpenError] = useState(false)
    const [openError2, setOpenError2] = useState(false)
    const adminRole = ["ADMIN", "MANAGER", "HUMAN_RESOURCE_MANAGER", "TELLER", "COMPLAINTS_SOLVER"];
    const vehicleOperation = new VehicleOperation()
    const [message, setMessage] = useState<any>("")
    const REGEX_LICENSE_PLATE = /^(1[124-9]|2[0-9]|[3-9][0-9])-[ABCEFGHKLMNPSTUVXYZ][1-9]{1}\s\d{4,5}$/
    const REGEX_TRANSPORT_PARTNER = /^(TD|BC|DL)_\d{5}_\d{12}$/

    const handleChange = (field: keyof CreateVehicle, value: string | number) => {
        setVehicleInfo(prev => ({ ...prev, [field]: value }));
    };

    const handleNumberChange = (id: keyof CreateVehicle, value: string) => {
        let sanitizedValue = value.replace(/^0+/, '');
        let numberValue = sanitizedValue ? parseInt(sanitizedValue, 10) : 0;
        setVehicleInfo(prev => ({ ...prev, [id]: numberValue }));
    };

    const fields: Array<{ id: keyof CreateVehicle, type: string, label: string, onChange?: (id: keyof CreateVehicle, value: string) => void }> = [
        { id: "transportPartnerId", type: "text", label: "AddVehicle.TransportPartnerId" },
        { id: "agencyId", type: "text", label: "AddVehicle.AgencyId" },
        { id: "staffId", type: "text", label: "AddVehicle.StaffId" },
        { id: "type", type: "text", label: "AddVehicle.Type" },
        { id: "licensePlate", type: "text", label: "AddVehicle.LicensePlate" },
        { id: "maxLoad", type: "text", label: "AddVehicle.MaxLoad", onChange: handleNumberChange },
    ];

    const getAvailableFields = () => {
        return adminRole.includes(passData.account.role) ? fields : fields.filter((field) => field.id !== "agencyId");
    };

    const submitClick = () => {
        if (adminRole.includes(passData.account.role)) {
            if (!vehicleInfo.agencyId) {
                setMessage("Vui lòng nhập mã bưu cục")
                setOpenError(true)
                return;
            }
        }

        if (!vehicleInfo.staffId) {
            setMessage("Vui lòng nhập mã nhân viên vận chuyển")
            setOpenError(true)
            return;
        }

        if (!vehicleInfo.type) {
            setMessage("Vui lòng nhập loại phương tiện")
            setOpenError(true)
            return;
        }

        if (!vehicleInfo.licensePlate) {
            setMessage("Vui lòng nhập biển số phương tiện")
            setOpenError(true)
            return;
        }

        if (vehicleInfo.maxLoad == "0") {
            setMessage("Vui lòng nhập tải trọng tối đa")
            setOpenError(true)
            return;
        }

        if (vehicleInfo.transportPartnerId && !REGEX_TRANSPORT_PARTNER.test(vehicleInfo.transportPartnerId)) {
            setMessage("Vui lòng nhập đúng định dạng mã đối tác vận chuyển hoặc để trống")
            setOpenError(true)
            return;
        }

        if (!REGEX_LICENSE_PLATE.test(vehicleInfo.licensePlate)) {
            setMessage("Vui lòng nhập đúng định dạng biển số xe")
            setOpenError(true)
            return;
        }
        setMessage("Xác nhận tạo phương tiện?")
        setOpenSubmit(true)
    };

    const createVehicle = async () => {
        let response
        if (adminRole.includes(passData.account.role)) {
            const createData = {
                agencyId: vehicleInfo.agencyId,
                staffId: vehicleInfo.staffId,
                type: vehicleInfo.type,
                licensePlate: vehicleInfo.licensePlate,
                maxLoad: parseFloat(vehicleInfo.maxLoad),
                ...(vehicleInfo.transportPartnerId && { transportPartnerId: vehicleInfo.transportPartnerId }),
            };
            response = await vehicleOperation.createByAdmin(createData)
        } else {
            const createData = {
                staffId: vehicleInfo.staffId,
                type: vehicleInfo.type,
                licensePlate: vehicleInfo.licensePlate,
                maxLoad: parseFloat(vehicleInfo.maxLoad),
                ...(vehicleInfo.transportPartnerId && { transportPartnerId: vehicleInfo.transportPartnerId }),
            };
            response = await vehicleOperation.createByAgency(createData)
        }
        setOpenSubmit(false)
        if (!response.error) {
            setMessage("Tạo phương tiện thành công")
            setOpenError2(true)
        } else {
            setMessage(response.message || response.error.message)
            setOpenError(true)
        }
    };

    return (
        <DetailPopup
            onClose={() => setOpenAdd(false)}
            title={intl.formatMessage({ id: "AddVehicle.Title" })}
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
            {openSubmit && <SubmitPopup message={message} onClose={() => setOpenSubmit(false)} submit={createVehicle} />}
            <div className="flex flex-col gap-2 mb-2">
                {getAvailableFields().map(({ id, type, label, onChange }) => (
                    <div key={id} className="flex gap-2 w-full flex-col lg:flex-row">
                        <div className='lg:w-64 lg:min-w-[16rem] flex lg:justify-between place-items-center whitespace-nowrap'>
                            <strong><FormattedMessage id={label} /></strong>:
                        </div>
                        <p className="whitespace-nowrap flex flex-row gap-2 relative w-full">
                            <InputField
                                variant="auth1"
                                id={id}
                                type={type}
                                value={vehicleInfo[id] as string}
                                setValue={(value: string) => onChange ? onChange(id, value) : handleChange(id, value)}
                                className="bg-white dark:!bg-[#3a3b3c] w-full"
                                extra="w-full"
                            />
                        </p>
                    </div>
                ))}
            </div>
        </DetailPopup>
    );
};

export default AddVehicle;
