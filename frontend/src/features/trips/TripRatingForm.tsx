import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ArrowRight, Star, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { LoadingDots } from "@/components/shared/LoadingDots";
import type { Trip } from "@/types";

interface TripRatingFormProps {
    trip: Trip;
    userRole: 'driver' | 'cargo-owner'; // نقش کاربری که در حال امتیازدهی است
    onComplete: () => void;
    onBack?: () => void;
}

// کامپوننت داخلی برای ستاره‌های قابل کلیک
const InteractiveStarRating = ({ rating, onRatingChange }: { rating: number; onRatingChange: (r: number) => void }) => (
    <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map(star => (
            <button key={star} type="button" onClick={() => onRatingChange(star)} className="focus:outline-none">
                <Star className={`w-8 h-8 transition-colors ${star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
            </button>
        ))}
    </div>
);

// کامپوننت داخلی برای دکمه‌های نظرات
const CommentCard = ({ comment, isSelected, onToggle, type }: { comment: string; isSelected: boolean; onToggle: () => void; type: 'positive' | 'negative' }) => (
    <button onClick={onToggle} type="button" className={`w-full p-3 rounded-lg border-2 text-sm text-right transition-all ${isSelected ? (type === 'positive' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200') : 'bg-gray-50 border-gray-200'}`}>
        {comment}
    </button>
);

export function TripRatingForm({ trip, userRole, onComplete, onBack }: TripRatingFormProps) {
    const [primaryRating, setPrimaryRating] = useState(0);
    const [companyRating, setCompanyRating] = useState(0);
    const [primaryComment, setPrimaryComment] = useState('');
    const [companyComment, setCompanyComment] = useState('');
    const [primaryPositive, setPrimaryPositive] = useState<string[]>([]);
    const [primaryNegative, setPrimaryNegative] = useState<string[]>([]);
    const [companyPositive, setCompanyPositive] = useState<string[]>([]);
    const [companyNegative, setCompanyNegative] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const isDriver = userRole === 'driver';

    // تعریف گزینه‌ها بر اساس نقش کاربر
    const primaryTargetName = isDriver ? trip.cargoOwnerName : trip.driverName;
    const primaryTargetRole = isDriver ? "صاحب بار" : "راننده";
    const primaryPositiveOptions = isDriver ? ['پیشنهاد قیمتی خوب', 'تطابق اطلاعات بار', 'فرایند سریع بارگیری'] : ["رانندگی ایمن", "برخورد مودبانه", "به موقع بودن"];
    const primaryNegativeOptions = isDriver ? ['قیمت کم', 'عدم تطابق اطلاعات', 'معطلی در بارگیری'] : ["تاخیر در تحویل", "رانندگی نامناسب", "برخورد غیرحرفه‌ای"];

    const companyPositiveOptions = ['صدور سریع بارنامه', 'پشتیبانی کامل'];
    const companyNegativeOptions = ['تاخیر در صدور بارنامه', 'عدم پشتیبانی'];

    const togglePrimaryPositive = (c: string) => setPrimaryPositive(p => p.includes(c) ? p.filter(i => i !== c) : [...p, c]);
    const togglePrimaryNegative = (c: string) => setPrimaryNegative(p => p.includes(c) ? p.filter(i => i !== c) : [...p, c]);
    const toggleCompanyPositive = (c: string) => setCompanyPositive(p => p.includes(c) ? p.filter(i => i !== c) : [...p, c]);
    const toggleCompanyNegative = (c: string) => setCompanyNegative(p => p.includes(c) ? p.filter(i => i !== c) : [...p, c]);

    const handleSubmit = async () => {
        if (primaryRating === 0 || companyRating === 0) {
            toast.error('لطفاً به هر دو بخش امتیاز دهید.');
            return;
        }
        setIsSubmitting(true);
        await new Promise(resolve => setTimeout(resolve, 1500));
        // TODO: Call useSubmitRating hook here
        onComplete();
    };

    return (
        <div className="min-h-screen bg-background">
            <div className="sticky top-0 z-10 bg-background flex items-center justify-between p-4 border-b">
                <Button variant="ghost" size="icon" onClick={onBack || onComplete}><ArrowRight className="w-6 h-6" /></Button>
                <h1 className="text-lg font-medium">ثبت امتیاز</h1>
                <div className="w-10" />
            </div>

            <div className="p-4 space-y-6 pb-24">
                {/* بخش امتیازدهی اصلی (به راننده یا صاحب بار) */}
                <Collapsible defaultOpen>
                    <Card>
                        <CollapsibleTrigger className="w-full p-4 cursor-pointer flex items-center justify-between"><h2 className="text-lg font-medium">امتیاز به {primaryTargetRole}</h2><ChevronDown /></CollapsibleTrigger>
                        <CollapsibleContent>
                            <CardContent className="px-4 pb-4 space-y-6">
                                <div className="flex items-center justify-between"><p className="text-lg">{primaryTargetName}</p><InteractiveStarRating rating={primaryRating} onRatingChange={setPrimaryRating} /></div>
                                <div className="space-y-3"><h3 className="font-medium text-green-700 text-right">نکات مثبت</h3><div className="grid grid-cols-1 gap-2">{primaryPositiveOptions.map(c => <CommentCard key={c} comment={c} isSelected={primaryPositive.includes(c)} onToggle={() => togglePrimaryPositive(c)} type="positive" />)}</div></div>
                                <div className="space-y-3"><h3 className="font-medium text-red-700 text-right">نکات منفی</h3><div className="grid grid-cols-1 gap-2">{primaryNegativeOptions.map(c => <CommentCard key={c} comment={c} isSelected={primaryNegative.includes(c)} onToggle={() => togglePrimaryNegative(c)} type="negative" />)}</div></div>
                                <Textarea placeholder={`نظر شما در مورد ${primaryTargetRole}...`} value={primaryComment} onChange={e => setPrimaryComment(e.target.value)} className="min-h-24" />
                            </CardContent>
                        </CollapsibleContent>
                    </Card>
                </Collapsible>

                {/* بخش امتیازدهی به شرکت حمل و نقل */}
                <Collapsible>
                    <Card>
                        <CollapsibleTrigger className="w-full p-4 cursor-pointer flex items-center justify-between"><h2 className="text-lg font-medium">امتیاز به شرکت حمل و نقل</h2><ChevronDown /></CollapsibleTrigger>
                        <CollapsibleContent>
                            <CardContent className="px-4 pb-4 space-y-6">
                                <div className="flex items-center justify-between"><p className="text-lg">{trip.transportCompany}</p><InteractiveStarRating rating={companyRating} onRatingChange={setCompanyRating} /></div>
                                <div className="space-y-3"><h3 className="font-medium text-green-700 text-right">نکات مثبت</h3><div className="grid grid-cols-1 gap-2">{companyPositiveOptions.map(c => <CommentCard key={c} comment={c} isSelected={companyPositive.includes(c)} onToggle={() => toggleCompanyPositive(c)} type="positive" />)}</div></div>
                                <div className="space-y-3"><h3 className="font-medium text-red-700 text-right">نکات منفی</h3><div className="grid grid-cols-1 gap-2">{companyNegativeOptions.map(c => <CommentCard key={c} comment={c} isSelected={companyNegative.includes(c)} onToggle={() => toggleCompanyNegative(c)} type="negative" />)}</div></div>
                                <Textarea placeholder="نظر شما در مورد شرکت حمل و نقل..." value={companyComment} onChange={e => setCompanyComment(e.target.value)} className="min-h-24" />
                            </CardContent>
                        </CollapsibleContent>
                    </Card>
                </Collapsible>
            </div>

            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t">
                <Button className="w-full h-12" onClick={handleSubmit} disabled={isSubmitting}>
                    {isSubmitting ? <LoadingDots /> : 'ثبت امتیاز'}
                </Button>
            </div>
        </div>
    );
}