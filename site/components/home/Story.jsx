import React, { useContext, useEffect, useRef, useState } from "react";
import { PlusIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { Navigation, Pagination } from "swiper/modules";
import Link from "next/link";
import useStore from "@/hooks/useStore";
import { mediaTools } from "@/utils/tools";
import moment from "moment";
import {
  deleteStory,
  getStories,
  heartStory,
  removeHeartPost,
  removeHeartStory,
  viewStory,
} from "@/store/actions/storyActions";
import { MdOutlineDeleteForever } from "react-icons/md";
import Tooltip from "../customs/Tooltip";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import GLOBAL_TYPES from "@/store/types/globalTypes";
import {StoryCard} from "../createedit/Highlight";

const Story = () => {
  const { state, dispatch } = useStore();
  const { auth, socket, story, currentStory } = state;
  const {detailedStories} = story
  const [stories, setStories] = useState({});

  useEffect(() => {
    if (!story.feedStories.firstLoad) {
      getStories(dispatch, auth.token);
    }
  }, []);
  useEffect(() => {
    let grouped = {}
    let allStories = story.feedStories.data.map(id=>detailedStories[id])
    for (let i =0;i<allStories.length; i++){
      if(grouped[allStories[i].user._id])
        {
        grouped[allStories[i].user._id] = [...grouped[allStories[i].user._id],allStories[i] ]
      }else{
        grouped[allStories[i].user._id] = [allStories[i] ]
      }
    }
    setStories(grouped)
  }, [story.feedStories.data]);


  return (
    <div className="w-full">
     
      <div className="flex md:6 gap-2  rounded-xl flex-row space-x-1 ">
        <Swiper
          modules={[Navigation, Pagination]}
          className=" object-cover justify-stretch"
          style={{ height: "100%", width: "100%" }}
          slidesPerView={"auto"}
          scrollbar={{ draggable: true }}
        >
          

         {(Object.keys(stories).filter(id=>auth.user._id == id).length ==0) && <SwiperSlide
                  style={{ width: "auto" }}
                  className="h-full px-2 self-stretch justify-stretch object-fill  w-auto"
                >
                 <Link href="/create/story">
              <div className="flex justify-center flex-col gap-2 items-center relative">
                <div
                  className={`flex-shrink-0 cursor-pointer relative group rounded-full border-[3px] border-primary-main p-1`}
                >
                  <div className="w-16 h-16  rounded-full  overflow-hidden">
                    <Image
                      src={state.auth.user && state.auth.user.profileImage}
                      alt="Profile picture"
                      width={200}
                      height={200}
                      className="w-full h-full object-cover object-center select-none"
                    />
                  </div>
                  <div className="rounded-full bg-primary-dark absolute -bottom-1 -right-1 group-hover:bg-primary-main text-white p-1">
                    <PlusIcon className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-sm text-text-light">Add Story</p>
              </div>
            </Link>
                </SwiperSlide>}
          {Object.keys(stories).map(
            (userId, i) =>
              Boolean(stories[userId].length) && (
                <SwiperSlide
                  style={{ width: "auto" }}
                  className="h-full px-2 self-stretch justify-stretch object-fill  w-auto"
                  key={i}
                >
                  <div
                    key={i}
                    onClick={() =>
                      dispatch({
                        type:GLOBAL_TYPES.STORY,
                        payload:   stories[userId]})}
                    className="flex justify-center flex-col gap-2  items-center"
                  >
                    <div className={`flex-shrink-0 cursor-pointer  rounded-full border-[3px] overflow-hidden relative  ${stories[userId].every(s=>Boolean(s.views.filter(v=>v._id ==auth.user._id).length)) ?'border-border-outline hover:border-primary-main':'border-primary-main'} p-1`}>
                      <div className="w-16 h-16 rounded-full relative overflow-hidden">
                        <Image
                          src={stories[userId][0]?.user.profileImage}
                          alt="Profile picture"
                          width={200}
                          height={200}
                          className="w-full h-full object-cover object-center select-none"
                        />
                      </div>
                    </div>
                    <p className="text-sm text-text-light">
                      {"@" + stories[userId][0]?.user.username}
                    </p>
                  </div>
                </SwiperSlide>
              )
          )}
        </Swiper>
      </div>
    </div>
  );
};

export default Story;
