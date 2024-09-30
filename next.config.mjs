import { createJiti } from "jiti";
import createNextIntlPlugin from "next-intl/plugin";
import { fileURLToPath } from "node:url";

const jiti = createJiti(fileURLToPath(import.meta.url));

// Import env here to validate during build. Using jiti we can import .ts files
jiti("./src/env/server");
jiti("./src/env/client");

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {};

export default withNextIntl(nextConfig);
