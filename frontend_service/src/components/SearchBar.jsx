import { useState } from 'react'

export default function SearchBar({ onSearch, onGenerate }) {
  const [query, setQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!query.trim() || isLoading) return

    setIsLoading(true)
    try {
      if (onSearch) {
        await onSearch(query.trim())
      }
      setQuery('')
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGenerate = () => {
    if (onGenerate) {
      onGenerate()
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto mb-8">
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex items-center bg-bg-secondary border border-border-color rounded-full px-6 py-4 transition-all duration-200 focus-within:border-border-hover focus-within:ring-2 focus-within:ring-white/10">
          {/* Search Icon */}
          <svg
            className="w-5 h-5 text-text-secondary mr-4 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>

          {/* Input */}
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Изучить..."
            className="flex-1 bg-transparent border-none outline-none text-text-primary placeholder-text-tertiary text-base"
            disabled={isLoading}
          />

          {/* Generate Button */}
          <button
            type="button"
            onClick={handleGenerate}
            className="ml-4 p-2 text-text-primary hover:bg-bg-hover rounded-full transition-colors flex-shrink-0"
            disabled={isLoading}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  )
}

