import React, { useContext, useEffect, useRef, useState } from "react";
import { HiEye, HiHeart, HiOutlineEye, HiX } from "react-icons/hi";
import {
  ChevronLeft,
  ChevronRight,
  Edit,
  MessageCircle,
  MoreHorizontal,
  Share2,
  Volume2,
  VolumeX,
} from "react-feather";
import Tooltip from "../customs/Tooltip";
import Link from "next/link";
import useStore from "@/hooks/useStore";
import {
  deletePostGlimpse,
  removeLikePostGlimpse,
  likePostGlimpse,
  savePostGlimpse,
  removeSavePostGlimpse,
} from "@/store/actions/postGlimpseActions";
import { FaEdit, FaHeart, FaRegHeart, FaVolumeMute, FaVolumeUp } from "react-icons/fa";
import { TbBookmark, TbBookmarkFilled, TbBookmarkPlus } from "react-icons/tb";
import { createComment } from "@/store/actions/commentActions";
import { functionalTools, mediaTools, sentenceTools } from "@/utils/tools";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { BiCopy } from "react-icons/bi";
import { TwitterIcon } from "react-share";
import Image from "next/image";
import { RiDeleteBin5Line } from "react-icons/ri";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";
import GLOBAL_TYPES from "@/store/types/globalTypes";
import { Context } from "@/store/provider";
import { useRouter } from "next/router";
const isObject = (object) => {
  return object != null && typeof object === "object";
};
const isDeepEqual = (object1, object2) => {
  const objKeys1 = Object.keys(object1);
  const objKeys2 = Object.keys(object2);

  if (objKeys1.length !== objKeys2.length) return false;

  for (var key of objKeys1) {
    const value1 = object1[key];
    const value2 = object2[key];

    const isObjects = isObject(value1) && isObject(value2);

    if (
      (isObjects && !isDeepEqual(value1, value2)) ||
      (!isObjects && value1 !== value2)
    ) {
      return false;
    }
  }
  return true;
};
const arraysEqual = (a1, a2) => {
  let b = true;
  if (a1.length !== a2.length) {
    return false;
  }
  a1.every((o, idx) => {
    if (!isDeepEqual(a1, a2[idx])) {
      return false;
    }
  });
  return true;
};

