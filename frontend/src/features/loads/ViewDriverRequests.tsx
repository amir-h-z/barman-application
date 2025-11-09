import { useState } from "react";
// import { Button } from "@/components/ui/button";
import { DriverRequestCard } from "@/features/loads/DriverRequestCard";
import { ArrowRight } from "lucide-react";
import type { DriverRequest } from "@/types";

interface ViewDriverRequestsProps {
    onBack: () => void;
    // TODO: در آینده loadId را برای واکشی درخواست‌های مربوط به آن بار دریافت می‌کند
    // loadId: string;
}

// داده‌های موقت رانندگان که باید از API گرفته شوند
const MOCK_REQUESTS: DriverRequest[] = [
    { id: 'req1', driverId: 'drv1', firstName: 'احمد', lastName: 'رضایی', driverPhoto: '...', rating: 4.75, vehicleType: 'کمپرسی', cargoCapacity: 12, vehicleYear: 1398, plateNumber: '۷۸ ۲۳ الف ۴۵۶' },
    { id: 'req2', driverId: 'drv2', firstName: 'علی', lastName: 'محمدی', rating: 4.23, vehicleType: 'لبه دار', cargoCapacity: 8, vehicleYear: 1385, plateNumber: '۶۷ ۱۲ ب ۳۴۵' },
    { id: 'req3', driverId: 'drv3', firstName: 'حسین', lastName: 'کریمی', rating: 3.98, vehicleType: 'یخچالی', cargoCapacity: 15, vehicleYear: 1402, plateNumber: '۴۵ ۸۹ ج ۲۱۰' },
];

export function ViewDriverRequests({ onBack }: ViewDriverRequestsProps) {
    // TODO: این state باید با داده‌های واقعی از هوک useDriverRequests پر شود
    const [requests, setRequests] = useState<DriverRequest[]>(MOCK_REQUESTS);

    const handleAcceptRequest = (requestId: string) => {
        // منطق پذیرفتن درخواست و حذف بقیه درخواست‌ها
        // معمولا یک درخواست به بک‌اند ارسال شده و سپس به صفحه دیگری هدایت می‌شویم
        console.log(`Accepted request ${requestId}`);
        onBack(); // به عنوان مثال، پس از پذیرفتن به صفحه قبل برمی‌گردیم
    };

    const handleRejectRequest = (requestId: string) => {
        // حذف درخواست رد شده از لیست نمایش
        setRequests(prev => prev.filter(req => req.id !== requestId));
    };

    return (
        <div className="flex flex-col h-screen bg-background">
            <div className="bg-white border-b border-border px-4 py-3 fixed top-0 left-0 right-0 z-10">
                <div className="flex items-center justify-center relative">
                    <button onClick={onBack} className="absolute right-0 p-1">
                        <ArrowRight className="w-5 h-5" />
                    </button>
                    <h1 className="text-primary text-base">درخواست‌ها</h1>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto scrollbar-hide pt-16">
                <div className="p-4 space-y-4">
                    {requests.length > 0 ? (
                        requests.map((request) => (
                            <DriverRequestCard
                                key={request.id}
                                request={request}
                                onAccept={handleAcceptRequest}
                                onReject={handleRejectRequest}
                            />
                        ))
                    ) : (
                        <div className="text-center py-20">
                            <p className="text-lg text-muted-foreground mb-2">درخواستی یافت نشد</p>
                            <p className="text-sm text-muted-foreground">در حال حاضر هیچ راننده‌ای برای این بار درخواست نداده است.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}