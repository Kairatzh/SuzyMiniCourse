import Header from '../components/Header'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-bg-primary">
      <Header />
      <div className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-light text-center mb-6">О проекте</h1>
          <p className="text-xl text-text-secondary text-center mb-16">
            Миссия FILL.AI - сделать образование доступным и персонализированным для каждого
          </p>

          {/* Mission */}
          <section className="mb-16">
            <h2 className="text-3xl font-semibold mb-6">Наша миссия</h2>
            <p className="text-text-secondary leading-relaxed mb-4">
              FILL.AI был создан с целью революционизировать способ обучения. Мы верим, что каждый
              должен иметь доступ к качественному образованию, адаптированному под его индивидуальные
              потребности и цели.
            </p>
            <p className="text-text-secondary leading-relaxed">
              Используя передовые технологии искусственного интеллекта, мы создаем персонализированные
              образовательные курсы, которые помогают людям эффективно изучать новые темы и развивать
              свои навыки.
            </p>
          </section>

          {/* Team */}
          <section className="mb-16">
            <h2 className="text-3xl font-semibold mb-6">Команда</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { name: 'Команда разработки', role: 'Backend & AI' },
                { name: 'Команда дизайна', role: 'UI/UX Design' },
                { name: 'Команда продукта', role: 'Product Management' }
              ].map((member, idx) => (
                <div key={idx} className="bg-bg-card border border-border-color rounded-xl p-6 text-center">
                  <div className="w-20 h-20 bg-bg-secondary border border-border-color rounded-full mx-auto mb-4 flex items-center justify-center text-2xl">
                    {member.name[0]}
                  </div>
                  <h3 className="font-semibold mb-2">{member.name}</h3>
                  <p className="text-sm text-text-secondary">{member.role}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Contact */}
          <section className="bg-bg-card border border-border-color rounded-xl p-8">
            <h2 className="text-3xl font-semibold mb-6">Свяжитесь с нами</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Email</h3>
                <a href="mailto:contact@fill.ai" className="text-text-secondary hover:text-text-primary">
                  contact@fill.ai
                </a>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Поддержка</h3>
                <a href="mailto:support@fill.ai" className="text-text-secondary hover:text-text-primary">
                  support@fill.ai
                </a>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

