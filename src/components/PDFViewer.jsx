import { useState, useEffect, useMemo } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import '../styles/pdf-viewer.css';

// Set up PDF.js worker from CDN with correct version
pdfjs.GlobalWorkerOptions.workerSrc = 'https://unpkg.com/pdfjs-dist@5.4.296/build/pdf.worker.min.mjs';

/**
 * PDFViewer Component
 * 
 * Props:
 * - pdfUrl: URL of the PDF file
 * - initialPage: Page number to start from (1-indexed)
 * - chapters: Array of chapter objects with {chapter_number, chapter_title, start_page, end_page}
 * - onPageChange: Callback when page changes (page, currentChapter)
 * - height: Container height (default: 80vh)
 */
export default function PDFViewer({ 
  pdfUrl, 
  initialPage = 1, 
  chapters = [],
  onPageChange,
  onDocumentLoad,
  height = '80vh'
}) {
  const [numPages, setNumPages] = useState(null);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [scale, setScale] = useState(1.0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Memoize options to prevent unnecessary reloads
  const documentOptions = useMemo(() => ({}), []);

  // Update page when initialPage changes (chapter navigation)
  useEffect(() => {
    if (initialPage !== currentPage) {
      setCurrentPage(initialPage);
    }
  }, [initialPage]);

  // Find current chapter based on page number
  const getCurrentChapter = (pageNum) => {
    return chapters.find(ch => 
      pageNum >= ch.start_page && pageNum <= ch.end_page
    );
  };

  // Notify parent when page changes
  useEffect(() => {
    if (onPageChange && numPages) {
      const currentChapter = getCurrentChapter(currentPage);
      onPageChange(currentPage, currentChapter);
    }
  }, [currentPage, numPages]);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setIsLoading(false);
    setError(null);
    
    // Notify parent component of total pages
    if (onDocumentLoad) {
      onDocumentLoad(numPages);
    }
  }

  function onDocumentLoadError(error) {
    setError('Failed to load PDF. Please try again.');
    setIsLoading(false);
  }

  const goToPrevPage = () => {
    setCurrentPage(prev => Math.max(1, prev - 1));
  };

  const goToNextPage = () => {
    setCurrentPage(prev => Math.min(numPages, prev + 1));
  };

  const goToPage = (pageNum) => {
    const page = Math.max(1, Math.min(numPages || 1, pageNum));
    setCurrentPage(page);
  };

  const zoomIn = () => setScale(prev => Math.min(2.0, prev + 0.1));
  const zoomOut = () => setScale(prev => Math.max(0.5, prev - 0.1));
  const resetZoom = () => setScale(1.0);

  const currentChapter = getCurrentChapter(currentPage);

  return (
    <div className="pdf-viewer-container" style={{ height }}>
      {/* Toolbar */}
      <div className="pdf-toolbar bg-[#002629] text-white p-3 flex items-center justify-between gap-4 rounded-t-xl sticky top-0 z-10">
        {/* Page Navigation */}
        <div className="flex items-center gap-2">
          <button
            onClick={goToPrevPage}
            disabled={currentPage <= 1}
            className="px-3 py-2 bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed rounded transition"
          >
            ←
          </button>
          
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="1"
              max={numPages || 1}
              value={currentPage}
              onChange={(e) => goToPage(parseInt(e.target.value) || 1)}
              className="w-16 px-2 py-1 bg-white/10 border border-white/20 rounded text-center"
            />
            <span className="text-sm">/ {numPages || '...'}</span>
          </div>

          <button
            onClick={goToNextPage}
            disabled={currentPage >= numPages}
            className="px-3 py-2 bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed rounded transition"
          >
            →
          </button>
        </div>

        {/* Current Chapter Info */}
        {currentChapter && (
          <div className="flex-1 text-center text-sm">
            <span className="font-semibold">Chapter {currentChapter.chapter_number}:</span>{' '}
            {currentChapter.chapter_title}
          </div>
        )}

        {/* Zoom Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={zoomOut}
            className="px-3 py-2 bg-white/10 hover:bg-white/20 rounded transition"
            title="Zoom Out"
          >
            −
          </button>
          <button
            onClick={resetZoom}
            className="px-3 py-2 bg-white/10 hover:bg-white/20 rounded transition text-xs"
            title="Reset Zoom"
          >
            {Math.round(scale * 100)}%
          </button>
          <button
            onClick={zoomIn}
            className="px-3 py-2 bg-white/10 hover:bg-white/20 rounded transition"
            title="Zoom In"
          >
            +
          </button>
        </div>
      </div>

      {/* PDF Document */}
      <div className="pdf-content bg-gray-100 p-4 overflow-auto" style={{ height: `calc(${height} - 60px)` }}>
        {isLoading && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#002629] mx-auto mb-4"></div>
              <p className="text-gray-600">Loading PDF...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="flex items-center justify-center h-full">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
              <p className="text-red-600">{error}</p>
            </div>
          </div>
        )}

        {!error && (
          <div className="flex justify-center">
            <Document
              file={pdfUrl}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={onDocumentLoadError}
              loading=""
              options={documentOptions}
            >
              <Page
                pageNumber={currentPage}
                scale={scale}
                renderTextLayer={true}
                renderAnnotationLayer={false}
                className="shadow-lg mx-auto"
                loading={
                  <div className="flex items-center justify-center p-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#002629]"></div>
                  </div>
                }
              />
            </Document>
          </div>
        )}
      </div>
    </div>
  );
}
