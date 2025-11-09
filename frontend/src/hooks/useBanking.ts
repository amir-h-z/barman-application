import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as bankingApi from '@/api/banking'; // فرض می‌شود تمام توابع API در این فایل هستند
import type { BankAccount } from '@/types';
import { toast } from 'sonner';
import type { AxiosError } from 'axios';

// کلید کوئری اصلی برای اطلاعات بانکی
const bankingQueryKey = 'bankAccounts';

export const useBanking = () => {
    const queryClient = useQueryClient();

    const {
        data: accounts,
        isLoading,
        isError,
        error
    } = useQuery<BankAccount[], Error>({
        queryKey: [bankingQueryKey],
        queryFn: bankingApi.getBankAccounts,
        staleTime: 1000 * 60 * 15,
    });

    const { mutate: addAccount, isPending: isAdding } = useMutation<
        BankAccount,
        AxiosError<{ message: string }>,
        { iban: string; bankName: string }
    >({
        mutationFn: (accountData) => bankingApi.addBankAccount(accountData),
        onSuccess: (newAccount) => {
            queryClient.setQueryData<BankAccount[]>([bankingQueryKey], (oldData = []) => [...oldData, newAccount]);
            toast.success('حساب بانکی جدید با موفقیت اضافه شد.');
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'خطا در افزودن حساب بانکی');
        },
    });

    const { mutate: updateAccount, isPending: isUpdating } = useMutation<
        BankAccount,
        AxiosError<{ message: string }>,
        { accountId: string; data: { iban: string; bankName: string } }
    >({
        mutationFn: ({ accountId, data }) => bankingApi.updateBankAccount(accountId, data),
        onSuccess: (updatedAccount) => {
            queryClient.setQueryData<BankAccount[]>([bankingQueryKey], (oldData = []) =>
                oldData.map(acc => acc.id === updatedAccount.id ? updatedAccount : acc)
            );
            toast.success('حساب بانکی با موفقیت ویرایش شد.');
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'خطا در ویرایش حساب بانکی');
        },
    });

    const { mutate: setActiveAccount, isPending: isActivating } = useMutation<
        BankAccount,
        AxiosError<{ message: string }>,
        string
    >({
        mutationFn: (accountId) => bankingApi.setActiveBankAccount(accountId),
        onSuccess: (updatedAccount) => {
            queryClient.setQueryData<BankAccount[]>([bankingQueryKey], (oldData = []) =>
                oldData.map(acc => ({ ...acc, isActive: acc.id === updatedAccount.id }))
            );
            toast.success('حساب فعال با موفقیت تغییر کرد.');
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'خطا در تغییر حساب فعال');
        },
    });

    return {
        accounts: accounts ?? [],
        isLoading,
        isError,
        error,

        addAccount,
        isAdding,

        updateAccount,
        isUpdating,

        setActiveAccount,
        isActivating,
    };
};