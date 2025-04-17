import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
   return (
      <div className="flex w-full flex-col gap-2">
         <Skeleton className="mb-5 ml-auto mr-1 mt-1 h-9 w-32" />
         <div className="flex w-full flex-col gap-1 pr-3">
            {Array.from({ length: 3 }).map((_, index) => (
               <Skeleton key={index} className="h-[106.5px]" />
            ))}
         </div>
      </div>
   );
}
