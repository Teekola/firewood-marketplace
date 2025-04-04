import { type PropsWithChildren } from "react";

import { type AbstractIntlMessages, NextIntlClientProvider } from "next-intl";

import { TooltipProvider } from "@/components/ui/tooltip";
import { UserDTO } from "@/db/user";
import { ReactQueryProvider } from "@/providers/react-query-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import { UserStoreProvider } from "@/providers/user-store-provider";

interface ProvidersProps {
   messages: AbstractIntlMessages;
   user: UserDTO | null;
}

export default function Providers({
   children,
   messages,
   user,
}: Readonly<PropsWithChildren<ProvidersProps>>) {
   return (
      <NextIntlClientProvider messages={messages}>
         <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
         >
            <UserStoreProvider user={user}>
               <ReactQueryProvider>
                  <TooltipProvider>{children}</TooltipProvider>
               </ReactQueryProvider>
            </UserStoreProvider>
         </ThemeProvider>
      </NextIntlClientProvider>
   );
}
