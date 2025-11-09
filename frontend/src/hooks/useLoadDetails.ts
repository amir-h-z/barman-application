import { useQuery } from '@tanstack/react-query';
import { getLoadDetails } from '@/api/loads';
import type { Load } from '@/types';

// کلید کوئری اصلی برای جزئیات بارها
const loadDetailsQueryKey = 'loadDetails';

/**
 * هوک سفارشی برای دریافت جزئیات یک بار خاص
 * @param {string | null} loadId - شناسه‌ی یکتا بار. اگر null باشد، کوئری اجرا نمی‌شود.
 */
export const useLoadDetails = (loadId: string | null) => {
    const {
        data: load,
        isLoading,
        isError,
        error,
        isFetching,
    } = useQuery<Load, Error>({
        // کلید کوئری شامل ID است تا برای هر بار، کش جداگانه‌ای وجود داشته باشد
        queryKey: [loadDetailsQueryKey, loadId],

        // تابع واکشی داده که فقط در صورت وجود loadId اجرا می‌شود
        queryFn: () => {
            if (!loadId) {
                // اگر loadId وجود نداشته باشد، یک Promise رد شده برمی‌گردانیم تا کوئری اجرا نشود
                return Promise.reject(new Error('شناسه بار ارائه نشده است.'));
            }
            return getLoadDetails(loadId);
        },

        // این گزینه باعث می‌شود کوئری تا زمانی که loadId مقدار معتبری نداشته باشد، اجرا نشود
        enabled: !!loadId,

        // تنظیمات برای بهینه‌سازی
        staleTime: 1000 * 60 * 5, // داده‌ها به مدت ۵ دقیقه تازه در نظر گرفته می‌شوند
        refetchOnWindowFocus: true, // هنگام بازگشت به صفحه، اطلاعات را مجدداً بررسی می‌کند
    });

    return {
        load,
        isLoading,
        isFetching,
        isError,
        error,
    };
};