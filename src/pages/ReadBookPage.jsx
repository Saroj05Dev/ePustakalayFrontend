import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getAllBooks } from '../redux/slices/bookSlice';
import { getChaptersByBook } from '../redux/slices/chapterSlice';
import { getNotesByBookAndChapter, getAllNotes } from '../redux/slices/notesSlice';
import { getHighlightsByChapter } from '../redux/slices/highlightSlice';
import { exportBookNotes } from '../utils/exportNotes';
import PDFViewer from '../components/PDFViewer';
import ChapterNavigation from '../components/ChapterNavigation';
import StudyGuidePanel from '../components/StudyGuidePanel';
import toast from 'react-hot-toast';

const ArrowLeftIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);

const MenuIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const BookOpenIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
    <path d="M22 3h-6a4 4 0 0 1 3-3h7z" />
  </svg>
);

export default function ReadBookPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const books = useSelector((state) => state.books?.booksData || []);
  const chapters = useSelector((state) => state.chapter?.chaptersData || []);
  const notes = useSelector((state) => state.notes?.notesData || []);
  const highlights = useSelector((state) => state.highlights?.highlightsData || []);
  const isLoggedIn = useSelector((state) => state.auth?.isLoggedIn);

  const [currentPage, setCurrentPage] = useState(1);
  const [currentChapter, setCurrentChapter] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const [showChapters, setShowChapters] = useState(true);
  const [showStudyGuide, setShowStudyGuide] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Automatically fetch notes & highlights when book or current chapter changes
  useEffect(() => {
    if (id && currentChapter?._id) {
      dispatch(getNotesByBookAndChapter({ bookId: id, chapterId: currentChapter._id }));
      dispatch(getHighlightsByChapter({ bookId: id, chapterId: currentChapter._id }));
    } else if (id) {
      dispatch(getAllNotes());
    }
  }, [id, currentChapter?._id, dispatch]);

  const handleExportNotes = async () => {
    let activeNotes = notes;
    let activeHighlights = highlights;

    try {
      const res = await dispatch(getAllNotes()).unwrap();
      const allFetched = res?.data?.data || res?.data || [];
      if (Array.isArray(allFetched) && allFetched.length > 0) {
        const bookNotes = allFetched.filter(n => {
          const noteBookId = n.book && typeof n.book === 'object' ? n.book._id : n.book;
          return String(noteBookId) === String(id);
        });
        if (bookNotes.length > 0) {
          activeNotes = bookNotes;
        }
      }
    } catch (err) {
      // fallback
    }

    const sortedChapters = [...chapters].sort((a, b) => a.chapter_number - b.chapter_number);
    exportBookNotes({
      book,
      chapters: sortedChapters,
      notes: activeNotes,
      highlights: activeHighlights,
    });
  };

  // Get initial page and chapter from URL query params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const pageParam = params.get('page');
    const sorted = [...chapters].sort((a, b) => a.chapter_number - b.chapter_number);
    
    if (pageParam && pageParam !== 'undefined' && !isNaN(parseInt(pageParam))) {
      const pageNum = parseInt(pageParam);
      setCurrentPage(pageNum);
      
      // Find which chapter this page belongs to
      const chapter = sorted.find(ch => 
        ch.start_page && ch.end_page && 
        pageNum >= ch.start_page && pageNum <= ch.end_page
      );
      
      setCurrentChapter(chapter || null);
    } else {
      // No valid page specified, start at page 1 and find first chapter
      setCurrentPage(1);
      const firstChapter = sorted.find(ch => ch.start_page && ch.end_page);
      setCurrentChapter(firstChapter || null);
      
      // Update URL to show page 1
      const newParams = new URLSearchParams(location.search);
      newParams.set('page', '1');
      window.history.replaceState({}, '', `${location.pathname}?${newParams}`);
    }
  }, [location.search, chapters]);

  // Load book and chapters
  useEffect(() => {
    if (books.length === 0) {
      dispatch(getAllBooks()).then(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
    
    if (id) {
      dispatch(getChaptersByBook(id));
    }
  }, [id, dispatch, books.length]);

  // Check if user owns the book
  useEffect(() => {
    if (!isLoggedIn) {
      toast.error('Please login to read books');
      navigate('/login', { state: { from: location.pathname } });
    }
  }, [isLoggedIn, navigate, location.pathname]);

  const book = books.find((b) => b._id === id);

  // Handle chapter selection from sidebar
  const handleChapterSelect = (chapter) => {
    if (!chapter.start_page || !chapter.end_page) {
      return;
    }
    
    setCurrentPage(chapter.start_page);
    setCurrentChapter(chapter);
    
    // Update URL without reload
    const params = new URLSearchParams(location.search);
    params.set('page', chapter.start_page);
    window.history.replaceState({}, '', `${location.pathname}?${params}`);
  };

  // Handle page change from PDF viewer
  const handlePageChange = (page, chapter) => {
    setCurrentPage(page);
    setCurrentChapter(chapter || null);
    // Update URL
    const params = new URLSearchParams(location.search);
    params.set('page', page);
    window.history.replaceState({}, '', `${location.pathname}?${params}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#002629] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading book...</p>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Book Not Found</h2>
          <button
            onClick={() => navigate('/books')}
            className="px-6 py-3 bg-[#002629] text-white rounded-lg hover:bg-[#083d41] transition"
          >
            Browse Books
          </button>
        </div>
      </div>
    );
  }

  if (!book.file_url) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">PDF Not Available</h2>
          <p className="text-gray-600 mb-6">This book doesn't have a PDF file uploaded yet.</p>
          <button
            onClick={() => navigate(`/books/${id}`)}
            className="px-6 py-3 bg-[#002629] text-white rounded-lg hover:bg-[#083d41] transition"
          >
            Back to Book Details
          </button>
        </div>
      </div>
    );
  }

  // Sort chapters by chapter number
  const sortedChapters = [...chapters].sort((a, b) => a.chapter_number - b.chapter_number);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200 px-2 sm:px-4 py-2 sm:py-3 sticky top-0 z-20 shadow-sm">
        <div className="max-w-screen-2xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
          {/* Left: Back button + Toggle buttons */}
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => navigate(`/books/${id}`)}
              className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition text-xs sm:text-sm font-semibold text-gray-700"
            >
              <ArrowLeftIcon size={14} />
              <span className="hidden sm:inline">Back</span>
            </button>

            <button
              onClick={() => {
                setShowChapters(!showChapters);
                // On mobile, close study guide when opening chapters
                if (window.innerWidth < 768 && !showChapters) {
                  setShowStudyGuide(false);
                }
              }}
              className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 rounded-lg transition text-xs sm:text-sm font-semibold ${
                showChapters 
                  ? 'bg-[#002629] text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              title="Toggle Chapters"
            >
              <MenuIcon size={16} />
              <span className="hidden sm:inline">Chapters</span>
            </button>

            <button
              onClick={() => {
                setShowStudyGuide(!showStudyGuide);
                // On mobile, close chapters when opening study guide
                if (window.innerWidth < 768 && !showStudyGuide) {
                  setShowChapters(false);
                }
              }}
              className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 rounded-lg transition text-xs sm:text-sm font-semibold ${
                showStudyGuide 
                  ? 'bg-[#002629] text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              title="Toggle Study Guide"
            >
              <BookOpenIcon size={16} />
              <span className="hidden sm:inline">Study</span>
            </button>
          </div>

          {/* Center: Book title - hidden on small screens when panels are open */}
          <div className={`flex-1 text-center ${(showChapters || showStudyGuide) ? 'hidden lg:block' : 'hidden sm:block'}`}>
            <h1 className="font-bold text-sm sm:text-base lg:text-lg text-gray-800 truncate">{book.title}</h1>
            {book.author && (
              <p className="text-xs sm:text-sm text-gray-500 hidden md:block">{book.author}</p>
            )}
          </div>

          {/* Right: Export Notes button */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportNotes}
              className="flex items-center gap-1.5 px-3 py-1.5 sm:py-2 bg-[#002629] text-white hover:bg-[#083d41] rounded-lg transition text-xs sm:text-sm font-semibold shadow-xs cursor-pointer active:scale-95"
              title="Export Notes as TXT file"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              <span>Export Notes</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-screen-2xl mx-auto p-2 sm:p-4">
        <div className="flex flex-col lg:flex-row gap-2 sm:gap-4">
          {/* Left Sidebar - Chapters - Full width overlay on mobile, sidebar on desktop */}
          {showChapters && (
            <>
              {/* Mobile Overlay */}
              <div 
                className="fixed inset-0 bg-black/50 z-30 lg:hidden"
                onClick={() => setShowChapters(false)}
              />
              {/* Sidebar Content */}
              <div className={`
                fixed lg:relative top-0 left-0 h-full lg:h-auto
                w-full sm:w-80 lg:w-80 
                z-40 lg:z-auto
                bg-white lg:bg-transparent
                overflow-y-auto lg:overflow-visible
                transition-transform duration-300
                ${showChapters ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                lg:shrink-0
              `}>
                <div className="lg:sticky lg:top-24 h-full lg:h-auto">
                  {/* Mobile Close Button */}
                  <div className="lg:hidden sticky top-0 bg-white z-10 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                    <h2 className="font-bold text-lg text-gray-800">Chapters</h2>
                    <button
                      onClick={() => setShowChapters(false)}
                      className="p-2 hover:bg-gray-100 rounded-full transition"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  </div>
                  <ChapterNavigation
                    chapters={sortedChapters}
                    currentPage={currentPage}
                    onChapterSelect={(chapter) => {
                      handleChapterSelect(chapter);
                      // Close sidebar on mobile after selection
                      if (window.innerWidth < 1024) {
                        setShowChapters(false);
                      }
                    }}
                  />
                </div>
              </div>
            </>
          )}

          {/* Center - PDF Viewer */}
          <div className="flex-1 min-w-0">
            <PDFViewer
              pdfUrl={book.file_url}
              initialPage={currentPage}
              chapters={sortedChapters}
              onPageChange={handlePageChange}
              onDocumentLoad={(numPages) => setTotalPages(numPages)}
              height="calc(100vh - 100px)"
            />
          </div>

          {/* Right Sidebar - Study Guide - Full width overlay on mobile, sidebar on desktop */}
          {showStudyGuide && (
            <>
              {/* Mobile Overlay */}
              <div 
                className="fixed inset-0 bg-black/50 z-30 lg:hidden"
                onClick={() => setShowStudyGuide(false)}
              />
              {/* Sidebar Content */}
              <div className={`
                fixed lg:relative top-0 right-0 h-full lg:h-auto
                w-full sm:w-96 lg:w-96
                z-40 lg:z-auto
                bg-white lg:bg-transparent
                overflow-y-auto lg:overflow-visible
                transition-transform duration-300
                ${showStudyGuide ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
                lg:shrink-0
              `}>
                <div className="lg:sticky lg:top-24 lg:max-h-[calc(100vh-120px)] h-full lg:h-auto">
                  {/* Mobile Close Button */}
                  <div className="lg:hidden sticky top-0 bg-white z-10 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                    <h2 className="font-bold text-lg text-gray-800">Study Guide</h2>
                    <button
                      onClick={() => setShowStudyGuide(false)}
                      className="p-2 hover:bg-gray-100 rounded-full transition"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  </div>
                  <StudyGuidePanel
                    bookId={id}
                    currentChapter={currentChapter}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    chapters={sortedChapters}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
