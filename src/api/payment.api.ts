import { API_BASE_URL, getLoggedInUserId, apiFetch } from "./config";
import { ApiError } from "./utils";

export const paymentApi = {
  /**
   * Create a Stripe checkout session for credit refill.
   * The backend returns a URL that the user should be redirected to.
   * Endpoint: POST /api/payments/create-checkout-session?userId={userId}
   */
  createCheckoutSession: async (): Promise<string> => {
    console.log("💳 [Payment] Step 1: Starting checkout session creation...");

    const userId = getLoggedInUserId();
    console.log("💳 [Payment] Step 2: Retrieved userId from localStorage:", userId);

    if (!userId) {
      console.error("💳 [Payment] ❌ FAILED: No userId found — user is not authenticated");
      throw new ApiError(401, "Not authenticated: missing user id");
    }

    const url = `${API_BASE_URL}/payments/create-checkout-session?userId=${userId}`;
    console.log("💳 [Payment] Step 3: Sending POST request to:", url);

    let response: Response;
    try {
      response = await apiFetch(url, { method: "POST" });
      console.log("💳 [Payment] Step 4: Received response — status:", response.status, "statusText:", response.statusText);
    } catch (fetchErr) {
      console.error("💳 [Payment] ❌ FAILED: Network/fetch error:", fetchErr);
      throw fetchErr;
    }

    if (!response.ok) {
      let message = "Failed to create checkout session";
      try {
        const errBody = await response.json();
        message = errBody?.message || errBody?.error || message;
        console.error("💳 [Payment] ❌ FAILED: Server error response:", {
          status: response.status,
          body: errBody,
          message,
        });
      } catch {
        console.error("💳 [Payment] ❌ FAILED: Server error (non-JSON body), status:", response.status);
      }
      throw new ApiError(response.status, message);
    }

    // Backend may return { url: "..." } or just the URL as text
    const contentType = response.headers.get("content-type") || "";
    console.log("💳 [Payment] Step 5: Response content-type:", contentType);

    let checkoutUrl: string;
    if (contentType.includes("application/json")) {
      const data = await response.json();
      console.log("💳 [Payment] Step 6: Parsed JSON response:", data);
      checkoutUrl = data?.url || data?.checkoutUrl || data?.sessionUrl || data;
    } else {
      checkoutUrl = await response.text();
      console.log("💳 [Payment] Step 6: Parsed text response:", checkoutUrl);
    }

    console.log("💳 [Payment] Step 7: Final checkout URL:", checkoutUrl);
    console.log("💳 [Payment] ✅ SUCCESS: Checkout session created, redirecting user...");

    return checkoutUrl;
  },
};

