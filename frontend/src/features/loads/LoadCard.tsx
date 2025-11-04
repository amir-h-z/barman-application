import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Truck, MapPin } from "lucide-react";
import { Load } from "@/types"; // فرض می‌شود تایپ Load در این مسیر است

interface LoadCardProps {
    load: Load;
    onClick: () => void;
}

const formatPrice = (price: number): string => {
    return price.toLocaleString() + ' تومان';
};

export function LoadCard({ load, onClick }: LoadCardProps) {
    return (
        <Card
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={onClick}
        >
            <CardContent className="p-4 space-y-4">
                {/* بخش بالایی کارت شامل نوع بار و قیمت */}
                <div className="flex items-start justify-between">
                    <div className="space-y-1 text-right">
                        <h3 className="font-medium">{load.cargoType}</h3>
                    </div>
                    <div className="text-left">
                        <span className="font-bold text-primary block">{formatPrice(load.price)}</span>
                    </div>
                </div>

                {/* بخش مسیر سفر با آیکون‌ها */}
                <div className="flex items-center gap-2 py-2">
                    <div className="flex items-center gap-5">
                        <div className="text-center">
                            <div className="text-sm font-medium" style={{ color: '#737373' }}>{load.origin}</div>
                            <div className="text-xs" style={{ color: '#A3A3A3' }}>{load.originProvince}</div>
                        </div>
                        <Truck className="w-4 h-4 text-orange-500 transform -scale-x-100" />
                    </div>

                    <div className="flex-1 border-t-2 border-dashed" style={{ borderColor: 'rgba(115, 115, 115, 0.5)' }}></div>

                    <div className="flex items-center gap-5">
                        <MapPin className="w-4 h-4 text-red-500" />
                        <div className="text-center">
                            <div className="text-sm font-medium" style={{ color: '#737373' }}>{load.destination}</div>
                            <div className="text-xs" style={{ color: '#A3A3A3' }}>{load.destinationProvince}</div>
                        </div>
                    </div>
                </div>

                <Separator />

                {/* بخش پایینی کارت شامل وزن و نوع کامیون */}
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>وزن: {load.weight} تن</span>
                    <span>{load.truckType}</span>
                </div>
            </CardContent>
        </Card>
    );
}