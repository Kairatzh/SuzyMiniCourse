// Login Page Component
export class LoginPage {
    constructor() {
        this.onSuccess = null;
    }

    setOnSuccess(callback) {
        this.onSuccess = callback;
    }

    render() {
        return `
            <div class="auth-page">
                <div class="auth-container">
                    <div class="auth-header">
                        <div class="logo">
                            <span class="logo-icon">◆</span>
                            <span class="logo-text">FILL<span class="logo-accent">.AI</span></span>
                        </div>
                        <h2>Вход в систему</h2>
                        <p>Войдите в свой аккаунт для продолжения</p>
                    </div>

                    <form class="auth-form" id="loginForm">
                        <div class="form-group">
                            <label for="email">Email</label>
                            <input 
                                type="email" 
                                id="email" 
                                name="email" 
                                placeholder="your@email.com"
                                required
                                autocomplete="email"
                            />
                        </div>

                        <div class="form-group">
                            <label for="password">Пароль</label>
                            <input 
                                type="password" 
                                id="password" 
                                name="password" 
                                placeholder="••••••••"
                                required
                                autocomplete="current-password"
                            />
                        </div>

                        <div class="form-error" id="loginError"></div>

                        <button type="submit" class="primary-btn" id="loginBtn">
                            <span class="btn-text">Войти</span>
                        </button>
                    </form>

                    <div class="auth-footer">
                        <p>Нет аккаунта? <a href="#register">Зарегистрироваться</a></p>
                        <a href="#" class="forgot-password">Забыли пароль?</a>
                    </div>
                </div>
            </div>
        `;
    }

    mount(parent) {
        const template = document.createElement('template');
        template.innerHTML = this.render();
        this.element = template.content.firstElementChild;
        parent.appendChild(this.element);
        this.attachEvents();
    }

    unmount() {
        if (this.element && this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
    }

    attachEvents() {
        const form = this.element.querySelector('#loginForm');
        const submitBtn = this.element.querySelector('#loginBtn');
        const errorDiv = this.element.querySelector('#loginError');

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleLogin(form, submitBtn, errorDiv);
        });
    }

    async handleLogin(form, submitBtn, errorDiv) {
        const email = form.querySelector('#email').value;
        const password = form.querySelector('#password').value;

        this.setLoading(submitBtn, true);
        this.clearError(errorDiv);

        try {
            const { default: AuthService } = await import('../services/auth.service.js');
            const result = await AuthService.login(email, password);

            if (result.success) {
                if (this.onSuccess) {
                    this.onSuccess();
                }
                window.location.hash = '#dashboard';
            } else {
                this.showError(errorDiv, result.error || 'Неверный email или пароль');
            }
        } catch (error) {
            this.showError(errorDiv, 'Произошла ошибка при входе');
        } finally {
            this.setLoading(submitBtn, false);
        }
    }

    setLoading(button, isLoading) {
        if (isLoading) {
            button.disabled = true;
            button.classList.add('loading');
        } else {
            button.disabled = false;
            button.classList.remove('loading');
        }
    }

    showError(errorDiv, message) {
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
    }

    clearError(errorDiv) {
        errorDiv.textContent = '';
        errorDiv.style.display = 'none';
    }
}

export default LoginPage;
