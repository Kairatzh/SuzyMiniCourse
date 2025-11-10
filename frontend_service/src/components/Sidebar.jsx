import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function Sidebar() {
  const location = useLocation()
  const [isExpanded, setIsExpanded] = useState(true)
  const [expandedSection, setExpandedSection] = useState('queries')

  const menuItems = [
    { icon: '📚', label: 'Библиотека', path: '/dashboard', id: 'library' },
    { icon: '💬', label: 'Сообщество', path: '/community', id: 'community' },
    { icon: '👤', label: 'Профиль', path: '/profile', id: 'profile' },
    { icon: '⚙️', label: 'Настройки', path: '/settings', id: 'settings' }
  ]

  const recentQueries = ['Дизайн', 'Тренировки', 'Языки']
  const courseSections = ['Дизайн', 'Тренировки', 'Языки']

  const isActive = (path) => location.pathname === path

  return (
    <aside className={`fixed left-0 top-12 h-[calc(100vh-3rem)] bg-bg-secondary border-r border-border-color transition-all duration-300 ${
      isExpanded ? 'w-sidebar' : 'w-sidebar-collapsed'
    } overflow-y-auto scrollbar-hide`}>
      <div className="p-6 flex flex-col h-full">
        {/* Navigation Menu */}
        <nav className="space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.id}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive(item.path)
                  ? 'bg-bg-hover text-text-primary border-l-2 border-text-primary'
                  : 'text-text-secondary hover:bg-bg-hover hover:text-text-primary'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              {isExpanded && <span className="text-sm font-medium">{item.label}</span>}
            </Link>
          ))}
        </nav>

        {/* Separator */}
        <div className="my-6 border-t border-border-color"></div>

        {/* Queries Section */}
        {isExpanded && (
          <div className="mb-6">
            <button
              onClick={() => setExpandedSection(expandedSection === 'queries' ? null : 'queries')}
              className="w-full text-left px-4 py-2 text-xs font-semibold text-text-tertiary uppercase tracking-wider"
            >
              Запросы
            </button>
            {expandedSection === 'queries' && (
              <div className="mt-2 space-y-1">
                {recentQueries.map((query, idx) => (
                  <button
                    key={idx}
                    className="w-full text-left px-6 py-2 text-sm text-text-secondary hover:bg-bg-hover hover:text-text-primary rounded-lg transition-colors"
                  >
                    {query}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Course Sections */}
        {isExpanded && (
          <div className="space-y-1">
            {courseSections.map((section, idx) => (
              <button
                key={idx}
                className="w-full text-left px-6 py-2 text-sm text-text-secondary hover:bg-bg-hover hover:text-text-primary rounded-lg transition-colors"
              >
                {section}
              </button>
            ))}
          </div>
        )}

        {/* Bottom Icons */}
        <div className="mt-auto flex justify-between items-center pt-6 border-t border-border-color">
          <button className="text-text-secondary hover:text-text-primary transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
            </svg>
          </button>
          <button className="text-text-secondary hover:text-text-primary transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
        </div>
      </div>
    </aside>
  )
}

