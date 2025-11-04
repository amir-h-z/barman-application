import apiClient from './index';
import { WalletBalance, Transaction, TransactionFilters } from '@/types';


export const getWalletBalance = async (): Promise<WalletBalance> => {
    try {
        const response = await apiClient.get<WalletBalance>('/wallet/balance');
        return response.data;
    } catch (error) {
        console.error('خطا در دریافت موجودی کیف پول:', error);
        throw error;
    }
};


export const getTransactions = async (filters: Partial<TransactionFilters> = {}): Promise<Transaction[]> => {
    try {
        const response = await apiClient.get<Transaction[]>('/wallet/transactions', {
            params: filters,
        });
        return response.data;
    } catch (error) {
        console.error('خطا در دریافت لیست تراکنش‌ها:', error);
        throw error;
    }
};


export const addFundsToWallet = async (amount: number): Promise<{ paymentUrl: string; message: string }> => {
    try {
        const response = await apiClient.post('/wallet/deposit', { amount });
        return response.data;
    } catch (error) {
        console.error('خطا در فرآیند شارژ کیف پول:', error);
        throw error;
    }
};


export const requestWithdrawal = async (amount: number): Promise<{ message: string; transactionId: string }> => {
    try {
        const response = await apiClient.post('/wallet/withdraw', { amount });
        return response.data;
    } catch (error) {
        console.error('خطا در فرآیند تسویه حساب:', error);
        throw error;
    }
};