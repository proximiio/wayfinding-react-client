import Proximiio from 'proximiio-js-library';
import { State } from 'proximiio-js-library/lib/components/map/main';
import { useEffect, useRef } from 'react';
import useMapStore from '@/store/mapStore';
import maplibregl from 'maplibre-gl';
import { Subscription } from 'rxjs';

function MapView() {
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

	// store state
	const map = useMapStore((state) => state.map);
	const kioskMode = useMapStore((state) => state.kioskMode);
	const currentFloor = useMapStore((state) => state.currentFloor);
	const currentLang = useMapStore((state) => state.currentLang);

	// store actions
	const setMap = useMapStore((state) => state.setMap);
	const setFloors = useMapStore((state) => state.setFloors);
	const setFeatures = useMapStore((state) => state.setFeatures);
	const setCurrentFloor = useMapStore((state) => state.setCurrentFloor);
	const setRouteFinish = useMapStore((state) => state.setRouteFinish);

	// This effect hook handles current floor state changes
	/*useEffect(() => {
		const subscriptions: Subscription[] = [];

		if (Object.keys(map).length > 0) {
			// set destination point for routing based on click event and cancel previous route if generated
			const polygonClickSub = map
				.getPolygonClickListener()
				.subscribe((feature) => {
					setRouteFinish(feature);
				});

			// subscribe to map floor selection listener, this always run once at map initiation and upon map.setFloor method call
			const floorSelectSub = map.getFloorSelectListener().subscribe((floor) => {
				console.log(`floor listener`, floor, currentFloor);
				if (currentFloor && currentFloor.id !== floor.id) {
					console.log('should set floor', floor);
					setCurrentFloor(floor);
				}
			});

			if (currentFloor?.id) {
				map.setFloorById(currentFloor.id);
				console.log('current floor changed', currentFloor);
			}

			subscriptions.push(polygonClickSub, floorSelectSub);
		}
		return () => {
			subscriptions.forEach((sub) => sub.unsubscribe());
		};
	}, [currentFloor, map, setRouteFinish, setCurrentFloor]);*/

	/*useEffect(() => {
		if (Object.keys(map).length > 0 && currentFloor?.id) {
			map.setFloorById(currentFloor.id);
		}
	}, [currentFloor, map]);*/

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
					blockFeatureClickWhileRouting: true,
				});

				map.getMapReadyListener().subscribe((ready) => {
					console.log('map ready', ready);
					const mapState: State = map.getMapState();

					// setting mapbox navigationControl buttons
					map.getMapboxInstance().addControl(
						new maplibregl.NavigationControl({
							showZoom: false,
						})
					);

					setMap(map);
					setFloors(mapState.floors);
					setCurrentFloor(mapState.floor);
					setFeatures(mapState.allFeatures.features);
				});

				// set destination point for routing based on click event and cancel previous route if generated
				map.getPolygonClickListener().subscribe((feature) => {
					setRouteFinish(feature);
				});

				// subscribe to map floor selection listener, this always run once at map initiation and upon map.setFloor method call
				map.getFloorSelectListener().subscribe((floor) => {
					setCurrentFloor(floor);
				});
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
