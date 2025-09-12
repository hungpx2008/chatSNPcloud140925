"use client";

import { ReactNode } from "react";
import { AuthHeader } from "@/components/auth-header";
import { useLanguage } from "@/components/language-provider";
import { LanguageSwitcher } from "./language-switcher";

export function AuthLayout({ children }: { children: ReactNode }) {
  const { t } = useLanguage();
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center p-8 bg-gradient-to-br from-blue-100 via-blue-200 to-cyan-200 text-blue-900">
      <AuthHeader />
      <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>
      {children}
      <div className="absolute bottom-8">
        <p className="text-sm">{t('footerText')}</p>
      </div>
    </main>
  );
}
