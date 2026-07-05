import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { getAllBooks } from "../redux/slices/bookSlice";
import { toggleWishlist, getAllWishlist } from "../redux/slices/wishlistSlice";
import { getCart, addToCart, addToGuestCart } from "../redux/slices/cartSlice";
import { toast } from "react-hot-toast";
import { createRating, getAllRating, updateRating, deleteRating, clearRatings } from "../redux/slices/ratingSlice";

const colors = {
  primary: "#002629",
  primaryContainer: "#083d41",
  onPrimaryContainer: "#7aa8ac",
  secondary: "#4a6363",
  secondaryContainer: "#cce8e7",
  onSecondaryContainer: "#506969",
  tertiary: "#381905",
  surface: "#f7f9ff",
  surfaceContainer: "#ebeef4",
  surfaceContainerLow: "#f1f4fa",
  surfaceContainerHigh: "#e5e8ee",
  surfaceContainerHighest: "#dfe3e8",
  surfaceContainerLowest: "#ffffff",
  onSurface: "#181c20",
  onSurfaceVariant: "#404849",
  outlineVariant: "#c0c8c9",
  outline: "#707979",
};

// const StarIcon = ({ filled = true, size = 18 }) => (
//   <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? colors.tertiary : "none"} stroke={colors.tertiary} strokeWidth="1.5">
//     <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
//   </svg>
// );
const StarIcon = ({ fillType = "full", size = 18 }) => {
  // Safe fallback if colors.tertiary is missing
  const starColor = colors?.tertiary || "#f59e0b";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      stroke={starColor}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ display: "inline-block", verticalAlign: "middle" }}
    >
      <defs>
        {/* Creates a clean 50/50 split gradient for the half-star look */}
        <linearGradient id="halfStarGrad">
          <stop offset="50%" stopColor={starColor} />
          <stop offset="50%" stopColor="transparent" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
        fill={
          fillType === "full" ? starColor :
            fillType === "half" ? "url(#halfStarGrad)" :
              "none"
        }
      />
    </svg>
  );
};


const CartIcon = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
);

const HeartIcon = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const SearchIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const UserIcon = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
  </svg>
);

const ArrowRightIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
  </svg>
);

const BookOpenIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </svg>
);

const ShareIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
  </svg>
);

const RssIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 11a9 9 0 0 1 9 9" /><path d="M4 4a16 16 0 0 1 16 16" /><circle cx="5" cy="19" r="1" />
  </svg>
);

const renderStars = (currentRating) => {
  const rating = currentRating || 0;
  const stars = [];

  for (let index = 1; index <= 5; index++) {
    if (rating >= index) {
      stars.push(<StarIcon key={index} fillType="full" size={14} />);
    } else if (rating > index - 1 && rating < index) {
      stars.push(<StarIcon key={index} fillType="half" size={14} />);
    } else {
      stars.push(<StarIcon key={index} fillType="empty" size={14} />);
    }
  }
  return stars;
};
const navLinks = ["Home", "Books", "Wishlist"];

