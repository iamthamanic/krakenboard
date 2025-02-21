
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
          <h1 className="flex items-center text-xl font-bold">
            <img 
              src="/lovable-uploads/deaeb7df-0e13-4733-b44b-7b2e5faf09d9.png" 
              alt="Kraken Logo" 
              className="h-6 w-6 mr-2" 
            />
            <span className="text-primary-500">Kraken</span>
            <span className="text-secondary-500">Board</span>
          </h1>
        </div>
        <nav className="hidden lg:flex items-center space-x-8">
          <a href="#features" className="text-sm font-medium hover:text-primary-500 transition-colors">
            Features
          </a>
          <a href="#integrations" className="text-sm font-medium hover:text-primary-500 transition-colors">
            Integrations
          </a>
          <a href="#pricing" className="text-sm font-medium hover:text-primary-500 transition-colors">
            Pricing
          </a>
          <Button className="bg-primary-500 hover:bg-primary-600 text-white">
            Get Started
          </Button>
        </nav>
      </div>
    </header>
  );
};
