// Header Component
export class Header {
    constructor() {
        this.element = null;
    }

    render() {
        return `
            <nav class="header">
                <div class="logo">
                    <span class="logo-icon">◆</span>
                    <span class="logo-text">FILL<span class="logo-accent">.AI</span></span>
                </div>
                <div class="nav-right">
                    <a href="#dashboard" class="nav-link">Библиотека</a>
                    <a href="#profile" class="nav-link">Профиль</a>
                    <button class="logout-btn" id="logoutBtn">Выйти</button>
                </div>
            </nav>
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
        const logoutBtn = this.element.querySelector('#logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                import('../services/auth.service.js').then(({ default: AuthService }) => {
                    AuthService.logout();
                    window.location.hash = '#login';
                });
            });
        }
    }
}

export default Header;
