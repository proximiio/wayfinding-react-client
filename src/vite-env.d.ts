/// <reference types="vite/client" />
interface ImportMetaEnv {
	readonly VITE_APP_TITLE: string;
	readonly VITE_PROXIMIIO_TOKEN: string;
	readonly VITE_PROXIMIIO_API: string;
	readonly VITE_PROXIMIIO_GEO_VERSION: string;
	readonly VITE_WAYFINDING_DEFAULT_PLACE_ID: string;
	readonly VITE_WAYFINDING_ENTRANCE_FEATURE_ID: string;
	readonly VITE_WAYFINDING_PARKING_AMENITY_ID: string;
	readonly VITE_WAYFINDING_DEFAULT_LOCATION_LONGITUDE: number;
	readonly VITE_WAYFINDING_DEFAULT_LOCATION_LATITUDE: number;
	readonly VITE_WAYFINDING_DEFAULT_LOCATION_LEVEL: number;
	readonly VITE_WAYFINDING_DEFAULT_ZOOM: number;
	readonly VITE_WAYFINDING_DEFAULT_PITCH: number;
	readonly VITE_WAYFINDING_DEFAULT_BEARING: number;
	readonly VITE_WAYFINDING_SHOW_LANGUAGE_TOGGLE: 'true' | 'false';
	readonly VITE_WAYFINDING_SHOW_RESET_BUTTON: 'true' | 'false';
	readonly VITE_WAYFINDING_USE_VIRTUAL_KEYBOARD_AT_KIOSKS: 'true' | 'false';
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