export default function BookdetailPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const [activeNav, setActiveNav] = useState("Books");
  const [cartAdded, setCartAdded] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedRating, setSelectedRating] = useState(0);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [modalRating, setModalRating] = useState(0);
  const [modalReviewText, setModalReviewText] = useState("");

  const authState = useSelector((state) => state.auth);
  const books = useSelector((state) => state.books.booksData || []);
  const isLoading = useSelector((state) => state.books.isLoading);
  const { cartData } = useSelector((state) => state.cart);
  const { wishlistData } = useSelector((state) => state.wishlist);
  const { ratingsData } = useSelector((state) => state.ratings);

  const reviews = ratingsData?.reviews || [];

  const isLoggedIn = authState?.isLoggedIn || false;
  const isCheckingAuth = authState?.isCheckingAuth || false;


  const rawAverageRating = ratingsData?.averageRating ?? 0;
  const AverageRating = Math.round(rawAverageRating * 2) / 2;
  const TotalRatings = ratingsData?.totalRatings ?? 0;
  const userRating = ratingsData?.userRating;


  const book = books.find((b) => b._id === id);

  // Fetch books if not already loaded
  // Load books once
  useEffect(() => {
    if (books.length === 0) {
      dispatch(getAllBooks());
    }
  }, [dispatch, books.length]);

  // Load cart and wishlist
  useEffect(() => {
    if (isLoggedIn) {
      dispatch(getCart());
      dispatch(getAllWishlist());
    }
  }, [dispatch, isLoggedIn]);

  // Load ratings when the selected book changes or login state changes
  useEffect(() => {
    if (book?._id) {
      dispatch(clearRatings());
      dispatch(getAllRating(book._id));
    }
    return () => {
      dispatch(clearRatings());
    };
  }, [dispatch, book?._id, isLoggedIn]);

  // Initialize the selected rating when userRating changes
  useEffect(() => {
    if (userRating) {
      setSelectedRating(userRating.rating);
      setModalRating(userRating.rating);
      setModalReviewText(userRating.review || "");
    }
  }, [userRating]);



  // 3. Determine if this specific book is already added to cart
  const isAlreadyInCart = cartData
    .filter(item => item != null) // Filter out null items
    .some((item) => {
      const cartBookId = item.book && typeof item.book === "object" ? item.book._id : item.book;
      return cartBookId === book?._id;
    });

  const isWishlisted = wishlistData
    .filter(item => item != null) // Filter out null items
    .some((item) => {
      const wishlistBookId = item.book && typeof item.book === "object" ? item.book._id : item.book;
      return wishlistBookId === book?._id;
    });


  // Redirect to login only after auth check is complete and user is not logged in
  const requireLogin = () => {
    if (isCheckingAuth) return false; // Auth still loading, don't redirect yet
    if (!isLoggedIn) {
      toast.error("Please log in to continue");
      navigate("/login");
      return true;
    }
    return false;
  };




  //  Handle Add to Cart Click — works for both logged in and guest users
  const handleCartClick = async () => {
    if (!book?._id) return;

    if (isAlreadyInCart) {
      toast.error("Item is already in your cart");
      return;
    }

    if (isLoggedIn) {
      // Logged-in user: API call
      toast.promise(
        dispatch(addToCart(book._id)).unwrap(),
        {
          loading: "Adding to cart...",
          success: "Added to cart successfully!",
          error: "Failed to add item to cart.",
        }
      );
    } else {
      // Guest user: local cart
      dispatch(addToGuestCart(book));
      toast.success("Added to cart!");
    }
  };

  // Toggle Wishlist — LOGIN REQUIRED
  const handleWishlistClick = () => {
    if (!book?._id) return;
    if (requireLogin()) return; // Only this button needs login
    dispatch(toggleWishlist(book._id));
  };


  // Show loading state
  if (isLoading || (!book && books.length === 0)) {
    return (
      <div style={{ background: colors.surface, minHeight: "100vh" }} className="flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-[#002629] border-r-transparent"></div>
          <p className="mt-4 text-[#404849] font-medium">Loading book details...</p>
        </div>
      </div>
    );
  }

  // Show error if book not found after loading
  if (!book) {
    return (
      <div style={{ background: colors.surface, minHeight: "100vh" }} className="flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <h1 className="text-3xl font-bold text-[#002629] mb-4 font-['Manrope']">Book Not Found</h1>
          <p className="text-[#404849] mb-6">Sorry, we couldn't find the book you're looking for.</p>
          <a
            href="/books"
            className="inline-block px-6 py-3 bg-gradient-to-r from-[#002629] to-[#083d41] text-white rounded-lg font-semibold hover:opacity-95 transition-opacity no-underline"
          >
            Browse All Books
          </a>
        </div>
      </div>
    );
  }




  const metaItems = [
    { label: "Format", value: "Hardcover" },
    { label: "Pages", value: "180 pp." },
    { label: "Language", value: book.language },
    { label: "Published", value: "1925" },
  ];

  return (
    <div style={{ background: colors.surface, color: colors.onSurface, fontFamily: "'Inter', sans-serif", minHeight: "100vh" }}>
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700;800&family=Inter:wght@400;500;600;700&display=swap');
        .font-headline { font-family: 'Manrope', sans-serif; }
        .book-gradient { background: linear-gradient(135deg, #002629 0%, #083d41 100%); }
        .nav-glass { background: rgba(255,255,255,0.85); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); }
        .cover-hover { transition: transform 0.5s cubic-bezier(.22,1,.36,1); }
        .cover-hover:hover { transform: scale(1.02); }
        .btn-scale:active { transform: scale(0.96); }
        .review-arrow { transition: transform 0.2s; }
        .review-btn:hover .review-arrow { transform: translateX(4px); }
        .footer-social:hover { background: #002629; color: white; }
        .footer-social { transition: all 0.2s; }
        .search-input:focus { outline: none; box-shadow: 0 0 0 2px #002629; }
        .read-now-btn:hover { box-shadow: 0 12px 36px rgba(26,107,112,0.5) !important; transform: translateY(-1px); }
        .review-card { position: relative; }
        .review-delete-btn { opacity: 0; transition: opacity 0.2s ease, transform 0.2s ease; transform: scale(0.85); }
        .review-card:hover .review-delete-btn { opacity: 1; transform: scale(1); }
      `}</style>


      {/* MAIN */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 pt-24 sm:pt-28 md:pt-32 pb-16 md:pb-20 lg:pb-24">
        {/* Book Detail Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 lg:gap-16 items-start">
          {/* Left: Cover */}
          <div className="md:col-span-5" style={{ position: "relative" }}>
            <div
              className="cover-hover"
              style={{
                aspectRatio: "3/4", borderRadius: 16, overflow: "hidden",
                boxShadow: "0 25px 60px rgba(0,38,41,0.22)", background: colors.surfaceContainerHighest,
              }}
            >
              <img
                src={book.cover_image}
                alt={book.title}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
            {/* Badge */}
            <div style={{
              position: "absolute", top: 12, left: 12,
              background: "rgba(255,255,255,0.2)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
              padding: "6px 12px", borderRadius: 9999, border: "1px solid rgba(255,255,255,0.3)",
              color: "white", fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase",
            }}
              className="font-headline md:top-5 md:left-5 md:text-[11px] md:px-4 md:py-2">
              Modern Classic
            </div>
          </div>

          {/* Right: Details */}
          <div className="md:col-span-7 md:gap-8" style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {/* Title & Author */}
            <div className="md:gap-4" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <h1 className="font-headline md:text-5xl lg:text-[52px] md:tracking-[-2px]" style={{ fontSize: 32, fontWeight: 800, color: colors.primary, letterSpacing: "-1px", lineHeight: 1.05, margin: 0 }}>
                {book.title}
              </h1>
              <div className="md:gap-4" style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                <span className="md:text-lg" style={{ fontSize: 15, color: colors.onSurfaceVariant, fontWeight: 500 }}> {book.author} </span>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: colors.outlineVariant, display: "inline-block" }} />
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <StarIcon fillType="full" size={16} />
                  <span
                    className="md:text-[16px]"
                    style={{
                      fontWeight: 700,
                      fontSize: 15,
                      color: colors.onSurface,
                    }}
                  >
                    {AverageRating.toFixed(1)}
                  </span>
                </div>
              </div>
            </div>

            {/* Price */}
            <div className="font-headline md:text-[38px]" style={{ fontSize: 32, fontWeight: 800, color: colors.primaryContainer }}>
              ₹{book.price}
            </div>

            {/* Synopsis */}
            <div className="md:gap-3" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <h3 className="font-headline md:text-[11px]" style={{ fontSize: 10, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", color: colors.onSurfaceVariant, margin: 0 }}>
                Synopsis
              </h3>
              <p className="md:text-[17px]" style={{ fontSize: 15, lineHeight: 1.75, color: `${colors.onSurface}cc`, maxWidth: 560, margin: 0 }}>
                {book.description}
              </p>
            </div>

            {/* Meta Bento */}
            <div className="sm:grid-cols-4 md:gap-3" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10 }}>
              {metaItems.map(({ label, value }) => (
                <div key={label} className="md:p-4" style={{ background: colors.surfaceContainerLow, padding: "12px", borderRadius: 10 }}>
                  <span className="md:text-[10px]" style={{ display: "block", fontSize: 9, letterSpacing: 2, textTransform: "uppercase", color: colors.onSurfaceVariant, marginBottom: 4 }}>{label}</span>
                  <span className="md:text-[15px]" style={{ fontWeight: 700, fontSize: 13 }}>{value}</span>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="md:gap-4" style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <button
                className="book-gradient btn-scale font-headline"
                onClick={handleCartClick}
                style={{
                  color: "white", padding: "14px 28px", borderRadius: 10, fontWeight: 700, fontSize: 14,
                  border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 8,
                  boxShadow: "0 8px 24px rgba(0,38,41,0.25)", transition: "box-shadow 0.2s", flex: 1,
                  justifyContent: "center",
                }}
              >
                <CartIcon size={18} />
                <span className="hidden sm:inline">{isAlreadyInCart ? "Added!" : "Add to Cart"}</span>
                <span className="sm:hidden">{isAlreadyInCart ? "Added!" : "Add"}</span>
              </button>
              <button
                className="btn-scale font-headline"
                onClick={handleWishlistClick}
                style={{
                  background: colors.surfaceContainerHighest, color: colors.primary,
                  padding: "14px 28px", borderRadius: 10, fontWeight: 700, fontSize: 14,
                  border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 8,
                  transition: "background 0.15s", flex: 1, justifyContent: "center",
                }}
              >
                <HeartIcon size={18} />
                <span className="hidden sm:inline">{isWishlisted ? "Wishlisted ✓" : "Add to Wishlist"}</span>
                <span className="sm:hidden">{isWishlisted ? "Saved" : "Save"}</span>
              </button>
            </div>

            {/* Read Now Button - Single unified button */}
            <button
              className="btn-scale font-headline read-now-btn"
              onClick={() => navigate(`/books/${id}/chapters`)}
              style={{
                background: "linear-gradient(135deg, #1a6b70 0%, #0d4a4e 100%)",
                color: "white",
                padding: "16px 32px",
                borderRadius: 12,
                fontWeight: 700,
                fontSize: 15,
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                width: "100%",
                boxShadow: "0 8px 28px rgba(26,107,112,0.35)",
                transition: "box-shadow 0.2s, transform 0.15s",
                letterSpacing: "0.5px",
              }}
            >
              <BookOpenIcon size={20} />
              <span>Read Now</span>
            </button>
          </div>
        </div>

        {/* Reviews Section */}
        <section className="md:mt-24" style={{ marginTop: 64 }}>
          <div className="sm:flex-row sm:justify-between sm:items-end md:mb-12" style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 32 }}>
            <div>
              <h2 className="font-headline md:text-4xl" style={{ fontSize: 28, fontWeight: 800, color: colors.primary, margin: "0 0 6px 0" }}>
                Reader Reviews
              </h2>
              <p className="md:text-base" style={{ color: colors.onSurfaceVariant, margin: 0, fontSize: 14 }}>Hear from our community of book lovers.</p>
            </div>
            <button
              onClick={() => setShowReviewModal(true)}
              className="review-btn font-headline md:text-[15px] md:gap-2"
              style={{
                background: "transparent", border: "none", cursor: "pointer", color: colors.primary,
                fontWeight: 700, fontSize: 14, display: "flex", alignItems: "center", gap: 6,
              }}
            >
              Write a Review
              <span className="review-arrow"><ArrowRightIcon size={16} /></span>
            </button>
          </div>          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 20 }} className="md:grid-cols-2 lg:grid-cols-3 md:gap-7">
            {reviews.length === 0 ? (
              <p style={{ color: colors.onSurfaceVariant, fontStyle: "italic" }}>No reviews yet. Be the first to write one!</p>
            ) : (
              (() => {
                // Count frequency of each rating value
                const ratingFreq = {};
                reviews.forEach(r => {
                  ratingFreq[r.rating] = (ratingFreq[r.rating] || 0) + 1;
                });
                // Sort: most-frequent rating first, then by rating desc as tiebreaker
                const sortedReviews = [...reviews].sort((a, b) => {
                  const freqDiff = (ratingFreq[b.rating] || 0) - (ratingFreq[a.rating] || 0);
                  if (freqDiff !== 0) return freqDiff;
                  return b.rating - a.rating;
                });

                return sortedReviews.map((r, i) => {
                  const initials = r.userName ? r.userName.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2) : "UR";
                  const isOwnReview = userRating && userRating._id === r._id;

                  return (
                    <div
                      key={r._id || i}
                      className="review-card md:p-8 md:gap-5"
                      style={{
                        background: colors.surfaceContainerLowest, padding: 24, borderRadius: 14,
                        boxShadow: "0 2px 8px rgba(0,0,0,0.06)", border: `1px solid ${colors.outlineVariant}20`,
                        display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 16,
                      }}
                    >
                      <div>
                        {/* Stars row + delete button (always rendered, shown on hover via CSS) */}
                        <div className="md:mb-4" style={{ display: "flex", gap: 2, marginBottom: 12, alignItems: "center", justifyContent: "space-between" }}>
                          <div style={{ display: "flex", gap: 2 }}>
                            {[...Array(5)].map((_, s) => (
                              <StarIcon key={s} fillType={r.rating > s ? (r.rating > s + 0.5 ? "full" : "half") : "empty"} size={15} />
                            ))}
                          </div>
                          <button
                            className="review-delete-btn"
                            title={isOwnReview ? "Delete your review" : "You can only delete your own review"}
                            onClick={async () => {
                              if (!isLoggedIn) {
                                toast.error("Please log in to delete a review");
                                return;
                              }
                              if (!isOwnReview) {
                                toast.error("You can only delete your own review");
                                return;
                              }
                              if (!userRating?._id) return;
                              await dispatch(deleteRating(userRating._id));
                              await dispatch(getAllRating(book._id));
                            }}
                            style={{
                              background: isOwnReview ? "#fff0f0" : "#f5f5f5",
                              border: `1px solid ${isOwnReview ? "#fca5a5" : "#d1d5db"}`,
                              borderRadius: 8,
                              padding: "4px 10px",
                              cursor: isOwnReview ? "pointer" : "not-allowed",
                              display: "flex",
                              alignItems: "center",
                              gap: 4,
                              fontSize: 12,
                              fontWeight: 600,
                              color: isOwnReview ? "#dc2626" : "#9ca3af",
                            }}
                          >
                            <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="3 6 5 6 21 6" />
                              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                              <path d="M10 11v6" /><path d="M14 11v6" />
                              <path d="M9 6V4h6v2" />
                            </svg>
                            Delete
                          </button>
                        </div>
                        <p className="md:text-base" style={{ color: `${colors.onSurface}e8`, fontStyle: "italic", lineHeight: 1.7, margin: 0, fontSize: 14 }}>
                          "{r.review || "No review comments provided."}"
                        </p>
                      </div>
                      <div className="md:gap-3" style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div className="font-headline md:w-10 md:h-10 md:text-[13px]" style={{
                          width: 36, height: 36, borderRadius: "50%",
                          background: `${colors.primaryContainer}18`, color: colors.primary,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontWeight: 700, fontSize: 12,
                        }}>{initials}</div>
                        <div>
                          <p className="md:text-sm" style={{ fontWeight: 700, fontSize: 13, margin: 0 }}>{r.userName}</p>
                          <p className="md:text-xs" style={{ fontSize: 11, color: colors.onSurfaceVariant, margin: 0 }}>Verified Reader</p>
                        </div>
                      </div>
                    </div>
                  );
                });
              })()
            )}
          </div>
        </section>
      </main>

      {showReviewModal && (
        <div style={{
          position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
          backgroundColor: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center",
          justifyContent: "center", zIndex: 1000, backdropFilter: "blur(4px)",
          padding: "16px"
        }}>
          <div style={{
            background: colors.surfaceContainerLowest, padding: "32px", borderRadius: "16px",
            width: "100%", maxWidth: "480px", boxShadow: "0 24px 48px rgba(0,38,41,0.18)"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <h3 className="font-headline" style={{ fontSize: "20px", fontWeight: 800, color: colors.primary, margin: 0 }}>
                {userRating ? "Update Review" : "Write a Review"}
              </h3>
              <button 
                onClick={() => setShowReviewModal(false)}
                style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center" }}
              >
                <span className="material-symbols-outlined" style={{ color: colors.onSurfaceVariant }}>close</span>
              </button>
            </div>
            
            <div style={{ marginBottom: "20px" }}>
              <p style={{ fontSize: "14px", fontWeight: 600, color: colors.onSurfaceVariant, marginBottom: "8px" }}>Your Rating</p>
              <div style={{ display: "flex", gap: "6px" }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setModalRating(star)}
                    style={{ background: "none", border: "none", padding: 0, cursor: "pointer" }}
                  >
                    <StarIcon
                      fillType={modalRating >= star ? "full" : "empty"}
                      size={24}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: "24px" }}>
              <label style={{ display: "block", fontSize: "14px", fontWeight: 600, color: colors.onSurfaceVariant, marginBottom: "8px" }}>
                Your Review
              </label>
              <textarea
                value={modalReviewText}
                onChange={(e) => setModalReviewText(e.target.value)}
                placeholder="What did you like or dislike about this book?"
                style={{
                  width: "100%", height: "120px", borderRadius: "8px", border: `1px solid ${colors.outlineVariant}`,
                  padding: "12px", fontSize: "14px", fontFamily: "inherit", resize: "none", outline: "none"
                }}
                className="search-input"
              />
            </div>

            <div style={{ display: "flex", gap: "12px" }}>
              <button
                onClick={() => setShowReviewModal(false)}
                style={{
                  flex: 1, padding: "12px", borderRadius: "8px", fontWeight: 700, fontSize: "14px",
                  background: colors.surfaceContainer, color: colors.primary, border: "none", cursor: "pointer"
                }}
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  // Login required to submit a review
                  if (requireLogin()) {
                    setShowReviewModal(false);
                    return;
                  }
                  if (modalRating === 0) {
                    toast.error("Please select a star rating");
                    return;
                  }
                  try {
                    if (userRating) {
                      await dispatch(
                        updateRating({
                          id: userRating._id,
                          data: {
                            rating: modalRating,
                            review: modalReviewText
                          }
                        })
                      ).unwrap();
                    } else {
                      await dispatch(
                        createRating({
                          bookId: book._id,
                          rating: modalRating,
                          review: modalReviewText
                        })
                      ).unwrap();
                    }
                    await dispatch(getAllRating(book._id)).unwrap();
                  } catch (err) {
                  } finally {
                    setShowReviewModal(false);
                  }
                }}
                style={{
                  flex: 1, padding: "12px", borderRadius: "8px", fontWeight: 700, fontSize: "14px",
                  background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryContainer})`,
                  color: "white", border: "none", cursor: "pointer"
                }}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
