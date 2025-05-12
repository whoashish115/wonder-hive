import React, { useEffect, useState } from "react";
import {
  HiOutlineUserAdd,
  HiOutlineUserCircle,
  HiOutlineUserRemove,
} from "react-icons/hi";
import useStore from "@/hooks/useStore";
import {
  followRequestUserProfile,
  unfollowUserProfile,
} from "@/store/actions/profileActions";
import { UserCheck } from "react-feather";

const SmallFollow = ({ user }) => {
  const [isFollowLoading, setIsFollowLoading] = useState(false);
  const { state, dispatch } = useStore();
  const { auth, profiles, socket } = state;
  const [followed, setFollowed] = useState(false);
  const [requested, setRequested] = useState(false);
  const handleFollow = () => {
    if (isFollowLoading) return;
    setIsFollowLoading(true);
    followRequestUserProfile(dispatch, { user: user, auth, socket });
    if (user.accountPrivate) {
      setRequested(true);
      setFollowed(false);
    } else {
      setRequested(false);
      setFollowed(true);
    }

    setIsFollowLoading(false);
  };
  const handleUnfollow = () => {
    if (isFollowLoading) return;
    setIsFollowLoading(true);

    unfollowUserProfile(dispatch, { user: user, auth, socket });
    setRequested(false);
    setFollowed(false);

    setIsFollowLoading(false);
  };

  useEffect(() => {
    if (user.requests?.find((item) => item._id === auth.user._id)) {
      setRequested(true);
    }
  }, [user.requests, user._id]);
  useEffect(() => {
    if (auth.user.followings.find((item) => item._id === user._id)) {
      setFollowed(true);
    }
  }, [auth.user.followings, user._id]);

  return (
    <>
      {auth.user._id !== user._id &&
        (requested || followed ? (
          requested ? (
            <button
              onClick={handleUnfollow}
              className=" rounded-xl flex items-center text-text-dark justify-center p-2 text-lg capitalize bg-background-light hover:bg-primary-extralight"
            >
              <UserCheck className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={handleUnfollow}
              className=" rounded-xl flex items-center text-text-dark justify-center p-2 text-xl capitalize bg-background-light hover:bg-background-dark"
            >
              <HiOutlineUserRemove />
            </button>
          )
        ) : (
          <button
            onClick={handleFollow}
            className=" rounded-xl flex items-center text-white justify-center p-2 text-xl capitalize bg-primary-main hover:bg-primary-dark"
          >
            <HiOutlineUserAdd />
          </button>
        ))}
    </>
  );
};

export default SmallFollow;
