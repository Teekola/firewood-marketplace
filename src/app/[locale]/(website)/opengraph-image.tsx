import { ImageResponse } from "next/og";

// Image metadata
export const alt = "Polttopuutori";
export const size = {
   width: 1200,
   height: 630,
};

export const contentType = "image/png";

// Image generation
export default async function Image() {
   return new ImageResponse(
      (
         <div
            style={{
               fontSize: 128,
               fontFamily: "Nunito Sans",
               background: "hsl(150 22% 96%)",
               color: "hsl(129 30% 26%)",
               width: "100%",
               height: "100%",
               display: "flex",
               alignItems: "center",
               justifyContent: "center",
            }}
         >
            {"Polttopuutori"}
         </div>
      ),
      // ImageResponse options
      {
         // For convenience, we can re-use the exported opengraph-image
         // size config to also set the ImageResponse's width and height.
         ...size,
      }
   );
}
