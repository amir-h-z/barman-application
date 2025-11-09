import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Truck, MapPin, ChevronDown } from "lucide-react";
import type { Load } from "@/types";

interface DriverRejectedLoadCardProps {
    load: Load;
}

export function DriverRejectedLoadCard({ load }: DriverRejectedLoadCardProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <Card
            className="cursor-pointer transition-all duration-300"
            style={{
                backgroundColor: isExpanded ? '#FFF7F7' : 'transparent',
                borderColor: isExpanded ? '#FEE2E2' : 'var(--border)'
            }}
            onClick={() => setIsExpanded(!isExpanded)}
        >
            <CardContent className="p-4">
                <div className="flex items-start justify-between mb-4">
                    <div className="space-y-1 text-right">
                        <h3 className="font-medium">{load.cargoType}</h3>
                        <Badge variant="destructive" className="bg-red-100 text-red-700 border-red-200">رد شده</Badge>
                    </div>
                    <div className="text-left">
                        <span className="font-bold text-primary block">{load.price.toLocaleString()} تومان</span>
                    </div>
                </div>

                <div className="flex items-center gap-2 py-1 mb-3">
                    <div className="flex items-center gap-5"><span className="text-sm">{load.origin}</span><Truck className="w-4 h-4 text-orange-500 -scale-x-100" /></div>
                    <div className="flex-1 border-t-2 border-dashed"></div>
                    <div className="flex items-center gap-5"><MapPin className="w-4 h-4 text-red-500" /><span className="text-sm">{load.destination}</span></div>
                </div>

                <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-48 opacity-100 pt-3' : 'max-h-0 opacity-0'}`}>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <span>وزن: {load.weight} تن</span>
                            <span>{load.truckType}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <span>تاریخ حرکت: {load.date}</span>
                            <span>صاحب بار: {load.ownerName}</span>
                        </div>
                    </div>
                </div>

                <div className="flex justify-center pt-2">
                    <ChevronDown
                        className={`w-5 h-5 text-muted-foreground/50 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                    />
                </div>
            </CardContent>
        </Card>
    );
}