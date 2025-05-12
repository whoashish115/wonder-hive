import React, { useEffect, useState } from "react";
import NextNProgress from "nextjs-progressbar";
import Header from "./Header";
import { Alert } from "..";
import { useRouter } from "next/router";
import Sidebar from "./Sidebar";
import useStore from "@/hooks/useStore";
import io from "socket.io-client";
import { SignIn } from "..";
import Socket from "../../socket";
import GLOBAL_TYPES from "@/store/types/globalTypes";
import { getConversations } from "@/store/actions/conversationActions";
import { getNotifies } from "@/store/actions/notifyActions";
import Preloader from "../customs/Preloader";
import { documentTools } from "@/utils/tools";
import { getInitialTheme } from "@/store/actions/globalActions/themeAction";
import { getIntitialSettings } from "@/store/actions/globalActions/settingsActions";
import { getInitialAccounts, refreshTokenAction } from "@/store/actions/globalActions/authActions";
import { useIsOnline } from 'react-use-is-online';
import StoryModal from "./StoryModal";

const Index = (props) => {
  const { Component, pageProps } = props;
  const router = useRouter();
  const { state, dispatch } = useStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [themeColor, setThemeColor] = useState('');
  const {  isOffline } = useIsOnline();

  let auth_paths = [
    "/auth/signin",
    "/auth/signup",
    "/auth/forgotpassword",
    "/auth/resetpassword/[token]",
    "/auth/user/activate/[token]",
  ];
  let non_header_paths = [...auth_paths, "/404", "/500"];
  let token = state.auth.token;
  useEffect(() => {
    var style = getComputedStyle(document.body)
    setThemeColor(style.getPropertyValue('--theme'))
  }, [state.theme])
  useEffect(() => {
    document?.querySelector('meta[name="theme-color"]')?.setAttribute('content', documentTools.rgbaToHex(themeColor));
  }, [themeColor])

  useEffect(() => {
    if (!("Notification" in window)) {
      alert("This browser does not support desktop notification");
    }
    else if (Notification.permission === "granted") { }
    else if (Notification.permission !== "denied") {
      Notification.requestPermission().then(function (permission) {
        if (permission === "granted") { }
      });
    }
  }, [])

  useEffect(() => {
    const initials = async () => {
      await getInitialTheme(dispatch);
      await getIntitialSettings(dispatch);
      await getInitialAccounts(dispatch);
      await refreshTokenAction(dispatch);
      setLoading(false);
    };
    initials();
  }, []);
  useEffect(() => {
    if (token) {
      getNotifies(dispatch, token)
      if (!state.message.firstLoad && token) {
        getConversations(dispatch, { auth: state.auth });
      }
      const socket = io(process.env.NEXT_PUBLIC_API_URL);
      dispatch({ type: GLOBAL_TYPES.SOCKET, payload: socket });
      return () => socket.close();
    }
  }, [state.auth]);

  if (loading) {
    return (
      <div
        id="preloader"
        className="preloader w-full h-full gap-4 fixed top-0 left-0 right-0 bottom-0 bg-background-dark  z-[100000000000]"
      >
        <Preloader />
      </div>
    );
  }
  else if (isOffline){
    return <div
    id="preloader"
    className="preloader flex justify-center items-center w-full h-full gap-4 fixed top-0 left-0 right-0 bottom-0 bg-background-dark  z-[100000000000]"
  >
    Uh oh!, You are offline
  </div>
  }
  else {
    if (state.auth.user) {
      if (auth_paths.includes(router.pathname)) {
        router.push("/");
        return <></>;
      } else {
        if (non_header_paths.includes(router.pathname)) {
          return (
            <div>
               <Alert />
              {state.socket.connected && <Socket />}
              <NextNProgress
                color={themeColor}
                height={3}
                options={{ showSpinner: false }}
              />
              <Component {...pageProps} />
            </div>
          );
        } else {
          return (
            <div className="bg-background-dark text-text-dark w-screen min-h-screen flex flex-col   items-stretch relative">
              <Alert />
              <StoryModal/>
              {state.socket.connected && <Socket />}
              <NextNProgress
                color={themeColor}
                height={3}
                options={{ showSpinner: false }}
              />
              <Header
                setSidebarOpen={setSidebarOpen}
                sidebarOpen={sidebarOpen}
              />
              <div
                id='custom-body'
                className="w-screen grid overflow-y-auto  h-[calc(100vh-64px)] lg:h-[calc(100vh-56px)] mt-[64px] lg:mt-[56px] z-[40]  mx-auto "
              >
                <div className="max-w-[1400px] h-full z-[40]  flex w-full mx-auto ">
                  <div className=" max-w-screen p-3 lg:p-6 flex w-full h-full gap-6  justify-between items-start">
                    <Sidebar sidebarOpen={sidebarOpen} />
                    <Component {...pageProps} />
                  </div>
                </div>
              </div>
            </div>
          );
        }
      }
    } else {
      if (auth_paths.includes(router.pathname)) {
        return (
          <div>
             <Alert />
              {state.socket.connected && <Socket />}
              <NextNProgress
                color={themeColor}
                height={3}
                options={{ showSpinner: false }}
              />
            <Component {...pageProps} />
          </div>
        );
      } else {
        return (
          <div>
             <Alert />
              {state.socket.connected && <Socket />}
              <NextNProgress
                color={themeColor}
                height={3}
                options={{ showSpinner: false }}
              />
            <SignIn {...pageProps} />
          </div>
        );
      }
    }
  }
};

export default Index;
