import { useQuery } from '@tanstack/react-query';
import { getTripDetails } from '@/api/trips';
import type { Trip } from '@/types';

// کلید کوئری اصلی برای جزئیات سفرها
const tripDetailsQueryKey = 'tripDetails';

/**
 * هوک سفارشی برای دریافت جزئیات کامل یک سفر خاص
 * @param {string | null} tripId - شناسه‌ی یکتا سفر. اگر null باشد، کوئری اجرا نمی‌شود.
 */
export const useTripDetails = (tripId: string | null) => {
    const {
        data: trip,
        isLoading,
        isError,
        error,
        isFetching,
        refetch,
    } = useQuery<Trip, Error>({
        // کلید کوئری شامل ID است تا برای هر سفر، کش جداگانه‌ای وجود داشته باشد
        queryKey: [tripDetailsQueryKey, tripId],

        // تابع واکشی داده که فقط در صورت وجود tripId اجرا می‌شود
        queryFn: () => {
            if (!tripId) {
                return Promise.reject(new Error('شناسه سفر ارائه نشده است.'));
            }
            return getTripDetails(tripId);
        },

        // این گزینه باعث می‌شود کوئری تا زمانی که tripId مقدار معتبری نداشته باشد، اجرا نشود
        enabled: !!tripId,

        // تنظیمات برای بهینه‌سازی
        staleTime: 1000 * 30, // داده‌ها به مدت ۳۰ ثانیه تازه هستند تا پیشرفت سفر سریع‌تر به‌روز شود
        refetchInterval: 1000 * 60, // واکشی مجدد خودکار هر ۱ دقیقه برای به‌روزرسانی موقعیت مکانی
        refetchOnWindowFocus: true,
    });

    return {
        trip,
        isLoading,
        isFetching,
        isError,
        error,
        refetch,
    };
};