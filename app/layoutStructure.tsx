"use client";
import { type Metadata } from "next";
import "./globals.css";
import "@/components/calendar/MiniCalendar.css";
import Image from "next/image";
import { LoadScript } from "@react-google-maps/api";
import { Suspense } from "react";
import UserProvider from "@/providers/PassedData";
import { usePathname, useSearchParams } from 'next/navigation';
import { FormattedMessage, IntlProvider } from 'react-intl';
import SidebarProvider from "@/providers/SidebarProvider";
export const CustomLoadingElement = () => {
  return (
    <div className="w-full h-screen flex flex-col gap-4 justify-center place-items-center dark:text-white bg-white dark:bg-[#3a3b3c]">
      <Image src="/Logo.png" alt="Your image" width={70} height={70} />
      <span className="text-xl dark:text-white"><FormattedMessage id="LoadingMessage" /></span>
    </div>
  );
};
type LanguageMessages = {
  [key: string]: any;
}
export default function layoutStructure({
  childrenProps,
}: {
  childrenProps: React.ReactNode;
}) {
  const languages: LanguageMessages = {
    vi: require('@/language/vi.json'),
    en: require('@/language/en.json')
  };

  const pathname = usePathname();
  const searchParams = useSearchParams();

  const locale = searchParams.get('locale') || 'vi';
  const defaultLocale = 'vi';
  const messages = languages[locale];
  return (
    <IntlProvider messages={messages} locale={locale} defaultLocale={defaultLocale}>

      <LoadScript
        googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_API_KEY ?? ""}
        libraries={["places"]}
        loadingElement={<CustomLoadingElement />}
      >

        <UserProvider>
          <SidebarProvider>
            <Suspense fallback={<CustomLoadingElement />}>{childrenProps}</Suspense>
          </SidebarProvider>
        </UserProvider>

      </LoadScript>
    </IntlProvider>

  );
}
