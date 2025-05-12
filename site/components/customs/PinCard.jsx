import React from "react";
import Image from "next/image";
import { FaHeart, FaRegCommentDots } from "react-icons/fa";
import { mediaTools } from "@/utils/tools";
import Link from "next/link";

const PinCard = (post) => {
  const { _id ,medias, likes, comments , glimpse} = post;
  const width = medias[0].width
  const height = medias[0].height
  const aspectRatio= width/height

  return (
    <Link href={`/${glimpse ? 'glimpse' : 'post'}/${_id}`} className="flex relative flex-col m-1 gap-2 group rounded overflow-hidden">
      { medias.length > 0 &&
             ( mediaTools.isVideo(medias[0].url) ? (
                <video
                  style={{aspectRatio, objectFit:'cover', objectPosition:'center', minHeight:'140px', height:'100%', width:'100%'}}
                  src={medias[0].url}
                  className="rounded"
                  alt="video"
                />
              ) : (
                <Image
                  src={medias[0].url}
                  alt="picture"
                  height={height}
                  width={width}
                  style={{aspectRatio, minHeight:'140px'}}
                  className="rounded object-cover object-center w-full h-full"
                />
              ))}
      <div className=" bg-black/30 z-10 w-full flex justify-center items-center gap-7 h-full absolute top-0 left-0 transition-all group-hover:bg-black/60">
      <div className="group text-xl opacity-0 group-hover:opacity-100 text-center flex xl:grid place-items-center rounded-xl text-white hover:text-text-dark cursor-pointer relative">
             <FaHeart  className="w-7 h-7" /> 
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

export default PinCard;
