import { useState } from "react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Copy, MessageCircle, Send, Share, X } from "lucide-react";
import { toast } from "sonner";

interface ShareBottomSheetProps {
    isOpen: boolean;
    onClose: () => void;
    loadData: { id: string; cargoType: string } | null;
}

export function ShareBottomSheet({ isOpen, onClose, loadData }: ShareBottomSheetProps) {
    const [isLinkCopied, setIsLinkCopied] = useState(false);

    if (!loadData) return null;

    const shareUrl = `https://barman.app/load/${loadData.id}`;
    const shareText = `🚛 بار ${loadData.cargoType} در اپلیکیشن بارمن موجود است!\n\nجزئیات و درخواست: ${shareUrl}`;

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setIsLinkCopied(true);
            toast.success('لینک کپی شد');
            setTimeout(() => setIsLinkCopied(false), 3000);
        } catch (err) {
            toast.error('کپی کردن لینک با خطا مواجه شد');
        }
    };

    const handleNativeShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: `بار ${loadData.cargoType}`,
                    text: shareText,
                    url: shareUrl,
                });
            } catch (error) {
                console.log('خطا در اشتراک‌گذاری:', error);
            }
        } else {
            // fallback
            handleCopyLink();
        }
    };

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent
                side="bottom"
                className="h-auto max-h-[60vh] rounded-t-2xl p-0"
                style={{ zIndex: 100 }} // z-index بالاتر برای نمایش روی شیت‌های دیگر
            >
                <div className="p-6 space-y-4">
                    <SheetHeader className="text-center relative">
                        <SheetTitle>اشتراک‌گذاری بار</SheetTitle>
                        <SheetDescription>این بار را با دیگران به اشتراک بگذارید</SheetDescription>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-0"
                            onClick={onClose}
                        >
                            <X className="w-5 h-5" />
                        </Button>
                    </SheetHeader>

                    <div className="space-y-3 pt-4">
                        <Button
                            variant="outline"
                            className="w-full flex items-center justify-center gap-3 h-12"
                            onClick={handleCopyLink}
                        >
                            <Copy className={`w-5 h-5 ${isLinkCopied ? 'text-green-600' : ''}`} />
                            <span>{isLinkCopied ? 'کپی شد!' : 'کپی لینک'}</span>
                        </Button>

                        <div className="grid grid-cols-2 gap-3">
                            <Button
                                variant="outline"
                                className="flex items-center justify-center gap-2 h-12 bg-green-50 border-green-200"
                                onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank')}
                            >
                                <MessageCircle className="w-5 h-5 text-green-600" />
                                <span className="text-green-700">واتساپ</span>
                            </Button>
                            <Button
                                variant="outline"
                                className="flex items-center justify-center gap-2 h-12 bg-blue-50 border-blue-200"
                                onClick={() => window.open(`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(`بار ${loadData.cargoType}`)}`, '_blank')}
                            >
                                <Send className="w-5 h-5 text-blue-600" />
                                <span className="text-blue-700">تلگرام</span>
                            </Button>
                        </div>

                        {navigator.share && (
                            <>
                                <Separator />
                                <Button
                                    variant="outline"
                                    className="w-full flex items-center justify-center gap-3 h-12"
                                    onClick={handleNativeShare}
                                >
                                    <Share className="w-5 h-5" />
                                    <span>سایر برنامه‌ها</span>
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}