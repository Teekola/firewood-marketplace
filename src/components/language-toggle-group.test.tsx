import * as nextIntl from "next-intl";
import { afterEach, beforeEach, describe, it, vi } from "vitest";

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
      vi.mocked(nextIntl.useLocale).mockReturnValue("en");
   });

   afterEach(() => {
      vi.clearAllMocks();
   });

   it("renders the toggle group with correct options", () => {
      // render(<LanguageToggleGroup />);
   });

   it("sets the default value based on the current locale", () => {
      // render(<LanguageToggleGroup />);
   });

   it("calls the router.replace with correct arguments on locale change", () => {
      // render(<LanguageToggleGroup />);
   });
});
