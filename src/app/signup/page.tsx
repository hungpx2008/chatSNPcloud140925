"use client";

import { SignupForm } from "@/components/signup-form";
import { AuthHeader } from "@/components/auth-header";
import { useLanguage } from "@/components/language-provider";

export default function SignupPage() {
  const { t } = useLanguage();
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center p-8 bg-gradient-to-br from-blue-100 via-blue-200 to-cyan-200 text-blue-900">
      <AuthHeader />
      <SignupForm />
      <div className="absolute bottom-8">
        <p className="text-sm">{t('footerText')}</p>
      </div>
    </main>
  );
}
