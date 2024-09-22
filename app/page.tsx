"use client";
import { FC, useEffect, useRef, useState } from "react";
import InputField from "@/components/fields/InputField";
import FixedPlugin from "@/components/fixedPlugin/FixedPlugin";
import Carousel from "react-multi-carousel";
import Image from "next/image";
import "react-multi-carousel/lib/styles.css";
import ParticlesBackground from "@/components/Particle";
import NotiPopup from "@/components/notification";
import { useRouter } from "next/navigation";
import { FormattedMessage, useIntl } from "react-intl";
// import { PartnerStaffAuthenticate, PartnerStaffOperation, StaffsAuthenticate, StaffsOperation } from "@/TDLib/tdlogistics";
import LanguageSwitcher from "@/components/language";
import { Variants, motion, useAnimation } from "framer-motion";
import cloudData from '@/data/cloud.json';
import bikeData from '@/data/lottie.json';
import dynamic from "next/dynamic";
import { AuthOperation, LoginOption } from "@/TDLib/main";
import OTPField from "@/components/otp";
import DetailPopup from "@/components/popup";
import Link from "next/link";
const Lottie = dynamic(() => import('lottie-react'), {
  ssr: false,
});
type Props = {};

const AuthPage: FC<Props> = () => {
  const [modal, setModal] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");
  const route = useRouter();
  const [loading, setLoading] = useState(false)
  const intl = useIntl();
  const controls1 = useAnimation();
  const controls2 = useAnimation();
  const section1Ref = useRef(null);
  const section2Ref = useRef(null);
  const [isAnimated, setIsAnimated] = useState(false);
  const authOperation = new AuthOperation();
  const [otp, setshowOtp] = useState(false)

  const handleCheckField = () => {
    if (!account || !password) {
      setError(true);
      setMessage(intl.formatMessage({ id: "Login.Message1" }));
      setModal(true);
      return true;
    }
    return false;
  };

  const handlepasswordChange = (value: string) => {
    const numericValue = value.replace(/[^0-9]/g, "");
    setPassword(numericValue);
  };

  const handleSignUpButton = async () => {
    if (handleCheckField()) return;
    setLoading(true)
    const response = await authOperation.login({ username: account.trim(), password: password.trim() }, LoginOption["STAFF"])
    if (response.error || response.error?.error) {
      setMessage("Xác thực thất bại, vui lòng kiểm tra lại!")
      setModal(true)
      setError(true)
      setLoading(false)
    } else {
      setMessage("Xác thực thành công!")
      setModal(true)
      setLoading(false)
    }
  };

  const handleNotificationClose = async () => {
    setModal(false);
    if (!error) {
      route.push("/orders");
    } else setError(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleSignUpButton();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [account, password]);

  useEffect(() => {
    setIsAnimated(true);
    return () => {
      setIsAnimated(false);
    };
  }, []);

  return (
    <div>
      <div className="relative float-right h-full min-h-screen w-full bg-white lg:!bg-gray-100 dark:!bg-[#191a1a]">
        {modal && (
          <NotiPopup message={message} onClose={handleNotificationClose} />
        )}
        <main className={`mx-auto min-h-screen`}>
          <div className="relative flex h-screen lg:p-8 xl:p-16">
            <div className={`mx-auto min-h-full h-full w-full relative rounded-xl bg-white dark:!bg-[#242526]`}>
              <div className={`ribbon hidden z-20 lg:block absolute bg-white transition-all shadow-3xl duration-1000 ${isAnimated ? "-top-2 right-4 -scale-x-100" : "-top-2 right-[calc(100%-152px)]"}`}>
                <div className={`w-28 h-28 flex place-items-center transition-all duration-1000 ${isAnimated ? "-scale-x-100" : ""}`}>
                  <Image src="/Logo-App-Tien-Dung-Logistics.png" alt="Your image" width={250} height={250} />
                </div>
              </div>
              <motion.div
                ref={section1Ref}
                initial="hidden"
                animate={controls1}
                className={`lg:w-[50%] xl:w-[45%] w-full absolute top-0 px-4 sm:px-8 md:px-32 lg:px-16 transition-all flex justify-center h-full lg:py-2 duration-1000 ${isAnimated ? "lg:left-0" : "lg:left-[50%] xl:left-[55%]"}`}>
                {/* Sign in section */}
                <div className="overflow-y-scroll no-scrollbar grid w-full">
                  <div className="w-full flex-col px-2 flex gap-4 justify-center place-items-stretch py-4">
                    <div className="flex justify-between flex-col gap-2">
                      <h4 className="text-4xl font-bold text-navy-700 dark:text-white flex justify-between">
                        <FormattedMessage id="Login.Login" />
                        <div className="lg:hidden mb-2">
                          <FixedPlugin />
                        </div>
                      </h4>
                      <p className="pl-1 text-base text-gray-600">
                        <FormattedMessage id="Login.Login2" />
                      </p>
                    </div>

                    <div
                      className="flex h-[50px] w-full items-center justify-center gap-2 rounded-xl bg-white border hover:cursor-pointer dark:bg-[#3a3b3c]">
                      <Link

                        href="https://app.tdlogistics.net.vn/"
                        className="flex items-center gap-2 h-[50px]"
                      >
                        <Image src="/Logo.png" alt="Your image" width={20} height={20} />
                        <span className="text-[14px] font-medium text-[#000000] dark:text-white font-sans focus:outline-none">
                          <FormattedMessage id="Login.Role" />
                        </span>
                      </Link>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-px w-full bg-gray-200" />
                      <p className="text-base text-gray-600 dark:text-white">
                        {" "}
                        <FormattedMessage id="Login.Or" />{" "}
                      </p>
                      <div className="h-px w-full bg-gray-200" />
                    </div>
                    <div className="flex items-center place-items-center">
                      <p className="text-base w-full text-center font-bold dark:text-white font-sans">
                        {" "}
                        <FormattedMessage id="Login.Role3" />
                      </p>
                    </div>
                    {/* account */}
                    <InputField
                      variant="auth"
                      label={intl.formatMessage({ id: "Login.Box1" })}
                      placeholder={intl.formatMessage({ id: "Login.PlaceHolder" })}
                      id="account"
                      type="text"
                      value={account}
                      setValue={setAccount}
                      className="bg-white dark:!bg-[#3a3b3c]"
                    />
                    <InputField
                      variant="auth"
                      label={intl.formatMessage({ id: "Login.Box2" })}
                      placeholder={intl.formatMessage({ id: "Login.PlaceHolder2" })}
                      id="password"
                      type="password"
                      value={password}
                      setValue={setPassword}
                      className="bg-white dark:!bg-[#3a3b3c]"
                    />
                    <div className="flex gap-3 mt-4">

                      <button
                        onClick={loading ? () => { } : handleSignUpButton}
                        className="linear w-full rounded-xl bg-red-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-red-600 active:bg-red-700 dark:bg-red-500 dark:text-white dark:hover:bg-red-400 dark:active:bg-red-300 flex justify-center place-items-center"
                      >
                        {loading ? <svg aria-hidden="true" className="w-20 h-6 text-gray-200 animate-spin dark:text-gray-600 fill-red-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                          <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                        </svg> : <FormattedMessage id="Login.Submit" />}
                      </button>
                      <div className="h-full bg-red-500 rounded-full text-white flex justify-center place-items-center">
                        <LanguageSwitcher message="h-5 w-5 text-white"
                          animation="origin-[75%_95%] transition-all duration-300 ease-in-out"
                          animation2="bottom-12 -right-4" className="w-[3.1rem] h-[3.1rem] rounded-full flex justify-center place-items-center" />
                      </div>
                    </div>

                  </div>
                </div>

              </motion.div>
              <motion.div
                ref={section2Ref}
                initial="hidden"
                animate={controls2}
                className={`absolute top-0 hidden overflow-clip h-full bg-red-500 lg:block lg:w-[50%] xl:w-[55%] transition-all duration-1000  ${isAnimated ? "left-[50%] xl:left-[45%] rounded-r-xl" : "left-0 rounded-l-xl"}`}>
                <div className={`relative h-full w-full flex flex-col justify-between`}>
                  <div className={`text-white lg:text-3xl xl:text-4xl h-[7.5rem] transition-all duration-1000 w-full flex justify-center font-semibold place-items-center text-center
                  ${isAnimated ? "pl-8 pr-48" : "pr-10 pl-48"}
                    `}>
                    <div className="h-full flex place-items-center mt-4"><FormattedMessage id="Login.Sologan" /></div>
                  </div>
                  <div className={`w-full h-full grow flex justify-center place-items-end relative overflow-clip ${isAnimated ? "-scale-x-100" : ""}`}>
                    <div className="cloud dark:!bg-[#242526]"></div>
                    <Lottie animationData={bikeData} className="h-full w-full absolute bottom-0 left-0 -ml-[10%]" >
                    </Lottie>
                  </div>
                  <div className={`absolute bottom-4 flex ${isAnimated ? "w-full justify-end pr-4" : "justify-start pl-4"}`}>
                    <FixedPlugin />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AuthPage;
