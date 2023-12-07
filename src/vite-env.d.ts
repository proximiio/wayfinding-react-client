/// <reference types="vite/client" />
interface ImportMetaEnv {
	readonly VITE_APP_TITLE: string;
	readonly VITE_PROXIMIIO_TOKEN: string;
	readonly VITE_PROXIMIIO_API: string;
	readonly VITE_PROXIMIIO_GEO_VERSION: string;
	readonly VITE_WAYFINDING_DEFAULT_PLACE_ID: string;
	readonly VITE_WAYFINDING_ENTRANCE_FEATURE_ID: string;
	readonly VITE_WAYFINDING_PARKING_AMENITY_ID: string;
	readonly VITE_WAYFINDING_DEFAULT_LOCATION_COORDINATES: [number, number];
	readonly VITE_WAYFINDING_DEFAULT_LOCATION_LEVEL: number;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
