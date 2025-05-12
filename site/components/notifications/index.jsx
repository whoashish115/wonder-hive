import useStore from "@/hooks/useStore";
import { deleteAllNotifies, readAllNotify } from "@/store/actions/notifyActions";
import {
  followRequestAccept,
  followRequestDecline,
} from "@/store/actions/profileActions";
import { mediaTools, sentenceTools } from "@/utils/tools";
import moment from "moment";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import {  RiDeleteBin2Line } from "react-icons/ri";
import Button from "../customs/Button";
import { ChevronRight } from "react-feather";

const Index = () => {
  const { state, dispatch } = useStore();
  const { notify, auth } = state;
  const router = useRouter();
  useEffect(() => {
    readAllNotify(dispatch, { auth });
  }, [])
  
  const handleDeleteAllNotifies = () => {
    if (
      window.confirm("Are your sure you want to delete all notifications ?")
    ) {
      return deleteAllNotifies(dispatch, auth.token);
    }
  };
  return (
    <div className="gap-3 md:gap-6 flex flex-col w-full  ">
      <div className="bg-background-light rounded-custom flex flex-col">
        <div className="flex flex-col ">
        {Boolean(state.auth.user.requests.length) &&  <div className="flex items-center p-4 px-8 bg-background-extralight rounded-custom w-full justify-between">

        <h5 className="text-base uppercase font-semibold">Follow Requests ({state.auth.user.requests.length})</h5>

       <div className="flex items-center justify-between ">
            <div
              className=" cursor-pointer p-1 flex bg-primary-main rounded-custom text-white"
              onClick={()=>router.push('/notifications/requests')}
              >
              <ChevronRight  className="text-lg"/>
            </div>
                </div>
        </div>}
        <div className="flex items-center justify-between p-8">
          <h5 className="text-xl font-semibold ">Notifications</h5>
          {notify.data.length !== 0 && (
            <div
              className="text-3xl text-text-light hover:text-primary-main  cursor-pointer "
              onClick={handleDeleteAllNotifies}
            >
              <RiDeleteBin2Line />
            </div>
          )}
        </div>
        </div>

         
        <div className="flex flex-col gap-2">
          {notify.data.map((item) => (
            <div
              style={{ animationIterationCount: 1 }}
              key={item._id}
              onClick={() => item.url && router.push(item.url)}
              className={` animate-pulse p-4 px-8 cursor-pointer hover:bg-background-extralight `}
            >
              <div className="flex  gap-2 ">
                <div className="flex-shrink-0">
                  <Image
                    src={item.user.profileImage}
                    width={200}
                    height={200}
                    className="w-14 h-14 rounded-full object-cover object-center "
                  />
                </div>
                <div className="flex-grow flex flex-col gap-1">
                  <div className="flex">
                    <div className="flex-grow  text-sm ">
                      {"@" + item.user.username + " " + item.text}
                      <span className="text-xs font-light ml-2 text-text-light">
                        {!item.readBy.includes(auth.user._id) && "(Unread)"}
                      </span>
                    </div>
                    <div className="text-xs text-text-main capitalize">
                      {moment(item.createdAt).fromNow(true)}
                    </div>
                  </div>
                    <div className="flex items-start flex-shrink-0 gap-2 p-1 justify-between">
                  {item.media && 
                      <div>
                        {mediaTools.isVideo(item.media.url) ? (
                          <video
                            style={{
                              objectFit: "cover",
                              objectPosition: "center",
                              aspectRatio: 1,
                            }}
                            height={80}
                            width={80}
                            src={item.media.url}
                            className="rounded"
                            alt="video"
                          />
                        ) : (
                          <Image
                            src={item.media.url}
                            alt="picture"
                            height={80}
                            width={80}
                            style={{
                              aspectRatio: 1,
                            }}
                            className="rounded object-cover object-center w-full h-full"
                          />
                        )}
                      </div>}
                    <div className="text-text-light flex-grow w-full">
                      {item.content && item.content.length > 150 ? (
                        sentenceTools.slice(item.content, 150)
                      ) : (item.content)}
                    </div>
                    </div>
                </div>
              </div>
            </div>
          ))}
          {notify.data.length === 0 && <div className="text-text-light pb-4 flex justify-center items-center">No Notification</div>}
        </div>
      
      </div>
    </div>
  );
};

export default Index;
