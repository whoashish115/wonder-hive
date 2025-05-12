import React, { useEffect, useState } from "react";
import useStore from "@/hooks/useStore";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

const ActiveUsers = (props) => {
  const {small} = props
  const { state, dispatch } = useStore();
  const { auth, activity } = state;

  const [activeUser, setActiveUsers] = useState([]);
  useEffect(() => {
    let activeUserList = [];
    for (let i = 0; i < activity.length; i++) {
      let cUser = auth.user.followings.find((user) => user._id === activity[i]);
      if (cUser) activeUserList.push(cUser);
    }
    setActiveUsers(activeUserList);
  }, [auth, activity]);

  return (
      <div className="flex-col gap-1 relative group  w-full flex cursor-pointer ">
        <Swiper
          modules={[Navigation, Pagination]}
          className=" w-full  "
          slidesPerView={'auto'}
          scrollbar={{ draggable: true }}
        >
          
          {activeUser.map((user) => (
          <SwiperSlide
          key={user._id} 
                  style={{ width: "auto" }}
                  className="h-full w-auto"
                >
            <Link href={`/message/${user.username}`}>
            <div  className="flex-col gap-1 flex relative justify-center items-center group px-1    cursor-pointer ">
            <div className={`flex-col gap-1 flex relative  items-center ${small ? ' w-[4rem] h-[4rem] ' : ' w-[4.5rem] h-[4.5rem] '} cursor-pointer `}>
              <div className=" border-[3px]  group-hover:border-primary-main border-dashed border-border-outline absolute z-20 rounded-full w-full h-full top-0 left-0 right-0 bottom-0"></div>
                <div className=" relative flex flex-shrink-0 w-full h-full cursor-pointer p-1.5  rounded-full">
                  <Image
                    className="w-full rounded-full select-none h-full object-cover"
                    src={user.profileImage}
                    alt=""
                    width={400}
                    height={400}
                  />
                </div>
            </div>
              <div className={`text-text-light px-0.5 ${small ? 'text-xs':'text-sm'} font-light`}>{'@' + user.username}</div>
            </div>
            </Link>
                  </SwiperSlide>
          ))}
      
                  </Swiper>

    </div>
  );
};

export default ActiveUsers;
