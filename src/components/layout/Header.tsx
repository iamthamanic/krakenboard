
import { Menu, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Language, languages, getStoredLanguage, setStoredLanguage } from "@/lib/utils";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const FlagEmoji = ({ language }: { language: Language }) => {
  const flagEmojis = {
    de: "🇩🇪",
    en: "🇬🇧",
    tr: "🇹🇷"
  };

  return <span className="mr-2 text-lg">{flagEmojis[language]}</span>;
};

export const Header = () => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(getStoredLanguage);

  const handleLanguageChange = (lang: Language) => {
    setCurrentLanguage(lang);
    setStoredLanguage(lang);
    window.location.reload();
  };

  useEffect(() => {
    const storedLang = getStoredLanguage();
    if (storedLang !== currentLanguage) {
      setCurrentLanguage(storedLang);
    }
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b">
      <div className="container flex items-center justify-between h-16">
        <div className="flex items-center space-x-4">
          <SidebarTrigger className="lg:hidden" variant="ghost" size="icon">
            <Menu className="h-6 w-6" />
          </SidebarTrigger>
          <Link to="/" className="flex items-center text-2xl font-bold">
            <img 
              src="/lovable-uploads/deaeb7df-0e13-4733-b44b-7b2e5faf09d9.png" 
              alt="Kraken Logo" 
              className="h-12 w-12 mr-2" 
            />
            <span className="text-primary-500">Kraken</span>
            <span className="text-secondary-500">Board</span>
          </Link>
        </div>
        <nav className="flex items-center space-x-4">
          <Button variant="outline" size="sm" asChild>
            <Link to="/admin/settings" className="gap-2">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Einstellungen</span>
            </Link>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="min-w-[2.5rem]">
                <FlagEmoji language={currentLanguage} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {Object.entries(languages).map(([code, name]) => (
                <DropdownMenuItem
                  key={code}
                  onClick={() => handleLanguageChange(code as Language)}
                >
                  <FlagEmoji language={code as Language} />
                  {name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="hidden lg:flex items-center space-x-8">
            <Link to="/admin/dashboard" className="flex items-center text-sm font-medium hover:text-primary-500 transition-colors">
              Admin Dashboard
            </Link>
            <Button className="bg-primary-500 hover:bg-primary-600 text-white">
              Get Started
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
};
