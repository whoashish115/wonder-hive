import React, { useEffect, useState } from "react";
import {
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { Menu } from "react-feather";
import { getData } from "@/utils/fetchData";
import useStore from "@/hooks/useStore";
import GLOBAL_TYPES from "@/store/types/globalTypes";
import { useRouter } from "next/router";
import Image from "next/image";
import { sentenceTools } from "@/utils/tools";
import moment from "moment";
import Preloader from "../customs/Preloader";
import { createConversation, createGroup } from "@/store/actions/conversationActions";
import { HiCheck, HiChevronRight, HiPlus, HiX } from "react-icons/hi";
import Loader from "../customs/Loader";
import { BiImageAdd } from "react-icons/bi";
import { addNoteProfile, deleteNoteProfile } from "@/store/actions/profileActions";
import Button from "../customs/Button";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";


const ConverCard = (props) => {
  const { conversation, openSidebar, noDisplay, groupUsers, handleRemoveUserToGroup, handleAddUserToGroup, groupModal } = props
  const [load, setLoad] = useState(true)
  const [infoUser, setInfoUser] = useState({})
  const [info, setInfo] = useState({})
  const router = useRouter()
  const { state } = useStore()
  const { auth, message } = state

  useEffect(() => {
    if (!conversation.isGroup) {
      let infoUser = conversation.members.length == 1 ? conversation.members[0] : conversation.members.filter(m => m._id !== auth.user._id)[0]
      setInfo({
        picture: infoUser.profileImage,
        title: infoUser.fullname ? infoUser.fullname : infoUser.username,
        bio: infoUser.bio,
        userId: infoUser._id,
        url: `/message/${infoUser.username}`,
        isGroup: false,
      })
      setInfoUser(infoUser)
    }
    else {
      setInfo({
        picture: conversation.picture,
        title: conversation.title,
        bio: conversation.bio,
        conversationId: conversation._id,
        isGroup: true,
        conversationId: conversation._id,
        url: `/message/${conversation._id}`
      })
    }
    setLoad(false)
  }, [])

  let endMessageDate = new Date(conversation.endMessageDate)

  return (
    !(groupModal && info.isGroup) && <div
      onClick={() => !groupModal ? router.push(info.url) : (groupUsers.filter(gU => gU._id == infoUser._id).length > 0 ? handleRemoveUserToGroup(infoUser) : handleAddUserToGroup(infoUser))}
      style={{ paddingY: openSidebar ? "0.5rem" : "0px" }}
      data-lastdate={endMessageDate.getTime()}
      data-reload={1}
      className="flex justify-between py-2 conversation-item items-stretch cursor-pointer p-3 hover:bg-background-extralight rounded-custom overflow-hidden relative"
    >
      {load ? <Loader /> :
        <>
          <div className="w-14 h-14 relative flex flex-shrink-0">
            <Image
              className="shadow-md rounded-full select-none w-full h-full object-cover"
              src={info.picture}
              alt=""
              width={200}
              height={200}
            />
          </div>
          <div
            style={{
              padding: openSidebar ? "0px 0.75rem" : "0px",
              ...noDisplay,
            }}
            className="flex-auto transition-all  grid grid-flow-col items-center justify-between  gap-1"
          >
            <div className=" inline-flex justify-center items-center">
              <div className="flex  flex-col ">
                <p className="text-sm ">{info.title}</p>
                {Boolean(conversation.messagesCount?.[auth.user._id]) && <div className="min-w-0">
                  <p className="w-full  text-xs text-text-light truncate">{Boolean(conversation.typing?.length) ?
                    (<div className="font-semibold text-primary-light">
                      {
                        conversation.isGroup ?
                          (<>
                            {
                              conversation.typing.length == 1 ?
                                `${(conversation.members.filter(m => m._id == conversation.typing[0]))[0].username} is typing...` :
                                `${(conversation.members.filter(m => m._id == conversation.typing[0]))[0].username} and ${conversation.typing.length - 1} other is typing...`
                            }
                          </>)
                          : 'typing...'
                      }
                    </div>)
                    : (conversation.endMessage.slice(0, 15) + (conversation.endMessage.length > 15 ? '...' : ''))}</p>
                </div>}

              </div>
            </div>
            {Boolean(conversation.messagesCount?.[auth.user._id]) && <div className="flex flex-col gap-2">
              <div className="flex justify-end w-full flex-grow ">
                <div style={{ ...noDisplay }} className="flex-shrink-0 flex justify-center items-center" >
                  {Boolean(conversation.unseenMessagesCount?.[auth.user._id]) && <div className=" px-2 py-1  truncate    text-xs flex-shrink-0 bg-primary-main rounded-full ">
                    {conversation.unseenMessagesCount?.[auth.user._id]}
                  </div>}
                </div>
              </div>
              {conversation.endMessage && <p className="ml-2 whitespace-no-wrap text-text-light truncate text-xs capitalize">{moment(conversation.endMessageDate).fromNow(true)}</p>}
            </div>}

          </div>
          {groupUsers.filter(gU => gU._id == infoUser._id).length > 0 && <div className="bg-primary-main/20 absolute flex p-6 border-2 text-3xl justify-end border-primary-main text-primary-main items-center top-0 left-0 bototm-0 right-0 w-full h-full rounded-custom">
            <HiCheck />
          </div>}
        </>
      }
    </div>
  )
}
const Conversations = () => {
  const { state, dispatch } = useStore();
  const { auth, conversation, activity, socket } = state;
  const router = useRouter();

  const [openSidebar, setOpenSidebar] = useState(true);
  const handleSidebarToggle = () => setOpenSidebar(!openSidebar);
  const noDisplay = {
    opacity: openSidebar ? 1 : 0,
    height: openSidebar ? "auto" : "0px",
    overflow: openSidebar ? "auto" : "hidden",
    width: openSidebar ? "auto" : "0px",
    visibility: openSidebar ? "visible" : "hidden",
    pointerEvents: openSidebar ? "auto" : "none",
  };
  const [mixer, setMixer] = useState();
  const [addNoteOpen, setAddNoteOpen] = useState(false);
  const handleAddNoteOpen = () => setAddNoteOpen(true)
  const handleAddNoteClose = () => setAddNoteOpen(false)
  const [note, setNote] = useState('');
  const handleNoteSubmit = () => {
    addNoteProfile(dispatch, { note, auth, socket })
    handleAddNoteClose()
  }
  const handleDeleteNote = () => {
    deleteNoteProfile(dispatch, { auth, socket })
    handleAddNoteClose()
  }

  useEffect(() => {
    if (!mixer) {
      if (typeof window !== "undefined") {
        if (document.querySelector(".conversations-container")) {
          require(['mixitup'], function (mixitup) {
            const mixer = mixitup(".conversations-container", {
              selectors: {
                target: '.conversation-item'
              },
              animation: {
                "duration": 250,
                "nudge": false,
                "reverseOut": false,
                "effects": "translateY(100%)"
              }
            });
            setMixer(mixer)
          });
        }
      }
    }
  }, [conversation])

  useEffect(() => {
    if (mixer) {
      mixer.sort(`lastdate:desc reload:desc`)
      mixer.sort(`lastdate:desc`)
    }
  }, [conversation])

  const [conversationLoading, setConversationLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [searchUsers, setSearchUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const handleSearch = async () => {
      if (!search) return setSearchUsers([]);
      const res = await getData(`user/search?username=${search}`, auth.token);
      if (res.error) dispatch({ type: GLOBAL_TYPES.ALERT_ERROR, payload: res.error })
      setSearchUsers(res.users);
      setLoading(false)
    };
    let timer = setTimeout(handleSearch, 500)
    return () => clearTimeout(timer)
  }, [search]);

  const handleAddConversation = async (user) => {
    setConversationLoading(true)
    await createConversation(dispatch, { auth, members: auth.user._id == user._id ? [auth.user] : [user, auth.user] })
    setSearchUsers([]);
    setSearch("");
    setConversationLoading(false)
    return router.push(`/message/${user.username}`)
  };

  const [groupModal, setGroupModal] = useState(false);
  const [groupTitle, setGroupTitle] = useState('');
  const [groupBio, setGroupBio] = useState('');
  const [groupPicture, setGroupPicture] = useState('');
  const [groupUsers, setGroupUsers] = useState([]);
  const handleOpenGroupUserModal = () => {
    handleAddNoteClose()
    setGroupModal(true)
  }
  const handleCloseGroupUserModal = () => {
    setGroupUsers([]);
    setGroupModal(false)
  }
  const handleAddUserToGroup = (user) => {
    if (user) {
      setGroupUsers([...groupUsers.filter(u => u._id !== user._id), user])
    }
  }
  const handleRemoveUserToGroup = (user) => {
    if (user) {
      setGroupUsers([...groupUsers.filter(u => u._id !== user._id)])
    }
  }
  const handleChangeGroupPicture = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    let error = "";
    if (!file) error = "File does not exists";

    if (!file.size) error = "Invalid File Size";

    if (file.size > 1024 * 1024 * 10) error = "File is larger than 10mb";

    if (file.type !== "image/jpeg" && file.type !== "image/png")
      error = "File format is incorrect";

    if (error) return dispatch({ type: GLOBAL_TYPES.ALERT_ERROR, payload: error });
    setGroupPicture(file);
  };
  const handleChangeGroupTitle = (e) => {
    setGroupTitle(e.target.value);
  };
  const handleChangeGroupBio = (e) => {
    setGroupBio(e.target.value);
  };
  const handleCreateGroup = async () => {
    if (groupTitle.length == 0) return dispatch({ type: GLOBAL_TYPES.ALERT_ERROR, payload: 'title is required' })
    setConversationLoading(true)
    const groupId = await createGroup(dispatch, { auth, members: [auth.user, ...groupUsers], socket, router, isGroup: true, groupTitle, groupPicture, groupBio })
    handleCloseGroupUserModal()
    setSearch("");
    setSearchUsers([]);
    setConversationLoading(false)
    return router.push(`/message/${groupId}`)
  };


  return (
    <div
      className={`flex-col flex-grow  bg-background-light relative  max-h-[calc(100vh-64px)] md:max-h-[calc(100vh-56px)]  min-h-[500px] h-full  overflow-auto rounded-custom transition-all ${openSidebar ? "md:w-4/12 w-full flex-shrink-0" : "w-auto flex-shrink"} `}
    >

      {!conversation.firstLoad ? <Preloader /> :
        <>
          {groupModal ?
            <>

              <div className="header  sticky top-0 bg-background-extralight z-[40] flex-shrink-0  flex flex-row justify-between items-center flex-none px-4 py-2">
                <div
                  className="text-lg items-center font-semibold justify-center hidden md:flex flex-col gap-1 capitalize "
                  style={{ ...noDisplay }}
                >
                  Create Group
                  <div
                    style={{ paddingLeft: openSidebar ? "0.5rem" : "0px", ...noDisplay }}
                    className="text-xs w-full items-center text-text-light  font-light justify-center hidden md:flex capitalize"
                  >
                    ({groupUsers.length}) Friends Selected
                  </div>
                </div>
                <div
                  onClick={handleCloseGroupUserModal}
                  style={{ margin: openSidebar ? "" : "auto", ...noDisplay }}
                  className="rounded-xl bg-background-dark cursor-pointer items-center justify-center dark:bg-background-extralight w-10 h-10 p-2 flex"
                >
                  <HiX className="w-5 h-5" />
                </div>
              </div>
              <div className="flex flex-col pt-4 flex-none px-4">
                <div className="flex flex-row gap-4 justify-between items-center flex-none ">
                  <div className="flex gap-2 flex-col  justify-center flex-grow items-center">

                    <div className=" flex-shrink-0  relative group rounded-full  overflow-hidden w-[120px] h-[120px] ">
                      {groupPicture && <Image
                        src={URL.createObjectURL(groupPicture)}
                        alt="Group Picture"
                        width={120}
                        height={120}
                        className="w-[120px] h-[120px] rounded-full object-cover"
                      />}
                      <div>
                        <input
                          type="file"
                          name="file"
                          hidden
                          id="group-picture-file-input"
                          accept="image/*"
                          onChange={handleChangeGroupPicture}
                        />
                        <label
                          htmlFor="group-picture-file-input"
                          className={`bg-black/60 border border-border-outline rounded-full transition-all cursor-pointer absolute top-0 z-20 left-0 bottom-0 right-0 w-full h-full flex justify-center items-center group-hover:opacity-100  ${groupPicture ? 'opacity-0' : 'opacity-50'}`}
                        >
                          <span>
                            <BiImageAdd className="text-4xl" />
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="grid gap-4  w-full">
                    <div className="flex item-center flex-col gap-2 flex-grow justify-between">
                      <div className="text-text-light text-sm flex-grow w-full ">
                        Title
                      </div>
                      <input
                        id="group-title"
                        name="group-title"
                        value={groupTitle}
                        onChange={handleChangeGroupTitle}
                        className="outline-none !py-2 !px-2 text-sm !ring-0  bg-background-extralight disabled:text-text-light rounded-custom placeholder:text-text-light border border-transparent hover:border-border-outline focus:border-border-outline w-full"
                      />
                    </div>

                  </div>
                </div>
                <div className="flex item-center flex-col gap-2 flex-grow justify-between">
                  <div className="text-text-light text-sm flex-grow w-full ">
                    Bio
                  </div>
                  <textarea
                    id="group-bio"
                    name="group-bio"
                    value={groupBio}
                    onChange={handleChangeGroupBio}
                    className="outline-none !py-2 !px-2 text-sm !ring-0  bg-background-extralight disabled:text-text-light rounded-custom placeholder:text-text-light border border-transparent hover:border-border-outline focus:border-border-outline w-full"
                  />
                </div>
              </div>
            </>

            : <div className="header sticky top-0 bg-background-extralight z-[20] flex-shrink-0 flex flex-row justify-between items-center flex-none px-4 py-3">
              <div
                onClick={handleSidebarToggle}
                style={{ margin: openSidebar ? "" : "auto" }}
                className="md:flex hidden rounded-xl transition-all bg-background-dark cursor-pointer items-center justify-center dark:bg-background-extralight p-2 "
              >
                <Menu className="w-5 h-5" />
              </div>
              <p
                style={{ paddingLeft: openSidebar ? "0.5rem" : "0px", ...noDisplay }}
                className="text-lg  transition-all w-full items-center flex-grow font-semibold justify-center   capitalize"
              >
                Message
              </p>
              <div
                onClick={handleOpenGroupUserModal}
                style={{ margin: openSidebar ? "" : "auto", ...noDisplay }}
                className="rounded-xl transition-all bg-background-dark cursor-pointer items-center justify-center dark:bg-background-extralight w-10 h-10 p-2 flex"
              >
                <HiPlus className="w-5 h-5" />
              </div>
            </div>}

          <div
            style={{ ...noDisplay }}
            className={`relative flex-shrink-0 transition-all ${openSidebar && ' px-4 py-6 '}`}
          >
            <label>
              <div className="rounded-xl flex items-center bg-background-dark border-2 border-border-outline/50 dark:bg-background-light py-2 px-4 w-full">
                <MagnifyingGlassIcon className={`w-6 h-6 mr-2 ${!search && ' text-text-light '}`} />
                <input
                  type="text"
                  placeholder="Search Friends..."
                  id="search"
                  name="search"
                  onChange={(e) => {
                    setSearch(e.target.value); setLoading(e.target.value ? true : false)
                  }}
                  value={search}
                  className="bg-transparent !p-0 !ring-0 border-none w-full text-sm font-light"
                />
              </div>
            </label>
          </div>
          <div className={`gap-3 pb-4 flex-1 flex flex-col ${openSidebar ? ' px-4 ' : 'items-center '}`}>
            {loading ? <Preloader /> : (search.length !== 0 ? (
              searchUsers.length !== 0 ? (
                searchUsers.map((user, i) => (
                  <div
                    key={i}
                    onClick={() => groupModal ? (groupUsers.filter(gU => gU._id == user._id).length > 0 ? handleRemoveUserToGroup(user) : handleAddUserToGroup(user)) : handleAddConversation(user)}
                    style={{ padding: openSidebar ? "0.5rem" : "0px", ...noDisplay }}
                    className="flex justify-between items-center cursor-pointer hover:bg-background-extralight rounded-xl relative"
                  >
                    <div className="w-14 h-14 relative flex flex-shrink-0">
                      <Image
                        className="shadow-md rounded-full select-none w-full h-full object-cover"
                        src={user.profileImage}
                        alt=""
                        width={200}
                        height={200}
                      />
                    </div>
                    <div
                      style={{
                        padding: openSidebar ? "0px 0.75rem" : "0px",
                        ...noDisplay,
                      }}
                      className="flex-auto transition-all"
                    >
                      <p className="text-sm">{user.fullname ? user.fullname : "@" + user.username}</p>
                      <div className="flex items-center justify-between min-w-0 text-xs text-text-light">
                        <p className="truncate">{sentenceTools.slice(user.bio, 50)}</p>
                      </div>

                    </div>
                    {groupUsers.filter(gU => gU._id == user._id).length > 0 && <div className="bg-primary-main/20 absolute flex p-6 border-2 text-3xl justify-end border-primary-main text-primary-main items-center top-0 left-0 bototm-0 right-0 w-full h-full rounded-custom">
                      <HiCheck />
                    </div>}
                  </div>
                ))
              ) : ("No User Found")
            ) : (
              <div className="flex flex-col gap-2">
                <div
                  style={{ paddingBottom: openSidebar ? "0.5rem" : "0px", ...noDisplay }}
                  className="text-sm  transition-all w-full items-center flex-grow font-semibold justify-start gap-4 flex capitalize"
                >
                  <div
                    className={`fixed  z-[99999] ${addNoteOpen && "!opacity-100 !pointer-events-auto"
                      } pointer-events-none opacity-0 transition-all inset-0 bg-black bg-opacity-50 flex justify-center items-center`}
                  >
                    <div className="bg-background-light min-w-[260px] p-6 rounded-lg shadow-lg relative">
                      <button
                        className="absolute hover:bg-background-light top-2 right-2 text-2xl p-2 bg-background-main  rounded-full"
                        onClick={handleAddNoteClose}
                      >
                        <HiX />
                      </button>
                      <h2 className="text-xl font-semibold">{ !auth.user.note ? 'Add Note':'Delete Note'}</h2>
                      <div className="flex flex-col gap-2 pt-4">
                      {!auth.user.note&&  <form className="flex flex-col gap-4" onSubmit={handleNoteSubmit}>
                          <input
                            id="note"
                            name="note"
                            value={note}
                            onChange={(e) =>
                              setNote(e.target.value.slice(0,25))
                            }
                            className="outline-none !py-2 !px-4 !ring-0 font-light  bg-background-extralight disabled:text-text-light rounded-custom placeholder:text-text-light border-2 border-transparent hover:border-border-outline focus:border-border-outline w-full"
                          />
                          <span className={`text-xs flex text-end justify-end text-text-light ${note.length == 25 && '!text-error-main'}`}>{note.length}/25</span>
                          <Button disabled={!note} content="Add" type="submit" />
                        </form>}

                        {auth.user.note && <Button onClick={handleDeleteNote} content="Delete" type="submit" />
                          }
                      </div>
                    </div>
                  </div>
                  <Swiper
          modules={[Navigation, Pagination]}
          className=" object-cover justify-stretch"
          style={{ height: "100%", width: "100%" }}
          slidesPerView={"auto"}
          scrollbar={{ draggable: true }}
        >
            <SwiperSlide
                  style={{ width: "auto" }}
                  className="h-full self-stretch justify-stretch object-fill  w-auto"
                >
                  {!auth.user.note && <div onClick={handleAddNoteOpen} className="w-[72px] h-[72px] relative rounded-full bg-background-light text-text-light cursor-pointer hover;text-text-main  mt-[10px]">
                    <div className="z-20 relative p-2 rounded-custom before:border-r-[5px] w-[90%] mx-auto text-xs font-light translate-y-[-25%]  before:border-l-[5px] before:border-l-transparent before:border-r-transparent before:border-t-[5px] before:border-t-background-extralight before:top-[100%] before:content-[''] bg-background-extralight before:absolute before:h-full before:z-[40]">
                      Add a note
                    </div>
                    <Image fill={true} src={auth.user.profileImage} className='rounded-full object-cover object-center' />
                  </div>}
                </SwiperSlide>

                  {[auth.user, ...auth.user.followings].map(((u,i) => (
                    u.note&& 
                      <SwiperSlide
                      key={i}
                        style={{ width: "auto" }}
                        className="h-full px-2 self-stretch justify-stretch object-fill  w-auto"
                        >
                    <div onClick={auth.user._id ==u._id ? handleAddNoteOpen : ()=>{}} className="w-[72px] flex-shrink-0 h-[72px] relative rounded-full bg-background-light text-text-light hover;text-text-main  mt-[10px]">
                      <div className="z-20 truncate relative p-2 rounded-custom before:border-r-[5px] w-[90%] mx-auto text-xs font-light translate-y-[-25%]  before:border-l-[5px] before:border-l-transparent before:border-r-transparent before:border-t-[5px] before:border-t-background-extralight before:top-[100%] before:content-[''] bg-background-extralight before:absolute before:h-full before:z-[40]">
                        {u.note}
                      </div>
                      <Image fill={true} src={u.profileImage} className='rounded-full object-cover object-center' />
                    </div>
                  </SwiperSlide>
                  )))}
                  </Swiper>

                </div>
                <h4
                  style={{ paddingLeft: openSidebar ? "0.5rem" : "0px", ...noDisplay }}
                  className="text-sm  transition-all w-full items-center flex-grow font-semibold justify-start flex capitalize"
                >
                  Chats ({Object.values(conversation.data).filter(c => !c.removedFrom.includes(auth.user._id)).length})
                </h4>
                <div className='conversations-container'>
                  {Object.values(conversation.data).filter(c => !c.removedFrom.includes(auth.user._id)).map((currentConversation) => (
                    <ConverCard key={currentConversation._id} groupUsers={groupUsers} handleRemoveUserToGroup={handleRemoveUserToGroup} handleAddUserToGroup={handleAddUserToGroup} groupModal={groupModal} conversation={currentConversation} openSidebar={openSidebar} noDisplay={noDisplay} />
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div
            onClick={handleCreateGroup}
            style={{ margin: openSidebar ? "" : "auto", ...noDisplay }}
            className={`rounded-xl text-2xl  absolute bottom-6 right-6 cursor-pointer items-center justify-center bg-primary-main w-10 h-10 p-2 flex transition-all ${groupUsers.length > 0 ? 'scale-1' : 'scale-0 pointer-events-none'}`}
          >
            <HiChevronRight />
          </div>
          <div
            style={{ margin: openSidebar ? "" : "auto", ...noDisplay }}
            className={`rounded-xl text-2xl  absolute top-0 left-0 bottom-0 right-0 cursor-pointer items-center justify-center bg-black/10 dark:bg-black/40 p-2  flex transition-all ${conversationLoading ? 'opacity-1  z-[20]' : ' !opacity-0 !pointer-events-none'}`}
          >
            <Preloader />
          </div>
        </>}

    </div>
  );
};

export default Conversations;
