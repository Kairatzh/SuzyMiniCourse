// Professional Dashboard Page with Tabs: Courses, Graph, Community
export class DashboardPage {
    constructor() {
        this.courses = [];
        this.searchBar = null;
        this.currentTab = 'courses';
        this.graphView = null;
    }

    render() {
        return `
            <div class="dashboard-page">
                <div class="dashboard-header">
                    <h1 class="page-title">Мои курсы</h1>
                    <button class="primary-btn" id="createCourseBtn">
                        <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                        </svg>
                        Новый курс
                    </button>
                </div>

                <div class="dashboard-tabs">
                    <button class="dashboard-tab-btn active" data-tab="courses">
                        <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                            <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z"/>
                        </svg>
                        Мои курсы
                    </button>
                    <button class="dashboard-tab-btn" data-tab="graph">
                        <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                            <path d="M16,11V3H8v6H2v12h20V11H16z M10,5h4v14h-4V5z M4,11h4v8H4V11z M20,19h-4v-6h4V19z"/>
                        </svg>
                        Граф знаний
                    </button>
                    <button class="dashboard-tab-btn" data-tab="community">
                        <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
                        </svg>
                        Сообщество
                    </button>
                </div>

                <!-- Courses Tab Content -->
                <div class="tab-content-panel active" data-panel="courses">
                    <div class="search-container" id="searchContainer">
                        <!-- SearchBar component will be mounted here -->
                    </div>

                    <div class="courses-container">
                        <div class="courses-grid" id="coursesGrid">
                            <!-- Courses will be loaded here -->
                        </div>
                    </div>
                </div>

                <!-- Graph Tab Content -->
                <div class="tab-content-panel" data-panel="graph">
                    <div class="graph-section-container" id="graphContainer">
                        <!-- GraphView component will be mounted here -->
                    </div>
                </div>

                <!-- Community Tab Content -->
                <div class="tab-content-panel" data-panel="community">
                    <div class="community-section" id="communityContainer">
                        <!-- Community will be rendered here -->
                    </div>
                </div>

                <div class="loading-overlay" id="loadingOverlay">
                    <div class="spinner"></div>
                    <p>Загрузка...</p>
                </div>
            </div>
        `;
    }

    async mount(parent) {
        const template = document.createElement('template');
        template.innerHTML = this.render();
        this.element = template.content.firstElementChild;
        parent.appendChild(this.element);
        
        await this.initSearchBar();
        await this.loadCourses();
        this.initTabs();
        this.renderCommunity();
        this.attachEvents();
    }

