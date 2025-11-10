// Main Application Controller
import AuthService from './services/auth.service.js';

// Import pages
import LandingPage from './pages/LandingPage.js';
import LoginPage from './pages/LoginPage.js';
import RegisterPage from './pages/RegisterPage.js';
import DashboardPage from './pages/DashboardPage.js';

// Import components
import Header from './components/Header.js';
import Sidebar from './components/Sidebar.js';
import GraphView from './components/GraphView.js';

class App {
    constructor() {
        this.currentPage = null;
        this.currentView = null;
        this.header = null;
        this.sidebar = null;
        this.isAuthenticated = false;
        
        this.pages = {
            landing: LandingPage,
            login: LoginPage,
            register: RegisterPage,
            dashboard: DashboardPage
        };

        this.components = {
            graph: GraphView
        };
    }

    async init() {
        // Check for demo mode
        const { default: API_CONFIG } = await import('./config/api.config.js');
        
        // Initialize auth service
        await AuthService.init();
        this.isAuthenticated = AuthService.getIsAuthenticated();

        // Auto-login in demo mode if not authenticated
        if (API_CONFIG.DEMO_MODE && !this.isAuthenticated) {
            await AuthService.login('demo@fill.ai', 'demo');
            this.isAuthenticated = AuthService.getIsAuthenticated();
        }

        // Subscribe to auth changes
        AuthService.subscribe((authenticated) => {
            this.isAuthenticated = authenticated;
            this.handleAuthChange();
        });

        // Listen to hash changes
        window.addEventListener('hashchange', () => this.handleRoute());
        
        // Handle initial route
        this.handleRoute();
    }

    handleAuthChange() {
        if (!this.isAuthenticated) {
            // Redirect to login if not authenticated and trying to access protected route
            const hash = window.location.hash.replace('#', '');
            if (hash !== 'login' && hash !== 'register' && hash !== '') {
                window.location.hash = '#login';
            }
        }
    }

    async handleRoute() {
        const hash = window.location.hash.replace('#', '') || 'landing';
        const [route, ...params] = hash.split('/');

        // Handle public routes
        if (route === 'login' || route === 'register') {
            await this.renderAuthPage(route);
            return;
        }

        if (route === 'landing' || route === '') {
            await this.renderPage('landing');
            return;
        }

        // Protected routes
        if (!this.isAuthenticated) {
            window.location.hash = '#login';
            return;
        }

        // Handle different routes
        switch (route) {
            case 'dashboard':
            case 'courses':
                await this.renderDashboard();
                break;
            case 'graph':
                await this.renderDashboardWithTab('graph');
                break;
            case 'course':
                await this.renderCourseDetail(params[0]);
                break;
            default:
                await this.renderPage('dashboard');
        }
    }

    async renderPage(pageName) {
        const container = document.getElementById('app');
        container.innerHTML = '';

        // Cleanup previous page
        if (this.currentPage && this.currentPage.unmount) {
            this.currentPage.unmount();
        }

        // Render new page
        const PageClass = this.pages[pageName];
        if (PageClass) {
            this.currentPage = new PageClass();
            await this.currentPage.mount(container);
        }
    }

    async renderAuthPage(pageName) {
        const container = document.getElementById('app');
        container.innerHTML = '';

        if (this.header) {
            this.header.unmount();
        }
        if (this.sidebar) {
            this.sidebar.unmount();
        }

        const PageClass = this.pages[pageName];
        if (PageClass) {
            this.currentPage = new PageClass();
            await this.currentPage.mount(container);
        }
    }

    async renderDashboard() {
        await this.renderDashboardWithTab('courses');
    }

    async renderDashboardWithTab(defaultTab = 'courses') {
        const container = document.getElementById('app');
        container.innerHTML = '<div class="app-layout"></div>';
        
        const layout = container.querySelector('.app-layout');
        
        // Render header
        this.header = new Header();
        this.header.mount(layout);
        
        // Render sidebar
        const sidebarContainer = document.createElement('div');
        sidebarContainer.className = 'sidebar-container';
        this.sidebar = new Sidebar();
        this.sidebar.mount(sidebarContainer);
        layout.appendChild(sidebarContainer);
        
        // Render dashboard
        const contentContainer = document.createElement('div');
        contentContainer.className = 'content-container';
        this.currentPage = new DashboardPage();
        await this.currentPage.mount(contentContainer);
        
        // Switch to default tab after mount
        setTimeout(() => {
            if (this.currentPage && this.currentPage.switchTab) {
                this.currentPage.switchTab(defaultTab);
            }
        }, 50);
        
        layout.appendChild(contentContainer);
    }


