import React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import DetailPopup from "@/components/popup";
import JourneyTimeline from "@/components/timeline";

interface DetailOrderProps {
    onClose: () => void;
    dataInitial: any;
}

const DetailOrder: React.FC<DetailOrderProps> = ({ onClose, dataInitial }) => {
    const intl = useIntl()
    const parseJourney = [...dataInitial.journey].reverse().map((item: string) => {
        const [time, message] = item.split(': ');
        return { time, message };
    });
    return (
        <DetailPopup className2="sm:w-fit" children={
            <div className="flex flex-col md:flex-row gap-2 md:gap-8">
                <JourneyTimeline journey={parseJourney} order={true} />
                <div className="w-full text-[#4b4b4b] dark:text-white">
                    <div className="flex flex-col gap-2">
                        <div className="font-bold text-lg text-center md:text-xl mb-2 flex flex-col">Mã đơn hàng: <p>{dataInitial.orderId}</p></div>
                        <div className='flex gap-2'>
                            <div className='w-32 min-w-[128px] flex justify-between'>
                                <strong><FormattedMessage id="History.NameSender" /></strong>
                                :</div> {dataInitial.nameSender}</div>
                        <div className='flex gap-2'>
                            <div className='w-32 min-w-[128px] flex justify-between'>
                                <strong><FormattedMessage id="History.PhoneNumSender" /></strong>
                                :</div> {dataInitial.phoneNumberSender}</div>
                        <div className='flex gap-2'>
                            <div className='w-32 min-w-[128px] flex justify-between'>
                                <strong><FormattedMessage id="History.NameReceiver" /></strong>
                                :</div> {dataInitial.nameReceiver}</div>
                        <div className='flex gap-2'>
                            <div className='w-32 min-w-[128px] flex justify-between'>
                                <strong><FormattedMessage id="History.PhoneNumReceiver" /></strong>
                                :</div> {dataInitial.phoneNumberReceiver}</div>
                        <div className='flex gap-2'>
                            <div className='w-32 min-w-[128px] flex justify-between'>
                                <strong><FormattedMessage id="History.SenderAddr" /></strong>
                                :</div> {`${dataInitial.detailSource}, ${dataInitial.wardSource}, ${dataInitial.districtSource}, ${dataInitial.provinceSource}`}</div>
                        <div className='flex gap-2'>
                            <div className='w-32 min-w-[128px] flex justify-between'>
                                <strong><FormattedMessage id="History.ReceiverAddr" /></strong>
                                :</div> {`${dataInitial.detailDest}, ${dataInitial.wardDest}, ${dataInitial.districtDest}, ${dataInitial.provinceDest}`}</div>
                        <div className='flex gap-2'>
                            <div className='w-32 min-w-[128px] flex justify-between'>
                                <strong><FormattedMessage id="History.Mass" /></strong>
                                :</div> {dataInitial.mass}</div>
                        <div className='flex gap-2'>
                            <div className='w-32 min-w-[128px] flex justify-between'>
                                <strong><FormattedMessage id="History.Height" /></strong>
                                :</div> {dataInitial.height}</div>
                        <div className='flex gap-2'>
                            <div className='w-32 min-w-[128px] flex justify-between'>
                                <strong><FormattedMessage id="History.Width" /></strong>
                                :</div> {dataInitial.width}</div>
                        <div className='flex gap-2'>
                            <div className='w-32 min-w-[128px] flex justify-between'>
                                <strong><FormattedMessage id="History.Length" /></strong>
                                :</div> {dataInitial.length}</div>
                        <div className='flex gap-2'>
                            <div className='w-32 min-w-[128px] flex justify-between'>
                                <strong><FormattedMessage id="History.Fee" /></strong>
                                :</div> {dataInitial.fee}</div>
                        <div className='flex gap-2'>
                            <div className='w-32 min-w-[128px] flex justify-between'>
                                <strong><FormattedMessage id="History.COD" /></strong>
                                :</div> {dataInitial.cod}</div>
                        <div className='flex gap-2'>
                            <div className='w-32 min-w-[128px] flex justify-between'>
                                <strong><FormattedMessage id="History.ServiceType" /></strong>
                                :</div>
                            {dataInitial.serviceType === "CPN" ?
                                intl.formatMessage({ id: 'OrderForm.MoreDetailsForm.typesOfDelivery1' })
                                : dataInitial.serviceType === "TTk" ?
                                    intl.formatMessage({ id: 'OrderForm.MoreDetailsForm.typesOfDelivery3' })
                                    :
                                    intl.formatMessage({ id: 'OrderForm.MoreDetailsForm.typesOfDelivery4' })}
                        </div>
                    </div>
                </div>
            </div>} onClose={onClose} title={intl.formatMessage({ id: "History.Detail.Title" })} />
    );
};

export default DetailOrder;
