import { lazy, Suspense, memo } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext.jsx'
import DemoBanner from './components/DemoBanner.jsx'
import LoadingScreen from './components/LoadingScreen.jsx'
import './App.css'

// Lazy load pages for better performance
const LandingPage = lazy(() => import('./pages/LandingPage.jsx'))
const LoginPage = lazy(() => import('./pages/LoginPage.jsx'))
const RegisterPage = lazy(() => import('./pages/RegisterPage.jsx'))
const DashboardPage = lazy(() => import('./pages/DashboardPage.jsx'))
const ProfilePage = lazy(() => import('./pages/ProfilePage.jsx'))
const FAQPage = lazy(() => import('./pages/FAQPage.jsx'))
const AboutPage = lazy(() => import('./pages/AboutPage.jsx'))
const CommunityPage = lazy(() => import('./pages/CommunityPage.jsx'))

const ProtectedRoute = memo(({ children }) => {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? children : <Navigate to="/login" replace />
})

ProtectedRoute.displayName = 'ProtectedRoute'

const SuspenseFallback = memo(() => (
  <div style={{
    minHeight: '100vh',
    backgroundColor: '#0a0a0a',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }}>
    <LoadingScreen />
  </div>
))

SuspenseFallback.displayName = 'SuspenseFallback'

function AppRoutes() {
  const { loading } = useAuth()
  
  if (loading) {
    return <LoadingScreen />
  }
  
  return (
    <Suspense fallback={<SuspenseFallback />}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/community" 
          element={
            <ProtectedRoute>
              <CommunityPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}

function App() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#0a0a0a', 
      color: '#ffffff', 
      width: '100%',
      position: 'relative'
    }}>
      <AuthProvider>
        <BrowserRouter>
          <DemoBanner />
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </div>
  )
}

export default App

