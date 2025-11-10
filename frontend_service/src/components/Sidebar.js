// Sidebar Component
export class Sidebar {
    constructor() {
        this.element = null;
        this.currentView = 'dashboard';
    }

    render() {
        return `
            <aside class="sidebar">
                <div class="sidebar-menu">
                    <a href="#dashboard" class="menu-item" data-view="dashboard">
                        <svg class="menu-icon" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z"/>
                        </svg>
                        Библиотека
                    </a>
                    
                    <a href="#graph" class="menu-item" data-view="graph">
                        <svg class="menu-icon" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M16,11V3H8v6H2v12h20V11H16z M10,5h4v14h-4V5z M4,11h4v8H4V11z M20,19h-4v-6h4V19z"/>
                        </svg>
                        Граф знаний
                    </a>
                    
                    <a href="#community" class="menu-item" data-view="community">
                        <svg class="menu-icon" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
                        </svg>
                        Сообщество
                    </a>
                </div>

                <div class="sidebar-section">
                    <div class="section-title">Недавние запросы</div>
                    <div id="recentQueries" class="recent-queries">
                        <!-- Dynamic content -->
                    </div>
                </div>
            </aside>
        `;
    }

    mount(parent) {
        const template = document.createElement('template');
        template.innerHTML = this.render();
        this.element = template.content.firstElementChild;
        parent.appendChild(this.element);
        this.attachEvents();
        this.setActiveView(this.currentView);
    }

    unmount() {
        if (this.element && this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
    }

    attachEvents() {
        const menuItems = this.element.querySelectorAll('.menu-item');
        menuItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const view = item.dataset.view;
                this.setActiveView(view);
                window.location.hash = `#${view}`;
            });
        });
    }

    setActiveView(view) {
        this.currentView = view;
        const menuItems = this.element.querySelectorAll('.menu-item');
        menuItems.forEach(item => {
            if (item.dataset.view === view) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }

    setRecentQueries(queries) {
        const container = this.element.querySelector('#recentQueries');
        if (container && queries.length > 0) {
            container.innerHTML = queries.slice(0, 5).map(query => `
                <div class="query-item" data-query="${query}">
                    ${query}
                </div>
            `).join('');
        }
    }
}

export default Sidebar;
