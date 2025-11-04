import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createLoad } from '@/api/loads';
import { NewLoadData, Load } from '@/types';
import { toast } from 'sonner';

/**
 * هوک سفارشی برای ایجاد یک بار جدید
 */
export const useCreateLoad = () => {
    const queryClient = useQueryClient();

    const {
        mutate: createNewLoad,
        isPending: isCreating,
        isSuccess,
        isError,
        error,
    } = useMutation<Load, Error, NewLoadData>({
        mutationFn: (loadData: NewLoadData) => createLoad(loadData),

        onSuccess: (newLoad) => {
            toast.success(`بار "${newLoad.cargoType}" با موفقیت ثبت شد.`);

            // پس از ایجاد موفقیت‌آمیز، تمام کوئری‌های مربوط به لیست بارها را باطل (invalidate) می‌کنیم.
            // این کار باعث می‌شود TanStack Query به صورت خودکار لیست بارها را در پس‌زمینه به‌روز کند
            // تا بار جدید در لیست بارهای فعال نمایش داده شود.
            queryClient.invalidateQueries({ queryKey: ['activeLoads'] });

            // همچنین می‌توانیم داده‌های کش شده را به صورت دستی و خوش‌بینانه (optimistically) به‌روز کنیم:
            // queryClient.setQueryData(['activeLoads'], (oldData: Load[] | undefined) => {
            //   return oldData ? [newLoad, ...oldData] : [newLoad];
            // });
        },

        onError: (error) => {
            // نمایش پیام خطا از سرور یا یک پیام عمومی
            const errorMessage = (error as any).response?.data?.message || 'خطا در ثبت بار جدید';
            toast.error(errorMessage);
        },
    });

    return {
        createNewLoad,
        isCreating,
        isSuccess,
        isError,
        error,
    };
};