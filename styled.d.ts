import "@emotion/react";

declare module "@emotion/react" {
  export interface Theme {
    colors: {
      primary: string;
      secondary: string;
      danger: string;
      border: string;
      snow: string;
      void: string;
      dusty: string;
      slate: string;
      gluton: string;
    };
    bgColors: {
      dangerFade: string;
      primaryFade: string;
    };
  }
}
