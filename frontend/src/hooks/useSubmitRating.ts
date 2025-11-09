import { useMutation, useQueryClient } from '@tanstack/react-query';
import { submitTripRating } from '@/api/trips';
import type { RatingPayload } from '@/types';
import { toast } from 'sonner';
// import { useNavigate } from 'react-router-dom';
import type { AxiosError } from 'axios';

/**
 * هوک سفارشی برای ثبت امتیاز یک سفر
 */
export const useSubmitRating = () => {
    const queryClient = useQueryClient();
    // const navigate = useNavigate();

    const {
        mutate: submitRating,
        isPending: isSubmitting,
        isSuccess,
    } = useMutation<
        { message: string },
        AxiosError<{ message: string }>,
        { tripId: string; ratingData: RatingPayload }
    >({
        mutationFn: ({ tripId, ratingData }) => submitTripRating(tripId, ratingData),

        onSuccess: (_data, _variables) => {
            toast.success('امتیاز شما با موفقیت ثبت شد.');

            // پس از ثبت امتیاز، می‌توانیم کوئری مربوط به سفرهای تکمیل شده را باطل کنیم
            // تا اگر بخشی برای نمایش امتیاز وجود دارد، به‌روز شود.
            queryClient.invalidateQueries({ queryKey: ['trips', { status: 'completed' }] });

            // در پروژه اصلی، پس از ثبت امتیاز، کاربر به صفحه اصلی هدایت می‌شد
            // navigate('/dashboard/available-loads'); // به عنوان مثال
        },

        onError: (error) => {
            const errorMessage = error.response?.data?.message || 'خطا در ثبت امتیاز';
            toast.error(errorMessage);
        },
    });

    return {
        submitRating,
        isSubmitting,
        isSuccess,
    };
};