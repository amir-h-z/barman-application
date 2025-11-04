import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { LoginPage } from './pages/LoginPage';
import { Dashboard } from './pages/Dashboard';
import { AvailableLoadsPage } from './pages/AvailableLoadsPage';
import { MyTripsPage } from './pages/MyTripsPage';
import { TripDetailsPage } from './pages/TripDetailsPage';
import { ProfilePage } from './pages/ProfilePage';
import { LoadingDots } from './components/shared/LoadingDots';
import { Toaster } from 'sonner';

// کامپوننت برای محافظت از مسیرها
const ProtectedRoute = () => {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        // هنگام بررسی اولیه توکن، یک صفحه لودینگ نمایش می‌دهیم
        return (
            <div className="flex items-center justify-center h-screen">
                <LoadingDots />
            </div>
        );
    }

    // اگر کاربر احراز هویت نشده بود، به صفحه لاگین هدایت می‌شود
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // در غیر این صورت، کامپوننت فرزند (صفحه مورد نظر) را رندر می‌کند
    return <Outlet />;
};

export default function App() {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    {/* مسیر ورود */}
                    <Route path="/login" element={<LoginPage />} />

                    {/* مسیرهای محافظت‌شده که نیاز به لاگین دارند */}
                    <Route element={<ProtectedRoute />}>
                        {/* لایوت داشبورد برای نقش‌های مختلف */}
                        <Route path="/driver" element={<Dashboard />}>
                            <Route index element={<Navigate to="available-loads" replace />} />
                            <Route path="available-loads" element={<AvailableLoadsPage />} />
                            <Route path="trips" element={<MyTripsPage />} />
                            <Route path="trips/:tripId" element={<TripDetailsPage />} />
                            <Route path="profile" element={<ProfilePage />} />
                        </Route>

                        <Route path="/cargo-owner" element={<Dashboard />}>
                            <Route index element={<Navigate to="active-loads" replace />} />
                            {/* TODO: Add pages for cargo-owner */}
                            {/* <Route path="active-loads" element={<ActiveLoadsPage />} /> */}
                            {/* <Route path="completed-loads" element={<CompletedLoadsPage />} /> */}
                            <Route path="profile" element={<ProfilePage />} />
                        </Route>

                        {/* مسیر پیش‌فرض: اگر کاربر لاگین بود ولی مسیر معتبر نبود، به داشبورد خودش هدایت شود */}
                        {/* این منطق باید در کامپوننت ProtectedRoute تکمیل شود */}
                    </Route>

                    {/* مسیر ریشه: اگر کاربر لاگین است به داشبورد وگرنه به لاگین برود */}
                    <Route path="/" element={<Navigate to="/login" />} />

                    {/* صفحه ۴۰۴ */}
                    <Route path="*" element={<div>صفحه مورد نظر یافت نشد</div>} />
                </Routes>
            </BrowserRouter>
            {/* کامپوننت نمایش اعلان‌ها (Toast) */}
            <Toaster position="top-center" richColors />
        </>
    );
}