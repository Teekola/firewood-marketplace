import { Link } from "@/i18n/routing";

const TEXT = "THIS IS A SECRET PAGE";
const HOME = "To Home";

export default function SecretPage() {
   return (
      <div>
         <h1 className="h1">{TEXT}</h1>
         <Link href="/">{HOME}</Link>
      </div>
   );
}
