// Landing Page Component
export class LandingPage {
    render() {
        return `
            <div class="landing-page">
                <!-- Navigation -->
                <nav class="landing-nav">
                    <div class="logo">
                        <span class="logo-icon">◆</span>
                        <span class="logo-text">FILL<span class="logo-accent">.AI</span></span>
                    </div>
                    <div class="nav-right">
                        <a href="#features" class="nav-link">Возможности</a>
                        <a href="#how-it-works" class="nav-link">Как работает</a>
                        <button class="login-link-btn" onclick="window.location.hash='#login'">
                            Войти
                        </button>
                    </div>
                </nav>

                <!-- Hero Section -->
                <section class="hero-section">
                    <div class="hero-background" id="heroCanvas"></div>
                    <div class="hero-content">
                        <h1 class="hero-title">Развивайся, расти и стремись к бесконечности</h1>
                        <p class="hero-subtitle">
                            AI создает персонализированные курсы и визуализирует карту ваших компетенций
                        </p>
                        <div class="hero-cta">
                            <button class="cta-primary" onclick="window.location.hash='#login'">
                                Начать бесплатно
                            </button>
                            <button class="cta-secondary">
                                Смотреть демо
                            </button>
                        </div>
                    </div>
                </section>

                <!-- Features -->
                <section class="features-section" id="features">
                    <h2 class="section-title">Уникальные возможности</h2>
                    <div class="features-grid">
                        <div class="feature-card">
                            <div class="feature-icon">◆</div>
                            <h3>AI-генерация курсов</h3>
                            <p>Искусственный интеллект создает персонализированные мини-курсы по любой теме за секунды</p>
                        </div>
                        <div class="feature-card">
                            <div class="feature-icon">◇</div>
                            <h3>Визуализация навыков</h3>
                            <p>Интерактивная карта компетенций с уровнями владения показывает ваш реальный прогресс</p>
                        </div>
                        <div class="feature-card">
                            <div class="feature-icon">◈</div>
                            <h3>Бесконечное развитие</h3>
                            <p>Учитесь чему угодно: от детских навыков до профессиональных компетенций</p>
                        </div>
                        <div class="feature-card">
                            <div class="feature-icon">◊</div>
                            <h3>Для всех</h3>
                            <p>Подходит ученикам, учителям, специалистам и целым организациям</p>
                        </div>
                        <div class="feature-card">
                            <div class="feature-icon">⬡</div>
                            <h3>Аналитика роста</h3>
                            <p>Отслеживайте свой прогресс и видьте как развиваются ваши компетенции</p>
                        </div>
                        <div class="feature-card">
                            <div class="feature-icon">▢</div>
                            <h3>Универсальность</h3>
                            <p>Любая тема, любой язык, любой уровень - система адаптируется под вас</p>
                        </div>
                    </div>
                </section>

                <!-- How It Works -->
                <section class="how-it-works" id="how-it-works">
                    <h2 class="section-title">Как это работает</h2>
                    <div class="steps">
                        <div class="step">
                            <div class="step-number">1</div>
                            <h3>Запросите курс</h3>
                            <p>Напишите что хотите изучить - AI сгенерирует персональный курс</p>
                        </div>
                        <div class="step">
                            <div class="step-number">2</div>
                            <h3>Учитесь интерактивно</h3>
                            <p>Проходите теорию, видео и задания в удобном формате</p>
                        </div>
                        <div class="step">
                            <div class="step-number">3</div>
                            <h3>Наблюдайте рост</h3>
                            <p>Визуализация показывает как растут ваши навыки и компетенции</p>
                        </div>
                    </div>
                </section>

                <!-- CTA -->
                <section class="cta-section">
                    <h2>Готовы начать?</h2>
                    <p>Присоединяйтесь к тысячам пользователей, которые уже развиваются с FILL.AI</p>
                    <button class="cta-primary" onclick="window.location.hash='#login'">
                        Начать бесплатно
                    </button>
                </section>

                <!-- Footer -->
                <footer class="landing-footer">
                    <div class="footer-logo">
                        <span class="logo-icon">◆</span>
                        <span class="logo-text">FILL<span class="logo-accent">.AI</span></span>
                    </div>
                    <p>© 2025 FILL.AI. Все права защищены.</p>
                </footer>
            </div>
        `;
    }

    mount(parent) {
        const template = document.createElement('template');
        template.innerHTML = this.render();
        this.element = template.content.firstElementChild;
        parent.appendChild(this.element);
        this.initHeroCanvas();
    }

    unmount() {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }
        if (this.element && this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
    }

    initHeroCanvas() {
        const canvasContainer = this.element.querySelector('#heroCanvas');
        if (!canvasContainer) return;

        // Simple animated background
        canvasContainer.innerHTML = '<canvas id="bgCanvas" style="width: 100%; height: 100%;"></canvas>';
        const canvas = canvasContainer.querySelector('#bgCanvas');
        const ctx = canvas.getContext('2d');
        
        canvas.width = canvasContainer.offsetWidth;
        canvas.height = canvasContainer.offsetHeight;

        const nodes = [];
        for (let i = 0; i < 50; i++) {
            nodes.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
            });
        }

        const animate = () => {
            ctx.fillStyle = 'rgba(10, 10, 10, 0.1)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            nodes.forEach((node, i) => {
                node.x += node.vx;
                node.y += node.vy;

                if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
                if (node.y < 0 || node.y > canvas.height) node.vy *= -1;

                ctx.beginPath();
                ctx.arc(node.x, node.y, 2, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
                ctx.fill();

                nodes.slice(i + 1).forEach(otherNode => {
                    const dx = node.x - otherNode.x;
                    const dy = node.y - otherNode.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 100) {
                        ctx.beginPath();
                        ctx.moveTo(node.x, node.y);
                        ctx.lineTo(otherNode.x, otherNode.y);
                        ctx.strokeStyle = `rgba(255, 255, 255, ${0.2 * (1 - dist / 100)})`;
                        ctx.stroke();
                    }
                });
            });

            this.animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        window.addEventListener('resize', () => {
            canvas.width = canvasContainer.offsetWidth;
            canvas.height = canvasContainer.offsetHeight;
        });
    }
}

export default LandingPage;
