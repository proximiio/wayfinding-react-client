import { cn } from '@/lib/utils';
import useMapStore from '@/store/mapStore';
import { MdMyLocation } from 'react-icons/md';

function LocateMeButton() {
	const map = useMapStore((state) => state.map);
	const activeKiosk = useMapStore((state) => state.activeKiosk);
	const kioskMode = useMapStore((state) => state.kioskMode);

	const locateMeHandler = () => {
		if (Object.keys(map).length > 0) {
			map.getMapboxInstance().flyTo({
				center: [
					kioskMode && activeKiosk?.longitude
						? activeKiosk.longitude
						: +import.meta.env.VITE_WAYFINDING_DEFAULT_LOCATION_LONGITUDE,
					kioskMode && activeKiosk?.latitude
						? activeKiosk.latitude
						: +import.meta.env.VITE_WAYFINDING_DEFAULT_LOCATION_LATITUDE,
				],
				bearing:
					kioskMode && activeKiosk?.bearing
						? activeKiosk.bearing
						: +import.meta.env.VITE_WAYFINDING_DEFAULT_BEARING,
				pitch:
					kioskMode && activeKiosk?.pitch
						? activeKiosk.pitch
						: +import.meta.env.VITE_WAYFINDING_DEFAULT_PITCH,
				zoom:
					kioskMode && activeKiosk?.zoom
						? activeKiosk.zoom
						: +import.meta.env.VITE_WAYFINDING_DEFAULT_ZOOM,
			});
			map.setFloorByLevel(
				kioskMode && activeKiosk?.level
					? activeKiosk.level
					: +import.meta.env.VITE_WAYFINDING_DEFAULT_LOCATION_LEVEL
			);
		}
	};
	return (
		<div
			className={cn(
				'absolute z-[6] p-4 top-40 left-5 hover:border-primary/70 border-2 rounded-full bg-white/80 text-2xl cursor-pointer'
			)}
			onClick={locateMeHandler}
		>
			<MdMyLocation />
		</div>
	);
}

export default LocateMeButton;
