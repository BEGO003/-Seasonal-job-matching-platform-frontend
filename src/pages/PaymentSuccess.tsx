import { useEffect } from "react";
import { CheckCircle } from "lucide-react";
import { useLanguage } from "@/i18n";

const PaymentSuccess = () => {
  const { t } = useLanguage();

  useEffect(() => {
    console.log("💳 [Payment] ✅ PaymentSuccess page rendered");
    console.log("💳 [Payment] Current URL:", window.location.href);
    console.log("💳 [Payment] URL search params:", window.location.search);
    console.log("💳 [Payment] Referrer:", document.referrer);
  }, []);
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50/30 flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        {/* Animated checkmark */}
        <div className="mx-auto mb-8 w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-lg shadow-green-200 animate-bounce">
          <CheckCircle className="w-14 h-14 text-white" />
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          {t("paymentSuccessTitle")}
        </h1>

        <p className="text-lg text-gray-600 mb-6">
          {t("paymentSuccessCredits")}
        </p>

        <div className="px-6 py-4 rounded-2xl bg-gray-100 border border-gray-200">
          <p className="text-base font-medium text-gray-700">
            {t("paymentSuccessClose")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
