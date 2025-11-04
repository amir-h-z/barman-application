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
        data: balanceData,
        isLoading: isBalanceLoading,
        isError: isBalanceError,
        error: balanceError
    } = useQuery<WalletBalance, Error>({
        queryKey: [walletBalanceQueryKey],
        queryFn: getWalletBalance,
        staleTime: 1000 * 60 * 5, // موجودی به مدت ۵ دقیقه تازه است
        refetchOnWindowFocus: true,
    });

    // Query برای دریافت لیست تراکنش‌ها
    const {
        data: transactions,
        isLoading: areTransactionsLoading,
        isError: areTransactionsError,
        error: transactionsError,
        refetch: refetchTransactions,
        isFetching: areTransactionsFetching,
    } = useQuery<Transaction[], Error>({
        queryKey: [transactionsQueryKey, filters],
        queryFn: () => getTransactions(filters),
        staleTime: 1000 * 60, // لیست تراکنش‌ها هر ۱ دقیقه یکبار می‌تواند به‌روز شود
    });

    // Mutation برای درخواست تسویه حساب (برداشت)
    const { mutate: withdraw, isPending: isWithdrawing } = useMutation({
        mutationFn: (amount: number) => requestWithdrawal(amount),
        onSuccess: () => {
            toast.success('درخواست تسویه حساب شما با موفقیت ثبت شد.');
            // پس از درخواست موفق، موجودی و لیست تراکنش‌ها را مجدداً واکشی می‌کنیم
            queryClient.invalidateQueries({ queryKey: [walletBalanceQueryKey] });
            queryClient.invalidateQueries({ queryKey: [transactionsQueryKey] });
        },
        onError: (error) => {
            const errorMessage = (error as any).response?.data?.message || 'خطا در انجام عملیات تسویه حساب';
            toast.error(errorMessage);
        },
    });

    // Mutation برای شارژ کیف پول (واریز)
    const { mutate: deposit, isPending: isDepositing } = useMutation({
        mutationFn: (amount: number) => addFundsToWallet(amount),
        onSuccess: (data) => {
            // اگر API آدرس درگاه پرداخت را برگرداند، کاربر را به آنجا هدایت می‌کنیم
            if (data.paymentUrl) {
                window.location.href = data.paymentUrl;
            } else {
                toast.success(data.message || "درخواست شارژ با موفقیت ثبت شد.");
                // در صورت عدم وجود URL، داده‌های کیف پول را مجدداً واکشی می‌کنیم
                queryClient.invalidateQueries({ queryKey: [walletBalanceQueryKey] });
                queryClient.invalidateQueries({ queryKey: [transactionsQueryKey] });
            }
        },
        onError: (error) => {
            const errorMessage = (error as any).response?.data?.message || 'خطا در فرآیند شارژ کیف پول';
            toast.error(errorMessage);
        },
    });

    return {
        // داده‌ها
        balance: balanceData?.amount ?? 0,
        transactions: transactions ?? [],

        // وضعیت‌های لودینگ
        isLoading: isBalanceLoading || areTransactionsLoading,
        isFetching: areTransactionsFetching,

        // وضعیت‌های خطا
        isError: isBalanceError || areTransactionsError,
        error: balanceError || transactionsError,

        // توابع و وضعیت‌های Mutation
        refetchTransactions,
        withdraw,
        isWithdrawing,
        deposit,
        isDepositing,
    };
};