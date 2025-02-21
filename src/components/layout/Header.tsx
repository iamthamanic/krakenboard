
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b">
      <div className="container flex items-center justify-between h-16">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="lg:hidden">
            <Menu className="h-6 w-6" />
          </Button>
          <h1 className="text-xl font-bold bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
            KrakenBoard
          </h1>
        </div>
        <nav className="hidden lg:flex items-center space-x-8">
          <a href="#features" className="text-sm font-medium hover:text-primary transition-colors">
            Features
          </a>
          <a href="#integrations" className="text-sm font-medium hover:text-primary transition-colors">
            Integrations
          </a>
          <a href="#pricing" className="text-sm font-medium hover:text-primary transition-colors">
            Pricing
          </a>
          <Button>Get Started</Button>
        </nav>
      </div>
    </header>
  );
};
