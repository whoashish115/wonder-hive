import React, { useContext, useEffect } from "react";
import { textTools } from "@/utils/tools";
import { HiX } from "react-icons/hi";
import GLOBAL_TYPES from "@/store/types/globalTypes";
import useStore from "@/hooks/useStore";
import Preloader from "../customs/Preloader";

const Alert = () => {
  const { state, dispatch } = useStore();
  const { alert } = state;

  const handleClose = () => {
    dispatch({ type: GLOBAL_TYPES.LOADING, payload: false });
  };
  
  return (
    <div
      className={`z-[60] w-screen h-screen top-0 left-0 fixed pointer-events-none ${
        alert.loading && "pointer-events-auto"
      } transition-transform`}
    >
      {alert.loading && (
        <div
          style={{
            position: "fixed",
            width: "100%",
            height: "100%",
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            zIndex: 10001,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          className="bg-background-dark"
        >
          <Preloader/>
        </div>
       )}
      {state.alert.error && (
          <div className="fixed items-center animate-alert border bottom-6 right-6 px-4 flex flex-row pointer-events-auto  gap-4 py-2  rounded-custom z-[500] border-l-[10px] border-error-light bg-background-extralight">
            <div className="flex flex-col">
              <div className="text-error-light text-xl font-semibold">
                {state.alert.error && "Error"}
              </div>
              <div className="text-smfont-light text-text-dark">
                {textTools.capitalize(state.alert.error)}
              </div>
            </div>
            <div>
            <div
              onClick={handleClose}
              className="group text-xl xl:grid items-center   text-text-dark  bg-background-extralight rounded-full p-1 border-2 border-border-outline hover:text-text-dark cursor-pointer relative"
              >
              <HiX />
            </div>
              </div>
          </div>
      )}
      {state.alert.success && (
          <div className="fixed items-center animate-alert bottom-6 right-6 px-4 flex flex-row pointer-events-auto  gap-4 py-2  rounded-custom z-[500] border-l-[10px] border-success-light bg-background-extralight">

            <div className="flex flex-col">
              <div className="text-success-light text-lg  font-semibold">
                {state.alert.success && "Success"}
              </div>
              <div className="text-sm font-light text-text-main">
                {textTools.capitalize(state.alert.success)}
              </div>
            </div>
            <div>
            <div
              onClick={handleClose}
              className="group text-xl xl:grid items-center   text-text-dark  bg-background-extralight rounded-full p-1 border-2 border-border-outline hover:text-text-dark cursor-pointer relative"
              >
              <HiX />
            </div>
              </div>
          </div>
      )}
      {state.alert.warning && (
          <div className="fixed items-center animate-alert bottom-6 right-6 px-4 flex flex-row pointer-events-auto  gap-4 py-2  rounded-custom z-[500] border-l-[10px] border-warning-light bg-background-extralight">

            <div className="flex flex-col">
              <div className="text-warning-light text-xl  font-semibold">
                {state.alert.warning && "Warning"}
              </div>
              <div className="text-smfont-light text-text-main">
                {textTools.capitalize(state.alert.warning)}
              </div>
            </div>
            <div>
            <div
              onClick={handleClose}
              className="group text-xl xl:grid items-center   text-text-dark  bg-background-extralight rounded-full p-1 border-2 border-border-outline hover:text-text-dark cursor-pointer relative"
              >
              <HiX />
            </div>
            </div>
          </div>
      )}
      {state.alert.info && (
          <div className="fixed items-center animate-alert bottom-6 right-6 px-4 flex flex-row pointer-events-auto  gap-4 py-2  rounded-custom z-[500] border-l-[10px] border-info-light bg-background-extralight">

            <div className="flex flex-col">
              <div className="text-info-light text-xl  font-semibold">
                {state.alert.info && "Info"}
              </div>
              <div className="text-smfont-light text-text-main">
                {textTools.capitalize(state.alert.info)}
              </div>
            </div>
            <div>
            <div
              onClick={handleClose}
              className="group text-xl xl:grid items-center   text-text-dark  bg-background-extralight rounded-full p-1 border-2 border-border-outline hover:text-text-dark cursor-pointer relative"
              >
              <HiX />
            </div>
          </div>
          </div>
      )}
    </div>
  );
};

export default Alert;
