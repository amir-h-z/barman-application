import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUserProfile, updateUserProfile } from '@/api/user';
import type { UserProfile } from '@/types';
import { toast } from 'sonner';
import type { AxiosError } from 'axios';

// کلید کوئری برای شناسایی داده‌های پروفایل در کش
const userProfileQueryKey = ['userProfile', 'me'];

export const useUserProfile = () => {
    const queryClient = useQueryClient();

    // Query برای دریافت اطلاعات پروفایل
    const { data: profile, isLoading, isError, error } = useQuery<UserProfile, Error>({
        queryKey: userProfileQueryKey,
        queryFn: getUserProfile,
        // گزینه‌های اضافی برای بهینه‌سازی
        staleTime: 1000 * 60 * 5, // داده‌ها به مدت ۵ دقیقه تازه در نظر گرفته می‌شوند
        refetchOnWindowFocus: false, // جلوگیری از واکشی مجدد هنگام فوکوس روی پنجره
    });

    // Mutation برای به‌روزرسانی پروفایل
    const { mutate: updateProfile, isPending: isUpdating } = useMutation<
        UserProfile,
        AxiosError<{ message: string }>,
        Partial<UserProfile>
    >({
        mutationFn: (updatedData: Partial<UserProfile>) => updateUserProfile(updatedData),
        onSuccess: (updatedProfileData) => {
            // پس از موفقیت، داده‌های کش شده را با اطلاعات جدید به‌روز می‌کنیم
            queryClient.setQueryData(userProfileQueryKey, updatedProfileData);
            toast.success('پروفایل با موفقیت به‌روزرسانی شد.');
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'خطا در به‌روزرسانی پروفایل');
        },
        // می‌توانیم از onMutate برای به‌روزرسانی خوش‌بینانه (Optimistic Update) هم استفاده کنیم
    });

    return {
        profile,
        isLoading,
        isError,
        error,
        updateProfile,
        isUpdating,
    };
};