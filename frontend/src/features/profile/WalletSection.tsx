import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Wallet, Calendar, Filter, ArrowUp, ArrowDown, ArrowRight } from "lucide-react";
import type { Transaction } from "@/types"; // Import as type

const MOCK_DRIVER_TRANSACTIONS: Transaction[] = [
    { id: '1', title: 'واریز کرایه سفر #123', amount: 2500000, type: 'income', date: '۱۴۰۳/۰۹/۲۰', status: 'completed' },
    { id: '2', title: 'تسویه حساب', amount: 2000000, type: 'expense', date: '۱۴۰۳/۰۹/۱۹', status: 'completed' },
];
const MOCK_CARGO_OWNER_TRANSACTIONS: Transaction[] = [
    { id: '3', title: 'شارژ کیف پول', amount: 5000000, type: 'income', date: '۱۴۰۳/۰۹/۱۸', status: 'completed' },
    { id: '4', title: 'پرداخت کرایه سفر #456', amount: 1750000, type: 'expense', date: '۱۴۰۳/۰۹/۱۷', status: 'completed' },
];

interface WalletSectionProps {
    userRole: 'driver' | 'cargo-owner' | 'transport-company';
    onBack: () => void;
}

const formatPrice = (price: number) => new Intl.NumberFormat('fa-IR').format(price);

export function WalletSection({ userRole, onBack }: WalletSectionProps) {
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // TODO: این داده‌ها باید از هوک useWallet بیایند
    const walletBalance = userRole === 'driver' ? 2450000 : 3250000;
    const transactions = userRole === 'driver' ? MOCK_DRIVER_TRANSACTIONS : MOCK_CARGO_OWNER_TRANSACTIONS;

    const mainButtonText = userRole === 'cargo-owner' ? 'شارژ کیف پول' : 'تسویه حساب';

    return (
        <div className="min-h-screen bg-background">
            <div className="fixed top-0 left-0 right-0 bg-white border-b px-4 py-3 z-10">
                <div className="flex items-center justify-center relative">
                    <button onClick={onBack} className="absolute right-0 p-1"><ArrowRight className="w-5 h-5"/></button>
                    <h1 className="text-primary text-base">کیف پول</h1>
                </div>
            </div>

            <div className="pt-20 pb-6 px-4 space-y-6">
                <Card className="bg-gradient-to-l from-primary to-primary/80 text-primary-foreground">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="flex items-center gap-2 mb-2"><Wallet className="w-5 h-5" /><span>موجودی کیف پول</span></div>
                                <div className="text-2xl font-bold">{formatPrice(walletBalance)} تومان</div>
                            </div>
                            <Button variant="secondary" className="bg-white text-primary hover:bg-white/90">{mainButtonText}</Button>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="flex items-center gap-2"><Calendar className="w-5 h-5"/>تراکنش ها</CardTitle>
                            <Button variant="outline" size="sm" onClick={() => setIsFilterOpen(true)} className="flex items-center gap-2">
                                <Filter className="w-4 h-4" /> فیلتر
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="space-y-0 max-h-[60vh] overflow-y-auto">
                            {transactions.length > 0 ? (
                                transactions.map((transaction, index) => (
                                    <div key={transaction.id}>
                                        <div className="p-4 flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                {transaction.type === 'income' ? <ArrowDown className="w-4 h-4 text-green-600"/> : <ArrowUp className="w-4 h-4 text-red-600"/>}
                                                <div className={`text-sm font-medium ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                                                    {transaction.type === 'income' ? '+' : '-'}{formatPrice(transaction.amount)} تومان
                                                </div>
                                            </div>
                                            <div className="flex-1 text-right mr-4">
                                                <div className="font-medium text-sm">{transaction.title}</div>
                                                <div className="text-xs text-muted-foreground">{transaction.date}</div>
                                            </div>
                                        </div>
                                        {index < transactions.length - 1 && <div className="border-b mx-4"/>}
                                    </div>
                                ))
                            ) : (
                                <div className="p-8 text-center text-muted-foreground">تراکنشی یافت نشد.</div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <SheetContent side="bottom" className="h-auto rounded-t-2xl">
                    <SheetHeader>
                        <SheetTitle className="text-center">فیلتر تراکنش ها</SheetTitle>
                    </SheetHeader>
                    <div className="p-4 space-y-4">
                        <p className="text-center text-muted-foreground">گزینه‌های فیلتر در اینجا قرار می‌گیرند.</p>
                        <Button className="w-full" onClick={() => setIsFilterOpen(false)}>اعمال فیلتر</Button>
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    );
}