import { useState } from 'react';

/**
 * ChapterNavigation Component
 * Sidebar for navigating between chapters
 * 
 * Props:
 * - chapters: Array of chapter objects
 * - currentPage: Current page number in PDF
 * - onChapterSelect: Callback when chapter is clicked (chapter)
 */
export default function ChapterNavigation({ chapters = [], currentPage, onChapterSelect }) {
  const [isExpanded, setIsExpanded] = useState(true);

  // Determine which chapter is currently active
  const getActiveChapter = () => {
    return chapters.find(ch => 
      currentPage >= ch.start_page && currentPage <= ch.end_page
    );
  };

  const activeChapter = getActiveChapter();

  if (chapters.length === 0) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <p className="text-gray-500 text-sm">No chapters available</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div 
        className="bg-[#002629] text-white p-4 flex items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h3 className="font-bold text-lg">Chapters</h3>
        <button className="text-white hover:text-gray-200 transition">
          {isExpanded ? '−' : '+'}
        </button>
      </div>

      {/* Chapter List */}
      {isExpanded && (
        <div className="max-h-[70vh] overflow-y-auto">
          {chapters.map((chapter, index) => {
            const isActive = activeChapter?._id === chapter._id;
            const pageCount = (chapter.start_page && chapter.end_page) 
              ? chapter.end_page - chapter.start_page + 1 
              : 0;
            
            return (
              <button
                key={chapter._id || index}
                onClick={() => {
                  if (chapter.start_page && chapter.end_page) {
                    onChapterSelect(chapter);
                  } else {
                    alert('This chapter does not have page numbers set. Please contact the admin to add page numbers for this chapter.');
                  }
                }}
                disabled={!chapter.start_page || !chapter.end_page}
                className={`
                  w-full text-left p-4 border-b border-gray-100 transition-all
                  ${(!chapter.start_page || !chapter.end_page) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50 cursor-pointer'}
                  ${isActive ? 'bg-[#e8f4f5] border-l-4 border-l-[#002629]' : ''}
                `}
              >
                <div className="flex items-start gap-3">
                  {/* Chapter Number Badge */}
                  <div 
                    className={`
                      w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm
                      ${isActive ? 'bg-[#002629] text-white' : 'bg-gray-100 text-gray-600'}
                    `}
                  >
                    {chapter.chapter_number}
                  </div>

                  {/* Chapter Info */}
                  <div className="flex-1 min-w-0">
                    <h4 
                      className={`
                        font-semibold text-sm mb-1 line-clamp-2
                        ${isActive ? 'text-[#002629]' : 'text-gray-800'}
                      `}
                    >
                      {chapter.chapter_title}
                    </h4>
                    
                    {chapter.description && (
                      <p className="text-xs text-gray-500 mb-2 line-clamp-2">
                        {chapter.description}
                      </p>
                    )}

                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      {chapter.start_page && chapter.end_page ? (
                        <>
                          <span>Pages {chapter.start_page}-{chapter.end_page}</span>
                          <span>•</span>
                          <span>{pageCount} pages</span>
                        </>
                      ) : (
                        <span>Page numbers not set</span>
                      )}
                      {chapter.duration_minutes && (
                        <>
                          <span>•</span>
                          <span>~{chapter.duration_minutes} min</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Active Indicator */}
                  {isActive && (
                    <div className="flex-shrink-0">
                      <div className="w-2 h-2 bg-[#002629] rounded-full animate-pulse"></div>
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
