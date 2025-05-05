import { Metadata } from "next";

import { Locale, redirect } from "@/i18n/routing";

export async function generateStaticParams() {
   return [
      {
         slug: "/edullista-polttopuuta-turku",
         locale: "fi",
      },
   ];
}

export async function generateMetadata({
   params,
}: {
   params: Promise<{ slug: string; locale: Locale }>;
}): Promise<Metadata> {
   const { locale, slug } = await params;
   return {
      title: slug + " " + locale,
      description: slug,
   };
}

const fetchDataBySlug = async (
   slug: string
): Promise<{
   slug: string;
   locale: Locale;
   hero: { h1: string; sub: string };
   languages: Record<Locale, string>;
}> => {
   return {
      slug,
      locale: "fi",
      hero: {
         h1: "Hanki polttopuuta edullisesti Turun alueella",
         sub: "Tee tarjouspyyntö polttopuusta ilmaiseksi",
      },
      languages: {
         fi: "fi/edullista-polttopuuta-turku",
         en: "cheap-firewood-turku",
      },
   };
};

export default async function Page({
   params,
}: {
   params: Promise<{ slug: string; locale: Locale }>;
}) {
   const { slug, locale } = await params;
   const data = await fetchDataBySlug(slug);
   if (data.locale !== locale) {
      redirect({ href: { pathname: "/[slug]", params: { slug: data.languages[locale] } }, locale });
   }
   return (
      <div>
         <h1 className="h1">{data.hero.h1}</h1>
         <p className="p">{data.hero.sub}</p>
      </div>
   );
}
