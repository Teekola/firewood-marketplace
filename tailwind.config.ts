import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

const config: Config = {
   darkMode: "class",
   content: [
      "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
      "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
      "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
   ],
   theme: {
      extend: {
         screens: {
            xs: "376px",
         },
         fontFamily: {
            sans: ["var(--font-nunito-sans)"],
         },
         borderRadius: {
            lg: "var(--radius)",
            md: "calc(var(--radius) - 2px)",
            sm: "calc(var(--radius) - 4px)",
         },
         colors: {
            background: "hsl(var(--background))",
            foreground: "hsl(var(--foreground))",
            card: {
               DEFAULT: "hsl(var(--card))",
               foreground: "hsl(var(--card-foreground))",
            },
            popover: {
               DEFAULT: "hsl(var(--popover))",
               foreground: "hsl(var(--popover-foreground))",
            },
            primary: {
               DEFAULT: "hsl(var(--primary))",
               foreground: "hsl(var(--primary-foreground))",
            },
            cta: {
               DEFAULT: "hsl(var(--cta))",
               foreground: "hsl(var(--cta-foreground))",
            },
            secondary: {
               DEFAULT: "hsl(var(--secondary))",
               foreground: "hsl(var(--secondary-foreground))",
            },
            muted: {
               DEFAULT: "hsl(var(--muted))",
               foreground: "hsl(var(--muted-foreground))",
            },
            accent: {
               DEFAULT: "hsl(var(--accent))",
               foreground: "hsl(var(--accent-foreground))",
               "1": {
                  DEFAULT: "hsl(var(--accent-1))",
                  foreground: "hsl(var(--accent-1-foreground))",
               },
               "2": {
                  DEFAULT: "hsl(var(--accent-2))",
                  foreground: "hsl(var(--accent-2-foreground))",
               },
               "3": {
                  DEFAULT: "hsl(var(--accent-3))",
                  foreground: "hsl(var(--accent-3-foreground))",
               },
            },
            destructive: {
               DEFAULT: "hsl(var(--destructive))",
               foreground: "hsl(var(--destructive-foreground))",
            },
            border: "hsl(var(--border))",
            input: "hsl(var(--input))",
            ring: "hsl(var(--ring))",
            chart: {
               "1": "hsl(var(--chart-1))",
               "2": "hsl(var(--chart-2))",
               "3": "hsl(var(--chart-3))",
               "4": "hsl(var(--chart-4))",
               "5": "hsl(var(--chart-5))",
            },
         },
         keyframes: {
            "accordion-down": {
               from: {
                  height: "0",
               },
               to: {
                  height: "var(--radix-accordion-content-height)",
               },
            },
            "accordion-up": {
               from: {
                  height: "var(--radix-accordion-content-height)",
               },
               to: {
                  height: "0",
               },
            },

            "move-1": {
               "0%": { transform: "translate(0, 0) rotate(0deg)", opacity: "1" },
               "100%": { transform: "translate(150px, -10px) rotate(15deg)", opacity: "0.5" },
            },
            "move-2": {
               "0%": { transform: "translate(-0, 0) rotate(0deg)", opacity: "1" },
               "100%": { transform: "translate(-150px, 10px) rotate(-15deg)", opacity: "0.5" },
            },
            "move-3": {
               "0%": { transform: "translate(0, 0) rotate(0deg)", opacity: "1" },
               "100%": { transform: "translate(200px, -50px) rotate(30deg)", opacity: "0.5" },
            },
            "move-4": {
               "0%": { transform: "translate(-0, 0) rotate(0deg)", opacity: "1" },
               "100%": { transform: "translate(-200px, 50px) rotate(-30deg)", opacity: "0.5" },
            },
            "move-5": {
               "0%": { transform: "translate(0, 0) rotate(0deg)", opacity: "1" },
               "100%": { transform: "translate(150px, 100px) rotate(45deg)", opacity: "0.5" },
            },
         },
         animation: {
            "accordion-down": "accordion-down 0.2s ease-out",
            "accordion-up": "accordion-up 0.2s ease-out",
            "send-1": "move-1 2s infinite cubic-bezier(0.25, 1, 0.5, 1)",
            "send-2": "move-2 2s infinite cubic-bezier(0.25, 1, 0.5, 1)",
            "send-3": "move-3 2s infinite cubic-bezier(0.25, 1, 0.5, 1)",
            "send-4": "move-4 2s infinite cubic-bezier(0.25, 1, 0.5, 1)",
            "send-5": "move-5 2s infinite cubic-bezier(0.25, 1, 0.5, 1)",
         },
      },
   },
   plugins: [tailwindcssAnimate],
};
export default config;
