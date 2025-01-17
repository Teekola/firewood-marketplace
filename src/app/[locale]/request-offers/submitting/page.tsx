import { auth } from "@/auth/auth";
import { SignInDialog } from "@/components/auth/sign-in-dialog";

import { Submitter } from "./submitter";

export default async function SubmittedPage() {
   const session = await auth();

   return (
      <>
         {!session && (
            <div>
               <SignInDialog
                  open={!session}
                  signInTitle="Sign in to submit"
                  registerTitle="Register to submit"
               />
            </div>
         )}
         {session && <Submitter />}
      </>
   );
}
