import { useState, useEffect } from "react";
import {
  Search,
  ShoppingCart,
  X,
  Home,
  BookOpen,
  Heart,
  ReceiptText,
  User,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { logout } from "../redux/slices/authSlice";
import logo from "../assets/ePustakalayNewLogo.png";

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { isLoggedIn } = useSelector((state) => state.auth);
  const cartItems = useSelector((state) => state.cart?.cartData || []);
  const cartCount = cartItems
    .filter((item) => item != null)
    .reduce((acc, item) => acc + (item?.quantity || 1), 0);

  const wishlistItems = useSelector(
    (state) => state.wishlist?.wishlistData || []
  );
  const wishlistCount = wishlistItems.filter((item) => item != null).length;

  const [localSearch, setLocalSearch] = useState("");
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const urlSearch = queryParams.get("search") || "";
    setLocalSearch(urlSearch);
  }, [location.pathname, location.search]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setLocalSearch(value);
    const newParams = new URLSearchParams(location.search);
    if (value) {
      newParams.set("search", value);
    } else {
      newParams.delete("search");
    }
    navigate(`${location.pathname}?${newParams.toString()}`, { replace: true });
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  const linkStyles = ({ isActive }) =>
    `transition-all duration-200 relative pb-1 font-semibold ${
      isActive
        ? "text-[#002629] after:w-full font-bold"
        : "text-slate-500 hover:text-[#002629] after:w-0"
    } after:content-[""] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:bg-[#002629] after:transition-all after:duration-200`;

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-slate-50/90 backdrop-blur-md shadow-[0_4px_20px_rgb(0,0,0,0.04)] border-b border-slate-200/50">
        <nav className="flex items-center justify-between px-4 sm:px-6 md:px-8 py-3 max-w-7xl mx-auto h-16 sm:h-20 gap-4">
          {/* ── 1. Left: Logo Branding ── */}
          <div className="flex items-center shrink-0">
            <NavLink to="/" className="flex items-center group">
              <img
                src={logo}
                alt="ePustakalay Logo"
                className="h-8 sm:h-10 md:h-11 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
              />
            </NavLink>
          </div>

          {/* ── 2. Center: Navigation Links (Desktop & Tablet) ── */}
          <div className="hidden md:flex flex-1 justify-center items-center gap-6 lg:gap-10 text-sm md:text-base font-semibold">
            <NavLink to="/" className={linkStyles}>
              Home
            </NavLink>
            <NavLink to="/books" className={linkStyles}>
              Books
            </NavLink>

            {isLoggedIn && (
              <NavLink to="/orders" className={linkStyles}>
                My Orders
              </NavLink>
            )}

            <NavLink to="/wishlist" className="relative group">
              {({ isActive }) => (
                <>
                  <span className={linkStyles({ isActive })}>Wishlist</span>
                  {wishlistCount > 0 && (
                    <span
                      className="absolute -top-2 -right-3.5 bg-[#002629] text-white rounded-full inline-flex items-center justify-center font-extrabold shadow-sm"
                      style={{
                        fontSize: "9px",
                        minWidth: "16px",
                        height: "16px",
                        padding: "0 4px",
                        lineHeight: 1,
                        border: "1.5px solid white",
                      }}
                    >
                      {wishlistCount}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          </div>

          {/* ── 3. Right: Search + Cart + Auth ── */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            {/* Desktop Search Bar */}
            <div className="hidden lg:flex items-center bg-slate-200/60 focus-within:bg-white focus-within:ring-2 focus-within:ring-[#002629]/20 transition-all rounded-full px-3.5 py-1.5 w-44 xl:w-60 border border-slate-200/80">
              <Search size={16} className="text-slate-400 shrink-0" />
              <input
                type="text"
                placeholder="Search books..."
                value={localSearch}
                onChange={handleSearchChange}
                className="bg-transparent outline-none ml-2 text-xs md:text-sm w-full text-slate-800 placeholder:text-slate-400"
              />
            </div>

            {/* Mobile / Small Tablet Search Icon */}
            <button
              onClick={() => setShowMobileSearch(true)}
              className="lg:hidden p-2 hover:bg-slate-200/70 rounded-full transition-colors text-slate-700 active:scale-95 cursor-pointer"
              aria-label="Search"
            >
              <Search size={19} />
            </button>

            {/* Cart Icon */}
            <NavLink
              to="/carts"
              aria-label="View shopping cart"
              className="relative p-2 hover:bg-slate-200/70 rounded-full transition-colors text-slate-700 active:scale-95"
            >
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span
                  className="absolute -top-0.5 -right-0.5 bg-[#002629] text-white rounded-full flex items-center justify-center font-extrabold shadow-sm"
                  style={{
                    fontSize: "9px",
                    minWidth: "16px",
                    height: "16px",
                    padding: "0 4px",
                    lineHeight: 1,
                    border: "1.5px solid white",
                  }}
                >
                  {cartCount}
                </span>
              )}
            </NavLink>

            {/* User Auth Buttons */}
            {isLoggedIn ? (
              <div className="flex items-center gap-2">
                <NavLink
                  to="/my-account"
                  className="hidden sm:inline-flex px-3.5 py-1.5 border border-[#002629] text-[#002629] hover:bg-[#002629] hover:text-white rounded-full font-semibold text-xs md:text-sm transition-all duration-200 shadow-xs"
                >
                  My Account
                </NavLink>
                <button
                  onClick={handleLogout}
                  className="px-3.5 py-1.5 bg-[#002629] text-white rounded-full font-semibold text-xs md:text-sm hover:bg-[#083d41] transition-all duration-200 shadow-xs cursor-pointer"
                >
                  Logout
                </button>
              </div>
            ) : (
              <NavLink
                to="/login"
                className="px-4 py-1.5 border border-[#002629] rounded-full font-semibold text-xs md:text-sm text-[#002629] hover:bg-[#002629] hover:text-white transition-all duration-200 shadow-xs"
              >
                Login
              </NavLink>
            )}
          </div>
        </nav>
      </header>

      {/* ── Mobile Search Overlay ── */}
      {showMobileSearch && (
        <div
          className="fixed inset-0 z-[60] bg-slate-900/50 backdrop-blur-sm lg:hidden"
          onClick={() => setShowMobileSearch(false)}
        >
          <div
            className="bg-white p-4 shadow-lg animate-slideDown"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 max-w-2xl mx-auto">
              <div className="flex-1 flex items-center bg-slate-100 rounded-lg px-4 py-3">
                <Search size={18} className="text-gray-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Search books, authors, categories..."
                  value={localSearch}
                  onChange={handleSearchChange}
                  autoFocus
                  className="bg-transparent outline-none ml-3 text-sm w-full text-slate-800 placeholder:text-slate-400"
                />
              </div>
              <button
                onClick={() => setShowMobileSearch(false)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                aria-label="Close search"
              >
                <X size={24} className="text-slate-600" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Mobile Bottom Nav ── */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white/90 backdrop-blur-xl border-t border-slate-200/80 shadow-[0_-4px_20px_0_rgba(0,0,0,0.06)]">
        <div className="flex justify-around items-center px-2 pt-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))]">
          {/* Home */}
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all duration-200 active:scale-90 ${
                isActive
                  ? "text-[#002629] bg-[#002629]/[0.08]"
                  : "text-slate-500 hover:text-[#002629]"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Home size={20} strokeWidth={isActive ? 2.3 : 1.7} />
                <span className="text-[10px] font-bold tracking-wider">
                  Home
                </span>
              </>
            )}
          </NavLink>

          {/* Books */}
          <NavLink
            to="/books"
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all duration-200 active:scale-90 ${
                isActive
                  ? "text-[#002629] bg-[#002629]/[0.08]"
                  : "text-slate-500 hover:text-[#002629]"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <BookOpen size={20} strokeWidth={isActive ? 2.3 : 1.7} />
                <span className="text-[10px] font-bold tracking-wider">
                  Books
                </span>
              </>
            )}
          </NavLink>

          {/* Wishlist */}
          <NavLink
            to="/wishlist"
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all duration-200 active:scale-90 relative ${
                isActive
                  ? "text-[#002629] bg-[#002629]/[0.08]"
                  : "text-slate-500 hover:text-[#002629]"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className="relative">
                  <Heart size={20} strokeWidth={isActive ? 2.3 : 1.7} />
                  {wishlistCount > 0 && (
                    <span
                      className="absolute -top-1.5 -right-1.5 bg-[#002629] text-white rounded-full inline-flex items-center justify-center font-extrabold"
                      style={{
                        fontSize: "8px",
                        minWidth: "14px",
                        height: "14px",
                        padding: "0 3px",
                        lineHeight: 1,
                        border: "1.5px solid white",
                      }}
                    >
                      {wishlistCount}
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-bold tracking-wider">
                  Wishlist
                </span>
              </>
            )}
          </NavLink>

          {/* Orders */}
          {isLoggedIn && (
            <NavLink
              to="/orders"
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all duration-200 active:scale-90 ${
                  isActive
                    ? "text-[#002629] bg-[#002629]/[0.08]"
                    : "text-slate-500 hover:text-[#002629]"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <ReceiptText size={20} strokeWidth={isActive ? 2.3 : 1.7} />
                  <span className="text-[10px] font-bold tracking-wider">
                    Orders
                  </span>
                </>
              )}
            </NavLink>
          )}

          {/* My Account */}
          {isLoggedIn && (
            <NavLink
              to="/my-account"
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all duration-200 active:scale-90 ${
                  isActive
                    ? "text-[#002629] bg-[#002629]/[0.08]"
                    : "text-slate-500 hover:text-[#002629]"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <User size={20} strokeWidth={isActive ? 2.3 : 1.7} />
                  <span className="text-[10px] font-bold tracking-wider">
                    Account
                  </span>
                </>
              )}
            </NavLink>
          )}
        </div>
      </nav>

      {/* Bottom nav spacer so page content isn't hidden behind it on mobile */}
      <div className="h-16 md:hidden" aria-hidden="true" />

      <style>{`
        @keyframes slideDown {
          from { transform: translateY(-100%); opacity: 0; }
          to   { transform: translateY(0);     opacity: 1; }
        }
        .animate-slideDown { animation: slideDown 0.3s ease-out; }
      `}</style>
    </>
  );
}
