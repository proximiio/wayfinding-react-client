import { useCallback, useEffect } from 'react';
import MapView from './components/MapView';
import FloorPicker from './components/FloorPicker';
import PoiDetails from './components/PoiDetails';
import useMapStore from './store/mapStore';

function App() {
	const [appInitiated, setAppInitiated] = useMapStore((state) => [
		state.appInitiated,
		state.setAppInitiated,
	]);
	const [kioskMode, setKioskMode] = useMapStore((state) => [
		state.kioskMode,
		state.setKioskMode,
	]);

	const map = useMapStore((state) => state.map);
	const routeFinish = useMapStore((state) => state.routeFinish);
	const routeStart = useMapStore((state) => state.routeStart);
	const accessibleRoute = useMapStore((state) => state.accessibleRoute);

	const setCurrentLang = useMapStore((state) => state.setCurrentLang);

	const findRoute = useCallback(
		({
			start,
			finish,
			type,
		}: {
			start?: string;
			finish: string;
			type?: string;
		}) => {
			const defaultWayfindingConfig = {
				avoidElevators: true,
				avoidEscalators: false,
				avoidStaircases: false,
				avoidRamps: false,
				avoidNarrowPaths: false,
				avoidRevolvingDoors: false,
				avoidTicketGates: false,
				avoidBarriers: false,
				avoidHills: false,
			};
			const wayfindingConfig = {
				...defaultWayfindingConfig,
				avoidElevators: accessibleRoute ? false : true,
				avoidRamps: accessibleRoute ? false : true,
				avoidEscalators: accessibleRoute ? true : false,
				avoidStaircases: accessibleRoute ? true : false,
				avoidBarriers: accessibleRoute ? true : false,
				avoidNarrowPaths: accessibleRoute ? true : false,
				avoidRevolvingDoors: accessibleRoute ? true : false,
				avoidTicketGates: accessibleRoute ? true : false,
			};
			if (type === 'amenity') {
				map.findRouteToNearestFeature(
					finish,
					start,
					accessibleRoute,
					wayfindingConfig
				);
				return;
			}
			map.findRouteByIds(finish, start, accessibleRoute, wayfindingConfig);
		},
		[accessibleRoute, map]
	);

	// This effect hook handles URL query parameters related to language and kiosk mode
	useEffect(() => {
		if (appInitiated) return;

		// Extract URL query parameters
		const urlParams = new URLSearchParams(window.location.search);

		// Retrieve 'language' parameter from URL or default to 'en' if not found
		const urlLanguage = urlParams.get('language') ?? 'en';

		// Update language state with 'language' parameter from URL
		setCurrentLang(urlLanguage);

		// If 'kiosk' parameter exists in URL, set kiosk mode
		if (urlParams.get('kiosk')) {
			setKioskMode(true);
		}

		// idleTime function handle timeouts to reset to default view
		const idleTime = () => {
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
		};

		// handle reset to default view
		const resetView = () => {
			if (Object.keys(map).length > 0) {
				map.refetch();
			}
		};

		// if app is initiated in kioskMode run idleTime function
		if (kioskMode) {
			console.log('kioskMode initiated');
			idleTime();
		}

		setAppInitiated(true);
	}, [
		setKioskMode,
		setCurrentLang,
		appInitiated,
		kioskMode,
		map,
		setAppInitiated,
	]);

	// This effect hook handles route start state changes
	useEffect(() => {
		if (routeStart?.id) {
			console.log('routeStart', routeStart);
			// if we also have route finish generate route
			if (routeFinish?.id) {
				findRoute({ finish: routeFinish.id, start: routeStart.id });
			}
		} else {
			console.log('routeStart cancelled', routeStart);
		}
	}, [routeStart, routeFinish, findRoute]);

	// This effect hook handles route finish state changes
	useEffect(() => {
		if (routeFinish?.id) {
			console.log('routeFinish', routeFinish);
		} else {
			console.log('routeFinish cancelled', routeFinish);
			if (Object.keys(map).length > 0) {
				// remove polygon selection after route finish is cancelled
				map.handlePolygonSelection();
			}
		}
	}, [routeFinish, map]);

	return (
		<>
			{appInitiated === true && (
				<main>
					<FloorPicker />
					{routeFinish?.id && <PoiDetails />}
					<MapView />
				</main>
			)}
		</>
	);
}

export default App;
