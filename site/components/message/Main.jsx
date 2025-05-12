import React from "react";
import Conversations from "./Conversations";
import Chat from "./Chat";

const User = () => {
  return (
    <div className="flex flex-grow w-full  max-h-[calc(100vh-64px)] md:max-h-[calc(100vh-56px)] m-[-12px] md:m-0 min-h-[500px]">
      <div className="w-full flex antialiased bg-background-dark overflow-hidden ">

          <main className="flex-grow  flex-row flex ">
            <div className=" hidden md:flex flex-shrink-0 flex-grow-0">
            <Conversations />
            </div>
            <div className="flex md:border-l border-border-outline  flex-row items-stretch justify-stretch w-full">
            <Chat />
            </div>
          </main>
      </div>
    </div>
  );
};

export default User;
