import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Check, X, Star } from "lucide-react";
import { toast } from "sonner";
import type { DriverRequest } from "@/types"; // فرض می‌شود این تایپ تعریف شده است

interface DriverRequestCardProps {
    request: DriverRequest;
    onAccept: (requestId: string) => void;
    onReject: (requestId: string) => void;
}

export function DriverRequestCard({ request, onAccept, onReject }: DriverRequestCardProps) {
    const [showRejectDialog, setShowRejectDialog] = useState(false);

    const handleAccept = () => {
        onAccept(request.id);
        toast.success(`درخواست ${request.firstName} ${request.lastName} پذیرفته شد.`);
    };

    const handleRejectClick = () => {
        setShowRejectDialog(true);
    };

    const handleRejectConfirm = () => {
        onReject(request.id);
        setShowRejectDialog(false);
        toast.info(`درخواست ${request.firstName} ${request.lastName} رد شد.`);
    };

    return (
        <>
            <div className="bg-white rounded-lg border border-border overflow-hidden shadow-sm">
                {/* بخش اصلی کارت */}
                <div className="p-6">
                    {/* عکس پروفایل - بزرگ و در وسط */}
                    <div className="flex justify-center mb-4">
                        <div className="w-20 h-20 rounded-full overflow-hidden bg-muted border">
                            {request.driverPhoto ? (
                                <img
                                    src={request.driverPhoto}
                                    alt={`عکس ${request.firstName} ${request.lastName}`}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <span className="text-muted-foreground text-2xl">
                    {request.firstName.charAt(0)}{request.lastName.charAt(0)}
                  </span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* اطلاعات راننده */}
                    <div className="space-y-4 text-center">
                        {/* نام و نام خانوادگی / امتیاز */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="text-center">
                                <p className="text-sm text-muted-foreground">نام راننده</p>
                                <p className="font-medium">{request.firstName} {request.lastName}</p>
                            </div>
                            <div className="text-center">
                                <p className="text-sm text-muted-foreground">امتیاز</p>
                                <div className="flex items-center justify-center gap-1">
                                    <span className="font-medium">{request.rating.toFixed(2)}</span>
                                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                </div>
                            </div>
                        </div>

                        {/* نوع خودرو / ظرفیت بار */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="text-center">
                                <p className="text-sm text-muted-foreground">نوع خودرو</p>
                                <p className="font-medium">{request.vehicleType}</p>
                            </div>
                            <div className="text-center">
                                <p className="text-sm text-muted-foreground">ظرفیت بار</p>
                                <p className="font-medium">{request.cargoCapacity} تن</p>
                            </div>
                        </div>

                        {/* سال ساخت خودرو / پلاک خودرو */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="text-center">
                                <p className="text-sm text-muted-foreground">سال ساخت</p>
                                <p className="font-medium">{request.vehicleYear}</p>
                            </div>
                            <div className="text-center">
                                <p className="text-sm text-muted-foreground">شماره پلاک</p>
                                <div className="font-medium text-sm" dir="rtl">
                                    {request.plateNumber}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* بخش دکمه‌ها */}
                <div className="p-4 bg-muted/30 border-t">
                    <div className="flex flex-row-reverse gap-3">
                        <Button
                            onClick={handleAccept}
                            className="flex-1 flex items-center justify-center gap-2"
                        >
                            <Check className="w-4 h-4" />
                            تایید
                        </Button>
                        <Button
                            onClick={handleRejectClick}
                            variant="outline"
                            className="flex-1 flex items-center justify-center gap-2 border-destructive text-destructive bg-white hover:bg-destructive/5 hover:text-destructive"
                        >
                            <X className="w-4 h-4" />
                            رد
                        </Button>
                    </div>
                </div>
            </div>

            {/* دیالوگ تایید رد درخواست */}
            <AlertDialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
                <AlertDialogContent className="text-right">
                    <AlertDialogHeader>
                        <AlertDialogTitle>تایید رد درخواست</AlertDialogTitle>
                        <AlertDialogDescription>
                            آیا از رد درخواست راننده «{request.firstName} {request.lastName}» اطمینان دارید؟
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="flex-row-reverse">
                        <AlertDialogAction
                            onClick={handleRejectConfirm}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            بله، رد کن
                        </AlertDialogAction>
                        <AlertDialogCancel>انصراف</AlertDialogCancel>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}