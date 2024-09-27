import { SignOutButton } from "@/components/auth/sign-out-button";

import { ThemeToggle } from "./components/theme-toggle";

export default function Home() {
   return (
      <div>
         <div>
            <ThemeToggle />
         </div>
         <SignOutButton />
         <h1 className="h1">Klapitori</h1>
      </div>
   );
}
