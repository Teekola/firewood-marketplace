"use client";

import { LoadingIndicator } from "./loading-indicator";
import { useSubmitQuotationRequest } from "./use-submit-quotation-request";

export function Submitter() {
   useSubmitQuotationRequest();

   return <LoadingIndicator />;
}
