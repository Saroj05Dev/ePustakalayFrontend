import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { cancelOrder, getAllUserOrders, markOrderAsRated } from "../redux/slices/orderSlice";
import { createRating } from "../redux/slices/ratingSlice";
import { toast } from "react-hot-toast";

// ─── Design tokens ───────────────────────────────────────────────────────────
const C = {
  primary:                "#002629",
  primaryContainer:       "#083d41",
  surface:                "#f7f9ff",
  surfaceContainerLowest: "#ffffff",
  surfaceContainerLow:    "#f1f4fa",
  surfaceContainer:       "#ebeef4",
  surfaceContainerHigh:   "#e5e8ee",
  surfaceContainerHighest:"#dfe3e8",
  onSurface:              "#181c20",
  onSurfaceVariant:       "#404849",
  outlineVariant:         "#c0c8c9",
  error:                  "#ba1a1a",
  errorContainer:         "#ffdad6",
  tertiary:               "#381905",
};

// ─── Status config ────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  DELIVERED:  { label: "Delivered",  bg: "#dcfce7", fg: "#166534", icon: "check_circle" },
  PROCESSING: { label: "Processing", bg: "#e0f2fe", fg: "#075985", icon: "autorenew" },
  SHIPPED:    { label: "Shipped",    bg: "#fef9c3", fg: "#92400e", icon: "local_shipping" },
  CANCELLED:  { label: "Cancelled",  bg: "#ffdad6", fg: "#ba1a1a", icon: "cancel" },
  PENDING:    { label: "Pending",    bg: "#f3e8ff", fg: "#6b21a8", icon: "hourglass_empty" },
};

const getStatusConfig = (status = "") =>
  STATUS_CONFIG[status?.toUpperCase()] || {
    label: status, bg: C.surfaceContainerHigh, fg: C.onSurfaceVariant, icon: "info",
  };

const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  });
};

