"use client";

import { buttonVariants } from "@/components/ui/button";
import { Link, Pathname, StaticPathname, usePathname } from "@/i18n/routing";
import { cn } from "@/lib/utils";

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
   items: {
      href: Pathname | Pathname[];
      title: string;
   }[];
}

function isPathnameWithinHref(pathname: Pathname, href: Pathname | Pathname[]) {
   if (Array.isArray(href)) {
      return href.find((h) => h.startsWith(pathname));
   }

   return pathname.startsWith(href);
}

export function SidebarNav({ className, items, ...props }: SidebarNavProps) {
   const pathname = usePathname();

   return (
      <nav className={cn("flex flex-col space-y-1", className)} {...props}>
         {items.map((item) => (
            <Link
               key={Array.isArray(item.href) ? item.href[0] : item.href}
               href={(Array.isArray(item.href) ? item.href[0] : item.href) as StaticPathname}
               className={cn(
                  buttonVariants({ variant: "ghost" }),
                  isPathnameWithinHref(pathname, item.href)
                     ? "border border-input md:border-none md:bg-muted md:hover:bg-muted"
                     : "h-16 border border-input shadow-sm hover:bg-accent hover:text-accent-foreground md:h-auto md:border-none md:shadow-none md:hover:bg-transparent md:hover:underline",
                  "justify-start"
               )}
            >
               {item.title}
            </Link>
         ))}
      </nav>
   );
}
