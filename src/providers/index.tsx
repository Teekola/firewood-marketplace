import { type PropsWithChildren } from "react";

import { type AbstractIntlMessages, NextIntlClientProvider } from "next-intl";

import { TooltipProvider } from "@/components/ui/tooltip";
import { ReactQueryProvider } from "@/providers/react-query-provider";
import { ThemeProvider } from "@/providers/theme-provider";

interface ProvidersProps {
   messages: AbstractIntlMessages;
}

export default function Providers({
   children,
   messages,
}: Readonly<PropsWithChildren<ProvidersProps>>) {
   return (
      <NextIntlClientProvider messages={messages}>
         <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
         >
            <ReactQueryProvider>
               <TooltipProvider>{children}</TooltipProvider>
            </ReactQueryProvider>
         </ThemeProvider>
      </NextIntlClientProvider>
   );
}
