import { memo } from 'react'

function LoadingScreen() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#0a0a0a', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated background gradient */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '200%',
        height: '200%',
        background: 'radial-gradient(circle, rgba(102, 126, 234, 0.1) 0%, transparent 70%)',
        animation: 'pulse 3s ease-in-out infinite'
      }}></div>
      
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        gap: '24px',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Logo placeholder */}
        <div style={{
          width: '64px',
          height: '64px',
          backgroundColor: '#ffffff',
          borderRadius: '8px',
          transform: 'rotate(45deg)',
          marginBottom: '8px',
          opacity: 0.9
        }}></div>
        
        {/* Spinner */}
        <div style={{
          width: '48px',
          height: '48px',
          border: '3px solid rgba(255, 255, 255, 0.1)',
          borderTopColor: '#ffffff',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite'
        }}></div>
        
        <p style={{ 
          color: '#888888',
          fontSize: '16px',
          fontWeight: 400,
          letterSpacing: '0.5px'
        }}>
          Загрузка...
        </p>
      </div>
      
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 0.6; transform: translate(-50%, -50%) scale(1.1); }
        }
      `}</style>
    </div>
  )
}

export default memo(LoadingScreen)

