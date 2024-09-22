"use client";
import "@/app/globals.css";
import "@/components/calendar/MiniCalendar.css";
import Card from "@/components/card";
import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";
import SettingProvider from "@/providers/SettingProvider";
import SidebarProvider from "@/providers/SidebarProvider";
import { motion } from "framer-motion";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { IntlProvider } from "react-intl";
type LanguageMessages = {
    [key: string]: any;
}
const NotFound = () => {
    const route = useRouter()
    const languages: LanguageMessages = {
        vi: require('@/language/vi.json'),
        en: require('@/language/en.json')
    };
    const searchParams = useSearchParams();

    const locale = searchParams.get('locale') || 'vi';
    const defaultLocale = 'vi';
    const messages = languages[locale];
    return (
        <>
            <IntlProvider messages={messages} locale={locale} defaultLocale={defaultLocale}>
                <SidebarProvider>
                    <SettingProvider>
                        <section className="flex h-screen w-full">
                            <Sidebar />

                            {/* Navbar & Main Content */}
                            <div className="h-full w-full bg-lightPrimary dark:!bg-[#3a3b3c]">
                                <main className="mx-[12px] h-full flex-none transition-all xl:ml-[313px]">
                                    {/* Routes */}
                                    <div className="h-full">

                                        <div className="pt-5s mx-auto mb-auto h-full p-2">
                                            <div className="grid h-full grid-cols-1 gap-5">
                                                <Card className="w-full h-full bg-red-500 flex justify-center place-items-center px-2 text-center">
                                                    <h1 className="text-4xl font-bold text-red-500 uppercase">404</h1>
                                                    <h2 className="text-2xl font-bold text-red-500 mt-2">Trang không khả dụng</h2>
                                                    <motion.button
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.9 }}
                                                        transition={{ duration: 0.3 }}
                                                        className=" mt-4 px-4 py-2 truncate h-10 rounded-md overflow-clip text-white bg-red-500 hover:cursor-pointer flex"
                                                        onClick={() => route.push("/orders")}
                                                    >
                                                        Quay lại
                                                    </motion.button>
                                                </Card>
                                            </div>

                                        </div>
                                    </div>
                                </main>

                            </div>
                        </section>
                    </SettingProvider>
                </SidebarProvider>
            </IntlProvider>
        </>
    );
};

export default NotFound;
