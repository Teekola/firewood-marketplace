import { getTranslations } from "next-intl/server";

import { Preview } from "./preview";
import { SubmitForm } from "./submit-form";

export default async function FirewoodPage() {
   const t = await getTranslations();
   return (
      <>
         <h1 className="text-4xl font-extrabold">{t("request-offers.Submit")}</h1>
         <div className="mt-4 flex h-full max-w-lg flex-col gap-4">
            <Preview />
            <SubmitForm />
         </div>
      </>
   );
}
