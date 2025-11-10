// Simple test component to verify React is working
export default function TestComponent() {
  return (
    <div style={{ 
      padding: '20px', 
      backgroundColor: '#1a1a1a', 
      color: '#ffffff',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      borderRadius: '8px',
      margin: '20px'
    }}>
      <h2 style={{ color: '#ffffff', marginBottom: '10px' }}>React работает!</h2>
      <p style={{ color: '#888888' }}>Если вы видите это сообщение, значит React успешно загружен.</p>
    </div>
  )
}

