import { cn } from '@/lib/utils';
import useMapStore from '@/store/mapStore';
import { MdMyLocation } from 'react-icons/md';

function LocateMeButton() {
	const map = useMapStore((state) => state.map);

	const locateMeHandler = () => {
		if (Object.keys(map).length > 0) {
			map.getMapboxInstance().flyTo({
				center: [
					+import.meta.env.VITE_WAYFINDING_DEFAULT_LOCATION_LONGITUDE,
					+import.meta.env.VITE_WAYFINDING_DEFAULT_LOCATION_LATITUDE,
				],
				bearing: +import.meta.env.VITE_WAYFINDING_DEFAULT_BEARING,
				pitch: +import.meta.env.VITE_WAYFINDING_DEFAULT_PITCH,
				zoom: +import.meta.env.VITE_WAYFINDING_DEFAULT_ZOOM,
			});
			map.setFloorByLevel(
				+import.meta.env.VITE_WAYFINDING_DEFAULT_LOCATION_LEVEL
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
