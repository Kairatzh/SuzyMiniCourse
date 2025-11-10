import { useState, useEffect } from 'react'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import { useAuth } from '../contexts/AuthContext'
import apiService from '../services/apiService'

export default function ProfilePage() {
  const { user } = useAuth()
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    coursesCreated: 0,
    lessonsCompleted: 0,
    activeDays: 0,
    progress: 0
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const myCourses = await apiService.getMyCourses()
      setCourses(myCourses)
      setStats({
        coursesCreated: myCourses.length,
        lessonsCompleted: myCourses.reduce((acc, c) => acc + (c.tests?.length || 0), 0),
        activeDays: 30,
        progress: Math.min(100, (myCourses.length / 10) * 100)
      })
    } catch (error) {
      console.error('Error loading profile data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-primary">
        <Header />
        <div className="flex pt-12">
          <Sidebar />
          <main className="flex-1 ml-sidebar p-8">
            <div className="flex items-center justify-center h-64">
              <div className="w-12 h-12 border-2 border-text-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg-primary">
      <Header />
      <div className="flex pt-12">
        <Sidebar />
        <main className="flex-1 ml-sidebar p-8 max-w-6xl">
          {/* Profile Header */}
          <div className="bg-bg-card border border-border-color rounded-2xl p-8 mb-8">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 bg-bg-secondary border border-border-color rounded-full flex items-center justify-center text-3xl font-bold text-text-primary">
                {user?.username?.[0]?.toUpperCase() || 'U'}
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-semibold mb-2">{user?.username || 'Пользователь'}</h1>
                <p className="text-text-secondary mb-2">{user?.email}</p>
                <p className="text-sm text-text-tertiary">
                  Зарегистрирован: {user?.created_at ? new Date(user.created_at).toLocaleDateString('ru-RU') : 'Неизвестно'}
                </p>
              </div>
              <button className="px-6 py-3 border border-border-color rounded-lg hover:border-border-hover transition-colors">
                Редактировать профиль
              </button>
            </div>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-bg-card border border-border-color rounded-xl p-6">
              <div className="text-3xl font-bold text-text-primary mb-2">{stats.coursesCreated}</div>
              <div className="text-text-secondary text-sm">Создано курсов</div>
            </div>
            <div className="bg-bg-card border border-border-color rounded-xl p-6">
              <div className="text-3xl font-bold text-text-primary mb-2">{stats.lessonsCompleted}</div>
              <div className="text-text-secondary text-sm">Пройдено уроков</div>
            </div>
            <div className="bg-bg-card border border-border-color rounded-xl p-6">
              <div className="text-3xl font-bold text-text-primary mb-2">{stats.activeDays}</div>
              <div className="text-text-secondary text-sm">Активных дней</div>
            </div>
            <div className="bg-bg-card border border-border-color rounded-xl p-6">
              <div className="text-3xl font-bold text-text-primary mb-2">{Math.round(stats.progress)}%</div>
              <div className="text-text-secondary text-sm">Общий прогресс</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="bg-bg-card border border-border-color rounded-xl p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Общий прогресс</h2>
            <div className="w-full bg-bg-secondary rounded-full h-3 mb-2">
              <div
                className="bg-text-primary h-3 rounded-full transition-all duration-300"
                style={{ width: `${stats.progress}%` }}
              ></div>
            </div>
            <p className="text-sm text-text-secondary">{Math.round(stats.progress)}% завершено</p>
          </div>

          {/* My Courses */}
          <div className="bg-bg-card border border-border-color rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-6">Мои курсы</h2>
            {courses.length > 0 ? (
              <div className="space-y-4">
                {courses.map((course) => (
                  <div
                    key={course.id}
                    className="bg-bg-secondary border border-border-color rounded-lg p-4 hover:border-border-hover transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-text-primary mb-1">{course.title}</h3>
                        <p className="text-sm text-text-secondary">{course.summary?.substring(0, 100)}...</p>
                      </div>
                      <div className="ml-4">
                        <div className="w-16 bg-bg-card rounded-full h-2">
                          <div className="bg-text-primary h-2 rounded-full" style={{ width: '60%' }}></div>
                        </div>
                        <p className="text-xs text-text-tertiary mt-1 text-center">60%</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-text-secondary text-center py-8">У вас пока нет курсов</p>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

