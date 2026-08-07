import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getCart, updateCartItem, removeCartItem, setGuestCart, updateGuestCartQty, removeFromGuestCart, addToGuestCart } from "../redux/slices/cartSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { PremiumEmptyState } from "../components/Skeletons";

// ─── Color tokens matching the ePustakalay design system ───────────────────
const colors = {
  primary: "#002629",
  primaryContainer: "#083d41",
  surface: "#f7f9ff",
  surfaceContainerLowest: "#ffffff",
  surfaceContainerLow: "#f1f4fa",
  surfaceContainer: "#ebeef4",
  surfaceContainerHigh: "#e5e8ee",
  surfaceContainerHighest: "#dfe3e8",
  onSurface: "#181c20",
  onSurfaceVariant: "#404849",
  tertiary: "#381905",
  outlineVariant: "#c0c8c9",
  error: "#ba1a1a",
  primaryFixedDim: "#a0cfd3",
  onPrimaryContainer: "#7aa8ac",
};

// ─── Tailwind config is injected via CDN in index.html. In a real project,
//     add these tokens to tailwind.config.js. Here we use inline styles for
//     brand-specific tokens and Tailwind utilities for layout/spacing. ───────

const INITIAL_CART = [
  {
    id: 1,
    title: "The Midnight Library",
    author: "Matt Haig",
    price: 599,
    qty: 1,
    stock: "In Stock",
    cover:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAlGOJUX_XJs4XbX0etOk7HgahbemNSfOXCSKyt5JBrNjkBG9WIx9loPoSJWGR0_EVzAhUwo1ttDDJJx2Z9CkG7LUivtOPjVX0x_uY2-iSL2DTVpRwJZeKCOWMVqt7ZWEfwB8ZxUZbEZtcd9Ru7yhk23CHHo_CmTczVs8esJRH03BgRCS9tL3dhYIVwCo7e6eZ2kbxUsTYxwIQ2yliVOgrmtiYLDLM3UXfSLTUqYXd0RX0KmyYt8MrBL7ymR43AwDnS7cZWAmE3IA",
  },
  {
    id: 2,
    title: "Project Hail Mary",
    author: "Andy Weir",
    price: 749,
    qty: 1,
    stock: "Only 2 left",
    cover:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuClxlqoeEvEtuhzFMASyLqrHiBdnf6DMRRG-j11NkpQiCaMwUbGglLFHpVDf_3jJtceroxL7PBnUVah01iedq76P0DQ4dwvgNylrEBpaB7MicAUnsCumetpEj_1689v6V6AhJKL_wlYiz336k9ePGMeAwlM39idDsFuByobYb3ltUmW7jTdIstsOB3jUOTWo4FkJKp9OAr_0ks4IRQ3LMeWLdhDZL2gYPWvmyW9rqHbv5v7ZKxUfPnjM1URajoHh2Xrl71qe8ezsw",
  },
  {
    id: 3,
    title: "Circe",
    author: "Madeline Miller",
    price: 450,
    qty: 1,
    stock: "In Stock",
    cover:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC1ZGf8Phmr7U14E0L9fvgQDcPgwToPEDpEPov23xdDe_HMyux3gZwdevHXja64ES8iUtP35ZFkIivnfQACXMWJ1GGXdr40VUDPpU2MBu7MUWsEWKjFSmAtoYIl_hX8mnSh5_CQe9GaliXmU2RwQEFxACLKj90Vcz7h5XkWi4mNoOQlZpz_igyQt3qNDtJ20TZlG2nmNxpRFO2sRrRXVKNcp0mfgS7Kkv1vhVgvWwc7F0wALY4DGN6B1TxqvEovTYCmP_Qf4ImeMQ",
  },
];

