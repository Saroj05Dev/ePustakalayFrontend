import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { createOrder } from "../redux/slices/orderSlice";

// ── Icons ──────────────────────────────────────────────────────────────────
const ChevronRightIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 18l6-6-6-6"/>
  </svg>
);
const ArrowRightIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M12 5l7 7-7 7"/>
  </svg>
);
const ShippingIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#002629" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="3" width="15" height="13" rx="1"/>
    <path d="M16 8h4l3 4v4h-7V8z"/>
    <circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
  </svg>
);
const PaymentIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#002629" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="4" width="22" height="16" rx="2"/>
    <line x1="1" y1="10" x2="23" y2="10"/>
  </svg>
);
const CardIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="4" width="22" height="16" rx="2"/>
    <line x1="1" y1="10" x2="23" y2="10"/>
  </svg>
);
const UpiIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    <polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);
const CodIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
);
const LockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);
const ShieldIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V7L12 2z"/>
  </svg>
);
const EditIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);
const BookFallbackIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#c0c8c9" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
  </svg>
);
const SpinnerIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="animate-spin">
    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
  </svg>
);

const GST_RATE = 0.05;
const SHIPPING_FLAT = 50;

// ── Input Field ────────────────────────────────────────────────────────────
function Field({ label, type = "text", value, onChange, placeholder, colSpan = "", maxLength }) {
  return (
    <div className={`space-y-1 ${colSpan}`}>
      <label className="block text-[10px] font-bold text-[#404849] uppercase tracking-widest">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        className="w-full bg-[#f1f4fa] border-none rounded-lg px-4 py-3 text-sm text-[#181c20] font-medium focus:ring-2 focus:ring-[#002629]/20 outline-none placeholder:text-[#c0c8c9]"
      />
    </div>
  );
}

// ── Payment Option ─────────────────────────────────────────────────────────
function PaymentOption({ id, label, icon: Icon, active, onSelect, children }) {
  return (
    <div
      onClick={() => onSelect(id)}
      className={`rounded-xl p-6 cursor-pointer transition-all duration-200 ${
        active
          ? "border-2 border-[#002629] bg-[#002629]/[0.02]"
          : "border border-[#c0c8c9]/30 hover:border-[#002629]/40"
      }`}
    >
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="radio"
            name="payment"
            checked={active}
            onChange={() => onSelect(id)}
            className="h-5 w-5 accent-[#002629]"
          />
          <span className="font-bold text-[#181c20]">{label}</span>
        </label>
        <span className="text-[#404849]"><Icon /></span>
      </div>
      {active && children && (
        <div className="mt-6">{children}</div>
      )}
    </div>
  );
}

