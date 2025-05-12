import React, { useEffect, useRef, useState } from "react";
import {
  Lock,
  MoreVertical,
  Send,
  Smile,
  Video,
} from "react-feather";
import EmojiPicker from "emoji-picker-react";
import useStore from "@/hooks/useStore";
import { useRouter } from "next/router";
import Link from "next/link";
import {
  addMessage,
  deleteMessage,
  getMessages,
  seenMessages,
} from "@/store/actions/messageActions";
import GLOBAL_TYPES from "@/store/types/globalTypes";
import { filesUpload } from "@/utils/filesUpload";
import {
  EllipsisVerticalIcon,
  LinkIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import moment from "moment";
import Image from "next/image";
import { Pagination, Navigation } from "swiper/modules";
import { SwiperSlide, Swiper } from "swiper/react";
import { mediaTools } from "@/utils/tools";
import Preloader from "../customs/Preloader";
import { FaCheck, FaCheckDouble } from "react-icons/fa";
import { createConversation, deleteConversation } from "@/store/actions/conversationActions";
import { RiDeleteBin2Line } from "react-icons/ri";
import Loader from "../customs/Loader";
import { HiClock, HiOutlineClock, HiX } from "react-icons/hi";
import { getData } from "@/utils/fetchData";

const Chat = () => {
  const { state, dispatch } = useStore();
  const { auth, message, conversation, activity, socket } = state;
  const router = useRouter();
  const { id } = router.query;

  const chatDisplay = useRef();
  const [currentConversation, setCurrentConversation] = useState(null);
  const [info, setInfo] = useState(null);
  const [messages, setMessages] = useState([]);
  const [page, setPage] = useState(0);
  const [result, setResult] = useState(9);
  const [messageLoading, setMessageLoading] = useState(false);

  const [emojiChoose, setEmojiChoose] = useState(false);
  const [text, setText] = useState("");
  const [rows, setRows] = useState(1);
  const [medias, setMedias] = useState([]);
  const [typing, setTyping] = useState(false);

  const handleEmojiClick = (emojiData, e) => {
    let sym = emojiData.unified.split("-");
    let codesArray = [];
    sym.forEach((el) => codesArray.push("0x" + el));
    let emoji = String.fromCodePoint(...codesArray);
    setText(text + emoji);
    setEmojiChoose(false);
  };
  const handleInputImageClick = (e) => {
    e.target.value = "";
  };
  const handleLoadImage = (e) => {
    let newMedias = medias.slice();
    let index = e.currentTarget.attributes.index.value;
    let newMedia = newMedias[index];
    if (newMedia.width == 0 && newMedia.height == 0) {
      newMedia = {
        ...newMedia,
        width: e.currentTarget.naturalWidth,
        height: e.currentTarget.naturalHeight,
      };
      newMedias[index] = newMedia;
      setMedias(newMedias);
    }
  };
  const handleLoadVideo = (e) => {
    let newMedias = medias.slice();
    let index = e.currentTarget.attributes.index.value;
    let newMedia = newMedias[index];
    if (newMedia.width == 0 && newMedia.height == 0) {
      newMedia = {
        ...newMedia,
        width: e.target.videoWidth,
        height: e.target.videoHeight,
      };
      newMedias[index] = newMedia;
      setMedias(newMedias);
    }
  };
  const handleMediasChange = (e) => {
    const files = [...e.target.files];
    let error = "";
    let newMedias = [];

    files.forEach((file) => {
      if (!file) return (error = "File does not exist.");

      if (file.size > 1024 * 1024 * 50) {
        return (error = "The image/video largest is 50mb.");
      }
      return newMedias.push({ file, width: 0, height: 0 });
    });

    if (error) dispatch({ type: GLOBAL_TYPES.ALERT_ERROR, payload: error });
    setMedias([...medias, ...newMedias]);
  };
  const handleMediasDelete = (index) => {
    let newArr = medias.slice();
    newArr.splice(index, 1);
    setMedias(newArr);
  };
  const handleTextAreaKeyDown = (e) => {
    if (e.which == 13 && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
      setRows(1)
    }
  };
  const handleTextAreaChange = (e) => {
    setText(e.target.value);
    if (!e.target.value) setRows(1)
    else {
      const lines = e.target.value.split('\n').length
      if (lines > 6) setRows(6)
      else setRows(lines)
    }
  };
  useEffect(() => {
    if(text){
      setTyping(true)
      let timer = setTimeout(async ()=>setTyping(false), 1000)
      return () => clearTimeout(timer)
    }
  }, [text])
  useEffect(() => {
    if(socket.emit){
    if(typing){
      socket.emit('conversationTypingEnable', {conversation:{...currentConversation, user:auth.user},userId:auth.user._id })
    }
    else{
      socket.emit('conversationTypingDisable', {conversation:{...currentConversation, user:auth.user},userId:auth.user._id })
    }
    }
  }, [typing])
  
  useEffect(() => {
    const handleConversationLoad = async () => {
      if (conversation.firstLoad) {
        let conver;
        conver = conversation.data[id]
        if (conver) {
          if (conver.removedFrom.includes(auth.user._id)) return router.push('/message')
          setCurrentConversation(conver)
          const members = conver.members.length == 1 ? conver.members : conver.members.filter(m => m._id !== auth.user._id)
          setResult(conver.result)
          setPage(conver.page)
          if (!conver.isGroup) {
            setInfo({ picture: members[0].profileImage, title: members[0].fullname, _id: conver._id, user: { ...members[0] } })
          }
          else {
            setInfo({ picture: conver.picture, _id: conver._id, title: conver.title })
          }
        }
        else {
          const res = await getData(`/user/username/${id}`, auth.token)
          if (res.error) { dispatch({ type: GLOBAL_TYPES.ALERT_ERROR, payload: "this group or user doesn't exists" }); return router.push('/message') }
          await createConversation(dispatch, { auth, members: res.user._id == auth.user._id ? [auth.user] : [res.user, auth.user] })
        }
      }
      setMessageLoading(false)
    }
    handleConversationLoad()
  }, [id, conversation]);


  useEffect(() => {
    const handleInitialLoad = async () => {
      const res = await getMessages(dispatch, { auth, id: currentConversation._id, refId: id });
    }
    if (currentConversation && !currentConversation.firstLoad) {
      handleInitialLoad()
    }
  }, [currentConversation,])

  useEffect(() => {
    let prevPage = 0
    const handleMessagesLoader = async () => {
      if(prevPage !== page+1){
        prevPage = page+1
        await getMessages(dispatch, { auth, id: currentConversation._id, page: page + 1, refId: id });
      }
    }
    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          if (currentConversation && currentConversation.firstLoad) {
            if (result >= page * 9) {
              handleMessagesLoader()
            }
          }
        }
      },
      { threshold: 0.1 }
    );
    if (chatDisplay.current) observer.observe(chatDisplay.current);
  }, [page, result]);


  useEffect(() => {
    if (currentConversation) {
      const newData = Object.values(message).filter(m => m.conversation == currentConversation._id)
      setMessages(newData)
    }
  }, [message, currentConversation?._id])

  useEffect(() => {
    let lastMessage = messages[0]
    if (lastMessage && currentConversation && lastMessage.sender !== auth.user._id && !lastMessage.seenBy.includes(auth.user._id)) {
      seenMessages(dispatch, { conversation: currentConversation, auth, socket })
    }
  }, [id, messages, currentConversation])

  const handleSubmit = async (e) => {
    if (e) {
      e.preventDefault();
    }
    if (!text.trim() && medias.length === 0) return;
    const beforeMessage = {
      sender: auth.user._id,
      recipients: [currentConversation.isGroup ? currentConversation.members.map((m) => m._id).filter(i => i !== auth.user._id) : currentConversation.user._id],
      conversation: currentConversation._id,
      text,
      medias,
      pending: true,
      user: { _id: auth.user._id, profileImage: auth.user.profileImage, fullname: auth.user.fullname, username: auth.user.username }
    };
    setText("");
    setMedias([]);
    setMessages([beforeMessage, ...messages])

    let allMedias = [];
    let newMedia;
    for (let i = 0; i < medias.length; i++) {
      newMedia = await filesUpload([medias[i].file]);
      if (newMedia[0].url) {
        allMedias.push({
          ...newMedia[0],
          width: medias[i].width,
          height: medias[i].height,
        });
      }
    }
    const newMessage = { ...beforeMessage, medias: allMedias, pending: false, };
    await addMessage(dispatch, { message: newMessage, conversation: currentConversation, auth, socket }, id);
  };
  const handleDeleteConversation = () => {
    if (window.confirm("Do you want to delete?")) {
      deleteConversation(dispatch, { auth, conversation: currentConversation, refId: id });
      return router.push("/message");
    }
  };
  const handleDeleteMessage = (message) => {
    if (window.confirm("Do you want to delete?")) {
      deleteMessage(dispatch, { auth,message, conversation: currentConversation, socket });
    }
  };

  return (
    <div className="flex relative flex-col flex-grow bg-background-light w-full max-h-[calc(100vh-64px)] md:max-h-[calc(100vh-56px)] min-h-[500px] rounded-custom  text-text-main">
      {(messageLoading || !info) ? <Preloader /> :
        <div className="flex flex-col h-full">

          <div className="px-4 py-3 flex flex-row flex-none justify-between items-center border-b border-border-outline/30">
            <div className="flex items-center">
              <div className="w-14 h-14 mr-4 relative flex flex-shrink-0">
                {/* <Link href={`/profile/${info.username}`}> */}
                <Image
                  className="shadow-md rounded-full w-full h-full object-cover select-none"
                  src={info.picture}
                  alt="avatar"
                  width={120}
                  height={120}
                />
                {/* </Link> */}
              </div>
              <div>
                {/* <Link href={`/profile/${user.username}`}> */}
                <p className="text-base ">{info.title} </p>
                <p className="text-xs">
                  {Boolean(currentConversation.typing?.length)? (<span className="font-semibold text-primary-light">
                      {
                        currentConversation.isGroup ?
                          (<>
                            {
                            currentConversation.typing.length == 1 ?
                              `${(currentConversation.members.filter(m => m._id == currentConversation.typing[0]))[0].username} is typing...`: 
                                `${(currentConversation.members.filter(m => m._id == currentConversation.typing[0]))[0].username} and ${ currentConversation.typing.length -1} other is typing...`
                            }
                          </>)
                          : 'typing...'
                      }
                    </span>):
                    (currentConversation?.isGroup ? (currentConversation.members.filter(m => activity.includes(m._id)).length> 0 ?`${ currentConversation.members.filter(m => activity.includes(m._id)).length } online` :'') : (info.user._id==auth.user._id || activity.includes(info.user._id)
                    ? "online"
                    : moment(info.user.lastActive).fromNow()))}
                </p>
                {/* </Link> */}
              </div>
            </div>
            <div className="flex">
              <span
                onClick={handleDeleteConversation}
                className="flex text-2xl justify-center items-center cursor-pointer rounded-xl  bg-background-light w-10 h-10 p-2 ml-4"
              >
                <RiDeleteBin2Line />
              </span>
              <span className="flex justify-center text-2xl items-center cursor-pointer rounded-xl  bg-background-light w-10 h-10 p-2 ml-4">
                <EllipsisVerticalIcon />
              </span>
            </div>
          </div>

          <div
            id="messages-container"
            className="p-4 flex-col-reverse flex-1 gap-2 flex  overflow-y-auto h-full"
          >

         

            {messageLoading && <Preloader />}

            {messages.map((message) =>
             message.type=='label'?
                  <div key={message._id} className="flex flex-row justify-center cursor-default select-none">
<div className="px-4 py-1.5 text-xs  rounded-custom  text-white bg-background-extralight border border-border-outline max-w-xs lg:max-w-md">
  {message.text}
              </div>
              </div>
             :
             ( message.sender !== auth.user._id ? (
                <>
                  <div key={message._id} className="flex flex-row justify-start">
                    <div className=" text-sm  flex flex-col items-start ">
                      <div className="flex items-center flex-row group">
                      <div className="rounded-custom flex flex-col items-end  text-white  bg-background-extralight max-w-xs lg:max-w-md">
                        <div style={{wordBreak:'break-word',}} className="p-2 pb-0 whitespace-pre-wrap ">
                          {message.text}
                        </div>
                        {message.medias.length >0 &&   <div className="grid  max-w-[80%] items-end  mr-auto">
                        {message.medias.map((media,i) => (
                          (mediaTools.isVideo(media.url) ? (
                            <video
                            key={i}
                              src={media.url}
                              alt="video"
                              loop={true}
                              ref={videoRef}
                              onClick={handleVideoPlay}
                              style={{
                                aspectRatio: media.width / media.height,
                              }}
                              className="object-cover rounded-custom object-center max-w-[300px] w-full h-full"

                            />

                          ) : (
                            <Image
                              src={media.url}
                              key={i}
                              alt="picture"
                              height={media.height}
                              width={media.width}
                              style={{
                                aspectRatio: media.width / media.height,
                              }}
                              className="object-cover rounded-custom object-center max-w-[300px] w-full h-full"

                            />
                          ))
                        ))}
                      </div>}
                          <div style={{ fontSize: '10px' }} className="text-end gap-1 mt-[-5px]  z-10  px-1.5 py-0.5 rounded-custom leading-snug font-light flex justify-center items-center uppercase ">
                        {moment(message.createdAt).format("hh:mm a")}
                        <div className="bg-background-main p-1 rounded-full mr-[-50%]">
                      {message.pending ? <HiClock /> : message.recipients?.every(seenByUser => message.seenBy.includes(seenByUser)) ? <FaCheckDouble className="text-primary-main "/> : <FaCheck className="text-text-light"/>}
                      </div>
                      </div>
                        </div>
                        <button
                          onClick={()=>handleDeleteMessage(message)}
                          className="group-hover:flex hidden justify-center items-center flex-shrink-0 focus:outline-none mx-1  rounded-custom  bg-background-light border border-border-outline p-1"
                        >
                          <HiX className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div key={message._id} className="flex flex-row justify-end">
                    <div className=" text-sm  flex flex-col items-end ">
                      <div className="flex items-center flex-row-reverse group">
                     <div className="rounded-custom flex flex-col items-end  text-white bg-primary-dark max-w-xs lg:max-w-md">
                        <div style={{wordBreak:'break-word',}} className="p-2 pb-0 whitespace-pre-wrap ">
                          {message.text}
                        </div>
                        {message.medias.length >0 &&  <div className="grid  max-w-[80%] items-end  ml-auto">
                        {message.medias.map((media,i) => (
                          (mediaTools.isVideo(media.url) ? (
                            <video
                              src={message.pending ? URL.createObjectURL(media.file) : media.url}
                              alt="video"
                              loop={true}
                              key={i}
                              ref={videoRef}
                              onClick={handleVideoPlay}
                              style={{
                                aspectRatio: media.width / media.height,
                              }}
                              className="object-cover rounded-custom object-center max-w-[300px] w-full h-full"

                            />

                          ) : (
                            <Image
                              src={message.pending ? URL.createObjectURL(media.file) : media.url}
                              alt="picture"
                              key={i}
                              height={media.height}
                              width={media.width}
                              style={{
                                aspectRatio: media.width / media.height,
                              }}
                              className="object-cover rounded-custom object-center max-w-[300px] w-full h-full"

                            />
                          ))
                        ))}
                      </div>}
                          <div style={{ fontSize: '10px' }} className="text-end gap-1 mt-[-5px]  z-10  px-1.5 py-0.5 rounded-custom leading-snug font-light flex justify-center items-center uppercase ">
                        {moment(message.createdAt).format("hh:mm a")}
                        <div className="bg-background-main p-1 rounded-full mr-[-50%]">
                      {message.pending ? <HiClock /> : message.recipients?.every(seenByUser => message.seenBy.includes(seenByUser)) ? <FaCheckDouble className="text-primary-main "/> : <FaCheck className="text-text-light"/>}
                      </div>
                      </div>
                        </div>
                        <button
                          onClick={()=>handleDeleteMessage(message)}
                          className="group-hover:flex hidden justify-center items-center flex-shrink-0 focus:outline-none mx-1  rounded-custom  bg-background-light border border-border-outline p-1"
                        >
                          <HiX className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              ))
            )}
            <div className="h-[50px] grid flex-shrink-0 w-full " ref={chatDisplay} >
            {result >= page * 9 &&  <Preloader/>}
          </div>
          </div>
          <div>
            <div className="w-full max-h-[200px]">
              {medias.length !== 0 && (
                <Swiper
                  modules={[Navigation, Pagination]}
                  className=" object-cover justify-stretch"
                  style={{ width: "100%", height: "100%" }}
                  scrollbar={{ draggable: true }}
                  slidesPerView={"auto"}
                >
                  {medias.map((media, index) => (
                    <SwiperSlide
                    key={index}
                      style={{ width: "auto" }}
                      className="h-full pr-2 self-stretch justify-stretch object-fill  w-full"
                    >
                      <div className="border-2 border-border-outline w-auto  rounded-2xl relative hover:border-primary-main hover:bg-primary-light/20 cursor-pointer">
                        <div
                          className="absolute z-20 right-1 top-1 p-1 border-2 border-border-outline rounded-xl hover:text-white text-text-light cursor-pointer bg-background-main hover:bg-primary-main"
                          onClick={() => handleMediasDelete(index)}
                        >
                          <XMarkIcon className="w-5 h-5" />
                        </div>
                        <div className="w-full flex-shrink-0 bg-background-light border-2 h-full border-transparent rounded-2xl overflow-hidden leading-none ">
                          {media.camera ? (
                            <div
                              className="relative"
                              style={{
                                aspectRatio: media.width / media.height,
                                objectFit: "contain",
                                minHeight: "140px",
                                height: "100%",
                              }}
                            >
                              <Image
                                src={media.camera}
                                alt="picture"
                                index={index}
                                fill={true}
                                style={{
                                  aspectRatio: media.width / media.height,
                                  objectFit: "contain",
                                  minHeight: "140px",
                                  height: "100%",
                                }}
                                onLoad={handleLoadImage}
                              />
                            </div>
                          ) : media.url ? (
                            <>
                              {mediaTools.isVideo(media.url) ? (
                                <video
                                  controls={true}
                                  index={index}
                                  src={media.url}
                                  alt="video"
                                  style={{
                                    aspectRatio: media.width / media.height,
                                    objectFit: "contain",
                                    minHeight: "140px",
                                    height: "100%",
                                  }}
                                  onLoadedMetadata={handleLoadVideo}
                                />
                              ) : (
                                <div
                                  className="relative"
                                  style={{
                                    aspectRatio: media.width / media.height,
                                    objectFit: "contain",
                                    minHeight: "140px",
                                    height: "100%",
                                  }}
                                >
                                  <Image
                                    src={media.url}
                                    alt="picture"
                                    index={index}
                                    fill={true}
                                    style={{
                                      aspectRatio: media.width / media.height,
                                      objectFit: "contain",
                                      minHeight: "140px",
                                      height: "100%",
                                    }}
                                    onLoad={handleLoadImage}
                                  />
                                </div>
                              )}
                            </>
                          ) : (
                            <>
                              {mediaTools.isVideo(media.file.type) ? (
                                <video
                                  controls={true}
                                  index={index}
                                  src={URL.createObjectURL(media.file)}
                                  alt="video"
                                  style={{
                                    aspectRatio: media.width / media.height,
                                    objectFit: "contain",
                                    minHeight: "140px",
                                    height: "100%",
                                  }}
                                  onLoadedMetadata={handleLoadVideo}
                                />
                              ) : (
                                <div
                                  className="relative"
                                  style={{
                                    aspectRatio: media.width / media.height,
                                    objectFit: "contain",
                                    minHeight: "140px",
                                    height: "100%",
                                  }}
                                >
                                  <Image
                                    src={URL.createObjectURL(media.file)}
                                    alt="picture"
                                    index={index}
                                    fill={true}
                                    style={{
                                      aspectRatio: media.width / media.height,
                                      objectFit: "contain",
                                      minHeight: "140px",
                                      height: "100%",
                                    }}
                                    onLoad={handleLoadImage}
                                  />
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              )}
            </div>

          </div>
          {emojiChoose && (
            <div className="absolute bottom-4 right-[4.25rem] z-50">
              <EmojiPicker
                onEmojiClick={handleEmojiClick}
                autoFocusSearch={false}
                theme={state.theme.mode == "tm-dark" ? "dark" : "light"}
                lazyLoadEmojis={true}
              />
            </div>
          )}

          <div className="flex-none  border-t border-border-outline/30">
            <form
              onSubmit={handleSubmit}
              className="flex flex-row gap-2 items-center p-2"
            >
              <button
                type="button"
                className="flex-shrink-0  focus:outline-none p-1 flex justify-center items-center bg-background-dark dark:bg-background-light rounded-xl "
              >
                <input
                  type="file"
                  name="file"
                  id="attachment-input"
                  hidden
                  multiple
                  accept="image/*,video/*"
                  onChange={handleMediasChange}
                  onClick={handleInputImageClick}
                />
                <label htmlFor="attachment-input" className="cursor-pointer">
                  <span>
                    <LinkIcon className="w-6 h-6" />
                  </span>
                </label>
              </button>
              <button
                type="button"
                onClick={() => setEmojiChoose(!emojiChoose)}
                className=" flex justify-center items-center "
              >
                <Smile className="w-6 h-6" />
              </button>

              <textarea
                className="!ring-0 w-full h-full resize-none flex-grow placeholder:font-light !pr-6 bg-background-extralight px-4 py-2 rounded-custom !border-none placeholder:text-text-light"
                type="text"
                name="text"
                value={text}
                rows={rows}
                onKeyDown={handleTextAreaKeyDown}
                onChange={handleTextAreaChange}
                placeholder="Type a message"
              />
              <button
                type="submit"
                className="flex-shrink-0 focus:outline-none p-2 flex justify-center items-center border transition border-primary-main text-primary-main hover:bg-primary-main  hover:text-white rounded-xl "
              >
                <Send className="w-6 h-6" />
              </button>
            </form>
          </div>
        </div>}
    </div>
  );
};

export default Chat;
