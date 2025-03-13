import { ComponentProps } from "react";

type BuyerDashboardProps = ComponentProps<"div">;

export function BuyerDashboard({ ...props }: Readonly<BuyerDashboardProps>) {
   return (
      <div {...props}>
         <div className="flex h-20 w-20 bg-blue-500"></div>
      </div>
   );
}
