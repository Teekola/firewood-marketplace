import { getTranslations } from "next-intl/server";

import { NewUserForm } from "./new-user-form";

export default async function NewUserPage() {
   const t = await getTranslations();
   return (
      <div className="mx-auto flex max-w-lg flex-col p-3">
         <h1 className="h1 mb-4">{t("new-user-page.title")}</h1>
         <p>{t("new-user-page.Please choose your preferences first")}</p>

         <NewUserForm />
      </div>
   );
}
