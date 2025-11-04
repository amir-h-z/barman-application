import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { BottomNav } from '@/components/shared/BottomNav';
import { useAuth } from '@/contexts/AuthContext';
import { User, Package, Truck } from 'lucide-react';

// تعریف تب‌ها برای هر نقش
const TABS_CONFIG = {
    driver: [
        { id: 'available-loads', label: 'بارهای موجود', icon: Package, path: '/driver/available-loads' },
        { id: 'trips', label: 'بارهای من', icon: Truck, path: '/driver/trips' },
        { id: 'profile', label: 'پروفایل', icon: User, path: '/driver/profile' },
    ],
    'cargo-owner': [
        { id: 'active-loads', label: 'بارهای فعال', icon: Truck, path: '/cargo-owner/active-loads' },
        { id: 'completed-loads', label: 'تکمیل شده', icon: Package, path: '/cargo-owner/completed-loads' },
        { id: 'profile', label: 'پروفایل', icon: User, path: '/cargo-owner/profile' },
    ],
    'transport-company': [
        // ... تب‌های شرکت حمل
    ],
};

export function Dashboard() {
    const { user } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    if (!user || !user.role || !TABS_CONFIG[user.role]) {
        // اگر کاربر یا نقش او مشخص نباشد، به صفحه لاگین هدایت کن
        // این حالت در عمل نباید اتفاق بیفتد چون این صفحه محافظت شده است
        navigate('/login');
        return null;
    }

    const roleTabs = TABS_CONFIG[user.role];

    // پیدا کردن تب فعال بر اساس مسیر فعلی URL
    const activeTab = roleTabs.find(tab => location.pathname.startsWith(tab.path))?.id || roleTabs[0].id;

    const handleTabChange = (tabId: string) => {
        const selectedTab = roleTabs.find(tab => tab.id === tabId);
        if (selectedTab) {
            navigate(selectedTab.path);
        }
    };

    // برخی صفحات مانند جزئیات سفر نباید BottomNav داشته باشند
    const isFullScreenPage = location.pathname.includes('/trips/');

    return (
        <div className="min-h-screen bg-background">
            <main className="pb-24">
                {/* کامپوننت Outlet از React Router صفحه فرزند را در اینجا رندر می‌کند */}
                <Outlet />
            </main>

            {!isFullScreenPage && (
                <BottomNav
                    activeTab={activeTab}
                    tabs={roleTabs}
                    onTabChange={handleTabChange}
                />
            )}
        </div>
    );
}