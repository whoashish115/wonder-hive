import {  getDetailedGlimpse, getDetailedPost, getDetailedPostGlimpse } from "@/store/actions/postGlimpseActions";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  MoreHorizontal,
  Share2,
} from "react-feather";
import { RiDeleteBin5Line } from "react-icons/ri";
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
import {
  FaChevronDown,
  FaChevronUp,
  FaEdit,
  FaHeart,
  FaRegHeart,
  FaReply,
} from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { functionalTools, mediaTools, sentenceTools } from "@/utils/tools";
import { Navigation, Pagination } from "swiper/modules";
import { TbBookmarkFilled, TbBookmarkPlus } from "react-icons/tb";
import {
  createComment,
} from "@/store/actions/commentActions";
import { HiX } from "react-icons/hi";
import { EmailIcon, EmailShareButton, FacebookIcon, FacebookShareButton, InstapaperIcon, InstapaperShareButton, LinkedinIcon, LinkedinShareButton, PinterestIcon, PinterestShareButton, RedditIcon, RedditShareButton, TelegramIcon, TelegramShareButton, TwitterIcon, TwitterShareButton, WhatsappIcon, WhatsappShareButton } from "react-share";
import { BiBookContent, BiCopy, BiCopyAlt, BiParagraph } from "react-icons/bi";
import Image from "next/image";
import Preloader from "../customs/Preloader";
import PostGlimpseCardPageComments from "./PostGlimpsePageCommon";



