import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { authApi } from "@/api";
import { useToast } from "@/hooks/use-toast";
import { isValidEmail } from "@/lib/validation";
import { useLanguage } from "@/i18n";

export default function SignInPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );
  const [randomSlogan, setRandomSlogan] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { language, setLanguage, t } = useLanguage();

  const slogans = [
    t("slogan1"),
    t("slogan2"),
    t("slogan3"),
    t("slogan4"),
    t("slogan5"),
  ];

  useEffect(() => {
    // Pick a random slogan on component mount
    const randomIndex = Math.floor(Math.random() * slogans.length);
    setRandomSlogan(slogans[randomIndex]);

    // Check if user is already logged in
    if (authApi.isAuthenticated()) {
      navigate("/dashboard");
    }
  }, [navigate]);

  // Update slogan when language changes
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * slogans.length);
    setRandomSlogan(slogans[randomIndex]);
  }, [language]);

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "ar" : "en");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "email") {
      const email = value.trim();
    }
    if (name === "password") {
      const pwd = value;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const email = formData.email.trim();
      const password = formData.password;

      if (!email) {
        setErrors((prev) => ({ ...prev, email: t("emailRequired") }));
        toast({
          title: t("validationError"),
          description: t("emailRequired"),
          variant: "destructive",
        });
        return;
      }
      if (!isValidEmail(email)) {
        setErrors((prev) => ({ ...prev, email: t("invalidEmail") }));
        toast({
          title: t("validationError"),
          description: t("invalidEmail"),
          variant: "destructive",
        });
        return;
      }
      if (!password.trim()) {
        setErrors((prev) => ({ ...prev, password: t("passwordRequired") }));
        toast({
          title: t("validationError"),
          description: t("passwordRequired"),
          variant: "destructive",
        });
        return;
      }

      const response = await authApi.login({ email, password });

      toast({
        title: t("success"),
        description: response.message,
      });

      navigate("/dashboard");
    } catch (error: any) {
      toast({
        title: t("error"),
        description: error.message || t("invalidCredentials"),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const canSubmit =
    !!formData.email.trim() &&
    !!formData.password.trim() &&
    isValidEmail(formData.email.trim());

  return (
    <div
      className="min-h-screen flex items-center justify-center py-8 px-4 relative"
      style={{
        backgroundImage:
          "url(https://e0.pxfuel.com/wallpapers/801/82/desktop-wallpaper-purple-white-gradient-linear-dark-violet-9400d3-ffffff-120a%C2%B0.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm"></div>

      {/* Floating Language Toggle */}
      <Button
        variant="outline"
        size="sm"
        onClick={toggleLanguage}
        className="fixed top-6 right-6 z-50 flex items-center gap-2 rounded-full px-4 py-2 bg-white/90 backdrop-blur-sm shadow-lg border-primary/30 hover:bg-primary/5 text-sm font-semibold transition-all duration-200"
        id="language-toggle-signin"
      >
        🌐 {t("switchLang")}
      </Button>

      <div className="relative z-10 bg-card rounded-3xl shadow-2xl overflow-hidden w-[1000px] max-w-full flex flex-col md:flex-row">
        {/* Left Section with Slogans */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full md:w-1/2 p-8 md:p-10 flex flex-col justify-center items-start bg-gradient-to-b from-primary to-primary/80 text-primary-foreground rounded-l-3xl"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-6">{t("welcomeBack")}</h1>
          {randomSlogan && (
            <p className="text-xl md:text-2xl opacity-90 leading-relaxed">
              {randomSlogan}
            </p>
          )}
        </motion.div>

        {/* Right Section - Form */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full md:w-1/2 bg-card p-8 md:p-10 flex flex-col justify-center md:rounded-r-3xl rounded-b-3xl md:rounded-bl-none"
        >
          <div className="flex items-center gap-3 mb-6">
            <img
              src="https://www.somebodydigital.com/wp-content/uploads/2024/08/B2B-Email-Marketing-2.png"
              alt="HireConnect Logo"
              className="w-12 h-12 object-contain"
            />
            <h2 className="text-2xl font-bold text-card-foreground">
              HireConnect
            </h2>
          </div>
          <h3 className="text-xl md:text-2xl font-semibold mb-2 text-card-foreground">
            {t("signInTitle")}
          </h3>
          <p className="text-sm mb-4 md:mb-6 text-muted-foreground">
            {t("dontHaveAccount")}{" "}
            <Link to="/signup" className="text-primary hover:underline">
              {t("signUpLink")}
            </Link>
          </p>

          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-3">
              <Label htmlFor="email">{t("emailLabel")}</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="example@email.com"
                value={formData.email}
                onChange={handleChange}
                required
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error" : undefined}
              />
              {errors.email && (
                <p id="email-error" className="mt-1 text-xs text-red-500">
                  {errors.email}
                </p>
              )}
            </div>

            <div className="mb-4">
              <Label htmlFor="password">{t("passwordLabel")}</Label>
              <Input
                id="password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                aria-invalid={!!errors.password}
                aria-describedby={
                  errors.password ? "password-error" : undefined
                }
              />
              {errors.password && (
                <p id="password-error" className="mt-1 text-xs text-red-500">
                  {errors.password}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={loading || !canSubmit}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2 disabled:opacity-60"
            >
              {loading ? t("signingIn") : t("signIn")}
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}