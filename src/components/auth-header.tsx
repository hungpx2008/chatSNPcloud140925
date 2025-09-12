"use client";

import { SnpLogo } from "@/components/snp-logo";
import { useLanguage } from "@/components/language-provider";

export function AuthHeader() {
  const { t } = useLanguage();
  return (
    <div className="absolute top-8 left-8 flex items-center gap-4">
      <div className="h-20 w-20">
        <SnpLogo />
      </div>
      <div>
        <h1 className="text-xl font-bold">{t('companyName')}</h1>
        <h2 className="text-lg font-semibold">{t('companyCorps')}</h2>
      </div>
    </div>
  );
}
