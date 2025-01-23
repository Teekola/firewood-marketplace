import { ComponentProps } from "react";

type SellerDashboardProps = ComponentProps<"div">;

export function SellerDashboard({ ...props }: SellerDashboardProps) {
   return (
      <div {...props}>
         <div className="flex h-20 w-20 bg-red-500"></div>
      </div>
   );
}
