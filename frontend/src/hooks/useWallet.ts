import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getWalletBalance, getTransactions, requestWithdrawal, addFundsToWallet } from '@/api/wallet';
import type { WalletBalance, Transaction } from '@/types';
import type { TransactionFilters } from '@/types';
import { toast } from 'sonner';
import type { AxiosError } from 'axios';

const walletBalanceQueryKey = 'walletBalance';
const transactionsQueryKey = 'transactions';

export const useWallet = (filters: Partial<TransactionFilters> = {}) => {
    const queryClient = useQueryClient();

    const {
        data: balance,
        isLoading: isBalanceLoading,
        isError: isBalanceError
    } = useQuery<WalletBalance, Error>({
        queryKey: [walletBalanceQueryKey],
        queryFn: getWalletBalance,
        staleTime: 1000 * 60 * 5,
    });

    const {
        data: transactions,
        isLoading: areTransactionsLoading,
        isError: areTransactionsError,
        refetch: refetchTransactions,
    } = useQuery<Transaction[], Error>({
        queryKey: [transactionsQueryKey, filters],
        queryFn: () => getTransactions(filters),
        staleTime: 1000 * 60,
    });

    const { mutate: withdraw, isPending: isWithdrawing } = useMutation<
        { message: string; transactionId: string },
        AxiosError<{ message: string }>,
        number
    >({
        mutationFn: (amount: number) => requestWithdrawal(amount),
        onSuccess: () => {
            toast.success('درخواست تسویه حساب شما با موفقیت ثبت شد.');
            queryClient.invalidateQueries({ queryKey: [walletBalanceQueryKey] });
            queryClient.invalidateQueries({ queryKey: [transactionsQueryKey] });
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'خطا در تسویه حساب');
        },
    });

    const { mutate: deposit, isPending: isDepositing } = useMutation<
        { paymentUrl: string; message: string },
        AxiosError<{ message: string }>,
        number
    >({
        mutationFn: (amount: number) => addFundsToWallet(amount),
        onSuccess: (data) => {
            if (data.paymentUrl) {
                window.location.href = data.paymentUrl;
            } else {
                toast.success(data.message);
            }
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'خطا در شارژ کیف پول');
        },
    });

    return {
        balance: balance?.amount || 0,
        transactions,
        isLoading: isBalanceLoading || areTransactionsLoading,
        isError: isBalanceError || areTransactionsError,
        refetchTransactions,
        withdraw,
        isWithdrawing,
        deposit,
        isDepositing,
    };
};