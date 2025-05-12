import React from "react";
import Link from "next/link";

const ErrorPage = (props) => {
  const { title,subtitle, description, button = false } = props;
  return (
    <div className="bg-background-dark flex justify-center items-center min-h-screen">
      <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
        <div className="mx-auto max-w-screen-sm text-center">
           <h1 className="mb-4 text-3xl tracking-tight sm:text-4xl font-bold md:text-5xl lg:text-6xl xl:text-8xl">
            {title}
          </h1>
           <h5 className="mb-6 text-xl tracking-widest uppercase text-primary-light font-bold">
            {subtitle}
          </h5>
          <p className="mb-4 text-md font-normal text-text-light">
           {description}
          </p>
          {button && <Link href="/">
            <div
            className="inline-flex text-base text-white capitalize bg-primary-main hover:bg-primary-dark focus:outline-none font-medium rounded-full px-5 py-2.5 text-center my-4"
          >
            Back to Homepage
        </div>
          </Link>}
      </div>
      </div>
    </div>
  );
};

export default ErrorPage;