const RECOMMENDATIONS = [
  {
    id: 101,
    title: "A Promised Land",
    author: "Barack Obama",
    price: 899,
    cover:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDYlmasy_PJL3fqipMn-sTkkQCh_L-MdPW2LDlr09y9O2fqRoO4U27PzUWJJWm7g3ZSlQHBsmQDng1qdp98hbxJn7Guc7Mqypz9GPloCZIFxoWVhGeWaBPzTOYrfoczKK1C1K7kvd2-fucAOTvlRe_Uc5qNrIoi3HdKKyrjpsjP3EPpkwVk5SyMJE6S5IZuIEpGrQ7GS4FXcmB5iZYmEJzDm3Zy-DyIIvR7WF1gciq-dmSwQ3oluDA-bFc5xFTNz8yS8_yno0oF3A",
  },
  {
    id: 102,
    title: "Where the Crawdads Sing",
    author: "Delia Owens",
    price: 499,
    cover:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAbjQZnBmK6rBc-P689aItIM303m-ZaAUFHN4hMghzF33xaOQVw_N6pq3pkH883rFd1naX0-_FluBfbw_Lb5Asgkx6ddWpc62DwJdaGOwcQwlwI1sfhLGCT2jskD3NHWSjXoBVR4tAxBBMEzUCx7LeC60US7kVFm83SuI5nSdc_WC28px1RBIH-TmWJXF7W4-ACKrQmpMN7CfyVceprWFJWmj8V4dM95_WIZVNzukDYHHbytjOU9wj3E6CKDu0yW_yTxatm9jT-FQ",
  },
  {
    id: 103,
    title: "Dune: Part One",
    author: "Frank Herbert",
    price: 620,
    cover:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB5Slm0Xy5bivCP3Q0mRqv2sLxk9f-hHv-et6A0QWfLrgiorNZKiqGurU3MzTAQP-nNIf_ELpd3lPM-uE2AfYlhXSqHP2r0v1ySGlHLuFwKgF8kzjcsmyje3lIKtMcL4i80EL9tOCRXp3S6AytfY4dP8dDqhJNI9b0UriRkKxBkrfwv_vEMkRzzScvSmiIYNesWzxzmgSPt3jRGuw1XiBXghB25hYJK7gRKkUGddz1dMhtFrEtSEMIsEdvC___V0sn8of8QwC5QEA",
  },
  {
    id: 104,
    title: "The Alchemist",
    author: "Paulo Coelho",
    price: 299,
    cover:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuASwPYFwmF5M8ylnmUUtNHmBsc5fP3MKiBUXumLlwBPKNjVFGT4ZCtF-VhipzAty9_bIKHwaIqAMVjyYZz-R ThAd6VLKSMVJ4SnS5eGp6_XgLJZ5jDsQZCHXQzUyVMTmMvRj-aDeU3helPgIQwzAehi6d8-nXtTyaod__y6cBNkQzJhgchJKuf0oLJxkrAgQ6zz28TU7pj6Sedy0DPfwyaMFVr5AgCMaiFYIHrd4HaQfFn_Mf85EfvzAg",
  },
];

// ─── Sub-components ──────────────────────────────────────────────────────────

function MaterialIcon({ name, filled = false, className = "" }) {
  return (
    <span
      className={`material-symbols-outlined select-none ${className}`}
      style={{
        fontVariationSettings: filled ? "'FILL' 1,'wght' 400,'GRAD' 0,'opsz' 24" : "'FILL' 0,'wght' 400,'GRAD' 0,'opsz' 24",
      }}
    >
      {name}
    </span>
  );
}

