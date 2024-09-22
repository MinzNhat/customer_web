"use client";

import { useEffect, useState, useRef, useContext } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FiAlignJustify, FiSearch } from "react-icons/fi";
import { RiImageEditLine, RiMoonFill, RiSunFill } from "react-icons/ri";
import { TbBrandGithubFilled } from "react-icons/tb";
import Dropdown from "@/components/dropdown";
import routes from "@/data/routes";
import { useSidebarContext } from "@/providers/SidebarProvider";
import { useThemeContext } from "@/providers/ThemeProvider";
import Image from "next/image";
import { Variants, motion } from "framer-motion";
import { BsGlobe } from "react-icons/bs";
import LanguageSwitcher from "../language";
import { FormattedMessage, useIntl } from "react-intl";
import { usePassDataContext } from "@/providers/PassedData";
import NotiPopup from "../notification";
import SubmitPopup from "../submit";
import DetailPopup from "../popup";
import { AccountOperation, AdministrativeOperation, CustomerOperation, StaffOperation } from "@/TDLib/main";
import { IoCloudUploadOutline } from "react-icons/io5";
import { Button } from "@nextui-org/react";
import { FaPen, FaSave } from "react-icons/fa";
import Select from "react-select";
import { useSettingContext } from "@/providers/SettingProvider";
import InputField from "../fields/InputField";
type Props = {};

