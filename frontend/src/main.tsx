import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import App from './App';
import './styles/global.css'; // مسیر فایل استایل‌های عمومی

// یک نمونه از Query Client برای مدیریت کش داده‌ها
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 1, // تلاش مجدد برای واکشی در صورت خطا، فقط یک بار
        },
    },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        {/* فراهم‌کننده کلاینت برای TanStack Query */}
        <QueryClientProvider client={queryClient}>
            {/* فراهم‌کننده وضعیت احراز هویت */}
            <AuthProvider>
                <App />
            </AuthProvider>
        </QueryClientProvider>
    </React.StrictMode>
);