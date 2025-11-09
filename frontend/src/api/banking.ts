import apiClient from './index';
import type { BankAccount } from '@/types';

// دریافت لیست حساب‌های بانکی
export const getBankAccounts = async (): Promise<BankAccount[]> => {
    const response = await apiClient.get('/banking/accounts');
    return response.data;
};

// افزودن حساب جدید
export const addBankAccount = async (accountData: { iban: string; bankName: string }): Promise<BankAccount> => {
    const response = await apiClient.post('/banking/accounts', accountData);
    return response.data;
};

// ویرایش یک حساب
export const updateBankAccount = async (accountId: string, data: { iban: string; bankName: string }): Promise<BankAccount> => {
    const response = await apiClient.put(`/banking/accounts/${accountId}`, data);
    return response.data;
};

// فعال کردن یک حساب به عنوان حساب اصلی
export const setActiveBankAccount = async (accountId: string): Promise<BankAccount> => {
    const response = await apiClient.patch(`/banking/accounts/${accountId}/set-active`);
    return response.data;
};