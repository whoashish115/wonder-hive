import React from "react";
import { ContextProvider } from "../store/provider";
import { Layout } from "../components";

import "../styles/global.css";
import 'swiper/css';
import 'swiper/css/pagination';

export default function MyApp(props) {
  return (
    <ContextProvider>
        <Layout {...props} />
    </ContextProvider>
  );
}
