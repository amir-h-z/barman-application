import React, { createContext, useState, useContext, useEffect, useCallback, ReactNode } from 'react';
import { User } from '@/types'; // فرض می‌شود تایپ User در این مسیر تعریف شده
import * as authApi from '@/api/auth';

// تعریف نوع داده‌ای که Context نگهداری می‌کند
interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean; // برای نمایش اسپینر هنگام بررسی اولیه توکن
    login: (token: string, userData: User) => void;
    logout: () => void;
}

// ایجاد Context با مقدار اولیه undefined
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// کامپوننت Provider که تمام اپلیکیشن را در بر می‌گیرد
export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true); // در ابتدا در حال بارگذاری هستیم

    // این تابع در اولین رندر اجرا می‌شود تا وضعیت لاگین کاربر را بررسی کند
    const checkAuthState = useCallback(async () => {
        const token = localStorage.getItem('authToken');
        if (token) {
            try {
                // اگر توکن وجود داشت، اطلاعات کاربر را از سرور می‌گیریم
                const userData = await authApi.getMe();
                setUser(userData);
            } catch (error) {
                // اگر توکن معتبر نبود، آن را پاک کرده و کاربر را logout می‌کنیم
                console.error("اعتبارسنجی توکن با خطا مواجه شد:", error);
                localStorage.removeItem('authToken');
                setUser(null);
            }
        }
        setIsLoading(false);
    }, []);

    useEffect(() => {
        checkAuthState();
    }, [checkAuthState]);

    // تابع برای لاگین کردن کاربر
    const login = useCallback((token: string, userData: User) => {
        localStorage.setItem('authToken', token);
        setUser(userData);
    }, []);

    // تابع برای خروج کاربر
    const logout = useCallback(() => {
        localStorage.removeItem('authToken');
        setUser(null);
        // در صورت نیاز می‌توان درخواستی به سرور برای باطل کردن توکن نیز فرستاد
    }, []);

    // مقداری که در سراسر اپلیکیشن در دسترس خواهد بود
    const value: AuthContextType = {
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// یک هوک سفارشی برای استفاده آسان‌تر از این Context
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth باید در داخل AuthProvider استفاده شود');
    }
    return context;
};