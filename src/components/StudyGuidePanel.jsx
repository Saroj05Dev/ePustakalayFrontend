import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  getNotesByBookAndChapter,
  createNote,
  deleteNote,
} from '../redux/slices/notesSlice';
import {
  getHighlightsByChapter,
  createHighlight,
  deleteHighlight,
} from '../redux/slices/highlightSlice';
import {
  getBookmarkByBook,
  createBookmark,
  deleteBookmark,
} from '../redux/slices/bookmarkSlice';
import {
  getBookProgress,
  createReadingProgress,
  updateReadingProgress,
} from '../redux/slices/progressSlice';

// Icons
const NoteIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
  </svg>
);

const HighlightIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M15.232 5.232l3.536 3.536-9.192 9.192-3.89.975.974-3.89 8.572-8.813zm1.414-1.414a2 2 0 0 1 2.828 0l.708.708a2 2 0 0 1 0 2.828L7.757 20.09a1 1 0 0 1-.44.263l-5 1.25a1 1 0 0 1-1.22-1.22l1.25-5a1 1 0 0 1 .263-.44L16.646 3.818z"/>
  </svg>
);

const BookmarkIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
  </svg>
);

const TrashIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
  </svg>
);

const PlusIcon = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

export default function StudyGuidePanel({ bookId, currentChapter, currentPage, totalPages, chapters }) {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState('notes');
  const [noteText, setNoteText] = useState('');
  const [showAddNote, setShowAddNote] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const [showHighlightPicker, setShowHighlightPicker] = useState(false);
  const [highlightColor, setHighlightColor] = useState('yellow');

  const notes = useSelector((state) => state.notes?.notesData || []);
  const highlights = useSelector((state) => state.highlights?.highlightsData || []);
  const bookmarks = useSelector((state) => state.bookmarks?.bookmarksData || []);
  const progress = useSelector((state) => state.progress?.currentProgress);

  const highlightColors = {
    yellow: { bg: '#fff3c4', border: '#f5c842', name: 'Yellow' },
    pink: { bg: '#fce8e8', border: '#f08080', name: 'Pink' },
    green: { bg: '#e6f4ea', border: '#5cb85c', name: 'Green' },
    blue: { bg: '#e8f0fe', border: '#4a90d9', name: 'Blue' },
  };

  // Load data when chapter changes
  useEffect(() => {
    if (bookId && currentChapter) {
      dispatch(getNotesByBookAndChapter({ bookId, chapterId: currentChapter._id }));
      dispatch(getHighlightsByChapter({ bookId, chapterId: currentChapter._id }));
    }
    if (bookId) {
      dispatch(getBookmarkByBook(bookId));
      dispatch(getBookProgress(bookId));
    }
  }, [bookId, currentChapter, dispatch]);

  // Update reading progress based on current page and total pages
  useEffect(() => {
    if (bookId && currentChapter && currentPage && totalPages && chapters.length > 0) {
      // Calculate progress percentage based on page number
      const progressPercentage = Math.round((currentPage / totalPages) * 100);
      
      // Calculate chapter index (for chapter-based progress)
      const chapterIndex = chapters.findIndex(ch => ch._id === currentChapter._id);
      const chapterProgress = chapterIndex >= 0 
        ? Math.round(((chapterIndex + 1) / chapters.length) * 100)
        : 0;

      // Use page-based progress (more accurate)
      const finalProgress = progressPercentage;

      // Only update if progress exists or create new one
      if (progress) {
        dispatch(updateReadingProgress({
          id: progress._id,
          data: {
            chapter: currentChapter._id,
            pageNumber: currentPage,
            progress: finalProgress,
            lastReadAt: new Date().toISOString(),
          }
        }));
      } else {
        // Create new progress entry
        dispatch(createReadingProgress({
          book: bookId,
          chapter: currentChapter._id,
          pageNumber: currentPage,
          progress: finalProgress,
        }));
      }
    }
  }, [currentPage, currentChapter, bookId, totalPages, chapters.length, dispatch]);

  // Text selection handler for highlighting - PDF only
  useEffect(() => {
    let selectionTimeout;

    const handleSelection = () => {
      // Clear any existing timeout
      if (selectionTimeout) {
        clearTimeout(selectionTimeout);
      }

      // Wait a bit for selection to complete
      selectionTimeout = setTimeout(() => {
        const selection = window.getSelection();
        const text = selection?.toString().trim();
        
        // Check if selection is within PDF text layer
        const anchorNode = selection?.anchorNode;
        const isPdfSelection = anchorNode && 
          (anchorNode.parentElement?.closest('.react-pdf__Page__textContent') !== null ||
           anchorNode.parentNode?.closest('.react-pdf__Page__textContent') !== null);
        
        // If no text selected, clear the picker
        if (!text || text.length === 0) {
          if (showHighlightPicker) {
            setShowHighlightPicker(false);
            setSelectedText('');
          }
          return;
        }
        
        // If selection is not from PDF, ignore it silently
        if (!isPdfSelection) {
          return;
        }
        
        // Check text length constraints
        if (text.length < 3) {
          return;
        }
        
        if (text.length > 500) {
          toast.error('Please select less than 500 characters');
          return;
        }
        
        // Valid PDF selection - show picker
        setSelectedText(text);
        setShowHighlightPicker(true);
      }, 150);
    };

    // Listen to multiple events for better capture
    const events = ['mouseup', 'touchend'];
    
    events.forEach(event => {
      document.addEventListener(event, handleSelection);
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleSelection);
      });
      if (selectionTimeout) {
        clearTimeout(selectionTimeout);
      }
    };
  }, [showHighlightPicker]);

  const handleAddNote = async () => {
    if (!noteText.trim()) {
      toast.error('Please enter note text');
      return;
    }

    try {
      await dispatch(createNote({
        book: bookId,
        chapter: currentChapter?._id,
        noteText: noteText.trim(),
        pageNumber: currentPage,
      })).unwrap();
      
      setNoteText('');
      setShowAddNote(false);
      toast.success('Note added!');
    } catch (error) {
      toast.error('Failed to add note');
    }
  };

  const handleDeleteNote = async (noteId) => {
    if (window.confirm('Delete this note?')) {
      try {
        await dispatch(deleteNote(noteId)).unwrap();
        toast.success('Note deleted');
        // Refresh notes
        if (bookId && currentChapter) {
          dispatch(getNotesByBookAndChapter({ bookId, chapterId: currentChapter._id }));
        }
      } catch (error) {
        toast.error('Failed to delete note');
      }
    }
  };

  const handleAddHighlight = async () => {
    if (!selectedText || selectedText.length < 3) {
      toast.error('Please select at least 3 characters of text');
      return;
    }

    if (!currentChapter) {
      toast.error('Please navigate to a chapter first');
      return;
    }

    try {
      await dispatch(createHighlight({
        book: bookId,
        chapter: currentChapter._id,
        text: selectedText,
        color: highlightColor,
        pageNumber: currentPage,
      })).unwrap();
      
      toast.success('Text highlighted!');
      setSelectedText('');
      setShowHighlightPicker(false);
      
      // Clear selection
      window.getSelection().removeAllRanges();
      
      // Refresh highlights
      dispatch(getHighlightsByChapter({ bookId, chapterId: currentChapter._id }));
    } catch (error) {
      toast.error('Failed to add highlight: ' + (error.message || 'Unknown error'));
    }
  };

  const handleDeleteHighlight = async (highlightId) => {
    try {
      await dispatch(deleteHighlight(highlightId)).unwrap();
      toast.success('Highlight removed');
      // Refresh highlights
      if (currentChapter) {
        dispatch(getHighlightsByChapter({ bookId, chapterId: currentChapter._id }));
      }
    } catch (error) {
      toast.error('Failed to delete highlight');
    }
  };

  const handleToggleBookmark = async () => {
    if (!currentChapter) {
      toast.error('Please select a chapter first');
      return;
    }

    const existing = bookmarks.find(b => 
      (b.chapter?._id || b.chapter) === currentChapter._id
    );

    try {
      if (existing) {
        await dispatch(deleteBookmark(existing._id)).unwrap();
        toast.success('Bookmark removed');
      } else {
        await dispatch(createBookmark({
          book: bookId,
          chapter: currentChapter._id,
        })).unwrap();
        toast.success('Chapter bookmarked!');
      }
      
      // Refresh bookmarks
      dispatch(getBookmarkByBook(bookId));
    } catch (error) {
      toast.error(existing ? 'Failed to remove bookmark' : 'Failed to add bookmark');
    }
  };

  const isChapterBookmarked = () => {
    if (!currentChapter) return false;
    return bookmarks.some(b => 
      (b.chapter?._id || b.chapter) === currentChapter._id
    );
  };

  const tabs = [
    { id: 'notes', label: 'Notes', icon: <NoteIcon size={14} /> },
    { id: 'highlights', label: 'Highlights', icon: <HighlightIcon size={14} /> },
    { id: 'bookmarks', label: 'Bookmarks', icon: <BookmarkIcon size={16} /> },
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden h-full flex flex-col">
      {/* Header */}
      <div className="bg-[#002629] text-white p-4">
        <h3 className="text-lg font-bold mb-1">Study Guide</h3>
        <p className="text-xs text-gray-300">
          Notes, highlights and bookmarks
        </p>
      </div>

      {/* Progress Bar */}
      {progress && totalPages > 0 && (
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-600">Reading Progress</span>
            <span className="text-xs font-bold text-[#002629]">{progress.progress || 0}%</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#1a6b70] transition-all duration-300"
              style={{ width: `${progress.progress || 0}%` }}
            />
          </div>
          <div className="flex items-center justify-between mt-1">
            <span className="text-xs text-gray-500">Page {currentPage} of {totalPages}</span>
          </div>
        </div>
      )}

      {/* Highlight Selection Picker */}
      {showHighlightPicker && (
        <div className="px-4 py-3 bg-[#fffef8] border-b border-[#f5c842]">
          {selectedText ? (
            <>
              <div className="mb-2">
                <p className="text-xs font-semibold text-gray-600 mb-1">Selected text:</p>
                <p className="text-xs text-gray-800 italic line-clamp-2 bg-green-50 p-2 rounded border border-green-200">
                  &ldquo;{selectedText}&rdquo;
                </p>
              </div>
              
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-semibold text-gray-600">Color:</span>
                {Object.entries(highlightColors).map(([key, color]) => (
                  <button
                    key={key}
                    onClick={() => setHighlightColor(key)}
                    className={`w-6 h-6 rounded-full border-2 transition ${
                      highlightColor === key ? 'ring-2 ring-offset-1 ring-[#002629] scale-110' : ''
                    }`}
                    style={{ 
                      backgroundColor: color.bg,
                      borderColor: color.border,
                    }}
                    title={color.name}
                  />
                ))}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleAddHighlight}
                  disabled={!selectedText}
                  className="flex-1 px-3 py-2 bg-[#002629] text-white rounded font-semibold text-xs hover:bg-[#083d41] transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add Highlight
                </button>
                <button
                  onClick={() => {
                    setShowHighlightPicker(false);
                    setSelectedText('');
                    window.getSelection().removeAllRanges();
                  }}
                  className="px-3 py-2 bg-gray-200 text-gray-700 rounded font-semibold text-xs hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-4">
              <p className="text-xs text-yellow-700 font-semibold mb-2">
                👆 Please select some text in the PDF
              </p>
              <p className="text-xs text-gray-600">
                Click and drag over text to highlight it
              </p>
            </div>
          )}
        </div>
      )}

      {/* Bookmark Toggle */}
      {currentChapter && (
        <div className="px-4 py-3 border-b border-gray-200">
          <button
            onClick={handleToggleBookmark}
            className={`w-full px-4 py-2 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition ${
              isChapterBookmarked()
                ? 'bg-[#002629] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <BookmarkIcon size={16} />
            {isChapterBookmarked() ? 'Chapter Bookmarked ✓' : 'Bookmark This Chapter'}
          </button>
          <p className="text-xs text-gray-500 text-center mt-2">
            Bookmarks save the current chapter for quick access
          </p>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-gray-200 px-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition ${
              activeTab === tab.id
                ? 'border-[#002629] text-[#002629]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Notes Tab */}
        {activeTab === 'notes' && (
          <div className="space-y-3">
            {notes.length === 0 && !showAddNote && (
              <div className="text-center py-12 text-gray-400">
                <NoteIcon size={48} />
                <p className="mt-4 text-sm">No notes yet</p>
              </div>
            )}

            {notes.map((note) => (
              <div key={note._id} className="bg-[#fffef8] border border-[#f5c842] rounded-lg p-3">
                <div className="flex items-start justify-between mb-2">
                  <span className="text-xs font-semibold text-gray-500">Page {note.pageNumber || '?'}</span>
                  <button
                    onClick={() => handleDeleteNote(note._id)}
                    className="text-red-500 hover:text-red-700 transition"
                  >
                    <TrashIcon size={12} />
                  </button>
                </div>
                <p className="text-sm text-gray-800">{note.noteText}</p>
                {note.selectedText && (
                  <div className="mt-2 pt-2 border-t border-gray-200">
                    <p className="text-xs text-gray-500 italic">&ldquo;{note.selectedText}&rdquo;</p>
                  </div>
                )}
              </div>
            ))}

            {showAddNote && (
              <div className="bg-white border-2 border-[#002629] rounded-lg p-3">
                <textarea
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="Write your note here..."
                  className="w-full p-2 border border-gray-300 rounded text-sm resize-none"
                  rows="4"
                  autoFocus
                />
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={handleAddNote}
                    className="flex-1 px-4 py-2 bg-[#002629] text-white rounded font-semibold text-sm hover:bg-[#083d41] transition"
                  >
                    Save Note
                  </button>
                  <button
                    onClick={() => { setShowAddNote(false); setNoteText(''); }}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded font-semibold text-sm hover:bg-gray-300 transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Highlights Tab */}
        {activeTab === 'highlights' && (
          <div className="space-y-3">
            {!showHighlightPicker && highlights.length === 0 && (
              <div className="text-center py-12 text-gray-400">
                <HighlightIcon size={48} />
                <p className="mt-4 text-sm font-semibold">No highlights yet</p>
                <p className="text-xs mt-2 px-4">
                  💡 <strong>How to highlight:</strong>
                  <br />
                  1. Select text in the PDF
                  <br />
                  2. Choose a color
                  <br />
                  3. Click "Add Highlight"
                </p>
              </div>
            )}

            {showHighlightPicker && !selectedText && (
              <div className="text-center py-8 px-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <p className="text-sm text-yellow-800">
                  👆 <strong>Select some text</strong> in the PDF above to highlight it
                </p>
              </div>
            )}

            {highlights.map((highlight) => (
              <div 
                key={highlight._id} 
                className="rounded-lg p-3 border"
                style={{
                  backgroundColor: highlightColors[highlight.color]?.bg || '#fff3c4',
                  borderColor: highlightColors[highlight.color]?.border || '#f5c842',
                }}
              >
                <p className="text-sm text-gray-800 font-semibold mb-2">&ldquo;{highlight.text}&rdquo;</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">Page {highlight.pageNumber || '?'}</span>
                    {highlight.chapter?.chapter_number && (
                      <>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-gray-500">Ch. {highlight.chapter.chapter_number}</span>
                      </>
                    )}
                  </div>
                  <button
                    onClick={() => handleDeleteHighlight(highlight._id)}
                    className="text-red-500 hover:text-red-700 transition"
                  >
                    <TrashIcon size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bookmarks Tab */}
        {activeTab === 'bookmarks' && (
          <div className="space-y-3">
            {bookmarks.length === 0 && (
              <div className="text-center py-12 text-gray-400">
                <BookmarkIcon size={48} />
                <p className="mt-4 text-sm">No bookmarks yet</p>
              </div>
            )}

            {bookmarks.map((bookmark) => (
              <div key={bookmark._id} className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm text-gray-800 mb-1">
                      {bookmark.chapter?.chapter_title || 'Unknown chapter'}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <span>Chapter {bookmark.chapter?.chapter_number || '?'}</span>
                      {bookmark.chapter?.start_page && (
                        <>
                          <span>•</span>
                          <span>Pages {bookmark.chapter.start_page}-{bookmark.chapter.end_page}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => dispatch(deleteBookmark(bookmark._id))}
                    className="text-red-500 hover:text-red-700 transition"
                  >
                    <TrashIcon size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Note Button */}
      {activeTab === 'notes' && !showAddNote && (
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={() => setShowAddNote(true)}
            className="w-full px-4 py-3 bg-[#002629] text-white rounded-lg font-semibold hover:bg-[#083d41] transition flex items-center justify-center gap-2"
          >
            <PlusIcon size={16} />
            Add Note
          </button>
        </div>
      )}
    </div>
  );
}