function CartItem({ item, onQtyChange, onRemove }) {
  const [removing, setRemoving] = useState(false);

  const handleRemove = () => {
    onRemove(item.cartItemId);
  };

  return (
    <div
      className="group flex items-start gap-3 sm:gap-6 p-3 sm:p-6 rounded-xl transition-all duration-300"
      style={{
        background: colors.surfaceContainerLowest,
        opacity: removing ? 0 : 1,
        transform: removing ? "translateX(-12px)" : "translateX(0)",
        boxShadow: "0 0 0 transparent",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = `0 8px 32px ${colors.primary}08`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "0 0 0 transparent";
      }}
    >
      {/* Cover - Smaller on mobile */}
      <div className="w-20 h-28 sm:w-28 sm:h-40 rounded-lg overflow-hidden shrink-0 shadow-md">
        <img
          src={item.book.cover_image}
          alt={`Cover of ${item.book.title}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* Details */}
      <div className="flex-grow min-w-0">
        <div className="flex justify-between items-start gap-2">
          <div className="min-w-0 flex-1">
            <h3
              className="text-sm sm:text-xl font-extrabold leading-tight line-clamp-2"
              style={{ fontFamily: "Manrope, sans-serif", color: colors.primary }}
            >
              {item.book.title}
            </h3>
            <p className="text-xs sm:text-sm mt-0.5 sm:mt-1 truncate" style={{ color: colors.onSurfaceVariant }}>
              {item.book.author}
            </p>
            <p className="font-bold mt-1 sm:mt-2 text-base sm:text-lg" style={{ color: colors.tertiary }}>
              ₹{item.book.price.toFixed(2)}
            </p>
          </div>
          <button
            onClick={handleRemove}
            className="p-1.5 sm:p-2 rounded-full transition-colors duration-200 shrink-0 active:scale-95"
            style={{ color: colors.onSurfaceVariant }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = colors.error;
              e.currentTarget.style.background = `${colors.error}0d`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = colors.onSurfaceVariant;
              e.currentTarget.style.background = "transparent";
            }}
            aria-label="Remove item"
          >
            <MaterialIcon name="delete" className="text-lg sm:text-xl" />
          </button>
        </div>

        <div className="mt-3 sm:mt-5 flex items-center justify-between">
          {/* Quantity stepper - More compact on mobile */}
          <div
            className="flex items-center rounded-lg p-0.5 sm:p-1"
            style={{ background: colors.surfaceContainerLow }}
          >
            <button
              onClick={() => {
                if (item.quantity > 1) {
                  onQtyChange(item.cartItemId, item.quantity - 1);
                } else {
                  onRemove(item.cartItemId);
                }
              }}
              disabled={item.quantity <= 1 && !onRemove}
              className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-md transition-colors duration-150 disabled:opacity-30 active:scale-95"
              style={{ color: colors.primary }}
              onMouseEnter={(e) => { if (item.quantity > 1) e.currentTarget.style.background = colors.surfaceContainerHighest; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
              aria-label="Decrease quantity"
            >
              <MaterialIcon name="remove" className="text-sm" />
            </button>
            <span
              className="px-2 sm:px-4 font-bold text-xs sm:text-sm"
              style={{ color: colors.primary, minWidth: "1.5rem", textAlign: "center" }}
            >
              {item.quantity}
            </span>
            <button
              onClick={() => {
                onQtyChange(item.cartItemId, item.quantity + 1)
              }}
              className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-md transition-colors duration-150 active:scale-95"
              style={{ color: colors.primary }}
              onMouseEnter={(e) => { e.currentTarget.style.background = colors.surfaceContainerHighest; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
              aria-label="Increase quantity"
            >
              <MaterialIcon name="add" className="text-sm" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function OrderSummary({ subtotal, cartCount, promoCode, setPromoCode, onApplyPromo, discount, onCheckout }) {
  const shipping = subtotal > 0 ? 40 : 0;
  const tax = +(subtotal * 0.05).toFixed(2);
  const total = subtotal + shipping + tax - discount;

  const navigate = useNavigate();

  return (
    <aside className="w-full lg:w-96">
      <div
        className="rounded-2xl p-4 sm:p-8 lg:sticky lg:top-28"
        style={{ background: colors.surfaceContainerLow, boxShadow: `0 2px 12px ${colors.primary}06` }}
      >
        <h2
          className="text-xl sm:text-2xl font-extrabold mb-4 sm:mb-6"
          style={{ fontFamily: "Manrope, sans-serif", color: colors.primary }}
        >
          Order Summary
        </h2>

        <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
          <SummaryRow label="Subtotal" value={`₹${subtotal.toFixed(2)}`} />
          <SummaryRow label="Shipping" value={subtotal > 0 ? `₹${shipping.toFixed(2)}` : "—"} />
          <SummaryRow label="Tax (GST 5%)" value={subtotal > 0 ? `₹${tax.toFixed(2)}` : "—"} />
          {discount > 0 && (
            <SummaryRow label="Promo Discount" value={`− ₹${discount.toFixed(2)}`} accent />
          )}
          <div
            className="pt-3 sm:pt-4 flex justify-between items-center"
            style={{ borderTop: `1px solid ${colors.outlineVariant}33` }}
          >
            <span
              className="text-base sm:text-lg font-bold"
              style={{ fontFamily: "Manrope, sans-serif", color: colors.primary }}
            >
              Order Total
            </span>
            <span
              className="text-xl sm:text-2xl font-black"
              style={{ fontFamily: "Manrope, sans-serif", color: colors.primary }}
            >
              ₹{Math.max(0, total).toFixed(2)}
            </span>
          </div>
        </div>

        {/* Promo code */}
        <div className="mb-6 sm:mb-8">
          <label
            className="block text-xs font-bold uppercase tracking-wider mb-2"
            style={{ color: colors.onSurfaceVariant }}
          >
            Promo Code
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
              placeholder="Enter code"
              className="flex-grow rounded-lg px-3 sm:px-4 py-2 text-xs sm:text-sm outline-none focus:ring-2 placeholder:opacity-50"
              style={{
                background: colors.surfaceContainerLowest,
                border: `1px solid ${colors.outlineVariant}33`,
                color: colors.onSurface,
                fontFamily: "Inter, sans-serif",
              }}
              onFocus={(e) => { e.target.style.borderColor = colors.primary; e.target.style.boxShadow = `0 0 0 3px ${colors.primaryFixedDim}30`; }}
              onBlur={(e) => { e.target.style.borderColor = `${colors.outlineVariant}33`; e.target.style.boxShadow = "none"; }}
            />
            <button
              onClick={onApplyPromo}
              className="px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-colors duration-200 active:scale-95"
              style={{ background: colors.primaryContainer, color: colors.onPrimaryContainer }}
              onMouseEnter={(e) => { e.currentTarget.style.background = colors.primary; e.currentTarget.style.color = "#fff"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = colors.primaryContainer; e.currentTarget.style.color = colors.onPrimaryContainer; }}
            >
              Apply
            </button>
          </div>
          {discount > 0 && (
            <p className="mt-2 text-xs font-semibold" style={{ color: "#2e7d32" }}>
              ✓ Promo applied — ₹{discount} off!
            </p>
          )}
        </div>

        {/* CTA */}
        <button
          onClick={() => navigate("/checkout")}
          disabled={cartCount === 0}
          className="w-full py-3 sm:py-4 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed group text-sm sm:text-base"
          style={{
            background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryContainer})`,
            fontFamily: "Manrope, sans-serif",
            boxShadow: `0 8px 24px ${colors.primary}22`,
          }}
        >
          Proceed to Checkout
          <MaterialIcon name="arrow_forward" className="text-sm group-hover:translate-x-1 transition-transform duration-200" />
        </button>

        {/* Payment logos */}
        <div className="mt-4 sm:mt-6 flex items-center justify-center gap-3 sm:gap-6">
          {["VISA", "MC", "GPay"].map((p) => (
            <div
              key={p}
              className="px-2 sm:px-3 py-1 rounded text-[10px] sm:text-xs font-black tracking-wider opacity-50"
              style={{ background: colors.surfaceContainerHigh, color: colors.primary }}
            >
              {p}
            </div>
          ))}
        </div>
      </div>

      {/* Trust badge */}
      <div
        className="mt-4 sm:mt-6 p-4 sm:p-5 rounded-xl flex items-start gap-3 sm:gap-4"
        style={{ background: `${colors.surfaceContainerHighest}50` }}
      >
        <MaterialIcon name="verified_user" filled className="shrink-0 text-lg sm:text-xl" style={{ color: colors.primaryFixedDim }} />
        <div>
          <h4 className="text-xs sm:text-sm font-bold" style={{ color: colors.primary }}>
            Secured Experience
          </h4>
          <p className="text-[10px] sm:text-xs mt-1 leading-relaxed" style={{ color: colors.onSurfaceVariant }}>
            All transactions encrypted with 256-bit SSL. Quality guaranteed.
          </p>
        </div>
      </div>
    </aside>
  );
}

