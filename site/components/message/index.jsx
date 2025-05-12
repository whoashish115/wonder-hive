import React from "react";
import Conversations from "./Conversations";

const Index = () => {
  return (
    <div className="flex flex-grow w-full max-h-[calc(100vh-64px)] md:max-h-[calc(100vh-56px)] m-[-12px] md:m-0 min-h-[500px] h-full "     >
      <div className="w-full flex antialiased  bg-background-dark overflow-hidden ">
        <main className="flex-grow flex flex-row   ">
          <Conversations />
          <div className=" flex-grow  md:border-l  hidden md:flex border-border-outline w-full h-full bg-background-light rounded-custom">
              <div className="flex items-center justify-center flex-col flex-auto w-full">
                <div className="max-w-md text-center ">
                  <h4 className="font-semibold uppercase text-lg mb-2">
                    Select a chat 
                  </h4>
                  <p className="text-text-light capitalize">
                    message your online friends
                  </p>
                </div>
              </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
