import React, { useEffect, useRef, useState } from "react";
import Story from "./Story";
import Link from "next/link";
import {
  HiDotsVertical,
  HiOutlineUserAdd,
  HiOutlineUserRemove,
  HiRefresh,
} from "react-icons/hi";
import Image from "next/image";
import useStore from "@/hooks/useStore";
import InfiniteScroll from "react-infinite-scroll-component";
import { getData } from "@/utils/fetchData";
import POST_GLIMPSE_TYPES from "@/store/types/postGlimpseTypes";
import { getUserSuggestions } from "@/store/actions/globalActions/suggestionsActions";
import Button from "../customs/Button";
import { getFeedPostsGlimpses,getSavePostsGlimpses} from "@/store/actions/postGlimpseActions";
import ActiveUsers from "../customs/ActiveUsers";
import { mediaTools } from "@/utils/tools";
import FeedCard from "./FeedCard";
import SmallFollow from "../more/SmallFollow";
import Loader from "../customs/Loader";
import { useRouter } from "next/router";

const SaveCard = (postGlimpse) => {
  const { medias, _id, glimpse } = postGlimpse;
  const videoRef = useRef(null)
  useEffect(() => {
    const video = videoRef.current;
    if(video){
      const handleLoadedMetadata = () => {
        const middleTime = video.duration /1.5;
        video.currentTime = middleTime;
      };
      video.addEventListener('loadedmetadata', handleLoadedMetadata);
      return () => {
        video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      };
    }
  }, [videoRef])

  return (
    <Link
      href={`/${glimpse ? 'glimpse' : 'post'}/${_id}`}
      className="font-semibold text-sm transition-opacity"
    >
      <div className="absolute top-0 left-0  hover:bg-black/40 bg-black/20 bottom-0 right-0 rounded-custom flex group justify-center  text-white  transition-opacity items-center grid-rows-2 w-full h-full text-sm font-semibold cursor-pointer"></div>

      <div className="w-full h-full bg-background-light cursor-pointer">
        {mediaTools.isVideo(medias[0].url) ? (
          <video
            style={{
              aspectRatio: medias[0].width / medias[0].width,
              objectFit: "cover",
              objectPosition: "center",
              height: "100%",
            }}
            src={medias[0].url}
            alt="video"
            ref={videoRef}
          />
        ) : (
          <Image
            src={medias[0].url}
            alt="picture"
            height={medias[0].height}
            width={medias[0].width}
            style={{
              aspectRatio: medias[0].width / medias[0].width,
            }}
            className="object-cover object-center h-full"
          />
        )}
      </div>
    </Link>
  );
};

