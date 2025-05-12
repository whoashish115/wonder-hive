import React, { useEffect, useState, useRef } from "react";
import useStore from "@/hooks/useStore";
import {
  deletePostGlimpse,
  getDetailedGlimpse,
  getExploreGlimpses,
  likePostGlimpse,
  removeLikePostGlimpse,
  removeSavePostGlimpse,
  savePostGlimpse,
} from "@/store/actions/postGlimpseActions";
import Link from "next/link";
import {
  ChevronDown,
  ChevronUp,
  Heart,
  MessageCircle,
  MoreHorizontal,
  Pause,
  Play,
  Share2,
  Volume2,
  VolumeX,
} from "react-feather";
import { HiUserAdd, HiX } from "react-icons/hi";
import { useRouter } from "next/router";
import GLOBAL_TYPES from "@/store/types/globalTypes";
import Image from "next/image";
import Preloader from "../customs/Preloader";
import { functionalTools } from "@/utils/tools";
import PostGlimpseCardPageComments from "./PostGlimpsePageCommon";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { createComment } from "@/store/actions/commentActions";
import { EmailIcon, EmailShareButton, FacebookIcon, FacebookShareButton, InstapaperIcon, InstapaperShareButton, LinkedinIcon, LinkedinShareButton, PinterestIcon, PinterestShareButton, RedditIcon, RedditShareButton, TelegramIcon, TelegramShareButton, TwitterIcon, TwitterShareButton, WhatsappIcon, WhatsappShareButton } from "react-share";
import { BiBookContent, BiCopy, BiCopyAlt, BiParagraph } from "react-icons/bi";
import { TbBookmarkFilled, TbBookmarkPlus } from "react-icons/tb";
import { GrArticle } from "react-icons/gr";
import SmallFollow from "./SmallFollow";
import { MdArticle, MdOutlineArticle } from "react-icons/md";
import Tooltip from "../customs/Tooltip";

