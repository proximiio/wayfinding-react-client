import { useCallback, useEffect } from 'react';
import useMapStore from '@/store/mapStore';
import { useIdle } from 'react-use';

export default function UseKiosk() {
	const map = useMapStore((state) => state.map);
	const kioskIsIdle = useIdle(60e3); // 1 minute

	const resetViewStore = useMapStore((state) => state.resetView);
	const locateMe = useMapStore((state) => state.locateMe);

	// handle reset to default view
	const resetView = useCallback(() => {
		resetViewStore();
		locateMe();
		if (Object.keys(map).length > 0) {
			map.refetch();
		}
	}, [map, resetViewStore, locateMe]);

	useEffect(() => {
		if (kioskIsIdle) {
			resetView();
		}
	}, [kioskIsIdle, resetView])
}
