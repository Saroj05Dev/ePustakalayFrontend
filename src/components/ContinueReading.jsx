import { useNavigate } from "react-router-dom";

// Icons
const BookOpenIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

function ContinueReadingCard({ item }) {
  const navigate = useNavigate();
  
  const bookId = item.book?._id || item.book;
  const bookTitle = item.book?.title || "Untitled";
  const bookCover = item.book?.cover_image || "";
  const progress = Math.round(item.progress || 0);
  const chapterTitle = item.chapter?.chapter_title || "";
  const chapterNumber = item.chapter?.chapter_number || "";
  const currentPage = item.current_page || 1;

  const handleResume = () => {
    // Navigate to reading page with the saved page number
    navigate(`/books/${bookId}/read?page=${currentPage}`);
  };

  return (
    <div className="group bg-white rounded-xl p-4 hover:shadow-xl hover:shadow-black/5 transition-all duration-300 flex gap-4 min-w-[300px] max-w-[350px]">
      {/* Book Cover */}
      <div className="w-16 h-20 rounded-lg overflow-hidden shadow-md bg-[#ebeef4] flex-shrink-0">
        {bookCover ? (
          <img
            src={bookCover}
            alt={bookTitle}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#083d41]">
            <BookOpenIcon />
          </div>
        )}
      </div>

      {/* Book Info */}
      <div className="flex-1 flex flex-col justify-between min-w-0">
        <div>
          <h3 className="font-bold text-[#002629] text-sm line-clamp-1 mb-1">
            {bookTitle}
          </h3>
          {chapterTitle && (
            <p className="text-xs text-[#404849] line-clamp-1 mb-1">
              Chapter {chapterNumber}: {chapterTitle}
            </p>
          )}
          {currentPage > 1 && (
            <p className="text-[10px] text-gray-500">
              Page {currentPage}
            </p>
          )}
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#083d41]">
              {progress}%
            </span>
          </div>
          <div className="w-full bg-[#e5e8ee] rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-[#002629] to-[#083d41] h-full rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Resume Button */}
          <button
            onClick={handleResume}
            className="mt-2 w-full px-3 py-1.5 bg-[#002629] text-white text-xs font-semibold rounded-lg hover:bg-[#083d41] transition-colors flex items-center justify-center gap-2 group-hover:gap-3 cursor-pointer"
          >
            Resume
            <ArrowRightIcon />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ContinueReading({ continueReadingData }) {
  if (!continueReadingData || continueReadingData.length === 0) {
    return null;
  }

  return (
    <section className="py-12 md:py-16 px-4 md:px-6 lg:px-12 max-w-screen-2xl mx-auto bg-[#f7f9ff]">
      <div className="mb-6">
        <h2 className="hp-headline text-2xl md:text-3xl font-bold tracking-tight text-[#002629] mb-2">
          Continue Reading
        </h2>
        <p className="text-[#404849] text-sm md:text-base">
          Pick up where you left off
        </p>
      </div>

      {/* Horizontal Scrollable Cards */}
      <div className="overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
        <div className="flex gap-4">
          {continueReadingData.map((item) => (
            <ContinueReadingCard key={item._id} item={item} />
          ))}
        </div>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
}
