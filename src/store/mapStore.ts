/* eslint-disable no-mixed-spaces-and-tabs */
import { Map } from 'proximiio-js-library/lib/components/map/main';
import { AmenityModel } from 'proximiio-js-library/lib/models/amenity';
import Feature from 'proximiio-js-library/lib/models/feature';
import { FloorModel } from 'proximiio-js-library/lib/models/floor';
import { PlaceModel } from 'proximiio-js-library/lib/models/place';
import { create } from 'zustand';
import { isPointWithinRadius } from 'geolib';
import { getFloorName } from '@/lib/utils';
import { SortedPoiItemModel } from '@/models/sortedPoiItem.model';
import { FilterItemModel } from '@/models/filterItem.model';
import { filterItems } from './data';

// import { devtools } from 'zustand/middleware';
// define types for state values and actions separately
type State = {
	appInitiated: boolean;
	map: Map;
	kioskMode: boolean;
	currentLang: string;
	places: PlaceModel[];
	currentPlace: PlaceModel;
	floors: FloorModel[];
	currentFloor: FloorModel;
	routeStart: Feature;
	routeFinish: Feature;
	features: Feature[];
	amenities: AmenityModel[];
	accessibleRoute: boolean;
	filterItems: FilterItemModel[];
	activeFilter: FilterItemModel;
	showCustomRoutePicker: boolean;
};

type Actions = {
	setAppInitiated: (initiated: boolean) => void;
	setMap: (map: Map) => void;
	setKioskMode: (isKiosk: boolean) => void;
	setCurrentLang: (language: string) => void;
	setPlaces: (places: PlaceModel[]) => void;
	setCurrentPlace: (place: PlaceModel) => void;
	setFloors: (floors: FloorModel[]) => void;
	setCurrentFloor: (floor: FloorModel) => void;
	setRouteStart: (feature: Feature) => void;
	setRouteFinish: (feature: Feature) => void;
	setFeatures: (features: Feature[]) => void;
	setAmenities: (amenities: AmenityModel[]) => void;
	setAccessibleRoute: (accessibleRoute: boolean) => void;
	setActiveFilter: (activeFilter: FilterItemModel) => void;
	setShowCustomRoutePicker: (visible: boolean) => void;
	getSortedPOIs: () => SortedPoiItemModel[];
	reset: () => void;
};

// define the initial state
const initialState: State = {
	appInitiated: false,
	map: {} as Map,
	kioskMode: false,
	currentLang: 'en',
	places: [],
	currentPlace: {} as PlaceModel,
	floors: [],
	currentFloor: {} as FloorModel,
	routeStart: {} as Feature,
	routeFinish: {} as Feature,
	features: [],
	amenities: [],
	accessibleRoute: false,
	filterItems,
	activeFilter: {} as FilterItemModel,
	showCustomRoutePicker: false,
};

const defaultPlaceId = import.meta.env.VITE_WAYFINDING_DEFAULT_PLACE_ID;

const assignProperties = (
	poi: Feature,
	floors: FloorModel[],
	currentLang: string
) => {
	if (poi.properties) {
		if (!poi.properties._dynamic) poi.properties._dynamic = {};
		if (!poi.geometry.type) poi.geometry.type = 'Point';
		poi.properties.title =
			poi.properties.title_i18n && poi.properties.title_i18n[currentLang]
				? poi.properties.title_i18n[currentLang]
				: poi.properties.title;
		poi.properties._dynamic.floor = poi.properties.floor_id
			? floors.find((i) => i.id === poi.properties.floor_id)
			: null;
		poi.properties._dynamic.floorName = poi.properties._dynamic.floor
			? getFloorName({
					floor: poi.properties._dynamic.floor,
					language: currentLang,
			  })
			: null;
	}
	return poi;
};

const useMapStore = create<State & Actions>()(
	//devtools(
	(set, get) => ({
		...initialState,
		setAppInitiated: (initiated) => {
			set(() => ({ appInitiated: initiated }));
		},
		setMap: (map) => {
			set(() => ({ map }));
		},
		setKioskMode: (isKiosk) => {
			set(() => ({ kioskMode: isKiosk }));
		},
		setCurrentLang: (language) => {
			set(() => ({ currentLang: language }));
		},
		setPlaces: (places) => {
			set(() => ({ places }));
		},
		setCurrentPlace: (place) => {
			set(() => ({ currentPlace: place }));
		},
		setFloors: (floors) => {
			set(() => ({ floors }));
		},
		setCurrentFloor: (floor) => {
			set(() => ({ currentFloor: floor }));
		},
		setRouteStart: (feature) => {
			set(() => {
				feature = assignProperties(feature, get().floors, get().currentLang);
				return { routeStart: feature };
			});
		},
		setRouteFinish: (feature) => {
			set(() => {
				feature = assignProperties(feature, get().floors, get().currentLang);
				return { routeFinish: feature };
			});
		},
		setFeatures: (features) => {
			set(() => ({ features }));
		},
		setAmenities: (amenities) => {
			set(() => ({ amenities }));
		},
		setAccessibleRoute: (accessibleRoute) => {
			set(() => ({ accessibleRoute }));
		},
		setActiveFilter: (activeFilter) => {
			set(() => ({ activeFilter }));
		},
		setShowCustomRoutePicker: (visible) => {
			set(() => ({ showCustomRoutePicker: visible }));
		},
		getSortedPOIs: () => {
			const pois: SortedPoiItemModel[] = get()
				.features.filter(
					(feature) =>
						(feature.properties.usecase === 'poi' ||
							feature.properties.type === 'poi') &&
						feature.properties.type !== 'escalator' &&
						feature.properties.type !== 'elevator' &&
						feature.properties.type !== 'staircase' &&
						feature.properties.place_id === defaultPlaceId
				)
				.sort((a, b) => (a.properties.title > b.properties.title ? -1 : 1))
				.sort((a, b) => (a.properties.level > b.properties.level ? 1 : -1))
				.map((item) => {
					const isInside = isPointWithinRadius(
						{
							lat: item.geometry.coordinates[1],
							lng: item.geometry.coordinates[0],
						},
						{
							lat: get().currentPlace.location.lat,
							lng: get().currentPlace.location.lng,
						},
						10000
					);
					const floor = get().floors.find(
						(floor) => floor.id === item.properties.floor_id
					);

					// rewrite feature title based on current language
					item.properties.title = item.properties?.title_i18n
						? item.properties.title_i18n[get().currentLang]
							? item.properties.title_i18n[get().currentLang]
							: item.properties.title_i18n?.en
						: item.properties.title;

					return {
						...item,
						icon: get().amenities.filter(
							(amenity) => amenity.id === item.properties.amenity
						)[0]
							? get().amenities.filter(
									(amenity) => amenity.id === item.properties.amenity
							  )[0].icon
							: '',
						category: get().amenities.filter(
							(amenity) => amenity.id === item.properties.amenity
						)[0]
							? get().amenities.filter(
									(amenity) => amenity.id === item.properties.amenity
							  )[0].title
							: '',
						search_query: item.properties.title + ' ' + item.properties.level,
						coordinates: item.geometry.coordinates,
						isInside,
						score: 0,
						foundInDescription: false,
						floor,
						floorName: floor
							? getFloorName({ floor, language: get().currentLang })
							: '',
					};
				})
				.filter((item) => item.isInside);
			return pois;
		},
		reset: () => {
			set(initialState);
		},
	})
	//{ name: 'mapStore' }
	//)
);

export default useMapStore;
