import React, {  useEffect, useState } from "react";
import AuthPagesCover from "./AuthPagesCover";
import { useRouter } from "next/router";
import { EyeIcon, EyeSlashIcon, KeyIcon } from "@heroicons/react/24/outline";
import useStore from "@/hooks/useStore";
import dynamic from "next/dynamic";
import Loader from "../customs/Loader";
import { resetPasswordAction } from "@/store/actions/globalActions/authActions";
import Link from "next/link";

const PasswordChecklist = dynamic(() => import('react-password-checklist'), { ssr: false })

const ResetPassword = () => {
  const initialState = { password: "", cfpassword: "", error: '', message: '' };
  const [userData, setUserData] = useState(initialState);
  const { password, cfpassword, error, message } = userData;
  const [loading, setLoading] = useState(false);
  const [passwordValid, setPasswordValid] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showCfPassword, setShowCfPassword] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { message, error } = await resetPasswordAction({ password, token: router.query.token })
    setUserData({ password:'', cfpassword:'', message, error })
    setLoading(false);
  };

  return (
    <AuthPagesCover
      title="password reset"
      description="reset your account password"
    >
      <form onSubmit={handleSubmit} className="flex-col flex gap-4 py-4">
        <div>
          <label
            htmlFor="password"
            className="block mb-2 text-sm font-medium capitalize "
          >
            Password
          </label>
          <div
            className={`relative border-2 border-background-light ${password.length > 0 && "bg-background-light"
              } outline-none sm:text-sm rounded-xl focus:ring-primary-main flex items-center justify-center focus:border-primary-main  w-full p-2.5`}
          >
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

        <div>
          <label
            htmlFor="cfpassword"
            className="block mb-2 text-sm font-medium capitalize "
          >
            Confirm Password
          </label>
          <div
            className={`relative border-2 border-background-light ${cfpassword.length > 0 && "bg-background-light"
              } outline-none sm:text-sm rounded-xl focus:ring-primary-main flex items-center justify-center focus:border-primary-main  w-full p-2.5`}
          >
            <KeyIcon
              className={`w-6 h-6 mx-2 ${cfpassword.length > 0 ? "text-text-dark" : "text-text-light"
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
                className={`w-6 h-6 mx-2 cursor-pointer ${cfpassword.length > 0 ? "text-text-dark" : "text-text-light"
                  }`}
              />
            ) : (
              <EyeSlashIcon
                onClick={() => setShowCfPassword(!showCfPassword)}
                className={`w-6 h-6 mx-2 cursor-pointer ${cfpassword.length > 0 ? "text-text-dark" : "text-text-light"
                  }`}
              />
            )}
          </div>
        </div>
        <div className={`${password ? 'scale-y-100 h-auto' : 'scale-y-0 h-0'}  flex flex-col p-2 pt-0 text-sm`}>
          <PasswordChecklist
            rules={["minLength", "specialChar", "number", "capital", "match"]}
            minLength={5}
            value={password}
            valueAgain={cfpassword}
            onChange={setPasswordValid}
          />
        </div>
        {error && <div className="text-error-main  text-sm font-normal">{error}</div>}
        {message && <div className="text-success-main  text-sm font-normal">{message} <br/> <Link href="/?new=true"><span className="text-primary-main">Go back to login page</span></Link></div>}
        <button
          type="submit"
          disabled={loading || !passwordValid}
          className="w-full border-2 border-background-light disabled:text-text-light/60 disabled:hover:bg-background-light disabled:bg-background-light text-white capitalize light bg-primary-main hover:bg-primary-dark font-medium rounded-custom text-sm px-5 py-2.5 text-center"
        >
          {loading ? <Loader /> : 'Reset password'}
        </button>
      </form>
    </AuthPagesCover>
  );
};

export default ResetPassword;
