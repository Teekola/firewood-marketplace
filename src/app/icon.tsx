import { ImageResponse } from "next/og";

export const size = {
   width: 32,
   height: 32,
};
export const contentType = "image/png";

export default function Icon() {
   return new ImageResponse(
      (
         <div
            style={{
               fontSize: 24,
               background: "hsl(150 22% 96%)",
               width: "100%",
               height: "100%",
               display: "flex",
               alignItems: "center",
               justifyContent: "center",
               color: "hsl(129 30% 26%)",
               borderRadius: 8,
            }}
         >
            {"P"}
         </div>
      ),
      {
         ...size,
      }
   );
}
