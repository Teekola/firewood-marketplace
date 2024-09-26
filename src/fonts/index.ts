import localFont from "next/font/local";

export const nunitoSans = localFont({
   src: [
      {
         path: "./NunitoSans-VariableFont.woff2",
         weight: "100 900",
         style: "normal",
      },
      {
         path: "./NunitoSans-Italic-VariableFont.woff2",
         weight: "100 900",
         style: "italic",
      },
   ],
   variable: "--font-nunito-sans",
});
