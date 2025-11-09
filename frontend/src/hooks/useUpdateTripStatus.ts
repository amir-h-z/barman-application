import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateTripStatus } from '@/api/trips';
import type { Trip } from '@/types';
import type { TripStatus } from '@/types';
import { toast } from 'sonner';
import type { AxiosError } from 'axios';

/**
 * هوک سفارشی برای به‌روزرسانی وضعیت یک سفر
 */
export const useUpdateTripStatus = () => {
    const queryClient = useQueryClient();

    const {
        mutate: updateStatus,
        mutateAsync: updateStatusAsync,
        isPending: isUpdating,
        isSuccess,
    } = useMutation<
        Trip, // TData
        AxiosError<{ message: string }>, // TError
        { tripId: string; status: TripStatus } // TVariables
    >({
        mutationFn: ({ tripId, status }) => updateTripStatus(tripId, status),

        onSuccess: (updatedTripData) => {
            toast.success('وضعیت سفر با موفقیت به‌روزرسانی شد.');

            // به‌روزرسانی داده‌های کش شده برای جزئیات این سفر خاص
            queryClient.setQueryData(['tripDetails', updatedTripData.id], updatedTripData);

            // باطل کردن (invalidate) کوئری لیست سفرها تا لیست نیز به‌روز شود
            queryClient.invalidateQueries({ queryKey: ['trips'] });
        },

        onError: (error) => {
            const errorMessage = error.response?.data?.message || 'خطا در به‌روزرسانی وضعیت سفر';
            toast.error(errorMessage);
        },
    });

    return {
        updateStatus,
        updateStatusAsync,
        isUpdating,
        isSuccess,
    };
};