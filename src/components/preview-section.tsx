import { PropsWithChildren } from "react";

export function PreviewSection({
   title,
   children,
}: Readonly<PropsWithChildren<{ title: string }>>) {
   return (
      <section className="flex flex-col gap-1">
         <SectionTitle>{title}</SectionTitle>
         {children}
      </section>
   );
}

function SectionTitle({ children }: Readonly<PropsWithChildren>) {
   return <p className="inline-flex items-center gap-2 font-bold">{children} </p>;
}
