import { Button } from '@/components/ui/button';
import useMapStore from '@/store/mapStore';
import { t } from 'i18next';
import { motion } from 'framer-motion';

function PoiDetails() {
	//store state
	const features = useMapStore((state) => state.features);
	const poi = useMapStore((state) => state.routeFinish);

	//store actions
	const setRouteStart = useMapStore((state) => state.setRouteStart);

	const entranceFeatureId = import.meta.env.VITE_WAYFINDING_ENTRANCE_FEATURE_ID;

	const handleGetRouteClick = (from: string) => {
		console.log('get route');
		if (from === 'parking') {
			console.log('from parking');
		}
		if (from === 'entrance') {
			const entranceFeature = features.find((f) => f.id === entranceFeatureId);
			if (entranceFeature) {
				setRouteStart(entranceFeature);
				console.log('from entrance', entranceFeature);
			}
		}
		if (from === 'other') {
			console.log('from other');
		}
	};

	return (
		<>
			<motion.div
				key='details'
				initial={{ opacity: 0, scale: 0 }}
				animate={{ opacity: 1, scale: 1 }}
				exit={{ opacity: 0, scale: 0 }}
				transition={{ duration: 0.2 }}
				className='absolute z-10 p-3 pt-12 border-2 rounded-lg bg-white/80 top-20 left-5 sm:p-5 sm:pt-16'
			>
				<h1 className='text-xl font-bold'>{poi.properties?.title}</h1>
				<Button onClick={() => handleGetRouteClick('parking')}>
					{t('route-from-parking')}
				</Button>
				<Button onClick={() => handleGetRouteClick('entrance')}>
					{t('route-from-entrance')}
				</Button>
				<Button onClick={() => handleGetRouteClick('other')}>
					{t('other-route')}
				</Button>
			</motion.div>
		</>
	);
}
export default PoiDetails;
