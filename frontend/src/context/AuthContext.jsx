// frontend/src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import jwt_decode from 'jwt-decode'; // 我们需要一个小工具来解码 token

// 1. 安装 jwt-decode 库
// 请在终端的 frontend 目录下运行: npm install jwt-decode

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedToken = localStorage.getItem('authToken');
        if (storedToken) {
            try {
                // --- 核心修改：解码 token 并设置 user ---
                const decodedUser = jwt_decode(storedToken);
                setUser(decodedUser);
                setToken(storedToken);
            } catch (error) {
                console.error("Failed to decode token:", error);
                // 如果 token 无效，清理掉
                localStorage.removeItem('authToken');
            }
        }
        setLoading(false);
    }, []);

    const login = (jwtToken) => {
        try {
            const decodedUser = jwt_decode(jwtToken);
            localStorage.setItem('authToken', jwtToken);
            setToken(jwtToken);
            setUser(decodedUser);
        } catch (error) {
            console.error("Failed to decode token on login:", error);
        }
    };

    const logout = () => {
        localStorage.removeItem('authToken');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, isLoading: loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};