const Glimpse = (props) => {
  const { glimpse } = props;
  const { state, dispatch } = useStore();
  const { settings, auth, socket } = state;
  const { _id, medias, content, user, saves, likes, comments } = glimpse;
  const [isMute, setIsMute] = useState(settings.glimpseSound);
  const media = medias[0];
  const router = useRouter();
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(true);
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
  const videoRef = useRef(null);
  const togglePlay = () => {
    if (isPlaying) {
      videoRef.current?.pause();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      videoRef.current?.play();
    }
  };
  const toggleSound = () => {
    if (videoRef.current) {
      if (isMute) {
        dispatch({ type: GLOBAL_TYPES.SETTINGS_GLIMPSE_SOUND, payload: false });
        videoRef.current.muted = false;
        setIsMute(false);
      } else {
        dispatch({ type: GLOBAL_TYPES.SETTINGS_GLIMPSE_SOUND, payload: true });
        videoRef.current.muted = true;
        setIsMute(true);
      }
    }
  };

  useEffect(() => {
    setIsMute(settings.glimpseSound);
  }, [settings.glimpseSound]);
  useEffect(() => {
    videoRef.current?.addEventListener("loadeddata", function () {
      setLoading(false);
    });
  }, [settings.glimpseSound]);

  useEffect(() => {
    if (videoRef.current) {
      if (router.query.id == _id) {
        videoRef.current?.play();
        setIsPlaying(true);
      } else {
        videoRef.current?.pause();
        setIsPlaying(false);
      }
    }

    return () => {};
  }, [router.query.id, videoRef.current]);

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
  const [contentModal, setContentModal] = useState(false);
  const [commentModal, setCommentModal] = useState(false);
  const handleCommentModal = () => setCommentModal(!commentModal);
  const handleContentModal = () => setContentModal(!contentModal);

  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/glimpse/${_id}`;

  useEffect(() => {
    if (likes.find((like) => like._id === auth.user._id)) {
      setIsLike(true);
    } else {
      setIsLike(false);
    }
  }, [likes, auth.user._id]);
  const handleLikeGlimpse = async () => {
    if (likeLoading) return;
    setLikeLoading(true);

    await likePostGlimpse(dispatch, { postGlimpse: glimpse, auth, socket });

    setLikeLoading(false);
  };
  const handleRemoveLikeGlimpse = async () => {
    if (likeLoading) return;
    setLikeLoading(true);

    await removeLikePostGlimpse(dispatch, {
      postGlimpse: glimpse,
      auth,
      socket,
    });

    setLikeLoading(false);
  };

  useEffect(() => {
    if (saves.find((userId) => userId === auth.user._id)) {
      setIsSaved(true);
    } else {
      setIsSaved(false);
    }
  }, [saves, auth.user._id]);
  const handleSaveGlimpse = async () => {
    if (saveLoading) return;
    setSaveLoading(true);
    await savePostGlimpse(dispatch, { postGlimpse: glimpse, auth, socket });
    setSaveLoading(false);
  };
  const handleRemoveSaveGlimpse = async () => {
    if (saveLoading) return;
    setSaveLoading(true);
    await removeSavePostGlimpse(dispatch, {
      postGlimpse: glimpse,
      auth,
      socket,
    });
    setSaveLoading(false);
  };

  const handleDeleteGlimpse = () => {
    if (window.confirm("Are you sure want to delete this post ")) {
      deletePostGlimpse(dispatch, { postGlimpse: glimpse, auth });
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
    createComment(dispatch, { postGlimpse: glimpse, newComment, auth, socket });
  };
  return (
    <div className="flex h-full flex-grow justify-center ">
      <div className="flex gap-4 h-full ">
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
        <div
          style={{ aspectRatio }}
          className="relative h-full  flex-shrink-0  border border-border-outline/50 rounded-xl bg-background-main"
        >
          <video
            className="w-full object-cover object-center abolute top-0 left-0 right-0 bottom-0 h-full rounded-xl bg-background-main select-none"
            onClick={togglePlay}
            ref={videoRef}
            src={media.url}
            muted={isMute}
            loop
            style={{
              aspectRatio,
              objectFit: "cover",
              objectPosition: "center",
              width: "100%",
            }}
          />
          {loading && <Preloader />}
          <div
          className={` ${
            !commentModal && "!scale-x-0 !opacity-0 !w-0 !pointer-events-none "
          } overflow-x-hidden flex md:hidden absolute top-[-2px] left-[-2px] right-[-2px] bottom-[-2px] scale-x-1 opacity-1 origin-left z-50 transition-all flex-grow h-[calc(100%+4px)]  flex-col bg-background-main rounded-custom`}
        >
          <div className=" font-semibold flex-grow-0 text-lg flex sticky top-0 bg-background-light items-center px-4 py-2">
            <div className="flex-grow">
              <div>{`All Comments (${comments.length})`}</div>
            </div>
            <div>
              <div
                onClick={handleCommentModal}
                className="text-xl place-items-center p-3 bg-background-light hover:bg-background-extralight rounded-full cursor-pointer relative"
              >
                <HiX />
              </div>
            </div>
          </div>
          <div className="overflow-auto  px-4 py-2">
            <form className="flex gap-2 pb-4" onSubmit={handleComment}>
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
            <PostGlimpseCardPageComments {...glimpse} />
          </div>
        </div>
        <div
          className={` ${
            !contentModal && "!scale-x-0 !opacity-0 !w-0 !pointer-events-none "
        } overflow-x-hidden flex md:hidden absolute top-[-2px] left-[-2px] right-[-2px] bottom-[-2px] scale-x-1 opacity-1 origin-left z-50 transition-all flex-grow h-[calc(100%+4px)]  flex-col bg-background-main rounded-custom`}

        >
            <div className=" font-semibold flex-grow-0 gap-4 text-lg flex sticky top-0 bg-background-light items-center px-4 py-2">
            <div className="flex-grow">
              <div>{`Content`}</div>
            </div>
            <div>
              <div
                onClick={handleContentModal}
                className="text-xl place-items-center p-3 bg-background-light hover:bg-background-extralight rounded-full cursor-pointer relative"
              >
                <HiX />
              </div>
            </div>
          </div>
          <div className="flex-grow-0 text-lg flex sticky top-0 items-center px-4 py-2">
          {content ? content : <span className="text-text-light text-sm">No Content</span>}
        </div>
        </div>
          
          <div className="absolute flex items-center space-x-4 rounded-t-lg top-0 p-4 w-full h-auto left-0 right-0">
            <div
              onClick={togglePlay}
              className="text-xl place-items-center p-2 text-white rounded-xl cursor-pointer relative"
            >
              {isPlaying ? <Pause /> : <Play />}
            </div>
            <div className="flex-grow" />
            <div
              onClick={toggleSound}
              className="text-2xl place-items-center p-2 text-white rounded-xl cursor-pointer relative"
            >
              {isMute ? <VolumeX /> : <Volume2 />}
            </div>
          </div>
          <div className="absolute items-center rounded-b-lg space-y-4 bottom-0 p-4 w-full h-auto left-0 right-0">
            <div className="flex items-center gap-3">
            <Link href={`/profile/${user.username}`}>
              <Image
                src={user.profileImage}
                width={100}
                height={100}
                alt="Profile picture"
                className="w-12 h-12 rounded-full object-cover object-center"
              />
            </Link>

              <div>
            <Link href={`/profile/${user.username}`}>
                <h6 className="font-semibold text-sm text-white">
                  {user.fullname}
                </h6>
            </Link>
            <Link href={`/profile/${user.username}`}>
                <p className="text-white/60 text-xs ">{"@" + user.username}</p>
            </Link>
              </div>
              <div className="flex-grow" />
              <div>
                <SmallFollow user={user} />
              </div>
            </div>
          </div>
        </div>
        <div className="gap-4 flex-col flex">
          <div className="gap-2 flex items-center text-center">
            <div
              onClick={isLike ? handleRemoveLikeGlimpse : handleLikeGlimpse}
              className="text-xl place-items-center p-3 bg-background-light hover:bg-background-extralight text-red-500 rounded-full cursor-pointer relative"
            >
              {isLike ? (
                <FaHeart className="w-6 h-6 text-red-600" />
              ) : (
                <FaRegHeart className="w-6 h-6 " />
              )}
            </div>
            <p className="text-text-light">{likes.length}</p>
          </div>
          <div
            onClick={handleCommentModal}
            className="gap-2 flex items-center text-center"
          >
            <div className="text-xl place-items-center p-3 bg-background-light hover:bg-background-extralight rounded-full cursor-pointer relative">
              <MessageCircle />
            </div>
            <p className="text-text-light">{comments.length}</p>
          </div>
          <div
            onClick={handleContentModal}
            className="gap-2 flex items-center text-center"
          >
            <div className="text-2xl place-items-center p-3 bg-background-light hover:bg-background-extralight rounded-full cursor-pointer relative">
              <MdOutlineArticle />
            </div>
          </div>
          <div className="gap-2 flex items-center text-center">
            <div
              onClick={isSaved ? handleRemoveSaveGlimpse : handleSaveGlimpse}
              className="text-3xl place-items-center p-3 bg-background-light hover:bg-background-extralight  rounded-full cursor-pointer relative"
            >
              {isSaved ? <TbBookmarkFilled /> : <TbBookmarkPlus />}
            </div>
          </div>
          <div className="gap-2 flex items-center text-center">
            <div onClick={handleShareOpen} className="text-xl place-items-center p-3 bg-background-light hover:bg-background-extralight rounded-full cursor-pointer relative">
              <Share2 />
            </div>
          </div>
          <div className="flex-grow" />
          <div className="gap-2 flex items-center text-center">
            <div className="text-xl place-items-center p-3 bg-background-light hover:bg-background-extralight rounded-full cursor-pointer relative">
              <MoreHorizontal />
            </div>
          </div>
        </div>
        <div
          className={` ${
            !commentModal && "!scale-x-0 !opacity-0 !w-0 !pointer-events-none "
          } overflow-x-hidden md:flex hidden scale-x-1 opacity-1 origin-left relative transition-all flex-grow  h-full  flex-col bg-background-main rounded-custom`}
        >
          <div className=" font-semibold flex-grow-0 text-lg flex sticky top-0 bg-background-light items-center px-4 py-2">
            <div className="flex-grow">
              <div>{`All Comments (${comments.length})`}</div>
            </div>
            <div>
              <div
                onClick={handleCommentModal}
                className="text-xl place-items-center p-3 bg-background-light hover:bg-background-extralight rounded-full cursor-pointer relative"
              >
                <HiX />
              </div>
            </div>
          </div>
          <div className="overflow-auto  px-4 py-2">
            <form className="flex gap-2 pb-4" onSubmit={handleComment}>
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
            <PostGlimpseCardPageComments {...glimpse} />
          </div>
        </div>
        <div
          className={` ${
            !contentModal && "!scale-x-0 !opacity-0 !w-0 !pointer-events-none "
          } overflow-x-hidden scale-x-1 md:flex hidden relative opacity-1 origin-left  transition-all flex-grow  h-full flex-col bg-background-main rounded-custom`}
        >
            <div className=" font-semibold   gap-4 flex-grow-0 text-lg flex sticky top-0 bg-background-light items-center px-4 py-2">
            <div className="flex-grow">
              <div>{`Content`}</div>
            </div>
            <div>
              <div
                onClick={handleContentModal}
                className="text-xl place-items-center p-3 bg-background-light hover:bg-background-extralight rounded-full cursor-pointer relative"
              >
                <HiX />
              </div>
            </div>
          </div>
          <div className="flex-grow-0 text-sm flex sticky top-0 bg-background-light items-center px-4 py-2">
          {content ? content : <span className="text-text-light text-sm">No Content</span>}
        </div>
        </div>
      </div>
    </div>
  );
};

const ExploreGlimpsesPage = () => {
  const { state, dispatch } = useStore();
  const { postGlimpse, auth } = state;
  const { detailedPostsGlimpses, exploreGlimpses } = postGlimpse;

  const router = useRouter();
  const { id } = router.query;

  const [glimpses, setGlimpses] = useState([]);
  useEffect(() => {
    let currentId = id;
    let currentIndex = 0;
    let lastScrollTop = 0;
    const container = document.getElementById("glimpses-container");
    const handlePrevious = () => {
      let newId = glimpses[currentIndex + 1];
      router.push(`/glimpse/${newId}`);
      currentId = newId;
      currentIndex = currentIndex + 1;
    };
    const handleNext = () => {
      let newId = glimpses[currentIndex - 1];
      router.push(`/glimpse/${newId}`);
      currentId = newId;
      currentIndex = currentIndex - 1;
    };
    const handleKeyDown = (e) => {
      const element = document.getElementById("glimpses-container");
      if (element) {
        const key = e.key;
        switch (key) {
          case "ArrowUp":
            let previousIndex = Math.floor(
              Math.floor(element.scrollTop + 1 - element.clientHeight) /
                element.clientHeight
            );
            if (previousIndex !== currentIndex) {
              if (glimpses[0] !== currentId) {
                element.scrollTo({
                  top: element.scrollTop - element.clientHeight,
                  behavior: "smooth",
                });
              }
            }
            break;
          case "ArrowDown":
            let nextIndex = Math.floor(
              Math.floor(element.scrollTop + 1 + element.clientHeight) /
                element.clientHeight
            );
            if (nextIndex !== currentIndex) {
              if (currentIndex !== glimpses.length - 1) {
                element.scrollTo({
                  top: element.scrollTop + 1 + element.clientHeight,
                  behavior: "smooth",
                });
              }
            }
            break;
        }
      }
    };
    const handleScroll = () => {
      const element = document.getElementById("glimpses-container");
      let newIndex = Math.floor(
        Math.floor(element.scrollTop + 1) / element.clientHeight
      );
      if (newIndex !== currentIndex) {
        if (element.scrollTop < lastScrollTop) {
          if (glimpses[0] !== currentId) {
            handleNext();
          }
        } else if (element.scrollTop > lastScrollTop) {
          if (currentIndex !== glimpses.length - 1) {
            handlePrevious();
          }
        }
      }
      lastScrollTop = element.scrollTop;
    };
    container?.addEventListener("scroll", handleScroll);
    document?.body?.addEventListener("keydown", handleKeyDown);
    return () => {
      container?.removeEventListener("scroll", handleScroll);
      document?.body?.removeEventListener("keydown", handleKeyDown);
    };
  }, [glimpses]);

  useEffect(() => {
    if (!exploreGlimpses.firstLoad) {
      getExploreGlimpses(dispatch, auth.token);
    }
  }, [exploreGlimpses.firstLoad]);

  useEffect(() => {
    if (!id) {
      if (exploreGlimpses.data.length > 0) {
        router.push("/glimpse/" + exploreGlimpses.data[0]);
      }
    }
  }, [exploreGlimpses.data, id]);

  useEffect(() => {
    if (id && glimpses.length == 0) {
      getDetailedGlimpse(dispatch, { detailedPostsGlimpses, id, auth });
      if (detailedPostsGlimpses[id]) {
        setGlimpses([id]);
      }
    }
  }, [detailedPostsGlimpses[id]]);

  useEffect(() => {
    if (id && glimpses.length == 1) {
      if (exploreGlimpses.data.length > 0) {
        if (
          exploreGlimpses.data.filter(
            (eGlimpseId) => !glimpses.includes(eGlimpseId)
          ).length > 0
        )
          setGlimpses([
            ...glimpses,
            ...exploreGlimpses.data.filter((myId) => myId !== id),
          ]);
      }
    }
  }, [exploreGlimpses.data, id, glimpses]);
  const handleScrollDown = () => {
    document?.body?.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "ArrowDown",
      })
    );
  };
  const handleScrollUp = () => {
    document?.body?.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "ArrowUp",
      })
    );
  };
  return exploreGlimpses.loading ? (
    <Preloader />
  ) : (
    glimpses.length !== 0 && (
      <div className="w-full  justify-center items-center my-[-12px] flex relative">
        <div
          id="glimpses-container"
          className="overflow-auto snap-y w-full max-w-[calc(100vw-12px)]   h-[calc(100vh-86px)]  justify-center snap-mandatory scrollbar-hidden"
        >
          {glimpses.map((id, index) => (
            <div
              key={index}
              className="snap-start py-3 flex items-center h-[calc(100vh-74px)] justify-center "
            >
              <Glimpse glimpse={detailedPostsGlimpses[id]} />
            </div>
          ))}
        </div>
        {/* <div className=" absolute right-0 bottom-0 gap-4 hidden md:flex flex-col h-full justify-between">
          <div
            className={`text-xl   place-items-center p-3  bg-background-light hover:bg-background-extralight rounded-full cursor-pointer transition-transform ${ glimpses[0] !== router.query.id ? 'scale-1' : 'scale-0'}`}
            onClick={handleScrollUp}
            >
            <ChevronUp />
          </div>
          <div
            className={`text-xl place-items-center p-3  bg-background-light hover:bg-background-extralight rounded-full cursor-pointer transition-transform ${ glimpses[glimpses.length-1] !== router.query.id ? 'scale-1' : 'scale-0'}`}
            onClick={handleScrollDown}
          >
            <ChevronDown />
          </div>
        </div> */}
      </div>
    )
  );
};

export default ExploreGlimpsesPage;
