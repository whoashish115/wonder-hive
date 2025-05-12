// src/components/CustomSwitch.js
import React, { useState } from "react";

const Switch = (props) => {
  const { enabled, handleToggle } =  props;
  return (
    <div
      className={`relative inline-flex items-center h-6 rounded-full w-11 cursor-pointer transition-colors duration-300 ease-in-out ${
        enabled ? "bg-primary-main" : "bg-background-dark"
      }`}
      onClick={handleToggle}
    >
      <span
        className={`inline-block w-4 h-4 border border-border-outline/60 transform  rounded-full transition-transform duration-300 ease-in-out ${
          enabled ? "translate-x-6 bg-white" : "translate-x-1 bg-background-extralight"
        }`}
      />
    </div>
  );
};

export default Switch;
