"use client";

import { buttonVariants } from "@/components/ui/button";
import { Link, Pathname, usePathname } from "@/i18n/routing";
import { cn } from "@/lib/utils";

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
   items: {
      href: Pathname;
      title: string;
   }[];
}

export function SidebarNav({ className, items, ...props }: SidebarNavProps) {
   const pathname = usePathname();

   return (
      <nav className={cn("flex flex-col space-y-1", className)} {...props}>
         {items.map((item) => (
            <Link
               key={item.href}
               href={item.href}
               className={cn(
                  buttonVariants({ variant: "ghost" }),
                  pathname === item.href
                     ? "bg-muted hover:bg-muted"
                     : "hover:bg-transparent hover:underline",
                  "justify-start"
               )}
            >
               {item.title}
            </Link>
         ))}
      </nav>
   );
}
