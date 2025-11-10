// API Configuration
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
    // Demo mode configuration - check on access, not on import
    get DEMO_MODE() {
        try {
            return localStorage.getItem('demo_mode') === 'true' || 
                   window.location.search.includes('demo=true');
        } catch (e) {
            return window.location.search.includes('demo=true');
        }
    }
};

export default API_CONFIG;

