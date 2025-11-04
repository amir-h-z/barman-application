import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface RouteMapProps {
    origin: { lat: number; lng: number; name: string };
    destination: { lat: number; lng: number; name: string };
    progress: number; // A number between 0 and 100
}

// برای جلوگیری از مشکل آیکون‌های پیش‌فرض در Webpack/Vite
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

export function RouteMap({ origin, destination, progress }: RouteMapProps) {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<L.Map | null>(null);

    useEffect(() => {
        if (!mapContainerRef.current) return;

        // جلوگیری از ایجاد چندباره نقشه
        if (mapRef.current) {
            mapRef.current.remove();
        }

        const originCoords: [number, number] = [origin.lat, origin.lng];
        const destCoords: [number, number] = [destination.lat, destination.lng];

        // تابعی برای ایجاد مسیر واقعی‌تر بین دو نقطه
        const generateRealisticRoute = (start: [number, number], end: [number, number]) => {
            // (این تابع از کد اصلی شما استخراج شده است)
            const waypoints = [start];
            const latDiff = end[0] - start[0];
            const lngDiff = end[1] - start[1];
            const distance = Math.sqrt(latDiff * latDiff + lngDiff * lngDiff);
            const numWaypoints = Math.min(Math.max(Math.floor(distance * 12), 5), 15);

            for (let i = 1; i < numWaypoints; i++) {
                const ratio = i / numWaypoints;
                const primaryCurve = Math.sin(ratio * Math.PI * 2) * 0.008;
                const secondaryCurve = Math.cos(ratio * Math.PI * 3) * 0.004;
                const roadVariation = (Math.sin(ratio * Math.PI * 5) + Math.cos(ratio * Math.PI * 7)) * 0.003;
                const lat = start[0] + latDiff * ratio + primaryCurve + secondaryCurve + roadVariation;
                const lng = start[1] + lngDiff * ratio + primaryCurve * 0.8 + secondaryCurve + roadVariation * 0.7;
                waypoints.push([lat, lng] as [number, number]);
            }

            waypoints.push(end);
            return waypoints;
        };

        const routeWaypoints = generateRealisticRoute(originCoords, destCoords);

        // محاسبه موقعیت فعلی بر اساس درصد پیشرفت
        const progressRatio = progress / 100;
        const totalSegments = routeWaypoints.length - 1;
        const currentSegmentFloat = progressRatio * totalSegments;
        const currentSegmentIndex = Math.floor(currentSegmentFloat);
        const segmentProgress = currentSegmentFloat - currentSegmentIndex;

        let currentPosition: [number, number] = originCoords;
        if (progressRatio > 0 && currentSegmentIndex < routeWaypoints.length - 1) {
            const segmentStart = routeWaypoints[currentSegmentIndex];
            const segmentEnd = routeWaypoints[currentSegmentIndex + 1];
            currentPosition = [
                segmentStart[0] + (segmentEnd[0] - segmentStart[0]) * segmentProgress,
                segmentStart[1] + (segmentEnd[1] - segmentStart[1]) * segmentProgress
            ];
        } else if (progressRatio >= 1) {
            currentPosition = destCoords;
        }

        const bounds = L.latLngBounds(routeWaypoints).pad(0.1);

        // ایجاد نقشه
        mapRef.current = L.map(mapContainerRef.current, {
            zoomControl: false,
            scrollWheelZoom: true,
            dragging: true,
        }).fitBounds(bounds);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
        }).addTo(mapRef.current);

        // تعریف آیکون‌های سفارشی
        const originIcon = L.divIcon({ html: `<svg width="24" height="24" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8" fill="#10b981" stroke="white" stroke-width="3"/></svg>`, iconSize: [24, 24], className: 'map-icon' });
        const destinationIcon = L.divIcon({ html: `<svg width="28" height="36" viewBox="0 0 24 32"><path d="M12 0C7.58 0 4 3.58 4 8c0 5.25 8 16 8 16s8-10.75 8-16c0-4.42-3.58-8-8-8z" fill="#ef4444" stroke="white" stroke-width="2"/></svg>`, iconSize: [28, 36], iconAnchor: [14, 36], className: 'map-icon' });
        const truckIcon = L.divIcon({ html: `<svg width="24" height="24" viewBox="0 0 18 18"><path d="M18 13.5C18 14.0304 17.7893 14.5391 17.4142 14.9142C17.0391 15.2893 16.5304 15.5 16 15.5H2C1.46957 15.5 0.960859 15.2893 0.585786 14.9142C0.210714 14.5391 0 14.0304 0 13.5V12C0 11.4696 0.210714 10.9609 0.585786 10.5858C0.960859 10.2107 1.46957 10 2 10H16C16.5304 10 17.0391 10.2107 17.4142 10.5858C17.7893 10.9609 18 11.4696 18 12V13.5Z" fill="#DD2E44"/><path d="M9.5 6.5L9.0105 6H3.573C2 6 1.5 7 1.5 7L0 9.9795V12.5H9.5V6.5Z" fill="#FFCC4D"/><path d="M4.5 10H1L2 8C2 8 2.5 7 3.5 7H4.5V10Z" fill="#55ACEE"/><path d="M4.5 17.5C5.60457 17.5 6.5 16.6046 6.5 15.5C6.5 14.3954 5.60457 13.5 4.5 13.5C3.39543 13.5 2.5 14.3954 2.5 15.5C2.5 16.6046 3.39543 17.5 4.5 17.5Z" fill="#292F33"/><path d="M13.5 17.5C14.6046 17.5 15.5 16.6046 15.5 15.5C15.5 14.3954 14.6046 13.5 13.5 13.5C12.3954 13.5 11.5 14.3954 11.5 15.5C11.5 16.6046 12.3954 17.5 13.5 17.5Z" fill="#292F33"/><path d="M16 4H8.5C7.96957 4 7.46086 4.21071 7.08579 4.58579C6.71071 4.96086 6.5 5.46957 6.5 6V12.5H18V6C18 5.46957 17.7893 4.96086 17.4142 4.58579C17.0391 4.21071 16.5304 4 16 4Z" fill="#258DC5"/></svg>`, iconSize: [24, 24], className: 'map-icon truck-marker' });

        // افزودن مارکرها
        L.marker(originCoords, { icon: originIcon }).bindPopup(`<b>مبدأ:</b> ${origin.name}`).addTo(mapRef.current);
        L.marker(destCoords, { icon: destinationIcon }).bindPopup(`<b>مقصد:</b> ${destination.name}`).addTo(mapRef.current);

        // رسم مسیر طی شده و باقی‌مانده
        L.polyline(routeWaypoints, { color: '#f97316', weight: 8, opacity: 0.8 }).addTo(mapRef.current);
        if (progressRatio > 0) {
            const completedWaypoints = routeWaypoints.slice(0, currentSegmentIndex + 1);
            if (segmentProgress > 0 && currentSegmentIndex < routeWaypoints.length - 1) {
                completedWaypoints.push(currentPosition);
            }
            L.polyline(completedWaypoints, { color: '#e5e7eb', weight: 8, opacity: 1 }).addTo(mapRef.current);
        }

        // افزودن مارکر کامیون
        if (progressRatio > 0 && progressRatio < 1) {
            L.marker(currentPosition, { icon: truckIcon }).bindPopup(`<b>موقعیت فعلی</b><br/>${progress}% مسیر طی شده`).addTo(mapRef.current);
        }

        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, [origin, destination, progress]);

    return <div ref={mapContainerRef} className="w-full h-full" />;
}