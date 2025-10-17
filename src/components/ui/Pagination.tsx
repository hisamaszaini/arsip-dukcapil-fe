import * as React from 'react';
import type { PaginationMeta } from '../../types/api.types';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './Button';

interface PaginationProps {
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
  currentItemCount: number;
}

export const Pagination: React.FC<PaginationProps> = ({ meta, onPageChange, currentItemCount }) => {
  if (!meta || meta.totalPages <= 1) {
    return null;
  }

  const currentPage = Number(meta.page);
  const totalPages = meta.totalPages;

  // Generate page numbers (with ellipsis if too many pages)
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }

    return pages;
  };

  return (
    <div className="mt-4 p-4 flex justify-between items-center text-sm text-gray-600">
      <span>
        Menampilkan {(meta.page - 1) * meta.limit + 1} – {currentItemCount} dari {meta.total} data.
      </span>
      <div className="flex items-center gap-2">
        {/* Previous Button */}
        <Button size="icon" variant="outline" disabled={currentPage <= 1} onClick={() => onPageChange(currentPage - 1)}>
          <ChevronLeft size={16} />
        </Button>

        {/* Page Numbers */}
        {getPageNumbers().map((page, idx) =>
          typeof page === 'number' ? (
            <button
              key={idx}
              onClick={() => onPageChange(page)}
              className={`px-3 py-1 rounded-md text-sm font-medium transition ${
                page === currentPage ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              {page}
            </button>
          ) : (
            <span key={idx} className="px-2 text-gray-400">
              {page}
            </span>
          )
        )}

        {/* Next Button */}
        <Button
          size="icon"
          variant="outline"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          <ChevronRight size={16} />
        </Button>
      </div>
    </div>
  );
};

export default Pagination;