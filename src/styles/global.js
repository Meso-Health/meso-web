import { css } from '@emotion/core';

import PlexSansRegularWoff from 'assets/fonts/IBMPlexSans-Regular.woff';
import PlexSansRegularWoff2 from 'assets/fonts/IBMPlexSans-Regular.woff2';
import PlexSansRegularItalicWoff from 'assets/fonts/IBMPlexSans-RegularItalic.woff';
import PlexSansRegularItalicWoff2 from 'assets/fonts/IBMPlexSans-RegularItalic.woff2';
import PlexSansMediumWoff from 'assets/fonts/IBMPlexSans-Medium.woff';
import PlexSansMediumWoff2 from 'assets/fonts/IBMPlexSans-Medium.woff2';
import PlexSansMediumItalicWoff from 'assets/fonts/IBMPlexSans-MediumItalic.woff';
import PlexSansMediumItalicWoff2 from 'assets/fonts/IBMPlexSans-MediumItalic.woff2';
import PlexSansSemiboldWoff from 'assets/fonts/IBMPlexSans-Semibold.woff';
import PlexSansSemiboldWoff2 from 'assets/fonts/IBMPlexSans-Semibold.woff2';
import PlexSansSemiboldItalicWoff from 'assets/fonts/IBMPlexSans-SemiboldItalic.woff';
import PlexSansSemiboldItalicWoff2 from 'assets/fonts/IBMPlexSans-SemiboldItalic.woff2';

import theme from 'styles/theme';

/**
 * Global styles injected into the document.
 * Edit these with care.
 */

const GlobalStyle = css`
  @font-face {
    font-family: 'Plex';
    font-weight: 400;
    font-style: normal;
    src: url('${PlexSansRegularWoff}') format('woff'),
         url('${PlexSansRegularWoff2}') format('woff2');
  }

  @font-face {
    font-family: 'Plex';
    font-weight: 400;
    font-style: italic;
    src: url('${PlexSansRegularItalicWoff}') format('woff'),
         url('${PlexSansRegularItalicWoff2}') format('woff2');
  }

  @font-face {
    font-family: 'Plex';
    font-weight: 500;
    font-style: normal;
    src: url('${PlexSansMediumWoff}') format('woff'),
         url('${PlexSansMediumWoff2}') format('woff2');
  }

  @font-face {
    font-family: 'Plex';
    font-weight: 500;
    font-style: italic;
    src: url('${PlexSansMediumItalicWoff}') format('woff'),
         url('${PlexSansMediumItalicWoff2}') format('woff2');
  }

  @font-face {
    font-family: 'Plex';
    font-weight: 600;
    font-style: normal;
    src: url('${PlexSansSemiboldWoff}') format('woff'),
         url('${PlexSansSemiboldWoff2}') format('woff2');
  }

  @font-face {
    font-family: 'Plex';
    font-weight: 600;
    font-style: italic;
    src: url('${PlexSansSemiboldItalicWoff}') format('woff'),
         url('${PlexSansSemiboldItalicWoff2}') format('woff2');
  }

  *,
  *:before,
  *:after {
    box-sizing: border-box;
  }

  body {
    color: ${theme.colors.gray[9]};
    font-family: ${theme.font.family.sans};
    font-size: ${theme.font.size[3]};
    font-weight: ${theme.font.weight.normal};
    letter-spacing: 0.1px;
    margin: 0;
  }

  #root {
    width: 100%;
    height: 100%;
  }

  h1, h2, h3, h4, h5, h6 {
    margin: 0;
    font-weight: normal;
    text-rendering: optimizeLegibility;
  }

  p, dl, dt, dd {
    margin: 0;
  }

  a {
    color: inherit;
    text-decoration: inherit;
  }

  img,
  svg {
    max-width: 100%;
    height: auto;
    vertical-align: top;
  }
`;

export default GlobalStyle;
