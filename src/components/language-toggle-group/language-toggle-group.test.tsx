import { cleanup, fireEvent, render } from "@testing-library/react";
import * as nextIntl from "next-intl";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { LanguageToggleGroup } from "./language-toggle-group";

// Hoisting is needed to allow using these values within the mocks
const { testLocales, translationsByLocale } = vi.hoisted(() => {
   // The keys define the available locales in the tests
   const translationsByLocale = {
      fi: {
         "Select language": "Valitse kieli",
      },
      en: {
         "Select language": "Select language",
      },
   } as const;

   type TestLocaleLocal = keyof typeof translationsByLocale;

   return {
      translationsByLocale,
      testLocales: Object.keys(translationsByLocale) as TestLocaleLocal[],
   };
});
type TestLocale = keyof typeof translationsByLocale;

vi.mock("next-intl", () => ({
   useLocale: vi.fn(),
   useTranslations: vi.fn(),
}));

const { mockedRouterReplace } = vi.hoisted(() => {
   const mockedRouterReplace = vi.fn();
   return {
      useRouter: () => ({ replace: mockedRouterReplace }),
      mockedRouterReplace,
   };
});

vi.mock("@/i18n/routing", () => ({
   useRouter: () => ({
      replace: mockedRouterReplace,
   }),
   usePathname: vi.fn(),
   routing: {
      locales: testLocales,
   },
}));

// Creates a mock implemantation for useTranslations based on locale
function mockUseTranslationsForLocale(locale: TestLocale) {
   const translations = (translationsByLocale as Record<TestLocale, Record<string, string>>)[
      locale
   ];
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

function getRandomLocaleIndex() {
   return Math.floor(Math.random() * testLocales.length);
}

function getRandomLocale() {
   return testLocales[getRandomLocaleIndex()];
}

describe("LanguageToggleGroup", () => {
   beforeEach(() => {
      vi.clearAllMocks();
   });

   afterEach(() => {
      vi.clearAllMocks();
      cleanup();
   });

   it("renders the toggle group with all locales", () => {
      const locale = getRandomLocale();
      vi.mocked(nextIntl.useLocale).mockReturnValue(locale);
      mockUseTranslationsForLocale(locale);
      const { getByLabelText, getByText } = render(<LanguageToggleGroup />);

      const toggleGroup = getByLabelText(translationsByLocale[locale]["Select language"]);
      expect(toggleGroup).toBeInTheDocument();

      testLocales.every((locale) => {
         const button = getByText(locale);
         expect(button).toBeInTheDocument();
         return true;
      });
   });

   it("sets the default value based on the current locale", () => {
      const locale = getRandomLocale();
      vi.mocked(nextIntl.useLocale).mockReturnValue(locale);
      mockUseTranslationsForLocale(locale);
      const { getByText } = render(<LanguageToggleGroup />);

      const fiButton = getByText(locale);
      // This data-state attribute is "on" when the locale is selected
      expect(fiButton).toHaveAttribute("data-state", "on");
   });

   it("changes the selected locale and calls router replace when button is clicked", () => {
      let localeIndex = getRandomLocaleIndex();
      const startingLocale = testLocales[localeIndex];

      vi.mocked(nextIntl.useLocale).mockReturnValue(startingLocale);
      mockUseTranslationsForLocale(startingLocale);

      const { getByText } = render(<LanguageToggleGroup />);

      let localesTested = 0;
      while (localesTested < testLocales.length) {
         const currentLocale = testLocales[localeIndex];
         localeIndex = (localeIndex + 1) % testLocales.length; // keep within the array
         const nextLocale = testLocales[localeIndex];

         const nextLocaleButton = getByText(nextLocale);
         const currentLocaleButton = getByText(currentLocale);

         fireEvent.click(nextLocaleButton);

         expect(nextLocaleButton).toHaveAttribute("data-state", "on");
         expect(currentLocaleButton).toHaveAttribute("data-state", "off");

         // Verify that the router.replace was called with the correct locale
         expect(mockedRouterReplace).toHaveBeenCalledWith(
            expect.objectContaining({
               pathname: undefined,
               params: null,
            }),
            { locale: nextLocale }
         );
         localesTested++;
      }
   });
});
