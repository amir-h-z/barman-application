import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Copy, Share2, X } from "lucide-react";
import { toast } from "sonner";
import { Load } from "@/types";

interface LoadDetailsSheetProps {
    load: Load | null;
    isOpen: boolean;
    onClose: () => void;
    onRequestCargo: (load: Load) => void;
    onShare: (load: Load) => void;
}

const formatPrice = (price: number): string => {
    return price.toLocaleString() + ' تومان';
};

// این تابع برای تولید کد بار از پروژه اصلی استخراج شده است
const generateLoadCode = (loadId: string): string => {
    const codes = [
        'BR-2024-A7X9M', 'LD-3481-K2V5N', 'CG-5672-Q8W3P',
        'TR-7893-L9R4S', 'FR-4521-M6T8Y', 'BD-9876-N3U7Z',
        'LG-1234-P5V9X', 'MX-5678-R2W6J', 'CP-8901-T4H2K',
        'RX-3456-Y7B9L', 'WQ-6789-S1N8V'
    ];
    return codes[parseInt(loadId) % codes.length];
};

export function LoadDetailsSheet({
                                     load,
                                     isOpen,
                                     onClose,
                                     onRequestCargo,
                                     onShare,
                                 }: LoadDetailsSheetProps) {
    if (!load) return null;

    const handleCopyCode = () => {
        const code = generateLoadCode(load.id);
        navigator.clipboard.writeText(code);
        toast.success('کد بار کپی شد');
    };

    return (
        <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <SheetContent side="bottom" className="max-h-[80vh] p-0 flex flex-col rounded-t-xl !z-[50]">
                {/* هدر ثابت */}
                <SheetHeader className="p-6 pb-4 flex-shrink-0 border-b border-border">
                    <div className="relative flex items-center justify-center">
                        <SheetTitle className="text-lg text-center">جزئیات بار</SheetTitle>
                        <button onClick={onClose} className="absolute right-0 p-1">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    <SheetDescription className="sr-only">
                        نمایش جزئیات کامل بار انتخاب شده
                    </SheetDescription>
                </SheetHeader>

                {/* محتوای اسکرول‌خور */}
                <div className="flex-1 overflow-y-auto scrollbar-hide">
                    <div className="p-6">
                        <div className="space-y-6">
                            {/* نوع بار و نوع کاربری */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="text-right">
                                    <span className="text-sm text-muted-foreground block mb-1">نوع بار</span>
                                    <span className="font-medium">{load.cargoType}</span>
                                </div>
                                <div className="text-right">
                                    <span className="text-sm text-muted-foreground block mb-1">نوع کاربری</span>
                                    <span className="font-medium">{load.truckType}</span>
                                </div>
                            </div>

                            {/* قیمت و وزن */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="text-right">
                                    <span className="text-sm text-muted-foreground block mb-1">قیمت</span>
                                    <span className="font-bold text-primary">{formatPrice(load.price)}</span>
                                </div>
                                <div className="text-right">
                                    <span className="text-sm text-muted-foreground block mb-1">وزن</span>
                                    <span className="font-medium">{load.weight} تن</span>
                                </div>
                            </div>

                            {/* کد بار */}
                            <div className="text-right">
                                <span className="text-sm text-muted-foreground block mb-2">کد بار</span>
                                <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
                                    <p className="flex-1 font-medium text-primary text-center tracking-wider">
                                        {generateLoadCode(load.id)}
                                    </p>
                                    <button onClick={handleCopyCode} className="p-1 hover:bg-gray-200 rounded transition-colors">
                                        <Copy className="w-4 h-4 text-muted-foreground" />
                                    </button>
                                </div>
                            </div>

                            {/* مبدا و مقصد */}
                            <div className="text-right">
                                <span className="text-sm text-muted-foreground block mb-2">مبدا</span>
                                <p className="font-medium leading-relaxed">
                                    {[load.originProvince, load.originCity, load.originSquare, load.originStreet, load.originAlley].filter(Boolean).join('، ')}
                                </p>
                            </div>
                            <div className="text-right">
                                <span className="text-sm text-muted-foreground block mb-2">مقصد</span>
                                <p className="font-medium leading-relaxed">
                                    {[load.destinationProvince, load.destinationCity, load.destinationSquare, load.destinationStreet, load.destinationAlley].filter(Boolean).join('، ')}
                                </p>
                            </div>

                            {/* توضیحات */}
                            <div className="text-right">
                                <span className="text-sm text-muted-foreground block mb-2">توضیحات</span>
                                <p className="text-sm leading-relaxed">{load.description}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* فوتر ثابت با دکمه‌ها */}
                <div className="p-6 pt-4 flex-shrink-0 bg-background border-t">
                    <div className="flex gap-3">
                        <Button className="flex-1" onClick={() => onRequestCargo(load)}>
                            <span>درخواست بار</span>
                        </Button>
                        <Button variant="outline" className="px-3" onClick={() => onShare(load)}>
                            <Share2 className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}