import Proximiio from 'proximiio-js-library';
import { State } from 'proximiio-js-library/lib/components/map/main';
import { useEffect, useRef } from 'react';
import useMapStore from '@/store/mapStore';
import maplibregl from 'maplibre-gl';
import useRouting from '@/hooks/useRouting';
// import { Subscription } from 'rxjs';

function MapView() {
	const mapInitiated = useRef(false);
	const [findRoute] = useRouting();
	const zoom = 19;
	const pitch = 40;
	const bearing = 12;
	const defaultPlaceId = import.meta.env.VITE_WAYFINDING_DEFAULT_PLACE_ID;
	const defaultLocation = {
		coordinates: import.meta.env.VITE_WAYFINDING_DEFAULT_LOCATION_COORDINATES,
		level: import.meta.env.VITE_WAYFINDING_DEFAULT_LOCATION_LEVEL,
	};
	const mapPadding = {
		top: 250,
		bottom: 250,
		left: 500,
		right: 250,
	};

	// store state
	// const map = useMapStore((state) => state.map);
	const kioskMode = useMapStore((state) => state.kioskMode);
	// const currentFloor = useMapStore((state) => state.currentFloor);
	const currentLang = useMapStore((state) => state.currentLang);
	const filterItems = useMapStore((state) => state.filterItems);
	const map = useMapStore((state) => state.map);
	const routeFinish = useMapStore((state) => state.routeFinish);
	const routeStart = useMapStore((state) => state.routeStart);
	const activeFilter = useMapStore((state) => state.activeFilter);

	// store actions
	const setMap = useMapStore((state) => state.setMap);
	const setPlaces = useMapStore((state) => state.setPlaces);
	const setCurrentPlace = useMapStore((state) => state.setCurrentPlace);
	const setFloors = useMapStore((state) => state.setFloors);
	const setCurrentFloor = useMapStore((state) => state.setCurrentFloor);
	const setFeatures = useMapStore((state) => state.setFeatures);
	const setAmenities = useMapStore((state) => state.setAmenities);
	const setRouteFinish = useMapStore((state) => state.setRouteFinish);
	const setHaveRouteDetails = useMapStore((state) => state.setHaveRouteDetails);
	const setRouteDetails = useMapStore((state) => state.setRouteDetails);
	const setCurrentStep = useMapStore((state) => state.setCurrentStep);

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

	// This effect hook handles route start state changes
	useEffect(() => {
		console.log('start efffect');
		if (routeStart?.id) {
			console.log('routeStart', routeStart);
			// if we also have route finish generate route and reset the current step
			if (routeFinish?.id) {
				findRoute({ finish: routeFinish.id, start: routeStart.id });
				setCurrentStep(0);
				return;
			}
		} else {
			console.log('routeStart cancelled', routeStart);
			if (Object.keys(map).length > 0) {
				// cancel route if it's rendered
				map.cancelRoute();
			}
		}
	}, [map, routeStart, routeFinish, findRoute, setCurrentStep]);

	// This effect hook handles route finish state changes
	useEffect(() => {
		console.log('finish effect');
		if (routeFinish?.id) {
			console.log('routeFinish', routeFinish);
			// center the map, set the floor level to poi
			map.getMapboxInstance().flyTo({
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

	// This effect hook handles active filter state changes
	useEffect(() => {
		console.log('active filter effect');
		if (activeFilter?.id) {
			console.log('active filter', activeFilter);
			map.setAmenityFilter(activeFilter.id, activeFilter.type);
		} else {
			console.log('active filter cancelled', activeFilter);
			if (Object.keys(map).length > 0) {
				map.resetAmenityFilters();
			}
		}
	}, [map, activeFilter]);

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
					routeAnimation: {
						enabled: true,
						type: 'point',
					},
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
					setPlaces(mapState.places);
					setCurrentPlace(mapState.place);
					setFloors(mapState.floors);
					setCurrentFloor(mapState.floor);
					setFeatures(mapState.allFeatures.features);
					setAmenities(mapState.amenities);

					// set amenity category group 'list' from store/data.ts
					map.setAmenitiesCategory(
						'list',
						filterItems
							.filter((i) => i.type === 'list')
							.map((i) => i.id)
							.flat(2)
					);
					// set amenity category group 'closest' from store/data.ts
					map.setAmenitiesCategory(
						'closest',
						filterItems
							.filter((i) => i.type === 'closest')
							.map((i) => i.id)
							.flat(2)
					);
				});

				// set destination point for routing based on click event and cancel previous route if generated
				map.getPolygonClickListener().subscribe((feature) => {
					setRouteFinish(feature);
				});

				// subscribe to map place selection listener, this always run once at map initiation and upon map.setPlace method call
				map.getPlaceSelectListener().subscribe((place) => {
					setCurrentPlace(place);
				});

				// subscribe to map floor selection listener, this always run once at map initiation and upon map.setFloor method call
				map.getFloorSelectListener().subscribe((floor) => {
					setCurrentFloor(floor);
				});

				// subscribe to route found listener
				map.getRouteFoundListener().subscribe((res) => {
					console.log('route found', res);
					if (res.details && res.TBTNav) {
						setHaveRouteDetails(true);
						setRouteDetails(res);
					}
				});

				// subscribe to nav step listener and set current step from that
				map.getNavStepSetListener().subscribe((step) => {
					setCurrentStep(step);
				})
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
