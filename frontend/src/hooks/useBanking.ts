import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as bankingApi from '@/api/banking'; // فرض می‌شود تمام توابع API در این فایل هستند
import { BankAccount } from '@/types';
import { toast } from 'sonner';

// کلید کوئری اصلی برای اطلاعات بانکی
const bankingQueryKey = 'bankAccounts';

/**
 * هوک سفارشی برای مدیریت حساب‌های بانکی کاربر
 */
export const useBanking = () => {
    const queryClient = useQueryClient();

    // Query برای دریافت لیست حساب‌های بانکی
    const {
        data: accounts,
        isLoading,
        isError,
        error
    } = useQuery<BankAccount[], Error>({
        queryKey: [bankingQueryKey],
        queryFn: bankingApi.getBankAccounts,
        staleTime: 1000 * 60 * 15, // اطلاعات بانکی به ندرت تغییر می‌کند
    });

    // Mutation برای افزودن یک حساب بانکی جدید
    const { mutate: addAccount, isPending: isAdding } = useMutation({
        mutationFn: (accountData: { iban: string; bankName: string }) => bankingApi.addBankAccount(accountData),
        onSuccess: (newAccount) => {
            // به‌روزرسانی خوش‌بینانه (Optimistic Update)
            queryClient.setQueryData<BankAccount[]>([bankingQueryKey], (oldData = []) => [...oldData, newAccount]);
            toast.success('حساب بانکی جدید با موفقیت اضافه شد.');
        },
        onError: (error) => {
            toast.error((error as any).response?.data?.message || 'خطا در افزودن حساب بانکی');
        },
    });

    // Mutation برای ویرایش یک حساب بانکی
    const { mutate: updateAccount, isPending: isUpdating } = useMutation({
        mutationFn: ({ accountId, data }: { accountId: string; data: { iban: string; bankName: string } }) => bankingApi.updateBankAccount(accountId, data),
        onSuccess: (updatedAccount) => {
            queryClient.setQueryData<BankAccount[]>([bankingQueryKey], (oldData = []) =>
                oldData.map(acc => acc.id === updatedAccount.id ? updatedAccount : acc)
            );
            toast.success('حساب بانکی با موفقیت ویرایش شد.');
        },
        onError: (error) => {
            toast.error((error as any).response?.data?.message || 'خطا در ویرایش حساب بانکی');
        },
    });

    // Mutation برای فعال کردن یک حساب بانکی
    const { mutate: setActiveAccount, isPending: isActivating } = useMutation({
        mutationFn: (accountId: string) => bankingApi.setActiveBankAccount(accountId),
        onSuccess: (updatedAccount) => {
            // به‌روزرسانی لیست حساب‌ها برای نمایش حساب فعال جدید
            queryClient.setQueryData<BankAccount[]>([bankingQueryKey], (oldData = []) =>
                oldData.map(acc => ({ ...acc, isActive: acc.id === updatedAccount.id }))
            );
            toast.success('حساب فعال با موفقیت تغییر کرد.');
        },
        onError: (error) => {
            toast.error((error as any).response?.data?.message || 'خطا در تغییر حساب فعال');
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