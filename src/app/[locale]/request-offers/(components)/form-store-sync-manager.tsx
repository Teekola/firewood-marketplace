"use client";

import { useEffect, useRef } from "react";

import { DefaultValues, FieldValues, useFormContext, useWatch } from "react-hook-form";
import { useDebounce } from "use-debounce";

export function FormStoreSyncManager<T extends FieldValues>({
   formData,
   setFormDataToStore,
   defaultValues,
}: Readonly<{
   formData?: Partial<T>;
   setFormDataToStore: (data: Partial<T>) => void;
   defaultValues: DefaultValues<T>;
}>) {
   const data = useWatch<T>();
   const [debouncedData] = useDebounce(data, 300);
   const form = useFormContext<T>();

   const isMounted = useRef(false);

   // Set the data from session storage
   useEffect(() => {
      if (isMounted.current) return;
      if (!formData) return;
      form.reset({ ...defaultValues, ...formData });
      isMounted.current = true;
   }, [form, formData, defaultValues]);

   // Sync the data to store
   useEffect(() => {
      setFormDataToStore(debouncedData);
   }, [debouncedData, setFormDataToStore]);
   return null;
}
