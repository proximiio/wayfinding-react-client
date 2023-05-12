/// <reference types="vite/client" />
interface ImportMetaEnv {
	readonly VITE_APP_TITLE: string;
	readonly VITE_PROXIMIIO_TOKEN: string;
	readonly VITE_PROXIMIIO_API: string;
	readonly VITE_PROXIMIIO_GEO_VERSION: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
