"use client";

import { ComponentProps, PropsWithChildren, useState } from "react";

import { MenuIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";

import { Button, buttonVariants } from "@/components/ui/button";
import {
   Sheet,
   SheetContent,
   SheetDescription,
   SheetFooter,
   SheetHeader,
   SheetTitle,
   SheetTrigger,
} from "@/components/ui/sheet";
import { Link, usePathname } from "@/i18n/routing";
import { cn } from "@/lib/utils";

import { RegisterButton } from "../auth/register-button";
import { SignInButton } from "../auth/sign-in-button";
import { LanguageDropdown } from "../language-dropdown";
import { Logo } from "../logo";
import { DashboardButton } from "./dashboard-button";

export function MobileContents() {
   const [isOpen, setOpen] = useState(false);
   const t = useTranslations();
   const { data: session } = useSession();

   return (
      <Sheet open={isOpen} onOpenChange={(value) => setOpen(value)}>
         <SheetTrigger asChild className="sm:hidden">
            <Button variant="ghost" size="icon">
               <MenuIcon className="h-7 w-7 stroke-card-foreground" />
            </Button>
         </SheetTrigger>
         <SheetContent side="left" className="flex flex-col gap-4">
            <SheetHeader>
               <SheetTitle>
                  <Logo />
               </SheetTitle>
               <SheetDescription className="sr-only">
                  {t("screen-readers.navigation")}
               </SheetDescription>
            </SheetHeader>
            <div className="mt-4 flex flex-col gap-2 text-center">
               <Navlink href="/" setOpen={setOpen}>
                  {t("navigation.Home")}
               </Navlink>
            </div>
            <SheetFooter className="mt-auto flex flex-col gap-2 pb-20">
               {!session && <RegisterButton size="lg" className="h-12" />}
               {!session && <SignInButton variant="outline" size="lg" className="h-12" />}
               {session && <DashboardButton onClick={() => setOpen(false)} className="h-12" />}
               <LanguageDropdown className="mt-4 self-end" />
            </SheetFooter>
         </SheetContent>
      </Sheet>
   );
}

interface NavlinkProps extends ComponentProps<typeof Link> {
   setOpen: (b: boolean) => void;
}
function Navlink({ href, setOpen, children, ...props }: Readonly<PropsWithChildren<NavlinkProps>>) {
   const pathname = usePathname();

   if (pathname === href) {
      return (
         <Button
            variant="ghost"
            className="h-12 w-full bg-muted hover:brightness-95"
            onClick={() => setOpen(false)}
         >
            {children}
         </Button>
      );
   }
   return (
      <Link
         {...props}
         href={href}
         className={cn(
            buttonVariants({ variant: "outline" }),
            pathname === href && "border-none bg-muted hover:brightness-95",
            "h-12 w-full"
         )}
      >
         {children}
      </Link>
   );
}
