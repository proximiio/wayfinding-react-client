import { useEffect, useState } from 'react';
import MapView from './components/MapView';
import { Map } from 'proximiio-js-library/lib/components/map/main';

function App() {
	const [map, setMap] = useState({} as Map);
	const [kioskMode, setKioskMode] = useState(false);
	const [currentLang, setCurrentLang] = useState('en');

	// This effect hook handles URL query parameters related to language and kiosk mode
	useEffect(() => {
		// Extract URL query parameters
		const urlParams = new URLSearchParams(window.location.search);

		// Retrieve 'language' parameter from URL or default to 'en' if not found
		const urlLanguage = urlParams.get('language') ?? 'en';

		// If 'kiosk' parameter exists in URL, set kiosk mode
		if (urlParams.get('kiosk')) {
			setKioskMode(true);
		}

		// Update language state with 'language' parameter from URL
		setCurrentLang(urlLanguage);
	}, [setKioskMode, setCurrentLang]);

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
		idleTime();
	}

	return (
		<>
			<main>
				<MapView
					kioskMode={kioskMode}
					currentLang={currentLang}
					onSetMap={setMap}
				/>
			</main>
		</>
	);
}

export default App;
