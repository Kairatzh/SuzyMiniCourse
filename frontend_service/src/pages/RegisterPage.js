// Register Page Component
export class RegisterPage {
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
                        <h2>Регистрация</h2>
                        <p>Создайте новый аккаунт</p>
                    </div>

                    <form class="auth-form" id="registerForm">
                        <div class="form-group">
                            <label for="username">Имя пользователя</label>
                            <input 
                                type="text" 
                                id="username" 
                                name="username" 
                                placeholder="johndoe"
                                required
                                autocomplete="username"
                            />
                        </div>

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
                                autocomplete="new-password"
                            />
                            <small class="form-hint">Минимум 8 символов</small>
                        </div>

                        <div class="form-group">
                            <label for="confirmPassword">Подтвердите пароль</label>
                            <input 
                                type="password" 
                                id="confirmPassword" 
                                name="confirmPassword" 
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <div class="form-error" id="registerError"></div>

                        <button type="submit" class="primary-btn" id="registerBtn">
                            <span class="btn-text">Зарегистрироваться</span>
                        </button>
                    </form>

                    <div class="auth-footer">
                        <p>Уже есть аккаунт? <a href="#login">Войти</a></p>
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
        const form = this.element.querySelector('#registerForm');
        const submitBtn = this.element.querySelector('#registerBtn');
        const errorDiv = this.element.querySelector('#registerError');

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleRegister(form, submitBtn, errorDiv);
        });
    }

    async handleRegister(form, submitBtn, errorDiv) {
        const username = form.querySelector('#username').value;
        const email = form.querySelector('#email').value;
        const password = form.querySelector('#password').value;
        const confirmPassword = form.querySelector('#confirmPassword').value;

        // Validation
        if (password !== confirmPassword) {
            this.showError(errorDiv, 'Пароли не совпадают');
            return;
        }

        if (password.length < 8) {
            this.showError(errorDiv, 'Пароль должен содержать минимум 8 символов');
            return;
        }

        this.setLoading(submitBtn, true);
        this.clearError(errorDiv);

        try {
            const { default: AuthService } = await import('../services/auth.service.js');
            const result = await AuthService.register(username, email, password);

            if (result.success) {
                // Auto login after registration
                const loginResult = await AuthService.login(email, password);
                if (loginResult.success && this.onSuccess) {
                    this.onSuccess();
                }
                window.location.hash = '#dashboard';
            } else {
                this.showError(errorDiv, result.error || 'Ошибка регистрации');
            }
        } catch (error) {
            this.showError(errorDiv, 'Произошла ошибка при регистрации');
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

export default RegisterPage;
