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
import {
  createComment,
  deleteComment,
  likeComment,
  removeLikeComment,
  updateComment,
} from "@/store/actions/commentActions";
import { HiX } from "react-icons/hi";
import { TwitterIcon } from "react-share";
import { BiCopy } from "react-icons/bi";
import moment from "moment";
import Image from "next/image";
import Preloader from "../customs/Preloader";
import { sentenceTools } from "@/utils/tools";


 const CommentCard = ({ children, comment, post, commentId, seeReply }) => {
    const [content, setContent] = useState("");
    const [inputComment, setInputComment] = useState("");
    const { state, dispatch } = useStore();
    const { auth, socket } = state;
    const [likeLoading, setLikeLoading] = useState(false);
    const [isLike, setIsLike] = useState(false);
    const [onReply, setOnReply] = useState(false);
    const [readMoreNext, setReadMoreNext] = useState(200);
    const [onEdit, setOnEdit] = useState(false);
  
    useEffect(() => {
      setContent(comment.content);
      setOnReply(false);
      if (comment.likes.find((like) => like._id === auth.user._id))
        setIsLike(true);
      else setIsLike(false);
    }, [comment, auth.user._id]);
  
    const handleLikeComment = async () => {
      if (likeLoading) return;
      setLikeLoading(true);
      await likeComment(dispatch, { comment,  postGlimpse:post, auth });
      setLikeLoading(false);
    };
    const handleRemoveLikeComment = async () => {
      if (likeLoading) return;
      setLikeLoading(true);
      await removeLikeComment(dispatch, { comment,  postGlimpse:post, auth });
      setLikeLoading(false);
    };
    const handleReplyComment = () => {
      setOnEdit(false);
      if (onReply) return setOnReply(false);
      setOnReply({ ...comment, commentId });
    };
    const handleEditComment = () => {
      setOnReply(false);
      setOnEdit(!onEdit);
    };
    const handleUpdateComment = () => {
      if (comment.content !== content) {
        updateComment(dispatch, { comment,  postGlimpse:post, content, auth });
        setOnEdit(false);
      } else {
        setOnEdit(false);
      }
    };
    const handleDeleteComment = () => {
      if (user._id === auth.user._id || comment.user._id === auth.user._id) {
        deleteComment(dispatch, {  postGlimpse:post, auth, comment, socket });
      }
    };
    const handleComment = (e) => {
      e.preventDefault();
      if (!inputComment.trim()) return setOnReply(false);
      const newComment = {
        content: inputComment,
        likes: [],
        user: auth.user,
        createdAt: new Date().toISOString(),
        reply: onReply && onReply.commentId,
        tag: onReply && onReply.user,
      };
      createComment(dispatch, {  postGlimpse:post, newComment, auth, socket });
      setInputComment("");
      if (setOnReply) return setOnReply(false);
    };
    return (
      <div className="w-full flex flex-col gap-2">
        <div className="flex gap-2 p-2 w-full">
          <div className="flex-shrink-0">
            <Link href={`/profile/${comment.user.username}`}>
              <Image
                src={comment.user.profileImage}
                alt="Profile picture"
                className="w-12 h-12 flex-shrink-0 rounded-full object-cover object-center select-none"
                width={200}
                height={200}
              />
            </Link>
          </div>
          <div className="flex-grow flex flex-col">
            <div className="flex gap-2 justify-between w-full">
              <div className="text-text-main text-xs flex gap-2 items-center font-light">
                <Link href={`/profile/${comment.user.username}`}>
                  {" "}
                  {"@" + comment.user.username}{" "}
                </Link>
                <span className="text-text-light">
                  {"(" + moment(comment.createdAt).fromNow(true) + ")"}
                </span>
              </div>
            </div>
            <div>
              {onEdit ? (
                <input
                  name="comment"
                  id="comment"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="p-1 w-full flex-grow h-full placeholder:text-text-light border-b-[1px] border-border-outline bg-transparent !outline-none !ring-0 resize-none"
                />
              ) : (
                <div className="text-sm" style={{ wordWrap: "break-words",whiteSpace:'pre-line-wrap'  }}>
                  {comment.tag && comment.tag._id !== comment.user._id && (
                    <Link href={`/profile/${comment.tag.username}`}>
                      @{comment.tag.username}
                    </Link>
                  )}
                  <div className="p-1">{sentenceTools.slice(content, readMoreNext)}{readMoreNext < content.length && (
                <span
                  onClick={() => setReadMoreNext(readMoreNext + 600)}
                  className="font-semibold uppercase text-text-main hover:text-text-dark cursor-pointer"
                >
                  Read More
                </span>
              )} </div>
                  
                </div>
              )}
            </div>
            <div className="flex gap-5 px-2 pt-1.5">
              {!onEdit && (
                <div className="group text-xl flex gap-2 text-center place-items-center rounded-xl text-text-light hover:text-text-dark cursor-pointer relative">
                  {isLike ? (
                    <FaHeart
                      onClick={handleRemoveLikeComment}
                      className="w-5 h-5 text-red-600"
                    />
                  ) : (
                    <FaRegHeart
                      onClick={handleLikeComment}
                      className="w-5 h-5 "
                    />
                  )}
                  {comment.likes.length != 0 && (
                    <div className="text-xs">{comment.likes.length}</div>
                  )}
                </div>
              )}
               <div className=" text-xl flex gap-1 text-center xl:grid place-items-center rounded-xl text-text-light hover:text-text-dark cursor-pointer relative">
                {!onEdit && !onReply && (
                  <div className="group text-xl flex gap-1 text-center xl:grid place-items-center rounded-xl text-text-light hover:text-text-dark cursor-pointer relative">
                    <FaReply onClick={handleReplyComment} className="w-5 h-5 " />
                  </div>
                )}
              </div>
  
              {auth.user._id == comment.user._id && (
                <div className="text-xl flex gap-1 text-center xl:grid place-items-center rounded-xl text-text-light hover:text-text-dark cursor-pointer relative">
                  {onEdit ? (
                    <div>
                      <div className="flex justify-end">
                        <button
                          disabled={!inputComment}
                          onClick={handleUpdateComment}
                          className=" rounded-custom flex items-center text-white justify-center text-sm disabled:pointer-events-none disabled:text-text-light disabled:bg-background-extralight px-4 py-1 capitalize bg-primary-main hover:bg-primary-dark"
                        >
                          Update
                        </button>
                        <button
                          onClick={handleEditComment}
                          className=" rounded-custom flex items-center text-sm justify-center text-text-dark bg-background-light px-4 py-1 capitalize hover:bg-background-extralight"
                        >
                          cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <FaEdit onClick={handleEditComment} className="w-5 h-5 " />
                  )}
                </div>
              )}
              {auth.user._id == comment.user._id && (
                <div className="text-xl flex gap-1 text-center xl:grid place-items-center rounded-xl text-text-light hover:text-text-dark cursor-pointer relative">
                  <RiDeleteBin5Line
                    onClick={handleDeleteComment}
                    className="w-5 h-5 "
                  />
                </div>
              )}
             
            </div>
            <div className="flex w-full  flex-col gap-4  pt-4">
              {onReply && (
                <form
                  onSubmit={handleComment}
                  className="flex my-4 justify-center bg-background-extralight border rounded-custom p-2 border-border-outline  flex-col gap-2 m-1 w-full "
                >
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <Image
                        src={auth.user.profileImage}
                        alt="Profile picture"
                        className="w-14 h-14 rounded-full object-cover object-center select-none"
                        width={200}
                        height={200}
                      />
                    </div>
                    <div className="flex flex-col flex-grow">
                      <div className="flex gap-1">
                        <div className="flex text-sm font-light bg-primary-dark border px-1 border-border-outline hover:bg-primary-primary text-white rounded-custom">
                          @{onReply.user.username}
                        </div>
                        <div className="flex text-sm font-light bg-background-extralight px-1 border border-border-outline rounded-custom">
                          @{auth.user.username}
                        </div>
                      </div>
                         <textarea
                  name="comment"
                  id="comment"
                  rows={2}
                  value={inputComment}
                  onChange={(e) => setInputComment(e.target.value)}
                  placeholder="Write a comment..."
                  className="!p-2 w-full mt-2 rounded-custom text-sm flex-grow h-full !shadow-none focus:!ring-offset-[0px]  focus:!ring-0 placeholder:text-text-light border-b-[1px] border-border-outline bg-transparent !outline-none !ring-0 resize-y"
                />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button
                      disabled={!inputComment}
                      type="submit"
                      className=" rounded-custom flex items-center text-white justify-center text-sm disabled:pointer-events-none disabled:text-text-light disabled:bg-background-extralight px-4 py-1 capitalize bg-primary-main hover:bg-primary-dark"
                    >
                      Comment
                    </button>
                    <button
                      onClick={handleReplyComment}
                      className=" rounded-custom flex items-center text-sm justify-center text-text-dark bg-background-light px-4 py-1 capitalize hover:bg-background-extralight"
                    >
                      cancel
                    </button>
                  </div>
                </form>
              )}
              {children}
            </div>
            {seeReply}
          </div>
        </div>
        <div className="w-full flex justify-end"></div>
      </div>
    );
  };