function SummaryRow({ label, value, accent }) {
  return (
    <div className="flex justify-between items-center gap-2">
      <span className="font-medium text-xs sm:text-sm" style={{ color: colors.onSurfaceVariant }}>
        {label}
      </span>
      <span
        className="font-semibold text-xs sm:text-sm"
        style={{ color: accent ? "#2e7d32" : colors.onSurface }}
      >
        {value}
      </span>
    </div>
  );
}

function RecommendationCard({ book, onAdd }) {
  const [added, setAdded] = useState(false);
  const handleAdd = () => {
    onAdd(book);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div
      className="p-3 sm:p-4 rounded-xl transition-all duration-300 active:scale-95"
      style={{ background: colors.surfaceContainerLowest, boxShadow: `0 1px 4px ${colors.primary}08` }}
      onMouseEnter={(e) => { e.currentTarget.style.boxShadow = `0 6px 24px ${colors.primary}10`; }}
      onMouseLeave={(e) => { e.currentTarget.style.boxShadow = `0 1px 4px ${colors.primary}08`; }}
    >
      <div className="w-full aspect-[2/3] rounded-lg overflow-hidden mb-3 sm:mb-4">
        <img src={book.cover} alt={book.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
      </div>
      <h4 className="font-bold truncate text-xs sm:text-sm" style={{ color: colors.primary }}>
        {book.title}
      </h4>
      <p className="text-[10px] sm:text-xs mt-0.5 truncate" style={{ color: colors.onSurfaceVariant }}>
        {book.author}
      </p>
      <div className="mt-2 sm:mt-3 flex justify-between items-center">
        <span className="font-bold text-xs sm:text-sm" style={{ color: colors.tertiary }}>
          ₹{book.price}
        </span>
        <button
          onClick={handleAdd}
          className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-colors duration-200 active:scale-90"
          style={{
            background: added ? colors.primary : colors.surfaceContainerLow,
            color: added ? "#fff" : colors.primary,
          }}
          aria-label={`Add ${book.title} to cart`}
        >
          <MaterialIcon name={added ? "check" : "add_shopping_cart"} className="text-xs sm:text-sm" />
        </button>
      </div>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function CartPage() {
  const [cart, setCart] = useState(INITIAL_CART);
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [toast, setToast] = useState(null);
  const dispatch = useDispatch();


  const Items = useSelector(
    (state) => state.cart.cartData || []
  );


  const subtotal = useSelector(
    (state) => state.cart.totalAmount || 0
  );

  const { isLoggedIn } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isLoggedIn) {
      dispatch(getCart());
    } else {
      const guestCart = localStorage.getItem("guest_cart");
      if (guestCart) {
        try {
          dispatch(setGuestCart(JSON.parse(guestCart)));
        } catch (e) {
        }
      }
    }
  }, [dispatch, isLoggedIn]);


  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2400);
  };

  const handleQtyChange = async (cartItemId, quantity) => {
    if (isLoggedIn) {
      await dispatch(updateCartItem({ cartItemId, quantity }));
      dispatch(getCart());
    } else {
      dispatch(updateGuestCartQty({ cartItemId, quantity }));
    }
  };


  const handleRemove = async (cartItemId) => {
    if (isLoggedIn) {
      await dispatch(removeCartItem(cartItemId));
      dispatch(getCart());
    } else {
      dispatch(removeFromGuestCart(cartItemId));
    }
  };

  const handleApplyPromo = () => {
    if (promoCode === "READER100") {
      setDiscount(100);
      showToast("Promo code applied! ₹100 off.");
    } else if (promoCode === "BOOKS50") {
      setDiscount(50);
      showToast("Promo code applied! ₹50 off.");
    } else {
      setDiscount(0);
      showToast("Invalid promo code. Try READER100.");
    }
  };

  const handleAddRecommendation = async (book) => {
    const bookObj = {
      _id: book._id || book.id || `rec_${Date.now()}`,
      title: book.title,
      author: book.author,
      price: book.price,
      cover_image: book.cover
    };

    if (isLoggedIn) {
      await dispatch(addToCart(bookObj._id));
      dispatch(getCart());
    } else {
      dispatch(addToGuestCart(bookObj));
    }
    showToast(`"${book.title}" added to your bag!`);
  };

  return (
    <div style={{ background: colors.surface, minHeight: "100vh", color: colors.onSurface, fontFamily: "Inter, sans-serif" }}>
      {/* Google Fonts */}
      <link
        href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Inter:wght@400;500;600&display=swap"
        rel="stylesheet"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        rel="stylesheet"
      />


      {/* ── Main Content ── */}
      <main className="pt-20 sm:pt-28 pb-12 sm:pb-16 px-3 sm:px-6 md:px-12 max-w-7xl mx-auto">
        {Items.length === 0 ? (
          <div className="py-4">
            <PremiumEmptyState
              title="Your cart is empty."
              subtitle="Start exploring books and add them to your cart."
              icon="shopping_cart"
              actionText="Start exploring books"
              actionLink="/books"
            />
          </div>
        ) : (
          <>
            {/* Breadcrumb & Header */}
            <div className="mb-6 sm:mb-10">
              <div className="flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm font-medium mb-1 sm:mb-2" style={{ color: colors.onSurfaceVariant }}>
                <span>Home</span>
                <MaterialIcon name="chevron_right" className="text-xs" />
                <span className="font-bold" style={{ color: colors.primary }}>Cart</span>
              </div>
              <h1
                className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight"
                style={{ fontFamily: "Manrope, sans-serif", color: colors.primary, letterSpacing: "-0.02em" }}
              >
                Your Library Bag
              </h1>
              <p className="mt-1 sm:mt-2 font-medium text-sm sm:text-base" style={{ color: colors.onSurfaceVariant }}>
                {`${Items.length} premium title${Items.length > 1 ? "s" : ""} in cart.`}
              </p>
            </div>

            <div className="flex flex-col lg:flex-row gap-6 sm:gap-12">
              {/* Cart Items */}
              <div className="flex-grow space-y-3 sm:space-y-5 min-w-0">
                {Items.map((item) => (
                  <CartItem
                    key={item.cartItemId}
                    item={item}
                    onQtyChange={handleQtyChange}
                    onRemove={handleRemove}
                  />
                ))}
              </div>

              {/* Order Summary */}
              <OrderSummary
                subtotal={subtotal}
                cartCount={Items.length}
                promoCode={promoCode}
                setPromoCode={setPromoCode}
                onApplyPromo={handleApplyPromo}
                discount={discount}
                onCheckout={() => showToast("Redirecting to checkout…")}
              />
            </div>
          </>
        )}

        {/* Recommendations */}
        <section className="mt-16 sm:mt-24">
          <div className="flex justify-between items-end mb-6 sm:mb-8 flex-wrap gap-3 sm:gap-4">
            <div>
              <h2
                className="text-xl sm:text-3xl font-extrabold"
                style={{ fontFamily: "Manrope, sans-serif", color: colors.primary }}
              >
                Frequently Bought Together
              </h2>
              <p className="font-medium mt-0.5 sm:mt-1 text-xs sm:text-base" style={{ color: colors.onSurfaceVariant }}>
                Curated based on your interests.
              </p>
            </div>
            <button
              className="font-bold flex items-center gap-1 hover:underline text-xs sm:text-sm"
              style={{ color: colors.primary }}
            >
              <span className="hidden sm:inline">View All Recommendations</span>
              <span className="sm:hidden">View All</span>
              <MaterialIcon name="east" className="text-sm" />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5">
            {RECOMMENDATIONS.map((book) => (
              <RecommendationCard key={book.id} book={book} onAdd={handleAddRecommendation} />
            ))}
          </div>
        </section>
      </main>


      {/* ── Toast Notification ── */}
      {toast && (
        <div
          className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 px-4 sm:px-6 py-2 sm:py-3 rounded-xl text-xs sm:text-sm font-semibold shadow-xl z-50 transition-all duration-300 max-w-[90%] sm:max-w-none text-center"
          style={{
            background: colors.primary,
            color: "#fff",
            fontFamily: "Inter, sans-serif",
            boxShadow: `0 8px 32px ${colors.primary}40`,
          }}
        >
          {toast}
        </div>
      )}
    </div>
  );
}