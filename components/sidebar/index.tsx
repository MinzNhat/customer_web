"use client"
import { FC } from 'react'
import { HiX } from "react-icons/hi";
import Image from 'next/image';
import { useSidebarContext } from '@/providers/SidebarProvider';
import useMobileView from '@/hooks/useMobileView';
import Links from "./components/Links";

type Props = {}

const Sidebar: FC<Props> = () => {
  const { isMobile } = useMobileView()
  const { openSidebar, setOpenSidebar } = useSidebarContext()

  return (
    <>
      <div className={`bg-[#000] bg-opacity-70 fixed inset-0 z-50 ${openSidebar && isMobile ? 'block w-screen h-screen' : 'hidden'}`} onClick={() => setOpenSidebar(false)} />
      <div
        className={`sm:none duration-175 linear fixed !z-50 flex min-h-full max-h-[100dvh] flex-col bg-white shadow-2xl shadow-white/5 transition-all dark:!bg-[#242526] dark:text-white md:!z-50 lg:!z-50 xl:!z-0 
        ${openSidebar ? "-translate-x-0" : "-translate-x-96"}`}
      >
        <span className="absolute top-4 right-4 block cursor-pointer" onClick={() => setOpenSidebar(false)} >
          <HiX />
        </span>

        <div className={`mx-[20px] mt-[50px] flex flex-col items-center relative w-[210px]`}>
          <Image src="/Logo_horizontal.png" alt="Your image" width={210} height={210} />
        </div>

        <div className="mt-[58px] mb-7 h-px bg-gray-300 dark:bg-white/30" />

        <ul className="pt-1 overflow-y-scroll no-scrollbar">
          <Links onClickRoute={isMobile ? () => setOpenSidebar(false) : undefined} />
        </ul>
      </div>
    </>
  );
};

export default Sidebar;
