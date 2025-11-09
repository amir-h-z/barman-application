import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Filter, List, Map } from "lucide-react";
import { FilterBottomSheet } from "@/components/shared/FilterBottomSheet";
import { ShareBottomSheet } from "@/components/shared/ShareBottomSheet";
import { CargoRequestPopup } from "@/features/loads/CargoRequestPopup";
import { LoadCard } from "./LoadCard";
import { LoadDetailsSheet } from "./LoadDetailsSheet";
import type { Load } from "@/types";
import type { LoadFilters } from "@/types";
import { toast } from "sonner";
import L from 'leaflet';
import { MOCK_LOADS } from '@/api/mock-data';

export function AvailableLoads() {
    const [filters, setFilters] = useState<LoadFilters>({
        dateRange: { from: undefined, to: undefined },
        priceRange: [0, 100000000],
        truckType: '',
        cargoType: '',
        weightRange: [0, 100],
        origin: '',
        destination: ''
    });

    const [showFilterSheet, setShowFilterSheet] = useState(false);
    const [selectedLoad, setSelectedLoad] = useState<Load | null>(null);
    const [showShareSheet, setShowShareSheet] = useState(false);
    const [showCargoRequestPopup, setShowCargoRequestPopup] = useState(false);
    const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
    const mapRef = useRef<L.Map | null>(null);
    const markersRef = useRef<L.Marker[]>([]);

    const loads = MOCK_LOADS;

    const filteredLoads = loads.filter(_load => {
        return true;
    });

    const handleCardClick = (load: Load) => setSelectedLoad(load);
    const handleCloseDetails = () => setSelectedLoad(null);

    const handleRequestCargo = (load: Load) => {
        setSelectedLoad(null);
        setTimeout(() => {
            // TODO: باید اطلاعات ظرفیت باقیمانده بار را از API بگیریم
            setSelectedLoad(load);
            setShowCargoRequestPopup(true);
        }, 300);
    };

    const handleShare = (load: Load) => {
        setSelectedLoad(load); // برای پاس دادن به شیت اشتراک‌گذاری
        setShowShareSheet(true);
    };

    const handleCargoRequestSubmit = () => {
        setShowCargoRequestPopup(false);
        toast.success("درخواست شما با موفقیت ثبت شد");
    };

    useEffect(() => {
        if (viewMode === 'map') {
            const mapContainer = document.getElementById('map');
            if (!mapContainer || mapRef.current) return;

            const map = L.map('map').setView([32.4279, 53.6880], 6);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
            mapRef.current = map;
        } else {
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        }
    }, [viewMode]);

    useEffect(() => {
        if (viewMode === 'map' && mapRef.current) {
            markersRef.current.forEach(marker => marker.remove());
            markersRef.current = [];

            filteredLoads.forEach(load => {
                const customIcon = L.divIcon({
                    className: 'custom-div-icon',
                    html: `<div style="background:#0A0A0A; color:white; padding:6px 12px; border-radius:16px; font-size:12px; box-shadow:0 2px 8px rgba(0,0,0,0.3);">${load.cargoType}</div>`,
                });

                const marker = L.marker([load.coordinates.origin.lat, load.coordinates.origin.lng], { icon: customIcon })
                    .addTo(mapRef.current!)
                    .on('click', () => setSelectedLoad(load));

                markersRef.current.push(marker);
            });
        }
    }, [viewMode, filteredLoads]);

    return (
        <div className="flex flex-col h-screen">
            <div className="bg-white border-b border-border px-4 py-3 fixed top-0 left-0 right-0 z-10">
                <div className="flex items-center justify-between gap-3">
                    <div className="relative flex bg-muted rounded-lg p-1 w-40">
                        <div className="absolute top-1 bottom-1 w-1/2 bg-primary rounded-md transition-transform duration-300" style={{ transform: viewMode === 'list' ? 'translateX(0%)' : 'translateX(100%)' }} />
                        <button onClick={() => setViewMode('list')} className={`relative z-10 flex-1 flex items-center justify-center gap-1 py-1.5 transition-colors ${viewMode === 'list' ? 'text-white' : 'text-secondary-foreground'}`}><List className="w-4 h-4" /> لیست</button>
                        <button onClick={() => setViewMode('map')} className={`relative z-10 flex-1 flex items-center justify-center gap-1 py-1.5 transition-colors ${viewMode === 'map' ? 'text-white' : 'text-secondary-foreground'}`}><Map className="w-4 h-4" /> نقشه</button>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setShowFilterSheet(true)} className="flex items-center gap-1"><Filter className="w-4 h-4" /> فیلتر</Button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto scrollbar-hide pt-16">
                {viewMode === 'list' ? (
                    <div className="p-4 space-y-4">
                        {filteredLoads.map((load) => (
                            <LoadCard key={load.id} load={load} onClick={() => handleCardClick(load)} />
                        ))}
                        {filteredLoads.length === 0 && (
                            <div className="text-center py-12 text-muted-foreground">هیچ باری یافت نشد.</div>
                        )}
                    </div>
                ) : (
                    <div id="map" className="w-full h-full" />
                )}
            </div>

            <FilterBottomSheet isOpen={showFilterSheet} onClose={() => setShowFilterSheet(false)} filters={filters} onFiltersChange={setFilters} />
            <LoadDetailsSheet isOpen={!!selectedLoad && !showShareSheet && !showCargoRequestPopup} load={selectedLoad} onClose={handleCloseDetails} onRequestCargo={handleRequestCargo} onShare={handleShare} />
            <ShareBottomSheet isOpen={showShareSheet} onClose={() => setShowShareSheet(false)} loadData={selectedLoad} />
            <CargoRequestPopup isOpen={showCargoRequestPopup} onClose={() => setShowCargoRequestPopup(false)} onSubmit={handleCargoRequestSubmit} remainingCapacity={selectedLoad?.remainingCapacity ?? 1} />
        </div>
    );
}