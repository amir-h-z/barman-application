import { useState } from 'react';
import { RoleSelection } from '@/features/auth/RoleSelection';
import { PhoneInputForm } from '@/features/auth/PhoneInputForm';
import { OtpVerificationForm } from '@/features/auth/OtpVerificationForm';
import { LoginSuccessAnimation } from '@/features/auth/LoginSuccessAnimation';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

// در یک اپلیکیشن واقعی، این مسیرها از یک فایل مرکزی خوانده می‌شوند
const getDashboardPathByRole = (role: string) => {
    switch (role) {
        case 'driver': return '/driver/available-loads';
        case 'cargo-owner': return '/cargo-owner/active-loads';
        case 'transport-company': return '/transport-company/available-loads';
        default: return '/';
    }
};

type LoginStep = 'role-selection' | 'identifier-input' | 'otp-verification' | 'success-animation';

export function LoginPage() {
    const [step, setStep] = useState<LoginStep>('role-selection');
    const [selectedRole, setSelectedRole] = useState<string>('');
    const [identifier, setIdentifier] = useState<string>(''); // Can be phone or email
    const { login } = useAuth(); // هوک احراز هویت

    // شبیه‌سازی هوک‌های useMutation
    const [isSendingOtp, setIsSendingOtp] = useState(false);
    const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);

    const handleRoleSelect = (role: string) => {
        setSelectedRole(role);
        setStep('identifier-input');
    };

    const handleIdentifierSubmit = async (value: string) => {
        setIsSendingOtp(true);
        // TODO: Replace with actual API call from useAuth hook
        // sendLoginRequest({ identifier: value, role: selectedRole });
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIdentifier(value);
        toast.success(`کد تایید به ${value} ارسال شد.`);
        setIsSendingOtp(false);
        setStep('otp-verification');
    };

    const handleOtpVerify = async (otp: string) => {
        setIsVerifyingOtp(true);
        // TODO: Replace with actual API call from useAuth hook
        // verifyLogin({ identifier, otp });
        await new Promise(resolve => setTimeout(resolve, 1500));

        // داده‌های کاربر و توکن از پاسخ API دریافت می‌شود
        const mockUser = { id: '1', role: selectedRole, firstName: 'کاربر', lastName: 'جدید' };
        const mockToken = 'jwt-mock-token';

        login(mockToken, mockUser);
        setIsVerifyingOtp(false);
        setStep('success-animation');
    };

    const handleAnimationComplete = () => {
        // در اینجا به جای useNavigate از window.location استفاده می‌کنیم
        // چون این کامپوننت خارج از روتر اصلی قرار دارد
        window.location.href = getDashboardPathByRole(selectedRole);
    };

    const handleBack = () => {
        if (step === 'identifier-input') {
            setStep('role-selection');
            setSelectedRole('');
        } else if (step === 'otp-verification') {
            setStep('identifier-input');
            setIdentifier('');
        }
    };

    switch (step) {
        case 'role-selection':
            return <RoleSelection onRoleSelect={handleRoleSelect} />;
        case 'identifier-input':
            // TODO: Create a separate EmailInputForm for transport companies
            return <PhoneInputForm onSubmit={handleIdentifierSubmit} onBack={handleBack} />;
        case 'otp-verification':
            return <OtpVerificationForm identifier={identifier} onVerify={handleOtpVerify} onBack={handleBack} isLoading={isVerifyingOtp} />;
        case 'success-animation':
            return <LoginSuccessAnimation isVisible={true} onComplete={handleAnimationComplete} />;
        default:
            return <RoleSelection onRoleSelect={handleRoleSelect} />;
    }
}