"use client";
import "@/app/globals.css";
import "@/components/calendar/MiniCalendar.css";
import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";
import { useSidebarContext } from "@/providers/SidebarProvider";
import { usePathname } from "next/navigation";
import PassDataProvider from "@/providers/PassedData";
import SettingProvider from "@/providers/SettingProvider";
import { Suspense, useEffect } from "react";
import CustomLoadingElement from "./loading";
import useMobileView from "@/hooks/useMobileView";
const RootStructure = ({ children }: { children: React.ReactNode }) => {
  const { openSidebar, setOpenSidebar } = useSidebarContext()
  const { isMobile } = useMobileView()

  return (
    <>
      <SettingProvider>
        <PassDataProvider>
          <section className="flex h-full w-full">
            <Sidebar />
            {/* Navbar & Main Content */}
            <div className="h-full w-full bg-lightPrimary dark:!bg-[#3a3b3c]">
              {/* Main Content */}
              <main className={`mx-[12px] h-full flex-none transition-all md:pr-2 ${!isMobile && openSidebar ? "xl:ml-[313px]" : "xl:ml-5"}`}>
                {/* Routes */}
                <div className="h-full">
                  <Navbar />
                  <div className="pt-5s mx-auto mb-auto h-full min-h-[calc(100dvh-120px)] md:min-h-[calc(100dvh-89.5px)] p-2 md:pr-2">
                    <Suspense fallback={<CustomLoadingElement />}>{children}</Suspense>
                  </div>
                </div>
              </main>
            </div>
          </section>
        </PassDataProvider >
      </SettingProvider>
    </>
  );
};

export default RootStructure;
