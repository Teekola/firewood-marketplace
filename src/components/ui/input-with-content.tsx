import * as React from "react";

import { cn } from "@/lib/utils";

export interface InputWithContentProps
   extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "content"> {
   inputClassName?: string;
   content: React.ReactNode;
}

export const classNames =
   "relative items-center flex h-9 w-full rounded-md border border-input bg-transparent text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground [&:has(:focus-visible)]:outline-none [&:has(:focus-visible)]:ring-1 [&:has(:focus-visible)]:ring-ring disabled:cursor-not-allowed disabled:opacity-50";

const InputWithContent = React.forwardRef<HTMLInputElement, InputWithContentProps>(
   ({ className, inputClassName, type, content, ...props }, ref) => {
      return (
         <div className={cn(classNames, className)}>
            <input
               type={type}
               ref={ref}
               {...props}
               className={cn(
                  inputClassName,
                  "w-full bg-transparent px-3 py-1 outline-none placeholder:text-muted-foreground"
               )}
            />
            {content}
         </div>
      );
   }
);
InputWithContent.displayName = "Input";

export { InputWithContent };