// ── Error Banner ───────────────────────────────────────────────────────────
function ErrorBanner({ message }) {
  if (!message) return null;
  return (
    <div className="mb-6 px-5 py-4 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700 font-medium">
      ⚠️ {message}
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────
export default function CheckoutPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ── Redux state ──────────────────────────────────────────────────────────
  // Cart items come from your existing cartSlice
  const cartItems = useSelector((state) => state.cart.cartData || []);
  const cartSubtotal = useSelector((state) => state.cart.totalAmount || 0);

  // Order loading state from existing orderSlice
  const isPlacingOrder = useSelector((state) => state.order.loading);

  // ── Shipping form state ──────────────────────────────────────────────────
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  // ── Payment state ────────────────────────────────────────────────────────
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [upiId, setUpiId] = useState("");

  // ── UI state ─────────────────────────────────────────────────────────────
  const [agreed, setAgreed] = useState(false);
  // API errors are handled via react-hot-toast inside the slice itself;
  // this state is only for client-side validation feedback
  const [validationError, setValidationError] = useState("");

  // ── Derived totals (use redux subtotal, fall back to manual if 0) ────────
  const subtotal = cartSubtotal || cartItems.reduce((s, i) => s + (i.book?.price || 0) * i.quantity, 0);
  const tax = Math.round(subtotal * GST_RATE);
  const total = subtotal + tax + SHIPPING_FLAT;

  const set = (key) => (val) => setForm(f => ({ ...f, [key]: val }));

  // ── Format card number with spaces ───────────────────────────────────────
  const handleCardNumberChange = (val) => {
    const digits = val.replace(/\D/g, "").slice(0, 16);
    const formatted = digits.replace(/(.{4})/g, "$1 ").trim();
    setCardNumber(formatted);
  };

  // ── Format expiry as MM / YY ─────────────────────────────────────────────
  const handleExpiryChange = (val) => {
    const digits = val.replace(/\D/g, "").slice(0, 4);
    if (digits.length >= 3) {
      setExpiry(`${digits.slice(0, 2)} / ${digits.slice(2)}`);
    } else {
      setExpiry(digits);
    }
  };

  // ── Validation ────────────────────────────────────────────────────────────
  const validate = () => {
    if (cartItems.length === 0) {
      return "Your cart is empty. Add some books before checking out.";
    }
    if (!agreed) {
      return "Please agree to the Terms & Conditions to continue.";
    }
    const { name, phone, address, city, state: st, pincode } = form;
    if (!name.trim() || !phone.trim() || !address.trim() || !city.trim() || !st.trim() || !pincode.trim()) {
      return "Please fill in all shipping address fields.";
    }
    if (!/^\d{6}$/.test(pincode.trim())) {
      return "Please enter a valid 6-digit pincode.";
    }
    if (paymentMethod === "card") {
      const rawCard = cardNumber.replace(/\s/g, "");
      if (rawCard.length !== 16) return "Please enter a valid 16-digit card number.";
      if (!expiry.includes("/")) return "Please enter a valid expiry date (MM / YY).";
      if (cvv.length < 3) return "Please enter a valid CVV.";
    }
    if (paymentMethod === "upi" && !upiId.trim()) {
      return "Please enter your UPI ID.";
    }
    return null;
  };

  // ── Place order handler ───────────────────────────────────────────────────
  const handlePlaceOrder = async () => {
    const error = validate();
    if (error) {
      setValidationError(error);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    setValidationError("");

    // Build payload to match your POST /api/orders body shape
    const orderData = {
      shippingAddress: {
        fullName: form.name.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
        city: form.city.trim(),
        state: form.state.trim(),
        pincode: Number(form.pincode.trim()),
      },
    };

    const result = await dispatch(createOrder(orderData));

    if (createOrder.fulfilled.match(result)) {
      // Slice stores the response as apiResponse (the full axios response)
      // Unwrap: data.data.data → data.data → data → fallback to payload itself
      const order =
        result.payload?.data?.data ||
        result.payload?.data ||
        result.payload;
      navigate("/order-success", { state: { order } });
    }
    // API errors are already shown via toast.promise inside the slice
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600&display=swap');
        .co-headline { font-family: 'Manrope', sans-serif; }
        .co-body     { font-family: 'Inter', sans-serif; }
        .custom-scroll::-webkit-scrollbar { width: 4px; }
        .custom-scroll::-webkit-scrollbar-track { background: transparent; }
        .custom-scroll::-webkit-scrollbar-thumb { background: #dfe3e8; border-radius: 10px; }
        .custom-scroll::-webkit-scrollbar-thumb:hover { background: #c0c8c9; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .animate-spin { animation: spin 0.8s linear infinite; }
      `}</style>

      <div className="co-body bg-[#f7f9ff] text-[#181c20] min-h-screen">
        <main className="pt-10 pb-20 px-6 md:px-10 max-w-7xl mx-auto">

          {/* ── Breadcrumb ── */}
          <nav className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#404849] mb-6">
            <Link to="/" className="hover:text-[#002629] transition-colors no-underline text-[#404849]">Home</Link>
            <ChevronRightIcon />
            <Link to="/cart" className="hover:text-[#002629] transition-colors no-underline text-[#404849]">Shopping Cart</Link>
            <ChevronRightIcon />
            <span className="text-[#002629]">Checkout</span>
          </nav>

          {/* ── Page Title ── */}
          <header className="mb-10">
            <h1 className="co-headline text-5xl font-extrabold tracking-tight text-[#002629]">Checkout</h1>
            <p className="text-[#404849] mt-2 max-w-lg">
              Review your curated selection and finalize your purchase to begin your next literary journey.
            </p>
          </header>

          {/* ── Validation error banner (API errors shown via toast) ── */}
          <ErrorBanner message={validationError} />

          {/* ── Two-column layout ── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

            {/* ── Left: Forms ── */}
            <div className="lg:col-span-7 space-y-8">

              {/* Shipping Address */}
              <section className="bg-white rounded-xl p-8 shadow-sm border border-[#c0c8c9]/10 relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1 h-full bg-[#002629] -translate-x-full group-hover:translate-x-0 transition-transform duration-300" />

                <div className="flex justify-between items-center mb-6">
                  <h2 className="co-headline text-xl font-bold flex items-center gap-2.5 text-[#181c20]">
                    <ShippingIcon />
                    Shipping Address
                  </h2>
                  <button
                    onClick={() => setForm({ name: "", phone: "", address: "", city: "", state: "", pincode: "" })}
                    className="text-sm font-bold text-[#002629] flex items-center gap-1 hover:underline"
                  >
                    <EditIcon /> Clear
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Field label="Full Name"    value={form.name}    onChange={set("name")}    placeholder="Your full name" />
                  <Field label="Phone Number" value={form.phone}   onChange={set("phone")}   placeholder="+91 00000 00000" type="tel" />
                  <Field label="Address Line" value={form.address} onChange={set("address")} placeholder="Street, Block, Area" colSpan="md:col-span-2" />
                  <Field label="City"         value={form.city}    onChange={set("city")}    placeholder="City" />
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="State"   value={form.state}   onChange={set("state")}   placeholder="State" />
                    <Field label="Pincode" value={form.pincode} onChange={set("pincode")} placeholder="110001" type="text" maxLength={6} />
                  </div>
                </div>
              </section>

              {/* Payment Method */}
              <section className="bg-white rounded-xl p-8 shadow-sm border border-[#c0c8c9]/10">
                <h2 className="co-headline text-xl font-bold flex items-center gap-2.5 text-[#181c20] mb-6">
                  <PaymentIcon />
                  Payment Method
                </h2>

                <div className="space-y-4">
                  {/* Credit / Debit Card */}
                  <PaymentOption
                    id="card"
                    label="Credit / Debit Card"
                    icon={CardIcon}
                    active={paymentMethod === "card"}
                    onSelect={setPaymentMethod}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2 space-y-1">
                        <label className="block text-[10px] font-bold text-[#404849] uppercase tracking-widest">
                          Card Number
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="XXXX XXXX XXXX 0000"
                            value={cardNumber}
                            onChange={e => handleCardNumberChange(e.target.value)}
                            maxLength={19}
                            className="w-full bg-[#f1f4fa] border-none rounded-lg px-4 py-3 pr-11 text-sm text-[#181c20] font-medium focus:ring-2 focus:ring-[#002629]/20 outline-none placeholder:text-[#c0c8c9]"
                          />
                          <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#c0c8c9]">
                            <LockIcon />
                          </span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="block text-[10px] font-bold text-[#404849] uppercase tracking-widest">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          placeholder="MM / YY"
                          value={expiry}
                          onChange={e => handleExpiryChange(e.target.value)}
                          maxLength={7}
                          className="w-full bg-[#f1f4fa] border-none rounded-lg px-4 py-3 text-sm text-[#181c20] font-medium focus:ring-2 focus:ring-[#002629]/20 outline-none placeholder:text-[#c0c8c9]"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-[10px] font-bold text-[#404849] uppercase tracking-widest">
                          CVV
                        </label>
                        <input
                          type="password"
                          placeholder="•••"
                          value={cvv}
                          onChange={e => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                          maxLength={4}
                          className="w-full bg-[#f1f4fa] border-none rounded-lg px-4 py-3 text-sm text-[#181c20] font-medium focus:ring-2 focus:ring-[#002629]/20 outline-none placeholder:text-[#c0c8c9]"
                        />
                      </div>
                    </div>
                  </PaymentOption>

                  {/* UPI */}
                  <PaymentOption
                    id="upi"
                    label="UPI (Unified Payments Interface)"
                    icon={UpiIcon}
                    active={paymentMethod === "upi"}
                    onSelect={setPaymentMethod}
                  >
                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold text-[#404849] uppercase tracking-widest">
                        UPI ID
                      </label>
                      <input
                        type="text"
                        placeholder="yourname@upi"
                        value={upiId}
                        onChange={e => setUpiId(e.target.value)}
                        className="w-full bg-[#f1f4fa] border-none rounded-lg px-4 py-3 text-sm text-[#181c20] font-medium focus:ring-2 focus:ring-[#002629]/20 outline-none placeholder:text-[#c0c8c9]"
                      />
                    </div>
                  </PaymentOption>

                  {/* Cash on Delivery */}
                  <PaymentOption
                    id="cod"
                    label="Cash on Delivery"
                    icon={CodIcon}
                    active={paymentMethod === "cod"}
                    onSelect={setPaymentMethod}
                  >
                    <p className="text-sm text-[#404849]">
                      Pay when your order is delivered. Available for orders up to ₹5,000.
                    </p>
                  </PaymentOption>
                </div>
              </section>
            </div>

            {/* ── Right: Order Summary (sticky) ── */}
            <div className="lg:col-span-5 sticky top-24">
              <div className="bg-[#f1f4fa] rounded-xl overflow-hidden shadow-xl">

                {/* Items list */}
                <div className="p-8">
                  <h3 className="co-headline text-xl font-extrabold text-[#002629] mb-6 flex justify-between items-center">
                    Order Summary
                    <span className="text-sm font-normal text-[#404849]" style={{ fontFamily: "Inter, sans-serif" }}>
                      {cartItems.length} {cartItems.length === 1 ? "Item" : "Items"}
                    </span>
                  </h3>

                  {cartItems.length === 0 ? (
                    <div className="text-center py-8 text-[#404849] text-sm">
                      <p>Your cart is empty.</p>
                      <Link to="/" className="text-[#002629] font-bold underline mt-2 block">Browse books →</Link>
                    </div>
                  ) : (
                    <div className="space-y-6 mb-8 max-h-72 overflow-y-auto pr-1 custom-scroll">
                      {cartItems.map((item) => {
                        const book = item.book || {};
                        const imgSrc = book.cover_image || book.cover || "";
                        return (
                          <div key={item.cartItemId || item._id} className="flex gap-4">
                            <div className="w-16 h-20 bg-[#e5e8ee] rounded-lg flex-shrink-0 overflow-hidden shadow-sm flex items-center justify-center">
                              {imgSrc ? (
                                <img
                                  src={imgSrc}
                                  alt={book.title}
                                  className="w-full h-full object-cover"
                                  onError={e => {
                                    e.target.style.display = "none";
                                    e.target.nextSibling.style.display = "flex";
                                  }}
                                />
                              ) : null}
                              <div
                                className="w-full h-full items-center justify-center bg-[#e5e8ee]"
                                style={{ display: imgSrc ? "none" : "flex" }}
                              >
                                <BookFallbackIcon />
                              </div>
                            </div>
                            <div className="flex-grow">
                              <p className="co-headline font-bold text-sm text-[#181c20] leading-tight">{book.title}</p>
                              <p className="text-xs text-[#404849] mt-0.5">{book.author}</p>
                              <div className="flex justify-between items-center mt-2">
                                <span className="text-xs font-medium text-[#404849]">Qty: {item.quantity}</span>
                                <span className="font-bold text-sm text-[#181c20]">
                                  ₹{((book.price || 0) * item.quantity).toLocaleString("en-IN")}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Price breakdown */}
                  <div className="space-y-3 pt-6 border-t border-[#c0c8c9]/20">
                    <div className="flex justify-between text-sm text-[#404849]">
                      <span>Subtotal</span>
                      <span className="text-[#181c20] font-semibold">₹{subtotal.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="flex justify-between text-sm text-[#404849]">
                      <span>GST (5%)</span>
                      <span className="text-[#181c20] font-semibold">₹{tax.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="flex justify-between text-sm text-[#404849]">
                      <span>Shipping</span>
                      <span className="text-[#381905] font-semibold">Flat Rate ₹{SHIPPING_FLAT.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="flex justify-between items-center pt-4 mt-2 border-t border-[#002629]/10">
                      <span className="co-headline text-xl font-black text-[#002629]">Order Total</span>
                      <span className="co-headline text-xl font-black text-[#002629]">
                        ₹{total.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                </div>

                {/* CTA footer */}
                <div className="p-8 bg-[#e5e8ee]">
                  {/* Terms checkbox */}
                  <label className="flex items-start gap-3 mb-6 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agreed}
                      onChange={e => setAgreed(e.target.checked)}
                      className="rounded accent-[#002629] mt-0.5 h-4 w-4 flex-shrink-0"
                    />
                    <span className="text-xs text-[#404849] leading-relaxed">
                      I agree to the{" "}
                      <a href="#" className="underline font-bold text-[#002629]">Terms & Conditions</a>
                      {" "}and understand that my data will be used to process this order.
                    </span>
                  </label>

                  {/* Place Order CTA */}
                  <button
                    onClick={handlePlaceOrder}
                    disabled={isPlacingOrder || cartItems.length === 0}
                    className="w-full py-4 bg-gradient-to-r from-[#002629] to-[#083d41] text-white co-headline font-bold text-lg rounded-xl shadow-lg hover:shadow-xl active:scale-[0.98] transition-all flex items-center justify-center gap-2 group disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100"
                  >
                    {isPlacingOrder ? (
                      <>
                        <SpinnerIcon />
                        Placing Order…
                      </>
                    ) : (
                      <>
                        Place Order
                        <span className="group-hover:translate-x-1 transition-transform">
                          <ArrowRightIcon />
                        </span>
                      </>
                    )}
                  </button>

                  {/* Trust signals */}
                  <div className="mt-6 flex items-center justify-center gap-6 opacity-60">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-[#404849]">
                      <ShieldIcon />
                      Secured Checkout
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-[#404849]">
                      <LockIcon />
                      SSL Encrypted
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}