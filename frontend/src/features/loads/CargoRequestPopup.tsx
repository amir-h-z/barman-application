import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { X, Minus, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import type { Driver } from "@/types";

interface CargoRequestPopupProps {
    isOpen: boolean;
    onClose: () => void;
    remainingCapacity: number;
    onSubmit: () => void;
}

// داده‌های موقت رانندگان پاتوقی - در یک اپلیکیشن واقعی این داده‌ها از API دریافت می‌شوند
const patoghDrivers: Driver[] = [
    { id: 'p1', name: 'محمد احمدی', nationalId: 'DR-1234-001' },
    { id: 'p2', name: 'رضا کریمی', nationalId: 'DR-5678-002' },
    { id: 'p3', name: 'علی نوری', nationalId: 'DR-9012-003' },
];

export function CargoRequestPopup({ isOpen, onClose, remainingCapacity, onSubmit }: CargoRequestPopupProps) {
    const [selectedDrivers, setSelectedDrivers] = useState<Driver[]>([]);
    const [usePatoghDrivers, setUsePatoghDrivers] = useState(false);
    const [isDriversOpen, setIsDriversOpen] = useState(false);

    // ظرفیت باقی‌مانده برای انتخاب راننده (راننده فعلی یک ظرفیت را اشغال می‌کند)
    const maxSelectableDrivers = Math.max(0, remainingCapacity - 1);

    const handleClose = () => {
        // ریست کردن تمام state ها هنگام بسته شدن دیالوگ
        setSelectedDrivers([]);
        setUsePatoghDrivers(false);
        setIsDriversOpen(false);
        onClose();
    };

    const toggleDriverSelection = (driver: Driver) => {
        const isSelected = selectedDrivers.some(d => d.id === driver.id);

        if (isSelected) {
            setSelectedDrivers(prev => prev.filter(d => d.id !== driver.id));
        } else {
            if (selectedDrivers.length < maxSelectableDrivers) {
                setSelectedDrivers(prev => [...prev, driver]);
            } else {
                toast.error(`شما فقط می‌توانید ${maxSelectableDrivers} راننده دیگر را انتخاب کنید.`);
            }
        }
    };

    const handleRemoveDriver = (driverId: string) => {
        setSelectedDrivers(prev => prev.filter(driver => driver.id !== driverId));
    };

    const handleSubmit = () => {
        // در اینجا منطق ارسال درخواست به API قرار می‌گیرد
        // که شامل لیستی از رانندگان انتخاب شده است
        onSubmit();
        // نیازی به toast در اینجا نیست چون کامپوننت والد آن را مدیریت می‌کند
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="max-w-md mx-auto rounded-t-xl !z-[10000] [&>button]:hidden">
                <DialogHeader className="text-center">
                    <div className="flex items-center justify-center relative">
                        <DialogTitle className="text-lg">درخواست بار</DialogTitle>
                        <button
                            onClick={handleClose}
                            className="absolute right-0 p-1 hover:bg-muted rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </DialogHeader>

                <div className="space-y-6 pt-4">
                    <div className="flex items-center gap-2 text-right">
                        <Checkbox
                            id="patogh-drivers"
                            checked={usePatoghDrivers}
                            onCheckedChange={(checked) => setUsePatoghDrivers(checked as boolean)}
                        />
                        <label htmlFor="patogh-drivers" className="text-sm cursor-pointer">
                            انتخاب رانندگان پاتوقی
                        </label>
                    </div>

                    {usePatoghDrivers && (
                        <div className="space-y-3">
                            {patoghDrivers.length > 0 ? (
                                <div className="border rounded-lg overflow-hidden bg-background">
                                    <Collapsible open={isDriversOpen} onOpenChange={setIsDriversOpen}>
                                        <CollapsibleTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                className="w-full justify-between text-right h-12 rounded-none hover:bg-muted/50"
                                            >
                        <span className="text-sm">
                          {selectedDrivers.length > 0
                              ? `${selectedDrivers.length} راننده انتخاب شده`
                              : 'انتخاب رانندگان'}
                        </span>
                                                <ChevronDown
                                                    className={`h-4 w-4 opacity-50 transition-transform duration-300 ${isDriversOpen ? 'rotate-180' : ''}`}
                                                />
                                            </Button>
                                        </CollapsibleTrigger>
                                        <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
                                            <div className="bg-background">
                                                {patoghDrivers.map((driver) => {
                                                    const isSelected = selectedDrivers.some(d => d.id === driver.id);
                                                    return (
                                                        <div
                                                            key={driver.id}
                                                            className="flex items-center justify-end gap-3 p-3 hover:bg-muted/50 cursor-pointer transition-colors border-t"
                                                            onClick={() => toggleDriverSelection(driver)}
                                                        >
                                                            <Checkbox
                                                                id={`driver-${driver.id}`}
                                                                checked={isSelected}
                                                                disabled={!isSelected && selectedDrivers.length >= maxSelectableDrivers}
                                                            />
                                                            <label htmlFor={`driver-${driver.id}`} className="flex-1 text-sm cursor-pointer text-right">
                                                                {driver.name}
                                                            </label>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </CollapsibleContent>
                                    </Collapsible>
                                </div>
                            ) : (
                                <div className="border rounded-lg p-4 bg-muted/30 space-y-3 text-center">
                                    <p className="text-sm text-muted-foreground">راننده پاتوقی ثبت نشده است.</p>
                                    <Button
                                        variant="outline"
                                        className="w-full"
                                        onClick={() => toast.info('برای افزودن راننده به بخش حساب کاربری بروید.')}
                                    >
                                        ثبت راننده پاتوقی
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}

                    {selectedDrivers.length > 0 && (
                        <div className="space-y-3">
                            <h4 className="font-medium text-sm text-right">رانندگان انتخاب شده:</h4>
                            <div className="space-y-2">
                                {selectedDrivers.map((driver) => (
                                    <div key={driver.id} className="flex items-center justify-between p-3 bg-muted/50 border rounded-lg">
                                        <Button variant="ghost" size="icon" onClick={() => handleRemoveDriver(driver.id)} className="h-8 w-8 text-destructive hover:bg-destructive/10">
                                            <Minus className="w-4 h-4" />
                                        </Button>
                                        <div className="font-medium text-right">{driver.name}</div>
                                    </div>
                                ))}
                            </div>
                            {maxSelectableDrivers > 0 && (
                                <div className="text-xs text-muted-foreground text-center">
                                    {selectedDrivers.length} از {maxSelectableDrivers} راننده انتخاب شده
                                </div>
                            )}
                        </div>
                    )}

                    <Button className="w-full h-12" onClick={handleSubmit}>
                        ثبت درخواست
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}