const FeedPostGlimpseCard = (postGlimpse) => {
  const {
    _id,
    medias,
    content,
    user,
    saves,
    likes,
    glimpse,
    comments,
    player,
    setPlayer,
    scrollResult,
  } = postGlimpse;
  const { state, dispatch } = useStore();
  const { auth, socket,currentStory, activity,settings } = state;

  const videoRef = useRef(null);
  const router = useRouter()
  const [videoPlay, setVideoPlay] = useState(true);
  const [videoSound, setVideoSound] = useState(settings.glimpseSound);
  useEffect(() => {
    if (videoRef.current && scrollResult) {
      const rect = videoRef?.current?.getBoundingClientRect();
      const updatedState = [
        ...player.filter((p) => p.id !== _id),
        { id: _id, top: rect.top, height: rect.height },
      ];
      if (!arraysEqual(updatedState, player)) setPlayer(updatedState);
    }
  }, [scrollResult, player]);

  useEffect(() => {
    if (videoRef.current  && scrollResult) {
      let greatestVisibleHeight = 0;
      let postGlimpseId = 0;
      player.forEach((postGlimpseScroll) => {
        const elementTop = postGlimpseScroll.top;
        const elementHeight = postGlimpseScroll.height;
        const screenHeight = window.innerHeight;
        const scrollHeight = scrollResult.scrollHeight;
        const scrollTop = scrollResult.scrollTop;
        const elementVisibleHeight =
          elementHeight -
          Math.min(
            Math.abs(Math.min(elementTop - scrollTop, 0)),
            elementHeight
          ) -
          Math.min(
            Math.max(
              elementTop + elementHeight - (scrollTop + screenHeight),
              0
            ),
            elementHeight
          );
        if (elementVisibleHeight > greatestVisibleHeight) {
          greatestVisibleHeight = elementVisibleHeight;
          postGlimpseId = postGlimpseScroll.id;
        }
      });
      if (postGlimpseId == _id && videoPlay && !Boolean(currentStory.length)) {
          videoRef.current?.play();
      } else {
        videoRef.current?.pause();
      }
    }
  }, [scrollResult?.scrollTop, player, videoRef.current, currentStory]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = !videoSound;
    }
  }, [videoSound]);
  useEffect(() => {
    if (videoPlay ) {
      videoRef.current?.play();
    }
    else {
      videoRef.current?.pause();
    }
  }, [videoPlay]);

  const handleVideoPlay = () => setVideoPlay(!videoPlay);
  const handleVideoSound = () => setVideoSound(!videoSound);

  const width = functionalTools.findAverage(
    medias.map((m) => {
      return m.width;
    })
  );
  const height = functionalTools.findAverage(
    medias.map((m) => {
      return m.height;
    })
  );
  {
  }
  const aspectRatio = width / height ;
  const isOnline = activity.includes(user._id);
  const sliderRef = useRef();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPreviousButton, setIsPreviousButton] = useState(false);
  const [isNextButton, setIsNextButton] = useState(true);

  useEffect(() => {
    if (activeIndex == medias.length - 1) {
      setIsNextButton(false);
    } else {
      setIsNextButton(true);
    }
    if (activeIndex == 0) {
      setIsPreviousButton(false);
    } else {
      setIsPreviousButton(true);
    }
  }, [activeIndex]);
  useEffect(() => {
    if (sliderRef.current) {
      sliderRef.current.slideTo(
        functionalTools.randomInt(0, medias.length - 1)
      );
    }
  }, [sliderRef.current]);

  const [likeLoading, setLikeLoading] = useState(false);
  const [likeAnimation, setLikeAnimation] = useState(false);
  const [isLike, setIsLike] = useState(false);
  const likedByFriendsList = auth.user.followings.filter((u) =>
    likes.find((l) => l._id == u._id)
  );

  const [readMoreNext, setReadMoreNext] = useState(200);

  const [isShare, setIsShare] = useState(false);
  const handleShareOpen = () => setIsShare(true);
  const handleShareClose = () => setIsShare(false);

  const [isSaved, setIsSaved] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  const [comment, setComment] = useState("");
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/${glimpse ? 'glimpse' : 'post'}/${_id}`

  useEffect(() => {
    if (likes.find((like) => like._id === auth.user._id)) {
      setIsLike(true);
    } else {
      setIsLike(false);
    }
  }, [likes, auth.user._id]);
  useEffect(() => {
    if(likeAnimation){
      setTimeout(() => {
        setLikeAnimation(false)
      }, 1000);
    }
  }, [likeAnimation])
  
  const handleLikePostGlimpse = async () => {
    if (likeLoading) return;
    setLikeLoading(true);
    setLikeAnimation(true);

    await likePostGlimpse(dispatch, { postGlimpse, auth, socket });

    setLikeLoading(false);
  };
  const handleRemoveLikePostGlimpse = async () => {
    if (likeLoading) return;
    setLikeLoading(true);

    await removeLikePostGlimpse(dispatch, { postGlimpse, auth, socket });

    setLikeLoading(false);
  };

  useEffect(() => {
    if (saves.find((userId) => userId === auth.user._id)) {
      setIsSaved(true);
    } else {
      setIsSaved(false);
    }
  }, [saves, auth.user._id]);
  const handleSavePostGlimpse = async () => {
    if (saveLoading) return;
    setSaveLoading(true);
    await savePostGlimpse(dispatch, { postGlimpse, auth, socket });
    setSaveLoading(false);
  };
  const handleRemoveSavePostGlimpse = async () => {
    if (saveLoading) return;
    setSaveLoading(true);
    await removeSavePostGlimpse(dispatch, { postGlimpse, auth, socket });
    setSaveLoading(false);
  };

  const handleDeletePostGlimpse = () => {
    if (window.confirm("Are you sure want to delete this " + (glimpse ? 'glimpse ?' :'post ?'))) {
      deletePostGlimpse(dispatch, { postGlimpse, auth });
    }
  };
  const handleCopyLink = () => {
    navigator.clipboard.writeText(url);
  };

  const handleComment = () => {
    const newComment = {
      content: comment.trim(),
      likes: [],
      user: auth.user,
      createdAt: new Date().toISOString(),
    };
    createComment(dispatch, { postGlimpse, newComment, auth, socket });
    setComment("");
  };
  return (
    <div
      key={_id}
      className="gap-4 w-full flex flex-col rounded-custom  text-text-main dark:text-text-dark py-4"
    >
      <div
        className={`fixed  z-[99999] ${
          isShare && "!opacity-100 !pointer-events-auto"
        } pointer-events-none opacity-0 transition-all inset-0 bg-black bg-opacity-50 flex justify-center items-center`}
      >
        <div className="bg-background-light min-w-[260px] p-6 rounded-lg shadow-lg relative">
          <button
            className="absolute hover:bg-background-light top-2 right-2 text-2xl p-2 bg-background-main  rounded-full"
            onClick={handleShareClose}
          >
            <HiX />
          </button>
          <h2 className="text-xl font-semibold">Share {glimpse ? ' Glimpse' : ' Post'}</h2>
          <div className="flex flex-col gap-2 p-4">
            <div>
              <TwitterIcon size={42} round={true} />
            </div>
            <div className="flex gap-2">
              <p className="mt-4">
                {url}
              </p>
              <button
                className="text-2xl hover:bg-background-light p-2 bg-background-main  rounded-full"
                onClick={handleCopyLink}
              >
                <BiCopy />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-4 items-center">
        <div className="relative">
          <div
            className={`${
              isOnline ? "border-success-main" : "border-border-outline"
            } bg-background-dark p-1 border-[3px]  absolute w-5 h-5 rounded-full bottom-0 right-0 z-20`}
          >
            <div
              className={`w-full h-full rounded-full ${
                isOnline
                  ? "bg-success-light animate-pulse"
                  : "bg-border-outline"
              }`}
            ></div>
          </div>
        <Link href={`/profile/${user.username}`}>
          <Image
            src={user.profileImage}
            alt="Profile picture"
            className="w-14 h-14 rounded-full object-cover object-center select-none"
            width={200}
            height={200}
          />
        </Link>
        </div>
        <Link href={`/profile/${user.username}`}>
          <div>
            <h6 className="font-normal text-base">{user.fullname}</h6>
            <p className="text-text-light text-sm font-light">{"@" + user.username}</p>
          </div>
        </Link>
        <div className="flex-grow" />
        <div className="text-xl xl:grid place-items-center  hover:text-text-dark cursor-pointer relative">
          <MoreHorizontal className="w-5 h-5" />
        </div>
      </div>

      <div className="flex flex-col gap-3 border border-border-outline relative rounded-md  md:max-h-[90vh] max-h-[600px]">
        {medias && medias.length > 1 ? (
          <Swiper
            onSwiper={(it) => (sliderRef.current = it)}
            modules={[Navigation, Pagination]}
            className=" object-cover overflow-hidden justify-stretch"
            style={{ width: "100%", height: "100%" }}
            onSlideChange={() => {
              if (sliderRef.current)
                setActiveIndex(sliderRef.current.activeIndex);
            }}
            scrollbar={{ draggable: true }}
          >
            {medias.map((media, index) => (
              <SwiperSlide
                className="h-full self-stretch justify-stretch object-fill  "
                style={{
                  aspectRatio,
                  objectFit: "contain",
                  minHeight: "140px",
                  width: "100%",
                }}
                key={index}
              >
                {mediaTools.isVideo(media.url) ? (
                  <video
                    style={{
                      aspectRatio,
                      objectFit: "contain",
                      objectPosition: "center",
                      width: "100%",

                    }}
                    src={media.url}
                    alt="video"
                    loop={true}
                    onClick={handleVideoPlay}
                    ref={activeIndex == index && videoRef}
                  />
                ) : (
                  <Image
                    src={media.url}
                    alt="picture"
                    height={media.height}
                    onDoubleClick={isLike ? handleRemoveLikePostGlimpse : handleLikePostGlimpse}
                    width={media.width}
                    style={{
                      aspectRatio,
                      objectFit: "cover",
                      objectPosition: "center",
                      width: "100%",
                    }}
                  />
                )}
              </SwiperSlide>
            ))}

            {isPreviousButton && (
              <div
                className="bg-background-light text-text-dark p-1.5  flex justify-center rounded-full border-2 border-border-outline/20 items-center cursor-pointer top-[50%] absolute z-[60] left-[25px] h-[42px] w-[42px] translate-y-[-50%]"
                onClick={() => sliderRef.current?.slidePrev()}
              >
                <ChevronLeft className="w-8 h-8" />
              </div>
            )}
            {isNextButton && (
              <div
                className="bg-background-light text-text-dark p-1.5  flex justify-center rounded-full border-2 border-border-outline/20 items-center cursor-pointer top-[50%] absolute   w-[42px] right-[25px] h-[42px] z-[60] translate-y-[-50%]"
                onClick={() => sliderRef.current?.slideNext()}
              >
                <ChevronRight className="w-8 h-8" />
              </div>
            )}
          </Swiper>
        ) : (
          medias.length > 0 &&
          (mediaTools.isVideo(medias[0].url) ? (
            <video
              style={{
                aspectRatio,
                objectFit: "contain",
                objectPosition: "center",
                minHeight: "140px",
                height: "100%",
                width: "100%",
              }}
              src={medias[0].url}
              alt="video"
              loop={true}
              ref={videoRef}
              onClick={handleVideoPlay}
              />
          
          ) : (
            <Image
              src={medias[0].url}
              onDoubleClick={isLike ? handleRemoveLikePostGlimpse : handleLikePostGlimpse}
              alt="picture"
              height={medias[0].height}
              width={medias[0].width}
              style={{ aspectRatio, minHeight: "140px" }}
              className="object-cover object-center w-full h-full"
            />
          ))
        )}
         {videoRef.current  && <div onClick={handleVideoSound} className="flex rounded-full cursor-pointer text-xl p-2 justify-center items-center bg-background-light absolute bottom-5 right-5 z-10">
          {videoSound ? <Volume2/> : <VolumeX/>}
              </div>}

              <div className={`text-red-500 text-9xl absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center transition-all ${likeAnimation ? 'animate-like' : 'scale-0 opacity-0'}`}>
                <FaHeart/>

              </div>
      </div>
      <div className="flex flex-col px-4 pb-4 gap-4 ">
        <div className="flex gap-4 items-center">
          <div className="group text-xl text-center items-center flex gap-2 rounded-xl  hover:bg-background-extralight hover:text-text-dark cursor-pointer relative">
            {isLike ? (
              <FaHeart
                onClick={handleRemoveLikePostGlimpse}
                className="w-6 h-6 text-red-600"
              />
            ) : (
              <FaRegHeart onClick={handleLikePostGlimpse} className="w-6 h-6 " />
            )}
            {likes.length != 0 && (
              <div className="text-sm mt-1">{likes.length}</div>
            )}
            <Tooltip text="Like" />
          </div>
          <Link href={`/${glimpse ? 'glimpse' : 'post'}/${_id}`}>
            <div className="group text-xl text-center items-center flex gap-2  rounded-xl cursor-pointer relative  hover:text-text-dark">
              <MessageCircle className="w-6 h-6" />
              {comments.length != 0 && (
                <div className="text-sm mt-1">{comments.length}</div>
              )}
              <Tooltip text="Comments" />
            </div>
          </Link>
          <div
            onClick={handleShareOpen}
            className="group text-xl text-center items-center flex gap-2  rounded-xl cursor-pointer relative  hover:text-text-dark"
          >
            <Share2 className="w-6 h-6" />
            <Tooltip text="Share" />
          </div>
          <Link href={`/${glimpse ? 'glimpse' : 'post'}/${_id}`}>
            <div className="group text-xl text-center items-center flex gap-2  rounded-xl cursor-pointer relative  hover:text-text-dark">
              <HiOutlineEye className="w-6 h-6" />
              <Tooltip text="View" alignment="right" />
            </div>
          </Link>
          <div className="flex-grow" />
          {auth.user._id== user._id && (
            <div
              onClick={handleDeletePostGlimpse}
              className="group text-xl text-center items-center flex gap-2  rounded-xl cursor-pointer relative  hover:text-text-dark"
            >
              <RiDeleteBin5Line className="w-6 h-6" />
              <Tooltip text="Delete" alignment='bottom' />
            </div>
          )}
          {auth.user._id === user._id && (
            <Link href={`/edit/${glimpse ? 'glimpse' : 'post'}/${_id}`}>
              <div className="group text-xl text-center items-center flex gap-2  rounded-xl cursor-pointer relative  hover:text-text-dark">
                <Edit className="w-6 h-6" />
                <Tooltip text="Edit" />
              </div>
            </Link>
          )}
          <div className="group text-xl text-center items-center flex gap-2  rounded-xl cursor-pointer relative  hover:text-text-dark">
            {isSaved ? (
              <TbBookmarkFilled
                onClick={handleRemoveSavePostGlimpse}
                className="w-8 h-8 text-primary-main"
              />
            ) : (
              <TbBookmarkPlus onClick={handleSavePostGlimpse} className="w-8 h-8" />
            )}
            <Tooltip text="Bookmark" alignment="left" />
          </div>
        </div>
        {likedByFriendsList.length > 0 && (
          <div className="flex gap-2 items-center">
            <div className="flex -space-x-3">
              {likedByFriendsList.slice(0, 3).map((user, i) => (
                <Image
                  className="w-8 h-8 border-2 border-border-outline  rounded-full "
                  src={user.profileImage}
                  width={100}
                  key={user._id}
                  height={100}
                />
              ))}
            </div>
            <div className="text-sm text-text-light ">
              {"Liked by "}
              {likedByFriendsList[0] && (
                <Link href="/">
                  <span className="text-text-dark font-semibold">
                    {likedByFriendsList[0].username}
                  </span>
                </Link>
              )}
              {likedByFriendsList.length == 2 && " and "}
              {likedByFriendsList[1] && (
                <Link href="/">
                  <span className="text-text-dark font-semibold">
                    {likedByFriendsList[1].username}
                  </span>
                </Link>
              )}
              {likedByFriendsList.length > 2 && " and "}
              {likedByFriendsList.length > 2 && (
                <span className="text-text-dark font-semibold">
                  {likedByFriendsList.length - 2}
                  {" others"}{" "}
                </span>
              )}
            </div>
          </div>
        )}
        {content && (
          <div className="whitespace-pre-line">
            {sentenceTools.slice(content, readMoreNext)}
            {readMoreNext < content.length && (
              <span
                onClick={() => setReadMoreNext(readMoreNext + 1000)}
                className="font-semibold uppercase text-text-main hover:text-text-dark cursor-pointer"
              >
                Read More
              </span>
            )}
          </div>
        )}
        <div className="flex flex-col gap-3">
          {comments.length > 0 && (
            <div className="flex flex-col">
              {comments
                .slice(comments.length - 2, comments.length + 1)
                .map((c, i) => (
                  <div key={i} className="text-text-light text-sm">
                    <Link href={`/profile/${c.user.username}`}>
                      <span className="text-text-main">{c.user.username}</span>
                    </Link>{" "}
                    {c.content}
                  </div>
                ))}
              {comments.length > 3 && (
                <Link href={`/${glimpse ? 'glimpse' : 'post'}/${_id}`}>
                  <div className="text-text-main mt-2 text-sm hover:text-text-dark cursor-pointer ">
                    View all {comments.length} comments
                  </div>
                </Link>
              )}
            </div>
          )}
          <div className="flex gap-2">
            <input
              name="comment"
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write a comment..."
              className="p-1 w-full flex-grow h-full placeholder:text-text-light border-b-[1px] border-border-outline bg-transparent !outline-none !ring-0 resize-none"
            />
            <button
              disabled={!comment}
              onClick={handleComment}
              className="font-semibold rounded-custom flex items-center text-white justify-center disabled:pointer-events-none disabled:text-text-light disabled:bg-background-extralight px-4 capitalize bg-primary-main hover:bg-primary-dark"
            >
              <PaperAirplaneIcon className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedPostGlimpseCard;
