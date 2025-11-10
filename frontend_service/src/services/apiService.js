// API Service for backend communication
const API_CONFIG = {
  BASE_URL: 'http://localhost:8001/api/v1',
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/users/login',
      REGISTER: '/users/register',
      ME: '/users/me'
    },
    COURSES: {
      LIST: '/courses',
      CREATE: '/courses',
      GENERATE: '/courses/generate',
      DETAIL: (id) => `/courses/${id}`,
      MY_COURSES: '/courses/user/my-courses',
      GRAPH: (id) => `/courses/graph/${id}`,
      FULL_GRAPH: '/courses/graph',
      DELETE: (id) => `/courses/${id}`
    }
  },
  get DEMO_MODE() {
    try {
      // Check if explicitly disabled
      if (localStorage.getItem('demo_mode') === 'false') {
        return false;
      }
      // Enable demo mode by default or if explicitly enabled
      return localStorage.getItem('demo_mode') === 'true' || 
             window.location.search.includes('demo=true') ||
             window.location.search.includes('demo=auto') ||
             // Auto-enable if no backend connection (default behavior)
             true;
    } catch (e) {
      return window.location.search.includes('demo=true') || true;
    }
  }
};

class ApiService {
  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
    this.token = localStorage.getItem('access_token');
  }
  
  get demoMode() {
    return API_CONFIG.DEMO_MODE;
  }

  setToken(token) {
    this.token = token;
    localStorage.setItem('access_token', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('access_token');
  }

  getHeaders(includeAuth = true) {
    const headers = {
      'Content-Type': 'application/json'
    };
    
    if (includeAuth && this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    
    return headers;
  }

  async fetch(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      ...options,
      headers: {
        ...this.getHeaders(options.includeAuth !== false),
        ...options.headers
      }
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: response.statusText }));
        throw new Error(error.detail || 'Request failed');
      }

      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Auth methods
  async login(email, password) {
    if (this.demoMode) {
      const { default: mockService } = await import('./mockService');
      const response = await mockService.login(email, password);
      if (response.access_token) {
        this.setToken(response.access_token);
      }
      return response;
    }

    const formData = new FormData();
    formData.append('username', email);
    formData.append('password', password);
    
    const response = await this.fetch(API_CONFIG.ENDPOINTS.AUTH.LOGIN, {
      method: 'POST',
      headers: {},
      body: formData,
      includeAuth: false
    });

    if (response.access_token) {
      this.setToken(response.access_token);
    }

    return response;
  }

  async register(username, email, password) {
    if (this.demoMode) {
      const { default: mockService } = await import('./mockService');
      return await mockService.register(username, email, password);
    }

    return await this.fetch(API_CONFIG.ENDPOINTS.AUTH.REGISTER, {
      method: 'POST',
      body: JSON.stringify({ username, email, password }),
      includeAuth: false
    });
  }

  async getCurrentUser() {
    if (this.demoMode) {
      const { default: mockService } = await import('./mockService');
      return await mockService.getCurrentUser();
    }

    return await this.fetch(API_CONFIG.ENDPOINTS.AUTH.ME);
  }

  // Course methods
  async getAllCourses() {
    if (this.demoMode) {
      const { default: mockService } = await import('./mockService');
      return await mockService.getAllCourses();
    }

    return await this.fetch(API_CONFIG.ENDPOINTS.COURSES.LIST);
  }

  async getMyCourses() {
    if (this.demoMode) {
      const { default: mockService } = await import('./mockService');
      return await mockService.getMyCourses();
    }

    return await this.fetch(API_CONFIG.ENDPOINTS.COURSES.MY_COURSES);
  }

  async getCourse(id) {
    if (this.demoMode) {
      const { default: mockService } = await import('./mockService');
      return await mockService.getCourse(id);
    }

    return await this.fetch(API_CONFIG.ENDPOINTS.COURSES.DETAIL(id));
  }

  async generateCourse(query) {
    if (this.demoMode) {
      const { default: mockService } = await import('./mockService');
      return await mockService.generateCourse(query);
    }

    return await this.fetch(API_CONFIG.ENDPOINTS.COURSES.GENERATE, {
      method: 'POST',
      body: JSON.stringify({ query })
    });
  }

  async deleteCourse(id) {
    if (this.demoMode) {
      const { default: mockService } = await import('./mockService');
      return await mockService.deleteCourse(id);
    }

    return await this.fetch(API_CONFIG.ENDPOINTS.COURSES.DELETE(id), {
      method: 'DELETE'
    });
  }

  async getCourseGraph(courseId = null) {
    if (this.demoMode) {
      const { default: mockService } = await import('./mockService');
      return await mockService.getCourseGraph(courseId);
    }

    const endpoint = courseId 
      ? API_CONFIG.ENDPOINTS.COURSES.GRAPH(courseId)
      : API_CONFIG.ENDPOINTS.COURSES.FULL_GRAPH;
    return await this.fetch(endpoint);
  }
}

export default new ApiService();

