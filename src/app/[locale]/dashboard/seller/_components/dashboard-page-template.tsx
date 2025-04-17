export function DashboardPageTemplate({
   title,
   description,
   children,
}: Readonly<{ children: React.ReactNode; title: string; description: string }>) {
   return (
      <div>
         <header>
            <h1 className="h1 md:h3">{title}</h1>
            <p className="mt-2">{description}</p>
         </header>
         {children}
      </div>
   );
}
