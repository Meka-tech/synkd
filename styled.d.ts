import "@emotion/react";

declare module "@emotion/react" {
  export interface Theme {
    colors: {
      primary: string;
      secondary: string;
      danger: string;
      border: string;
    };
    bgColors: {
      dangerFade: string;
    };
  }
}
