import useMapStore from '@/store/mapStore';
import Feature from 'proximiio-js-library/lib/models/feature';
import { useCallback } from 'react';

export default function UseKiosk() {
	const map = useMapStore((state) => state.map);

	const setRouteStart = useMapStore((state) => state.setRouteStart);
	const setRouteFinish = useMapStore((state) => state.setRouteFinish);

	// handle reset to default view
	const resetView = useCallback(() => {
		if (Object.keys(map).length > 0) {
			/*this.sidebarService.onSetEndPoi(null);
      if (this.sidebarService.filteredAmenity) {
        this.sidebarService.onAmenityToggle(
          "amenities",
          this.sidebarService.filteredAmenity
        );
        this.sidebarService.showClosestAmenityPicker = false;
        this.sidebarService.activeListItem = null;
      }*/

			setRouteStart({} as Feature);
			setRouteFinish({} as Feature);
			map.refetch();
		}
	}, [map, setRouteStart, setRouteFinish]);

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
