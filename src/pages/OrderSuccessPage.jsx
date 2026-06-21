import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const CheckCircleIcon = () => (
  <svg width="72" height="72" viewBox="0 0 24 24" fill="none" stroke="#002629" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="9 12 11.5 14.5 16 9" />
  </svg>
);

const PackageIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/>
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
    <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
    <line x1="12" y1="22.08" x2="12" y2="12"/>
  </svg>
);

export default function OrderSuccessPage() {
  const location = useLocation();
  const navigate = useNavigate();

  // The order object is passed via router state from CheckoutPage
  const order = location.state?.order;

  useEffect(() => {
    // If someone navigates here directly without placing an order, redirect home
    if (!order) {
      navigate("/", { replace: true });
    }
  }, [order, navigate]);

  if (!order) return null;

  // Safely read order fields — adjust keys to match your actual API response shape
  const orderId = order.orderId || order._id || "—";
  const shippingAddress = order.shippingAddress || {};
  const items = order.items || order.orderItems || [];
  const totalAmount = order.totalAmount || order.total || 0;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700;800&family=Inter:wght@400;500;600&display=swap');
        .co-headline { font-family: 'Manrope', sans-serif; }
        .co-body     { font-family: 'Inter', sans-serif; }
        @keyframes pop {
          0%   { transform: scale(0.6); opacity: 0; }
          70%  { transform: scale(1.1); }
          100% { transform: scale(1); opacity: 1; }
        }
        .pop-in { animation: pop 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
      `}</style>

      <div className="co-body bg-[#f7f9ff] min-h-screen flex items-start justify-center px-6 py-20">
        <div className="w-full max-w-xl">

          {/* ── Success card ── */}
          <div className="bg-white rounded-2xl shadow-xl p-10 text-center">
            <div className="flex justify-center mb-6">
              <div className="pop-in w-24 h-24 rounded-full bg-[#002629]/[0.06] flex items-center justify-center">
                <CheckCircleIcon />
              </div>
            </div>

            <h1 className="co-headline text-3xl font-extrabold text-[#002629] mb-2">
              Order Placed! 🎉
            </h1>
            <p className="text-[#404849] text-sm leading-relaxed mb-8">
              Thank you for your purchase. Your books are being curated for dispatch and will arrive soon.
            </p>

            {/* Order ID */}
            <div className="bg-[#f1f4fa] rounded-xl px-6 py-4 mb-6 text-left">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#404849] mb-1">Order ID</p>
              <p className="co-headline font-bold text-[#002629] text-lg">{orderId}</p>
            </div>

            {/* Shipping info */}
            {shippingAddress.fullName && (
              <div className="bg-[#f1f4fa] rounded-xl px-6 py-4 mb-6 text-left">
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#404849] mb-2">Shipping To</p>
                <p className="font-semibold text-sm text-[#181c20]">{shippingAddress.fullName}</p>
                <p className="text-sm text-[#404849] mt-0.5">
                  {shippingAddress.address}, {shippingAddress.city}, {shippingAddress.state} – {shippingAddress.pincode}
                </p>
                <p className="text-sm text-[#404849]">{shippingAddress.phone}</p>
              </div>
            )}

            {/* Items summary */}
            {items.length > 0 && (
              <div className="bg-[#f1f4fa] rounded-xl px-6 py-4 mb-6 text-left">
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#404849] mb-3 flex items-center gap-1.5">
                  <PackageIcon /> {items.length} {items.length === 1 ? "Book" : "Books"} Ordered
                </p>
                <ul className="space-y-1">
                  {items.map((item, idx) => {
                    const title = item.book?.title || item.title || "Book";
                    const qty = item.quantity || 1;
                    return (
                      <li key={idx} className="text-sm text-[#181c20] font-medium flex justify-between">
                        <span>{title}</span>
                        <span className="text-[#404849]">×{qty}</span>
                      </li>
                    );
                  })}
                </ul>
                {totalAmount > 0 && (
                  <div className="mt-3 pt-3 border-t border-[#c0c8c9]/30 flex justify-between text-sm font-bold text-[#002629]">
                    <span>Total Paid</span>
                    <span>₹{totalAmount.toLocaleString("en-IN")}</span>
                  </div>
                )}
              </div>
            )}

            {/* CTAs */}
            <div className="space-y-3 mt-2">
              <Link
                to="/orders"
                className="block w-full py-3 bg-gradient-to-r from-[#002629] to-[#083d41] text-white co-headline font-bold rounded-xl text-center no-underline hover:opacity-90 transition-opacity"
              >
                View My Orders
              </Link>
              <Link
                to="/"
                className="block w-full py-3 border border-[#002629]/20 text-[#002629] co-headline font-bold rounded-xl text-center no-underline hover:bg-[#002629]/[0.03] transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </div>

          {/* ── Delivery note ── */}
          <p className="text-center text-xs text-[#404849] mt-6 opacity-70">
            A confirmation will be sent to your registered email. Expected delivery in 3–5 business days.
          </p>
        </div>
      </div>
    </>
  );
}