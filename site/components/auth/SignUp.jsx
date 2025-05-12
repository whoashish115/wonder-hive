import React, { useState, useContext, useEffect } from "react";
import { Context } from "../../store/provider";
import { signUpAction } from "../../store/actions/globalActions/authActions";
import { motion } from "framer-motion";
import {
  AtSymbolIcon,
  EnvelopeIcon,
  EyeIcon,
  EyeSlashIcon,
  KeyIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import AuthPagesCover from "./AuthPagesCover";
import Link from "next/link";
import { postData } from "../../utils/fetchData";
import { useRouter } from "next/router";
import { Loader } from "..";
import useStore from "@/hooks/useStore";
import Preloader from "../customs/Preloader";
import dynamic from "next/dynamic";

const PasswordChecklist = dynamic(() => import('react-password-checklist'), {ssr:false})

const SignUp = () => {
  const initialState = {
    firstname: "",
    lastname: "",
    username: "",
    email: "",
    password: "",
    cfpassword: "",
  };
  const [userData, setUserData] = useState(initialState);
  const { firstname, lastname, username, email, password, cfpassword } =
    userData;
  const fullname = `${firstname}${Boolean(lastname) ? " " : ""}${lastname}`;

  const [usernameAvailability, setUsernameAvailability] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showCfPassword, setShowCfPassword] = useState(false);
  const [passwordValid, setPasswordValid] = useState(false);
  const [loading, setLoading] = useState(false);

  const [accept, setAccept] = useState(false);

  const router = useRouter();
  const { state, dispatch } = useStore();
  useEffect(() => {
    if (state.auth.user?._id) {
      router.push("/");
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };
  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      setUsernameAvailability(null);
      if (username) {
        const res = await postData("auth/check_username", { username });
        if (res.error) {
          if (res.status == 503) setUsernameAvailability(null);
          else setUsernameAvailability(false);
        } else setUsernameAvailability(true);
      }
    }, 400);
    return () => clearTimeout(delayDebounce);
  }, [username]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    await signUpAction(
      dispatch,
      {
        ...userData,
        username: username.toLowerCase().replace(/ /g, ""),
        fullname,
      }
    );

    setTimeout(() => {
      setLoading(false);
      setUserData(initialState);
      router.push("/auth/signin");
    }, 5000);
  };

  return (
    <AuthPagesCover
      title="Sign Up"
      description="Lorem ipsum dolor labori Doloremque totam blanditiis similique provident, corporis error suscipit nostrum, inventore quos praesentium, aspernatur doloribus."
    >
      <form onSubmit={handleSubmit} className="flex-col flex gap-4 py-4">

        <div className="flex flex-col md:flex-row gap-2">
          <div className="w-full md:w-1/2">
            <label
              htmlFor="firstname"
              className="block mb-2 text-sm font-medium capitalize "
            >
              first name
            </label>
            <div className={`relative border-2 border-background-light ${firstname.length > 0 && "bg-background-dark dark:bg-background-light"} outline-none sm:text-sm rounded-xl focus:ring-primary-main flex items-center justify-center focus:border-primary-main  w-full p-2.5`}>
              <UserIcon
                className={`w-6 h-6 mx-2 ${firstname.length > 0 ? "text-text-dark" : "text-text-light"
                  }`}
              />
              <input
                id="firstname"
                name="firstname"
                type="text"
                placeholder="first name"
                value={firstname}
                onChange={handleInputChange}
                className="outline-none !p-0 !ring-0 mx-1 bg-transparent placeholder:text-text-light border-none w-full"
              />
            </div>
          </div>
          <div className="w-full md:w-1/2">
            <label
              htmlFor="lastname"
              className="block mb-2 text-sm font-medium capitalize "
            >
              last name
            </label>
            <div className={`relative border-2 border-background-light ${lastname.length > 0 && "bg-background-dark dark:bg-background-light"} outline-none sm:text-sm rounded-xl focus:ring-primary-main flex items-center justify-center focus:border-primary-main  w-full p-2.5`}>

              <UserIcon
                className={`w-6 h-6 mx-2 ${lastname.length > 0 ? "text-text-dark" : "text-text-light"
                  }`}
              />
              <input
                id="lastname"
                name="lastname"
                type="text"
                placeholder="last name"
                value={lastname}
                onChange={handleInputChange}
                className="outline-none !p-0 !ring-0 mx-1 bg-transparent placeholder:text-text-light border-none w-full"
              />
            </div>
          </div>
        </div>

        <div>
          <label
            htmlFor="username"
            className="block mb-2 text-sm font-medium capitalize "
          >
            username
          </label>
          <div className={`relative border-2 border-background-light ${username.length > 0 && "bg-background-dark dark:bg-background-light"} outline-none sm:text-sm rounded-xl focus:ring-primary-main flex items-center justify-center focus:border-primary-main  w-full p-2.5`}>

            <AtSymbolIcon
              className={`w-6 h-6 mx-2 ${username.length > 0 ? "text-text-dark" : "text-text-light"
                }`}
            />
            <input
              id="username"
              name="username"
              type="text"
              placeholder="username"
              value={username}
              onChange={handleInputChange}
              className="outline-none !p-0 !ring-0 mx-1 bg-transparent placeholder:text-text-light border-none w-full"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="email"
            className="block mb-2 text-sm font-medium capitalize "
          >
            email
          </label>
          <div className={`relative border-2 border-background-light ${email.length > 0 && "bg-background-dark dark:bg-background-light"} outline-none sm:text-sm rounded-xl focus:ring-primary-main flex items-center justify-center focus:border-primary-main  w-full p-2.5`}>

            <EnvelopeIcon
              className={`w-6 h-6 mx-2  ${email.length > 0 ? "text-text-dark" : "text-text-light"
                }`}
            />
            <input
              id="email"
              name="email"
              type="email"
              placeholder="name@company.com"
              value={email}
              onChange={handleInputChange}
              className="outline-none !p-0 !ring-0 mx-1 bg-transparent placeholder:text-text-light border-none w-full"
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-2">
          <div className="w-full md:w-1/2">
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium capitalize "
            >
              Password
            </label>
            <div className={`relative border-2 border-background-light ${password.length > 0 && "bg-background-dark dark:bg-background-light"} outline-none sm:text-sm rounded-xl focus:ring-primary-main flex items-center justify-center focus:border-primary-main  w-full p-2.5`}>
              <KeyIcon
                className={`w-6 h-6 p-0.5 mx-1.5 flex-shrink-0 ${password.length > 0 ? "text-text-dark" : "text-text-light"
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
                  className={`w-6 h-6 p-0.5 mx-1.5 flex-shrink-0 cursor-pointer ${password.length > 0 ? "text-text-dark" : "text-text-light"
                    }`}
                />
              ) : (
                <EyeSlashIcon
                  onClick={() => setShowPassword(!showPassword)}
                  className={`w-6 h-6 p-0.5 mx-1.5 flex-shrink-0 cursor-pointer ${password.length > 0 ? "text-text-dark" : "text-text-light"
                    }`}
                />
              )}
            </div>
          </div>

          <div className="w-full md:w-1/2">
            <label
              htmlFor="cfpassword"
              className="block mb-2 text-sm font-medium capitalize "
            >
              Confirm Password
            </label>
            <div className={`relative border-2 border-background-light ${cfpassword.length > 0 && "bg-background-dark dark:bg-background-light"} outline-none sm:text-sm rounded-xl focus:ring-primary-main flex items-center justify-center focus:border-primary-main  w-full p-2.5`}>

              <KeyIcon
                className={`w-6 h-6 p-0.5 mx-1.5 flex-shrink-0 ${cfpassword.length > 0 ? "text-text-dark" : "text-text-light"
                  }`}
              />
              <input
                id="cfpassword"
                name="cfpassword"
                type={showCfPassword ? "text" : "password"}
                placeholder="••••••••"
                value={cfpassword}
                onChange={handleInputChange}
                className="outline-none !p-0 !ring-0 mx-1 bg-transparent placeholder:text-text-light border-none w-full"
              />
              {showCfPassword ? (
                <EyeIcon
                  onClick={() => setShowCfPassword(!showCfPassword)}
                  className={`w-6 h-6 p-0.5 mx-1.5 flex-shrink-0 cursor-pointer ${cfpassword.length > 0 ? "text-text-dark" : "text-text-light"
                    }`}
                />
              ) : (
                <EyeSlashIcon
                  onClick={() => setShowCfPassword(!showCfPassword)}
                  className={`w-6 h-6 p-0.5 mx-1.5 flex-shrink-0 cursor-pointer ${cfpassword.length > 0 ? "text-text-dark" : "text-text-light"
                    }`}
                />
              )}
            </div>
          </div>
        </div>

<div className={`${password ? 'scale-y-100 h-auto' : 'scale-y-0 h-0'}  flex flex-col p-2 pt-0 text-sm`}>
        <PasswordChecklist
				rules={["minLength","specialChar","number","capital","match"]}
				minLength={5}
				value={password}
				valueAgain={cfpassword}
				onChange={setPasswordValid}
        />
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-start">
            <motion.div
              whileTap={{ scale: 0.8 }}
              className="flex items-center h-5"
            >
              <input
                id="remember"
                type="checkbox"
                className="w-4 h-4 text-primary-main !ring-0 focus:ring-offset-0 bg-background-light rounded-sm"
                checked={accept}
                onChange={(e) => setAccept(e.target.checked)}
              />
            </motion.div>
            <div className="ml-3 text-sm capitalize">
              <label htmlFor="remember">I accept to term and conditions</label>
            </div>
          </div>

        </div>

        <button
          type="submit"
          disabled={loading || !accept || !firstname || !username || !email || !passwordValid}
          className="w-full border-2 border-background-light disabled:text-text-light/60 disabled:bg-background-light  disabled:hover:bg-background-light text-white capitalize light bg-primary-main hover:bg-primary-dark font-medium rounded-custom text-sm px-5 py-2.5 text-center"
        >
          {loading ? <Preloader /> : 'sign up'}
        </button>
        <p className="text-sm font-light capitalize">
          already have an account ?{" "}
          <Link href="/auth/signin">
            <span className="font-medium text-primary-light hover:underline">
              sign in
            </span>
          </Link>
        </p>
      </form>
    </AuthPagesCover>
  );
};

export default SignUp;
