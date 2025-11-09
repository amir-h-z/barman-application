import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Phone, AlertTriangle, Navigation, Play, Pause, X, Check } from "lucide-react";
import { LoadingDots } from "@/components/shared/LoadingDots";
import { RouteMap } from "@/components/shared/RouteMap";
import type { Trip } from "@/types";

const MOCK_SINGLE_TRIP: Trip = {
    id: 't1', cargoType: 'میلگرد', price: 30000000, origin: 'اصفهان', destination: 'مشهد', weight: 24, truckType: 'تریلی کفی', date: '1403/09/18', status: 'ongoing', progress: 65, cargoOwnerName: 'فولاد مبارکه',
    originCoords: { lat: 32.6539, lng: 51.6660 }, destinationCoords: { lat: 36.2605, lng: 59.6168 },
    billOfLadingNumber: '123456789', loadingCode: '45821', receiverName: 'شرکت ساختمانی آرمان', receiverPhone: '09151234567',
    destinationAddress: 'مشهد، شهرک صنعتی توس، فاز ۲'
};

interface TripDetailsProps {
    tripId: string;
    onBack: () => void;
    onTripCompleted: (trip: Trip) => void;
}

type TripStage = 'bill-of-lading' | 'loading' | 'in-transit' | 'delivery';

export function TripDetails({ tripId: _tripId, onBack, onTripCompleted }: TripDetailsProps) {
    const trip = MOCK_SINGLE_TRIP;

    const [currentStage, setCurrentStage] = useState<TripStage>('bill-of-lading');
    const [isResting, setIsResting] = useState(false);
    const [showContactDialog, setShowContactDialog] = useState(false);
    const [showProblemDialog, setShowProblemDialog] = useState(false);
    const [deliveryCode, setDeliveryCode] = useState<string[]>(Array(5).fill(''));
    const deliveryInputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleStageChange = async (nextStage: TripStage) => {
        setIsSubmitting(true);
        await new Promise(resolve => setTimeout(resolve, 1200));
        setCurrentStage(nextStage);
        setIsSubmitting(false);
    };

    const handleDeliveryComplete = async () => {
        if (deliveryCode.join('').length !== 5) return;
        setIsSubmitting(true);
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsSubmitting(false);
        onTripCompleted(trip);
    };

    const handleDeliveryCodeChange = (index: number, value: string) => {
        const persianToEnglish = (str: string) => str.replace(/[۰-۹]/g, w => '۰۱۲۳۴۵۶۷۸۹'.indexOf(w).toString());
        const numericValue = persianToEnglish(value).replace(/\D/g, '');

        if (numericValue.length <= 1) {
            const newCode = [...deliveryCode];
            newCode[index] = numericValue;
            setDeliveryCode(newCode);
            if (numericValue && index < 4) {
                deliveryInputRefs.current[index + 1]?.focus();
            }
        }
    };

    const handleDeliveryCodeKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && !deliveryCode[index] && index > 0) {
            deliveryInputRefs.current[index - 1]?.focus();
        }
    };

    const renderStageContent = () => {
        switch (currentStage) {
            case 'bill-of-lading':
                return (
                    <div className="text-center pt-20 space-y-4">
                        <Check className="w-12 h-12 text-green-600 mx-auto" />
                        <h3 className="text-lg font-medium text-green-600">بارنامه صادر شد</h3>
                        <p className="text-sm text-muted-foreground">شماره بارنامه: {trip.billOfLadingNumber}</p>
                        <Button className="w-full h-12 mt-6" onClick={() => handleStageChange('loading')} disabled={isSubmitting}>
                            {isSubmitting ? <LoadingDots /> : 'حرکت به سمت مبدا'}
                        </Button>
                    </div>
                );

            case 'loading':
                return (
                    <div className="flex flex-col justify-between gap-20 pt-10 px-4 h-full">
                        <div className="space-y-6 text-center">
                            <h1 className="text-3xl font-bold">کد بارگیری</h1>
                            <p className="text-base text-muted-foreground leading-relaxed">کد زیر را در محل بارگیری ارائه دهید.</p>
                            <div><span className="text-base text-muted-foreground">محل بارگیری: </span><span className="text-base font-medium">{trip.originAddress}</span></div>
                        </div>
                        <div className="text-3xl font-bold tracking-[1.5rem] text-primary persian-nums text-center">{trip.loadingCode}</div>
                        <div className="px-4 pb-6 mt-auto">
                            <Button className="w-full h-12" onClick={() => handleStageChange('in-transit')} disabled={isSubmitting}>
                                {isSubmitting ? <LoadingDots /> : 'حرکت به سمت مقصد'}
                            </Button>
                        </div>
                    </div>
                );

            case 'in-transit':
                return (
                    <div className="space-y-6 pt-4">
                        <Card><CardContent className="p-0 h-48 rounded-lg overflow-hidden"><RouteMap origin={{ lat: trip.originCoords.lat, lng: trip.originCoords.lng, name: trip.origin }} destination={{ lat: trip.destinationCoords.lat, lng: trip.destinationCoords.lng, name: trip.destination }} progress={trip.progress!} /></CardContent></Card>
                        <div className="grid grid-cols-4 gap-3">
                            <Button variant="outline" size="sm" className="flex flex-col gap-1 h-16" onClick={() => setIsResting(!isResting)}>{isResting ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}<span className="text-xs">استراحت</span></Button>
                            <Button variant="outline" size="sm" className="flex flex-col gap-1 h-16" onClick={() => setShowContactDialog(true)}><Phone className="w-4 h-4" /><span className="text-xs">تماس</span></Button>
                            <Button variant="outline" size="sm" className="flex flex-col gap-1 h-16" onClick={() => setShowProblemDialog(true)}><AlertTriangle className="w-4 h-4" /><span className="text-xs">مشکل</span></Button>
                            <Button variant="outline" size="sm" className="flex flex-col gap-1 h-16"><Navigation className="w-4 h-4" /><span className="text-xs">مسیریاب</span></Button>
                        </div>
                        <Button className="w-full h-12" onClick={() => handleStageChange('delivery')} disabled={isResting || isSubmitting}>
                            {isSubmitting ? <LoadingDots /> : 'رسیدن به مقصد'}
                        </Button>
                    </div>
                );

            case 'delivery':
                return (
                    <div className="space-y-6">
                        <Card className="border-0 shadow-none">
                            <CardContent className="p-6 flex flex-col justify-between gap-12">
                                <div className="space-y-4 text-center">
                                    <h4 className="font-medium">اطلاعات تحویل گیرنده</h4>
                                    <div className="text-sm text-muted-foreground">نام: {trip.receiverName}</div>
                                    <div className="text-sm text-muted-foreground">شماره: {trip.receiverPhone}</div>
                                    <div className="text-sm text-muted-foreground">آدرس: {trip.destinationAddress}</div>
                                </div>
                                <div className="space-y-4">
                                    <label className="text-sm font-medium block text-center">کد تحویل را از تحویل گیرنده دریافت کنید:</label>
                                    <div className="flex justify-center gap-3" dir="ltr">
                                        {[0, 1, 2, 3, 4].map(i => <input key={i} ref={(el) => { deliveryInputRefs.current[i] = el; }} type="text" inputMode="numeric" maxLength={1} value={deliveryCode[i]} onChange={e => handleDeliveryCodeChange(i, e.target.value)} onKeyDown={e => handleDeliveryCodeKeyDown(i, e)} className="w-12 h-14 text-center text-xl font-bold bg-muted rounded-md border focus:border-primary" />)}
                                    </div>
                                </div>
                                <Button className="w-full h-12" onClick={handleDeliveryComplete} disabled={!deliveryCode.every(d => d) || isSubmitting}>
                                    {isSubmitting ? <LoadingDots /> : 'تحویل بار و نهایی کردن'}
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                );
            default: return null;
        }
    };

    const getStageNumber = (stage: TripStage) => ['bill-of-lading', 'loading', 'in-transit', 'delivery'].indexOf(stage) + 1;

    return (
        <div className="min-h-screen bg-background">
            <div className="fixed top-0 left-0 right-0 bg-white border-b z-50">
                <div className="px-4 py-3 flex items-center justify-center relative">
                    <button onClick={onBack} className="absolute right-0 p-1"><X className="w-5 h-5"/></button>
                    <h1 className="text-primary text-base">جزئیات سفر</h1>
                </div>
                <div className="px-4 pb-4">
                    <div className="flex gap-1">
                        {['صدور بارنامه', 'بارگیری', 'در مسیر', 'تحویل بار'].map((label, index) => (
                            <div key={index} className="flex-1 flex flex-col">
                                <div className="relative h-2 rounded-full bg-gray-200 overflow-hidden"><div className={`absolute top-0 right-0 h-full rounded-full bg-primary transition-all duration-500 ${getStageNumber(currentStage) > index ? 'w-full' : 'w-0'}`} /></div>
                                <span className="text-xs mt-2 text-right">{(index + 1)}. {label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="h-full overflow-y-auto p-4 pt-36">{renderStageContent()}</div>

            <Dialog open={showContactDialog} onOpenChange={setShowContactDialog}>
                <DialogContent>
                    <DialogHeader><DialogTitle>تماس</DialogTitle></DialogHeader>
                    <p className="text-center py-4">گزینه‌های تماس در اینجا قرار می‌گیرند.</p>
                </DialogContent>
            </Dialog>
            <Dialog open={showProblemDialog} onOpenChange={setShowProblemDialog}>
                <DialogContent>
                    <DialogHeader><DialogTitle>گزارش مشکل</DialogTitle></DialogHeader>
                    <p className="text-center py-4">فرم گزارش مشکل در اینجا قرار می‌گیرد.</p>
                </DialogContent>
            </Dialog>
        </div>
    );
}