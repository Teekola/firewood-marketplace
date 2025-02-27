import { Currency } from "@prisma/client";

export const countryCodeToCurrency: Record<string, string> = {
   FI: "EUR",
   US: "USD",
};

export const currencyConfigs: Record<
   Currency,
   { symbol: string; decimalSeparator: string; symbolPosition: "after" | "before" }
> = {
   EUR: { symbol: "€", decimalSeparator: ",", symbolPosition: "after" },
   USD: {
      symbol: "$",
      decimalSeparator: ".",
      symbolPosition: "before",
   },
};

export type CurrencyConfigs = {
   [K in keyof typeof currencyConfigs]: (typeof currencyConfigs)[K] & { label: string };
};
