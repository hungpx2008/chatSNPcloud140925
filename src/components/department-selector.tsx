"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Logo } from "@/components/logo";
import { useAuth } from "./auth-provider";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { useLanguage } from "./language-provider";
import { TranslationKey } from "@/lib/translations";

const departments: TranslationKey[] = [
  "itDepartment",
  "businessPlanningDepartment",
  "marketingDepartment",
  "humanResources",
  "financeDepartment",
];

export function DepartmentSelector() {
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const router = useRouter();
  const { user } = useAuth();
  const { t } = useLanguage();

  const handleStartChat = () => {
    if (selectedDepartment) {
      router.push(`/chat?department=${encodeURIComponent(t(selectedDepartment as TranslationKey))}`);
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
    router.push('/login');
  };

  return (
    <Card className="w-full max-w-md shadow-2xl">
      <CardHeader className="items-center text-center">
        <div className="h-16 w-16">
          <Logo />
        </div>
        <CardTitle className="text-3xl font-bold pt-4">ChatSNP</CardTitle>
        <CardDescription>{t('departmentSelectorTitle')}</CardDescription>
        {user && <p className="text-sm text-muted-foreground pt-2">{t('welcomeUser').replace('{email}', user.email || '')}</p>}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Select onValueChange={setSelectedDepartment} value={selectedDepartment}>
            <SelectTrigger>
              <SelectValue placeholder={t('departmentPlaceholder')} />
            </SelectTrigger>
            <SelectContent>
              {departments.map((dept) => (
                <SelectItem key={dept} value={dept}>
                  {t(dept)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            onClick={handleStartChat}
            disabled={!selectedDepartment}
            className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
            size="lg"
          >
            {t('startChatButton')}
          </Button>
          <Button onClick={handleSignOut} variant="outline" className="w-full">
            {t('signOutButton')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
