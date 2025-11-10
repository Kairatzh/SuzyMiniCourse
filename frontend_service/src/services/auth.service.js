// Authentication Service
import ApiService from './api.service.js';

class AuthService {
    constructor() {
        this.currentUser = null;
        this.isAuthenticated = false;
        this.listeners = [];
    }

    // Subscribe to auth state changes
    subscribe(listener) {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    // Notify all listeners
    notify() {
        this.listeners.forEach(listener => listener(this.isAuthenticated, this.currentUser));
    }

    // Load user from token if exists
    async init() {
        const token = localStorage.getItem('access_token');
        if (token) {
            try {
                this.currentUser = await ApiService.getCurrentUser();
                this.isAuthenticated = true;
                this.notify();
            } catch (error) {
                this.logout();
            }
        }
    }

    // Login
    async login(email, password) {
        try {
            await ApiService.login(email, password);
            this.currentUser = await ApiService.getCurrentUser();
            this.isAuthenticated = true;
            this.notify();
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Register
    async register(username, email, password) {
        try {
            await ApiService.register(username, email, password);
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Logout
    logout() {
        this.currentUser = null;
        this.isAuthenticated = false;
        ApiService.clearToken();
        this.notify();
    }

    // Get current user
    getUser() {
        return this.currentUser;
    }

    // Check if authenticated
    getIsAuthenticated() {
        return this.isAuthenticated;
    }
}

// Export singleton instance
export default new AuthService();

