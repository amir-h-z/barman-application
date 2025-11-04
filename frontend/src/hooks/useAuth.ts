import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom'; // فرض بر استفاده از React Router
import { loginRequest, verifyOtp } from '@/api/auth';
import { useAuth as useAuthContext } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export const useAuth = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { login, logout: contextLogout, user, isAuthenticated, isLoading } = useAuthContext();

    // Mutation برای درخواست ارسال کد تایید
    const { mutate: sendLoginRequest, isPending: isSendingOtp } = useMutation({
        mutationFn: ({ identifier, role }: { identifier: string; role: string }) => loginRequest(identifier, role),
        onSuccess: (data, variables) => {
            toast.success(data.message || 'کد تایید ارسال شد.');
            // می‌توانید کاربر را به صفحه ورود کد هدایت کنید
            // navigate('/verify-otp', { state: { identifier: variables.identifier } });
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'خطا در ارسال کد تایید');
        },
    });

    // Mutation برای تایید کد و ورود نهایی
    const { mutate: verifyLogin, isPending: isVerifyingOtp } = useMutation({
        mutationFn: ({ identifier, otp }: { identifier: string; otp: string }) => verifyOtp(identifier, otp),
        onSuccess: (data) => {
            // استفاده از تابع login از AuthContext برای ذخیره توکن و اطلاعات کاربر
            login(data.token, data.user);
            toast.success('ورود با موفقیت انجام شد.');
            // هدایت کاربر به داشبورد مربوط به نقش او
            navigate(`/${data.user.role}/dashboard`);
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'کد وارد شده نامعتبر است');
        },
    });

    // تابع خروج از حساب کاربری
    const logout = () => {
        contextLogout(); // پاک کردن اطلاعات از context و localStorage
        queryClient.clear(); // پاک کردن تمام داده‌های کش شده
        navigate('/login'); // هدایت به صفحه ورود
        toast.success('با موفقیت از حساب خود خارج شدید.');
    };

    return {
        // وضعیت‌ها
        user,
        isAuthenticated,
        isLoading, // برای بررسی اولیه توکن
        isSendingOtp,
        isVerifyingOtp,

        // توابع
        sendLoginRequest,
        verifyLogin,
        logout,
    };
};