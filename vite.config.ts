import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
	// Load env file based on `mode` in the current working directory.
	// Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
	const env = loadEnv(mode, process.cwd(), '');
	return {
		// vite config
		plugins: [react()],
		base: env.BASE_URL,
		preview: {
			port: parseInt(env.PORT),
			strictPort: true,
		},
		server: {
			port: parseInt(env.PORT),
			strictPort: true,
			host: true,
			origin: `http://0.0.0.0:${parseInt(env.port)}`,
		},
		resolve: {
			alias: {
				'@': path.resolve(__dirname, './src'),
			},
		},
	};
});
