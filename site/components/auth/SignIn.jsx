import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../store/provider";
import { removeAccount, signInAccountAction, signInAction } from "../../store/actions/globalActions/authActions";
import AuthPagesCover from "./AuthPagesCover";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  EnvelopeIcon,
  EyeIcon,
  EyeSlashIcon,
  KeyIcon,
} from "@heroicons/react/24/outline";
import { useRouter } from "next/router";
import useStore from "@/hooks/useStore";
import Image from "next/image";
import { HiX } from "react-icons/hi";
import Loader from "../customs/Loader";
import GLOBAL_TYPES from "@/store/types/globalTypes";

const SignIn = () => {
  const initialState = {
    emailUsername: "",
    password: "",
  };
  const [userData, setUserData] = useState(initialState);
  const { emailUsername, password } = userData;

  const router = useRouter();
  const { state, dispatch } = useStore();
  const { accounts } = state
  useEffect(() => {
    if (state.auth.user?._id) {
      router.push("/");
    }
  }, []);

  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [signInNew, setSignInNew] = useState(router.query.new ? true : false);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)
    await signInAction(dispatch, {...userData, remember});
    setLoading(false)
  };

  useEffect(() => {
    if (router.query.new || accounts.length == 0) {
      setSignInNew(true)
    }
  }, [router.query.new])

  const handleAddAccount = () => {
    if(accounts.length > 10){
      dispatch({type:GLOBAL_TYPES.ALERT_ERROR, payload:'Account limit reached, remove few accounts to signin into another'})
    }
    else{
      setSignInNew(true)
    }
  }


  return (
    <AuthPagesCover
      title="Sign In"
      description="Lorem ipsum dolor labori Doloremque totam blanditiis similique provident, corporis error suscipit nostrum, inventore quos praesentium, aspernatur doloribus."
    >
          {accounts.map((account,i) => (
            <div key={i} className="py-2 px-4 w-full hover:bg-background-extralight border-background-extralight border rounded-custom flex cursor-pointer justify-center items-center gap-3">
              <Image
                src={account.profileImage}
                width={100}
                height={100}
                className="w-14 h-14 rounded-full object-cover object-center "
              />
              <div className="flex-grow flex flex-col break-words w-10">
                <h5 className="text-sm font-semibold">
                  {account.fullname}
                </h5>
                <p className="text-xs font-light text-text-light">
                  {"@" + account.username}
                </p>
              </div>
              <button
                onClick={() => signInAccountAction(dispatch, account._id)}
                className=" rounded-xl flex items-center text-white justify-center px-4 py-2 text-sm capitalize bg-background-light border border-border-outline/50 hover:bg-primary-main"

              >login</button>
              <div onClick={() => removeAccount(dispatch, account._id)} className="text-xl text-text-light hover:text-text-dark p-1">
                <HiX />
              </div>
            </div>
          ))}
       {!signInNew &&
          <button
          onClick={handleAddAccount}
          type="submit"
          className="w-full border-2 border-background-light disabled:text-text-light/60 disabled:hover:bg-background-light disabled:bg-background-light text-white capitalize light bg-primary-main hover:bg-primary-dark font-medium rounded-custom text-sm px-5 py-2.5 text-center"
        >
Add Another Account
        </button>}
          
      {signInNew && 
      <form onSubmit={handleSubmit} className="flex-col flex gap-4 py-4">
        <div>
          <label
            htmlFor="emailUsername"
            className="block mb-2 text-sm font-medium capitalize "
          >
            Email/Username
          </label>
          <div className={`relative border-2 border-background-dark dark:border-background-light ${emailUsername.length > 0 && "bg-background-light"} outline-none sm:text-sm rounded-xl focus:ring-primary-main flex items-center justify-center focus:border-primary-main  w-full p-2.5`}>

            <EnvelopeIcon
              className={`w-6 h-6 mx-2 ${emailUsername.length > 0 ? "text-text-dark" : "text-text-light"
                }`}
            />
            <input
              id="emailUsername"
              name="emailUsername"
              type="emailUsername"
              placeholder="name@company.com/xyz"
              value={emailUsername}
              onChange={handleInputChange}
              className="outline-none !p-0 !ring-0 mx-1 bg-transparent placeholder:text-text-light border-none w-full"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="password"
            className="block mb-2 text-sm font-medium capitalize "
          >
            Password
          </label>
          <div className={`relative border-2 border-background-dark dark:border-background-light ${password.length > 0 && "bg-background-light"} outline-none sm:text-sm rounded-xl focus:ring-primary-main flex items-center justify-center focus:border-primary-main  w-full p-2.5`}>

            <KeyIcon
              className={`w-6 h-6 mx-2 ${password.length > 0 ? "text-text-dark" : "text-text-light"
                }`}
            />
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={handleInputChange}
              className="outline-none !p-0 !ring-0 mx-1 bg-transparent placeholder:text-text-light border-none w-full"
            />
            {showPassword ? (
              <EyeIcon
                onClick={() => setShowPassword(!showPassword)}
                className={`w-6 h-6 mx-2 cursor-pointer ${password.length > 0 ? "text-text-dark" : "text-text-light"
                  }`}
              />
            ) : (
              <EyeSlashIcon
                onClick={() => setShowPassword(!showPassword)}
                className={`w-6 h-6 mx-2 cursor-pointer ${password.length > 0 ? "text-text-dark" : "text-text-light"
                  }`}
              />
            )}
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-start">
            <motion.div
              whileTap={{ scale: 0.8 }} className="flex items-center h-5">
              <input
                id="remember"
                type="checkbox"
                className="w-5 h-5 text-primary-main !ring-0 focus:ring-offset-0 bg-background-light rounded-sm"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
            </motion.div>
            <div className="ml-3 text-sm capitalize">
              <label htmlFor="remember">Remember me</label>
            </div>
          </div>

          <Link href="/auth/forgotpassword">
            <span className="text-sm font-medium hover:underline text-primary-light capitalize">
              Forgot password ?
            </span>
          </Link>
        </div>
        <button
          type="submit"
          disabled={loading || !emailUsername || !password}
          className="w-full border-2 border-background-light disabled:text-text-light/60 disabled:hover:bg-background-light disabled:bg-background-light text-white capitalize light bg-primary-main hover:bg-primary-dark font-medium rounded-custom text-sm px-5 py-2.5 text-center"
        >

          {loading ? <Loader /> : 'Sign in'}
        </button>
        <p className="text-sm font-light capitalize">
          Dont have an account yet ?{" "}
          <Link href="/auth/signup">
            <span className="font-medium text-primary-light hover:underline">
              Sign up
            </span>
          </Link>
        </p>
      </form>}
    </AuthPagesCover>
  );
};

export default SignIn;
