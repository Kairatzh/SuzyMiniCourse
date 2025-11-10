import { useState } from 'react'

export default function CourseModal({ course, activeTab = 'theory', onClose }) {
  const [currentTab, setCurrentTab] = useState(activeTab)

  const tabs = [
    { id: 'theory', label: 'Теория', icon: '📚' },
    { id: 'practice', label: 'Практика', icon: '🎯' },
    { id: 'materials', label: 'Материалы', icon: '📎' }
  ]

  if (!course) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-bg-card border border-border-color rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col animate-scale-in shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border-color">
            <div className="flex items-center gap-4">
              <button
                onClick={onClose}
                className="text-text-secondary hover:text-text-primary transition-colors p-2 rounded hover:bg-bg-hover"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h2 className="text-2xl font-semibold text-text-primary">{course.title}</h2>
            </div>
            <button
              onClick={onClose}
              className="text-text-secondary hover:text-text-primary transition-colors p-2 rounded hover:bg-bg-hover"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-border-color">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setCurrentTab(tab.id)}
                className={`flex-1 px-6 py-4 text-sm font-medium transition-colors border-b-2 ${
                  currentTab === tab.id
                    ? 'border-text-primary text-text-primary'
                    : 'border-transparent text-text-secondary hover:text-text-primary'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {currentTab === 'theory' && (
              <div>
                <h3 className="text-xl font-semibold text-text-primary mb-4">Описание курса</h3>
                <p className="text-text-secondary leading-relaxed mb-6">{course.summary || 'Описание отсутствует'}</p>
                {course.categories && course.categories.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {course.categories.map((cat, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-bg-secondary border border-border-color rounded-lg text-sm text-text-secondary"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {currentTab === 'practice' && (
              <div>
                <h3 className="text-xl font-semibold text-text-primary mb-4">Тесты и задания</h3>
                {course.tests && course.tests.length > 0 ? (
                  <div className="space-y-4">
                    {course.tests.map((test, idx) => (
                      <div key={idx} className="bg-bg-secondary border border-border-color rounded-xl p-6">
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-xs font-semibold text-text-tertiary">Вопрос {idx + 1}</span>
                          <span className="px-2 py-1 bg-bg-card border border-border-color rounded text-xs text-text-secondary">
                            Средний
                          </span>
                        </div>
                        <p className="text-text-primary font-medium mb-4">{test.question}</p>
                        <div className="space-y-2">
                          {test.options?.map((opt, optIdx) => (
                            <div
                              key={optIdx}
                              className="flex items-center gap-3 p-3 bg-bg-card border border-border-color rounded-lg hover:border-border-hover transition-colors"
                            >
                              <span className="w-8 h-8 flex items-center justify-center bg-bg-secondary border border-border-color rounded font-bold text-text-primary">
                                {String.fromCharCode(65 + optIdx)}
                              </span>
                              <span className="flex-1 text-text-secondary">{opt}</span>
                            </div>
                          ))}
                        </div>
                        {test.correct_answer && (
                          <div className="mt-4 p-3 bg-green-500/10 border-l-4 border-green-500 rounded text-sm text-green-500">
                            ✓ Правильный ответ: {test.correct_answer}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-text-tertiary text-center py-8">Тесты пока не добавлены</p>
                )}
              </div>
            )}

            {currentTab === 'materials' && (
              <div>
                <h3 className="text-xl font-semibold text-text-primary mb-4">Дополнительные материалы</h3>
                {course.videos && course.videos.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {course.videos.map((url, idx) => (
                      <a
                        key={idx}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-bg-secondary border border-border-color rounded-xl p-6 hover:border-border-hover transition-colors group"
                      >
                        <div className="aspect-video bg-bg-card border border-border-color rounded-lg flex items-center justify-center mb-4 group-hover:bg-bg-hover transition-colors">
                          <svg className="w-12 h-12 text-text-secondary" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                        <h4 className="text-text-primary font-medium mb-2">Видео {idx + 1}</h4>
                        <p className="text-sm text-text-secondary">Смотреть видео →</p>
                      </a>
                    ))}
                  </div>
                ) : (
                  <p className="text-text-tertiary text-center py-8">Видео материалы пока не добавлены</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