const CommentDisplay = ({ comment, post, replyCm }) => {
    const [showRep, setShowRep] = useState([]);
    const [next, setNext] = useState(0);
  
    useEffect(() => {
      setShowRep(replyCm.slice(replyCm.length - next));
    }, [replyCm, next]);
  
    return (
      <div className="flex flex-col gap-4">
        <CommentCard
          comment={comment}
          post={post}
          commentId={comment._id}
          seeReply={
            replyCm.length - next > 0 ? (
              <div>
                <div
                  onClick={() => {
                    setNext(next + 10);
                  }}
                  className="group text-xl inline-flex gap-1 px-4 py-2 justify-center items-center rounded-custom bg-background-extralight border border-border-outline text-text-light hover:text-text-dark cursor-pointer relative"
                >
                  <div className="text-sm">View replies {replyCm.length}</div>
                  <FaChevronDown className="w-3 h-3 " />
                </div>
              </div>
            ) : (
              replyCm.length > 0 && (
                <div>
                  <div
                    onClick={() => {
                      setNext(0);
                    }}
                    className="group text-xl inline-flex gap-1 px-4 py-2 justify-center items-center rounded-custom bg-background-extralight border border-border-outline text-text-light hover:text-text-dark cursor-pointer relative"
                  >
                    <div className="text-sm">Hide replies</div>
                    <FaChevronUp className="w-3 h-3 " />
                  </div>
                </div>
              )
            )
          }
        >
          <div>
            {showRep.map(
              (item, index) =>
                item.reply && (
                  <CommentCard
                    key={index}
                    comment={item}
                    post={post}
                    commentId={comment._id}
                  />
                )
            )}
          </div>
        </CommentCard>
      </div>
    );
  };
const PostGlimpseCardPageComments = (post) => {
    const [comments, setComments] = useState([]);
    const [showComments, setShowComments] = useState([]);
    const [next, setNext] = useState(2);
  
    const [replyComments, setReplyComments] = useState([]);
  
    useEffect(() => {
      const newCm = post.comments.filter((cm) => !cm.reply);
      setComments(newCm);
      setShowComments(newCm.slice(0, next));
    }, [post.comments, next]);
  
    useEffect(() => {
      const newRep = post.comments.filter((cm) => cm.reply);
      setReplyComments(newRep);
    }, [post.comments]);
    return (
      <>
        {showComments.map((comment, index) => (
          <CommentDisplay
            key={index}
            comment={comment}
            post={post}
            replyCm={replyComments.filter((item) => item.reply === comment._id)}
          />
        ))}
  
        {comments.length - next > 0 && (
          <div className="cursor-pointer hover:text-text-main text-sm capitalize text-text-main" onClick={() => setNext(next + 10)}>see more...</div>
        )}
        {comments.length === 0 && (
          <div className="font-light text-sm text-text-light text-center">
            No Comments Yet
          </div>
        )}
      </>
    );
  };

  export default PostGlimpseCardPageComments