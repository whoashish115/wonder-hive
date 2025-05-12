import useStore from "@/hooks/useStore";
import { deleteAllNotifies, readAllNotify } from "@/store/actions/notifyActions";
import {
    followRequestAccept,
    followRequestDecline,
} from "@/store/actions/profileActions";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { RiDeleteBin2Line } from "react-icons/ri";
import Button from "../customs/Button";
import Image from "next/image";
import Link from "next/link";
import { HiUserAdd } from "react-icons/hi";

const RequestApprover = ({ user }) => {
    const { state, dispatch } = useStore();
    const { auth, socket } = state;
    const [actionLoading, setActionLoading] = useState(false);

    const handleFollowAccept = () => {
        if (actionLoading) return;
        setActionLoading(true);

        followRequestAccept(dispatch, { user, auth, socket });

        setActionLoading(false);
    };

    const handleFollowDecline = () => {
        if (actionLoading) return;
        setActionLoading(true);

        followRequestDecline(dispatch, {
            user,
            auth,
            socket,
        });

        setActionLoading(false);
    };

    return (
        <div className="flex gap-4 items-center hover:bg-background-extralight rounded-custom px-4 py-2 justify-between w-full">
                <div className="flex flex-row gap-4 items-center flex-grow">
            <Link href={`/profile/${user.username}`}>
                    <Image
                        src={user.profileImage}
                        alt="picture"
                        height={75}
                        width={75}
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

                <div>
                    <Button onClick={handleFollowAccept} content="Accept" />
                </div>
                <div>
                <button
                    onClick={handleFollowDecline}
                    className="font-semibold rounded-custom w-full max-w-[200px] flex items-center gap-4 text-text-dark border-2 border-border-outline justify-center px-8 py-2 text-base capitalize bg-background-light hover:bg-background-extralight"
                    >
                      decline
                  </button>
                </div>
            </div>
        </div>
    );
};
const NotificationsRequests = () => {
    const { state } = useStore();
    const { auth } = state;
    return (
        <div className="gap-3 md:gap-6 flex flex-col w-full  ">
            <div className="bg-background-light rounded-custom flex flex-col p-8 gap-8 ">
                <div className="flex items-center font-semibold justify-between">
                    <h5 className="text-xl">Follow Requests ({state.auth.user.requests.length})</h5>
                </div>
             {auth.user.requests.length >0 ?    <div className="flex flex-col">
                    {auth.user.requests.map((user) => (
                        <RequestApprover key={user._id} user={user} />
                    ))}
                </div>:
                <div className="rounded-md flex gap-2  flex-grow text-text-light justify-center items-center p-2">
                <HiUserAdd className="text-3xl" />
               No Follow Requests 
               </div>
            }
                  
            </div>

        </div>
    );
};

export default NotificationsRequests;
