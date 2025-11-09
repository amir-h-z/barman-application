import { useState } from 'react';
import { RoleSelection } from '@/features/auth/RoleSelection';
import { PhoneInputForm } from '@/features/auth/PhoneInputForm';
import { OtpVerificationForm } from '@/features/auth/OtpVerificationForm';
import { LoginSuccessAnimation } from '@/features/auth/LoginSuccessAnimation';
import { useAuth } from '@/hooks/useAuth'; // مسیر صحیح است

// این تابع دیگر در اینجا لازم نیست، چون منطق ناوبری به داخل هوک useAuth منتقل شده
// const getDashboardPathByRole = (role: string) => { ... };

type LoginStep = 'role-selection' | 'identifier-input' | 'otp-verification' | 'success-animation';

export function LoginPage() {
    const [step, setStep] = useState<LoginStep>('role-selection');
    const [selectedRole, setSelectedRole] = useState<string>('');
    const [identifier, setIdentifier] = useState<string>('');

    const { sendLoginRequest, isSendingOtp, verifyLogin, isVerifyingOtp } = useAuth();

    const handleRoleSelect = (role: string) => {
        setSelectedRole(role);
        setStep('identifier-input');
    };

    const handleIdentifierSubmit = (value: string) => {
        setIdentifier(value);
        sendLoginRequest(
            { identifier: value, role: selectedRole },
            {
                onSuccess: () => {
                    setStep('otp-verification');
                }
            }
        );
    };

    const handleOtpVerify = (otp: string) => {
        // منطق ناوبری در onSuccess این هوک به صورت خودکار انجام می‌شود
        verifyLogin(
            { identifier, otp },
            {
                onSuccess: () => {
                    // پس از لاگین موفق، انیمیشن را نمایش بده
                    setStep('success-animation');
                }
            }
        );
    };

    const handleAnimationComplete = () => {
        // هوک useAuth خودش کاربر را به مسیر صحیح هدایت می‌کند.
        // اگر می‌خواهید حتما بعد از انیمیشن هدایت شوید، باید منطق navigate را از هوک به اینجا منتقل کنید.
        // فعلا این تابع را خالی می‌گذاریم چون هوک کار را انجام می‌دهد.
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
            // TODO: Create a separate EmailInputForm
            return <PhoneInputForm onSubmit={handleIdentifierSubmit} onBack={handleBack} isLoading={isSendingOtp} />;
        case 'otp-verification':
            return <OtpVerificationForm identifier={identifier} onVerify={handleOtpVerify} onBack={handleBack} isLoading={isVerifyingOtp} />;
        case 'success-animation':
            // توجه: هوک useAuth ممکن است قبل از اتمام انیمیشن کاربر را هدایت کند.
            // برای کنترل بهتر، باید navigate را از هوک useAuth حذف کرده و در onComplete اینجا قرار دهید.
            return <LoginSuccessAnimation isVisible={true} onComplete={handleAnimationComplete} />;
        default:
            return <RoleSelection onRoleSelect={handleRoleSelect} />;
    }
}