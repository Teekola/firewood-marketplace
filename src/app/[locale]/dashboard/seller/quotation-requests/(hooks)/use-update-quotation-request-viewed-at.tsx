"use client";

import { useEffect } from "react";

import { updateViewedAt } from "../actions";

export function useUpdateQuotationRequestViewedAt({
   quotationRequestId,
}: Readonly<{ quotationRequestId?: string }>) {
   useEffect(() => {
      if (!quotationRequestId) return;
      updateViewedAt(quotationRequestId);
   }, [quotationRequestId]);
}