    async renderCourseDetail(courseId) {
        const container = document.getElementById('app');
        container.innerHTML = '<div class="app-layout"></div>';
        
        const layout = container.querySelector('.app-layout');
        
        // Render header
        this.header = new Header();
        this.header.mount(layout);
        
        // Render sidebar
        const sidebarContainer = document.createElement('div');
        sidebarContainer.className = 'sidebar-container';
        this.sidebar = new Sidebar();
        this.sidebar.mount(sidebarContainer);
        layout.appendChild(sidebarContainer);
        
        // Render course detail
        const contentContainer = document.createElement('div');
        contentContainer.className = 'content-container';
        contentContainer.innerHTML = `
            <div class="course-detail-page">
                <div class="loading-overlay" id="loadingOverlay">
                    <div class="spinner"></div>
                </div>
                <div id="courseDetailContent"></div>
            </div>
        `;
        
        // Load course data
        try {
            const { default: ApiService } = await import('./services/api.service.js');
            const course = await ApiService.getCourse(courseId);
            await this.renderCourseContent(course, contentContainer);
        } catch (error) {
            contentContainer.innerHTML = `
                <div class="empty-state">
                    <h3>Курс не найден</h3>
                    <p>${error.message}</p>
                    <button class="primary-btn" onclick="window.location.hash='#dashboard'">
                        Вернуться к курсам
                    </button>
                </div>
            `;
        }
        
        layout.appendChild(contentContainer);
    }

    async renderCourseContent(course, container) {
        const loadingOverlay = container.querySelector('#loadingOverlay');
        const content = container.querySelector('#courseDetailContent');
        
        content.innerHTML = `
            <div class="course-detail">
                <div class="course-detail-header">
                    <button class="back-btn" onclick="window.location.hash='#dashboard'">
                        <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.42-1.41L7.83 13H20v-2z"/>
                        </svg>
                        Назад
                    </button>
                    <h1>${course.title}</h1>
                    <div class="course-meta">
                        <span class="course-date">${new Date(course.created_at).toLocaleDateString('ru-RU')}</span>
                        ${course.categories && course.categories.length > 0 ? `
                            <div class="course-categories">
                                ${course.categories.map(cat => `<span class="category-tag">${cat}</span>`).join('')}
                            </div>
                        ` : ''}
                    </div>
                </div>
                
                ${course.summary ? `
                    <div class="course-section">
                        <h2>Описание</h2>
                        <p>${course.summary}</p>
                    </div>
                ` : ''}
                
                ${course.videos && course.videos.length > 0 ? `
                    <div class="course-section">
                        <h2>Видео (${course.videos.length})</h2>
                        <div class="video-list">
                            ${course.videos.map((url, idx) => `
                                <div class="video-item">
                                    <a href="${url}" target="_blank" rel="noopener noreferrer">
                                        <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                                            <path d="M8 5v14l11-7z"/>
                                        </svg>
                                        <span>Видео ${idx + 1}</span>
                                    </a>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
                
                ${course.tests && course.tests.length > 0 ? `
                    <div class="course-section">
                        <h2>Тесты (${course.tests.length})</h2>
                        <div class="tests-list">
                            ${course.tests.map((test, idx) => `
                                <div class="test-item">
                                    <h4>Вопрос ${idx + 1}</h4>
                                    <p class="question">${test.question || 'Вопрос не указан'}</p>
                                    ${test.options ? `
                                        <ul class="options">
                                            ${test.options.map((opt, optIdx) => `
                                                <li>${String.fromCharCode(65 + optIdx)}. ${opt}</li>
                                            `).join('')}
                                        </ul>
                                    ` : ''}
                                    ${test.correct_answer ? `
                                        <p class="correct-answer">Правильный ответ: ${test.correct_answer}</p>
                                    ` : ''}
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
        
        loadingOverlay.style.display = 'none';
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const app = new App();
    app.init();
});

export default App;