const formatPrice = (amount) =>
  `₹${Number(amount || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;

// ─── StatusBadge ──────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const cfg = getStatusConfig(status);
  return (
    <span
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
      style={{ background: cfg.bg, color: cfg.fg }}
    >
      <span
        className="material-symbols-outlined"
        style={{ fontSize: 13, fontVariationSettings: "'FILL' 1,'wght' 500,'GRAD' 0,'opsz' 20" }}
      >
        {cfg.icon}
      </span>
      {cfg.label}
    </span>
  );
}

// ─── BookThumbnails ───────────────────────────────────────────────────────────
function BookThumbnails({ items }) {
  if (!items?.length) return null;
  const visible = items.slice(0, 3);
  const extra = items.length - 3;
  return (
    <div className="flex -space-x-2.5">
      {visible.map((item, i) => {
        const cover = item.book?.cover_image || item.cover_image || item.cover || "";
        return (
          <div
            key={i}
            className="w-9 h-12 rounded-md overflow-hidden ring-2 ring-white flex-shrink-0 shadow-sm"
            style={{ background: C.surfaceContainerHigh }}
          >
            {cover ? (
              <img src={cover} alt={item.book?.title || "Book"} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="material-symbols-outlined" style={{ color: C.outlineVariant, fontSize: 16 }}>menu_book</span>
              </div>
            )}
          </div>
        );
      })}
      {extra > 0 && (
        <div
          className="w-9 h-12 rounded-md ring-2 ring-white flex items-center justify-center flex-shrink-0 text-xs font-black"
          style={{ background: C.primaryContainer, color: "#fff" }}
        >
          +{extra}
        </div>
      )}
    </div>
  );
}

// ─── OrderCard ────────────────────────────────────────────────────────────────
function OrderCard({ order, onCancel, onRateClick }) {
  const [expanded, setExpanded] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const navigate = useNavigate();

  const orderId   = order.orderId   || order._id || "—";
  const status    = order.status    || "PENDING";
  const createdAt = order.createdAt || order.date;
  const items     = order.items     || order.orderItems || [];
  const totalAmt  = order.totalAmount ?? order.total ?? order.amount ?? 0;
  const shipping  = order.shippingAddress || {};

  const firstTitle = items[0]?.book?.title || items[0]?.title || "Order";
  const extraCount = items.length - 1;
  const displayTitle = extraCount > 0
    ? `${firstTitle} + ${extraCount} more item${extraCount > 1 ? "s" : ""}`
    : firstTitle;

  const canCancel = !["DELIVERED", "CANCELLED"].includes(status?.toUpperCase());

  const handleCancel = async (e) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    setCancelling(true);
    await onCancel(orderId);
    setCancelling(false);
  };

  return (
    <div
      className="rounded-xl overflow-hidden transition-all duration-300"
      style={{ background: C.surfaceContainerLowest, boxShadow: "0 1px 4px rgba(24,28,32,0.04)" }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = "0 24px 40px -15px rgba(24,28,32,0.08)"}
      onMouseLeave={e => e.currentTarget.style.boxShadow = "0 1px 4px rgba(24,28,32,0.04)"}
    >
      {/* Main row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6">

        {/* Left: ID, badge, date */}
        <div className="flex-grow min-w-0">
          <div className="flex flex-wrap items-center gap-3 mb-2">
            <span
              className="font-extrabold text-xl tracking-tight"
              style={{ fontFamily: "Manrope, sans-serif", color: C.primary }}
            >
              #{orderId}
            </span>
            <StatusBadge status={status} />
          </div>
          <p className="text-sm font-medium flex items-center gap-1.5" style={{ color: C.onSurfaceVariant }}>
            <span className="material-symbols-outlined" style={{ fontSize: 15 }}>calendar_today</span>
            {formatDate(createdAt)}
          </p>
        </div>

        {/* Centre: thumbnails + summary */}
        <div className="flex items-center gap-4 flex-shrink-0">
          <BookThumbnails items={items} />
          <div className="text-sm">
            <p className="font-bold" style={{ color: C.primary }}>{displayTitle}</p>
            <p style={{ color: C.onSurfaceVariant }}>{formatPrice(totalAmt)}</p>
          </div>
        </div>

        {/* Right: action buttons */}
        <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
          {status?.toUpperCase() === "DELIVERED" && !order.isRated && (
            <button
              onClick={() => navigate(`/invoice/${orderId}`)}
              className="px-4 py-2.5 text-sm font-semibold rounded-lg transition-colors"
              style={{ color: C.primary }}
              onMouseEnter={e => e.currentTarget.style.background = C.surfaceContainerLow}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
            >
              Invoice
            </button>
          )}
          {status?.toUpperCase() === "DELIVERED" && !order.isRated && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRateClick(order);
              }}
              className="px-4 py-2.5 text-sm font-semibold rounded-lg transition-all border flex items-center gap-1.5"
              style={{ 
                borderColor: C.primary, 
                color: C.primary,
                background: "transparent"
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = C.primary;
                e.currentTarget.style.color = "#fff";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = C.primary;
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>star</span>
              Rate Order
            </button>
          )}
          {["PROCESSING", "SHIPPED"].includes(status?.toUpperCase()) && (
            <button
              onClick={() => navigate(`/track/${orderId}`)}
              className="px-4 py-2.5 text-sm font-semibold rounded-lg transition-colors"
              style={{ color: C.primary }}
              onMouseEnter={e => e.currentTarget.style.background = C.surfaceContainerLow}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
            >
              Track Order
            </button>
          )}
          {canCancel && (
            <button
              onClick={handleCancel}
              disabled={cancelling}
              className="px-4 py-2.5 text-sm font-semibold rounded-lg transition-colors disabled:opacity-50"
              style={{ color: C.error }}
              onMouseEnter={e => { if (!cancelling) e.currentTarget.style.background = C.errorContainer; }}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
            >
              {cancelling ? "Cancelling…" : "Cancel"}
            </button>
          )}
          <button
            onClick={() => setExpanded(v => !v)}
            className="px-5 py-2.5 text-sm font-semibold text-white rounded-lg shadow-sm active:scale-95 transition-all flex items-center gap-1.5"
            style={{ background: `linear-gradient(135deg, ${C.primary}, ${C.primaryContainer})` }}
          >
            {expanded ? "Hide Details" : "View Details"}
            <span
              className="material-symbols-outlined transition-transform duration-300"
              style={{ fontSize: 16, transform: expanded ? "rotate(180deg)" : "rotate(0deg)" }}
            >
              expand_more
            </span>
          </button>
        </div>
      </div>

      {/* Expandable detail panel */}
      <div
        style={{
          maxHeight: expanded ? "600px" : "0px",
          opacity: expanded ? 1 : 0,
          overflow: "hidden",
          transition: "max-height 0.45s ease, opacity 0.3s ease",
        }}
      >
        <div
          className="px-6 pb-6 pt-4 grid grid-cols-1 md:grid-cols-2 gap-5"
          style={{ borderTop: `1px solid ${C.outlineVariant}20` }}
        >
          {/* Shipping address */}
          <div className="rounded-xl p-5" style={{ background: C.surfaceContainerLow }}>
            <h4
              className="text-xs font-black uppercase tracking-widest mb-3 flex items-center gap-1.5"
              style={{ color: C.onSurfaceVariant }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 14 }}>location_on</span>
              Shipping Address
            </h4>
            {shipping.fullName ? (
              <div className="text-sm space-y-0.5" style={{ color: C.onSurface }}>
                <p className="font-bold">{shipping.fullName}</p>
                <p style={{ color: C.onSurfaceVariant }}>{shipping.address}</p>
                <p style={{ color: C.onSurfaceVariant }}>
                  {shipping.city}, {shipping.state} – {shipping.pincode}
                </p>
                <p style={{ color: C.onSurfaceVariant }}>{shipping.phone}</p>
              </div>
            ) : (
              <p className="text-sm" style={{ color: C.onSurfaceVariant }}>No address on record.</p>
            )}
          </div>

          {/* Items list */}
          <div className="rounded-xl p-5" style={{ background: C.surfaceContainerLow }}>
            <h4
              className="text-xs font-black uppercase tracking-widest mb-3 flex items-center gap-1.5"
              style={{ color: C.onSurfaceVariant }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 14 }}>inventory_2</span>
              Items ({items.length})
            </h4>
            <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
              {items.map((item, i) => {
                const book   = item.book || {};
                const cover  = book.cover_image || book.cover || "";
                const title  = book.title  || item.title  || "Book";
                const author = book.author || item.author || "";
                const price  = book.price  || item.price  || 0;
                const qty    = item.quantity || item.qty  || 1;
                return (
                  <div key={i} className="flex items-center gap-3">
                    <div
                      className="w-9 h-12 rounded-md flex-shrink-0 overflow-hidden flex items-center justify-center"
                      style={{ background: C.surfaceContainerHigh }}
                    >
                      {cover
                        ? <img src={cover} alt={title} className="w-full h-full object-cover" />
                        : <span className="material-symbols-outlined" style={{ fontSize: 14, color: C.outlineVariant }}>menu_book</span>
                      }
                    </div>
                    <div className="flex-grow min-w-0">
                      <p className="text-sm font-bold truncate" style={{ color: C.primary }}>{title}</p>
                      {author && <p className="text-xs" style={{ color: C.onSurfaceVariant }}>{author}</p>}
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-bold" style={{ color: C.onSurface }}>{formatPrice(price * qty)}</p>
                      <p className="text-xs" style={{ color: C.onSurfaceVariant }}>×{qty}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            <div
              className="mt-4 pt-3 flex justify-between items-center"
              style={{ borderTop: `1px solid ${C.outlineVariant}30` }}
            >
              <span className="text-sm font-bold" style={{ color: C.onSurface }}>Order Total</span>
              <span
                className="font-extrabold"
                style={{ fontFamily: "Manrope, sans-serif", color: C.primary }}
              >
                {formatPrice(totalAmt)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div
      className="rounded-xl p-6"
      style={{ background: C.surfaceContainerLowest, animation: "pulse 1.8s ease-in-out infinite" }}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex-grow space-y-2.5">
          <div className="flex gap-3">
            <div className="h-6 w-32 rounded-lg" style={{ background: C.surfaceContainerHigh }} />
            <div className="h-6 w-20 rounded-full" style={{ background: C.surfaceContainerHigh }} />
          </div>
          <div className="h-4 w-28 rounded-lg" style={{ background: C.surfaceContainerHigh }} />
        </div>
        <div className="flex items-center gap-4">
          <div className="flex -space-x-2.5">
            {[0, 1].map(i => (
              <div key={i} className="w-9 h-12 rounded-md" style={{ background: C.surfaceContainerHigh }} />
            ))}
          </div>
          <div className="space-y-2">
            <div className="h-4 w-36 rounded-lg" style={{ background: C.surfaceContainerHigh }} />
            <div className="h-4 w-20 rounded-lg" style={{ background: C.surfaceContainerHigh }} />
          </div>
        </div>
        <div className="flex gap-2">
          <div className="h-10 w-24 rounded-lg" style={{ background: C.surfaceContainerHigh }} />
          <div className="h-10 w-28 rounded-lg" style={{ background: C.surfaceContainerHigh }} />
        </div>
      </div>
    </div>
  );
}

// ─── FilterTab ────────────────────────────────────────────────────────────────
function FilterTab({ label, active, count, onClick }) {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 flex items-center gap-2 whitespace-nowrap"
      style={{
        background: active ? C.primary : "transparent",
        color: active ? "#fff" : C.onSurfaceVariant,
      }}
    >
      {label}
      {count != null && (
        <span
          className="text-xs font-black px-1.5 py-0.5 rounded-full"
          style={{
            background: active ? "rgba(255,255,255,0.2)" : C.surfaceContainerHigh,
            color: active ? "#fff" : C.onSurfaceVariant,
            minWidth: 20, textAlign: "center",
          }}
        >
          {count}
        </span>
      )}
    </button>
  );
}

// ─── EmptyState ───────────────────────────────────────────────────────────────
function EmptyState({ filtered }) {
  return (
    <div
      className="flex flex-col items-center justify-center py-24 rounded-xl text-center"
      style={{ background: C.surfaceContainerLow }}
    >
      <span
        className="material-symbols-outlined mb-4"
        style={{ fontSize: 56, color: C.outlineVariant, fontVariationSettings: "'FILL' 0,'wght' 200,'GRAD' 0,'opsz' 48" }}
      >
        {filtered ? "filter_list_off" : "receipt_long"}
      </span>
      <p className="font-extrabold text-xl mb-2" style={{ fontFamily: "Manrope, sans-serif", color: C.primary }}>
        {filtered ? "No orders match this filter" : "No orders yet"}
      </p>
      <p className="text-sm" style={{ color: C.onSurfaceVariant }}>
        {filtered
          ? "Try switching to a different status filter."
          : "Your ordered books will appear here after checkout."}
      </p>
      {!filtered && (
        <Link
          to="/"
          className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white hover:opacity-90 transition-opacity"
          style={{ background: `linear-gradient(135deg, ${C.primary}, ${C.primaryContainer})` }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>explore</span>
          Browse Books
        </Link>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function OrdersPage() {
  const dispatch = useDispatch();
  const [activeFilter, setActiveFilter] = useState("All");
  const [ratingOrder, setRatingOrder] = useState(null);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [orderRatings, setOrderRatings] = useState({});

  const ordersData = useSelector((state) => state.order.ordersData || []);
  const loading    = useSelector((state) => state.order.loading);
  const error      = useSelector((state) => state.order.error);

  useEffect(() => {
    dispatch(getAllUserOrders());
  }, [dispatch]);

  const handleCancel = async (orderId) => {
    await dispatch(cancelOrder(orderId));
    dispatch(getAllUserOrders()); // Refresh list after cancel
  };

  const handleOpenRatingModal = (order) => {
    setRatingOrder(order);
    const initialRatings = {};
    const items = order.items || order.orderItems || [];
    items.forEach(item => {
      const bookId = item.book?._id || item.bookId?._id || item.bookId || "";
      initialRatings[bookId] = { rating: 0, review: "" };
    });
    setOrderRatings(initialRatings);
    setShowRatingModal(true);
  };

  const handleStarClick = (bookId, star) => {
    setOrderRatings(prev => ({
      ...prev,
      [bookId]: {
        ...prev[bookId],
        rating: star
      }
    }));
  };

  const handleReviewChange = (bookId, text) => {
    setOrderRatings(prev => ({
      ...prev,
      [bookId]: {
        ...prev[bookId],
        review: text
      }
    }));
  };

  const handleRatingSubmit = async () => {
    const items = ratingOrder.items || ratingOrder.orderItems || [];
    let ratedAny = false;

    for (const item of items) {
      const bookId = item.book?._id || item.bookId?._id || item.bookId || "";
      const ratingInfo = orderRatings[bookId];
      if (ratingInfo && ratingInfo.rating > 0) {
        ratedAny = true;
        await dispatch(createRating({
          bookId,
          rating: ratingInfo.rating,
          review: ratingInfo.review,
          orderId: ratingOrder._id || ratingOrder.orderId
        }));
      }
    }

    if (!ratedAny) {
      toast.error("Please rate at least one book in this order!");
      return;
    }

    await dispatch(markOrderAsRated(ratingOrder._id || ratingOrder.orderId));
    setShowRatingModal(false);
    dispatch(getAllUserOrders());
  };

  const countByStatus = (key) =>
    ordersData.filter(o => (o.status || "").toUpperCase() === key.toUpperCase()).length;

  const filteredOrders = activeFilter === "All"
    ? ordersData
    : ordersData.filter(o => (o.status || "").toUpperCase() === activeFilter.toUpperCase());

  const TABS = ["All", "Processing", "Shipped", "Delivered", "Cancelled"];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.5} }
      `}</style>

      <div style={{ background: C.surface, minHeight: "100vh", color: C.onSurface, fontFamily: "Inter, sans-serif" }}>
        <main className="pt-10 pb-24 px-6 md:px-10 max-w-screen-xl mx-auto">

          {/* Page header */}
          <header className="mb-10">
            <nav className="flex items-center gap-1.5 text-xs font-semibold mb-4" style={{ color: C.onSurfaceVariant }}>
              <Link to="/" style={{ color: C.onSurfaceVariant }} className="hover:underline">Home</Link>
              <span className="material-symbols-outlined" style={{ fontSize: 12 }}>chevron_right</span>
              <span style={{ color: C.primary }}>My Orders</span>
            </nav>
            <h1
              className="text-4xl md:text-5xl font-extrabold tracking-tight mb-2"
              style={{ fontFamily: "Manrope, sans-serif", color: C.primary, letterSpacing: "-0.02em" }}
            >
              My Orders
            </h1>
            <p className="text-lg" style={{ color: C.onSurfaceVariant }}>
              Track, manage and download your curated digital collections.
            </p>
          </header>

          {/* Error banner */}
          {error && !loading && (
            <div
              className="mb-8 px-5 py-4 rounded-xl flex items-center gap-3 text-sm font-medium"
              style={{ background: "#ffdad6", color: C.error }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>error</span>
              {error}
              <button onClick={() => dispatch(getAllUserOrders())} className="ml-auto font-bold underline">
                Retry
              </button>
            </div>
          )}

          {/* Filter tabs — only shown once data is loaded */}
          {!loading && ordersData.length > 0 && (
            <div className="flex items-center gap-1 mb-6 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
              {TABS.map(tab => {
                const cnt = tab === "All" ? ordersData.length : countByStatus(tab);
                if (tab !== "All" && cnt === 0) return null;
                return (
                  <FilterTab
                    key={tab}
                    label={tab}
                    count={cnt}
                    active={activeFilter === tab}
                    onClick={() => setActiveFilter(tab)}
                  />
                );
              })}
            </div>
          )}

          {/* Order list */}
          <div className="space-y-5">
            {loading ? (
              [0, 1, 2].map(i => <SkeletonCard key={i} />)
            ) : filteredOrders.length === 0 ? (
              <EmptyState filtered={activeFilter !== "All"} />
            ) : (
              filteredOrders.map((order, i) => (
                <OrderCard
                  key={order._id || order.orderId || i}
                  order={order}
                  onCancel={handleCancel}
                  onRateClick={handleOpenRatingModal}
                />
              ))
            )}
          </div>

          {/* Stats strip */}
          {!loading && ordersData.length > 0 && (
            <div
              className="mt-10 rounded-xl p-5 flex flex-wrap items-center gap-8"
              style={{ background: C.surfaceContainerLow }}
            >
              {[
                { label: "Total Orders", value: ordersData.length, icon: "receipt_long" },
                {
                  label: "Total Spent",
                  value: formatPrice(ordersData.reduce((s, o) => s + (o.totalAmount || o.total || 0), 0)),
                  icon: "payments",
                },
                { label: "Delivered",  value: countByStatus("DELIVERED"),  icon: "check_circle" },
                {
                  label: "In Progress",
                  value: countByStatus("PROCESSING") + countByStatus("SHIPPED"),
                  icon: "local_shipping",
                },
              ].map(({ label, value, icon }) => (
                <div key={label} className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: C.surfaceContainerHigh }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 18, color: C.primary }}>{icon}</span>
                  </div>
                  <div>
                    <p className="text-xs font-semibold" style={{ color: C.onSurfaceVariant }}>{label}</p>
                    <p className="font-extrabold text-lg leading-tight" style={{ fontFamily: "Manrope, sans-serif", color: C.primary }}>{value}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Help section */}
          <div
            className="mt-8 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6"
            style={{ background: C.surfaceContainerLow }}
          >
            <div>
              <h3
                className="font-extrabold text-xl mb-1"
                style={{ fontFamily: "Manrope, sans-serif", color: C.primary }}
              >
                Need help with an order?
              </h3>
              <p style={{ color: C.onSurfaceVariant }}>
                Our curation team is available 24/7 to assist with your digital library.
              </p>
            </div>
            <a
              href="mailto:support@epustakalay.com"
              className="flex items-center gap-2 font-bold whitespace-nowrap group"
              style={{ color: C.primary }}
            >
              Contact Support
              <span
                className="material-symbols-outlined group-hover:translate-x-1 transition-transform duration-200"
                style={{ fontSize: 18 }}
              >
                arrow_forward
              </span>
            </a>
          </div>

        </main>
      </div>

      {showRatingModal && ratingOrder && (
        <div 
          className="fixed inset-0 flex items-center justify-center p-4 z-50 animate-fade-in"
          style={{ backgroundColor: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
        >
          <div 
            className="w-full max-w-lg rounded-2xl p-6 md:p-8 flex flex-col max-h-[90vh] overflow-y-auto"
            style={{ background: C.surfaceContainerLowest, boxShadow: "0 24px 48px rgba(0,38,41,0.15)" }}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-extrabold text-2xl tracking-tight" style={{ fontFamily: "Manrope, sans-serif", color: C.primary }}>
                  Rate Your Order
                </h3>
                <p className="text-sm" style={{ color: C.onSurfaceVariant }}>
                  Order #{ratingOrder._id || ratingOrder.orderId}
                </p>
              </div>
              <button 
                onClick={() => setShowRatingModal(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                style={{ background: C.surfaceContainer, color: C.onSurfaceVariant }}
                onMouseEnter={e => e.currentTarget.style.background = C.surfaceContainerHigh}
                onMouseLeave={e => e.currentTarget.style.background = C.surfaceContainer}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 20 }}>close</span>
              </button>
            </div>

            <div className="space-y-6 flex-grow overflow-y-auto mb-6 pr-1">
              {(ratingOrder.items || ratingOrder.orderItems || []).map((item, i) => {
                const book = item.book || {};
                const bookId = book._id || item.bookId?._id || item.bookId || "";
                const cover = book.cover_image || book.cover || "";
                const title = book.title || item.title || "Book";
                const author = book.author || item.author || "";

                return (
                  <div key={i} className="pb-6 border-b last:border-b-0 last:pb-0" style={{ borderColor: `${C.outlineVariant}20` }}>
                    <div className="flex gap-4 items-start mb-4">
                      <div className="w-12 h-16 rounded-md overflow-hidden flex-shrink-0" style={{ background: C.surfaceContainerHigh }}>
                        {cover ? (
                          <img src={cover} alt={title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="material-symbols-outlined" style={{ fontSize: 18, color: C.outlineVariant }}>menu_book</span>
                          </div>
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm" style={{ color: C.primary }}>{title}</h4>
                        {author && <p className="text-xs" style={{ color: C.onSurfaceVariant }}>{author}</p>}
                      </div>
                    </div>

                    <div className="mb-3">
                      <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: C.onSurfaceVariant }}>Rating</p>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map(star => {
                          const bookRating = orderRatings[bookId]?.rating || 0;
                          const isFilled = star <= bookRating;
                          return (
                            <button
                              key={star}
                              type="button"
                              onClick={() => handleStarClick(bookId, star)}
                              className="p-0.5 active:scale-90 transition-transform"
                            >
                              <span 
                                className="material-symbols-outlined" 
                                style={{ 
                                  fontSize: 26, 
                                  color: isFilled ? "#f59e0b" : C.outlineVariant,
                                  fontVariationSettings: isFilled ? "'FILL' 1" : "'FILL' 0"
                                }}
                              >
                                star
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: C.onSurfaceVariant }}>Review</p>
                      <textarea
                        value={orderRatings[bookId]?.review || ""}
                        onChange={(e) => handleReviewChange(bookId, e.target.value)}
                        placeholder="Write a brief review about this book..."
                        className="w-full text-sm rounded-lg p-3 outline-none transition-shadow"
                        style={{ 
                          height: 70, 
                          resize: "none", 
                          background: C.surfaceContainerLow, 
                          border: `1px solid ${C.outlineVariant}50` 
                        }}
                        onFocus={e => e.currentTarget.style.boxShadow = `0 0 0 2px ${C.primary}30`}
                        onBlur={e => e.currentTarget.style.boxShadow = "none"}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowRatingModal(false)}
                className="flex-1 py-3 text-sm font-bold rounded-xl transition-colors"
                style={{ background: C.surfaceContainer, color: C.primary }}
                onMouseEnter={e => e.currentTarget.style.background = C.surfaceContainerHigh}
                onMouseLeave={e => e.currentTarget.style.background = C.surfaceContainer}
              >
                Cancel
              </button>
              <button
                onClick={handleRatingSubmit}
                className="flex-1 py-3 text-sm font-bold text-white rounded-xl active:scale-95 transition-all"
                style={{ background: `linear-gradient(135deg, ${C.primary}, ${C.primaryContainer})` }}
              >
                Submit Ratings
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}