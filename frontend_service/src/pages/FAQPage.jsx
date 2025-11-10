import { useState } from 'react'
import Header from '../components/Header'

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState(null)

  const faqs = [
    {
      question: 'Что такое FILL.AI?',
      answer: 'FILL.AI - это платформа для AI-генерации образовательных курсов. Мы используем искусственный интеллект для создания персонализированных курсов на основе ваших запросов.'
    },
    {
      question: 'Как работает генерация курсов?',
      answer: 'Вы вводите тему, которую хотите изучить, и наш AI создает полноценный курс с теорией, практическими заданиями, тестами и видео материалами.'
    },
    {
      question: 'Сколько стоит использование платформы?',
      answer: 'В настоящее время платформа доступна бесплатно. В будущем мы планируем ввести платные планы с расширенными возможностями.'
    },
    {
      question: 'Безопасны ли мои данные?',
      answer: 'Да, мы серьезно относимся к безопасности данных. Все данные шифруются и хранятся в соответствии с современными стандартами безопасности.'
    },
    {
      question: 'Могу ли я редактировать сгенерированные курсы?',
      answer: 'Да, вы можете редактировать курсы, добавлять свои материалы и настраивать их под свои нужды.'
    },
    {
      question: 'Какие темы поддерживаются?',
      answer: 'Платформа поддерживает широкий спектр тем: программирование, дизайн, языки, наука, бизнес и многое другое.'
    },
    {
      question: 'Как долго генерируется курс?',
      answer: 'Обычно генерация курса занимает от 30 секунд до 2 минут, в зависимости от сложности темы.'
    },
    {
      question: 'Можно ли делиться курсами с другими?',
      answer: 'Да, вы можете делиться своими курсами с сообществом или отправлять их друзьям.'
    },
    {
      question: 'Есть ли мобильное приложение?',
      answer: 'В настоящее время доступна только веб-версия. Мобильное приложение находится в разработке.'
    },
    {
      question: 'Как связаться с поддержкой?',
      answer: 'Вы можете связаться с нами через форму обратной связи на странице "О нас" или отправить email на support@fill.ai'
    }
  ]

  return (
    <div className="min-h-screen bg-bg-primary">
      <Header />
      <div className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-light text-center mb-4">Часто задаваемые вопросы</h1>
          <p className="text-xl text-text-secondary text-center mb-12">
            Найдите ответы на популярные вопросы о платформе
          </p>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-bg-card border border-border-color rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-bg-hover transition-colors"
                >
                  <span className="font-semibold text-text-primary">{faq.question}</span>
                  <svg
                    className={`w-5 h-5 text-text-secondary transition-transform ${
                      openIndex === index ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openIndex === index && (
                  <div className="px-6 py-4 border-t border-border-color text-text-secondary">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