    unmount() {
        if (this.searchBar) {
            this.searchBar.unmount();
        }
        if (this.graphView) {
            this.graphView.unmount();
        }
        if (this.element && this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
    }

    initTabs() {
        const tabBtns = this.element.querySelectorAll('.dashboard-tab-btn');
        const tabPanels = this.element.querySelectorAll('.tab-content-panel');

        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetTab = btn.dataset.tab;
                this.switchTab(targetTab);
            });
        });
    }

    switchTab(tabName) {
        this.currentTab = tabName;

        // Update buttons
        const tabBtns = this.element.querySelectorAll('.dashboard-tab-btn');
        tabBtns.forEach(btn => {
            if (btn.dataset.tab === tabName) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        // Update panels
        const panels = this.element.querySelectorAll('.tab-content-panel');
        panels.forEach(panel => {
            if (panel.dataset.panel === tabName) {
                panel.classList.add('active');
            } else {
                panel.classList.remove('active');
            }
        });

        // Load graph if switching to graph tab
        if (tabName === 'graph' && !this.graphView) {
            this.loadGraph();
        }
    }

    async loadGraph() {
        const container = this.element.querySelector('#graphContainer');
        container.innerHTML = '';
        
        try {
            const { default: GraphView } = await import('../components/GraphView.js');
            this.graphView = new GraphView();
            await this.graphView.mount(container);
        } catch (error) {
            console.error('Error loading graph:', error);
            container.innerHTML = `
                <div class="empty-state">
                    <h3>Ошибка загрузки графа</h3>
                    <p>Не удалось загрузить граф знаний</p>
                </div>
            `;
        }
    }

    async initSearchBar() {
        const { default: SearchBar } = await import('../components/SearchBar.js');
        
        const container = this.element.querySelector('#searchContainer');
        this.searchBar = new SearchBar(async (query) => {
            await this.generateCourse(query);
        });
        this.searchBar.mount(container);
    }

    attachEvents() {
        const createBtn = this.element.querySelector('#createCourseBtn');
        createBtn.addEventListener('click', () => {
            this.switchTab('courses');
            if (this.searchBar) {
                this.searchBar.focus();
            }
        });
    }

    async loadCourses() {
        const loadingOverlay = this.element.querySelector('#loadingOverlay');
        const coursesGrid = this.element.querySelector('#coursesGrid');
        
        loadingOverlay.style.display = 'flex';

        try {
            const { default: ApiService } = await import('../services/api.service.js');
            this.courses = await ApiService.getMyCourses();
            
            const { default: CourseCard } = await import('../components/CourseCard.js');
            CourseCard.renderGrid(this.courses, coursesGrid);
        } catch (error) {
            console.error('Error loading courses:', error);
            coursesGrid.innerHTML = `
                <div class="empty-state">
                    <h3>Ошибка загрузки</h3>
                    <p>Не удалось загрузить курсы. Попробуйте обновить страницу.</p>
                    <button class="primary-btn" onclick="location.reload()">Обновить</button>
                </div>
            `;
        } finally {
            loadingOverlay.style.display = 'none';
        }
    }

    async generateCourse(query) {
        const loadingOverlay = this.element.querySelector('#loadingOverlay');
        const coursesGrid = this.element.querySelector('#coursesGrid');
        
        loadingOverlay.style.display = 'flex';
        coursesGrid.innerHTML = '';

        try {
            const { default: ApiService } = await import('../services/api.service.js');
            const newCourse = await ApiService.generateCourse(query);
            
            await this.loadCourses();
            this.showNotification('Курс успешно создан!');
            
            // Switch to graph tab to show new course
            setTimeout(() => this.switchTab('graph'), 500);
        } catch (error) {
            console.error('Error generating course:', error);
            this.showNotification('Ошибка создания курса: ' + error.message, 'error');
            await this.loadCourses();
        } finally {
            loadingOverlay.style.display = 'none';
        }
    }

    renderCommunity() {
        const container = this.element.querySelector('#communityContainer');
        
        container.innerHTML = `
            <div class="community-content">
                <div class="community-stats">
                    <div class="stat-card">
                        <div class="stat-icon">👥</div>
                        <div class="stat-details">
                            <div class="stat-number">1,234</div>
                            <div class="stat-label">Активных участников</div>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">💬</div>
                        <div class="stat-details">
                            <div class="stat-number">567</div>
                            <div class="stat-label">Обсуждений</div>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">📚</div>
                        <div class="stat-details">
                            <div class="stat-number">89</div>
                            <div class="stat-label">Опубликованных курсов</div>
                        </div>
                    </div>
                </div>

                <div class="community-main">
                    <div class="community-posts">
                        <div class="post-header">
                            <h3>Последние обсуждения</h3>
                            <button class="primary-btn" id="createPostBtn">
                                <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                                    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                                </svg>
                                Новый пост
                            </button>
                        </div>

                        <div class="posts-list">
                            ${this.renderMockPosts()}
                        </div>
                    </div>

                    <div class="community-sidebar">
                        <div class="sidebar-widget">
                            <h4>Популярные теги</h4>
                            <div class="tags-cloud">
                                <span class="tag">Python</span>
                                <span class="tag">Machine Learning</span>
                                <span class="tag">Web Dev</span>
                                <span class="tag">Design</span>
                                <span class="tag">Data Science</span>
                                <span class="tag">AI</span>
                                <span class="tag">JavaScript</span>
                                <span class="tag">React</span>
                            </div>
                        </div>

                        <div class="sidebar-widget">
                            <h4>Лучшие авторы</h4>
                            <div class="authors-list">
                                <div class="author-item">
                                    <div class="author-avatar">A</div>
                                    <div class="author-info">
                                        <div class="author-name">Alex Petrov</div>
                                        <div class="author-courses">12 курсов</div>
                                    </div>
                                </div>
                                <div class="author-item">
                                    <div class="author-avatar">M</div>
                                    <div class="author-info">
                                        <div class="author-name">Maria Ivanova</div>
                                        <div class="author-courses">9 курсов</div>
                                    </div>
                                </div>
                                <div class="author-item">
                                    <div class="author-avatar">D</div>
                                    <div class="author-info">
                                        <div class="author-name">Dmitry Volkov</div>
                                        <div class="author-courses">7 курсов</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Attach community events
        const createPostBtn = container.querySelector('#createPostBtn');
        createPostBtn.addEventListener('click', () => {
            this.showCreatePostModal();
        });
    }

    renderMockPosts() {
        const posts = [
            {
                id: 1,
                author: "Alex Petrov",
                avatar: "A",
                title: "Лучшие практики изучения Python",
                content: "Хочу поделиться своим опытом изучения Python. Начните с основ и постепенно переходите к сложным концепциям...",
                tags: ["Python", "Обучение"],
                likes: 24,
                comments: 8,
                time: "2 часа назад"
            },
            {
                id: 2,
                author: "Maria Ivanova",
                avatar: "M",
                title: "Новый курс по Machine Learning",
                content: "Только что опубликовал новый курс по основам машинного обучения. Все материалы на русском языке...",
                tags: ["Machine Learning", "Курс"],
                likes: 42,
                comments: 15,
                time: "5 часов назад"
            },
            {
                id: 3,
                author: "Dmitry Volkov",
                avatar: "D",
                title: "Вопрос по нейронным сетям",
                content: "Не могу понять разницу между forward propagation и backpropagation. Кто может объяснить?",
                tags: ["AI", "Вопрос"],
                likes: 18,
                comments: 12,
                time: "1 день назад"
            }
        ];

        return posts.map(post => `
            <div class="post-card">
                <div class="post-author">
                    <div class="post-avatar">${post.avatar}</div>
                    <div class="post-author-info">
                        <div class="post-author-name">${post.author}</div>
                        <div class="post-time">${post.time}</div>
                    </div>
                </div>
                <div class="post-content">
                    <h4 class="post-title">${post.title}</h4>
                    <p class="post-text">${post.content}</p>
                    <div class="post-tags">
                        ${post.tags.map(tag => `<span class="post-tag">#${tag}</span>`).join('')}
                    </div>
                </div>
                <div class="post-actions">
                    <button class="action-btn">
                        <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                        </svg>
                        ${post.likes}
                    </button>
                    <button class="action-btn">
                        <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
                        </svg>
                        ${post.comments}
                    </button>
                    <button class="action-btn">
                        <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                            <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/>
                        </svg>
                        Поделиться
                    </button>
                </div>
            </div>
        `).join('');
    }

    showCreatePostModal() {
        const modal = document.createElement('div');
        modal.className = 'community-modal-overlay';
        modal.innerHTML = `
            <div class="community-modal">
                <div class="community-modal-header">
                    <h2>Создать пост</h2>
                    <button class="modal-close-btn">
                        <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                        </svg>
                    </button>
                </div>
                <div class="community-modal-content">
                    <div class="form-group">
                        <label>Заголовок</label>
                        <input type="text" id="postTitle" placeholder="О чем вы хотите рассказать?">
                    </div>
                    <div class="form-group">
                        <label>Содержание</label>
                        <textarea id="postContent" rows="6" placeholder="Поделитесь своими мыслями..."></textarea>
                    </div>
                    <div class="form-group">
                        <label>Теги</label>
                        <input type="text" id="postTags" placeholder="Python, Machine Learning, AI...">
                    </div>
                    <div class="modal-actions">
                        <button class="secondary-btn modal-cancel-btn">Отмена</button>
                        <button class="primary-btn modal-submit-btn">Опубликовать</button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        const closeModal = () => {
            modal.classList.add('closing');
            setTimeout(() => modal.remove(), 300);
        };

        modal.querySelector('.modal-close-btn').addEventListener('click', closeModal);
        modal.querySelector('.modal-cancel-btn').addEventListener('click', closeModal);
        modal.querySelector('.modal-submit-btn').addEventListener('click', () => {
            this.showNotification('Пост успешно опубликован! (Демо)');
            closeModal();
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });

        setTimeout(() => modal.classList.add('visible'), 10);
    }

    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('visible');
        }, 10);

        setTimeout(() => {
            notification.classList.remove('visible');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

export default DashboardPage;
