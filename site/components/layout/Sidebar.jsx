import React, { useContext, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { HiChevronDown, HiChevronRight, HiChevronUp, HiHome, HiLogin, HiOutlineHome, HiOutlineSparkles, HiPlus, HiSparkles, HiX,} from "react-icons/hi";
import {  Home, Settings} from "react-feather";
import {  BiInfoCircle, BiLogOut, BiMessageRoundedDots, BiRocket} from "react-icons/bi";
import { BsCameraVideo, BsChatDots } from "react-icons/bs";
import { FaHeart, FaRegHeart, FaSearch } from "react-icons/fa";
import { removeAccount, signInAccountAction, signMeAsAccountAction, signOutAction } from "@/store/actions/globalActions/authActions";
import Image from "next/image";
import { TbLogout, TbSettings } from "react-icons/tb";
import useStore from "@/hooks/useStore";
import { RiSettings3Line } from "react-icons/ri";

export const links = [
  {
    icon: <HiOutlineHome />,
    name: "Home",
    url: "/",
  },
  {
    icon: <BiRocket />,
    name: "Explore",
    url: "/explore",
  },
  {
    icon: <BsCameraVideo />,
    name: "Glimpse",
    url: "/glimpse",
  },
  {
    icon: <RiSettings3Line />,
    name: "Settings",
    url: "/settings",
  },
  {
    icon: <BiInfoCircle />,
    name: "About",
    url: "/about",
  },
]
const Sidebar = () => {
  const { state, dispatch } = useStore();
  const {auth, accounts} = state
  const router = useRouter();
  const [messagesLength, setMessagesLength] = useState(null)
  const [notifyLength, setNotifyLength] = useState(null)
  const [notifyAlert, setNotifyAlert] = useState(false)
  const [accountMenu, setAccountMenu] = useState(false)

  useEffect(() => {
    setMessagesLength(Object.values(state.conversation.data).filter(c=>c.unseenMessagesCount[auth.user._id]>0).length)
  }, [state.conversation.data])
  useEffect(() => {
    setNotifyLength(state.notify.data.filter(n=>!n.readBy.includes(auth.user._id)).length)
  }, [state.notify.data])

  useEffect(() => {
    if(notifyLength >0){
      setTimeout(() => {
        setNotifyAlert(true)
        setTimeout(() => {
          setNotifyAlert(false)
        }, 12000);
      }, 2000);
    }
  }, [notifyLength])
  const handleCloseNotifyAlert = () =>setNotifyAlert(false)
  
  const handleAddAccount = async () => {
    if(accounts.length > 10){
      dispatch({type:GLOBAL_TYPES.ALERT_ERROR, payload:'Account limit reached, remove few accounts to signin into another'})
    }
    else{
      await signOutAction(dispatch)
      router.push('/auth/signin?new=true')
    }
  }


  return (
    <div className="hidden  xl:flex  relative w-3/12 flex-col h-full z-[10] flex-shrink-0">
    <div
      className={`rounded-custom top-[3] lg:top-6 sticky  flex-shrink-0  bg-background-light w-full  gap-6 md:flex flex-col `}
    >
      <ul className=" rounded-custom flex flex-col h-full relative">
        <li className=" flex flex-col justify-center items-center ">
          <div className="flex flex-col w-full overflow-hidden">
        <div  className="flex  items-stretch gap-4 justify-stretch border-b hover:bg-background-extralight rounded-t-custom border-border-outline py-4 px-6">
          <div className="flex-shrink-0 overflow-hidden rounded-full  ">
          <Link
            href={`/profile/${state.auth.user.username}`}
            className="flex flex-grow justify-center  items-center h-full  overflow-hidden  rounded-full  w-full"
          >
            <Image
              alt="Profile picture"
              className="w-16 h-16  rounded-full object-cover select-none"
              width={100}
              height={100}
              src={state.auth.user && state.auth.user.profileImage}
            />
          </Link>
          </div>
            <div className="flex flex-grow items-center  h-full  w-full ">
              <div className="transition h-full flex justify-center flex-grow flex-col ">
                <div className="font-semibold text-base">
            <Link
            href={`/profile/${state.auth.user.username}`}
          >
                  {state.auth.user.fullname}
          </Link>
                </div>
                <div className="font-normal text-sm truncate text-text-light flex  justify-between items-end">
            <Link
            href={`/profile/${state.auth.user.username}`}
          >
                  {"@" + state.auth.user.username}
          </Link>
                </div>
              </div>

                  <div   onClick={()=>setAccountMenu(!accountMenu)} className="bg-background-light cursor-pointer hover:bg-background-extralight p-1 rounded-custom border border-border-outline">
                  <HiChevronDown className="text-2xl flex-shrink-0" />
                  </div>
            </div>
          </div>
          </div>
          <div className={`absolute top-0 bg-background-extralight rounded-custom  left-0  w-full flex flex-col items-start z-20 transition-all origin-top overflow-hidden  ${accountMenu ? ' h-full ' : ' !h-[0px] pointer-events-none'} `}>
            <div className="   h-full gap-4 py-4 w-full flex flex-col">

            <div className=" px-4 flex flex-col w-full">
          <button
          onClick={()=>setAccountMenu(!accountMenu)}
          type="submit"
          className="w-full text-white capitalize flex gap-2 justify-center items-center light bg-background-extralight hover:bg-primary-main border border-border-outline font-medium rounded-custom text-base px-4 py-2 text-center"
          >
<HiChevronUp className="text-xl" />
Collapse 
        </button>
          </div>
        <div className="flex flex-col w-full">
          {accounts.filter(user=>user._id !== auth.user._id).map((account,i) => (
            <div key={i} className="w-full hover:bg-background-light   border-background-extralight border pr-4  rounded-custom flex cursor-pointer justify-center items-center gap-3">
              <div onClick={() => signMeAsAccountAction(dispatch, account._id)} className="flex  py-2 pl-4 items-center gap-4 w-full">

              <Image
                src={account.profileImage}
                width={100}
                height={100} 
                className="w-14 h-14 rounded-full object-cover object-center "
              />
              <div   className="flex-grow flex flex-col break-words w-10">
                <h5 className="text-base font-semibold">
                  {account.fullname}
                </h5>
                <p className="text-sm truncate font-light text-text-light">
                  {"@" + account.username}
                </p>
              </div>
              <div className="flex gap-1">
              <button className=" rounded-xl flex items-center text-white justify-center p-1 text-2xl bg-background-light border border-border-outline/50 hover:bg-primary-main" > <HiChevronRight /></button>
              </div>
              </div>

              <button
                onClick={() => removeAccount(dispatch, account._id)}
                className=" rounded-xl flex items-center text-white  justify-center p-2 text-xl bg-background-light border border-border-outline/50 hover:bg-primary-main"
                
                > <HiX /></button>
            </div>
          ))}
        </div>
        <div className="flex-grow"/>
<div className=" px-4 flex flex-col w-full">
          <button
          onClick={handleAddAccount}
          type="submit"
          className="w-full border border-border-outline  flex gap-2 justify-center items-center text-white capitalize light bg-primary-main hover:bg-primary-dark font-medium rounded-custom text-base px-4 py-2 text-center"
        >
<HiPlus className="text-xl" />

Add Another Account
        </button>
       
          </div>
          </div>
          </div>
        </li>

        <div className={`flex-grow h-full flex flex-col  pb-4 `}>
          {links.map((data, i) => (
            <Link scroll={true}  key={i} href={data.url}>
              <li
                
                className={`flex ${
                  data.url == router.pathname
                    ? "text-text-dark bg-background-main border-primary-main border-r-8"
                    : "text-text-light  hover:bg-background-main hover:text-text-dark border-r-8 hover:border-primary-main border-transparent"
                } items-center   py-1 px-2 cursor-pointer gap-2 group`}
              >
                <span
                  className={`text-xl  md:text-3xl transition grid place-items-center  my-2 mx-4 `}
                >
                  {data.icon}
                </span>

                <div className="transition h-full flex items-end flex-grow py-2">
                  <span className="text-base capitalize">{data.name}</span>
                </div>
              </li>
            </Link>
          ))}
          
<Link href={'/message'}>
              <li
              onClick={handleCloseNotifyAlert}
                className={`flex ${
                  '/message' == router.pathname
                    ? "text-text-dark bg-background-main border-primary-main border-r-8"
                    : "text-text-light  hover:bg-background-main hover:text-text-dark border-r-8 hover:border-primary-main border-transparent"
                } items-center relative  py-1 px-2 cursor-pointer gap-2 group `}
              >
                <span
                  className={`!text-3xl  transition grid relative place-items-center  mx-4 my-2`}
                >
                  <BiMessageRoundedDots />
                  {Boolean(messagesLength) &&  <div style={{fontSize:'12px'}} className="absolute right-[-50%] top-[-50%] translate-x-[-50%] translate-y-[50%] px-2 py-0.5 text-xs bg-primary-light rounded-full text-white">{messagesLength}</div>}
                </span>
                <div className="transition h-full flex   justify-between  flex-grow py-2 items-center">
                  <span className="text-base capitalize flex-grow">Message</span>
                </div>
              {Boolean(state.activity.length) &&  <div>
                  <div className="text-xs border border-primary-light uppercase mr-4 bg-primary-main/20 font-semibold py-0.5 px-2 rounded-full text-primary-light">
                    {state.activity.length} online
                  </div>
                </div>}
              </li>
            </Link>
<Link href={'/notifications'}>
              <li
              onClick={handleCloseNotifyAlert}
                className={`flex ${
                  '/notifications' == router.pathname
                    ? "text-text-dark bg-background-main border-primary-main border-r-8"
                    : "text-text-light  hover:bg-background-main hover:text-text-dark border-r-8 hover:border-primary-main border-transparent"
                } items-center relative  py-1 px-2 cursor-pointer gap-2 group `}
              >
                <span
                  className={`text-2xl transition grid relative place-items-center  mx-4 my-2`}
                >
                  <FaRegHeart />
                  {(notifyAlert || auth.user.requests.length>0)&&  <div className="absolute right-0 top-0 p-1 rounded-full bg-primary-light"/>}
                </span>
                <div className="transition h-full flex   justify-between  flex-grow py-2 items-center">
                  <span className="text-base capitalize flex-grow">Notifications</span>
                </div>
            {notifyAlert&&<div className={` bg-primary-light gap-1 heart-notify right-[0%] translate-x-[160%] rounded-lg text-white items-center justify-center font-bold p-2 flex m-auto ${notifyAlert ?' animate-heart-notify ':''}`}>
                <div className="arrow">
  </div>
  <div className="flex gap-1">
                <FaHeart className="text-xl "/>
                  {notifyLength}
                </div>
                </div>}
              </li>
            </Link>
          <li
            onClick={() => signOutAction(dispatch)}
            className={`text-text-light items-center jus flex  py-0.5 px-2 cursor-pointer gap-2 group hover:bg-background-main hover:text-text-dark border-r-8 hover:border-primary-main border-transparent`}
          >
            <span
              className={`!text-3xl  transition grid items-center   my-2 mx-4`}
            >
              <TbLogout />
            </span>
            <div className="transition  flex items-end flex-grow">
              <span className="text-base capitalize">Logout</span>
            </div>
          </li>
        </div>

     
      </ul>
    </div>
  </div>
  );
};

export default Sidebar;
