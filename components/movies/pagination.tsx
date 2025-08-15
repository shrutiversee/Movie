"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface PaginationProps {
  currentPage: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
  onPageChange: (page: number) => void
}

export function Pagination({
  currentPage,
  totalPages,
  hasNext,
  hasPrev,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null

  const getPageNumbers = () => {
    const pages = []
    const maxVisible = 5

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i)
        pages.push("…")
        pages.push(totalPages)
      } else if (currentPage >= totalPages - 2) {
        pages.push(1)
        pages.push("…")
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i)
      } else {
        pages.push(1)
        pages.push("…")
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i)
        pages.push("…")
        pages.push(totalPages)
      }
    }

    return pages
  }

  return (
    <div
      className="flex flex-wrap items-center justify-center gap-2 mt-10"
      style={{ WebkitFlex: "1 0 auto" }} // ✅ Safari fix
    >
      {/* Prev */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!hasPrev}
        className="flex items-center gap-1 rounded-full border-gray-300 dark:border-gray-700 
                   bg-white dark:bg-gray-900 hover:bg-indigo-50 dark:hover:bg-indigo-900 
                   disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="hidden sm:inline">Previous</span>
      </Button>

      {/* Page numbers */}
      <div className="flex flex-wrap items-center gap-1">
        {getPageNumbers().map((page, i) =>
          page === "…" ? (
            <span
              key={`ellipsis-${i}`}
              className="px-3 py-2 text-gray-400 dark:text-gray-500"
            >
              …
            </span>
          ) : (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              size="sm"
              onClick={() => onPageChange(page as number)}
              className={`min-w-[40px] rounded-full transition-colors ${
                currentPage === page
                  ? "bg-indigo-600 text-white hover:bg-indigo-700"
                  : "border-gray-300 dark:border-gray-700 hover:bg-indigo-50 dark:hover:bg-indigo-900"
              }`}
            >
              {page}
            </Button>
          )
        )}
      </div>

      {/* Next */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!hasNext}
        className="flex items-center gap-1 rounded-full border-gray-300 dark:border-gray-700 
                   bg-white dark:bg-gray-900 hover:bg-indigo-50 dark:hover:bg-indigo-900 
                   disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className="hidden sm:inline">Next</span>
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}
