import { Metadata } from "next";
import { notFound } from "next/navigation";

import { Locale } from "@/i18n/routing";

export async function generateStaticParams() {
   const slugs = await getAllSlugs();
   return slugs;
}

export async function generateMetadata({
   params,
}: {
   params: Promise<{ slug: string; locale: Locale }>;
}): Promise<Metadata> {
   const { slug } = await params;
   const pageData = await getPageBySlug(slug);
   return {
      title: pageData.metadata.title,
      description: pageData.metadata.description,
   };
}

export default async function Page({
   params,
}: {
   params: Promise<{ slug: string; locale: Locale }>;
}) {
   const { slug } = await params;
   const data = await getPageBySlug(slug);

   if (!data) notFound();

   return (
      <div>
         <h1 className="h1">{data.hero.h1}</h1>
         <p className="p">{data.hero.sub}</p>
      </div>
   );
}

export async function getPageBySlug(slug: string) {
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
      metadata: {
         title: slug,
         description: slug,
      },
   };
}

async function getAllSlugs() {
   return [{ slug: "edullista-polttopuuta-turku", locale: "fi" }];
}
