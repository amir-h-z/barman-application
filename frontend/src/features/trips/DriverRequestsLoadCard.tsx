import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Truck, MapPin } from "lucide-react";
import type { Load } from "@/types";

interface DriverRequestsLoadCardProps {
    load: Load;
    onCancelRequest: (loadId: string) => void;
}

export function DriverRequestsLoadCard({ load, onCancelRequest }: DriverRequestsLoadCardProps) {
    const handleCancelClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onCancelRequest(load.id);
    };

    return (
        <Card className="border-orange-200 bg-orange-50/50">
            <CardContent className="p-4 space-y-4">
                <div className="flex items-start justify-between">
                    <div className="space-y-1 text-right">
                        <h3 className="font-medium">{load.cargoType}</h3>
                        <div className="flex items-center gap-2">
                            <Badge className="bg-orange-100 text-orange-700 border border-orange-200">در انتظار تایید</Badge>
                        </div>
                    </div>
                    <div className="text-left">
                        <span className="font-bold text-primary block">{load.price.toLocaleString()} تومان</span>
                        <span className="text-sm text-muted-foreground">صاحب بار: {load.ownerName}</span>
                    </div>
                </div>

                <div className="flex items-center gap-2 py-2">
                    <div className="flex items-center gap-5"><span className="text-sm">{load.origin}</span><Truck className="w-4 h-4 text-orange-500 -scale-x-100" /></div>
                    <div className="flex-1 border-t-2 border-dashed"></div>
                    <div className="flex items-center gap-5"><MapPin className="w-4 h-4 text-red-500" /><span className="text-sm">{load.destination}</span></div>
                </div>

                <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>وزن: {load.weight} تن</span>
                    <span>{load.truckType}</span>
                </div>

                <div className="pt-2">
                    <Button
                        variant="outline"
                        className="w-full border-destructive text-destructive bg-white hover:bg-destructive/5"
                        onClick={handleCancelClick}
                    >
                        لغو درخواست
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}