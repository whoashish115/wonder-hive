import React, { useEffect, useState } from 'react'

import { useRouter } from "next/router";
import Link from "next/link"
import AuthPagesCover from './AuthPagesCover';
import { postData } from '../../utils/fetchData';
import { textTools } from '@/utils/tools';
import Preloader from '../customs/Preloader';

const AccountActivation = () => {
  const initialState = { error: '', success: '', loading: false };
  const [data, setData] = useState(initialState)
  const { error, success, loading } = data

  const router = useRouter();
  const { token } = router.query;

  useEffect(() => {
    if (token) {
      setData({ ...data, loading: true })
      const activationEmail = async () => {
        const res = await postData("auth/activate_user", { activation_token: token });
        setData({ success: res.message, error: res.error, loading: false })
      };
      activationEmail();
    }
  }, [token]);

  return (
    <AuthPagesCover title="account activation">
     
      <div className='flex flex-col gap-3'>
        {loading ? <Preloader/> : (error ?
          <>
            <h1 className="text-xl text-red-400 lg:text-3xl font-bold leading-tight tracking-tight md:text-2xl capitalize">
                Oops!
              </h1>
            <div className='mb-6 text-red-400'>
              {textTools.capitalize(error)}
            </div>
              <Link href="/auth/signup">
                <button
                  type="submit"
                  className="border-2 border-background-light  text-white capitalize light bg-primary-main hover:bg-primary-dark font-medium rounded-full text-sm px-5 py-2.5 text-center"
                >
                  Register Again
                </button>
              </Link>
          </>
          : success &&
          <>
            <h1 className="text-xl text-green-400 lg:text-3xl font-bold leading-tight tracking-tight md:text-2xl capitalize">
                Awesome!
              </h1>
            <div className='mb-6'>
              {textTools.capitalize(success)}
            </div>
              <Link href="/auth/signin">
                <button
                  type="submit"
                  className="border-2 border-background-light  text-white capitalize light bg-primary-main hover:bg-primary-dark font-medium rounded-full text-sm px-5 py-2.5 text-center"
                >
                  Go To Login Page
                </button>
              </Link>
          </>
        )}
      </div>
    </AuthPagesCover>
  );
}

export default AccountActivation