const Index = () => {
  const { state, dispatch } = useStore();
  const { suggestions, activity, auth, postGlimpse } = state;
  const { detailedPostsGlimpses } = postGlimpse;
  const router = useRouter()

  const [player, setPlayer] = useState([]);
  const [scrollResult, setScrollResult]= useState()
  const handleScroll = ()=>{
    const element = document?.querySelector('#custom-body')
    setScrollResult({scrollTop: element.scrollTop, scrollHeight:element.scrollHeight})
  }
  useEffect(() => {
    const element = document?.querySelector('#custom-body')
    element?.addEventListener('scroll', handleScroll);
    handleScroll()
    return ()=>element?.removeEventListener('scroll', handleScroll);
  }, []);
  useEffect(() => {
    const element = document?.querySelector('#custom-body')
    if(element){
      element.scrollTop =0;
    }
  }, []);
  

  useEffect(() => {
    if (!postGlimpse.feedPostsGlimpses.firstLoad) {
      getFeedPostsGlimpses(dispatch, auth.token);
    }
    if (!postGlimpse.savePostsGlimpses.firstLoad) {
      getSavePostsGlimpses(dispatch, auth.token);
    }
    if (!suggestions.firstLoad) {
      getUserSuggestions(dispatch, auth.token);
    }
  }, []);

  const [load, setLoad] = useState(true);
  const handleLoadMore = async () => {
    const data = await getData(
      `post-glimpse/feed?limit=${postGlimpse.feedPostsGlimpses.page * 9}`,
      auth.token
    );
    dispatch({
      type: POST_GLIMPSE_TYPES.FEED_POST_GET,
      payload: { ...data, page: postGlimpse.feedPostsGlimpses.data.page + 1 },
    });
  };
  const [savePostsGlimpses, setSavePostsGlimpses] = useState([]);
  useEffect(() => {
  setLoad( postGlimpse.feedPostsGlimpses.loading)
  }, [postGlimpse.feedPostsGlimpses.loading]);
  useEffect(() => {
    let data = [];
    postGlimpse.savePostsGlimpses.data.forEach((id) => {
      if (detailedPostsGlimpses[id].medias.length > 0) {
        data.push(detailedPostsGlimpses[id]);
      }
    });
    setSavePostsGlimpses(data);
  }, [postGlimpse.savePostsGlimpses.data]);

  return (
  (! postGlimpse.feedPostsGlimpses.loading && ! postGlimpse.savePostsGlimpses.loading && savePostsGlimpses.length == 0 && auth.user.followings.length ==0 && postGlimpse.feedPostsGlimpses.data.length == 0) ? 
     (suggestions.loading || suggestions.users.length !== 0) && (
            <div className="w-full flex justify-center items-center">
            <div className="w-full w-12/12 xl:w-8/12 flex flex-col p-4 gap-4">
              <div className="flex  justify-between items-center ">
                <div className="flex flex-col">
                <div className="font-light text-xs px-1">Nothing to see here, follow few friends to get started</div>
                <div className="font-semibold text-lg px-1">Suggestions</div>
                </div>
                <div className="flex space-x-2">
                  <div
                    onClick={() => {
                      if (!suggestions.loading) {
                        getUserSuggestions(dispatch, auth.token);
                      }
                    }}
                    className="p-2 grid place-items-center text-xl bg-background-light rounded-xl hover:bg-primary-main hover:text-white cursor-pointer"
                  >
                    <HiRefresh />
                  </div>
                 
                </div>
              </div>
              <ul className="space-y-2 ">
                  {suggestions.loading ? <Loader/> :suggestions.users.map((user) => (
                        <div
                          key={user._id}
                          className="py-2 px-4 w-full border border-border-outline hover:bg-background-extralight rounded-md  flex cursor-pointer justify-center items-center gap-3"
                        >
                          <Image
                            src={user.profileImage}
                            width={100}
                            height={100}
                            className="w-14 h-14 rounded-full object-cover object-center "
                          />
                          <div className="flex-grow flex flex-col break-words w-10">
                            <Link href={`/profile/${user.username}`}>
                              <>
                                <h5 className="text-sm">{user.fullname}</h5>
                                <p className="text-xs font-light text-text-light">
                                  {"@" + user.username}
                                </p>
                              </>
                            </Link>
                            <p className="text-text-light text-xs font-normal">
                              Suggested for you
                            </p>
                          </div>
                          <SmallFollow user={user} />
                        </div>
                      ))}
              </ul>
            </div>
            </div>
          ) 
          :  <>
      <div className="w-12/12 w-full xl:w-4/12 gap-4 flex flex-col z-10 relative overflow-hidden">
      <Story />
      <Link scroll={false}  href="/create/post">
          <div className="w-full">
            <div className="p-2   rounded-custom flex cursor-pointer hover:bg-background-extralight gap-3 bg-background-light relative">
              <div className=" w-full flex flex-grow  items-center justify-start px-4 py-2 text-base capitalize text-text-light">
                <span>What&apos;s on your mind, User?</span>
              </div>
              <Button content="Post" />
            </div>
          </div>
        </Link>
        <InfiniteScroll
          dataLength={
            postGlimpse.feedPostsGlimpses.data ? postGlimpse.feedPostsGlimpses.data.length : 0
          }
          next={handleLoadMore}
          hasMore={
            postGlimpse.feedPostsGlimpses.result < 9 * (postGlimpse.feedPostsGlimpses.page - 1)
              ? false
              : true
          }
        >
          <div className="flex flex-col">
            {postGlimpse.feedPostsGlimpses.data &&
              postGlimpse.feedPostsGlimpses.data.map((p, i) => (
                <FeedCard scrollResult={scrollResult} setPlayer={setPlayer} player={player} key={i} {...postGlimpse.detailedPostsGlimpses[p]} />
              ))}
          </div>
        </InfiniteScroll>
              {load && <Loader/>}
      </div>
      <div className="hidden md:flex  md:w-5/12 xl:w-3/12 z-[60] relative flex-shrink-0 overflow-hidden gap-3 md:gap-6 justify-start flex-col h-full">
        <div  className=" sticky w-full gap-3 md:gap-6 flex flex-col ">
    

          { (suggestions.loading || suggestions.users.length !== 0) && (
            <div className="bg-background-light rounded-custom">
              
              <div className="flex  justify-between items-center p-4 ">
                <span className="font-semibold text-lg px-1">Suggestions</span>
                <div className="flex space-x-2">
                  <div
                    onClick={() => {
                      if (!suggestions.loading) {
                        getUserSuggestions(dispatch, auth.token);
                      }
                    }}
                    className="p-2 grid place-items-center text-xl bg-background-light rounded-xl hover:bg-primary-main hover:text-white cursor-pointer"
                  >
                    <HiRefresh />
                  </div>
                </div>
              </div>
              <ul className="space-y-2 px-4 pb-4">
                <div className="grid grid-cols-1">
                  {suggestions.loading ? <Loader/> :suggestions.users.map((user, i) => (
                        <div
                          key={i}
                          className="py-2 px-4 w-full border border-border-outline hover:bg-background-extralight rounded-md  flex cursor-pointer justify-center items-center gap-3"
                        >
                          <Image
                            src={user.profileImage}
                            width={100}
                            height={100}
                            className="w-14 h-14 rounded-full object-cover object-center "
                          />
                          <div className="flex-grow flex flex-col break-words w-10">
                            <Link href={`/profile/${user.username}`}>
                              <>
                                <h5 className="text-sm">{user.fullname}</h5>
                                <p className="text-xs font-light text-text-light">
                                  {"@" + user.username}
                                </p>
                              </>
                            </Link>
                            <p className="text-text-light text-xs font-normal">
                              Suggested for you
                            </p>
                          </div>
                          <SmallFollow user={user} />
                        </div>
                      ))}
                </div>
              </ul>
            </div>
          )}

         
          {activity?.length > 0 &&  <div className={`bg-background-light rounded-custom transition-all overflow-hidden ${ activity?.length > 0 ? 'h-auto pointer-events-auto' : ' h-0 !my-0 !py-0 pointer-events-none'}`}>
              <div className="flex  justify-between items-center p-4 ">
                <span className="font-semibold text-lg px-1">
                  Online Friends
                </span>
                <div className="flex space-x-2">
                  <div
                    onClick={() => {
                      if (!suggestions.loading) {
                        getUserSuggestions(dispatch, auth.token);
                      }
                    }}
                    className="p-2 grid place-items-center text-xl bg-background-light rounded-xl hover:bg-primary-main hover:text-white cursor-pointer"
                  >
                    <HiRefresh />
                  </div>
                  <div className="p-2 grid place-items-center text-lg bg-background-light rounded-xl hover:bg-primary-main hover:text-white cursor-pointer">
                    <HiDotsVertical />
                  </div>
                </div>
              </div>
              <ul className="space-y-2 px-4 pb-4 h-full">
                <ActiveUsers />
              </ul>
            </div>}
    

          {(postGlimpse.savePostsGlimpses.loading ||savePostsGlimpses.length > 0) && (
            <div className="p-4 rounded-custom bg-background-light">
              <div className="flex justify-between items-center">
                <h1 className="font-semibold text-lg">Recent Saves</h1>
              </div>
              <div className=" py-4">

          {postGlimpse.savePostsGlimpses.loading ? <Loader/>:    <div className="grid grid-cols-2 gap-1 mb-[-16px]">
                {savePostsGlimpses
                  .slice(0, savePostsGlimpses.length == 4 ? 4 : 3)
                  .map((postGlimpse, i) => (
                    <div
                    key={i}
                      className=" relative rounded-custom overflow-hidden  grid flex-col w-full h-full text-text-light group text-sm font-semibold bg-background-dark cursor-pointer"
                    >
                      <SaveCard {...postGlimpse} />
                    </div>
                  ))}
                {savePostsGlimpses.length >= 5 && (
                  <Link href="/activity/saves">
                    <div className=" relative rounded-custom overflow-hidden grid grid-flow-col w-full h-full text-text-light group text-sm font-semibold bg-background-dark cursor-pointer">
                      {savePostsGlimpses.slice(3, 6).map((postGlimpse) => (
                        <SaveCard key={postGlimpse._id} {...postGlimpse} />
                      ))}
                      <div className="absolute top-0 left-0 hover:bg-black/20 bottom-0 right-0 rounded-custom flex group justify-center  text-white  transition-opacity items-center grid-rows-2 w-full h-full text-sm font-semibold cursor-pointer">
                        View More
                      </div>
                    </div>
                  </Link>
                )}
              </div>}
            </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Index;
