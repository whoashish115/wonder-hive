import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import useStore from "@/hooks/useStore";
import Image from "next/image";
import { HiCheck, HiLockClosed, HiPlus, HiUserAdd, HiX } from "react-icons/hi";
import {
  getUserProfile,
  followRequestUserProfile,
  unfollowUserProfile,
  followRequestDecline,
  followRequestAccept,
} from "@/store/actions/profileActions";
import { getData } from "@/utils/fetchData";
import InfiniteScroll from "react-infinite-scroll-component";
import Button from "../customs/Button";
import POST_GLIMPSE_TYPES from "@/store/types/postGlimpseTypes";
import { PlusIcon } from "@heroicons/react/24/outline";
import Preloader from "../customs/Preloader";
import { FaHeart, FaRegCommentDots } from "react-icons/fa";
import { functionalTools, mediaTools } from "@/utils/tools";
import GLOBAL_TYPES from "@/store/types/globalTypes";
import { BiImage, BiUser, BiVideo } from "react-icons/bi";
import { Link as LinkIcon } from "react-feather";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

const FollowerFollowingCard = ({ user }) => {
  const { state, dispatch } = useStore();
  const { auth, socket } = state;
  const [isFollowLoading, setIsFollowLoading] = useState(false);
  const [followed, setFollowed] = useState(false);
  const [requested, setRequested] = useState(false);

  const handleFollow = () => {
    if (isFollowLoading) return;
    setIsFollowLoading(true);
    followRequestUserProfile(dispatch, { user, auth, socket });
    if (user.accountPrivate) {
      setRequested(true);
      setFollowed(false);
    } else {
      setRequested(false);
      setFollowed(true);
    }
    setIsFollowLoading(false);
  };
  const handleUnfollow = () => {
    if (isFollowLoading) return;
    setIsFollowLoading(true);

    unfollowUserProfile(dispatch, { user, auth, socket });
    setRequested(false);
    setFollowed(false);

    setIsFollowLoading(false);
  };
  useEffect(() => {
    if (user.requests?.find((item) => item._id === user._id)) {
      setRequested(true);
    }
  }, [auth.user.requests, user._id]);
  useEffect(() => {
    if (auth.user.followings.find((item) => item._id === user._id)) {
      setFollowed(true);
    }
  }, [auth.user.followings, user._id]);

  return (
    <div className="flex gap-4 items-center justify-between w-full  p-2 px-4 bg-background-extralight">
      <div className="flex flex-row gap-4 items-center flex-grow">
        <Link href={`/profile/${user.username}`}>
          <Image
            src={user.profileImage}
            alt="picture"
            height={60}
            width={60}
            style={{
              aspectRatio: 1,
            }}
            className="rounded-full  object-cover text-sm object-center"
          />
        </Link>
        <Link href={`/profile/${user.username}`}>
          <div>
            {user.fullname}
          </div>
          <div className="hover:text-primary-light font-light text-sm text-text-light">
            {"@" + user.username}
          </div>
        </Link>
      </div>
      <div className="flex gap-4">
        {(requested || followed) ? (
          <button
            onClick={handleUnfollow}
            className="font-semibold rounded-custom flex items-center justify-center px-4 py-1 text-base capitalize text-primary-main bg-primary-light/5 hover:bg-primary-light/10 border border-primary-main"

          >
            {requested ? 'requested' : 'unfollow'}
          </button>
        ) : (
          <button
            onClick={handleFollow}
            className="font-semibold rounded-custom flex items-center justify-center px-4 py-1 text-base capitalize text-white bg-primary-main  hover:bg-primary-dark border border-transparent"

          >
            follow
          </button>)}
      </div>
    </div>
  );
};
const PostGlimpseCard = (postGlimpse) => {
  const { _id, medias, likes, comments, glimpse } = postGlimpse;
  const width = medias[0]?.width
  const height = medias[0]?.height
  const aspectRatio = glimpse ? 9 / 16 : 1
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
    <Link href={`/${glimpse ? 'glimpse' : 'post'}/${_id}`} className="flex relative flex-col gap-2 group  overflow-hidden">
      {medias.length > 0 &&
        (mediaTools.isVideo(medias[0].url) ? (
          <video
            style={{ aspectRatio, objectFit: 'cover', objectPosition: 'center', minHeight: '140px', height: '100%', width: '100%' }}
            src={medias[0].url}
            alt="video"
            ref={videoRef}
          />
        ) : (
          <Image
            src={medias[0].url}
            alt="picture"
            height={height}
            width={width}
            style={{ aspectRatio, minHeight: '140px' }}
            className=" object-cover object-center w-full h-full"
          />
        ))}
      <div className=" bg-black/30 z-10 w-full flex justify-center items-center gap-7 h-full absolute top-0 left-0 transition-all group-hover:bg-black/60">
        <div className="group text-xl opacity-0 group-hover:opacity-100 text-center flex xl:grid place-items-center rounded-xl text-white hover:text-text-dark cursor-pointer relative">
          <FaHeart className="w-7 h-7" />
          <div className="text-base mt-1">{likes.length}</div>
        </div>
        <div className="group text-xl opacity-0 group-hover:opacity-100 text-center flex xl:grid place-items-center  rounded-xl cursor-pointer relative text-white hover:text-text-dark">
          <FaRegCommentDots className="w-7 h-7" />
          <div className="text-base mt-1">{comments.length}</div>
        </div>
      </div>
    </Link>
  );
};

