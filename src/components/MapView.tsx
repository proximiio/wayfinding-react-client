/* eslint-disable no-mixed-spaces-and-tabs */
import Proximiio from 'proximiio-js-library';
import { State } from 'proximiio-js-library/lib/components/map/main';
import { useEffect, useRef } from 'react';
import useMapStore from '@/store/mapStore';
import maplibregl from 'maplibre-gl';
import useRouting from '@/hooks/useRouting';
import { FilterItemModel } from '@/models/filterItem.model';
import { useShallow } from 'zustand/react/shallow';
import i18n from '@/i18n';

function MapView() {
	const mapInitiated = useRef(false);
	const [findRoute] = useRouting();
	const zoom = import.meta.env.VITE_WAYFINDING_DEFAULT_ZOOM;
	const pitch = import.meta.env.VITE_WAYFINDING_DEFAULT_PITCH;
	const bearing = import.meta.env.VITE_WAYFINDING_DEFAULT_BEARING;
	const defaultPlaceId = import.meta.env.VITE_WAYFINDING_DEFAULT_PLACE_ID;
	const defaultLocation = {
		coordinates: [
			+import.meta.env.VITE_WAYFINDING_DEFAULT_LOCATION_LONGITUDE,
			+import.meta.env.VITE_WAYFINDING_DEFAULT_LOCATION_LATITUDE,
		],
		level: +import.meta.env.VITE_WAYFINDING_DEFAULT_LOCATION_LEVEL,
	};
	const mapPadding = {
		top: 250,
		bottom: 250,
		left: 250,
		right: 250,
	};

	// store state
	const kioskMode = useMapStore((state) => state.kioskMode);
	const currentLang = useMapStore((state) => state.currentLang);
	const filterItems = useMapStore((state) => state.filterItems);
	const map = useMapStore((state) => state.map);
	const routeFinish = useMapStore((state) => state.routeFinish);
	const routeStart = useMapStore((state) => state.routeStart);
	const activeFilter = useMapStore((state) => state.activeFilter);
	const activeKiosk = useMapStore((state) => state.activeKiosk);
	const features = useMapStore((state) => state.features);
	const places = useMapStore((state) => state.places);
	const currentPlace = useMapStore((state) => state.currentPlace);
	const accessibleRoute = useMapStore((state) => state.accessibleRoute);

	// store actions
	const setMap = useMapStore(useShallow((state) => state.setMap));
	const setPlaces = useMapStore((state) => state.setPlaces);
	const setCurrentPlace = useMapStore((state) => state.setCurrentPlace);
	const setFloors = useMapStore((state) => state.setFloors);
	const setCurrentFloor = useMapStore((state) => state.setCurrentFloor);
	const setFeatures = useMapStore((state) => state.setFeatures);
	const setAmenities = useMapStore((state) => state.setAmenities);
	const setRouteStart = useMapStore((state) => state.setRouteStart);
	const setRouteFinish = useMapStore((state) => state.setRouteFinish);
	const setHaveRouteDetails = useMapStore((state) => state.setHaveRouteDetails);
	const setRouteDetails = useMapStore((state) => state.setRouteDetails);
	const setCurrentStep = useMapStore((state) => state.setCurrentStep);
	const setActiveFilter = useMapStore((state) => state.setActiveFilter);
	const setAccessibleRoute = useMapStore((state) => state.setAccessibleRoute);
	const setShowCustomRoutePicker = useMapStore(
		(state) => state.setShowCustomRoutePicker
	);

	// This effect hook handles route start state changes
	useEffect(() => {
		console.log('start efffect');
		if (routeStart?.id) {
			console.log('routeStart', routeStart);
			// if we also have route finish generate route and reset the current step
			if (routeFinish?.id) {
				findRoute({
					finish: routeFinish.id,
					start: routeStart.id === 'kiosk' ? undefined : routeStart.id,
				});
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
			setActiveFilter({} as FilterItemModel);
			setShowCustomRoutePicker(false);
		} else {
			console.log('routeFinish cancelled', routeFinish);
			if (Object.keys(map).length > 0) {
				// cancel route if it's rendered
				map.cancelRoute();
				// remove polygon selection after route finish is cancelled
				map.handlePolygonSelection();
			}
		}
	}, [map, routeFinish, setActiveFilter, setShowCustomRoutePicker]);

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

	// This effect hook handles URL query parameters related to start, destination and place
	useEffect(() => {
		const urlParams = new URLSearchParams(window.location.search);
		const startParam = urlParams.get('startFeature'); // in case you change url param name in urlParams option of map constuctor, change that too
		const destinationParam = urlParams.get('destinationFeature'); // in case you change url param name in urlParams option of map constuctor, change that too
		const placeParam = urlParams.get('defaultPlace'); // in case you change url param name in urlParams option of map constuctor, change that too

		const startFeature = startParam
			? features.find(
					(f) =>
						f.id === startParam ||
						f.properties.id === startParam ||
						f.properties.title === startParam
			  )
			: undefined;
		if (startFeature) {
			setRouteStart(startFeature);
		}

		const destinationFeature = destinationParam
			? features.find(
					(f) =>
						f.id === destinationParam ||
						f.properties.id === destinationParam ||
						f.properties.title === destinationParam
			  )
			: undefined;
		if (destinationFeature) {
			setRouteFinish(destinationFeature);
		}

		const defaultPlace = placeParam
			? places.find((p) => p.id === placeParam || p.name === placeParam)
			: undefined;
		if (defaultPlace) {
			map.setPlace(defaultPlace.id);
		}
	}, [features, setRouteFinish, setRouteStart, places, currentPlace, map]);

	// This effect hook language change
	useEffect(() => {
		console.log('change language', currentLang);
		i18n.changeLanguage(currentLang);
		if (Object.keys(map).length > 0) {
			map.setLanguage(currentLang);
		}
	}, [currentLang, map]);

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
						pitch: kioskMode && activeKiosk?.pitch ? activeKiosk.pitch : pitch,
						bearing:
							kioskMode && activeKiosk?.bearing ? activeKiosk.bearing : bearing,
					},
					defaultPlaceId: defaultPlaceId, // if you have more than 1 place in your account, it's a good idea to define defaultPlaceId for the map, otherwise the first one will be picked up
					isKiosk: kioskMode, // if enabled starting point for routing will be based on values defined in kioskSettings, if disabled findRoute methods will expect start point to be send.
					kioskSettings: {
						coordinates:
							kioskMode && activeKiosk?.longitude && activeKiosk?.latitude
								? [activeKiosk.longitude, activeKiosk.latitude]
								: (defaultLocation.coordinates as [number, number]),
						level:
							kioskMode && activeKiosk?.level
								? activeKiosk.level
								: defaultLocation.level,
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

					// handle kiosk mode intitialization
					if (kioskMode) {
						const kioskPoi = mapState.allFeatures.features.find(
							(f) => f.id === activeKiosk?.poiId
						);
						if (activeKiosk?.bounds) {
							map.getMapboxInstance().setMaxBounds(activeKiosk.bounds);
						}
						if (activeKiosk?.zoom) {
							map.getMapboxInstance().setZoom(activeKiosk.zoom);
						}
						if (kioskPoi && activeKiosk) {
							activeKiosk.longitude = kioskPoi.geometry.coordinates[0];
							activeKiosk.latitude = kioskPoi.geometry.coordinates[1];
							activeKiosk.level = kioskPoi.properties.level;

							if (
								activeKiosk.longitude &&
								activeKiosk.latitude &&
								typeof activeKiosk.level !== 'undefined'
							) {
								map.setKiosk(
									activeKiosk.latitude,
									activeKiosk.longitude,
									activeKiosk.level
								);
							}
						}
					}
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

				// subscribe to route failed listener
				map.getRouteFailedListener().subscribe((res) => {
					console.log('route failed', res);
					// if route found failed, try again with non/accessible route
					setAccessibleRoute(!accessibleRoute);
				});

				// subscribe to nav step listener and set current step from that
				map.getNavStepSetListener().subscribe((step) => {
					setCurrentStep(step);
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
