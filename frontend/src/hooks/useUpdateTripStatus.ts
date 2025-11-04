import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateTripStatus } from '@/api/trips';
import { Trip, TripStatus } from '@/types';
import { toast } from 'sonner';

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
    } = useMutation<Trip, Error, { tripId: string; status: TripStatus }>({
        mutationFn: ({ tripId, status }) => updateTripStatus(tripId, status),

        onSuccess: (updatedTripData) => {
            toast.success('وضعیت سفر با موفقیت به‌روزرسانی شد.');

            // به‌روزرسانی داده‌های کش شده برای جزئیات این سفر خاص
            queryClient.setQueryData(['tripDetails', updatedTripData.id], updatedTripData);

            // باطل کردن (invalidate) کوئری لیست سفرها تا لیست نیز به‌روز شود
            // (مثلاً اگر سفر از تب "در حال انجام" به "تکمیل شده" منتقل شود)
            queryClient.invalidateQueries({ queryKey: ['trips'] });
        },

        onError: (error) => {
            const errorMessage = (error as any).response?.data?.message || 'خطا در به‌روزرسانی وضعیت سفر';
            toast.error(errorMessage);
        },
    });

    return {
        updateStatus,
        updateStatusAsync, // نسخه async برای استفاده در توابعی که نیاز به انتظار دارند
        isUpdating,
        isSuccess,
    };
};```

---

### `src/hooks/useWallet.ts`

این هوک برای دریافت اطلاعات کامل کیف پول کاربر، شامل موجودی و تاریخچه تراکنش‌ها، استفاده می‌شود. این هوک از دو کوئری مجزا برای مدیریت بهتر داده‌ها استفاده می‌کند.

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getWalletBalance, getTransactions, requestWithdrawal, addFundsToWallet } from '@/api/wallet';
import { WalletBalance, Transaction, TransactionFilters } from '@/types';
import { toast } from 'sonner';

// کلیدهای کوئری برای شناسایی داده‌ها در کش
const walletBalanceQueryKey = 'walletBalance';
const transactionsQueryKey = 'transactions';

/**
 * هوک سفارشی برای مدیریت کامل کیف پول کاربر
 * @param {Partial<TransactionFilters>} filters - فیلترهای اختیاری برای لیست تراکنش‌ها
 */
export const useWallet = (filters: Partial<TransactionFilters> = {}) => {
    const queryClient = useQueryClient();

    // Query برای دریافت موجودی کیف پول
    const {
        data: balance,
        isLoading: isBalanceLoading,
        isError: isBalanceError
    } = useQuery<WalletBalance, Error>({
        queryKey: [walletBalanceQueryKey],
        queryFn: getWalletBalance,
        staleTime: 1000 * 60 * 5, // موجودی به مدت ۵ دقیقه تازه است
    });

    // Query برای دریافت لیست تراکنش‌ها
    const {
        data: transactions,
        isLoading: areTransactionsLoading,
        isError: areTransactionsError,
        refetch: refetchTransactions,
    } = useQuery<Transaction[], Error>({
        queryKey: [transactionsQueryKey, filters],
        queryFn: () => getTransactions(filters),
        staleTime: 1000 * 60, // لیست تراکنش‌ها هر ۱ دقیقه یکبار می‌تواند به‌روز شود
    });

    // Mutation برای درخواست تسویه حساب
    const { mutate: withdraw, isPending: isWithdrawing } = useMutation({
        mutationFn: (amount: number) => requestWithdrawal(amount),
        onSuccess: () => {
            toast.success('درخواست تسویه حساب شما با موفقیت ثبت شد.');
            // به‌روزرسانی موجودی و لیست تراکنش‌ها پس از درخواست موفق
            queryClient.invalidateQueries({ queryKey: [walletBalanceQueryKey] });
            queryClient.invalidateQueries({ queryKey: [transactionsQueryKey] });
        },
        onError: (error) => {
            toast.error((error as any).response?.data?.message || 'خطا در تسویه حساب');
        },
    });

    // Mutation برای شارژ کیف پول
    const { mutate: deposit, isPending: isDepositing } = useMutation({
        mutationFn: (amount: number) => addFundsToWallet(amount),
        onSuccess: (data) => {
            // هدایت کاربر به درگاه پرداخت
            if (data.paymentUrl) {
                window.location.href = data.paymentUrl;
            } else {
                toast.success(data.message);
            }
        },
        onError: (error) => {
            toast.error((error as any).response?.data?.message || 'خطا در شارژ کیف پول');
        },
    });

    return {
        // داده‌ها و وضعیت‌ها
        balance: balance?.amount || 0,
        transactions,
        isLoading: isBalanceLoading || areTransactionsLoading,
        isError: isBalanceError || areTransactionsError,

        // توابع
        refetchTransactions,
        withdraw,
        isWithdrawing,
        deposit,
        isDepositing,
    };
};