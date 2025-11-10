import { useEffect } from 'react'

export default function PopupPanel({ node, isOpen, onClose, onOptionClick }) {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  if (!isOpen || !node) return null

  const options = [
    { icon: '📝', label: 'Теория', id: 'theory' },
    { icon: '▶️', label: 'Видео', id: 'video' },
    { icon: '✅', label: 'Задание', id: 'task' }
  ]

  const handleOptionClick = (optionId) => {
    if (onOptionClick) {
      onOptionClick(node, optionId)
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 animate-fade-in"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed right-0 top-0 h-full w-80 bg-bg-card border-l border-border-color z-50 animate-slide-in-right shadow-2xl">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-border-color">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-text-primary">{node.label}</h2>
              <button
                onClick={onClose}
                className="text-text-secondary hover:text-text-primary transition-colors p-1 rounded hover:bg-bg-hover"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Options */}
          <div className="flex-1 overflow-y-auto">
            <div className="divide-y divide-border-color">
              {options.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleOptionClick(option.id)}
                  className="w-full flex items-center gap-4 px-6 py-4 text-left hover:bg-bg-hover transition-colors group"
                >
                  <span className="text-2xl">{option.icon}</span>
                  <span className="flex-1 text-text-primary font-medium group-hover:text-text-primary">
                    {option.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="p-6 border-t border-border-color">
            <div className="flex items-center justify-center gap-4">
              <button className="text-text-tertiary hover:text-text-primary transition-colors p-2 rounded hover:bg-bg-hover">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </button>
              <button className="text-text-tertiary hover:text-text-primary transition-colors p-2 rounded hover:bg-bg-hover">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </button>
              <button className="text-text-tertiary hover:text-text-primary transition-colors p-2 rounded hover:bg-bg-hover">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