const PostCardPage = (post) => {
  const { _id, medias, content, user,saves, likes, comments } = post;
  const { state, dispatch } = useStore();
  const { auth, socket,  } = state;
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
  const aspectRatio = width / height;

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

  const [copied, setCopied] = useState(false);
  const [isShare, setIsShare] = useState(false);
  const handleShareOpen = () => setIsShare(true);
  const handleShareClose = () => setIsShare(false);

  const [likeLoading, setLikeLoading] = useState(false);
  const [isLike, setIsLike] = useState(false);

  const [isSaved, setIsSaved] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [inputComment, setInputComment] = useState("");
  const [readMoreNext, setReadMoreNext] = useState(200);

  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/post/${_id}`

  useEffect(() => {
    if (likes.find((like) => like._id === auth.user._id)) {
      setIsLike(true);
    } else {
      setIsLike(false);
    }
  }, [likes, auth.user._id]);
  const handleLikePost = async () => {
    if (likeLoading) return;
    setLikeLoading(true);

    await likePostGlimpse(dispatch, {  postGlimpse:post, auth, socket });

    setLikeLoading(false);
  };
  const handleRemoveLikePost = async () => {
    if (likeLoading) return;
    setLikeLoading(true);

    await removeLikePostGlimpse(dispatch, {   postGlimpse:post, auth, socket });

    setLikeLoading(false);
  };

  useEffect(() => {
    if (saves.find((userId) => userId === auth.user._id)) {
      setIsSaved(true);
    } else {
      setIsSaved(false);
    }
  }, [saves, auth.user._id]);
  const handleSavePost= async () => {
    if (saveLoading) return;
    setSaveLoading(true);
    await savePostGlimpse(dispatch, {   postGlimpse:post, auth, socket });
    setSaveLoading(false);
  };
  const handleRemoveSavePost = async () => {
    if (saveLoading) return;
    setSaveLoading(true);
    await removeSavePostGlimpse(dispatch, {   postGlimpse:post, auth, socket });
    setSaveLoading(false);
  };

  const handleDeletePost = () => {
    if (window.confirm("Are you sure want to delete this post ")) {
      deletePostGlimpse(dispatch, {   postGlimpse:post, auth });
    }
  };
  const handleCopyLink = () => {
    navigator.clipboard.writeText(url);
    setCopied(true)
    setTimeout(() => {
      setCopied(false)
    }, 1000);
  };

  const handleComment = (e) => {
    e.preventDefault();
    if (!inputComment.trim()) return;
    const newComment = {
      content: inputComment,
      likes: [],
      user: auth.user,
      createdAt: new Date().toISOString(),
      reply: null,
      tag: null,
    };
    setInputComment("");
    createComment(dispatch, { postGlimpse:post, newComment, auth, socket });
  };
  return (
    <div className="p-4 gap-4 mb-4 w-full grid md:grid-cols-2 flex-grow md:flex-row  rounded-custom bg-background-light text-text-main dark:text-text-dark">
      <div
        className={`fixed  z-[9999999999999999999] ${isShare && "!opacity-100 !pointer-events-auto"
          } pointer-events-none opacity-0 transition-all inset-0 bg-black bg-opacity-40 flex justify-center items-center`}
      >
        <div className="bg-background-light m-6 min-w-[260px] p-6 rounded-lg shadow-lg relative">
          <button
            className="absolute hover:bg-background-light top-2 right-2 text-2xl p-2 bg-background-main  rounded-full"
            onClick={handleShareClose}
          >
            <HiX />
          </button>
          <h2 className="text-xl font-semibold mb-3">Share </h2>
          <div className="flex flex-col items-center pt-3 gap-4">
            <div className="flex flex-wrap gap-3 px-3">
              <div>
                <TwitterShareButton url={url}>
                  <TwitterIcon size={50} round={true} />
                </TwitterShareButton>
              </div>
              <div>
                <InstapaperShareButton url={url}>
                  <InstapaperIcon size={50} round={true} />
                </InstapaperShareButton>
              </div>
              <div>
                <LinkedinShareButton url={url}>
                  <LinkedinIcon size={50} round={true} />
                </LinkedinShareButton>
              </div>
              <div>
                <WhatsappShareButton url={url}>
                  <WhatsappIcon size={50} round={true} />
                </WhatsappShareButton>
              </div>
              <div>
                <PinterestShareButton url={url}>
                  <PinterestIcon size={50} round={true} />
                </PinterestShareButton>
              </div>
              <div>
                <EmailShareButton url={url}>
                  <EmailIcon size={50} round={true} />
                </EmailShareButton>
              </div>
              <div>
                <RedditShareButton url={url}>
                  <RedditIcon size={50} round={true} />
                </RedditShareButton>
              </div>
              <div>
                <FacebookShareButton url={url}>
                  <FacebookIcon size={50} round={true} />
                </FacebookShareButton>
              </div>
              <div>
                <TelegramShareButton url={url}>
                  <TelegramIcon size={50} round={true} />
                </TelegramShareButton>
              </div>
              <div className="group text-xl text-center xl:grid place-items-center rounded-xl text-text-light hover:text-text-dark cursor-pointer relative">
                  <button
                   onClick={handleCopyLink}
                    className="text-3xl p-3  text-text-light bg-background-extralight border border-border-outline hover:text-text-dark m-2 rounded-full"

                  >
                    {copied ? <BiCopyAlt /> : <BiCopy />}
                  </button>
                  <Tooltip  text={copied ? 'Copied' : 'Copy'} />
                </div>

            </div>
          </div>
        </div>
      </div>
      <div className="w-full flex-shrink-1 flex-grow-0 flex flex-col gap-4 ">
        <div className="flex  gap-4 items-center w-full">
        <Link href={`/profile/${user.username}`}>
          <Image
            src={user.profileImage}
            alt="Profile picture"
            className="w-14 h-14  flex-shrink-0 rounded-full object-cover object-center select-none"
            width={200}
            height={200}
          />
        </Link>
        <Link href={`/profile/${user.username}`}>
          <div className="flex-grow w-full">
            <h6 className="font-normal text-base">{user.fullname}</h6>
            <p className="text-text-light text-sm font-light">{"@" + user.username}</p>
          </div>
        </Link>
        <div className="flex-grow" />
        <div className="text-xl xl:grid place-items-center  hover:text-text-dark cursor-pointer relative">
          <MoreHorizontal className="w-5 h-5" />
        </div>
        </div>
        <div className="flex flex-grow-0 gap-3 w-full  md:max-h-[90vh] max-h-[600px]">
          {medias && medias.length > 1 ? (
            <Swiper
              onSwiper={(it) => (sliderRef.current = it)}
              modules={[Navigation, Pagination]}
              className=" object-cover justify-stretch rounded-custom overflow-hidden"
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
                      controls={true}
                      src={media.url}
                      alt="video"
                      autoPlay={activeIndex == index && true}
                      loop={true}
                      className="rounded-custom"
                    />
                  ) : (
                    <Image
                      src={media.url}
                      alt="picture"
                      height={media.height}
                      width={media.width}
                      style={{
                        aspectRatio,
                        objectFit: "cover",
                        objectPosition: "center",
                        width: "100%",
                      }}
                      className="rounded-custom"
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
                controls={true}
                src={medias[0].url}
                autoPlay={true}
                className="rounded-custom"
                loop={true}
                alt="video"
              />
            ) : (
              <Image
                src={medias[0].url}
                alt="picture"
                height={medias[0].height}
                width={medias[0].width}
                style={{ aspectRatio, minHeight: "140px" }}
                className="rounded-custom object-cover object-center w-full h-full"
              />
            ))
          )}
        </div>
        {content && <div className="whitespace-pre-line">
          {sentenceTools.slice(content, readMoreNext)}
          {readMoreNext < content.length && <span onClick={()=>setReadMoreNext(readMoreNext+1000)} className="font-semibold uppercase text-text-main hover:text-text-dark cursor-pointer">Read More</span>}
        </div>}
      </div>
      <div className="flex flex-col w-full flex-shrink-1 flex-grow-0 px-2 pt-2 gap-6">
        <div className="flex flex-col px-2 pt-2 gap-6">
          <div className="flex gap-4 items-start">
            <div className="group text-xl text-center xl:grid place-items-center rounded-xl text-text-light hover:text-text-dark cursor-pointer relative">
              {isLike ? (
                <FaHeart
                  onClick={handleRemoveLikePost}
                  className="w-6 h-6 text-red-600"
                />
              ) : (
                <FaRegHeart onClick={handleLikePost} className="w-6 h-6 " />
              )}
              {likes.length != 0 && (
                <div className="text-sm mt-1">{likes.length}</div>
              )}
              <Tooltip text="Like" />
            </div>
            <div className="group text-xl text-center xl:grid place-items-center  rounded-xl cursor-pointer relative text-text-light hover:text-text-dark">
              <MessageCircle className="w-6 h-6" />
              {comments.length != 0 && (
                <div className="text-sm mt-1">{comments.length}</div>
              )}
              <Tooltip text="Comments" />
            </div>
            <div
              onClick={handleShareOpen}
              className="group text-xl text-center xl:grid place-items-center  rounded-xl cursor-pointer relative text-text-light hover:text-text-dark"
            >
              <Share2 className="w-6 h-6" />
              <Tooltip text="Share" />
            </div>
            {auth.user._id == user._id && (
              <div
                onClick={handleDeletePost}
                className="group text-xl text-center xl:grid place-items-center  rounded-xl cursor-pointer relative text-text-light hover:text-text-dark"
              >
                <RiDeleteBin5Line className="w-6 h-6" />
                <Tooltip text="Delete" />
              </div>
            )}
            <div className="flex-grow" />
            <div className="group text-xl text-center xl:grid place-items-center  rounded-xl cursor-pointer relative text-text-light hover:text-text-dark">
              {isSaved ? (
                <TbBookmarkFilled
                  onClick={handleRemoveSavePost}
                  className="w-8 h-8 text-primary-main"
                />
              ) : (
                <TbBookmarkPlus onClick={handleSavePost} className="w-8 h-8" />
              )}
              <Tooltip text="Bookmark" alignment="left" />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2 h-full">
      
          <div className="h-full gap-4 flex flex-col py-4">
            <div className=" font-semibold text-lg">{`All Comments (${comments.length})`}</div>
            <form className="flex gap-2" onSubmit={handleComment}>
              <textarea
                name="comment"
                id="comment"
                rows={2}
                value={inputComment}
                onChange={(e) => setInputComment(e.target.value)}
                placeholder="Write a comment..."
                className="!p-2 w-full  text-sm rounded-custom resize-y flex-grow h-full !shadow-none focus:!ring-offset-[0px]  focus:!ring-0 placeholder:text-text-light border-b-[1px] border-border-outline bg-transparent !outline-none !ring-0 "
              />
              <div>
              <div>
              <button
                disabled={!inputComment}
                type="submit"
                className="rounded-custom flex  items-center text-sm text-white justify-center disabled:pointer-events-none disabled:text-text-light disabled:bg-background-extralight px-4 py-2 capitalize bg-primary-main hover:bg-primary-dark"
                >
                Comment
              </button>
                </div>
                </div>
            </form>
            <div className="flex-grow overflow-auto ">
              <PostGlimpseCardPageComments {...post} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const User = () => {
  const [loading, setLoading] = useState(true)
  const [post, setPost] = useState()

  const {state, dispatch} = useStore()
  const router = useRouter()
  const { id } = router.query
  const {auth} = state

  useEffect(() => {
      getDetailedPost(dispatch,{detailedPostsGlimpses: state.postGlimpse.detailedPostsGlimpses, id, auth });
    if (state.postGlimpse.detailedPostsGlimpses[id]) {
      setPost(state.postGlimpse.detailedPostsGlimpses[id]);
    }
  }, [state.postGlimpse.detailedPostsGlimpses, id, auth]);

  useEffect(() => {
    if(post){
      setLoading(false)
    }
  }, [post])
  
  return (
    <div className="w-full flex justify-center items-center lg:w-9/12 ">
      {loading ? <Preloader/>:<PostCardPage {...post} />}
    </div>
  );
};

export default User;
