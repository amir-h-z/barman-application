import { useQuery } from '@tanstack/react-query';
import { getTrips } from '@/api/trips';
import { Trip, TripFilters } from '@/types';

// کلید کوئری اصلی برای لیست سفرها
const tripsQueryKey = 'trips';

/**
 * هوک سفارشی برای دریافت لیست سفرهای کاربر با قابلیت فیلتر
 * @param {Partial<TripFilters>} filters - فیلترها مانند وضعیت (status)
 */
export const useTrips = (filters: Partial<TripFilters>) => {
    const {
        data: trips,
        isLoading,
        isError,
        error,
        isFetching,
        refetch,
    } = useQuery<Trip[], Error>({
        // کلید کوئری شامل فیلترها است تا با تغییر فیلتر، کوئری جدیدی اجرا شود
        // مثال: ['trips', { status: 'ongoing' }]
        queryKey: [tripsQueryKey, filters],

        queryFn: () => getTrips(filters),

        // تنظیمات بهینه‌سازی
        staleTime: 1000 * 60 * 2, // داده‌ها به مدت ۲ دقیقه تازه هستند
        refetchOnWindowFocus: true, // برای به‌روزرسانی وضعیت سفرها هنگام بازگشت به اپ
        placeholderData: (previousData) => previousData, // هنگام واکشی مجدد، داده‌های قبلی را نمایش بده
    });

    return {
        trips,
        isLoading,
        isFetching,
        isError,
        error,
        refetch,
    };
};