import React, {createContext, useContext, useEffect, useState} from 'react';
import {authAPI} from '../services/api';
import {jwtDecode} from 'jwt-decode';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuthStatus();
    }, []);

    const checkAuthStatus = async () => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setUser(decoded);
            } catch (error) {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
            }
        }
        setLoading(false);
    };

    const login = async (credentials) => {
        try {
            const {access, refresh, user} = await authAPI.login(credentials);


            if (!access || typeof access !== "string") {
                throw new Error("No valid access token returned from server");
            }

            localStorage.setItem('accessToken', access);
            localStorage.setItem('refreshToken', refresh);

            const decoded = jwtDecode(access);
            setUser(decoded);

        } catch (error) {
            console.error("Login error:", error);
            throw error;
        }
    };


    const register = async (userData) => {
        try {
            return await authAPI.register(userData);
        } catch (error) {
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        setUser(null);
    };

    const value = {
        user,
        login,
        register,
        logout,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};