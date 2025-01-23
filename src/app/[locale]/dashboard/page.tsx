import { SignOutButton } from "@/components/auth/sign-out-button";

export default function DashboardPage() {
   return (
      <div className="flex">
         <SignOutButton variant="secondary" className="ml-auto" />
      </div>
   );
}
