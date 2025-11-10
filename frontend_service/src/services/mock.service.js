// Mock Service - Simulates backend responses for demo mode
class MockService {
    constructor() {
        this.mockCourses = [
            {
                id: 1,
                title: "Основы машинного обучения",
                topic: "Machine Learning Basics",
                summary: "Изучите основные концепции машинного обучения, включая алгоритмы классификации, регрессии и кластеризации. Курс включает практические примеры и задания для закрепления материала.",
                user_id: 1,
                created_at: "2025-01-15T10:30:00Z",
                tests: [
                    {
                        question: "Что такое обучение с учителем?",
                        options: ["Алгоритм, который учится на размеченных данных", "Алгоритм без учителя", "Физический учитель"],
                        correct_answer: "Алгоритм, который учится на размеченных данных"
                    },
                    {
                        question: "Что такое нейронная сеть?",
                        options: ["Система взаимосвязанных нейронов", "Простой алгоритм", "База данных"],
                        correct_answer: "Система взаимосвязанных нейронов"
                    },
                    {
                        question: "Что такое overfitting?",
                        options: ["Переобучение модели", "Недообучение модели", "Правильное обучение"],
                        correct_answer: "Переобучение модели"
                    }
                ],
                videos: [
                    "https://youtube.com/watch?v=mock1",
                    "https://youtube.com/watch?v=mock2"
                ],
                categories: ["Programming", "AI"]
            },
            {
                id: 2,
                title: "Python для начинающих",
                topic: "Python Programming",
                summary: "Освойте Python с нуля! От базового синтаксиса до работы с библиотеками. Этот курс идеально подходит для тех, кто только начинает свой путь в программировании.",
                user_id: 1,
                created_at: "2025-01-10T14:20:00Z",
                tests: [
                    {
                        question: "Как объявить список в Python?",
                        options: ["list = []", "array = []", "dict = {}"],
                        correct_answer: "list = []"
                    },
                    {
                        question: "Что делает функция range()?",
                        options: ["Создает список чисел", "Возвращает случайное число", "Считает элементы"],
                        correct_answer: "Создает список чисел"
                    }
                ],
                videos: [
                    "https://youtube.com/watch?v=python1",
                    "https://youtube.com/watch?v=python2",
                    "https://youtube.com/watch?v=python3"
                ],
                categories: ["Programming"]
            },
            {
                id: 3,
                title: "Дизайн интерфейсов",
                topic: "UI/UX Design",
                summary: "Изучите принципы создания красивых и функциональных пользовательских интерфейсов. Узнайте о цветах, типографике, композиции и психологии дизайна.",
                user_id: 1,
                created_at: "2025-01-05T09:00:00Z",
                tests: [
                    {
                        question: "Что такое UX?",
                        options: ["User Experience", "User Explosion", "User Example"],
                        correct_answer: "User Experience"
                    },
                    {
                        question: "Какой цвет ассоциируется со спокойствием?",
                        options: ["Синий", "Красный", "Желтый"],
                        correct_answer: "Синий"
                    }
                ],
                videos: [
                    "https://youtube.com/watch?v=design1"
                ],
                categories: ["Design"]
            },
            {
                id: 4,
                title: "Английский для IT",
                topic: "English for IT",
                summary: "Специализированный курс английского языка для IT-специалистов. Изучите техническую терминологию, улучшите навыки чтения документации и общения с международной командой.",
                user_id: 1,
                created_at: "2025-01-01T12:00:00Z",
                tests: [
                    {
                        question: "Как переводится 'deployment'?",
                        options: ["Развертывание", "Разработка", "Тестирование"],
                        correct_answer: "Развертывание"
                    },
                    {
                        question: "Что означает 'bug'?",
                        options: ["Ошибка в коде", "Функция", "Переменная"],
                        correct_answer: "Ошибка в коде"
                    },
                    {
                        question: "Что такое 'pull request'?",
                        options: ["Запрос на слияние кода", "Удаление кода", "Копирование кода"],
                        correct_answer: "Запрос на слияние кода"
                    }
                ],
                videos: [],
                categories: ["Languages", "IT"]
            },
            {
                id: 5,
                title: "Основы веб-разработки",
                topic: "Web Development Basics",
                summary: "Полный курс по веб-разработке: HTML, CSS, JavaScript. Создайте свой первый сайт с нуля и узнайте основы frontend и backend разработки.",
                user_id: 1,
                created_at: "2024-12-28T16:45:00Z",
                tests: [
                    {
                        question: "Что такое HTML?",
                        options: ["HyperText Markup Language", "High Tech Modern Language", "Home Tool Markup Language"],
                        correct_answer: "HyperText Markup Language"
                    },
                    {
                        question: "Для чего используется CSS?",
                        options: ["Стилизация страниц", "Программирование", "Базы данных"],
                        correct_answer: "Стилизация страниц"
                    }
                ],
                videos: [
                    "https://youtube.com/watch?v=web1",
                    "https://youtube.com/watch?v=web2"
                ],
                categories: ["Web", "Programming"]
            },
            {
                id: 6,
                title: "Data Science основы",
                topic: "Data Science Fundamentals",
                summary: "Введение в мир Data Science. Изучите работу с данными, анализ, визуализацию и машинное обучение на примерах реальных задач.",
                user_id: 1,
                created_at: "2024-12-25T11:30:00Z",
                tests: [
                    {
                        question: "Что такое DataFrame в pandas?",
                        options: ["Двумерная таблица данных", "Одномерный массив", "Словарь"],
                        correct_answer: "Двумерная таблица данных"
                    },
                    {
                        question: "Какой библиотекой создавать графики в Python?",
                        options: ["matplotlib", "pandas", "numpy"],
                        correct_answer: "matplotlib"
                    }
                ],
                videos: [
                    "https://youtube.com/watch?v=ds1",
                    "https://youtube.com/watch?v=ds2",
                    "https://youtube.com/watch?v=ds3"
                ],
                categories: ["Data Science", "Python"]
            }
        ];
    }

