import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle, MessageCircle, Phone, ArrowLeft, ArrowRight } from "lucide-react";
// import { toast } from "sonner";

interface HelpSupportSectionProps {
    userRole: 'driver' | 'cargo-owner' | 'transport-company';
    onBack: () => void;
}

const faqs = {
    driver: [
        { id: 'd1', question: 'چگونه بار جدید پیدا کنم؟', answer: 'در بخش "بارهای موجود" می‌توانید لیست بارها را ببینید و با فیلترها، بار مناسب را پیدا کنید.' },
        { id: 'd2', question: 'چگونه پول خود را دریافت کنم؟', answer: 'پس از تکمیل سفر، مبلغ به کیف پول شما واریز شده و می‌توانید درخواست تسویه حساب دهید.' },
    ],
    'cargo-owner': [
        { id: 'c1', question: 'چگونه بار جدید ثبت کنم؟', answer: 'از طریق دکمه "+" در صفحه "بارهای فعال" می‌توانید فرم ثبت بار را تکمیل کنید.' },
        { id: 'c2', question: 'چگونه وضعیت بارم را پیگیری کنم؟', answer: 'در بخش "بارهای فعال"، روی بار مورد نظر کلیک کرده و گزینه "پیگیری بار" را انتخاب کنید.' },
    ],
    'transport-company': [
        { id: 't1', question: 'چگونه بارنامه صادر کنم؟', answer: 'از بخش "بارهای موجود"، بار را انتخاب کرده و با کلیک روی "صدور بارنامه"، اطلاعات راننده را وارد کنید.' },
        { id: 't2', question: 'آیا می‌توانم بارنامه را ویرایش کنم؟', answer: 'پس از صدور نهایی، بارنامه قابل ویرایش نیست. می‌توانید آن را باطل کرده و مجدداً صادر کنید.' },
    ],
};

export function HelpSupportSection({ userRole, onBack }: HelpSupportSectionProps) {
    const [currentView, setCurrentView] = useState<'main' | 'faq'>('main');
    const relevantFaqs = faqs[userRole];

    if (currentView === 'faq') {
        return (
            <div className="min-h-screen bg-background">
                <div className="fixed top-0 left-0 right-0 bg-white border-b px-4 py-3 z-10">
                    <div className="flex items-center justify-center relative">
                        <button onClick={() => setCurrentView('main')} className="absolute right-0 p-1"><ArrowRight className="w-5 h-5"/></button>
                        <h1 className="text-primary text-base">سوالات متداول</h1>
                    </div>
                </div>
                <div className="pt-20 pb-6 px-4">
                    <Accordion type="single" collapsible className="space-y-3">
                        {relevantFaqs.map(faq => (
                            <AccordionItem key={faq.id} value={faq.id} className="border rounded-lg">
                                <AccordionTrigger className="px-4 text-right hover:no-underline">{faq.question}</AccordionTrigger>
                                <AccordionContent className="px-4 pb-4 text-right text-muted-foreground">{faq.answer}</AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="fixed top-0 left-0 right-0 bg-white border-b px-4 py-3 z-10">
                <div className="flex items-center justify-center relative">
                    <button onClick={onBack} className="absolute right-0 p-1"><ArrowRight className="w-5 h-5"/></button>
                    <h1 className="text-primary text-base">راهنما و پشتیبانی</h1>
                </div>
            </div>
            <div className="pt-20 pb-6 px-4 space-y-6">
                <Button variant="outline" className="w-full flex items-center justify-between p-4 h-auto" onClick={() => setCurrentView('faq')}>
                    <div className="flex items-center gap-3"><HelpCircle className="w-5 h-5"/><span>سوالات متداول</span></div>
                    <ArrowLeft className="w-4 h-4" />
                </Button>
                <Card>
                    <CardHeader><CardTitle className="text-right">تماس با پشتیبانی</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div className="text-sm text-muted-foreground text-right">اگر پاسخ سوال خود را نیافتید، از روش‌های زیر با ما تماس بگیرید:</div>
                        <div className="space-y-3">
                            <Card className="border-green-200 bg-green-50"><CardContent className="p-4 flex items-center justify-between"><div className="flex items-center gap-3"><div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center"><MessageCircle className="w-5 h-5 text-green-600"/></div><div className="text-right"><div className="font-medium">چت آنلاین</div><div className="text-sm text-muted-foreground">پاسخ فوری</div></div></div><Button className="bg-green-600 hover:bg-green-700">شروع چت</Button></CardContent></Card>
                            <Card className="border-blue-200 bg-blue-50"><CardContent className="p-4 flex items-center justify-between"><div className="flex items-center gap-3"><div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center"><Phone className="w-5 h-5 text-blue-600"/></div><div className="text-right"><div className="font-medium">تماس تلفنی</div><div className="text-sm text-muted-foreground">۲۴ ساعته</div></div></div><Button variant="outline" className="border-blue-600 text-blue-600">۰۲۱-۱۲۳۴۵۶۷۸</Button></CardContent></Card>
                        </div>
                        <div className="text-center text-sm text-muted-foreground border-t pt-4">ساعات کاری: شنبه تا پنج‌شنبه ۸ الی ۲۰</div>
                    </CardContent>
                </Card>
                <div className="text-center text-sm text-muted-foreground">نسخه برنامه: ۱.۲.۱۳</div>
            </div>
        </div>
    );
}