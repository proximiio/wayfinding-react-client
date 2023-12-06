import { useEffect } from 'react';
import MapView from './components/MapView';
import FloorPicker from './components/FloorPicker';
import PoiDetails from './components/PoiDetails';
import useMapStore from './store/mapStore';
import { useTranslation } from 'react-i18next';
import useRouting from '@/hooks/useRouting';
import useKiosk from '@/hooks/useKiosk';
import PoiSearch from './components/PoiSearch';

function App() {
	const { t, i18n } = useTranslation();
	const [findRoute] = useRouting();
	const [idleTime] = useKiosk();

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

	const setCurrentLang = useMapStore((state) => state.setCurrentLang);

	// This effect hook handles URL query parameters related to language and kiosk mode
	useEffect(() => {
		if (appInitiated) return;

		// Extract URL query parameters
		const urlParams = new URLSearchParams(window.location.search);

		// Retrieve 'language' parameter from URL or default to 'en' if not found
		const urlLanguage = urlParams.get('language') ?? 'en';

		// Update language state with 'language' parameter from URL
		setCurrentLang(urlLanguage);
		i18n.changeLanguage(urlLanguage);

		// If 'kiosk' parameter exists in URL, set kiosk mode
		if (urlParams.get('kiosk')) {
			setKioskMode(true);
		}

		setAppInitiated(true);
	}, [appInitiated, i18n, setKioskMode, setCurrentLang, setAppInitiated]);

	// This effect hook handles map and kioskMode changes
	useEffect(() => {
		if (kioskMode) {
			idleTime();
		}
	}, [map, kioskMode, idleTime]);

	// This effect hook handles route start state changes
	useEffect(() => {
		console.log('start efffect');
		if (routeStart?.id) {
			console.log('routeStart', routeStart);
			// if we also have route finish generate route
			if (routeFinish?.id) {
				findRoute({ finish: routeFinish.id, start: routeStart.id });
			}
		} else {
			console.log('routeStart cancelled', routeStart);
			if (Object.keys(map).length > 0) {
				// cancel route if it's rendered
				map.cancelRoute();
			}
		}
	}, [map, routeStart, routeFinish, findRoute]);

	// This effect hook handles route finish state changes
	useEffect(() => {
		console.log('finish effect');
		if (routeFinish?.id) {
			console.log('routeFinish', routeFinish);
			// center the map, set the floor level to poi
			map
				.getMapboxInstance()
				.flyTo({
					center: routeFinish.geometry.coordinates as [number, number],
					zoom: 19,
				});
			map.setFloorByLevel(routeFinish.properties.level);
			// handle polygon selection, only required when polygons are enabled
			map.handlePolygonSelection(routeFinish);
		} else {
			console.log('routeFinish cancelled', routeFinish);
			if (Object.keys(map).length > 0) {
				// cancel route if it's rendered
				map.cancelRoute();
				// remove polygon selection after route finish is cancelled
				map.handlePolygonSelection();
			}
		}
	}, [map, routeFinish]);

	return (
		<>
			{appInitiated && (
				<main>
					{Object.keys(map).length === 0 && (
						<div className='fixed flex w-screen h-screen'>
							<div className='mx-auto mt-[20%]'>
								<div className='w-40 h-40 mx-auto border border-gray-300 rounded-full animate-spin border-t-blue-600' />
								<h3 className='mt-8 text-3xl font-semibold'>
									{t('welcomeMessage')}
								</h3>
							</div>
						</div>
					)}
					<PoiSearch />
					<FloorPicker />
					{routeFinish?.id && <PoiDetails />}
					<MapView />
				</main>
			)}
		</>
	);
}

export default App;
