import React, { useContext, useEffect } from "react";
import { Context } from "../../store/provider";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";

const AuthPagesCover = (props) => {
  const { title, description, children } = props;

  const { state } = useContext(Context);
  const { auth } = state;
  const router = useRouter();

  useEffect(() => {
    if (
      router.pathname !== "/auth/user/activate/[token]" &&
      Object.keys(auth).length !== 0
    )
      router.push("/");
  }, [auth, router.pathname]);

  useEffect(() => {
    if(auth.user) router.push('/')
  }, [auth]);


  return (
      <div className="min-h-screen w-full h-full px-4 py-6 md:px-8 md:py-12 flex flex-col items-center overflow-y-auto">

<Link href="/">
        <div className="inline-flex gap-2 md:col-span-1 text-2xl tracking-wider font-bold p-4 ">
          {/* <Image width={500} height={100} className=" object-cover w-[250px] md:w-[270px] object-center" src={state.theme.mode == "light" ?"/images/logo-light.png":"/images/logo-dark.png"}/> */}
        </div>
        </Link>


        <div className="rounded-custom shadow bg-background-main md:mt-0 sm:max-w-xl xl:p-0 w-full">
          <div className="p-6 md:p-8 gap-2 flex flex-col md:gap-4 ">
              <h1 className="text-xl lg:text-3xl font-bold leading-tight tracking-tight md:text-2xl capitalize">
                {title}
              </h1>
              <p className="text-sm text-text-light">{description}</p>
            {children}
          </div>
        
        </div>
      </div>
  );
};

export default AuthPagesCover;
