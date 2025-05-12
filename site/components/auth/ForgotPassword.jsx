import React, { useState, useContext, useEffect } from "react";
import AuthPagesCover from "./AuthPagesCover";
import { EnvelopeIcon } from "@heroicons/react/24/outline";
import useStore from "@/hooks/useStore";
import { useRouter } from "next/router";
import { forgotPasswordAction } from "@/store/actions/globalActions/authActions";
import validateEmail from "@/utils/validate";
import Loader from "../customs/Loader";
import { useTimer } from 'react-timer-hook';

const ForgotPassword = () => {
  const initialState = { email: "", message: '', error: '' };
  const [userData, setUserData] = useState(initialState);
  const { email, message, error } = userData;
  const [loading, setLoading] = useState(false);
  const [firstSend, setFirstSend] = useState(false);
  const [timer, setTimer] = useState(false);

  const router = useRouter();
  const { state, dispatch } = useStore();
  useEffect(() => {
    if (state.auth.user?._id) {
      router.push("/");
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value, error: "", success: "" });
  };
  const { totalSeconds, restart } = useTimer({ expiryTimestamp: new Date(Date.now() + 60000), onExpire: () => { setTimer(false) } });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { message, error } = await forgotPasswordAction(email)
    if (message) {
      setTimer(true)
      setFirstSend(true)
      restart(new Date(Date.now() + 60000))
    }
    setUserData({ ...userData, error, message })
    setLoading(false);
  };

  return (
    <AuthPagesCover
      title="password recovery"
      description="Tell us your email so we can send you a reset link"
    >
      <form onSubmit={handleSubmit} className="flex-col flex gap-4 py-4">
        <div>
          <label
            htmlFor="email"
            className="block mb-2 text-sm font-medium capitalize "
          >
            email
          </label>
          <div
            className={`relative border-2 border-background-light ${email.length > 0 && "bg-background-light"
              } outline-none sm:text-sm rounded-xl focus:ring-primary-main flex items-center justify-center focus:border-primary-main  w-full p-2.5`}
          >
            <EnvelopeIcon
              className={`w-6 h-6 mx-2 ${email.length > 0 ? "text-text-dark" : "text-text-light"
                }`}
            />
            <input
              id="email"
              name="email"
              placeholder="name@company.com/__xyz__"
              value={email}
              onChange={handleInputChange}
              className="outline-none !p-0 !ring-0 mx-1 bg-transparent placeholder:text-text-light border-none w-full"
            />
          </div>
        </div>
        {error && <div className="text-error-main  text-sm font-normal">{error}</div>}
        {message && <div className="text-success-main  text-sm font-normal">{message}</div>}
        <button
          type="submit"
          disabled={loading || (firstSend ? totalSeconds != 0 : false)}
          className="w-full border-2 border-background-light disabled:text-text-light/60 disabled:hover:bg-background-light disabled:bg-background-light text-white capitalize light bg-primary-main hover:bg-primary-dark font-medium rounded-full text-sm px-5 py-2.5 text-center"
        >
          {loading ? <Loader /> : (firstSend ? (timer ? `wait till ${totalSeconds}s to resend` : 'Resend Recovery Link') : "Recover password")}
        </button>
      </form>
    </AuthPagesCover>
  );
};

export default ForgotPassword;
