import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Truck, MapPin, ChevronDown } from "lucide-react";
import type { Trip } from "@/types";

interface DriverCompletedTripCardProps {
    trip: Trip;
}

const formatPrice = (price: number): string => {
    return price.toLocaleString() + ' تومان';
};

export function DriverCompletedTripCard({ trip }: DriverCompletedTripCardProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleExpansion = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <Card
            className="cursor-pointer transition-all duration-300 ease-in-out"
            style={{
                backgroundColor: isExpanded ? '#FBFEFC' : 'transparent',
                borderColor: isExpanded ? '#E9F6E9' : 'var(--border)'
            }}
            onClick={toggleExpansion}
        >
            <CardContent className="p-4">
                {/* بخش بالایی: قیمت، کد بار و نوع بار */}
                <div className="flex items-start justify-between mb-4">
                    <div className="text-right space-y-1">
                        <div className="font-medium text-primary">{formatPrice(trip.price)}</div>
                        <div className="text-sm text-muted-foreground">کد بار: CG-{trip.id.padStart(4, '0')}</div>
                    </div>
                    <div className="text-left">
                        <h3 className="font-medium text-primary">{trip.cargoType}</h3>
                    </div>
                </div>

                {/* مسیر سفر */}
                <div className="flex items-center gap-2 py-1 mb-3">
                    <div className="flex items-center gap-5">
                        <div className="text-center">
                            <div className="text-sm font-medium text-muted-foreground">{trip.destination}</div>
                        </div>
                        <MapPin className="w-4 h-4 text-green-600" />
                    </div>
                    <div className="flex-1 border-t-2 border-dashed border-muted-foreground/30"></div>
                    <div className="flex items-center gap-5">
                        <Truck className="w-4 h-4 text-orange-500 transform -scale-x-100" />
                        <div className="text-center">
                            <div className="text-sm font-medium text-muted-foreground">{trip.origin}</div>
                        </div>
                    </div>
                </div>

                {/* جزئیات اضافی در صورت باز شدن */}
                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-96 opacity-100 pt-3' : 'max-h-0 opacity-0'}`}>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <span>وزن: {trip.weight} تن</span>
                            <span>{trip.truckType}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <span>تاریخ حرکت: {trip.date}</span>
                            <span>تاریخ تحویل: {trip.deliveryDate}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <span>صاحب بار: {trip.cargoOwnerName}</span>
                            <span>شرکت: {trip.transportCompany}</span>
                        </div>
                    </div>
                </div>

                {/* دکمه باز/بسته شدن */}
                <div className="flex justify-center pt-2">
                    <ChevronDown
                        className={`w-5 h-5 text-muted-foreground/50 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                    />
                </div>
            </CardContent>
        </Card>
    );
}