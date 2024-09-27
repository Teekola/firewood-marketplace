import { SignInButton } from "@/components/auth/sign-in-button";

export default function SignInPage() {
   return (
      <div className="mx-auto flex h-screen max-w-screen-sm flex-col items-center justify-center gap-4">
         <h1 className="h2">Sign In</h1>
         <SignInButton />
      </div>
   );
}
