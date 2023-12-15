import { FilterItemModel } from '@/models/filterItem.model';
import useMapStore from '@/store/mapStore';
import Feature from 'proximiio-js-library/lib/models/feature';
import { useCallback } from 'react';

export default function UseKiosk() {
	const map = useMapStore((state) => state.map);

	const setRouteStart = useMapStore((state) => state.setRouteStart);
	const setRouteFinish = useMapStore((state) => state.setRouteFinish);
	const setActiveFilter = useMapStore((state) => state.setActiveFilter);
	const setShowCustomRoutePicker = useMapStore(
		(state) => state.setShowCustomRoutePicker
	);
	const setHaveRouteDetails = useMapStore((state) => state.setHaveRouteDetails);

	// handle reset to default view
	const resetView = useCallback(() => {
		if (Object.keys(map).length > 0) {
			setRouteStart({} as Feature);
			setRouteFinish({} as Feature);
			setActiveFilter({} as FilterItemModel);
			setShowCustomRoutePicker(false);
			setHaveRouteDetails(false);
			map.refetch();
		}
	}, [
		map,
		setRouteStart,
		setRouteFinish,
		setActiveFilter,
		setShowCustomRoutePicker,
		setHaveRouteDetails,
	]);

	// idleTime function handle timeouts to reset to default view
	const idleTime = useCallback(() => {
		let t: ReturnType<typeof setTimeout>;

		// set timer and call reset view method on timeout
		const resetTimer = () => {
			clearTimeout(t);
			t = setTimeout(resetView, 1 * 60000); // 1 minute
		};

		window.onload = resetTimer;
		window.onmousemove = resetTimer;
		window.onmousedown = resetTimer; // catches touchscreen presses as well
		window.ontouchstart = resetTimer; // catches touchscreen swipes as well
		window.ontouchmove = resetTimer; // required by some devices
		window.onclick = resetTimer; // catches touchpad clicks as well
		window.onkeydown = resetTimer;
		window.addEventListener('scroll', resetTimer, true); // improved; see comments*/
	}, [resetView]);

	return [idleTime];
}
