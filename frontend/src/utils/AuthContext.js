import React, { createContext, useState, useContext, useEffect } from 'react';
import { login as apiLogin } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is logged in from localStorage
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        
        if (token && storedUser) {
            try {
                setUser({ 
                    token,
                    ...JSON.parse(storedUser)
                });
            } catch (e) {
                // If parsing fails, clear invalid data
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            }
        }
        setLoading(false);
    }, []);

    const login = async (username, password) => {
        try {
            // Always use real authentication
            console.log('Attempting login with:', { username });
            const response = await apiLogin(username, password);
            
            if (response && response.token) {
                localStorage.setItem('token', response.token);
                
                // Store user info
                if (response.user) {
                    localStorage.setItem('user', JSON.stringify(response.user));
                }
                
                setUser({ 
                    token: response.token,
                    ...(response.user || {})
                });
                return true;
            }
            return false;
        } catch (error) {
            console.error('Login failed:', error);
            return false;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}; 