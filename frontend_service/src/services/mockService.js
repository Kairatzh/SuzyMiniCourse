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
        summary: "Освойте Python с нуля! От базового синтаксиса до работы с библиотеками.",
        user_id: 1,
        created_at: "2025-01-10T14:20:00Z",
        tests: [
          {
            question: "Как объявить список в Python?",
            options: ["list = []", "array = []", "dict = {}"],
            correct_answer: "list = []"
          }
        ],
        videos: ["https://youtube.com/watch?v=python1"],
        categories: ["Programming"]
      },
      {
        id: 3,
        title: "Дизайн интерфейсов",
        topic: "UI/UX Design",
        summary: "Изучите принципы создания красивых и функциональных пользовательских интерфейсов.",
        user_id: 1,
        created_at: "2025-01-05T09:00:00Z",
        tests: [],
        videos: [],
        categories: ["Design"]
      },
      {
        id: 4,
        title: "Тренировки",
        topic: "Workouts",
        summary: "Курс по фитнесу и тренировкам.",
        user_id: 1,
        created_at: "2025-01-01T12:00:00Z",
        tests: [],
        videos: [],
        categories: ["Training"]
      },
      {
        id: 5,
        title: "Русский язык",
        topic: "Russian Language",
        summary: "Изучение русского языка.",
        user_id: 1,
        created_at: "2024-12-28T16:45:00Z",
        tests: [],
        videos: [],
        categories: ["Languages"]
      },
      {
        id: 6,
        title: "Английский язык",
        topic: "English Language",
        summary: "Изучение английского языка.",
        user_id: 1,
        created_at: "2024-12-25T11:30:00Z",
        tests: [],
        videos: [],
        categories: ["Languages"]
      }
    ];
  }

  delay(ms = 500) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async login(email, password) {
    await this.delay(100); // Reduced delay for faster initialization
    return {
      access_token: "mock_jwt_token_demo_mode",
      token_type: "bearer"
    };
  }

  async register(username, email, password) {
    await this.delay();
    return {
      id: 1,
      username,
      email,
      created_at: new Date().toISOString()
    };
  }

  async getCurrentUser() {
    await this.delay(100); // Reduced delay for faster initialization
    return {
      id: 1,
      username: "demo_user",
      email: "demo@fill.ai",
      created_at: "2025-01-01T00:00:00Z"
    };
  }

  async getAllCourses() {
    await this.delay();
    return this.mockCourses;
  }

  async getMyCourses() {
    await this.delay();
    return this.mockCourses;
  }

  async getCourse(id) {
    await this.delay();
    const course = this.mockCourses.find(c => c.id === parseInt(id));
    if (!course) {
      throw new Error("Course not found");
    }
    return course;
  }

  async generateCourse(query) {
    await this.delay(2000);
    
    const newCourse = {
      id: this.mockCourses.length + 1,
      title: query,
      topic: query,
      summary: `Автоматически сгенерированный курс по теме "${query}". Этот курс содержит базовую информацию, практические примеры и задания для изучения выбранной темы.`,
      user_id: 1,
      created_at: new Date().toISOString(),
      tests: [
        {
          question: `Что вы узнали о "${query}"?`,
          options: ["Основы", "Продвинутые концепции", "Экспертный уровень"],
          correct_answer: "Основы"
        },
        {
          question: `Какой основной принцип "${query}"?`,
          options: ["Практика", "Теория", "Комбинация теории и практики"],
          correct_answer: "Комбинация теории и практики"
        }
      ],
      videos: [
        `https://youtube.com/watch?v=generated_${Date.now()}`,
        `https://youtube.com/watch?v=generated_${Date.now() + 1}`
      ],
      categories: ["AI Generated", query]
    };

    this.mockCourses.unshift(newCourse);
    
    // Update graph to include new course
    this.updateGraphWithNewCourse(newCourse);
    
    return newCourse;
  }

  updateGraphWithNewCourse(course) {
    // This will be used to update the graph when a new course is generated
    // The graph will be reloaded on the next getCourseGraph call
  }

  async deleteCourse(id) {
    await this.delay();
    const index = this.mockCourses.findIndex(c => c.id === parseInt(id));
    if (index !== -1) {
      this.mockCourses.splice(index, 1);
    }
    return null;
  }

  async getCourseGraph(courseId = null) {
    await this.delay();
    
    // Base graph with user in center
    const nodes = [
      { id: 0, label: "Вы", level: 0, type: "user" },
      { id: 1, label: "RU", level: 1, type: "language" },
      { id: 2, label: "EN", level: 1, type: "language" },
      { id: 3, label: "🌐", level: 1, type: "globe" },
      { id: 4, label: "⭐", level: 1, type: "star" },
      { id: 5, label: "🏋️", level: 1, type: "workout" },
      { id: 6, label: "Тренировки", level: 2, type: "course" },
      { id: 7, label: "Дизайн", level: 2, type: "course" },
      { id: 8, label: "Языки", level: 2, type: "course" }
    ];

    const edges = [
      { from: 0, to: 1 },
      { from: 0, to: 2 },
      { from: 0, to: 3 },
      { from: 0, to: 4 },
      { from: 0, to: 5 },
      { from: 3, to: 1 },
      { from: 3, to: 2 },
      { from: 5, to: 6 },
      { from: 4, to: 7 },
      { from: 3, to: 8 }
    ];

    // Add courses from mockCourses to the graph
    let nodeId = 9;
    const courseNodes = [];
    const courseEdges = [];

    this.mockCourses.forEach((course) => {
      // Skip if already in base nodes
      const existingNode = nodes.find(n => n.label === course.title || n.label === course.topic);
      if (!existingNode && course.title) {
        courseNodes.push({
          id: nodeId,
          label: course.title,
          level: 2,
          type: "course",
          courseId: course.id
        });
        
        // Connect to appropriate parent node based on category
        if (course.categories && course.categories.includes("Languages")) {
          courseEdges.push({ from: 3, to: nodeId }); // Connect to globe
        } else if (course.categories && course.categories.includes("Training")) {
          courseEdges.push({ from: 5, to: nodeId }); // Connect to workout
        } else if (course.categories && course.categories.includes("Design")) {
          courseEdges.push({ from: 4, to: nodeId }); // Connect to star
        } else {
          // Connect to star by default
          courseEdges.push({ from: 4, to: nodeId });
        }
        
        nodeId++;
      }
    });

    return {
      nodes: [...nodes, ...courseNodes],
      edges: [...edges, ...courseEdges]
    };
  }
}

export default new MockService();

