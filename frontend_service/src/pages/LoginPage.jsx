import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Header from '../components/Header'
import apiService from '../services/apiService'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // In demo mode, accept any credentials
      const result = await login(email || 'demo@fill.ai', password || 'demo')
      if (result.success) {
        navigate('/dashboard')
      } else {
        setError(result.error || 'Ошибка входа')
      }
    } catch (err) {
      setError('Произошла ошибка. Попробуйте снова.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-bg-primary">
      <Header />
      <div className="flex items-center justify-center min-h-screen pt-12 px-6">
        <div className="w-full max-w-md bg-bg-card border border-border-color rounded-2xl p-8">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-10 h-10 bg-text-primary rounded rotate-45"></div>
              <span className="text-2xl font-semibold">FILL.AI</span>
            </div>
            <h2 className="text-2xl font-semibold mb-2">Вход в аккаунт</h2>
            <p className="text-text-secondary">Введите ваши данные для входа</p>
            {apiService.demoMode && (
              <div className="mt-4 p-3 bg-accent/10 border border-accent/30 rounded-lg text-sm text-text-secondary">
                <strong className="text-text-primary">Демо-режим:</strong> Любые данные для входа
              </div>
            )}
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-500/10 border border-red-500 rounded-lg text-red-500 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-bg-input border border-border-color rounded-lg text-text-primary focus:outline-none focus:border-border-hover focus:ring-2 focus:ring-white/10"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Пароль
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-bg-input border border-border-color rounded-lg text-text-primary focus:outline-none focus:border-border-hover focus:ring-2 focus:ring-white/10"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 bg-text-primary text-bg-primary rounded-lg hover:bg-text-secondary transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Вход...' : 'Войти'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-text-secondary">
            Нет аккаунта?{' '}
            <Link to="/register" className="text-text-primary hover:underline">
              Зарегистрироваться
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

