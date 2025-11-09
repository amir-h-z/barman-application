import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Truck, MapPin } from "lucide-react";
import type { Trip } from "@/types";

interface DriverInProgressCardProps {
    trip: Trip;
    onViewDetails: () => void;
}

const formatPrice = (price: number): string => {
    return price.toLocaleString() + ' تومان';
};

export function DriverInProgressCard({ trip, onViewDetails }: DriverInProgressCardProps) {
    return (
        <Card
            className="transition-all duration-300 ease-in-out"
            style={{ backgroundColor: '#FEFCFB', borderColor: '#FFEFD6' }}
        >
            <CardContent className="p-4 space-y-4">
                <div className="flex items-start justify-between">
                    <div className="text-right space-y-1">
                        <div className="font-medium text-primary">{formatPrice(trip.price)}</div>
                        <div className="text-sm text-muted-foreground">کد بار: CG-{trip.id.padStart(4, '0')}</div>
                    </div>
                    <h3 className="font-medium text-primary">{trip.cargoType}</h3>
                </div>

                <div className="flex items-center gap-2 py-2">
                    <div className="flex items-center gap-5"><div className="text-sm font-medium text-muted-foreground">{trip.destination}</div><MapPin className="w-4 h-4 text-red-500" /></div>
                    <div className="flex-1 border-t-2 border-dashed border-muted-foreground/30"></div>
                    <div className="flex items-center gap-5"><Truck className="w-4 h-4 text-orange-500 -scale-x-100" /><div className="text-sm font-medium text-muted-foreground">{trip.origin}</div></div>
                </div>

                <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>وزن: {trip.weight} تن</span>
                    <span>{trip.truckType}</span>
                </div>

                {trip.progress != null && (
                    <div className="space-y-2 pt-2">
                        <div className="flex justify-between text-sm">
                            <span className="font-medium text-orange-600">{trip.progress}%</span>
                            <span className="text-muted-foreground">پیشرفت سفر</span>
                        </div>
                        <div className="relative w-full h-2 bg-orange-100 rounded-full overflow-hidden" dir="rtl">
                            <div className="h-full bg-orange-500 transition-all duration-500 rounded-full" style={{ width: `${trip.progress}%` }}/>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            className="w-full mt-4 border-orange-500 text-orange-500 hover:bg-orange-50"
                            onClick={onViewDetails}
                        >
                            مشاهده جزئیات
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}