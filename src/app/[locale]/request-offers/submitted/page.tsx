import { Link } from "@/i18n/routing";

export default async function SubmittedPage({
   searchParams,
}: Readonly<{ searchParams: Promise<{ [key: string]: string | string[] | undefined }> }>) {
   const sp = await searchParams;
   const sellers = Number(sp.sellers) || 0;

   return (
      <div>
         <h1>{"Quotation Request Submitted!"}</h1>
         <p>
            {
               "The quotation request was successfully submitted. The number of sellers who received the request:"
            }{" "}
            {sellers}
         </p>
         <Link href="/">{"Go to Dashboard"}</Link>
      </div>
   );
}
