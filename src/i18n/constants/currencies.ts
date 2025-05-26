import { Currency } from "@prisma/client";

export const countryCodeToCurrency: Record<string, string> = {
   FI: "EUR",
   US: "USD",
};

export const currencyConfigs: Record<
   Currency,
   {
      symbol: string;
      decimalSeparator: string;
      symbolPosition: "after" | "before";
      labelKey: `currencies.label-${Currency}`;
   }
> = {
   EUR: {
      symbol: "€",
      decimalSeparator: ",",
      symbolPosition: "after",
      labelKey: "currencies.label-EUR",
   },
   USD: {
      symbol: "$",
      decimalSeparator: ".",
      symbolPosition: "before",
      labelKey: "currencies.label-EUR",
   },
};

export type CurrencyConfigs = {
   [K in keyof typeof currencyConfigs]: (typeof currencyConfigs)[K] & { label: string };
};
