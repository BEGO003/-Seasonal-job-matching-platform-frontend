import { User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { authApi } from "@/api";
import { useLanguage } from "@/i18n";

export const Header = () => {
  const [name, setName] = useState<string>("Employer");
  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    const u = authApi.getCurrentUser?.() || null;
    if (u && (u as any).name) setName((u as any).name);
  }, []);

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "ar" : "en");
  };

  return (
    <header className="border-b bg-white/95 backdrop-blur-md px-6 py-4 z-50 shadow-sm">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-4">
          <img
            src="https://cdn-icons-png.flaticon.com/512/2313/2313256.png"
            alt="App icon"
            className="w-12 h-12 rounded-2xl shadow-lg object-cover"
          />
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
              HireConnect
            </h1>
            <p className="text-sm text-muted-foreground">{t("welcomeUser")}, {name}!</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleLanguage}
            className="flex items-center gap-2 rounded-full px-4 py-2 border-primary/30 hover:bg-primary/5 text-sm font-semibold transition-all duration-200"
            id="language-toggle"
          >
            🌐 {t("switchLang")}
          </Button>
          <Link to="/profile" aria-label="Profile">
            <button
              className="rounded-full overflow-hidden border border-border shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary"
              style={{ width: 50, height: 50 }}
            >
              <img
                src="https://cdn-icons-png.flaticon.com/512/11753/11753993.png"
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </button>
          </Link>
        </div>
      </div>
    </header>
  );
};
