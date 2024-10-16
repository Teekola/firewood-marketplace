import { cleanup, render, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as nextIntl from "next-intl";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import * as i18nRouting from "@/i18n/routing";

import { LanguageDropdown } from "./language-dropdown";

// Hoisting is needed to allow using these values within the mocks
const { testLocales, translationsByLocale, localeToLocalizedLanguageName } = vi.hoisted(() => {
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

   const localeToLocalizedLanguageName: Record<TestLocaleLocal, string> = {
      fi: "Suomi",
      en: "English",
   };

   return {
      translationsByLocale,
      testLocales: Object.keys(translationsByLocale) as TestLocaleLocal[],
      localeToLocalizedLanguageName,
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
   localeToLocalizedLanguageName,
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

describe("Language Dropdown", () => {
   beforeEach(() => {
      vi.clearAllMocks();
   });

   afterEach(() => {
      vi.clearAllMocks();
      cleanup();
   });

   it("renders the language dropdown with all locales", async () => {
      const locale = getRandomLocale();
      vi.mocked(nextIntl.useLocale).mockReturnValue(locale);
      vi.mocked(i18nRouting.useRouter);
      mockUseTranslationsForLocale(locale);
      const { getByText, getByRole } = render(<LanguageDropdown />);

      const button = getByRole("button");
      expect(button).toBeInTheDocument();

      const user = userEvent.setup();
      await user.click(button);

      testLocales.every((locale) => {
         const option = getByText(i18nRouting.localeToLocalizedLanguageName[locale]);
         expect(option).toBeInTheDocument();
         return true;
      });
   });

   it("has one correct languge option selected", async () => {
      const locale = getRandomLocale();
      vi.mocked(nextIntl.useLocale).mockReturnValue(locale);
      mockUseTranslationsForLocale(locale);
      const { getByText, getByRole, getAllByRole } = render(<LanguageDropdown />);
      const button = getByRole("button");

      const user = userEvent.setup();
      await user.click(button);

      const options = getAllByRole("menuitemradio");
      let numSelectedLocales = 0;
      options.forEach((option) => {
         expect(option).toHaveAttribute("data-state");
         const state = option.attributes.getNamedItem("data-state")!.value;
         if (state === "checked") {
            numSelectedLocales++;
         }
      });
      expect(numSelectedLocales).toBe(1);

      const selectedOption = getByText(locale).parentElement;
      expect(selectedOption).toHaveAttribute("data-state", "checked");
   });

   it("changes the selected locale and calls router replace when locale is selected", async () => {
      const user = userEvent.setup();
      let localeIndex = getRandomLocaleIndex();
      const startingLocale = testLocales[localeIndex];

      vi.mocked(nextIntl.useLocale).mockReturnValue(startingLocale);
      mockUseTranslationsForLocale(startingLocale);

      const { getByText, getByRole } = render(<LanguageDropdown />);

      const button = getByRole("button");
      await user.click(button);

      // Test changing all locales, starting from a random locale
      let localesTested = 0;
      while (localesTested < testLocales.length) {
         const currentLocale = testLocales[localeIndex];
         localeIndex = (localeIndex + 1) % testLocales.length; // keep within the array
         const nextLocale = testLocales[localeIndex];

         let nextLocaleButton: HTMLElement;
         let currentLocaleButton: HTMLElement;

         nextLocaleButton = getByText(nextLocale).parentElement!;
         currentLocaleButton = getByText(currentLocale).parentElement!;
         expect(nextLocaleButton).toBeInTheDocument();

         await user.click(nextLocaleButton!);

         const button = getByRole("button");
         await user.click(button);

         // Verify that the router.replace was called with the correct locale
         expect(mockedRouterReplace).toHaveBeenCalledWith(
            expect.objectContaining({
               pathname: undefined,
               params: null,
            }),
            { locale: nextLocale }
         );

         nextLocaleButton = getByText(nextLocale).parentElement!;
         currentLocaleButton = getByText(currentLocale).parentElement!;

         waitFor(() => {
            expect(nextLocaleButton).toHaveAttribute("data-state", "checked");
            expect(currentLocaleButton).toHaveAttribute("data-state", "unchecked");
         });

         localesTested++;
      }
   });
});
