import { ImageResponse } from "next/og";

export const size = {
   width: 180, // Increase size to 180x180px for Apple Touch icon
   height: 180,
};
export const contentType = "image/png";

export default function Icon() {
   return new ImageResponse(
      (
         <div
            style={{
               fontSize: 96,
               background: "hsl(150 22% 96%)",
               width: "100%",
               height: "100%",
               display: "flex",
               alignItems: "center",
               justifyContent: "center",
               color: "hsl(129 30% 26%)",
               borderRadius: "20%",
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
