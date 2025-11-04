import { useMutation, useQueryClient } from '@tanstack/react-query';
import { submitTripRating } from '@/api/trips';
import { RatingPayload } from '@/types';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

/**
 * هوک سفارشی برای ثبت امتیاز یک سفر
 */
export const useSubmitRating = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const {
        mutate: submitRating,
        isPending: isSubmitting,
        isSuccess,
    } = useMutation<any, Error, { tripId: string; ratingData: RatingPayload }>({
        mutationFn: ({ tripId, ratingData }) => submitTripRating(tripId, ratingData),

        onSuccess: (data, variables) => {
            toast.success('امتیاز شما با موفقیت ثبت شد.');

            // پس از ثبت امتیاز، می‌توانیم کوئری مربوط به سفرهای تکمیل شده را باطل کنیم
            // تا اگر بخشی برای نمایش امتیاز وجود دارد، به‌روز شود.
            queryClient.invalidateQueries({ queryKey: ['trips', { status: 'completed' }] });

            // در پروژه اصلی، پس از ثبت امتیاز، کاربر به صفحه اصلی هدایت می‌شد
            // navigate('/dashboard/available-loads'); // به عنوان مثال
        },

        onError: (error) => {
            const errorMessage = (error as any).response?.data?.message || 'خطا در ثبت امتیاز';
            toast.error(errorMessage);
        },
    });

    return {
        submitRating,
        isSubmitting,
        isSuccess,
    };
};