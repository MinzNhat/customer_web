'use client'
import { LuBox } from "react-icons/lu";
interface JourneyItem {
    time: string;
    message: string;
}
const JourneyTimeline = ({ journey, order }: { journey: JourneyItem[], order?: boolean }) => {

    return (
        <div className="pl-4 pb-4">
            {journey ? <ol className="relative border-s border-gray-200 dark:border-gray-500">
                {journey.length != 0 && journey.map((item, index) => (
                    <li key={index} className={`ms-6 ${order ? "mb-10" : (index == journey.length - 1 ? "-mb-4" : "mb-10")}`}>

                        <span className={`absolute flex items-center justify-center w-8 h-8 rounded-full -start-4  text-red-500 dark:text-white bg-red-100 dark:bg-red-500 `}>
                            <svg className="w-2.5 h-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 1 1 0 2H5a1 1 0 1 1 0-2Z" />
                            </svg>
                        </span>
                        {index == 0 && <>
                            <span className={`absolute flex items-center justify-center w-2.5 h-2.5 bg-green-500 rounded-full start-2 animate-ping`} />
                            <span className={`absolute flex items-center justify-center w-2.5 h-2.5 border-[1px] bg-green-500 dark:border-[#242526] border-white rounded-full start-2`} />
                        </>}
                        <h3 className="flex items-center mb-1 pt-1 font-semibold text-gray-900 dark:text-white">{item.message}</h3>
                        <time className="block mb-2 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">{item.time}</time>
                    </li>
                ))}
                {order && <li className="ms-6">
                    <span className="absolute flex items-center justify-center w-8 h-8 rounded-full -start-4 text-red-500 dark:text-white bg-red-100 dark:bg-red-500">
                        <LuBox />
                    </span>
                    <h3 className="flex items-center mb-1 pt-1 font-semibold text-gray-900 dark:text-white">Đơn hàng được tạo mới</h3>
                </li>}
            </ol> : <div className="flex justify-center place-items-center w-full h-full gap-2 p-4 rounded-xl">
                <svg aria-hidden="true" className="w-20 h-6 text-gray-200 animate-spin dark:text-gray-600 fill-red-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                </svg>
            </div>}
        </div>
    );
};

export default JourneyTimeline;

