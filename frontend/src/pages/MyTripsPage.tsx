import { useNavigate } from 'react-router-dom';
import { TripsList } from '@/features/trips/TripsList';
import { useAuth } from '@/contexts/AuthContext';
import { IncompleteProfileWarning } from '@/features/profile/IncompleteProfileWarning';

export function MyTripsPage() {
    const { user } = useAuth();
    const navigate = useNavigate();

    // در یک اپلیکیشن واقعی، این مقدار باید از آبجکت user که از API می‌آید خوانده شود
    const isProfileComplete = user?.isProfileComplete ?? false;

    const handleGoToProfile = () => {
        if (user?.role) {
            navigate(`/${user.role}/profile`);
        }
    };

    // تابع برای هدایت کاربر به صفحه جزئیات سفر
    const handleTripSelect = (tripId: string) => {
        if (user?.role) {
            navigate(`/${user.role}/trips/${tripId}`);
        }
    };

    // اگر پروفایل کاربر کامل نباشد، اجازه دسترسی به این صفحه را نمی‌دهیم
    if (!isProfileComplete) {
        return <IncompleteProfileWarning onGoToProfile={handleGoToProfile} />;
    }

    return (
        <TripsList onTripSelected={handleTripSelect} />
    );
}