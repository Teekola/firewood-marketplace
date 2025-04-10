import { Mail } from "lucide-react";
import { useTranslations } from "next-intl";

const animationClasses = [
   "animate-send-1",
   "animate-send-2",
   "animate-send-3",
   "animate-send-4",
   "animate-send-5",
];

export function LoadingIndicator() {
   const t = useTranslations();
   return (
      <div>
         <div className="relative flex items-center justify-center">
            <p className="max-w-56 animate-pulse text-center font-bold text-foreground">
               {t("request-offers.Your quotation request is being sent to sellers")}
            </p>
            {animationClasses.map((animation, i) => (
               <div key={i} className="absolute -z-10 animate-accordion-down">
                  <Mail className={`h-6 w-6 stroke-primary ${animation}`} />
               </div>
            ))}
         </div>
      </div>
   );
}
