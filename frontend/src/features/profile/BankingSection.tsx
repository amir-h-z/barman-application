import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CreditCard, CheckCircle2, Plus, Edit3, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { LoadingDots } from "@/components/shared/LoadingDots";
import { BankAccount } from "@/types";

interface BankingSectionProps {
    userRole: 'driver' | 'cargo-owner' | 'transport-company';
    onBack: () => void;
}

// TODO: این داده‌های موقت باید از هوک useBanking واکشی شوند
const MOCK_ACCOUNTS: BankAccount[] = [
    { id: '1', iban: 'IR080700010000114366505001', bankName: 'بانک ملت', isActive: true },
    { id: '2', iban: 'IR140570028870010978436594', bankName: 'بانک صادرات', isActive: false },
];

export function BankingSection({ userRole, onBack }: BankingSectionProps) {
    const [bankAccounts, setBankAccounts] = useState<BankAccount[]>(MOCK_ACCOUNTS);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingAccount, setEditingAccount] = useState<BankAccount | null>(null);
    const [newIban, setNewIban] = useState('');
    const [newBankName, setNewBankName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [loadingAccountId, setLoadingAccountId] = useState<string | null>(null);
    const bankNameRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isDialogOpen && editingAccount) {
            bankNameRef.current?.focus();
        }
    }, [isDialogOpen, editingAccount]);

    const formatIban = (iban: string) => iban.replace(/(.{4})/g, '$1 ').trim();

    const handleSetActive = async (accountId: string) => {
        setLoadingAccountId(accountId);
        await new Promise(resolve => setTimeout(resolve, 800)); // شبیه‌سازی API
        setBankAccounts(prev => prev.map(acc => ({ ...acc, isActive: acc.id === accountId })));
        setLoadingAccountId(null);
        toast.success("حساب بانکی فعال تغییر کرد");
    };

    const handleSubmit = async () => {
        if (!newIban || !newBankName) {
            toast.error("لطفاً تمام فیلدها را پر کنید");
            return;
        }
        if (!newIban.toUpperCase().startsWith('IR') || newIban.length !== 26) {
            toast.error("شماره شبا معتبر نیست. باید با IR شروع شده و ۲۶ کاراکتر باشد.");
            return;
        }

        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1000));

        if (editingAccount) { // حالت ویرایش
            setBankAccounts(prev => prev.map(acc => acc.id === editingAccount.id ? { ...acc, iban: newIban.toUpperCase(), bankName: newBankName } : acc));
            toast.success("حساب بانکی به‌روزرسانی شد");
        } else { // حالت افزودن
            const newAccount: BankAccount = { id: Date.now().toString(), iban: newIban.toUpperCase(), bankName: newBankName, isActive: bankAccounts.length === 0 };
            setBankAccounts(prev => [...prev, newAccount]);
            toast.success("حساب بانکی جدید اضافه شد");
        }

        setIsDialogOpen(false);
        setIsLoading(false);
    };

    const openDialog = (account: BankAccount | null) => {
        setEditingAccount(account);
        setNewIban(account ? account.iban : 'IR');
        setNewBankName(account ? account.bankName : '');
        setIsDialogOpen(true);
    };

    const getNoteText = () => {
        switch (userRole) {
            case 'driver': return "پرداخت‌ها به حساب فعال شما واریز خواهد شد. شماره شبا باید متعلق به خودتان باشد.";
            case 'cargo-owner': return "بازپرداخت‌ها به حساب فعال شما انجام خواهد شد. شماره شبا باید متعلق به خودتان یا شرکت باشد.";
            case 'transport-company': return "کمیسیون‌ها به حساب فعال شرکت واریز خواهد شد. شماره شبا باید متعلق به شرکت باشد.";
            default: return "";
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <div className="fixed top-0 left-0 right-0 bg-white border-b px-4 py-3 z-10">
                <div className="flex items-center justify-center relative">
                    <button onClick={onBack} className="absolute right-0 p-1"><ArrowRight className="w-5 h-5"/></button>
                    <h1 className="text-primary text-base">اطلاعات بانکی</h1>
                </div>
            </div>

            <div className="pt-20 pb-6 px-4 space-y-6">
                <Card>
                    <CardHeader><CardTitle className="flex items-center gap-2"><CreditCard className="w-5 h-5"/>حساب های بانکی</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        {bankAccounts.map((account) => (
                            <div key={account.id} className={`p-4 rounded-lg border ${account.isActive ? 'border-green-200 bg-green-50' : 'border-border'}`}>
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium">{account.bankName}</span>
                                        {account.isActive && <div className="flex items-center gap-1 text-green-600 text-sm"><CheckCircle2 className="w-4 h-4"/><span>فعال</span></div>}
                                    </div>
                                    <button onClick={() => openDialog(account)} disabled={!!loadingAccountId}><Edit3 className="w-4 h-4 text-muted-foreground"/></button>
                                </div>
                                <div className="text-sm text-muted-foreground mb-3 font-mono text-left" dir="ltr">{formatIban(account.iban)}</div>
                                {!account.isActive && <Button variant="outline" size="sm" onClick={() => handleSetActive(account.id)} disabled={!!loadingAccountId} className="w-full">{loadingAccountId === account.id ? <LoadingDots/> : 'انتخاب به عنوان حساب فعال'}</Button>}
                            </div>
                        ))}
                        <button onClick={() => openDialog(null)} className="w-full flex items-center justify-center gap-2 p-4 border-2 border-dashed rounded-lg hover:border-primary"><Plus className="w-4 h-4"/>افزودن حساب بانکی</button>
                    </CardContent>
                </Card>
                <Card className="border-amber-200 bg-amber-50"><CardContent className="p-4 text-sm text-amber-800 text-right"><strong>توجه:</strong> {getNoteText()}</CardContent></Card>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader><DialogTitle>{editingAccount ? 'ویرایش حساب' : 'افزودن حساب جدید'}</DialogTitle></DialogHeader>
                    <div className="space-y-4 pt-4">
                        <div className="space-y-2"><Label htmlFor="bankName">نام بانک</Label><Input ref={bankNameRef} id="bankName" value={newBankName} onChange={e => setNewBankName(e.target.value)} disabled={isLoading}/></div>
                        <div className="space-y-2"><Label htmlFor="iban">شماره شبا</Label>
                            <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-mono text-sm">IR</span>
                                <Input id="iban" value={newIban.toUpperCase().replace('IR', '')} onChange={e => setNewIban('IR' + e.target.value.replace(/\D/g, ''))} maxLength={24} dir="ltr" className="font-mono pl-8" disabled={isLoading}/>
                            </div>
                        </div>
                        <div className="flex gap-3 pt-4"><Button variant="outline" onClick={() => setIsDialogOpen(false)} className="flex-1" disabled={isLoading}>لغو</Button><Button onClick={handleSubmit} className="flex-1" disabled={isLoading}>{isLoading ? <LoadingDots/> : (editingAccount ? 'ویرایش' : 'افزودن')}</Button></div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}