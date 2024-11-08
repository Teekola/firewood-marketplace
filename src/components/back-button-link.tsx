import { ComponentProps } from "react";

import { ArrowLeftIcon } from "lucide-react";

import { Link, Pathname } from "@/i18n/routing";
import { cn } from "@/lib/utils";

import { Button } from "./ui/button";

interface BackButtonLinkProps extends ComponentProps<typeof Button> {
   href: Pathname;
   label: string;
}

export function BackButtonLink({ label, href, ...props }: Readonly<BackButtonLinkProps>) {
   return (
      <Button
         {...props}
         asChild
         variant="outline"
         type="button"
         className={cn("group inline-flex items-center justify-between gap-2", props.className)}
      >
         <Link href={href} scroll={false}>
            <ArrowLeftIcon className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            {label}
         </Link>
      </Button>
   );
}
