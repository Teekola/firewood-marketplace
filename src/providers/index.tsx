import { type PropsWithChildren } from "react";

import { NextIntlClientProvider } from "next-intl";

import { TooltipProvider } from "@/components/ui/tooltip";
import { ReactQueryProvider } from "@/providers/react-query-provider";
import { ThemeProvider } from "@/providers/theme-provider";

export default function Providers({ children }: Readonly<PropsWithChildren>) {
   return (
      <NextIntlClientProvider>
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
