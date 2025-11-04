import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FloatingInput } from "@/components/ui/floating-input";
import { FloatingTextarea } from "@/components/ui/floating-textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { LoadingDots } from "@/components/shared/LoadingDots";
import { CustomAccordion } from "@/components/ui/custom-accordion";
import { CalendarIcon, ArrowRight } from "lucide-react";
import { format } from "date-fns-jalali"; // برای تاریخ شمسی
import { toast } from "sonner";
import { Load, NewLoadData } from "@/types";

interface CreateLoadFormProps {
    onBack: () => void;
    onSubmit: (loadData: NewLoadData) => void;
    isEdit?: boolean;
    initialData?: Partial<Load>;
}

export function CreateLoadForm({ onBack, onSubmit, isEdit = false, initialData = {} }: CreateLoadFormProps) {
    const [cargoType, setCargoType] = useState(initialData.cargoType || "");
    const [price, setPrice] = useState(initialData.price?.toString() || "");
    const [truckType, setTruckType] = useState(initialData.truckType || "");
    const [weight, setWeight] = useState(initialData.weight?.toString() || "");
    const [truckCount, setTruckCount] = useState(initialData.truckCount?.toString() || "1");
    const [loadingDate, setLoadingDate] = useState<Date | undefined>(initialData.loadingDate ? new Date(initialData.loadingDate) : undefined);
    const [loadingTime, setLoadingTime] = useState(initialData.loadingTime || "");
    const [description, setDescription] = useState(initialData.description || "");

    const [originProvince, setOriginProvince] = useState(initialData.originProvince || "");
    const [originCity, setOriginCity] = useState(initialData.originCity || "");
    const [originAddress, setOriginAddress] = useState(initialData.originAddress || "");
    const [destinationProvince, setDestinationProvince] = useState(initialData.destinationProvince || "");
    const [destinationCity, setDestinationCity] = useState(initialData.destinationCity || "");
    const [destinationAddress, setDestinationAddress] = useState(initialData.destinationAddress || "");

    const [senderFirstName, setSenderFirstName] = useState(initialData.sender?.firstName || "");
    const [senderLastName, setSenderLastName] = useState(initialData.sender?.lastName || "");
    const [senderPhone, setSenderPhone] = useState(initialData.sender?.phone || "");

    const [receiverFirstName, setReceiverFirstName] = useState(initialData.receiver?.firstName || "");
    const [receiverLastName, setReceiverLastName] = useState(initialData.receiver?.lastName || "");
    const [receiverPhone, setReceiverPhone] = useState(initialData.receiver?.phone || "");

    const [isSenderMyself, setIsSenderMyself] = useState(initialData.isSenderMyself || false);
    const [isReceiverMyself, setIsReceiverMyself] = useState(initialData.isReceiverMyself || false);

    const [isLoading, setIsLoading] = useState(false);

    // داده‌های ثابت از پروژه اصلی استخراج شده‌اند
    const provinces = ["تهران", "اصفهان", "فارس", "خراسان رضوی", "آذربایجان شرقی", "مازندران", "کرمان", "خوزستان"];
    const citiesByProvince: { [key: string]: string[] } = { تهران: ["تهران", "شهریار", "قدس"], اصفهان: ["اصفهان", "کاشان"] };
    const cargoTypes = ["مواد غذایی", "لوازم خانگی", "مصالح ساختمانی", "قطعات یدکی"];
    const truckTypes = ["کمپرسی", "لبه دار", "یخچالی", "تانکر"];

    const isFormComplete = cargoType && truckType && weight && truckCount && loadingDate && loadingTime &&
        originProvince && originCity && originAddress &&
        destinationProvince && destinationCity && destinationAddress &&
        price &&
        (isSenderMyself || (senderFirstName && senderLastName && senderPhone.length === 11)) &&
        (isReceiverMyself || (receiverFirstName && receiverLastName && receiverPhone.length === 11));

    const handleSubmit = async () => {
        if (!isFormComplete) {
            toast.error("لطفاً تمام فیلدهای ضروری را تکمیل کنید.");
            return;
        }

        setIsLoading(true);

        const loadData: NewLoadData = {
            cargoType,
            price: parseFloat(price),
            truckType,
            weight: parseFloat(weight),
            truckCount: parseInt(truckCount),
            loadingDate: loadingDate!.toISOString(),
            loadingTime,
            description,
            origin: { province: originProvince, city: originCity, address: originAddress },
            destination: { province: destinationProvince, city: destinationCity, address: destinationAddress },
            sender: isSenderMyself ? 'self' : { firstName: senderFirstName, lastName: senderLastName, phone: senderPhone },
            receiver: isReceiverMyself ? 'self' : { firstName: receiverFirstName, lastName: receiverLastName, phone: receiverPhone },
        };

        await new Promise(resolve => setTimeout(resolve, 1500)); // شبیه‌سازی API

        onSubmit(loadData);
        setIsLoading(false);
    };

    return (
        <div className="flex flex-col h-screen bg-background">
            <div className="bg-white border-b border-border px-4 py-3 fixed top-0 left-0 right-0 z-10">
                <div className="flex items-center justify-center relative">
                    <button onClick={onBack} className="absolute right-0 p-1">
                        <ArrowRight className="w-5 h-5" />
                    </button>
                    <h1 className="text-primary text-base">{isEdit ? "ویرایش بار" : "افزودن بار جدید"}</h1>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto scrollbar-hide pt-16 pb-24">
                <div className="p-4 space-y-4">
                    <CustomAccordion title="اطلاعات بار" defaultOpen>
                        <Select value={cargoType} onValueChange={setCargoType}>
                            <SelectTrigger><SelectValue placeholder="نوع بار" /></SelectTrigger>
                            <SelectContent>{cargoTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                        </Select>
                        <Select value={truckType} onValueChange={setTruckType}>
                            <SelectTrigger><SelectValue placeholder="نوع ناوگان" /></SelectTrigger>
                            <SelectContent>{truckTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                        </Select>
                        <FloatingInput type="number" value={weight} onChange={e => setWeight(e.target.value)} label="وزن (تن)" />
                        <FloatingInput type="number" value={truckCount} onChange={e => setTruckCount(e.target.value)} label="تعداد ماشین" />
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline" className="w-full justify-between">
                                    {loadingDate ? format(loadingDate, "yyyy/MM/dd") : "تاریخ بارگیری"} <CalendarIcon className="w-4 h-4" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={loadingDate} onSelect={setLoadingDate} /></PopoverContent>
                        </Popover>
                        <FloatingInput type="time" value={loadingTime} onChange={e => setLoadingTime(e.target.value)} label="ساعت بارگیری" />
                        <FloatingTextarea value={description} onChange={e => setDescription(e.target.value)} label="توضیحات" />
                    </CustomAccordion>

                    <CustomAccordion title="اطلاعات آدرس">
                        <div className="grid grid-cols-2 gap-3">
                            <Select value={originProvince} onValueChange={v => { setOriginProvince(v); setOriginCity(""); }}>
                                <SelectTrigger><SelectValue placeholder="استان مبدا" /></SelectTrigger>
                                <SelectContent>{provinces.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
                            </Select>
                            <Select value={originCity} onValueChange={setOriginCity} disabled={!originProvince}>
                                <SelectTrigger><SelectValue placeholder="شهر مبدا" /></SelectTrigger>
                                <SelectContent>{citiesByProvince[originProvince]?.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                            </Select>
                        </div>
                        <FloatingTextarea value={originAddress} onChange={e => setOriginAddress(e.target.value)} label="آدرس کامل مبدا" />
                        <div className="grid grid-cols-2 gap-3">
                            <Select value={destinationProvince} onValueChange={v => { setDestinationProvince(v); setDestinationCity(""); }}>
                                <SelectTrigger><SelectValue placeholder="استان مقصد" /></SelectTrigger>
                                <SelectContent>{provinces.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
                            </Select>
                            <Select value={destinationCity} onValueChange={setDestinationCity} disabled={!destinationProvince}>
                                <SelectTrigger><SelectValue placeholder="شهر مقصد" /></SelectTrigger>
                                <SelectContent>{citiesByProvince[destinationProvince]?.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                            </Select>
                        </div>
                        <FloatingTextarea value={destinationAddress} onChange={e => setDestinationAddress(e.target.value)} label="آدرس کامل مقصد" />
                    </CustomAccordion>

                    <CustomAccordion title="اطلاعات قیمت">
                        <FloatingInput type="number" value={price} onChange={e => setPrice(e.target.value)} label="قیمت (تومان)" />
                    </CustomAccordion>

                    <CustomAccordion title="اطلاعات فرستنده" disabled={isSenderMyself}>
                        <FloatingInput value={senderFirstName} onChange={e => setSenderFirstName(e.target.value)} label="نام فرستنده" disabled={isSenderMyself} />
                        <FloatingInput value={senderLastName} onChange={e => setSenderLastName(e.target.value)} label="نام خانوادگی فرستنده" disabled={isSenderMyself} />
                        <FloatingInput value={senderPhone} onChange={e => setSenderPhone(e.target.value)} label="شماره تلفن فرستنده" disabled={isSenderMyself} maxLength={11} />
                    </CustomAccordion>
                    <div className="flex items-center gap-3 px-2"><Checkbox id="sender-myself" checked={isSenderMyself} onCheckedChange={c => setIsSenderMyself(c as boolean)} /><label htmlFor="sender-myself">فرستنده خودم هستم</label></div>

                    <CustomAccordion title="اطلاعات گیرنده" disabled={isReceiverMyself}>
                        <FloatingInput value={receiverFirstName} onChange={e => setReceiverFirstName(e.target.value)} label="نام گیرنده" disabled={isReceiverMyself} />
                        <FloatingInput value={receiverLastName} onChange={e => setReceiverLastName(e.target.value)} label="نام خانوادگی گیرنده" disabled={isReceiverMyself} />
                        <FloatingInput value={receiverPhone} onChange={e => setReceiverPhone(e.target.value)} label="شماره تلفن گیرنده" disabled={isReceiverMyself} maxLength={11} />
                    </CustomAccordion>
                    <div className="flex items-center gap-3 px-2"><Checkbox id="receiver-myself" checked={isReceiverMyself} onCheckedChange={c => setIsReceiverMyself(c as boolean)} /><label htmlFor="receiver-myself">گیرنده خودم هستم</label></div>
                </div>
            </div>

            <div className="p-4 bg-white border-t fixed bottom-0 left-0 right-0">
                <Button onClick={handleSubmit} className="w-full" disabled={!isFormComplete || isLoading}>
                    {isLoading ? <LoadingDots /> : (isEdit ? "ویرایش بار" : "ثبت بار")}
                </Button>
            </div>
        </div>
    );
}