import type { ReactNode } from "react";

type LegalPageLayoutProps = {
  title: string;
  children: ReactNode;
};

export function LegalPageLayout({ title, children }: LegalPageLayoutProps) {
  return (
    <article className="mx-auto min-w-0 max-w-3xl pb-12 sm:pb-16">
      <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
        {title}
      </h1>
      <p className="mt-2 text-sm text-slate-500">Last updated: April 9, 2026</p>
      <div className="mt-10 space-y-8 text-sm leading-relaxed text-slate-600 dark:text-slate-300 [&_h2]:mt-0 [&_h2]:text-base [&_h2]:font-semibold [&_h2]:text-slate-900 dark:[&_h2]:text-slate-100 [&_p]:text-slate-600 dark:[&_p]:text-slate-400 [&_ul]:list-disc [&_ul]:pl-5 [&_li]:text-slate-600 dark:[&_li]:text-slate-400 [&_a]:text-indigo-600 dark:[&_a]:text-indigo-400">
        {children}
      </div>
    </article>
  );
}
