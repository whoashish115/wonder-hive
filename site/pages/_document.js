import React from 'react';
import Document, { Html, Head, Main, NextScript } from 'next/document';
import { defaultThemeBorderRadius, defaultThemeColor, defaultThemeFontSize, defaultThemeFontType, defaultThemeMode } from '@/store/actions/globalActions/themeAction';

export default class MyDocument extends Document {
  render() {
    return (
      <Html className={`${defaultThemeMode.slug} ${defaultThemeColor.slug} ${defaultThemeFontType.slug} ${defaultThemeFontSize.slug} ${defaultThemeBorderRadius.slug}`} lang="en">
        <Head/>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
