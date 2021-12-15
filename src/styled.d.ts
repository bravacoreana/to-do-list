import "styled-components";

declare module "styled-components" {
  export interface DefaultTheme {
    textColor: string;
    placeholder: string;
    bgColor: string;
    cardColor: string;
    boardColor: string;
    accentColor: string;
    listLeave: string;
  }
}