    // Simulate network delay
    delay(ms = 500) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Mock login
    async login(email, password) {
        await this.delay();
        return {
            access_token: "mock_jwt_token_demo_mode",
            token_type: "bearer"
        };
    }

    // Mock register
    async register(username, email, password) {
        await this.delay();
        return {
            id: 1,
            username,
            email,
            created_at: new Date().toISOString()
        };
    }

    // Mock get current user
    async getCurrentUser() {
        await this.delay();
        return {
            id: 1,
            username: "demo_user",
            email: "demo@fill.ai",
            created_at: "2025-01-01T00:00:00Z"
        };
    }

    // Mock get all courses
    async getAllCourses() {
        await this.delay();
        return this.mockCourses;
    }

    // Mock get my courses
    async getMyCourses() {
        await this.delay();
        return this.mockCourses;
    }

    // Mock get course
    async getCourse(id) {
        await this.delay();
        const course = this.mockCourses.find(c => c.id === parseInt(id));
        if (!course) {
            throw new Error("Course not found");
        }
        return course;
    }

    // Mock generate course
    async generateCourse(query) {
        await this.delay(2000); // Simulate AI generation time
        
        const newCourse = {
            id: this.mockCourses.length + 1,
            title: query,
            topic: query,
            summary: `Автоматически сгенерированный курс по теме "${query}". Этот курс содержит базовую информацию и примеры для изучения выбранной темы.`,
            user_id: 1,
            created_at: new Date().toISOString(),
            tests: [
                {
                    question: `Что вы узнали о "${query}"?`,
                    options: ["Основы", "Продвинутые концепции", "Экспертный уровень"],
                    correct_answer: "Основы"
                }
            ],
            videos: [
                `https://youtube.com/watch?v=generated_${Date.now()}`
            ],
            categories: ["AI Generated"]
        };

        this.mockCourses.unshift(newCourse); // Add to beginning
        return newCourse;
    }

    // Mock delete course
    async deleteCourse(id) {
        await this.delay();
        const index = this.mockCourses.findIndex(c => c.id === parseInt(id));
        if (index !== -1) {
            this.mockCourses.splice(index, 1);
        }
        return null;
    }

    // Mock get course graph
    async getCourseGraph(courseId = null) {
        await this.delay();
        
        // Generate professional mock graph data for black & white theme
        const nodes = [
            { id: 0, label: "Вы" },
            { id: 1, label: "Программирование" },
            { id: 2, label: "Python" },
            { id: 3, label: "Машинное обучение" },
            { id: 4, label: "Веб-разработка" },
            { id: 5, label: "Дизайн" },
            { id: 6, label: "Языки" },
            { id: 7, label: "Data Science" },
            { id: 8, label: "Frontend" },
            { id: 9, label: "Backend" },
            { id: 10, label: "UI/UX" },
            { id: 11, label: "Английский" }
        ];

        const edges = [
            { from: 0, to: 1 },
            { from: 0, to: 5 },
            { from: 0, to: 6 },
            { from: 1, to: 2 },
            { from: 1, to: 3 },
            { from: 1, to: 4 },
            { from: 2, to: 7 },
            { from: 4, to: 8 },
            { from: 4, to: 9 },
            { from: 5, to: 10 },
            { from: 6, to: 11 }
        ];

        return { nodes, edges };
    }
}

// Export singleton instance
export default new MockService();

