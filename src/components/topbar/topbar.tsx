import { ComponentProps, PropsWithChildren } from "react";

import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";

import { Logo } from "../ui/logo";

type TopbarProps = ComponentProps<"div">;

export async function Topbar({ children, ...props }: Readonly<PropsWithChildren<TopbarProps>>) {
   return (
      <div {...props} className={cn("border-b border-border bg-background", props.className)}>
         <div className="mx-auto flex max-w-screen-xl justify-between p-3">
            <Link href="/">
               <Logo className="my-auto hover:text-primary-hover" />
            </Link>

            {children}
         </div>
      </div>
   );
}
