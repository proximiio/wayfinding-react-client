import { useEffect } from 'react';
import MapView from './components/MapView';
import FloorPicker from './components/FloorPicker';
import useMapStore from './store/mapStore';
import { useTranslation } from 'react-i18next';
import useKiosk from '@/hooks/useKiosk';
import PoiSearch from './components/PoiSearch';
import Sidebar from './components/Sidebar';
import LocateMeButton from './components/LocateMeButton';

function App() {
	const { t, i18n } = useTranslation();
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

	return (
		<>
			{appInitiated && (
				<main>
					{Object.keys(map).length === 0 && (
						<div className='fixed flex w-screen h-screen'>
							<div className='mx-auto mt-[20%]'>
								<div className='w-40 h-40 mx-auto border border-gray-300 rounded-full animate-spin border-t-primary' />
								<h3 className='mt-8 text-3xl font-semibold'>
									{t('welcomeMessage')}
								</h3>
							</div>
						</div>
					)}
					<PoiSearch />
					<FloorPicker />
					<Sidebar />
					<LocateMeButton />
					<MapView />
				</main>
			)}
		</>
	);
}

export default App;
