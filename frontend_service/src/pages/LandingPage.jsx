import { Link } from 'react-router-dom'
import Header from '../components/Header.jsx'

export default function LandingPage() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0a0a0a', color: '#ffffff' }}>
      <Header />
      
      {/* Hero Section */}
      <section style={{ paddingTop: '128px', paddingBottom: '80px', paddingLeft: '24px', paddingRight: '24px' }}>
        <div style={{ maxWidth: '1152px', margin: '0 auto', textAlign: 'center' }}>
          <h1 style={{ 
            fontSize: '4rem', 
            fontWeight: 300, 
            marginBottom: '24px',
            background: 'linear-gradient(135deg, #ffffff 0%, #888888 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Развивайся, расти и стремись к бесконечности
          </h1>
          <p style={{ fontSize: '1.5rem', color: '#888888', marginBottom: '48px', fontWeight: 300 }}>
            AI-платформа для генерации персональных образовательных курсов
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <Link
              to="/register"
              style={{
                padding: '16px 32px',
                backgroundColor: '#ffffff',
                color: '#0a0a0a',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: 500,
                display: 'inline-block'
              }}
            >
              Начать бесплатно
            </Link>
            <Link
              to="/about"
              style={{
                padding: '16px 32px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '8px',
                textDecoration: 'none',
                color: '#ffffff',
                fontWeight: 500,
                display: 'inline-block'
              }}
            >
              Узнать больше
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ paddingTop: '80px', paddingBottom: '80px', paddingLeft: '24px', paddingRight: '24px', backgroundColor: '#151515' }}>
        <div style={{ maxWidth: '1152px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '3rem', fontWeight: 300, textAlign: 'center', marginBottom: '64px', color: '#ffffff' }}>Возможности</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
            {[
              {
                icon: '🤖',
                title: 'AI-Генерация',
                description: 'Создавайте курсы автоматически с помощью искусственного интеллекта'
              },
              {
                icon: '📊',
                title: 'Граф знаний',
                description: 'Визуализируйте связи между темами и курсами в интерактивном графе'
              },
              {
                icon: '🎯',
                title: 'Персонализация',
                description: 'Адаптируйте обучение под ваши цели и интересы'
              }
            ].map((feature, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: '#1a1a1a',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '20px',
                  padding: '32px',
                  textAlign: 'center'
                }}
              >
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>{feature.icon}</div>
                <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '12px', color: '#ffffff' }}>{feature.title}</h3>
                <p style={{ color: '#888888' }}>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section style={{ paddingTop: '80px', paddingBottom: '80px', paddingLeft: '24px', paddingRight: '24px', backgroundColor: '#0a0a0a' }}>
        <div style={{ maxWidth: '1152px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '3rem', fontWeight: 300, textAlign: 'center', marginBottom: '64px', color: '#ffffff' }}>Как это работает</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '48px' }}>
            {[
              { step: '1', title: 'Введите запрос', description: 'Опишите тему, которую хотите изучить' },
              { step: '2', title: 'AI создает курс', description: 'Наша система генерирует персонализированный курс' },
              { step: '3', title: 'Изучайте', description: 'Получите доступ к материалам, тестам и видео' }
            ].map((item, idx) => (
              <div key={idx} style={{ textAlign: 'center' }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 24px',
                  fontSize: '2rem',
                  fontWeight: 300,
                  color: '#ffffff'
                }}>
                  {item.step}
                </div>
                <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '12px', color: '#ffffff' }}>{item.title}</h3>
                <p style={{ color: '#888888' }}>{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ paddingTop: '80px', paddingBottom: '80px', paddingLeft: '24px', paddingRight: '24px', backgroundColor: '#151515', textAlign: 'center' }}>
        <div style={{ maxWidth: '896px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '3rem', fontWeight: 300, marginBottom: '24px', color: '#ffffff' }}>Готовы начать?</h2>
          <p style={{ fontSize: '1.25rem', color: '#888888', marginBottom: '32px' }}>
            Присоединяйтесь к тысячам пользователей, которые уже используют FILL.AI
          </p>
          <Link
            to="/register"
            style={{
              display: 'inline-block',
              padding: '16px 32px',
              backgroundColor: '#ffffff',
              color: '#0a0a0a',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: 500
            }}
          >
            Создать аккаунт
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ paddingTop: '48px', paddingBottom: '48px', paddingLeft: '24px', paddingRight: '24px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', backgroundColor: '#151515' }}>
        <div style={{ maxWidth: '1152px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '32px', marginBottom: '32px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <div style={{ width: '32px', height: '32px', backgroundColor: '#ffffff', borderRadius: '4px', transform: 'rotate(45deg)' }}></div>
                <span style={{ fontSize: '18px', fontWeight: 600, color: '#ffffff' }}>FILL.AI</span>
              </div>
              <p style={{ color: '#888888', fontSize: '14px' }}>
                AI-платформа для генерации образовательных курсов
              </p>
            </div>
            <div>
              <h4 style={{ fontWeight: 600, marginBottom: '16px', color: '#ffffff' }}>Страницы</h4>
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <li><Link to="/" style={{ color: '#888888', textDecoration: 'none', fontSize: '14px' }}>Home</Link></li>
                <li><Link to="/faq" style={{ color: '#888888', textDecoration: 'none', fontSize: '14px' }}>FAQ</Link></li>
                <li><Link to="/about" style={{ color: '#888888', textDecoration: 'none', fontSize: '14px' }}>About</Link></li>
              </ul>
            </div>
            <div>
              <h4 style={{ fontWeight: 600, marginBottom: '16px', color: '#ffffff' }}>Правовая информация</h4>
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <li><a href="#" style={{ color: '#888888', textDecoration: 'none', fontSize: '14px' }}>Privacy Policy</a></li>
                <li><a href="#" style={{ color: '#888888', textDecoration: 'none', fontSize: '14px' }}>Terms of Service</a></li>
              </ul>
            </div>
            <div>
              <h4 style={{ fontWeight: 600, marginBottom: '16px', color: '#ffffff' }}>Социальные сети</h4>
              <div style={{ display: 'flex', gap: '16px' }}>
                <a href="#" style={{ color: '#888888', textDecoration: 'none', fontSize: '14px' }}>Twitter</a>
                <a href="#" style={{ color: '#888888', textDecoration: 'none', fontSize: '14px' }}>GitHub</a>
              </div>
            </div>
          </div>
          <div style={{ textAlign: 'center', fontSize: '14px', color: '#555555', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '32px' }}>
            © 2025 FILL.AI. Все права защищены.
          </div>
        </div>
      </footer>
    </div>
  )
}

