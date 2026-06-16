import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getChaptersByBook } from "../redux/slices/chapterSlice";
import { getAllBooks } from "../redux/slices/bookSlice";

// Custom SVG Icons
const ArrowLeftIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
  </svg>
);

const ChevronLeftIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const ChevronRightIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const MenuIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const CloseIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const SettingsIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

// E-reader visual themes configurations
const themes = {
  light: {
    bg: "#f8fafc",
    text: "#0f172a",
    sidebarBg: "#ffffff",
    sidebarBorder: "#e2e8f0",
    headerBg: "#ffffff",
    activeItemBg: "#083d41",
    activeItemText: "#ffffff",
    hoverItemBg: "#f1f5f9",
    panelBg: "#ffffff",
    panelBorder: "#e2e8f0",
    controlBg: "#f1f5f9",
    controlText: "#475569",
    accent: "#083d41",
  },
  sepia: {
    bg: "#fdf6e3",
    text: "#5c4033",
    sidebarBg: "#f4eccf",
    sidebarBorder: "#e4d9b4",
    headerBg: "#f4eccf",
    activeItemBg: "#704214",
    activeItemText: "#ffffff",
    hoverItemBg: "#eae0be",
    panelBg: "#fbf3db",
    panelBorder: "#e4d9b4",
    controlBg: "#eae0be",
    controlText: "#704214",
    accent: "#704214",
  },
  dark: {
    bg: "#0f172a",
    text: "#cbd5e1",
    sidebarBg: "#1e293b",
    sidebarBorder: "#334155",
    headerBg: "#1e293b",
    activeItemBg: "#0f766e",
    activeItemText: "#ffffff",
    hoverItemBg: "#334155",
    panelBg: "#1e293b",
    panelBorder: "#334155",
    controlBg: "#334155",
    controlText: "#94a3b8",
    accent: "#0f766e",
  }
};

const fontSizes = [
  { label: "A-", size: "15px", lineGap: "1.6" },
  { label: "A", size: "17px", lineGap: "1.7" },
  { label: "A+", size: "20px", lineGap: "1.8" },
  { label: "A++", size: "24px", lineGap: "1.9" },
];

