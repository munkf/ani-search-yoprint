import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PaginationProps {
  current: number;
  totalPages: number;
  onChange: (page: number) => void;
}

export const Pagination = ({ current, totalPages, onChange }: PaginationProps) => {
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    
    if (current <= 3) {
      pages.push(1, 2, 3, 4, '...', totalPages);
    } else if (current >= totalPages - 2) {
      pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
    } else {
      pages.push(1, '...', current - 1, current, current + 1, '...', totalPages);
    }
    
    return pages;
  };

  const pages = getPageNumbers();

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <Button
        variant="outline"
        size="icon"
        onClick={() => onChange(current - 1)}
        disabled={current === 1}
        className="h-10 w-10"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      
      {pages.map((page, index) => (
        typeof page === 'number' ? (
          <Button
            key={index}
            variant={current === page ? "default" : "outline"}
            onClick={() => onChange(page)}
            className="h-10 w-10"
          >
            {page}
          </Button>
        ) : (
          <span key={index} className="px-2 text-muted-foreground">
            {page}
          </span>
        )
      ))}
      
      <Button
        variant="outline"
        size="icon"
        onClick={() => onChange(current + 1)}
        disabled={current === totalPages}
        className="h-10 w-10"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};
