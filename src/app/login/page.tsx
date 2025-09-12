"use client";

import { LoginForm } from "@/components/login-form";
import { AuthHeader } from "@/components/auth-header";
import { useLanguage } from "@/components/language-provider";

export default function LoginPage() {
  const { t } = useLanguage();
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center p-8 bg-gradient-to-br from-blue-100 via-blue-200 to-cyan-200 text-blue-900">
      <AuthHeader />
      <LoginForm />
        <div className="absolute bottom-8">
          <p className="text-sm">{t('footerText')}</p>
        </div>
    </main>
  );
}
