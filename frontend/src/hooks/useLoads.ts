import { useQuery } from '@tanstack/react-query';
import { getAvailableLoads } from '@/api/loads';
import { Load, LoadFilters } from '@/types';

// کلید کوئری اصلی برای بارهای موجود
const availableLoadsQueryKey = 'availableLoads';

/**
 * هوک سفارشی برای دریافت لیست بارهای موجود با قابلیت فیلتر
 * @param {Partial<LoadFilters>} filters - آبجکت فیلترها
 */
export const useLoads = (filters: Partial<LoadFilters>) => {
    const {
        data: loads,
        isLoading,
        isError,
        error,
        refetch, // برای واکشی مجدد دستی
        isFetching, // برای نمایش لودینگ در حین واکشی مجدد
    } = useQuery<Load[], Error>({
        // کلید کوئری شامل فیلترها است تا با تغییر فیلتر، کوئری جدیدی اجرا شود
        queryKey: [availableLoadsQueryKey, filters],
        queryFn: () => getAvailableLoads(filters),

        // تنظیمات برای بهینه‌سازی
        staleTime: 1000 * 60, // داده‌ها به مدت ۱ دقیقه تازه باقی می‌مانند
        placeholderData: (previousData) => previousData, // هنگام واکشی مجدد، داده‌های قبلی را نمایش بده
    });

    return {
        loads,
        isLoading, // فقط برای اولین بارگیری
        isFetching, // برای هر بار واکشی (شامل refetch)
        isError,
        error,
        refetch,
    };
};