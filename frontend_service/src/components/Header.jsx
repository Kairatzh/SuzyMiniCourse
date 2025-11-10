import { memo, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext.jsx'

function Header() {
  const { isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = useCallback(() => {
    logout()
    navigate('/login')
  }, [logout, navigate])

  if (!isAuthenticated) {
    return (
      <header style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '48px',
        backgroundColor: 'rgba(21, 21, 21, 0.8)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px'
      }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: '#ffffff' }}>
          <div style={{ width: '32px', height: '32px', backgroundColor: '#ffffff', borderRadius: '4px', transform: 'rotate(45deg)' }}></div>
          <span style={{ fontSize: '18px', fontWeight: 600, color: '#ffffff' }}>FILL.AI</span>
        </Link>
        <nav style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <Link to="/" style={{ color: '#888888', textDecoration: 'none', fontSize: '14px' }}>Home</Link>
          <Link to="/faq" style={{ color: '#888888', textDecoration: 'none', fontSize: '14px' }}>FAQ</Link>
          <Link to="/about" style={{ color: '#888888', textDecoration: 'none', fontSize: '14px' }}>About</Link>
          <Link to="/login" style={{ color: '#888888', textDecoration: 'none', fontSize: '14px' }}>Sign In</Link>
          <Link
            to="/register"
            style={{
              padding: '8px 16px',
              backgroundColor: '#ffffff',
              color: '#0a0a0a',
              borderRadius: '8px',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: 500
            }}
          >
            Get Started
          </Link>
        </nav>
      </header>
    )
  }

  return (
    <header style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      height: '48px',
      backgroundColor: 'rgba(21, 21, 21, 0.8)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      zIndex: 50,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px'
    }}>
      <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: '#ffffff' }}>
        <div style={{ width: '32px', height: '32px', backgroundColor: '#ffffff', borderRadius: '4px', transform: 'rotate(45deg)' }}></div>
        <span style={{ fontSize: '18px', fontWeight: 600, color: '#ffffff' }}>FILL.AI</span>
      </Link>
      <nav style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button
          onClick={handleLogout}
          style={{
            padding: '8px 16px',
            color: '#888888',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '8px',
            fontSize: '14px',
            backgroundColor: 'transparent',
            cursor: 'pointer'
          }}
        >
          Выйти
        </button>
      </nav>
    </header>
  )
}

export default memo(Header)

