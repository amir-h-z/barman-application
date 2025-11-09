import { useState } from "react";
import { Button } from "@/components/ui/button";
// import { FilterBottomSheet } from "@/components/shared/FilterBottomSheet";
import { DriverCompletedTripCard } from "./DriverCompletedTripCard";
import { DriverInProgressCard } from "./DriverInProgressCard";
import { DriverRequestsLoadCard } from "./DriverRequestsLoadCard";
import { DriverRejectedLoadCard } from "./DriverRejectedLoadCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Filter } from "lucide-react";
import { toast } from "sonner";
import type { Trip, Load } from "@/types";
// import type { TripFilters } from "@/types/api";
import { MOCK_ONGOING_TRIPS, MOCK_COMPLETED_TRIPS, MOCK_REQUEST_LOADS, MOCK_REJECTED_LOADS } from "@/api/mock-data";

interface TripsListProps {
    onTripSelected: (tripId: string) => void;
}

export function TripsList({ onTripSelected }: TripsListProps) {
    // const [filters, setFilters] = useState<Partial<TripFilters>>({});
    // const [showFilterSheet, setShowFilterSheet] = useState(false);
    const [activeTab, setActiveTab] = useState('ongoing');
    const [showCancelDialog, setShowCancelDialog] = useState(false);
    const [loadToCancel, setLoadToCancel] = useState<string | null>(null);

    const [ongoingTrips, _setOngoingTrips] = useState<Trip[]>(MOCK_ONGOING_TRIPS);
    const [completedTrips, _setCompletedTrips] = useState<Trip[]>(MOCK_COMPLETED_TRIPS);
    const [requestLoads, setRequestLoads] = useState<Load[]>(MOCK_REQUEST_LOADS);
    const [rejectedLoads, _setRejectedLoads] = useState<Load[]>(MOCK_REJECTED_LOADS);

    const handleCancelRequest = (loadId: string) => {
        setLoadToCancel(loadId);
        setShowCancelDialog(true);
    };

    const confirmCancelRequest = () => {
        if (loadToCancel) {
            setRequestLoads(prev => prev.filter(load => load.id !== loadToCancel));
            toast.success('درخواست شما با موفقیت لغو شد');
        }
        setShowCancelDialog(false);
        setLoadToCancel(null);
    };

    return (
        <div className="flex flex-col h-screen bg-background">
            <div className="bg-white fixed top-0 left-0 right-0 z-10 border-b">
                <div className="px-4 py-3 flex items-center justify-between">
                    <h1 className="text-primary text-base">بارهای من</h1>
                    <Button variant="outline" size="sm" /*onClick={() => setShowFilterSheet(true)}*/ disabled className="flex items-center gap-2">
                        <Filter className="w-4 h-4" /> فیلتر
                    </Button>
                </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col pt-16">
                <div className="px-4 py-2 bg-white fixed top-[61px] left-0 right-0 z-10">
                    <TabsList className="grid w-full grid-cols-4 h-12">
                        <TabsTrigger value="rejected" className="text-sm h-10">رد شده</TabsTrigger>
                        <TabsTrigger value="requests" className="text-sm h-10">درخواست ها</TabsTrigger>
                        <TabsTrigger value="completed" className="text-sm h-10">تکمیل شده</TabsTrigger>
                        <TabsTrigger value="ongoing" className="text-sm h-10">در جریان</TabsTrigger>
                    </TabsList>
                </div>

                <div className="flex-1 overflow-y-auto scrollbar-hide pt-16">
                    <TabsContent value="ongoing" className="mt-0">
                        <div className="p-4 space-y-4">
                            {ongoingTrips.length > 0 ? (
                                ongoingTrips.map(trip => (
                                    <DriverInProgressCard key={trip.id} trip={trip} onViewDetails={() => onTripSelected(trip.id)} />
                                ))
                            ) : (
                                <div className="text-center py-20 text-muted-foreground">سفری در جریان نیست.</div>
                            )}
                        </div>
                    </TabsContent>

                    <TabsContent value="completed" className="mt-0">
                        <div className="p-4 space-y-4">
                            {completedTrips.map(trip => (
                                <DriverCompletedTripCard key={trip.id} trip={trip} />
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="requests" className="mt-0">
                        <div className="p-4 space-y-4">
                            {requestLoads.map(load => (
                                <DriverRequestsLoadCard key={load.id} load={load} onCancelRequest={handleCancelRequest} />
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="rejected" className="mt-0">
                        <div className="p-4 space-y-4">
                            {rejectedLoads.map(load => (
                                <DriverRejectedLoadCard key={load.id} load={load} />
                            ))}
                        </div>
                    </TabsContent>
                </div>
            </Tabs>

            {/* <FilterBottomSheet isOpen={showFilterSheet} onClose={() => setShowFilterSheet(false)} filters={filters} onFiltersChange={setFilters} /> */}

            <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
                <AlertDialogContent className="text-right !z-[10000]">
                    <AlertDialogHeader>
                        <AlertDialogTitle>لغو درخواست</AlertDialogTitle>
                        <AlertDialogDescription>آیا از لغو این درخواست اطمینان دارید؟</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="flex-row-reverse gap-2">
                        <AlertDialogAction onClick={confirmCancelRequest} className="bg-destructive text-destructive-foreground">تایید لغو</AlertDialogAction>
                        <AlertDialogCancel onClick={() => setShowCancelDialog(false)}>انصراف</AlertDialogCancel>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}