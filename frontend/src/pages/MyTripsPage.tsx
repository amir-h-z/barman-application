import { useNavigate } from 'react-router-dom';
import { TripsList } from '@/features/trips/TripsList';
import { useAuth } from '@/contexts/AuthContext';
import { IncompleteProfileWarning } from '@/features/profile/IncompleteProfileWarning';

export function MyTripsPage() {
    const { user } = useAuth();
    const navigate = useNavigate();

    // اگر اطلاعات کاربر هنوز در دسترس نیست، چیزی رندر نکن
    if (!user) {
        return null; // یا یک کامپوننت لودینگ
    }

    const isProfileComplete = user.isProfileComplete;

    const handleGoToProfile = () => {
        navigate(`/${user.role}/profile`);
    };

    const handleTripSelect = (tripId: string) => {
        navigate(`/${user.role}/trips/${tripId}`);
    };

    if (!isProfileComplete) {
        return <IncompleteProfileWarning userRole={user.role} onGoToProfile={handleGoToProfile} />;
    }

    return (
        <TripsList onTripSelected={handleTripSelect} />
    );
}