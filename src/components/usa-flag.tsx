"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "./logo";
import { LoaderCircle } from "lucide-react";
import { useLanguage } from "./language-provider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { UkFlagIcon } from "./uk-flag";
import { VietnamFlagIcon } from "./vietnam-flag";


export function SignupForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { t, language, setLanguage } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.push("/");
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md shadow-2xl">
      <CardHeader className="items-center text-center">
        <div className="absolute top-4 right-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-12 w-12">
                {language === 'en' ? <UkFlagIcon className="h-8 w-8" /> : <VietnamFlagIcon className="h-8 w-8" />}
                <span className="sr-only">{t('languageSwitcherTooltip')}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setLanguage('en')} disabled={language === 'en'}>
                <UkFlagIcon className="mr-2 h-5 w-5" />
                {t('english')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage('vi')} disabled={language === 'vi'}>
                <VietnamFlagIcon className="mr-2 h-5 w-5" />
                {t('vietnamese')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="h-16 w-16">
          <Logo />
        </div>
        <CardTitle className="text-3xl font-bold pt-4">{t('signupTitle')}</CardTitle>
        <CardDescription>{t('signupDescription')}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">{t('emailLabel')}</Label>
            <Input
              id="email"
              type="email"
              placeholder={t('emailPlaceholder')}
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">{t('passwordLabel')}</Label>
            <Input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={loading}>
            {loading ? <LoaderCircle className="animate-spin" /> : t('signupButton')}
          </Button>
        </form>
        <div className="mt-4 text-center text-sm">
          {t('haveAccountPrompt')}{' '}
          <Link href="/login" passHref>
            <Button variant="link" className="p-0 h-auto">{t('loginTitle')}</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}