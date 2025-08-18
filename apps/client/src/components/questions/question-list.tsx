'use client';

import { QuestionCard } from './question-card';
import { Button } from '@/components/ui';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Question, PaginatedResponse } from '@/types';

interface QuestionListProps {
  questions: Question[];
  pagination?: PaginatedResponse<Question>['pagination'];
  onPageChange?: (page: number) => void;
}

export function QuestionList({
  questions,
  pagination,
  onPageChange,
}: QuestionListProps) {

  console.log("questions",questions);
  if (!questions || questions.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold mb-2">No questions found</h3>
        <p className="text-muted-foreground">
          Try adjusting your search criteria or filters to find more questions.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Results Summary */}
      {pagination && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
            {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
            {pagination.total} questions
          </span>
          <span>
            Page {pagination.page} of {pagination.totalPages}
          </span>
        </div>
      )}

      {/* Question Cards */}
      <div className="space-y-4">
        {questions.map(question => (
          <QuestionCard key={question.id} question={question} />
        ))}
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange?.(pagination.page - 1)}
            disabled={!pagination.hasPrev}
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Previous
          </Button>

          {/* Page Numbers */}
          <div className="flex items-center gap-1">
            {getPageNumbers(pagination.page, pagination.totalPages).map(
              pageNum => (
                <Button
                  key={pageNum}
                  variant={pageNum === pagination.page ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => onPageChange?.(pageNum)}
                  className="w-8 h-8 p-0"
                >
                  {pageNum}
                </Button>
              )
            )}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange?.(pagination.page + 1)}
            disabled={!pagination.hasNext}
          >
            Next
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      )}
    </div>
  );
}

// Helper function to generate page numbers for pagination
function getPageNumbers(currentPage: number, totalPages: number): number[] {
  const pages: number[] = [];
  const maxVisiblePages = 5;

  if (totalPages <= maxVisiblePages) {
    // Show all pages if total is small
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    // Show pages around current page
    const startPage = Math.max(
      1,
      currentPage - Math.floor(maxVisiblePages / 2)
    );
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    // Adjust start if we're near the end
    const adjustedStart = Math.max(1, endPage - maxVisiblePages + 1);

    for (let i = adjustedStart; i <= endPage; i++) {
      pages.push(i);
    }
  }

  return pages;
}
