import { PropsWithChildren } from "react";

export default async function OffersLayout({
   children,
   modal,
}: Readonly<PropsWithChildren<{ modal: React.ReactNode }>>) {
   return (
      <>
         {children}
         {modal}
      </>
   );
}
