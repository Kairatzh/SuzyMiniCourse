import { useState, useEffect, memo } from 'react'
import apiService from '../services/apiService.js'

function DemoBanner() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Show banner if in demo mode
    if (apiService.demoMode) {
      setIsVisible(true)
    }
  }, [])

  if (!isVisible) return null

  return (
    <div style={{
      position: 'fixed',
      top: '48px',
      left: 0,
      right: 0,
      zIndex: 50,
      background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%)',
      backdropFilter: 'blur(8px)',
      borderBottom: '1px solid rgba(102, 126, 234, 0.3)',
      padding: '12px 16px'
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '24px' }}>🎮</span>
          <div>
            <strong style={{ color: '#ffffff', fontWeight: 600 }}>Демо-режим</strong>
            <span style={{ color: '#888888', marginLeft: '8px', fontSize: '14px' }}>
              Фронтенд работает без backend. Все данные мокируются.
            </span>
          </div>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          style={{
            color: '#888888',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: '4px',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          aria-label="Закрыть"
        >
          <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  )
}

export default memo(DemoBanner)

