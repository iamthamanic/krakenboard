
import { Menu, Cog, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Language, languages, getStoredLanguage, setStoredLanguage } from "@/lib/utils";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

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
  const navigate = useNavigate();

  const handleLanguageChange = (lang: Language) => {
    setCurrentLanguage(lang);
    setStoredLanguage(lang);
    window.location.reload();
  };

  const copyToClipboard = (path: string) => {
    const url = `${window.location.origin}${path}`;
    navigator.clipboard.writeText(url).then(() => {
      toast.success("URL wurde in die Zwischenablage kopiert");
    });
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
          <Button variant="ghost" size="icon" className="lg:hidden">
            <Menu className="h-6 w-6" />
          </Button>
          <h1 className="flex items-center text-2xl font-bold">
            <img 
              src="/lovable-uploads/deaeb7df-0e13-4733-b44b-7b2e5faf09d9.png" 
              alt="Kraken Logo" 
              className="h-12 w-12 mr-2" 
            />
            <span className="text-primary-500">Kraken</span>
            <span className="text-secondary-500">Board</span>
          </h1>
        </div>
        <nav className="flex items-center space-x-4">
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
            <DropdownMenu>
              <DropdownMenuTrigger className="text-sm font-medium hover:text-primary-500 transition-colors">
                Features
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <div className="flex items-center justify-between w-full">
                    <Link to="/legal/privacy" className="flex-grow">
                      Datenschutzerklärung
                    </Link>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="ml-2"
                      onClick={(e) => {
                        e.preventDefault();
                        copyToClipboard('/legal/privacy');
                      }}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <div className="flex items-center justify-between w-full">
                    <Link to="/legal/terms" className="flex-grow">
                      Nutzungsbedingungen
                    </Link>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="ml-2"
                      onClick={(e) => {
                        e.preventDefault();
                        copyToClipboard('/legal/terms');
                      }}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Link to="/integrations" className="flex items-center text-sm font-medium hover:text-primary-500 transition-colors">
              Integrations
              <Cog className="ml-2 h-4 w-4" />
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
