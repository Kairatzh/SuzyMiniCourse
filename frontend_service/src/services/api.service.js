// API Service for backend communication
import API_CONFIG from '../config/api.config.js';

class ApiService {
    constructor() {
        this.baseURL = API_CONFIG.BASE_URL;
        this.token = localStorage.getItem('access_token');
    }
    
    get demoMode() {
        return API_CONFIG.DEMO_MODE;
    }

    // Set authentication token
    setToken(token) {
        this.token = token;
        localStorage.setItem('access_token', token);
    }

    // Remove authentication token
    clearToken() {
        this.token = null;
        localStorage.removeItem('access_token');
    }

    // Get authorization headers
    getHeaders(includeAuth = true) {
        const headers = {
            'Content-Type': 'application/json'
        };
        
        if (includeAuth && this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }
        
        return headers;
    }

    // Generic fetch method
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
            const { default: MockService } = await import('./mock.service.js');
            const response = await MockService.login(email, password);
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
            const { default: MockService } = await import('./mock.service.js');
            return await MockService.register(username, email, password);
        }

        return await this.fetch(API_CONFIG.ENDPOINTS.AUTH.REGISTER, {
            method: 'POST',
            body: JSON.stringify({ username, email, password }),
            includeAuth: false
        });
    }

    async getCurrentUser() {
        if (this.demoMode) {
            const { default: MockService } = await import('./mock.service.js');
            return await MockService.getCurrentUser();
        }

        return await this.fetch(API_CONFIG.ENDPOINTS.AUTH.ME);
    }

    // Course methods
    async getAllCourses() {
        if (this.demoMode) {
            const { default: MockService } = await import('./mock.service.js');
            return await MockService.getAllCourses();
        }

        return await this.fetch(API_CONFIG.ENDPOINTS.COURSES.LIST);
    }

    async getMyCourses() {
        if (this.demoMode) {
            const { default: MockService } = await import('./mock.service.js');
            return await MockService.getMyCourses();
        }

        return await this.fetch(API_CONFIG.ENDPOINTS.COURSES.MY_COURSES);
    }

    async getCourse(id) {
        if (this.demoMode) {
            const { default: MockService } = await import('./mock.service.js');
            return await MockService.getCourse(id);
        }

        return await this.fetch(API_CONFIG.ENDPOINTS.COURSES.DETAIL(id));
    }

    async generateCourse(query) {
        if (this.demoMode) {
            const { default: MockService } = await import('./mock.service.js');
            return await MockService.generateCourse(query);
        }

        return await this.fetch(API_CONFIG.ENDPOINTS.COURSES.GENERATE, {
            method: 'POST',
            body: JSON.stringify({ query })
        });
    }

    async deleteCourse(id) {
        if (this.demoMode) {
            const { default: MockService } = await import('./mock.service.js');
            return await MockService.deleteCourse(id);
        }

        return await this.fetch(API_CONFIG.ENDPOINTS.COURSES.DELETE(id), {
            method: 'DELETE'
        });
    }

    async getCourseGraph(courseId = null) {
        if (this.demoMode) {
            const { default: MockService } = await import('./mock.service.js');
            return await MockService.getCourseGraph(courseId);
        }

        const endpoint = courseId 
            ? API_CONFIG.ENDPOINTS.COURSES.GRAPH(courseId)
            : API_CONFIG.ENDPOINTS.COURSES.FULL_GRAPH;
        return await this.fetch(endpoint);
    }
}

// Export singleton instance
export default new ApiService();