const Navbar = ({ }: Props) => {
  const [currentRoute, setCurrentRoute] = useState("Loading...");
  const route = useRouter();
  const pathname = usePathname();
  const { openSidebar, setOpenSidebar } = useSidebarContext();
  const { theme, setTheme } = useThemeContext();
  const [username, setUsername] = useState<string>("");
  const [profilePicture, setProfilePicture] = useState<any>(
    "/img/avatars/avatar_4.jpg"
  );
  const [search, setSearch] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { passData, setPassData } = usePassDataContext()
  const intl = useIntl();
  const [message, setMessage] = useState("")
  const [modal, openModal] = useState(false)
  const [modal2, openModal2] = useState(false)
  const { openSetting, setOpenSetting } = useSettingContext()
  const [modal4, openModal4] = useState(false)
  const [modal5, openModal5] = useState(false)
  const [modal6, openModal6] = useState(false)
  const [avatarUpload, setavatarUpload] = useState<File | "">("");
  const [loading, setLoading] = useState(false)
  const [editing, setEditing] = useState(false)
  const [dataUpdate, setDataUpdate] = useState<any>()
  const [password, setPassword] = useState({
    oldPassword: "",
    newPassword: "",
    newPassword2: "",
  })
  const [openPw, setOpenPw] = useState(false)
  const imgURL = "https://api2.tdlogistics.net.vn/v2/staffs/avatar/get?staffId="
  const emailRegex = /^[a-zA-Z0-9._-]{1,64}@[a-zA-Z0-9._-]{1,255}\.[a-zA-Z]{2,4}$/;
  const phoneNumberRegex = /^[0-9]{10,11}$/;
  const getActiveRoute = (routes: any) => {
    let activeRoute = "orders";
    for (let i = 0; i < routes.length; i++) {
      if (window.location.href.indexOf(routes[i].path) !== -1) {
        setCurrentRoute(routes[i].path);
      }
    }
    return activeRoute;
  };

  const handleLogoutClick = async () => {
    setMessage(intl.formatMessage({ id: "Navbar.message2" }))
    openModal2(true);
  };

  const handleLogout = async () => {
    const action = new CustomerOperation()
    // await action.logout()
    route.push("/");
  };

  const handleSearch = () => {
    if (search == "") return;
    //@ts-ignore
    window.find(search);
  };

  const handleUploadAvatar = async () => {
    if (!avatarUpload) return;
    const staffOperation = new StaffOperation()
    setLoading(true)
    const response = await staffOperation.updateAvatar({ avatar: avatarUpload }, { staffId: passData.staffId })
    if (!response.error && !response.error?.error) {
      setProfilePicture(`${imgURL}${passData.staffId}`)
      setavatarUpload("")
    }
    setLoading(false)
  };

  const checkUserLoggedIn = async () => {
    const getinfo = new StaffOperation()
    const response = await getinfo.getAuthenticatedStaffInfo();
    if (!!response.error || response.error?.error || response.error == undefined) console.log(response)
    else if (!!response.data) {
      setPassData(response.data);
      setDataUpdate(response.data);
      setUsername(response.data.account.username);
      const response2 = await getinfo.getAvatar({ staffId: response.data.staffId })
      setProfilePicture(response2 && Buffer.byteLength(response2) > 0 ? `${imgURL}${response.data.staffId}` : "/img/avatars/avatar_4.jpg")
    }

    if ((!!response.error) || (response.error == undefined)) {
      setMessage(intl.formatMessage({ id: "Navbar.Message" }))
      openModal(true)
    }
  }

  const submitClick = () => {
    if (dataUpdate.account.phoneNumber != passData.account.phoneNumber && !phoneNumberRegex.test(dataUpdate.account.phoneNumber)) {
      setMessage("Vui lòng nhập đúng định dạng số điện thoại.")
      openModal4(true);
      return;
    } else if (dataUpdate.account.email != passData.account.email && !emailRegex.test(dataUpdate.account.email)) {
      setMessage("Vui lòng nhập đúng định dạng email.")
      openModal4(true);
      return;
    } else if (dataUpdate.account.phoneNumber != passData.account.phoneNumber || dataUpdate.account.email != passData.account.email) {
      setMessage("Xác nhận cập nhật thông tin cá nhân?")
      openModal5(true);
    } else {
      setEditing(false)
    }
  }

  const submitClick4 = () => {
    if (!password.oldPassword) {
      setMessage("Vui lòng nhập mật khẩu cũ.")
      openModal4(true);
      return;
    } else if (!password.newPassword) {
      setMessage("Vui lòng nhập mật khẩu mới.")
      openModal4(true);
      return;
    } else if (password.newPassword != password.newPassword2) {
      setMessage("Mật khẩu mới không khớp, vui lòng kiểm tra lại.")
      openModal4(true);
      return;
    } else {
      setMessage("Xác nhận cập nhật mật khẩu?")
      openModal6(true);
    }
  }

  const submitClick2 = async () => {
    const accountOperation = new AccountOperation()
    let updateData: any = {};  // Initialize updateData as an empty object

    if (dataUpdate.account.phoneNumber != passData.account.phoneNumber) {
      updateData.phoneNumber = dataUpdate.account.phoneNumber;
    }

    if (dataUpdate.account.email != passData.account.email) {
      updateData.email = dataUpdate.account.email;
    }

    const response = await accountOperation.updateInfo(passData.account.id, updateData);
    if (!response.error && !response.error?.error) {
      setPassData({ ...passData, account: { ...passData.account, email: dataUpdate.email, phoneNumber: dataUpdate.phoneNumber } })
      setDataUpdate({ ...passData, account: { ...passData.account, email: dataUpdate.email, phoneNumber: dataUpdate.phoneNumber } })
      setEditing(false)
      openModal5(false)
      setMessage("Cập nhật thông tin thành công.")
      openModal4(true);
    } else {
      openModal5(false)
      setMessage("Cập nhật thông tin thất bại, vui lòng thử lại sau.")
      openModal4(true);
    }
  }

  const submitClick3 = async () => {
    const accountOperation = new AccountOperation()
    const updatePassword: any = { password: password.oldPassword, newPassword: password.newPassword };
    const response = await accountOperation.updatePassword(updatePassword)
    if (!response.error && !response.error.error) {
      openModal6(false)
      setMessage("Cập nhật mật khẩu thành công.")
      openModal4(true)
    } else {
      openModal6(false)
      setMessage("Cập nhật mật khẩu thất bại, vui lòng kiểm tra lại.")
      openModal4(true)
    }
  }

  useEffect(() => {
    checkUserLoggedIn();
  }, []);

  useEffect(() => {
    const handleDocumentClick = (event: any) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsSearchFocused(false);
      } else setIsSearchFocused(true);
    };

    document.addEventListener("mousedown", handleDocumentClick);

    return () => {
      document.removeEventListener("mousedown", handleDocumentClick);
    };
  }, []);

  useEffect(() => {
    getActiveRoute(routes);
  }, [pathname]);

  return (
    <>
      {modal && <NotiPopup onClose={() => { openModal(false); route.push("/") }} message={message} />}
      {modal2 && <SubmitPopup onClose={() => { openModal2(false); }} message={message} submit={handleLogout} />}
      {modal4 && <NotiPopup onClose={() => { openModal4(false) }} message={message} />}
      {modal5 && <SubmitPopup onClose={() => { openModal5(false); }} message={message} submit={submitClick2} />}
      {modal6 && <SubmitPopup onClose={() => { openModal6(false); }} message={message} submit={submitClick3} />}
      {openSetting && passData && <DetailPopup onClose={() => { setDataUpdate(passData); setavatarUpload(""); setEditing(false); setOpenSetting(false); }} title={intl.formatMessage({ id: "Navbar.Title" })} className2="lg:w-fit" children={
        <div className="flex flex-col gap-6">
          <div className="w-full flex justify-center">
            <div className="relative flex w-40 h-40 lg:w-60 lg:h-60 hover:cursor-pointer rounded-full overflow-hidden transition-all duration-500 cursor-pointer">
              <motion.img
                initial="initial"
                animate="enter"
                exit="exit"
                transition={{ duration: 0.7 }}
                className="w-full h-full object-cover"
                src={avatarUpload ? URL.createObjectURL(avatarUpload) : (profilePicture ? profilePicture : '/img/avatars/avatar_4.jpg')}
              // onClick={() => setModalIsOpen(true)}
              />
              <label className="absolute w-full h-20px py-2.5 bottom-0 inset-x-0 bg-[#000000]/50 
                  text-white text-2xl flex items-center hover:cursor-pointer justify-center 
                  active:scale-150 transition-all ease-in-out duration-500">
                <RiImageEditLine />
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target?.files ? e.target?.files[0] : "";
                    setavatarUpload(file);
                  }}
                />
              </label>
            </div>
          </div>
          {avatarUpload &&
            <div className="w-full flex justify-center">
              <button
                onClick={loading ? () => { } : handleUploadAvatar}
                className="linear w-full sm:w-2/3 border-2 rounded-xl h-10 text-base font-medium transition duration-200 dark:text-white flex justify-center place-items-center"
              >
                {loading ? <svg aria-hidden="true" className="w-20 h-6 text-gray-200 animate-spin dark:text-gray-600 fill-red-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                  <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                </svg> : <div className="flex gap-2 justify-center place-items-center"><IoCloudUploadOutline />Xác nhận tải lên</div>}
              </button>
            </div>
          }

          <div className="flex flex-col gap-3 text-[#000000] dark:text-white px-1 w-full mb-2">
            <div className='flex gap-2 w-full'>
              <div className='w-32 min-w-[128px] flex justify-between'>
                <strong><FormattedMessage id="Navbar.Info8" /></strong>
                :</div>
              <p className="whitespace-nowrap flex flex-row gap-2 relative w-full">
                {passData.fullname ? passData.fullname : "Chưa có thông tin"}
              </p>
            </div>
            <div className='flex gap-2 w-full'>
              <div className='w-32 min-w-[128px] flex justify-between'>
                <strong><FormattedMessage id="Navbar.Info2" /></strong>
                :</div>
              <p className="whitespace-nowrap flex flex-row gap-2 relative w-full">
                {editing ?
                  <input
                    type="text" className="focus:outline-none dark:bg-[#242526] w-full" value={dataUpdate.account.email}
                    onChange={(e) => {
                      setDataUpdate({
                        ...dataUpdate,
                        account: { ...dataUpdate.account, email: e.target.value }
                      });
                    }}
                  /> :
                  (passData.account.email ? passData.account.email : "Chưa có thông tin")}
                {editing && <span className="absolute bg-[#000000] dark:bg-gray-100 h-[1px] bottom-0 w-full" />}
              </p>
            </div>
            <div className='flex gap-2 w-full'>
              <div className='w-32 min-w-[128px] flex justify-between'>
                <strong><FormattedMessage id="Navbar.Info3" /></strong>
                :</div>
              <p className="whitespace-nowrap flex flex-row gap-2 relative w-full">
                {editing ?
                  <input
                    type="text" className="focus:outline-none dark:bg-[#242526] w-full" value={dataUpdate.account.phoneNumber}
                    onChange={(e) => {
                      setDataUpdate({
                        ...dataUpdate,
                        account: { ...dataUpdate.account, phoneNumber: e.target.value }
                      });
                    }}
                  /> :
                  (passData.account.phoneNumber ? passData.account.phoneNumber : "Chưa có thông tin")}
                {editing && <span className="absolute bg-[#000000] dark:bg-gray-100 h-[1px] bottom-0 w-full" />}
              </p>
            </div>
            <div className='flex gap-2 w-full'>
              <div className='w-32 min-w-[128px] flex justify-between'>
                <strong><FormattedMessage id="Navbar.Info5" /></strong>
                :</div>
              <p className="whitespace-nowrap flex flex-row gap-2 relative w-full">
                {passData.account.role}
              </p>
            </div>
            <div className='flex gap-2 w-full'>
              <div className='w-32 min-w-[128px] flex justify-between'>
                <strong><FormattedMessage id="Navbar.Info7" /></strong>
                :</div>
              <p className="flex flex-row gap-2 relative w-full">
                {(passData.detailAddress || passData.town || passData.district || passData.province) ? `${passData.detailAddress}, ${passData.town}, ${passData.district}, ${passData.province}` : "Không có thông tin"}
              </p>
            </div>
          </div>

        </div>
      }
        button={
          <div className="w-full flex bottom-0 bg-white pt-2 dark:bg-[#242526] gap-2">
            <Button
              onClick={editing ? submitClick : () => { setEditing(true) }}
              className="rounded-lg lg:h-11 w-full text-green-500 border-green-500 hover:border-green-600 bg-transparent hover:text-white border-2 hover:bg-green-600 hover:shadow-md flex sm:gap-2"
            >
              <FaPen /> {editing ? "Cập nhật" : "Chỉnh sửa"}
            </Button>
          </div>
        }
      />}

      {openPw && passData && <DetailPopup onClose={() => { setOpenPw(false); }} title={intl.formatMessage({ id: "Navbar.Title" })} className2="lg:w-fit" children={
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3 text-[#000000] dark:text-white px-1 w-full mb-2">
            <div className='flex gap-2 w-full flex-col lg:flex-row'>
              <div className='lg:w-44 lg:min-w-[11rem] flex lg:justify-between place-items-center'>
                <strong><FormattedMessage id="Navbar.Password1" /></strong>
                :</div>
              <p className="whitespace-nowrap flex flex-row gap-2 relative w-full">
                <InputField
                  variant="auth1"
                  id="oldPw"
                  type="password"
                  value={password.oldPassword}
                  setValue={(e: any) => {
                    setPassword({
                      ...password,
                      oldPassword: e
                    });
                  }}
                  className="bg-white dark:!bg-[#3a3b3c] w-full"
                  extra="w-full"
                />
              </p>
            </div>
            <div className='flex gap-2 w-full flex-col lg:flex-row'>
              <div className='lg:w-44 lg:min-w-[11rem] flex lg:justify-between place-items-center'>
                <strong><FormattedMessage id="Navbar.Password2" /></strong>
                :</div>
              <p className="whitespace-nowrap flex flex-row gap-2 relative w-full">
                <InputField
                  variant="auth1"
                  id="newPw1"
                  type="password"
                  value={password.newPassword}
                  setValue={(e: any) => {
                    setPassword({
                      ...password,
                      newPassword: e
                    });
                  }}
                  className="bg-white dark:!bg-[#3a3b3c] w-full"
                  extra="w-full"
                />
              </p>
            </div>
            <div className='flex gap-2 w-full flex-col lg:flex-row'>
              <div className='lg:w-44 lg:min-w-[11rem] flex lg:justify-between place-items-center'>
                <strong><FormattedMessage id="Navbar.Password3" /></strong>
                :</div>
              <p className="whitespace-nowrap flex flex-row gap-2 relative w-full">
                <InputField
                  variant="auth1"
                  id="newPw2"
                  type="password"
                  value={password.newPassword2}
                  setValue={(e: any) => {
                    setPassword({
                      ...password,
                      newPassword2: e
                    });
                  }}
                  className="bg-white dark:!bg-[#3a3b3c] w-full"
                  extra="w-full"
                />
              </p>
            </div>
          </div>

        </div>
      }
        button={
          <div className="w-full flex bottom-0 bg-white pt-2 dark:bg-[#242526] gap-2">
            <Button
              onClick={submitClick4}
              className="rounded-lg lg:h-11 w-full text-green-500 border-green-500 hover:border-green-600 bg-transparent hover:text-white border-2 hover:bg-green-600 hover:shadow-md flex sm:gap-2"
            >
              <FaSave /> Xác nhận
            </Button>
          </div>
        }
      />}

      <nav className="sticky top-4 z-[45] flex flex-col md:flex-row md:justify-between h-full justify-start gap-4 flex-wrap items-center rounded-xl bg-white/10 p-2 backdrop-blur-xl dark:bg-[#242526]/20">
        <div className="ml-[6px] w-full md:w-[224px]">
          <div className="h-6 w-full pt-1 text-left">
            <Link
              className="text-sm font-normal text-navy-700 hover:underline dark:text-white dark:hover:text-white"
              href=" "
            >
              <FormattedMessage id="Navbar.Home" />
              <span className="mx-1 text-sm text-navy-700 hover:text-navy-700 dark:text-white">
                {" "}
                /{" "}
              </span>
            </Link>
            <Link
              className="text-sm font-bold text-navy-700 hover:underline dark:text-white dark:hover:text-white whitespace-nowrap"
              href="#"
            >
              {intl.formatMessage({ id: `routes.${currentRoute}` })}
            </Link>
          </div>
          <p className="shrink text-[33px] text-navy-700 dark:text-white">
            <Link
              href="#"
              className="font-bold hover:text-navy-700 dark:hover:text-white whitespace-nowrap hidden md:block"
            >
              {intl.formatMessage({ id: `routes.${currentRoute}` })}
            </Link>
          </p>
        </div>

        <div className="relative mt-[3px] flex h-[61px] w-full flex-grow items-center justify-around gap-2 rounded-full bg-white px-2 py-2 shadow-xl shadow-shadow-500 dark:!bg-[#242526] dark:shadow-none md:w-[365px] md:flex-grow-0 md:gap-1 xl:w-[365px] xl:gap-2">
          <div
            ref={containerRef}
            className={`relative flex h-full items-center rounded-full bg-lightPrimary text-navy-700 dark:bg-navy-900 dark:text-white xl:w-[225px]`}
          >
            <motion.button
              onClick={handleSearch}
              className={`absolute text-xl h-8 w-8 px-2 flex justify-center rounded-full place-items-center transition-all duration-500  ${isSearchFocused ? "bg-red-500 dark:bg-[#242526] shadow-sm" : ""
                } transform`}
              initial={{ left: 2 }}
              animate={{
                left: isSearchFocused ? "calc(100% - 2rem - 6px)" : "4px",
              }}
            >
              <FiSearch
                className={`h-4 w-4 dark:text-white ${isSearchFocused ? "text-white" : "text-gray-400"
                  }`}
              />
            </motion.button>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              type="text"
              placeholder={intl.formatMessage({ id: "Navbar.Search" })}
              className={`block h-full w-full rounded-full bg-lightPrimary text-sm font-medium text-navy-700 outline-none placeholder:!text-gray-400 dark:bg-[#3a3b3c] dark:text-white dark:placeholder:!text-white transition-all duration-500 ${isSearchFocused ? "pl-4" : "pl-10"
                }`}
            />
          </div>
          <span
            className="flex cursor-pointer text-xl text-gray-600 dark:text-white"
            onClick={() => setOpenSidebar(!openSidebar)}
          >
            <FiAlignJustify className="h-5 w-5" />
          </span>
          <LanguageSwitcher />


          <div
            className="cursor-pointer text-gray-600"
            onClick={() => {
              theme === "dark" ? setTheme("light") : setTheme("dark");
            }}
          >
            {theme === "dark" ? (
              <RiSunFill className="h-4 w-4 text-gray-600 dark:text-white" />
            ) : (
              <RiMoonFill className="h-4 w-4 text-gray-600 dark:text-white" />
            )}
          </div>

          <Dropdown
            button={
              <div className="avatar w-10 h-10 rounded-full">
                {profilePicture && <img
                  src={avatarUpload ? URL.createObjectURL(avatarUpload) : (profilePicture ? profilePicture : '/img/avatars/avatar_4.jpg')}
                  alt="avatar"
                  width={19200}
                  height={10800}
                  className="w-full h-full object-cover rounded-full"
                />}
              </div>
            }
            className={"py-2 top-8 -left-[180px] w-max"}
          >
            <div className="flex w-56 !z-50 flex-col justify-start rounded-[20px] bg-white bg-cover bg-no-repeat shadow-xl shadow-shadow-500 dark:!bg-[#242526] dark:text-white dark:shadow-none">
              <div className="p-3.5">
                <div className="flex items-center flex-col gap-.5">
                  <p className="text-sm font-normal text-navy-700 dark:text-white w-full text-center">
                    <FormattedMessage id="Navbar.Login" />
                  </p>
                  <p className="text-sm font-bold text-navy-700 dark:text-white text-center w-full overflow-hidden">
                    {username}
                  </p>{" "}
                </div>
              </div>
              <div className="flex flex-col pb-3 px-3 -mt-4">
                <button
                  onClick={() => { setOpenSetting(true) }}
                  className="mt-3 text-sm font-medium text-navy-700 dark:text-white"
                >
                  <FormattedMessage id="Navbar.Info" />
                </button>
              </div>
              <div className="flex flex-col pb-3 px-3 -mt-2">
                <button
                  onClick={() => { setOpenPw(true) }}
                  className="mt-3 text-sm font-medium text-navy-700 dark:text-white"
                >
                  <FormattedMessage id="Navbar.Password" />
                </button>
              </div>
              <div className="h-px w-full bg-gray-200 dark:bg-white/20 " />

              <div className="flex flex-col pb-3 px-3">
                <button
                  onClick={handleLogoutClick}
                  className="mt-3 text-sm font-medium text-red-500 hover:text-red-500"
                >
                  <FormattedMessage id="Navbar.Logout" />
                </button>
              </div>
            </div>
          </Dropdown>
        </div>
      </nav>
    </>

  );
};

export default Navbar;
