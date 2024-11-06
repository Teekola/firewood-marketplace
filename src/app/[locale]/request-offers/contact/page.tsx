import { getTranslations } from "next-intl/server";

import { ContactForm } from "./contact-form";

export default async function FirewoodPage() {
   const t = await getTranslations();
   return (
      <>
         <h1 className="text-4xl font-extrabold">{t("request-offers.Contact")}</h1>
         <ContactForm />
      </>
   );
}
