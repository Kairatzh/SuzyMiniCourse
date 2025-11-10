// Course Card Component
export class CourseCard {
    constructor(course) {
        this.course = course;
    }

    render() {
        const createdDate = new Date(this.course.created_at).toLocaleDateString('ru-RU', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });

        return `
            <div class="course-card" data-course-id="${this.course.id}">
                <div class="course-header">
                    <h3 class="course-title">${this.course.title}</h3>
                    <button class="course-menu-btn" onclick="event.stopPropagation()">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                        </svg>
                    </button>
                </div>
                
                <div class="course-meta">
                    <span class="course-date">${createdDate}</span>
                </div>
                
                <p class="course-summary">${this.course.summary || 'Описание отсутствует'}</p>
                
                <div class="course-footer">
                    <div class="course-stats">
                        ${this.course.tests && this.course.tests.length > 0 ? `
                            <span class="stat">
                                <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
                                </svg>
                                ${this.course.tests.length} вопросов
                            </span>
                        ` : ''}
                        ${this.course.videos && this.course.videos.length > 0 ? `
                            <span class="stat">
                                <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                                    <path d="M8 5v14l11-7z"/>
                                </svg>
                                ${this.course.videos.length} видео
                            </span>
                        ` : ''}
                    </div>
                    <div class="course-categories">
                        ${this.course.categories && this.course.categories.length > 0 ? 
                            this.course.categories.map(cat => `
                                <span class="category-tag">${cat}</span>
                            `).join('') : ''
                        }
                    </div>
                </div>
            </div>
        `;
    }

    static renderGrid(courses, container) {
        if (!courses || courses.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <svg viewBox="0 0 24 24" fill="currentColor" width="64" height="64">
                        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                    </svg>
                    <h3>Курсов пока нет</h3>
                    <p>Начните с создания первого курса!</p>
                    <button class="primary-btn" onclick="window.location.hash='#generate'">
                        Создать курс
                    </button>
                </div>
            `;
            return;
        }

        container.innerHTML = courses.map(course => {
            const card = new CourseCard(course);
            return card.render();
        }).join('');

        // Attach click handlers
        container.querySelectorAll('.course-card').forEach(card => {
            card.addEventListener('click', (e) => {
                if (!e.target.closest('.course-menu-btn')) {
                    const courseId = card.dataset.courseId;
                    window.location.hash = `#course/${courseId}`;
                }
            });
        });

        // Attach menu handlers
        container.querySelectorAll('.course-menu-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const card = btn.closest('.course-card');
                this.showCourseMenu(card, btn);
            });
        });
    }

    static showCourseMenu(card, button) {
        const menu = document.createElement('div');
        menu.className = 'course-menu';
        menu.innerHTML = `
            <button class="menu-item">Открыть</button>
            <button class="menu-item">Редактировать</button>
            <button class="menu-item delete-item">Удалить</button>
        `;
        
        document.body.appendChild(menu);
        
        const rect = button.getBoundingClientRect();
        menu.style.position = 'fixed';
        menu.style.top = `${rect.bottom + 5}px`;
        menu.style.left = `${rect.left}px`;
        
        setTimeout(() => menu.classList.add('visible'), 10);

        const handleClick = (e) => {
            if (!menu.contains(e.target)) {
                menu.remove();
                document.removeEventListener('click', handleClick);
            }
        };

        setTimeout(() => document.addEventListener('click', handleClick), 0);

        const deleteBtn = menu.querySelector('.delete-item');
        deleteBtn.addEventListener('click', async () => {
            const courseId = card.dataset.courseId;
            await this.deleteCourse(courseId);
            menu.remove();
            location.reload();
        });
    }

    static async deleteCourse(courseId) {
        try {
            const { default: ApiService } = await import('../services/api.service.js');
            await ApiService.deleteCourse(courseId);
        } catch (error) {
            alert('Ошибка удаления курса: ' + error.message);
        }
    }
}

export default CourseCard;
