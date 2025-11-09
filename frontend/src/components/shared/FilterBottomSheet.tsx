import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
//import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, X } from "lucide-react";
import { format } from "date-fns";
import type { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { LoadingDots } from "./LoadingDots";


interface Filters {
    dateRange: { from?: Date; to?: Date };
    priceRange: [number, number];
    truckType: string;
    cargoType: string;
    weightRange: [number, number];
    origin: string;
    destination: string;
}

interface FilterBottomSheetProps {
    isOpen: boolean;
    onClose: () => void;
    filters: Filters;
    onFiltersChange: (filters: Filters) => void;
}

export function FilterBottomSheet({ isOpen, onClose, filters, onFiltersChange }: FilterBottomSheetProps) {
    const [tempFilters, setTempFilters] = useState<Filters>(filters);
    const [showDateCalendar, setShowDateCalendar] = useState(false);
    const [isApplying, setIsApplying] = useState(false);

    const formatPrice = (price: number) => {
        return price.toLocaleString() + ' تومان';
    };

    const hasActiveFilters = () => {
        return (
            tempFilters.dateRange.from ||
            tempFilters.dateRange.to ||
            tempFilters.priceRange[0] > 0 ||
            tempFilters.priceRange[1] < 100000000 ||
            tempFilters.truckType ||
            tempFilters.cargoType ||
            tempFilters.weightRange[0] > 0 ||
            tempFilters.weightRange[1] < 100 ||
            tempFilters.origin ||
            tempFilters.destination
        );
    };

    const clearFilters = () => {
        const defaultFilters: Filters = {
            dateRange: { from: undefined, to: undefined },
            priceRange: [0, 100000000],
            truckType: '',
            cargoType: '',
            weightRange: [0, 100],
            origin: '',
            destination: '',
        };
        setTempFilters(defaultFilters);
    };

    const applyFilters = async () => {
        setIsApplying(true);
        await new Promise((resolve) => setTimeout(resolve, 1000)); // شبیه‌سازی لودینگ
        onFiltersChange(tempFilters);
        setIsApplying(false);
        onClose();
    };

    return (
        <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <SheetContent
                side="bottom"
                className="max-h-[95vh] p-0 rounded-t-2xl [&>button]:hidden"
                onInteractOutside={(e) => e.preventDefault()}
            >
                {/* هدر ثابت */}
                <SheetHeader className="p-6 pb-4 flex-shrink-0 border-b border-border">
                    <div className="flex items-center justify-center">
                        <button
                            onClick={onClose}
                            className="absolute right-6 p-1 hover:bg-muted rounded-md transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                        <SheetTitle className="text-center text-lg">فیلترها</SheetTitle>
                    </div>
                </SheetHeader>

                {/* محتوای اسکرول‌خور */}
                <div className="overflow-y-auto scrollbar-hide" style={{ maxHeight: 'calc(95vh - 180px)' }}>
                    <div className="p-6 space-y-6">

                        {/* فیلتر تاریخ */}
                        <div className="space-y-3">
                            <h3 className="text-right font-medium">تاریخ</h3>
                            <Popover open={showDateCalendar} onOpenChange={setShowDateCalendar}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className={cn(
                                            "w-full justify-between text-right font-normal",
                                            !tempFilters.dateRange.from && !tempFilters.dateRange.to && "text-muted-foreground"
                                        )}
                                    >
                                        {tempFilters.dateRange.from && tempFilters.dateRange.to
                                            ? `${format(tempFilters.dateRange.from, "yyyy/MM/dd")} - ${format(
                                                tempFilters.dateRange.to,
                                                "yyyy/MM/dd"
                                            )}`
                                            : tempFilters.dateRange.from
                                                ? format(tempFilters.dateRange.from, "yyyy/MM/dd")
                                                : "انتخاب تاریخ"}
                                        <CalendarIcon className="h-4 w-4" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0 z-[60]" side="top" align="center">
                                    <Calendar
                                        mode="range"
                                        selected={
                                            tempFilters.dateRange.from
                                                ? (tempFilters.dateRange as DateRange)
                                                : undefined
                                        }
                                        onSelect={(range: DateRange | undefined) => {
                                            setTempFilters((prev) => ({ ...prev, dateRange: range || {} }));
                                            if (range?.from && range?.to) {
                                                setShowDateCalendar(false);
                                            }
                                        }}
                                        numberOfMonths={1}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>

                        {/* فیلتر قیمت */}
                        <div className="space-y-3">
                            <h3 className="text-right font-medium">قیمت</h3>
                            <div className="text-right text-sm text-muted-foreground">
                                {formatPrice(tempFilters.priceRange[0])} - {formatPrice(tempFilters.priceRange[1])}
                            </div>
                            <Slider
                                value={tempFilters.priceRange}
                                onValueChange={(value) => setTempFilters((prev) => ({ ...prev, priceRange: value as [number, number] }))}
                                max={100000000}
                                step={1000000}
                            />
                        </div>

                        {/* سایر فیلترها ... */}

                    </div>
                </div>

                {/* فوتر ثابت */}
                <div className="p-6 pt-4 flex-shrink-0 border-t border-border bg-background">
                    <Button
                        onClick={applyFilters}
                        className="w-full"
                        disabled={isApplying}
                    >
                        {isApplying ? <LoadingDots /> : 'اعمال فیلترها'}
                    </Button>
                    {hasActiveFilters() && (
                        <Button
                            variant="outline"
                            className="w-full mt-3 text-destructive hover:bg-red-50"
                            onClick={clearFilters}
                        >
                            پاک کردن همه فیلترها
                        </Button>
                    )}
                </div>
            </SheetContent>
        </Sheet>
    );
}