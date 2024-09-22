"use client"
import React, { MouseEvent, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from 'next/navigation';
import { motion, Variants } from "framer-motion";
import DashIcon from "@/components/icons/DashIcon";
import routes from "@/data/routes";
import { FormattedMessage, useIntl } from "react-intl";

type Props = {
  onClickRoute?: (e: MouseEvent<HTMLElement>) => any | any
}

const linkVariants: Variants = {
  initial: { opacity: 0, y: -10 },
  animate: { opacity: 1, y: 0 },
};

const SidebarLinks = ({ onClickRoute }: Props) => {
  const pathname = usePathname();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const intl = useIntl();

  useEffect(() => {
    const findActiveRouteIndex = () => {
      return routes.findIndex(route => route.layout && route.path && pathname.includes(route.path));
    };
    setActiveIndex(findActiveRouteIndex());
  }, [pathname]);

  const handleRouteClick = (index: number, e: React.MouseEvent<HTMLElement>) => {
    setActiveIndex(index);
    onClickRoute && onClickRoute(e);
  };

  const createLinks = (routes: any) => {
    const managementRoutes = routes.filter((route: { path: string }) => route.path === "orders" || route.path === "shipments");
    const helpRoutes = routes.filter((route: { path: string }) => route.path !== "orders" && route.path !== "shipments" && route.path !== "create");

    const renderLinks = (routes: any, startIndex: number, headerId: string) => (
      <div>
        <p className={`${activeIndex != null && activeIndex == startIndex ? "" : "text-gray-600"} font-semibold mb-2 pl-5 pt-2`}><FormattedMessage id={headerId} /></p>
        {routes.map((route: any, index: number) => {
          const routeIndex = index + startIndex;
          return (
            <Link key={`route-${routeIndex}`} href={route.path} onClick={(e) => handleRouteClick(routeIndex, e)}>
              <motion.div
                variants={linkVariants}
                initial="initial"
                animate="animate"
                transition={{ duration: 0.3, delay: 0.1 * routeIndex }}
                className="relative mb-3 flex hover:cursor-pointer"
              >
                <li className="my-[3px] flex cursor-pointer items-center px-8">
                  <span className={`${activeIndex === routeIndex ? "font-bold text-red-500 dark:text-white" : "font-medium text-gray-600"}`}>
                    {route.icon ? route.icon : <DashIcon />}{" "}
                  </span>
                  <p className={`leading-1 ml-4 flex ${activeIndex === routeIndex ? "font-medium text-red-500 dark:text-white" : "font-medium text-gray-600"}`}>
                    {intl.formatMessage({ id: `routes.${route.path}` })}
                  </p>
                </li>
                {activeIndex === routeIndex && (
                  <motion.div
                    className="absolute right-0 -top-0.5 h-9 w-1 rounded-lg bg-red-500 dark:bg-red-500"
                    initial={{ x: "100%", opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: "-100%", opacity: 0 }}
                    transition={{ duration: 0.5, ease: "easeInOut", delay: 0.1 * routeIndex }}
                  />
                )}
              </motion.div>
            </Link>
          );
        })}
      </div>
    );

    return (
      <>
        {renderLinks(managementRoutes, 0, "routes.manage")}
        {renderLinks(helpRoutes, 2, "routes.helpcenter")}
      </>
    );
  };

  return createLinks(routes);
};

export default SidebarLinks;
