import { useState } from "react";
import { Check, X, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import Layout from "../../components/common/Layout.jsx";
import LoadingSpinner from "../../components/common/LoadingSpinner.jsx";
import useAuthStore from "../../store/authStore.js";
import useCreditStore from "../../store/creditStore.js";
import api from "../../api/axios.js";

// Hardcoded plans
const PLANS = [
  {
    id: "free",
    label: "Free",
    price: "$0/month",
    credits: 100,
    features: [
      "100 credits/month",
      "All AI tools",
      "Generation history",
      "Basic support",
    ],
  },
  {
    id: "pro",
    label: "Pro",
    price: "$9/month",
    credits: 1000,
    features: [
      "1000 credits/month",
      "All AI tools",
      "Generation history",
      "Priority support",
      "Faster responses",
    ],
  },
  {
    id: "enterprise",
    label: "Enterprise",
    price: "$29/month",
    credits: 10000,
    features: [
      "10000 credits/month",
      "All AI tools",
      "Generation history",
      "Dedicated support",
      "Fastest responses",
      "API access",
    ],
  },
];

const Subscription = () => {
  const { user } = useAuthStore();
  const { fetchBalance } = useCreditStore();

  // Upgrade state
  const [upgrading, setUpgrading] = useState(null);
  const [message, setMessage] = useState(null);

  // Redeem state
  const [promoCode, setPromoCode] = useState("");
  const [redeeming, setRedeeming] = useState(false);
  const [redeemMessage, setRedeemMessage] = useState(null);

  // Payment modal state
  const [showPayment, setShowPayment] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [paymentStep, setPaymentStep] = useState("form"); // form | processing | success
  const [cardForm, setCardForm] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: "",
  });

  const currentPlan = user?.subscription || "free";

  // ─── Helpers ───────────────────────────────────────────────
  const formatCardNumber = (value) =>
    value.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();

  const formatExpiry = (value) =>
    value.replace(/\D/g, "").slice(0, 4).replace(/^(\d{2})(\d)/, "$1/$2");

  // ─── Upgrade ───────────────────────────────────────────────
  const handleUpgrade = async (planId) => {
    setUpgrading(planId);
    setMessage(null);
    try {
      const { data } = await api.post("/subscription/upgrade", { plan: planId });
      setMessage({ type: "success", text: data.message });
      fetchBalance();
      const updatedUser = { ...user, subscription: planId };
      localStorage.setItem("user", JSON.stringify(updatedUser));
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Upgrade failed.",
      });
    } finally {
      setUpgrading(null);
    }
  };

  // ─── Payment flow ──────────────────────────────────────────
  const handleSelectPlan = (plan) => {
    if (plan.id === "free") {
      handleUpgrade("free");
      return;
    }
    setSelectedPlan(plan);
    setPaymentStep("form");
    setCardForm({ number: "", name: "", expiry: "", cvv: "" });
    setShowPayment(true);
  };

  const handlePayment = async () => {
    if (!cardForm.number || !cardForm.name || !cardForm.expiry || !cardForm.cvv)
      return;
    setPaymentStep("processing");
    await new Promise((r) => setTimeout(r, 2500));
    setPaymentStep("success");
    await handleUpgrade(selectedPlan.id);
    setTimeout(() => {
      setShowPayment(false);
      setPaymentStep("form");
    }, 2000);
  };

  // ─── Redeem ────────────────────────────────────────────────
  const handleRedeem = async () => {
    if (!promoCode.trim()) return;
    setRedeeming(true);
    setRedeemMessage(null);
    try {
      const { data } = await api.post("/subscription/redeem", {
        code: promoCode,
      });
      setRedeemMessage({ type: "success", text: data.message });
      setPromoCode("");
      fetchBalance();
    } catch (err) {
      setRedeemMessage({
        type: "error",
        text: err.response?.data?.message || "Failed to redeem code.",
      });
    } finally {
      setRedeeming(false);
    }
  };

  // ─── UI ────────────────────────────────────────────────────
  return (
    <Layout>
      <div className="p-4 lg:p-5 max-w-4xl mx-auto pt-14 lg:pt-5 space-y-8">
        {/* Header */}
        <div className="space-y-1">
          <h1 className="text-xl font-semibold text-white tracking-tight">
            Subscription
          </h1>
          <p className="text-zinc-500 text-sm">
            Current plan:{" "}
            <span className="text-white font-medium capitalize">
              {currentPlan}
            </span>
          </p>
        </div>

        {/* Global message */}
        {message && (
          <div
            className={`p-3 rounded-lg border text-sm ${
              message.type === "success"
                ? "bg-green-500/10 border-green-500/20 text-green-400"
                : "bg-red-500/10 border-red-500/20 text-red-400"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Plans grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {PLANS.map((plan) => {
            const isCurrent = currentPlan === plan.id;
            const isDowngrade =
              (currentPlan === "pro" && plan.id === "free") ||
              (currentPlan === "enterprise" &&
                (plan.id === "free" || plan.id === "pro"));

            return (
              <div
                key={plan.id}
                className={`relative flex flex-col bg-zinc-900 border rounded-xl p-5 transition-colors ${
                  isCurrent
                    ? "border-white/30"
                    : "border-zinc-800 hover:border-zinc-700"
                }`}
              >
                {isCurrent && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-white text-black text-[10px] px-3">
                      Current Plan
                    </Badge>
                  </div>
                )}

                {/* Plan info */}
                <div className="mb-4 space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-zinc-800 rounded-lg flex items-center justify-center">
                      <Zap className="w-3.5 h-3.5 text-zinc-300" />
                    </div>
                    <h2 className="font-semibold text-white">{plan.label}</h2>
                  </div>
                  <p className="text-2xl font-bold text-white">{plan.price}</p>
                  <p className="text-xs text-zinc-500">
                    {plan.credits.toLocaleString()} credits/month
                  </p>
                </div>

                {/* Features */}
                <ul className="space-y-2 flex-1 mb-5">
                  {plan.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-center gap-2 text-sm text-zinc-300"
                    >
                      <Check className="w-3.5 h-3.5 text-zinc-400 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>

                {/* Button */}
                <Button
                  onClick={() => handleSelectPlan(plan)}
                  disabled={isCurrent || isDowngrade || upgrading === plan.id}
                  className={`w-full h-10 font-medium text-sm ${
                    isCurrent
                      ? "bg-zinc-800 text-zinc-500 cursor-default hover:bg-zinc-800"
                      : isDowngrade
                      ? "bg-zinc-800 text-zinc-600 cursor-not-allowed hover:bg-zinc-800"
                      : "bg-white text-black hover:bg-zinc-200"
                  }`}
                >
                  {upgrading === plan.id ? (
                    <LoadingSpinner size="sm" />
                  ) : isCurrent ? (
                    "Current Plan"
                  ) : isDowngrade ? (
                    "Downgrade"
                  ) : (
                    `Upgrade to ${plan.label}`
                  )}
                </Button>
              </div>
            );
          })}
        </div>

        <Separator className="bg-zinc-800/50" />

        {/* Redeem Code */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-4">
          <div>
            <h2 className="text-sm font-semibold text-white">
              Redeem Promo Code
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              Have a promo code? Enter it below to get bonus credits.
            </p>
          </div>

          {redeemMessage && (
            <div
              className={`p-3 rounded-lg border text-sm ${
                redeemMessage.type === "success"
                  ? "bg-green-500/10 border-green-500/20 text-green-400"
                  : "bg-red-500/10 border-red-500/20 text-red-400"
              }`}
            >
              {redeemMessage.text}
            </div>
          )}

          <div className="flex gap-3">
            <Input
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
              onKeyDown={(e) => e.key === "Enter" && handleRedeem()}
              placeholder="e.g. NEXORA100"
              className="bg-zinc-950 border-zinc-800 text-white placeholder:text-zinc-600 h-11 font-mono tracking-widest focus-visible:ring-zinc-600"
            />
            <Button
              onClick={handleRedeem}
              disabled={redeeming || !promoCode.trim()}
              className="bg-white text-black hover:bg-zinc-200 disabled:opacity-40 h-11 px-6 font-medium"
            >
              {redeeming ? <LoadingSpinner size="sm" /> : "Redeem"}
            </Button>
          </div>

          <p className="text-[11px] text-zinc-600">
            Try: NEXORA100 · NEXORA500 · WELCOME200 · DEVTEST999 · LAUNCH50
          </p>
        </div>

        {/* Note */}
        <p className="text-center text-xs text-zinc-700 pb-4">
          This is a demo project. No real payments are processed. Stripe
          integration ready for production.
        </p>
      </div>

      {/* ── Payment Modal ─────────────────────────────────── */}
      {showPayment && selectedPlan && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-md p-6 space-y-5">

            {/* Form step */}
            {paymentStep === "form" && (
              <>
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-white font-semibold text-lg">
                      Upgrade to {selectedPlan.label}
                    </h2>
                    <p className="text-zinc-500 text-sm">
                      {selectedPlan.price} · billed monthly
                    </p>
                  </div>
                  <button
                    onClick={() => setShowPayment(false)}
                    className="text-zinc-500 hover:text-white transition-colors mt-0.5"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Order summary */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-400">{selectedPlan.label} Plan</span>
                    <span className="text-white">{selectedPlan.price}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-400">Credits</span>
                    <span className="text-white">
                      {selectedPlan.credits.toLocaleString()}/month
                    </span>
                  </div>
                  <Separator className="bg-zinc-800" />
                  <div className="flex justify-between text-sm font-semibold">
                    <span className="text-white">Total</span>
                    <span className="text-white">{selectedPlan.price}</span>
                  </div>
                </div>

                {/* Card form */}
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <Label className="text-zinc-400 text-xs">Card Number</Label>
                    <Input
                      value={cardForm.number}
                      onChange={(e) =>
                        setCardForm({
                          ...cardForm,
                          number: formatCardNumber(e.target.value),
                        })
                      }
                      placeholder="4242 4242 4242 4242"
                      className="bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-600 h-11 font-mono tracking-widest focus-visible:ring-zinc-600"
                      maxLength={19}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-zinc-400 text-xs">
                      Cardholder Name
                    </Label>
                    <Input
                      value={cardForm.name}
                      onChange={(e) =>
                        setCardForm({ ...cardForm, name: e.target.value })
                      }
                      placeholder="John Doe"
                      className="bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-600 h-11 focus-visible:ring-zinc-600"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-zinc-400 text-xs">Expiry</Label>
                      <Input
                        value={cardForm.expiry}
                        onChange={(e) =>
                          setCardForm({
                            ...cardForm,
                            expiry: formatExpiry(e.target.value),
                          })
                        }
                        placeholder="MM/YY"
                        className="bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-600 h-11 font-mono focus-visible:ring-zinc-600"
                        maxLength={5}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-zinc-400 text-xs">CVV</Label>
                      <Input
                        value={cardForm.cvv}
                        onChange={(e) =>
                          setCardForm({
                            ...cardForm,
                            cvv: e.target.value.replace(/\D/g, "").slice(0, 3),
                          })
                        }
                        placeholder="•••"
                        type="password"
                        className="bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-600 h-11 font-mono focus-visible:ring-zinc-600"
                        maxLength={3}
                      />
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handlePayment}
                  disabled={
                    !cardForm.number ||
                    !cardForm.name ||
                    !cardForm.expiry ||
                    !cardForm.cvv
                  }
                  className="w-full h-11 bg-white text-black hover:bg-zinc-200 font-medium disabled:opacity-40"
                >
                  Pay {selectedPlan.price}
                </Button>

                <p className="text-center text-[11px] text-zinc-600">
                  🔒 Demo payment — no real charges. Portfolio purposes only.
                </p>
              </>
            )}

            {/* Processing step */}
            {paymentStep === "processing" && (
              <div className="flex flex-col items-center justify-center py-14 space-y-4">
                <LoadingSpinner size="lg" />
                <p className="text-white font-medium">Processing payment...</p>
                <p className="text-zinc-500 text-sm">Please wait a moment</p>
              </div>
            )}

            {/* Success step */}
            {paymentStep === "success" && (
              <div className="flex flex-col items-center justify-center py-14 space-y-4">
                <div className="w-16 h-16 bg-zinc-900 border border-zinc-700 rounded-full flex items-center justify-center">
                  <Check className="w-8 h-8 text-green-400" />
                </div>
                <p className="text-white font-semibold text-lg">
                  Payment Successful!
                </p>
                <p className="text-zinc-500 text-sm text-center">
                  You are now on the {selectedPlan.label} plan with{" "}
                  {selectedPlan.credits.toLocaleString()} credits.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Subscription;