import { FaBox, FaShippingFast, FaUsers, FaCalendarAlt, FaTruck, FaMapMarkerAlt, FaHandshake, FaBuilding, FaBriefcase, FaPlusCircle, FaUserCircle } from "react-icons/fa";
import { MdOutlineAddCircleOutline } from "react-icons/md";

const routes = [
  {
    name: "Đơn hàng",
    layout: "/dashboard",
    path: "orders",
    icon: <FaBox className="h-4 w-4" />,
  },
  {
    name: "Lô hàng",
    layout: "/dashboard",
    path: "shipments",
    icon: <FaShippingFast className="h-4 w-4" />,
  },
  {
    name: "Tài khoản",
    layout: "/dashboard",
    path: "account",
    icon: <FaUserCircle className="h-4 w-4" />,
  },
  {
    name: "Nhân viên",
    layout: "/dashboard",
    path: "staff",
    icon: <FaUsers className="h-4 w-4" />,
  },
  // {
  //   name: "Lịch trình",
  //   layout: "/dashboard",
  //   path: "schedule",
  //   icon: <FaCalendarAlt className="h-4 w-4" />,
  // },
  {
    name: "Phương tiện",
    layout: "/dashboard",
    path: "vehicles",
    icon: <FaTruck className="h-4 w-4" />,
  },
  {
    name: "Bưu cục - đại lý",
    layout: "/dashboard",
    path: "postoffices",
    icon: <FaMapMarkerAlt className="h-4 w-4" />,
  },
  {
    name: "Đối tác vận tải",
    layout: "/dashboard",
    path: "partners",
    icon: <FaHandshake className="h-4 w-4" />,
  },
  {
    name: "Doanh nghiệp",
    layout: "/dashboard",
    path: "business",
    icon: <FaBuilding className="h-4 w-4" />,
  },
  {
    name: "Công việc",
    layout: "/dashboard",
    path: "tasks",
    icon: <FaBriefcase className="h-4 w-4" />,
  },
];

export default routes;