export default function ChapterPage() {
  const { id } = useParams(); // Book ID
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux state
  const books = useSelector((state) => state.books.booksData || []);
  const chapters = useSelector((state) => state.chapter.chaptersData || []);

  // Component state
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [themeMode, setThemeMode] = useState("light"); // light, sepia, dark
  const [fontFamily, setFontFamily] = useState("serif"); // sans, serif
  const [fontSizeIndex, setFontSizeIndex] = useState(1); // Default to Medium (index 1: 17px)
  const [showSettings, setShowSettings] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const book = books.find((b) => b._id === id);

  // Fetch book list if empty
  useEffect(() => {
    if (books.length === 0) {
      dispatch(getAllBooks());
    }
  }, [books.length, dispatch]);

  // Fetch chapters for the book
  useEffect(() => {
    const fetchChapters = async () => {
      setLoading(true);
      await dispatch(getChaptersByBook(id));
      setLoading(false);
    };
    fetchChapters();
  }, [id, dispatch]);

  // Set initial selected chapter when chapters are loaded
  useEffect(() => {
    if (chapters && chapters.length > 0) {
      // Sort chapters by chapter number if available
      const sorted = [...chapters].sort((a, b) => a.chapter_number - b.chapter_number);
      setSelectedChapter(sorted[0]);
    } else {
      setSelectedChapter(null);
    }
  }, [chapters]);

  // Theme object based on selected themeMode
  const theme = themes[themeMode] || themes.light;
  const currentFontSize = fontSizes[fontSizeIndex];

  // Sorting helper
  const sortedChapters = [...chapters].sort((a, b) => a.chapter_number - b.chapter_number);

  const handleNextChapter = () => {
    if (!selectedChapter) return;
    const currentIndex = sortedChapters.findIndex(c => c._id === selectedChapter._id);
    if (currentIndex < sortedChapters.length - 1) {
      setSelectedChapter(sortedChapters[currentIndex + 1]);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrevChapter = () => {
    if (!selectedChapter) return;
    const currentIndex = sortedChapters.findIndex(c => c._id === selectedChapter._id);
    if (currentIndex > 0) {
      setSelectedChapter(sortedChapters[currentIndex - 1]);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const currentChapterIndex = selectedChapter 
    ? sortedChapters.findIndex(c => c._id === selectedChapter._id)
    : -1;

  return (
    <div style={{ background: theme.bg, color: theme.text, minHeight: "100vh", display: "flex", flexDirection: "column", transition: "background 0.3s, color 0.3s" }}>
      {/* Styles for dynamic fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Inter:wght@400;500;600;700&display=swap');
        .reader-font-serif { font-family: 'Lora', 'Georgia', serif; }
        .reader-font-sans { font-family: 'Inter', 'Helvetica Neue', sans-serif; }
        .drawer-overlay { background: rgba(0, 0, 0, 0.4); backdrop-filter: blur(4px); transition: opacity 0.3s ease; }
        .drawer-content { transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1); }
      `}</style>

      {/* Reader Header */}
      <header style={{ 
        position: "sticky", top: 0, zIndex: 40,
        background: theme.headerBg, borderBottom: `1px solid ${theme.sidebarBorder}`,
        height: 64, display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 16px", transition: "background 0.3s, border-color 0.3s"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {/* Back button */}
          <Link 
            to={`/books/${id}`} 
            style={{ 
              display: "flex", alignItems: "center", justifyContent: "center",
              width: 36, height: 36, borderRadius: "50%",
              color: theme.text, background: "transparent",
              transition: "background 0.2s"
            }}
            onMouseOver={(e) => e.currentTarget.style.background = theme.hoverItemBg}
            onMouseOut={(e) => e.currentTarget.style.background = "transparent"}
          >
            <ArrowLeftIcon />
          </Link>
          
          <div>
            <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 1, opacity: 0.7 }} className="hidden sm:block">
              Reading
            </div>
            <div style={{ fontWeight: 700, fontSize: 14, maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} className="sm:max-w-xs">
              {book?.title || "Loading Book..."}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {/* Mobile TOC Button */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden"
            style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              width: 36, height: 36, borderRadius: "50%",
              background: "transparent", border: "none", color: theme.text, cursor: "pointer"
            }}
            onMouseOver={(e) => e.currentTarget.style.background = theme.hoverItemBg}
            onMouseOut={(e) => e.currentTarget.style.background = "transparent"}
            title="Table of Contents"
          >
            <MenuIcon />
          </button>

          {/* E-reader Settings Toggle Button */}
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setShowSettings(!showSettings)}
              style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                width: 36, height: 36, borderRadius: "50%",
                background: showSettings ? theme.hoverItemBg : "transparent",
                border: "none", color: theme.text, cursor: "pointer"
              }}
              onMouseOver={(e) => !showSettings && (e.currentTarget.style.background = theme.hoverItemBg)}
              onMouseOut={(e) => !showSettings && (e.currentTarget.style.background = "transparent")}
              title="Reader Settings"
            >
              <SettingsIcon />
            </button>

            {/* Settings Dropdown Panel */}
            {showSettings && (
              <div style={{
                position: "absolute", right: 0, top: 44, width: 260,
                background: theme.panelBg, border: `1px solid ${theme.panelBorder}`,
                borderRadius: 12, padding: 16, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
                display: "flex", flexDirection: "column", gap: 16, zIndex: 50
              }}>
                {/* Theme Selector */}
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 8, opacity: 0.8 }}>THEME</div>
                  <div style={{ display: "flex", gap: 8 }}>
                    {["light", "sepia", "dark"].map((mode) => (
                      <button
                        key={mode}
                        onClick={() => setThemeMode(mode)}
                        style={{
                          flex: 1, padding: "8px 0", borderRadius: 8, border: themeMode === mode ? `2px solid ${theme.accent}` : `1px solid ${theme.sidebarBorder}`,
                          background: mode === "light" ? "#ffffff" : mode === "sepia" ? "#fdf6e3" : "#0f172a",
                          color: mode === "light" ? "#0f172a" : mode === "sepia" ? "#5c4033" : "#cbd5e1",
                          fontSize: 12, fontWeight: 700, textTransform: "capitalize", cursor: "pointer"
                        }}
                      >
                        {mode}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Font Family Selector */}
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 8, opacity: 0.8 }}>FONT</div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      onClick={() => setFontFamily("serif")}
                      style={{
                        flex: 1, padding: "8px 0", borderRadius: 8,
                        border: fontFamily === "serif" ? `2px solid ${theme.accent}` : `1px solid ${theme.sidebarBorder}`,
                        background: fontFamily === "serif" ? theme.activeItemBg : "transparent",
                        color: fontFamily === "serif" ? theme.activeItemText : theme.text,
                        fontFamily: "'Lora', serif", fontSize: 13, fontWeight: 600, cursor: "pointer"
                      }}
                    >
                      Serif
                    </button>
                    <button
                      onClick={() => setFontFamily("sans")}
                      style={{
                        flex: 1, padding: "8px 0", borderRadius: 8,
                        border: fontFamily === "sans" ? `2px solid ${theme.accent}` : `1px solid ${theme.sidebarBorder}`,
                        background: fontFamily === "sans" ? theme.activeItemBg : "transparent",
                        color: fontFamily === "sans" ? theme.activeItemText : theme.text,
                        fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 600, cursor: "pointer"
                      }}
                    >
                      Sans-Serif
                    </button>
                  </div>
                </div>

                {/* Font Size Selector */}
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 8, opacity: 0.8 }}>TEXT SIZE</div>
                  <div style={{ display: "flex", background: theme.controlBg, borderRadius: 8, padding: 4 }}>
                    {fontSizes.map((fs, index) => (
                      <button
                        key={index}
                        onClick={() => setFontSizeIndex(index)}
                        style={{
                          flex: 1, padding: "6px 0", border: "none", borderRadius: 6,
                          background: fontSizeIndex === index ? theme.sidebarBg : "transparent",
                          color: fontSizeIndex === index ? theme.accent : theme.controlText,
                          fontWeight: 700, fontSize: 12, cursor: "pointer"
                        }}
                      >
                        {fs.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div style={{ display: "flex", flex: 1, position: "relative" }}>
        
        {/* DESKTOP SIDEBAR - Chapter List */}
        <aside style={{
          width: 300, borderRight: `1px solid ${theme.sidebarBorder}`,
          background: theme.sidebarBg, overflowY: "auto", height: "calc(100vh - 64px)",
          position: "sticky", top: 64, zIndex: 10, transition: "background 0.3s, border-color 0.3s"
        }} className="hidden lg:block">
          <div style={{ padding: 20 }}>
            <h3 style={{ margin: "0 0 16px 0", fontSize: 14, fontWeight: 800, letterSpacing: 1.5, opacity: 0.8, textTransform: "uppercase" }}>
              Table of Contents
            </h3>
            {loading ? (
              <div style={{ padding: "24px 0", textAlign: "center", opacity: 0.6, fontSize: 13 }}>Loading chapters...</div>
            ) : sortedChapters.length === 0 ? (
              <div style={{ padding: "24px 0", textAlign: "center", opacity: 0.6, fontSize: 13 }}>No chapters available.</div>
            ) : (
              <nav style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {sortedChapters.map((ch) => {
                  const isActive = selectedChapter?._id === ch._id;
                  return (
                    <button
                      key={ch._id}
                      onClick={() => setSelectedChapter(ch)}
                      style={{
                        textAlign: "left", width: "100%", padding: "12px 14px", borderRadius: 10,
                        border: "none", cursor: "pointer",
                        background: isActive ? theme.activeItemBg : "transparent",
                        color: isActive ? theme.activeItemText : theme.text,
                        transition: "all 0.15s", display: "flex", flexDirection: "column", gap: 4
                      }}
                      onMouseOver={(e) => {
                        if (!isActive) e.currentTarget.style.background = theme.hoverItemBg;
                      }}
                      onMouseOut={(e) => {
                        if (!isActive) e.currentTarget.style.background = "transparent";
                      }}
                    >
                      <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 0.5, opacity: isActive ? 0.9 : 0.6 }}>
                        CHAPTER {ch.chapter_number}
                      </span>
                      <span style={{ fontWeight: 700, fontSize: 13, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {ch.chapter_title}
                      </span>
                    </button>
                  );
                })}
              </nav>
            )}
          </div>
        </aside>

        {/* MOBILE SIDEBAR - Slide Drawer Overlay */}
        {sidebarOpen && (
          <div 
            className="drawer-overlay lg:hidden"
            style={{ position: "fixed", inset: 0, zIndex: 100, opacity: 1, display: "flex", justifyContent: "flex-start" }}
            onClick={() => setSidebarOpen(false)}
          >
            <div 
              className="drawer-content"
              style={{
                position: "absolute", left: 0, top: 0, bottom: 0,
                width: 280, background: theme.sidebarBg,
                borderRight: `1px solid ${theme.sidebarBorder}`, overflowY: "auto",
                transform: "translateX(0)", transition: "transform 0.3s ease",
                padding: "20px 16px 80px 16px", display: "flex", flexDirection: "column", gap: 16
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3 style={{ margin: 0, fontSize: 13, fontWeight: 800, letterSpacing: 1.5, opacity: 0.8, textTransform: "uppercase" }}>
                  Table of Contents
                </h3>
                <button
                  onClick={() => setSidebarOpen(false)}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "center",
                    width: 32, height: 32, borderRadius: "50%",
                    background: theme.controlBg, border: "none", color: theme.text, cursor: "pointer"
                  }}
                >
                  <CloseIcon size={16} />
                </button>
              </div>

              {loading ? (
                <div style={{ padding: "24px 0", textAlign: "center", opacity: 0.6 }}>Loading...</div>
              ) : sortedChapters.length === 0 ? (
                <div style={{ padding: "24px 0", textAlign: "center", opacity: 0.6 }}>No chapters found.</div>
              ) : (
                <nav style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {sortedChapters.map((ch) => {
                    const isActive = selectedChapter?._id === ch._id;
                    return (
                      <button
                        key={ch._id}
                        onClick={() => {
                          setSelectedChapter(ch);
                          setSidebarOpen(false);
                        }}
                        style={{
                          textAlign: "left", width: "100%", padding: "12px 14px", borderRadius: 10,
                          border: "none", cursor: "pointer",
                          background: isActive ? theme.activeItemBg : "transparent",
                          color: isActive ? theme.activeItemText : theme.text,
                          display: "flex", flexDirection: "column", gap: 4
                        }}
                      >
                        <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: 0.5, opacity: isActive ? 0.9 : 0.6 }}>
                          CHAPTER {ch.chapter_number}
                        </span>
                        <span style={{ fontWeight: 700, fontSize: 13 }}>
                          {ch.chapter_title}
                        </span>
                      </button>
                    );
                  })}
                </nav>
              )}
            </div>
          </div>
        )}

        {/* READING PANEL */}
        <main style={{ flex: 1, padding: "32px 16px", display: "flex", justifyContent: "center" }} className="md:px-8 md:py-12">
          <div style={{ maxWidth: 680, width: "100%", display: "flex", flexDirection: "column" }}>
            
            {loading ? (
              <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "40vh" }}>
                <div style={{
                  width: 40, height: 40, border: `4px solid ${theme.sidebarBorder}`, borderTop: `4px solid ${theme.accent}`,
                  borderRadius: "50%", animation: "spin 1s linear infinite"
                }} />
                <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
                <p style={{ marginTop: 16, fontSize: 14, fontWeight: 600, opacity: 0.7 }}>Loading chapter contents...</p>
              </div>
            ) : sortedChapters.length === 0 ? (
              <div style={{ 
                flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", 
                minHeight: "50vh", textAlign: "center", background: theme.sidebarBg, borderRadius: 16,
                padding: "40px 24px", border: `1px solid ${theme.sidebarBorder}`
              }}>
                <div style={{ 
                  width: 64, height: 64, borderRadius: "50%", background: `${theme.accent}12`,
                  display: "flex", alignItems: "center", justifyContent: "center", color: theme.accent,
                  marginBottom: 20
                }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                  </svg>
                </div>
                <h2 style={{ fontSize: 20, fontWeight: 800, margin: "0 0 8px 0" }}>No Chapters Uploaded</h2>
                <p style={{ fontSize: 14, opacity: 0.7, maxWidth: 360, margin: "0 0 24px 0", lineHeight: 1.5 }}>
                  This book doesn't have any chapters added yet. Check back soon or return to the details page.
                </p>
                <Link 
                  to={`/books/${id}`} 
                  style={{ 
                    padding: "10px 20px", borderRadius: 8, background: theme.accent, color: "#ffffff",
                    fontWeight: 700, fontSize: 13, textDecoration: "none"
                  }}
                >
                  Back to Book details
                </Link>
              </div>
            ) : selectedChapter ? (
              <article style={{ display: "flex", flexDirection: "column", flex: 1 }}>
                
                {/* Chapter Heading */}
                <div style={{ marginBottom: 32, borderBottom: `1px solid ${theme.sidebarBorder}`, paddingBottom: 20 }}>
                  <span style={{ 
                    fontSize: 12, fontWeight: 800, letterSpacing: 2, 
                    color: theme.accent, textTransform: "uppercase", display: "block", marginBottom: 6
                  }}>
                    Chapter {selectedChapter.chapter_number}
                  </span>
                  <h1 style={{ 
                    fontSize: 28, fontWeight: 800, margin: 0, 
                    letterSpacing: "-0.5px", lineHeight: 1.2,
                  }} className="md:text-4xl">
                    {selectedChapter.chapter_title}
                  </h1>
                </div>

                {/* Chapter Context/Content */}
                <div 
                  className={fontFamily === "serif" ? "reader-font-serif" : "reader-font-sans"}
                  style={{ 
                    fontSize: currentFontSize.size, 
                    lineHeight: currentFontSize.lineGap,
                    whiteSpace: "pre-wrap",
                    textAlign: "justify",
                    flex: 1
                  }}
                >
                  {selectedChapter.context}
                </div>

                {/* Bottom Pagination controls */}
                <div style={{ 
                  marginTop: 48, paddingTop: 24, borderTop: `1px solid ${theme.sidebarBorder}`,
                  display: "flex", justifyContent: "space-between", gap: 16
                }}>
                  <button
                    disabled={currentChapterIndex <= 0}
                    onClick={handlePrevChapter}
                    style={{
                      display: "flex", alignItems: "center", gap: 8, padding: "10px 18px",
                      borderRadius: 10, border: `1px solid ${theme.sidebarBorder}`,
                      background: currentChapterIndex <= 0 ? "transparent" : theme.sidebarBg,
                      color: theme.text, fontWeight: 600, fontSize: 13, cursor: currentChapterIndex <= 0 ? "not-allowed" : "pointer",
                      opacity: currentChapterIndex <= 0 ? 0.35 : 1, transition: "all 0.15s"
                    }}
                    onMouseOver={(e) => {
                      if (currentChapterIndex > 0) e.currentTarget.style.background = theme.hoverItemBg;
                    }}
                    onMouseOut={(e) => {
                      if (currentChapterIndex > 0) e.currentTarget.style.background = theme.sidebarBg;
                    }}
                  >
                    <ChevronLeftIcon />
                    <span>Prev Chapter</span>
                  </button>

                  <button
                    disabled={currentChapterIndex >= sortedChapters.length - 1}
                    onClick={handleNextChapter}
                    style={{
                      display: "flex", alignItems: "center", gap: 8, padding: "10px 18px",
                      borderRadius: 10, border: `1px solid ${theme.sidebarBorder}`,
                      background: currentChapterIndex >= sortedChapters.length - 1 ? "transparent" : theme.sidebarBg,
                      color: theme.text, fontWeight: 600, fontSize: 13, cursor: currentChapterIndex >= sortedChapters.length - 1 ? "not-allowed" : "pointer",
                      opacity: currentChapterIndex >= sortedChapters.length - 1 ? 0.35 : 1, transition: "all 0.15s"
                    }}
                    onMouseOver={(e) => {
                      if (currentChapterIndex < sortedChapters.length - 1) e.currentTarget.style.background = theme.hoverItemBg;
                    }}
                    onMouseOut={(e) => {
                      if (currentChapterIndex < sortedChapters.length - 1) e.currentTarget.style.background = theme.sidebarBg;
                    }}
                  >
                    <span>Next Chapter</span>
                    <ChevronRightIcon />
                  </button>
                </div>
              </article>
            ) : (
              <div style={{ textAlign: "center", padding: "48px 0", opacity: 0.6 }}>No active chapter selected.</div>
            )}
          </div>
        </main>

      </div>
    </div>
  );
}
