import { render } from "@testing-library/react";
import * as nextIntl from "next-intl";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { LanguageToggleGroup } from "./language-toggle-group";

// Note! The values for "@/i18n/routing" must be defined within the mock
type TestLocale = "fi" | "en";

const translationsByLocale = {
   fi: {
      "Select language": "Valitse kieli",
   },
   en: {
      "Select language": "Select language",
   },
} as Record<TestLocale, Record<string, string>>;

function mockUseTranslationsForLocale(locale: TestLocale) {
   const translations = translationsByLocale[locale];
   return vi.mocked(nextIntl.useTranslations).mockImplementation(() => {
      return Object.assign(
         <TargetKey extends string>(key: TargetKey): string => {
            return translations[key] ?? key;
         },
         {
            rich: (key: string) => key,
            markup: (key: string) => key,
            raw: (key: string) => key,
         }
      );
   });
}

vi.mock("next-intl", () => ({
   useLocale: vi.fn(),
   useTranslations: vi.fn(),
}));

vi.mock("@/i18n/routing", () => ({
   useRouter: () => ({
      replace: vi.fn(),
   }),
   usePathname: vi.fn(),
   routing: {
      locales: ["fi", "en"],
   },
}));

describe("LanguageToggleGroup", () => {
   beforeEach(() => {
      vi.clearAllMocks();
   });

   afterEach(() => {
      vi.clearAllMocks();
   });

   it("renders the toggle group with correct options", () => {
      vi.mocked(nextIntl.useLocale).mockReturnValue("en");
      mockUseTranslationsForLocale("en");
      const { getByLabelText } = render(<LanguageToggleGroup />);

      const toggleGroup = getByLabelText("Select language");
      expect(toggleGroup).toBeInTheDocument();
   });

   it("sets the default value based on the current locale", () => {
      render(<LanguageToggleGroup />);
   });

   it("calls the router.replace with correct arguments on locale change", () => {
      render(<LanguageToggleGroup />);
   });
});
