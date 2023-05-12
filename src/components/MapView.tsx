import Proximiio from 'proximiio-js-library';
import { Map } from 'proximiio-js-library/lib/components/map/main';
import { useEffect, useRef } from 'react';

interface MapProps {
	kioskMode: boolean;
	currentLang: string;
	onSetMap: React.Dispatch<React.SetStateAction<Map>>;
}

function MapView({ kioskMode, currentLang, onSetMap }: MapProps) {
	const mapInitiated = useRef(false);
	const zoom = 19;
	const pitch = 40;
	const bearing = 12;
	const defaultPlaceId = import.meta.env.VITE_WAYFINDING_DEFAULT_PLACE_ID;
	const defaultLocation: {
		coordinates: [number, number];
		level: number;
	} = {
		coordinates: [51.48091652702158, 25.336680584406395],
		level: 0,
	};
	const mapPadding = {
		top: 250,
		bottom: 250,
		left: 500,
		right: 250,
	};

	useEffect(() => {
		// Initialize map only once
		if (mapInitiated.current) return;
		mapInitiated.current = true;

		// Authenticate Proximiio.js library and create map instance with provided constructor options
		Proximiio.Auth.loginWithToken(import.meta.env.VITE_PROXIMIIO_TOKEN).then(
			() => {
				// when authenticated create a map instance with provided constuctor options, check out library readme https://github.com/proximiio/proximiio-js-library#map-component
				const map = new Proximiio.Map({
					// you can define any of the mapbox options in there, we are retrieving those from state service
					mapboxOptions: {
						zoom: zoom,
						pitch: pitch,
						bearing: bearing,
					},
					defaultPlaceId: defaultPlaceId, // if you have more than 1 place in your account, it's a good idea to define defaultPlaceId for the map, otherwise the first one will be picked up
					isKiosk: kioskMode, // if enabled starting point for routing will be based on values defined in kioskSettings, if disabled findRoute methods will expect start point to be send.
					kioskSettings: {
						coordinates: defaultLocation.coordinates,
						level: defaultLocation.level,
					},
					fitBoundsPadding: mapPadding, // setting the padding option to use for zooming into the bounds when route is drawn,
					handleUrlParams: true, // enable handling url params, this way you can load map with predefined route generated
					language: currentLang, // init with predefined language setting
					// useGpsLocation: true, // if enabled your location will be detected with geolocation API and used as a starting point for routing
					// geolocationControlOptions: {
					//   autoTrigger: true, // if enabled map will automatically enable geolocation
					//   autoLocate: false, // if enabled map will automatically focus on user location
					//   position: 'bottom-right', //  position on the map to which the control will be added.
					// },
					showLevelDirectionIcon: true, // if enabled arrow icon will be shown at the levelchanger indicating direction of level change along the found route
					initPolygons: true,
					animatedRoute: true,
				});

				onSetMap(map);
			}
		);
	});

	return (
		<>
			<div id='proximiioMap' className='w-screen h-screen'></div>
		</>
	);
}
export default MapView;
