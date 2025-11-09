import { AvailableLoads } from '@/features/loads/AvailableLoads';
import { useAuth } from '@/contexts/AuthContext';
import { IncompleteProfileWarning } from '@/features/profile/IncompleteProfileWarning';
import { useNavigate } from 'react-router-dom';

export function AvailableLoadsPage() {
    const { user } = useAuth();
    const navigate = useNavigate();

    if (!user) {
        return null;
    }

    const isProfileComplete = user.isProfileComplete;

    const handleGoToProfile = () => {
        navigate(`/${user.role}/profile`);
    };

    if (!isProfileComplete) {
        return <IncompleteProfileWarning userRole={user.role} onGoToProfile={handleGoToProfile} />;
    }

    return (
        <AvailableLoads />
    );
}