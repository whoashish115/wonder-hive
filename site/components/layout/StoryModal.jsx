import useStore from '@/hooks/useStore'
import { deleteStory, heartStory, removeHeartStory, viewStory } from '@/store/actions/storyActions';
import GLOBAL_TYPES from '@/store/types/globalTypes'
import { mediaTools } from '@/utils/tools';
import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import { MdOutlineDeleteForever } from 'react-icons/md';
import Stories from "react-insta-stories";
import Tooltip from '../customs/Tooltip';
import { X } from 'react-feather';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import moment from 'moment';
import Link from 'next/link';
import { HiX } from 'react-icons/hi';
import Preloader from '../customs/Preloader';

const StoryModal = () => {
  const { state, dispatch } = useStore()
  const { currentStory , auth, socket} = state
  const handleStoryView = (index) => {
    let story = currentStory[index]
    if (!story.views?.find((v) => v._id == auth.user._id)) {
      viewStory(dispatch, { story, auth });
    }
  };
  
  const [isHearted, setIsHearted] = useState(false);
  const [heartLoading, setHeartLoading] = useState(false);
  
  const handleDeleteStory = (story) => {
    if (window.confirm("Are you sure want to delete this story?")) {
      dispatch({type:GLOBAL_TYPES.STORY, payload:currentStory.filter((s) => s._id !== story._id)})
      deleteStory(dispatch, { story, auth });
    }
  };
  const handleHeartStory = (story) => {
    if (heartLoading) return;
    setHeartLoading(true);
    setIsHearted(true)
    dispatch({type:GLOBAL_TYPES.STORY, payload:[...currentStory.filter((s) => s._id !== story._id), {...story, hearts:[...story.hearts.filter(h=>h._id !==auth.user._id), auth.user]}]})
    heartStory(dispatch, { story, auth, socket });
    setHeartLoading(false);
  };
  const handleRemoveHeartStory = (story) => {
    if (heartLoading) return;
    setHeartLoading(true);
    setIsHearted(false)
    dispatch({type:GLOBAL_TYPES.STORY, payload:[...currentStory.filter((s) => s._id !== story._id), {...story, hearts:story.hearts.filter(h=>h._id !==auth.user._id)}]})
    removeHeartStory(dispatch, { story, auth, socket });
    setHeartLoading(false);
  };

  useEffect(() => {
    if(Boolean(currentStory?.filter(st=>st.hearts.find(u=>u._id == auth.user._id)).length)){
      setIsHearted(true)
    }
    else{
      setIsHearted(false)
    }
  }, [])
  
  return (
    <>
      {Boolean(currentStory?.length) && (
        <div
          onClick={() => dispatch({type:GLOBAL_TYPES.STORY, payload:[]})}
          className="fixed top-0 left-0 z-[10000000]  bg-background-dark bottom-0 right-0 w-screen h-screen flex justify-center items-center"
        ></div>
      )}
      {Boolean(currentStory.length) && (
        <div className="fixed top-0 left-[50%] translate-x-[-50%]  z-[10000000] bottom-0 flex justify-center items-center">
          <Stories
            stories={currentStory.map((s) => {
              return {
                ...s,
                url: s.media.url,
                type: mediaTools.isVideo(s.media.url)
                  ? "video"
                  : "image",
                seeMoreCollapsed: ({ toggleMore }) => {
                  return (
                    <div className="  h-[48px] items-end justify-between gap-2 flex px-2 py-1">
                     {auth.user._id ==s.user._id &&<div
                        className="flex-grow w-full cursor-pointer"
                        onClick={toggleMore}
                      >
                        See More
                      </div>}
                     
                      <div
                          onClick={() => {
                            isHearted ? handleRemoveHeartStory(s): handleHeartStory(s);
                          }}
                          className="rounded-custom  bg-background-extralight  text-xl xl:grid place-items-center text-text-light hover:text-text-dark cursor-pointer relative"
                        >
                          {isHearted ?
                            <FaHeart
                              onClick={() =>
                                handleRemoveHeartStory(s)
                              }
                              className="w-[26px] h-[26px] text-red-500"
                            />
                           : 
                            <FaRegHeart
                              onClick={() => handleHeartStory(s)}
                              className="w-7 h-7"
                            />
                            }
                        </div>
                            
                    </div>
                  );
                },
                seeMore: ({ close }) => {
                  return (
                    <div className="w-full h-full absolute bg-background-light py-4 flex flex-col gap-2">
                      <div className=' px-4 flex justify-between'>
                      <div
                          onClick={() => {
                            handleDeleteStory(s);
                          }}
                          className=" rounded-custom bg-background-extralight  inline-flex text-xl xl:grid place-items-center text-text-light hover:text-text-dark cursor-pointer relative"
                        >
                          <MdOutlineDeleteForever className="w-7 h-7" />
                        </div>
                        <div
                          onClick={close}
                          className="bg-background-extralight rounded-custom inline-flex text-xl xl:grid place-items-center text-text-light hover:text-text-dark cursor-pointer relative"
                        >
                          <HiX  />
                        </div>
                    
                      </div>
                      <h4 className='font-bold text-sm px-4 pt-4'>
                        Views
                      </h4>

                      <div className=''>
                      {s.views.map((user,i) => (
                        <div key={i} className="flex flex-row gap-3 px-4 py-2 hover:bg-background-extralight items-center flex-grow">
                        <Link href={`/profile/${user.username}`}>
                        <div className='relative'>
                          <Image
                            src={user.profileImage}
                            alt="picture"
                            height={50}
                            width={50}
                            style={{
                              aspectRatio: 1,
                            }}
                            className="rounded-full  object-cover text-sm object-center"
                          />
                        { Boolean(s.hearts.filter(sU=>sU._id==user._id).length)&&<div className='absolute bottom-0 bg-background-extralight p-1 rounded-full right-0 translate-x-[20%] translate-y-[20%]'>
                          <FaHeart
                              className="w-3 h-3 text-red-500"
                            />
                          </div>}
                          </div>
                        </Link>
                        <Link href={`/profile/${user.username}`}>
                          <div className='text-sm'>
                            {user.fullname}
                          </div>
                          <div className="hover:text-primary-light font-light text-xs text-text-light">
                            {"@" + user.username}
                          </div>
                        </Link>
                      </div>
                      ))}
                      </div>
                    
                    </div>
                  );
                },
                header: {
                  profileImage: s.user.profileImage,
                  heading: s.user.fullname,
                  subheading: "@" + s.user.username,
                  caption: moment(s.createdAt).fromNow(),
                },
              };
            })
          }
            defaultInterval={10000}
            keyboardNavigation={true}
            header={(header) => {
              return (
                <div className="flex gap-4 items-center">
                  <Image
                    src={header.profileImage}
                    alt="Profile picture"
                    width={100}
                    height={100}
                    className="w-14 pt-1 h-14  rounded-full object-cover object-center select-none"
                  />
                  <div>
                    <div className="flex justify-between items-center gap-4 w-full">
                      <h6 className="font-semibold cursor-pointer text-base">
                        {header.heading}
                      </h6>
                      <p className="text-text-light text-sm capitalize">
                        {header.caption}
                      </p>
                    </div>
                    <p className="text-text-main text-sm">
                      {header.subheading}
                    </p>
                  </div>
                </div>
              );
            }}
            onStoryStart={(index) => handleStoryView(index)}
            onAllStoriesEnd={() =>  dispatch({type:GLOBAL_TYPES.STORY, payload:[]})}
            storyContainerStyles={{
              height: "800px",
              backgroundColor: "rgba(var(--background-dark-color),1)",
            }}
            loader={<Preloader/>}
          />
        </div>
      )}
    </>

  )
}

export default StoryModal