import { AuthPages } from "./types";
import { getLocalizedPages } from "./utils";

const protectedRoutes = ["/dashboard", "/dashboard/.*"]; // example of all routes within /dashboard: "/dashboard/.*"

export const CALLBACK_URL_KEY = "callbackUrl";

export const pages = {
   signIn: "/auth/sign-in",
} satisfies AuthPages;
const signInPages = [pages.signIn, "/auth/sign-in/email"];
const registerPages = ["/auth/register", "/auth/register/email"];

export const authPages = [
   ...signInPages,
   ...registerPages,
   ...getLocalizedPages([...registerPages, ...signInPages]),
];
export const protectedPages = getLocalizedPages(protectedRoutes);
export const DEFAULT_ROUTE = "/";
