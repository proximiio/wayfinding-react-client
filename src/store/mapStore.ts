import { Map } from 'proximiio-js-library/lib/components/map/main';
import Feature from 'proximiio-js-library/lib/models/feature';
import { FloorModel } from 'proximiio-js-library/lib/models/floor';
import { create } from 'zustand';

// import { devtools } from 'zustand/middleware';
// define types for state values and actions separately
type State = {
	appInitiated: boolean;
	map: Map;
	kioskMode: boolean;
	currentLang: string;
	floors: FloorModel[];
	currentFloor: FloorModel;
	routeStart: Feature;
	routeFinish: Feature;
	features: Feature[];
	accessibleRoute: boolean;
};

type Actions = {
	setAppInitiated: (initiated: boolean) => void;
	setMap: (map: Map) => void;
	setKioskMode: (isKiosk: boolean) => void;
	setCurrentLang: (language: string) => void;
	setFloors: (floors: FloorModel[]) => void;
	setCurrentFloor: (floor: FloorModel) => void;
	setRouteStart: (feature: Feature) => void;
	setRouteFinish: (feature: Feature) => void;
	setFeatures: (features: Feature[]) => void;
	setAccessibleRoute: (accessibleRoute: boolean) => void;
	reset: () => void;
};

// define the initial state
const initialState: State = {
	appInitiated: false,
	map: {} as Map,
	kioskMode: false,
	currentLang: 'en',
	floors: [],
	currentFloor: {} as FloorModel,
	routeStart: {} as Feature,
	routeFinish: {} as Feature,
	features: [],
	accessibleRoute: false,
};

const useMapStore = create<State & Actions>()(
	//devtools(
	(set) => ({
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
		setFloors: (floors) => {
			set(() => ({ floors }));
		},
		setCurrentFloor: (floor) => {
			set(() => ({ currentFloor: floor }));
		},
		setRouteStart: (feature) => {
			set(() => ({ routeStart: feature }));
		},
		setRouteFinish: (feature) => {
			set(() => ({ routeFinish: feature }));
		},
		setFeatures: (features) => {
			set(() => ({ features }));
		},
		setAccessibleRoute: (accessibleRoute) => {
			set(() => ({ accessibleRoute }));
		},
		reset: () => {
			set(initialState);
		},
	})
	//{ name: 'mapStore' }
	//)
);

export default useMapStore;
