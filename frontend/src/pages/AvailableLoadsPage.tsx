import { AvailableLoads } from '@/features/loads/AvailableLoads';
import { useAuth } from '@/contexts/AuthContext';
import { IncompleteProfileWarning } from '@/features/profile/IncompleteProfileWarning'; // کامپوننت اخطار
import { useNavigate } from 'react-router-dom';

export function AvailableLoadsPage() {
    const { user } = useAuth();
    const navigate = useNavigate();

    // این یک نمونه از منطق بررسی تکمیل بودن پروفایل است
    // در یک اپلیکیشن واقعی، این مقدار از آبجکت user خوانده می‌شود
    const isProfileComplete = user?.isProfileComplete ?? false;

    const handleGoToProfile = () => {
        if (user?.role) {
            navigate(`/${user.role}/profile`);
        }
    };

    // اگر پروفایل کامل نباشد، کامپوننت اخطار را نمایش می‌دهیم
    if (!isProfileComplete) {
        return <IncompleteProfileWarning onGoToProfile={handleGoToProfile} />;
    }

    return (
        // در اینجا می‌توان prop های لازم را به کامپوننت AvailableLoads پاس داد
        <AvailableLoads />
    );
}