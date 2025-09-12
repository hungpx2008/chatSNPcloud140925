"use client";

import { useLanguage } from "./language-provider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { UkFlagIcon } from "./uk-flag";
import { VietnamFlagIcon } from "./vietnam-flag";

export function LanguageSwitcher() {
  const { t, language, setLanguage } = useLanguage();

  return (
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
  );
}
