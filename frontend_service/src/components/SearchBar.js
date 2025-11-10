// Search Bar Component
export class SearchBar {
    constructor(onSubmit) {
        this.onSubmit = onSubmit;
        this.isGenerating = false;
    }

    render() {
        return `
            <div class="search-bar-container">
                <div class="search-bar">
                    <div class="search-icon">
                        <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                        </svg>
                    </div>
                    <input 
                        type="text" 
                        id="queryInput" 
                        placeholder="О чем хотите узнать?"
                        autocomplete="off"
                    />
                    <button class="generate-btn" id="generateBtn" type="submit">
                        <span class="btn-text">Создать</span>
                        <svg class="btn-icon" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                        </svg>
                    </button>
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
        const form = this.element.querySelector('.search-bar');
        const input = this.element.querySelector('#queryInput');
        const button = this.element.querySelector('#generateBtn');

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleSubmit();
        });

        button.addEventListener('click', async (e) => {
            e.preventDefault();
            await this.handleSubmit();
        });

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !this.isGenerating) {
                this.handleSubmit();
            }
        });
    }

    async handleSubmit() {
        if (this.isGenerating) return;

        const input = this.element.querySelector('#queryInput');
        const query = input.value.trim();

        if (!query) {
            this.showError('Пожалуйста, введите запрос');
            return;
        }

        this.setLoading(true);

        try {
            await this.onSubmit(query);
            input.value = '';
        } catch (error) {
            this.showError(error.message || 'Произошла ошибка');
        } finally {
            this.setLoading(false);
        }
    }

    setLoading(isLoading) {
        this.isGenerating = isLoading;
        const button = this.element.querySelector('#generateBtn');
        const input = this.element.querySelector('#queryInput');

        if (isLoading) {
            button.disabled = true;
            button.classList.add('loading');
            input.disabled = true;
        } else {
            button.disabled = false;
            button.classList.remove('loading');
            input.disabled = false;
        }
    }

    showError(message) {
        // Simple error notification
        const notification = document.createElement('div');
        notification.className = 'notification error';
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

    focus() {
        const input = this.element.querySelector('#queryInput');
        if (input) {
            input.focus();
        }
    }
}

export default SearchBar;