const Profile = () => {
  const router = useRouter();
  const { username } = router.query;
  const { state, dispatch } = useStore();
  const { profiles, auth, postGlimpse, socket, highlight, story } = state;
  const { profilePosts, profileGlimpses,savePostsGlimpses, detailedPostsGlimpses } = postGlimpse;
  const [userData, setUserData] = useState({});
  const [tab, setTab] = useState('posts');
  const [posts, setPosts] = useState([]);
  const [saves, setSaves] = useState([]);
  const [savesResult, setSavesResult] = useState(9);
  const [savesPage, setSavesPage] = useState(0);
  const [savesLoading, setSavesLoading] = useState(false);
  const [glimpses, setGlimpses] = useState([]);
  const [stories, setStories] = useState([]);
  const [highlights, setHighlights] = useState([]);
  const [suggestionOpen, setSuggestionOpen] = useState(false);
  const [suggestionLoaded, setSuggestionLoaded] = useState(false);
  const [suggestionsLoading, setSuggestionLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  
  const [postsResult, setPostsResult] = useState(9);
  const [glimpsesResult, setGlimpsesResult] = useState(9);
  const [glimpsesPage, setGlimpsesPage] = useState(0);
  const [postsPage, setPostsPage] = useState(0);
  const [postsLoading, setPostsLoading] = useState(false);
  const [glimpsesLoading, setGlimpsesLoading] = useState(false);
  const [isFollowLoading, setIsFollowLoading] = useState(false);
  const [followed, setFollowed] = useState(false);
  const [requested, setRequested] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const allTabs = [
    {name:`posts ${userData.postsCount >0 ? `(${userData.postsCount})` :''}`, slug:'posts'},
    {name:`glimpses ${userData.glimpsesCount >0 ? `(${userData.glimpsesCount})` :''}`, slug:'glimpses'},
    {name:`followers ${userData.followers?.length >0 ? `(${userData.followers.length})` :''}`, slug:'followers'},
    {name:`followings ${userData.followings?.length >0 ? `(${userData.followings.length})`:''}`, slug:'followings'},
  ]
  const handleFollowAccept = () => {
    if (actionLoading) return;
    setActionLoading(true);

    followRequestAccept(dispatch, { user: userData, auth, socket });

    setActionLoading(false);
  };

  const handleFollowDecline = () => {
    if (actionLoading) return;
    setActionLoading(true);

    followRequestDecline(dispatch, {
      user: userData,
      auth,
      socket,
    });

    setActionLoading(false);
  };
  const canViewProfile = (userData.accountPrivate ? ((userData.accountPrivate) && (username == auth.user.username || followed)) : true)
  const isRequestedToMe = auth.user.requests.find(user => user._id == userData._id)

  const handleGetProfileSuggestions = async () => {
    if (!suggestionLoaded) {
      setSuggestionLoading(true)
      const res = await getData(`/profile_suggestions/${userData._id}`, auth.token)
      if (res.error) dispatch({ type: GLOBAL_TYPES.ALERT_ERROR, payload: res.error })
      setSuggestions(res.users)
      setSuggestionLoading(false)
      setSuggestionLoaded(true)
    }
  }

  const handleFollow = () => {
    if (isFollowLoading) return;
    setIsFollowLoading(true);
    followRequestUserProfile(dispatch, { user: userData, auth, socket });
    if (userData.accountPrivate) {
      setRequested(true);
      setFollowed(false);
    } else {
      setRequested(false);
      setFollowed(true);
    }
    setIsFollowLoading(false);
    handleGetProfileSuggestions()
  };
  const handleUnfollow = () => {
    if (isFollowLoading) return;
    setIsFollowLoading(true);

    unfollowUserProfile(dispatch, { user: userData, auth, socket });
    setRequested(false);
    setFollowed(false);

    setIsFollowLoading(false);
  };

  useEffect(() => {
    if (userData.requests?.find((item) => item._id === userData._id)) {
      setRequested(true);
    }
  }, [auth.user.requests, userData._id]);
  useEffect(() => {
    if (auth.user.followings.find((item) => item._id === userData._id)) {
      setFollowed(true);
    }
  }, [auth.user.followings, userData._id]);

  useEffect(() => {
    if (canViewProfile) {
      profilePosts.forEach((data) => {
        if (data._id === userData._id) {
          setPosts(data.posts);
          setPostsResult(data.result);
          setPostsPage(data.page);
        }
      });
    }
  }, [profilePosts, userData._id, canViewProfile]);
  useEffect(() => {
    if (canViewProfile) {
          setSaves(savePostsGlimpses.data);
          setSavesResult(savePostsGlimpses.result);
          setSavesPage(savePostsGlimpses.page);
    }
  }, [profilePosts, userData._id, canViewProfile]);
  useEffect(() => {
    if (canViewProfile) {
      profileGlimpses.forEach((data) => {
        if (data._id === userData._id) {
          setGlimpses(data.glimpses);
          setGlimpsesResult(data.result);
          setGlimpsesPage(data.page);
        }
      });
    }
  }, [profileGlimpses, userData._id, canViewProfile]);
  useEffect(() => {
    if (canViewProfile) {
      story.profileStories.forEach((data) => {
        if (data._id === userData._id) {
          setStories(data.stories);
        }
      });
    }
  }, [story.profileStories, userData._id, canViewProfile]);
  useEffect(() => {
    if (canViewProfile) {
      highlight.profileHighlights.forEach((data) => {
        if (data._id === userData._id) {
          setHighlights(data.highlights);
        }
      });
    }
  }, [highlight.profileHighlights, userData._id, canViewProfile]);

  useEffect(() => {
    if ([...allTabs, {slug:'saves'}].find(t=>t.slug == router.query.tab)) {
      setTab(router.query.tab)
    }
  }, [router.query.tab])


  const handleLoadMoreGlimpses = async () => {
    setGlimpsesLoading(true);
    const res = await getData(
      `post-glimpse/glimpses/user/${userData._id}?limit=${page * 9}`,
      auth.token
    );
    const newData = { ...res, page: page + 1, _id: userData._id };
    dispatch({
      type: POST_GLIMPSE_TYPES.PROFILE_GLIMPSE_UPDATE,
      payload: newData,
    });
    setGlimpsesLoading(false);
  };
  const handleLoadMorePosts = async () => {
    setPostsLoading(true);
    const res = await getData(
      `post-glimpse/posts/user/${userData._id}?limit=${page * 9}`,
      auth.token
    );
    const newData = { ...res, page: page + 1, _id: userData._id };
    dispatch({
      type: POST_GLIMPSE_TYPES.PROFILE_POST_UPDATE,
      payload: newData,
    });
    setPostsLoading(false);
  };
  const handleLoadMoreSaves = async () => {
    setSavesLoading(true);
    const res = await getData(
      `post-glimpse/saves?limit=${page * 9}`,
      auth.token
    );
    const newData = { ...res, page: page + 1, _id: userData._id };
    dispatch({
      type: POST_GLIMPSE_TYPES.SAVE_POST_GLIMPSE_GET,
      payload: newData,
    });
    setSavesLoading(false);
  };
  useEffect(() => {
    if (profiles.users.every((user) => user.username !== username)) {
      getUserProfile(dispatch, { username, auth });
    }
  }, [auth]);
  useEffect(() => {
    if (username === auth.user.username) {
      setUserData(auth.user);
    } else {
      const newData = profiles.users.filter(
        (user) => user.username == username
      );
      setUserData(newData.length > 0 ? newData[0] : {});
    }
  }, [username, auth, dispatch, profiles.users]);


  useEffect(() => {
    let userStories = story.profileStories.find(s=>s._id == userData._id)
    if(userStories){
      setStories(userStories.stories.map(id=>story.detailedStories[id]))
    }
  }, [story.profileStories]);

  useEffect(() => {
    let userHighlights = highlight.profileHighlights.find(s=>s._id == userData._id)
    if(userHighlights){
        setHighlights(userHighlights.highlights.map((id)=>
          {
            let curHighlight = highlight.detailedHighlights[id]
           return {...curHighlight, stories:curHighlight.stories.map((sId)=>story.detailedStories[sId])}
          }
        ))
    }
  }, [highlight.detailedHighlights, highlight.profileHighlights, story.detailedStories])
  

  return profiles.loading ? (
    <Preloader />
  ) : userData._id ? (
    <div className="flex flex-col xl:w-9/12 w-full ">
      <div className="bg-background-light rounded-custom  items-center justify-center  flex flex-col">
        <div className="w-full flex flex-col  gap-4 ">
          <div className="gap-4 flex flex-row  w-full  p-8 pb-4">
        
         {(stories.length) ?
         <div onClick={()=>dispatch({type:GLOBAL_TYPES.STORY, payload:stories})} className="border-[6px] cursor-pointer hover:border-primary-dark rounded-full roudned-full p-2 border-primary-main">
            <Image
              width={600}
              height={600}
              src={userData.profileImage}
              className="rounded-full object-cover inset-x-96 object-center z-[20] md:w-36 w-24 h-24 md:h-36 select-none"
            />
         </div>
         :   <Image
              width={600}
              height={600}
              src={userData.profileImage}
              className="rounded-full object-cover inset-x-96 object-center z-[20] md:w-36 w-24 h-24 md:h-36  select-none"
            />}

            <div className="flex gap-4 flex-grow">
              <div className="flex flex-grow  flex-col gap-3">
                <div className="flex gap-4  ">
                  <div className="flex-grow">
                    <h1 className=" font-semibold text-lg md:text-2xl">{userData.fullname}</h1>
                    <span className="text-text-main text-sm cursor-pointer font-light opacity-70 hover:opacity-100 transition-all hover:text-primary-main">
                      {"@" + userData.username}
                    </span>

                  </div>
                  <div className="md:flex hidden">
                  {auth.user.username == username ? (
                    <Link href="/settings">
                      <Button content="Edit Profile" />
                    </Link>
                    
                  ) : (
                    <div className="flex gap-2 flex-row">
                      <div>


                        {(requested || followed) ? (
                          <button
                            onClick={handleUnfollow}
                            className="font-semibold rounded-custom flex items-center justify-center px-6 py-1.5 text-base capitalize text-primary-main hover:text-white hover:bg-primary-main border-2 border-primary-main "

                          >
                            {requested ? 'requested' : 'unfollow'}
                          </button>
                        ) : (
                          <Button onClick={handleFollow} content="Follow" />)}
                      </div>

                      <div>
                        <Link href={`/message/${userData.username}`}>
                          <button className="font-semibold rounded-custom flex items-center text-white justify-center px-8 py-2 text-base capitalize bg-white/10 hover:bg-primary-dark">
                            Message
                          </button>
                        </Link>
                      </div>
                      <div>
                        <button onClick={() => { setSuggestionOpen(!suggestionOpen); if (!suggestionLoaded) handleGetProfileSuggestions() }} className="font-semibold rounded-custom flex items-center text-white justify-center p-2 text-2xl capitalize bg-white/10 hover:bg-primary-dark">
                          <HiUserAdd />
                        </button>
                      </div>
                    </div>
                  )}
                  </div>

                </div>
                <div className="md:flex hidden  gap-4 md:gap-8">
                <Link href={`/profile/${username}/posts`}>
                  <div className="cursor-pointer flex justify-center items-center flex-col transition-all hover:text-primary-light">
                    <div className="text-2xl">{userData.postsCount}</div>
                    <div className="text-text-light ">Posts</div>
                  </div>
            </Link>
            <Link href={`/profile/${username}/glimpses`}>
                  <div className="cursor-pointer flex justify-center items-center flex-col transition-all hover:text-primary-light">
                    <div className="text-2xl">{userData.glimpsesCount}</div>
                    <div className="text-text-light ">Glimpses</div>
                  </div>
            </Link>
            <Link href={`/profile/${username}/followers`}>
                  <div className="cursor-pointer flex justify-center items-center flex-col transition-all hover:text-primary-light">
                    <div className="text-2xl">{userData.followers?.length}</div>
                    <div className="text-text-light ">followers</div>
                  </div>
            </Link>
            <Link href={`/profile/${username}/followings`}>
                  <div className="cursor-pointer flex justify-center items-center flex-col transition-all hover:text-primary-light">
                    <div className="text-2xl">{userData.followings?.length}</div>
                    <div className="text-text-light ">followings</div>
                  </div>
            </Link>
                </div>
             {canViewProfile && userData.website &&   <div className="flex gap-8">
                  <Link href={userData.website}>
                  <span className="flex  gap-1 text-primary-main items-center justify-center hover:text-primary-light">
                    <LinkIcon className="w-5 h-5"/>
                    {userData.website}
                    </span>
                    </Link>
                </div>}



              </div>
            </div>
            
          </div>
          <div className="flex md:hidden justify-center px-4 gap-4 md:gap-8">
            <Link href={`/profile/${username}/posts`}>
                  <div className="cursor-pointer flex justify-center items-center flex-col transition-all hover:text-primary-light">
                    <div className="text-2xl">{userData.postsCount}</div>
                    <div className="text-text-light ">Posts</div>
                  </div>
            </Link>
            <Link href={`/profile/${username}/glimpses`}>
                  <div className="cursor-pointer flex justify-center items-center flex-col transition-all hover:text-primary-light">
                    <div className="text-2xl">{userData.glimpsesCount}</div>
                    <div className="text-text-light ">Glimpses</div>
                  </div>
            </Link>
            <Link href={`/profile/${username}/followers`}>
                  <div className="cursor-pointer flex justify-center items-center flex-col transition-all hover:text-primary-light">
                    <div className="text-2xl">{userData.followers?.length}</div>
                    <div className="text-text-light ">followers</div>
                  </div>
            </Link>
            <Link href={`/profile/${username}/followings`}>
                  <div className="cursor-pointer flex justify-center items-center flex-col transition-all hover:text-primary-light">
                    <div className="text-2xl">{userData.followings?.length}</div>
                    <div className="text-text-light ">followings</div>
                  </div>
            </Link>
                </div>
                <div className="flex px-4 justify-center   md:hidden ">
                  {auth.user.username == username ? (
                    <Link href="/settings">
                      <Button content="Edit Profile" />
                    </Link>
                  ) : (
                    <div className="flex gap-2 flex-row">
                      <div>


                        {(requested || followed) ? (
                          <button
                            onClick={handleUnfollow}
                            className="font-semibold rounded-custom flex items-center justify-center px-6 py-1.5 text-base capitalize text-primary-main hover:text-white hover:bg-primary-main border-2 border-primary-main "

                          >
                            {requested ? 'requested' : 'unfollow'}
                          </button>
                        ) : (
                          <Button onClick={handleFollow} content="Follow" />)}
                      </div>

                      <div>
                        <Link href={`/message/${userData.username}`}>
                          <button className="font-semibold rounded-custom flex items-center text-white justify-center px-8 py-2 text-base capitalize bg-white/10 hover:bg-primary-dark">
                            Message
                          </button>
                        </Link>
                      </div>
                      <div>
                        <button onClick={() => { setSuggestionOpen(!suggestionOpen); if (!suggestionLoaded) handleGetProfileSuggestions() }} className="font-semibold rounded-custom flex items-center text-white justify-center p-2 text-2xl capitalize bg-white/10 hover:bg-primary-dark">
                          <HiUserAdd />
                        </button>
                      </div>
                    </div>
                  )}
                  </div>
          {isRequestedToMe && <div className=" font-light flex gap-4  px-8 justify-center items-center w-full">
            <div className=" bg-background-extralight gap-4 rounded-custom  p-4 flex w-full justify-between items-center  ">

              <div className="uppercase font-semibold flex-shrink-0">
                Requested to you
              </div>
              <div className="flex gap-3">
                <button
                  className="font-semibold rounded-custom w-full max-w-[200px] flex items-center gap-4 justify-center px-6 py-1.5 text-base capitalize text-primary-main hover:text-white hover:bg-primary-main border-2 border-primary-main "
                  onClick={handleFollowAccept}
                >
                  <HiCheck className="text-2xl" />
                  Accept
                </button>
                <button
                  onClick={handleFollowDecline}
                  className="font-semibold rounded-custom w-full max-w-[200px] flex items-center gap-4 text-text-dark border-2 border-border-outline justify-center px-8 py-2 text-base capitalize bg-background-light hover:bg-background-extralight"
                >
                  <HiX className="text-2xl" />
                  decline
                </button>
              </div>
            </div>
          </div>}
          {userData.bio && <div className=" font-light whitespace-pre w-full pb-4 px-8">{userData.bio}</div>}

          {((userData.highlights && userData.highlights.length > 0) ||
     canViewProfile) && (
              <div className="flex w-full flex-col gap-4 pb-4 px-8">
                
                {userData.highlights && userData.highlights.length > 0 && (
                  <div className="flex  w-full items-center gap-4">
                    <div className="h-[2px] w-16 rounded-custom bg-border-outline" />
                    <h4 className=" flex-shrink-0 items-center text-text-main">
                      My Highlights
                    </h4>
                    <div className="flex-grow h-[2px] w-full rounded-custom bg-border-outline" />
                  </div>
                )}
                <div className="flex gap-4 w-full">
                
                     <Swiper
          modules={[Navigation, Pagination]}
          className=" object-cover w-full justify-stretch"
          style={{ }}
          slidesPerView={"auto"}
          scrollbar={{ draggable: true }}
        >

             {auth.user.username === username && (    <SwiperSlide
                  style={{ width: "auto" }}
                  className="h-full px-4 self-stretch justify-stretch object-fill  w-auto"
                >
                      <Link href="/create/highlight">
                      <div className="flex justify-center flex-col gap-2 items-center relative">
                        <div
                          className={`flex-shrink-0 cursor-pointer relative group hover:border-primary-main rounded-full border-[3px] border-border-outline border-dashed p-1`}
                        >
                          <div className="rounded-full bg-background-extralight w-[70px] h-[70px] flex justify-center items-center group-hover:bg-primary-main hover:text-white text-text-light p-1">
                            <HiPlus className="text-5xl" />
                          </div>
                        </div>
                        <p className="text-sm text-text-light">Add Highlight</p>
                      </div>
                    </Link>
                </SwiperSlide>  )}

                  {highlights.map( (highlight, i) =>
                <SwiperSlide
                  style={{ width: "auto" }}
                  className="h-full px-4 self-stretch justify-stretch object-fill  w-auto"
                  key={i}
                >
                  <div
                    key={i}
                    onClick={() =>
                      dispatch({
                        type:GLOBAL_TYPES.STORY,
                        payload:   highlight.stories})}
                    className="flex justify-center flex-col gap-2  items-center"
                  >
                    <div className="flex-shrink-0 cursor-pointer  rounded-full border-[3px] overflow-hidden relative  border-border-outline hover:border-primary-main p-1">
                      <div className="w-[70px] h-[70px] rounded-full relative overflow-hidden">
                        <Image
                          src={highlight.picture?.url}
                          alt="Profile picture"
                          width={70}
                          height={70}
                          className="w-full h-full object-cover object-center select-none"
                        />
                      </div>
                    </div>
                    <p className="text-sm text-text-light">
                      {highlight.title}
                    </p>
                  </div>
                  </SwiperSlide>  
          )}

        </Swiper>

                </div>
              </div>
            )}
          {canViewProfile && <div className={`flex w-full flex-wrap md:grid  justify-end sm:justify-center  items-stretch ${username == auth.user.usernam ? 'grid-cols-4':'grid-cols-5'}`}>
            {allTabs.map(({name, slug}, i) => (
              <Link key={i} className="w-full" href={`/profile/${username}/${slug}`}>
                <button className={`flex justify-center h-full items-center px-4 py-2 w-full capitalize rounded-t-custom transition ${tab == slug ? 'border-primary-main border-b-4 bg-primary-light/10 ' : "bg-background-light text-text-light border-b-4 border-border-outline hover:bg-background-extralight"}`} >
                  {name}
                </button>
              </Link>
            ))}

            {username == auth.user.username &&
             <Link className="w-full" href={`/profile/${username}/saves`}>
             <button className={`flex justify-center gap-1 h-full items-center px-4 py-2 w-full capitalize rounded-t-custom transition ${tab == 'saves' ? 'border-primary-main border-b-4 bg-primary-light/10 ' : "bg-background-light text-text-light border-b-4 border-border-outline hover:bg-background-extralight"}`} >
               My saves
             {auth.user.username == username&&  <div className="bg-background-light border-2 border-border-outline text-xs px-2 py-0.5 font-semibold  mx-2 rounded-full">private</div>}
             </button>
           </Link>}
          </div>}
        </div>
      </div>
      {
        canViewProfile ? <>
          <div className={`${tab == 'posts' ? 'block' : 'hidden'}  `}>
            {posts.length !== 0
              ? <InfiniteScroll
                dataLength={posts.length}
                next={handleLoadMorePosts}
                hasMore={postsResult < 9 * (postsPage - 1) ? false : true}
                loader={posts.length > 0 && <Preloader />}
                endMessage={<div>{postsLoading ? "No More Posts" : ""}</div>}
              >
                <div className="grid md:grid-cols-2 lg:grid-cols-3">
                  {posts.map((post, i) => (
                    <PostGlimpseCard key={i} {...detailedPostsGlimpses[post]} />
                  ))
                  }
                </div>
              </InfiniteScroll>
              : <div className="rounded-md flex gap-2 capitalize flex-grow text-text-light justify-center items-center p-12">
                <BiImage className="text-3xl" />
                No Posts
              </div>
            }
            {posts.length > 0 && (postsResult < 9 * (postsPage - 1)
              ? ""
              : !postsLoading && (
                <button
                  className="btn btn-dark mx-auto d-block"
                  onClick={handleLoadMorePosts}
                >
                  Load more
                </button>
              ))}
          </div>
          <div className={`${tab == 'saves' ? 'block' : 'hidden'}  `}>
            {saves.length !== 0
              ? <InfiniteScroll
                dataLength={saves.length}
                next={handleLoadMoreSaves}
                hasMore={savesResult < 9 * (savesPage - 1) ? false : true}
                loader={saves.length > 0 && <Preloader />}
                endMessage={<div>{savesLoading ? "No More Posts" : ""}</div>}
              >
                <div className="grid md:grid-cols-3 grid-cols-2  lg:grid-cols-4">
                  {saves.map((save, i) => (
                    <PostGlimpseCard key={i} {...detailedPostsGlimpses[save]} />
                  ))
                  }
                </div>
              </InfiniteScroll>
              : <div className="rounded-md flex gap-2 capitalize flex-grow text-text-light justify-center items-center p-12">
                <BiImage className="text-3xl" />
                No Saves
              </div>
            }
            {posts.length > 0 && (postsResult < 9 * (postsPage - 1)
              ? ""
              : !postsLoading && (
                <button
                  className="btn btn-dark mx-auto d-block"
                  onClick={handleLoadMorePosts}
                >
                  Load more
                </button>
              ))}
          </div>
          <div className={`${tab == 'glimpses' ? 'block' : 'hidden'}`}>
            {glimpses.length !== 0
              ? <InfiniteScroll
                dataLength={glimpses.length}
                next={handleLoadMoreGlimpses}
                hasMore={glimpsesResult < 9 * (glimpsesPage - 1) ? false : true}
                loader={glimpses.length > 0 && <Preloader />}
                endMessage={<div>{glimpsesLoading ? "No More Glimpses" : ""}</div>}
              >
                <div className="grid grid-cols-4 ">
                  {glimpses.map((glimpse, i) => (
                    <PostGlimpseCard key={i} {...detailedPostsGlimpses[glimpse]} />
                  ))}
                </div>
              </InfiniteScroll>
              : <div className="rounded-md flex gap-2 capitalize flex-grow text-text-light justify-center items-center p-12">
                <BiVideo className="text-3xl" />
                No Glimpses
              </div>}

            {glimpses.length > 0 && (glimpsesResult < 9 * (glimpsesPage - 1)
              ? ""
              : !glimpsesLoading && (
                <button
                  className="btn btn-dark mx-auto d-block"
                  onClick={handleLoadMoreGlimpses}
                >
                  Load more
                </button>
              ))}
          </div>
          <div className={`${tab == 'followers' ? 'block' : 'hidden'}`}>
            {userData.followers.length !== 0
              ? <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {userData.followers.map((user,i) => (
                    <FollowerFollowingCard key={i}user={user} />
                ))}
              </div>
              : <div className="rounded-md flex gap-2 capitalize flex-grow text-text-light justify-center items-center p-12">
                <BiUser className="text-3xl" />
                No Followers
              </div>}

          </div>
          <div className={`${tab == 'followings' ? 'block' : 'hidden'}`}>
            {userData.followings.length !== 0
              ? <div className="grid grid-cols-1 md:grid-cols- gap-4">
                {userData.followings.map((user,i) => (
                    <FollowerFollowingCard key={i} user={user} />
                ))}
              </div>
              : <div className="rounded-md flex gap-2 capitalize flex-grow text-text-light justify-center items-center p-12">
                <BiUser className="text-3xl" />
                No followings
              </div>}

          </div>
          <div className="py-12"/>
        </>
          : (<div className="bg-background-light rounded-md flex text-text-light gap-4 justify-center items-center p-6 border-t-2 border-border-outline cursor-not-allowed">
            <HiLockClosed className="text-5xl" />
            This account is private <br />
            Follow to see their photos and videos.
          </div>)
      }
    </div>
  ) : (
    <div className="text-sm w-full flex justify-center items-center">
      No User Found
    </div>
  );
};

export default Profile;
