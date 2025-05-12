import useStore from "@/hooks/useStore";
import React, { useEffect, useState } from "react";
import GLOBAL_TYPES from "@/store/types/globalTypes";

import Button from "../customs/Button";
import { MdModeEditOutline } from "react-icons/md";
import { HiCamera, HiCheck, HiOutlineCamera, HiX } from "react-icons/hi";
import { mediaTools, textTools } from "@/utils/tools";
import { updateUserProfile } from "@/store/actions/profileActions";
import { BiImageAdd } from "react-icons/bi";
import Switch from "../customs/Switch";
import { deleteData, getData } from "@/utils/fetchData";
import Image from "next/image";
import { Loader } from "react-feather";
import Preloader from "../customs/Preloader";

const AccountSettings = () => {
  const { state, dispatch } = useStore();
  const { auth, socket } = state;

  const [checkedUsername, setCheckedUsername] = useState(false);
  const [userData, setUserData] = useState({});
  const [loadingUser, setLoadingUser] = useState(true);
  const {
    fullname,
    username,
    gender,
    website,
    showActivity,
    accountPrivate,
    bio,
  } = userData;

  const [profileImage, setProfileImage] = useState("");
  const isChanged =
    Boolean(profileImage ||
    (username !== auth.user.username && username && checkedUsername) ||
    fullname !== auth.user.fullname ||
    bio !== auth.user.bio ||
    gender !== auth.user.gender ||
    (website ? (textTools.isUrl(website) && (website !== auth.user.website)):(website !== auth.user.website))||
    showActivity !== auth.user.showActivity ||
    accountPrivate !== auth.user.accountPrivate);

  useEffect(() => {
    setUserData(auth.user);
    setLoadingUser(false)
  }, [auth.user]);

  const handleChangeProfileImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    let error = "";
    if (!file) error = "File does not exists";

    if (!file.size) error = "Invalid File Size";

    if (file.size > 1024 * 1024 * 10) error = "File is larger than 10mb";

    if (file.type !== "image/jpeg" && file.type !== "image/png")
      error = "File format is incorrect";

    if (error)
      return dispatch({ type: GLOBAL_TYPES.ALERT, payload: { error: err } });
    setProfileImage(file);
  };
  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    if(name == 'bio' && value.length >500) {
    setUserData({ ...userData, bio: value.slice(0, 500) });
    }
    else{
      setUserData({ ...userData, [name]: value });
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    updateUserProfile(dispatch, { userData, profileImage, auth, socket });
  };
  const handleCancel = (e) => {
    setUserData(auth.user);
    setProfileImage("");
    setCoverImage("");
  };

  const handleDeleteAccount = async () => {
    if (window.confirm("Are you sure you want to delete this account?")) {
      dispatch({ type: GLOBAL_TYPES.ALERT, payload: { loading: true } });
      const res = await deleteData(`delete/${auth.user._id}`, auth.token);
      if (res.error)
        return dispatch({ type: GLOBAL_TYPES.ALERT_ERROR, payload: res.error });

      localStorage.removeItem("firstlogin");
      localStorage.removeItem("");
      localStorage.removeItem("palettecolor");

      dispatch({
        type: GLOBAL_TYPES.ALERT_SUCCESS,
        payload: "Your Account had been Deleted",
      });
      window.location.href = "/";
    }
  };

  useEffect(() => {
    const handleCheckUsername =  async () => {
      if(username && username !== auth.user.username){
        const res = await getData(`/user/check/${username}`)
          setCheckedUsername(res.isAvailable)
      }
    } 
    let timer = setTimeout(handleCheckUsername, 500)
    return () => clearTimeout(timer)
  }, [username])

  return (
    <div className="bg-background-light rounded-custom w-full p-8 gap-8 flex flex-col">
      <h5 className="text-xl">Account</h5>

    {loadingUser ? <Preloader/> :  <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-6 flex-grow">
          <div className="flex gap-6 items-start">
            <div className="grid gap-4 w-full">
              <div className="flex item-center flex-col gap-2 flex-grow justify-between">
                <div className="text-text-light flex-grow w-full ">
                  Fullname
                </div>
                <input
                  id="fullname"
                  name="fullname"
                  value={fullname}
                  onChange={handleChangeInput}
                  className="outline-none !py-2 !px-4 !ring-0 mx-1 bg-background-extralight rounded-custom placeholder:text-text-light border-2 border-transparent hover:border-border-outline focus:border-border-outline w-full"
                />
              </div>
            <div className="grid gap-4 md:grid-cols-2 w-full">
              <div className="flex item-center flex-col gap-2 flex-grow w-full justify-between">
                <div className="text-text-light flex-grow w-full ">
                  Username
                </div>
                <div className="flex flex-row gap-2 items-center w-full">

                <input
                  id="username"
                  name="username"
                  value={"@" + username}
                  onChange={(e) =>
                    setUserData({
                      ...userData,
                      username: e.target.value.replaceAll(
                        /[^a-zA-Z0-9_.]/g,
                        ""
                      ),
                    })
                  }
                  className="outline-none !py-2 flex-grow !px-4 !ring-0 mx-1  bg-background-extralight disabled:text-text-light rounded-custom placeholder:text-text-light border-2 border-transparent hover:border-border-outline focus:border-border-outline w-full"
                />
                <div>
                  {username !== auth.user.username &&
                    <span className="flex-shrink-0 text-2xl">
                      {
                        ( checkedUsername) ? <HiCheck className="text-success-main"/> :<HiX className="text-error-main"/>
                      }
                    </span>
              }
                </div>
              </div>
              </div>
              <div className="flex item-center flex-col flex-grow gap-4 justify-between">
              <div className="text-text-light  w-full ">Website</div>
              <input
                id="website"
                name="website"
                value={website}
                onChange={handleChangeInput}
                className="outline-none !py-2 !px-4  !ring-0 mx-1  bg-background-extralight disabled:text-text-light rounded-custom placeholder:text-text-light border-2 border-transparent hover:border-border-outline focus:border-border-outline w-full"
              />
            </div>
            </div>
            
            </div>
            <div className="flex item-center flex-col gap-4 justify-center flex-grow">
              <div className=" flex-shrink-0 relative group rounded-full overflow-hidden w-[100px] h-[100px] md:w-[200px] md:h-[200px] ">
                <Image
                  src={
                    profileImage
                      ? URL.createObjectURL(profileImage)
                      : auth.user.profileImage
                  }
                  alt="Profile Photo"
                  width={200}
                  height={200}
                  className="w-[100px] h-[100px] md:w-[200px] md:h-[200px] rounded-full object-cover"
                />
                <div>
                  <input
                    type="file"
                    name="file"
                    hidden
                    id="profile-image-file-input"
                    accept="image/*"
                    onChange={handleChangeProfileImage}
                  />
                  <label
                    htmlFor="profile-image-file-input"
                    className="bg-black/60 border border-border-outline rounded-full transition-all cursor-pointer absolute top-0 z-20 left-0 bottom-0 right-0 w-full h-full flex justify-center items-center group-hover:opacity-100 opacity-0"
                  >
                    <span>
                      <BiImageAdd className="text-4xl" />
                    </span>
                  </label>
                </div>
              </div>
              <div className="text-text-light w-full text-center ">Profile Image</div>
            </div>
          </div>
          <div className="flex item-center flex-col flex-grow gap-4 justify-between">
            <div className="text-text-light  w-full ">Bio</div>
            <div>
            <textarea
              id="bio"
              name="bio"
              value={bio}
              rows={8}
              onChange={handleChangeInput}
              className="outline-none !p-4 resize-none  !ring-0 mx-1  bg-background-extralight disabled:text-text-light rounded-custom placeholder:text-text-light border-2 border-transparent hover:border-border-outline focus:border-border-outline w-full"
              />
            <div className={`${bio.length >499 ? 'text-error-main ' :'text-text-light'}  text-sm flex justify-end w-full `}>{bio.length}/500</div>
              </div>
          </div>

          <div className="flex item-center flex-grow justify-between">
            <div className="text-text-light flex-grow w-full ">Gender</div>
            <select
              onChange={(e) =>
                setUserData({ ...userData, gender: e.target.value })
              }
              value={gender}
              className="block appearance-none capitalize min-w-[200px] bg-background-extralight border border-border-outline/30 px-4 py-2 pr-8 rounded-custom leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value={"male"}>Male</option>
              <option value={"female"}>Female</option>
            </select>
          </div>
          <div className="flex item-center flex-grow justify-between">
            <div className="text-text-light flex-grow w-full ">
              Show Activity
            </div>
            <div>
              <Switch
                enabled={showActivity}
                handleToggle={() =>
                  setUserData({ ...userData, showActivity: !showActivity })
                }
              />
            </div>
          </div>
          <div className="flex item-center flex-grow justify-between">
            <div className="text-text-light flex-grow w-full ">
              Account Private
            </div>
            <div>
              <Switch
                enabled={accountPrivate}
                handleToggle={() =>
                  setUserData({ ...userData, accountPrivate: !accountPrivate })
                }
              />
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-4 mt-12">
          <Button disabled={!isChanged} content="Save Changes" type="submit" />
          <button
            onClick={handleCancel}
            className="font-semibold rounded-custom flex items-center justify-center px-6 py-1.5 text-base capitalize text-primary-main hover:text-white hover:bg-primary-main border-2 border-primary-main "
          >
            Cancel
          </button>
        </div>
      </form>}
    </div>
  );
};

export default AccountSettings;
