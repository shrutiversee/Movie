"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/lib/auth-context"
import { Search, Plus, LogOut, Film } from "lucide-react"

interface NavbarProps {
  onSearch?: (query: string) => void
  onAddMovie?: () => void
  searchQuery?: string
}

export function Navbar({ onSearch, onAddMovie, searchQuery = "" }: NavbarProps) {
  const { user, logout } = useAuth()
  const [search, setSearch] = useState(searchQuery)

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch?.(search)
  }

  const handleLogout = async () => {
    await logout()
    window.location.href = "/"
  }

  return (
    <nav className="bg-black/50 text-white border-b border-gray-700 sticky top-0 z-50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Film className="h-8 w-8 text-[#60eccb]" />
            <h1
  className="text-xl sm:text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#60eccb] to-[#a8b8ae]"
  style={{
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  }}
>
  Movie Collection
</h1>

          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-lg mx-4 hidden md:block">
            <form onSubmit={handleSearchSubmit} className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search movies..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 pr-4 rounded-xl bg-gray-800/70 text-white placeholder-gray-400 border border-gray-600 focus:ring-2 focus:ring-[#60eccb] focus:border-[#60eccb] safari-rounded"
              />
            </form>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Button
              onClick={onAddMovie}
              className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-[#60eccb] to-[#22c55e] text-black font-semibold hover:opacity-90 transition"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Add Movie</span>
            </Button>

            <div className="flex items-center space-x-2">
              <span className="text-xs sm:text-sm text-gray-300 hidden md:inline">{user?.email}</span>
              <Button
                size="sm"
                onClick={handleLogout}
                className="flex items-center space-x-1 rounded-xl bg-red-500/80 text-white hover:bg-red-600 transition"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile search bar */}
        <div className="mt-2 mb-3 md:hidden">
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search movies..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 rounded-xl bg-gray-800/70 text-white placeholder-gray-400 border border-gray-600 focus:ring-2 focus:ring-[#60eccb] focus:border-[#60eccb]"
            />
          </form>
        </div>
      </div>
    </nav>
  )
}
