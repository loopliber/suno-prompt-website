
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Music, Book, Zap, Home, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const navigationItems = [
  {
    title: "Home",
    url: createPageUrl("Homepage"),
    icon: Home,
  },
  {
    title: "Blog",
    url: createPageUrl("Blog"),
    icon: Book,
  },
  {
    title: "Prompt Guide",
    url: createPageUrl("Guide"),
    icon: Book,
  },
  {
    title: "Prompt Generator",
    url: createPageUrl("Generator"),
    icon: Zap,
  },
];

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-slate-100 font-sans">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        
        body {
          font-family: 'Inter', sans-serif;
        }

        :root {
          --background: 240 10% 3.9%;
          --foreground: 0 0% 98%;
          --card: 240 10% 3.9%;
          --card-foreground: 0 0% 98%;
          --popover: 240 10% 3.9%;
          --popover-foreground: 0 0% 98%;
          --primary: 217 91% 60%;
          --primary-foreground: 0 0% 100%;
          --secondary: 240 3.7% 15.9%;
          --secondary-foreground: 0 0% 98%;
          --muted: 240 3.7% 15.9%;
          --muted-foreground: 240 5% 64.9%;
          --accent: 240 3.7% 15.9%;
          --accent-foreground: 0 0% 98%;
          --destructive: 0 62.8% 30.6%;
          --destructive-foreground: 0 0% 98%;
          --border: 240 3.7% 15.9%;
          --input: 240 3.7% 15.9%;
          --ring: 217 91% 60%;
        }
      `}</style>
      
      {/* Background Gradient */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute -top-[20rem] -left-[20rem] w-[50rem] h-[50rem] bg-blue-500/20 rounded-full blur-[150px]"></div>
        <div className="absolute -bottom-[20rem] -right-[20rem] w-[50rem] h-[50rem] bg-purple-500/20 rounded-full blur-[150px]"></div>
      </div>

      <div className="relative z-10">
        {/* Navigation */}
        <nav className="fixed top-0 left-0 right-0 border-b border-white/10 bg-black/30 backdrop-blur-lg z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Logo */}
              <Link to={createPageUrl("Homepage")} className="flex items-center gap-2 group">
                <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center border border-white/20 group-hover:border-blue-400 transition-colors">
                  <Zap className="w-5 h-5 text-blue-400" />
                </div>
                <span className="text-xl font-semibold text-white">
                  SunoPrompt
                </span>
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center gap-2">
                {navigationItems.map((item) => (
                  <Link
                    key={item.title}
                    to={item.url}
                    className={`text-sm font-medium px-3 py-2 rounded-lg transition-all duration-200 ${
                      location.pathname === item.url
                        ? 'text-blue-400 bg-white/10'
                        : 'text-slate-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {item.title}
                  </Link>
                ))}
              </div>

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden text-slate-300 hover:text-blue-400 hover:bg-white/10"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>

            {/* Mobile Navigation */}
            {mobileMenuOpen && (
              <div className="md:hidden border-t border-white/10 py-4">
                <div className="space-y-2">
                  {navigationItems.map((item) => (
                    <Link
                      key={item.title}
                      to={item.url}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                        location.pathname === item.url
                          ? 'text-blue-400 bg-white/10'
                          : 'text-slate-300 hover:text-white hover:bg-white/5'
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <item.icon className="w-4 h-4" />
                      {item.title}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* Main Content */}
        <main className="min-h-screen pt-16">
          {children}
        </main>

        {/* Footer */}
        <footer className="border-t border-white/10 mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex flex-col md:flex-row justify-between items-center gap-8">
               <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center border border-white/20">
                  <Zap className="w-5 h-5 text-blue-400" />
                </div>
                <span className="text-xl font-semibold text-white">
                  SunoPrompt
                </span>
              </div>
              <p className="text-slate-400 text-sm">
                © {new Date().getFullYear()} SunoPrompt. All rights reserved.
              </p>
              <div className="flex gap-4">
                {navigationItems.slice(1).map((item) => (
                   <Link
                    key={item.title}
                    to={item.url}
                    className="text-sm text-slate-400 hover:text-blue-400 transition-colors"
                  >
                    {item.title}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
