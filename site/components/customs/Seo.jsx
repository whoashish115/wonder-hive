import React from "react"
import Head from "next/head"
import { textTools } from "../../utils/tools";
import { globals } from "@/store/global";

const Seo = (props) => {
    const { title, description } = props
    const newTitle = `${title} | ${globals.sitename}`

    return (
        <Head>
            <title>{title ? textTools.capitalize(newTitle) : textTools.capitalize(globals.sitename)}</title>
            {description && <meta name="description" content={textTools.capitalize(description)} />}
            {title && <meta name="og:title" property="og:title" content={title} />}
            {description && <meta name="twitter:card" content={description} />}
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <link rel="shortcut icon" href="/favicon.ico" />
          
          <meta name="theme-color" content={''}/>
        </Head>
    );
};

export default Seo;