import React from "react";
import useStore from "@/hooks/useStore";
import Image from "next/image";
import { FaHeart, FaRegCommentDots } from "react-icons/fa";
import { functionalTools, mediaTools } from "@/utils/tools";
import Link from "next/link";

const StoryCard = (story) => {
  const { _id ,media,  comments } = story;
  const width = media.width
  const height = media.height
  return (
    <div className="relative flex-col gap-2 group overflow-hidden grid grid-cols-4">
        <div  className="h-full max-h-[300px]   self-stretch justify-stretch object-fill  "
                style={{aspectRatio:9/16, objectFit:'contain', minHeight:'140px', width:'100%'}}>

            { ( mediaTools.isVideo(media.url) ? (
                <video
                style={{aspectRatio:9/16, objectFit:'cover', objectPosition:'center', minHeight:'140px', height:'100%', width:'100%'}}
                src={media.url}
                className="rounded-custom"
                alt="video"
                />
            ) : (
                <Image
                src={media.url}
                alt="picture"
                height={height}
                width={width}
                style={{aspectRatio:9/16, minHeight:'140px'}}
                className="rounded-custom object-cover object-center w-full h-full"
                />
            ))}
            </div>
    </div>
  );
};

export default StoryCard;
