import toast from "react-hot-toast";

/**
 * Exports the complete book notes including chapter metadata (pages, duration),
 * summaries, reading content, and user notes/highlights into a clean .txt file.
 */
export const exportBookNotes = ({ book, chapters = [], notes = [], highlights = [] }) => {
  const bookTitle = book?.title || "Book";
  const authorName = book?.author || "";
  const bookDesc = book?.description || "";
  const bookId = book?._id;

  // Filter notes and highlights for this specific book
  const filteredNotes = (notes || []).filter((n) => {
    if (!bookId) return true;
    const nBookId = n.book && typeof n.book === "object" ? n.book._id : (n.book || n.bookId || n.book_id);
    if (!nBookId) return true;
    return String(nBookId) === String(bookId);
  });

  const filteredHighlights = (highlights || []).filter((h) => {
    if (!bookId) return true;
    const hBookId = h.book && typeof h.book === "object" ? h.book._id : (h.book || h.bookId || h.book_id);
    if (!hBookId) return true;
    return String(hBookId) === String(bookId);
  });

  // Sort chapters by chapter number
  const sortedChapters = [...(chapters || [])].sort(
    (a, b) => (a.chapter_number || 0) - (b.chapter_number || 0)
  );

  let content = `================================================================================\n`;
  content += `                           ePustakalay - Full Book Notes\n`;
  content += `================================================================================\n`;
  content += `Book Title       : ${bookTitle}\n`;
  if (authorName) {
    content += `Author           : ${authorName}\n`;
  }
  if (sortedChapters.length > 0) {
    content += `Total Chapters   : ${sortedChapters.length}\n`;
  }
  content += `User Notes Count : ${filteredNotes.length}\n`;
  if (filteredHighlights.length > 0) {
    content += `Highlights Count : ${filteredHighlights.length}\n`;
  }
  content += `Export Date      : ${new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })}\n`;
  content += `================================================================================\n\n`;

  // Book Overview Section
  if (bookDesc && bookDesc.trim()) {
    content += `================================================================================\n`;
    content += `                                 BOOK OVERVIEW\n`;
    content += `================================================================================\n\n`;
    content += `${bookDesc.trim()}\n\n`;
  }

  // Chapter-by-Chapter Content & Notes Section
  if (sortedChapters.length > 0) {
    content += `================================================================================\n`;
    content += `                         CHAPTER-BY-CHAPTER COMPLETE NOTES\n`;
    content += `================================================================================\n\n`;

    sortedChapters.forEach((ch, idx) => {
      const chNum = ch.chapter_number || idx + 1;
      const chTitle = ch.chapter_title || ch.title || `Chapter ${chNum}`;
      const startPg = ch.start_page;
      const endPg = ch.end_page;
      const pageCount = (startPg && endPg) ? (endPg - startPg + 1) : 0;
      const duration = ch.duration_minutes || ch.read_time;

      content += `--------------------------------------------------------------------------------\n`;
      content += `CHAPTER ${chNum}: ${chTitle.toUpperCase()}\n`;
      if (startPg && endPg) {
        content += `Page Range     : Pg ${startPg} - ${endPg}\n`;
        content += `Total Pages    : ${pageCount} pages\n`;
      } else if (startPg) {
        content += `Page           : Pg ${startPg}\n`;
      }
      if (duration) {
        content += `Est. Read Time : ~${duration} min\n`;
      }
      content += `--------------------------------------------------------------------------------\n\n`;

      // Description / Summary
      if (ch.description && ch.description.trim()) {
        content += `[ Overview / Summary ]\n`;
        content += `${ch.description.trim()}\n\n`;
      }

      // Reading Content / Text (if distinct from description)
      const chContentText = ch.chapter_content || ch.content || ch.context || "";
      if (chContentText && chContentText.trim() && chContentText.trim() !== ch.description?.trim()) {
        content += `[ Chapter Reading Content / Notes ]\n`;
        content += `${chContentText.trim()}\n\n`;
      }

      // Find user notes for this chapter
      const chNotes = filteredNotes.filter((n) => {
        const nChId = n.chapter && typeof n.chapter === "object" ? n.chapter._id : n.chapter || n.chapterId;
        if (nChId && ch._id && String(nChId) === String(ch._id)) return true;
        if (
          startPg &&
          endPg &&
          n.pageNumber &&
          n.pageNumber >= startPg &&
          n.pageNumber <= endPg
        ) {
          return true;
        }
        return false;
      });

      if (chNotes.length > 0) {
        content += `[ User Personal Notes (${chNotes.length}) ]\n`;
        chNotes.forEach((n, nIdx) => {
          const pageNum = n.pageNumber || n.page_number || n.page;
          const dateStr = n.createdAt || n.created_at
            ? new Date(n.createdAt || n.created_at).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })
            : "";
          content += `  * Note #${nIdx + 1}${pageNum ? ` (Page ${pageNum})` : ""}${dateStr ? ` [${dateStr}]` : ""}:\n`;
          if (n.selectedText || n.selected_text || n.highlightText) {
            const quote = n.selectedText || n.selected_text || n.highlightText;
            content += `    Quote: "${quote.trim()}"\n`;
          }
          const noteText = n.noteText || n.text || n.content || n.note || "";
          if (noteText) {
            content += `    Note : ${noteText.trim()}\n`;
          }
          content += `\n`;
        });
      }

      // Find user highlights for this chapter
      const chHighlights = filteredHighlights.filter((h) => {
        const hChId = h.chapter && typeof h.chapter === "object" ? h.chapter._id : h.chapter || h.chapterId;
        if (hChId && ch._id && String(hChId) === String(ch._id)) return true;
        if (
          startPg &&
          endPg &&
          h.pageNumber &&
          h.pageNumber >= startPg &&
          h.pageNumber <= endPg
        ) {
          return true;
        }
        return false;
      });

      if (chHighlights.length > 0) {
        content += `[ User Highlights (${chHighlights.length}) ]\n`;
        chHighlights.forEach((h, hIdx) => {
          const pageNum = h.pageNumber || h.page_number || h.page;
          const hlText = h.text || h.selectedText || h.selected_text || "";
          content += `  * Highlight #${hIdx + 1}${pageNum ? ` (Page ${pageNum})` : ""}:\n`;
          content += `    "${hlText.trim()}"\n\n`;
        });
      }

      content += `\n`;
    });
  } else if (filteredNotes.length > 0) {
    // If no chapters structure exists but user notes exist
    content += `================================================================================\n`;
    content += `                                  YOUR NOTES (${filteredNotes.length})\n`;
    content += `================================================================================\n\n`;

    filteredNotes.forEach((n, idx) => {
      const pageNum = n.pageNumber || n.page_number || n.page;
      const dateStr = n.createdAt || n.created_at
        ? new Date(n.createdAt || n.created_at).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })
        : "";

      content += `Note #${idx + 1}${pageNum ? ` (Page ${pageNum})` : ""}${dateStr ? ` [${dateStr}]` : ""}\n`;
      if (n.selectedText || n.selected_text || n.highlightText) {
        const textQuote = n.selectedText || n.selected_text || n.highlightText;
        content += `  Selected Quote:\n    "${textQuote.trim()}"\n`;
      }
      const noteBody = n.noteText || n.text || n.content || n.note || "";
      if (noteBody) {
        content += `  Note Content:\n    ${noteBody.trim()}\n`;
      }
      content += `\n`;
    });
  }

  // Standalone Highlights Section (if any remaining)
  if (filteredHighlights.length > 0) {
    content += `================================================================================\n`;
    content += `                               ALL HIGHLIGHTS (${filteredHighlights.length})\n`;
    content += `================================================================================\n\n`;

    filteredHighlights.forEach((h, idx) => {
      const pageNum = h.pageNumber || h.page_number || h.page;
      const hlText = h.text || h.selectedText || h.selected_text || "";

      content += `${idx + 1}. ${pageNum ? `[Page ${pageNum}] ` : ""}"${hlText.trim()}"\n\n`;
    });
  }

  content += `================================================================================\n`;
  content += `                     Thank you for reading with ePustakalay\n`;
  content += `================================================================================\n`;

  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  const sanitizedTitle = bookTitle.replace(/[^a-zA-Z0-9\s_-]/g, "").trim();
  const fileName = `${sanitizedTitle || "Book"} Notes.txt`;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  toast.success(`Full book notes exported successfully as ${fileName}`);
  return true;
};
