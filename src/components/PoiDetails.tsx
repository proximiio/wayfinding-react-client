import Feature from 'proximiio-js-library/lib/models/feature';
import { Button } from '@/components/ui/button';
import useMapStore from '@/store/mapStore';
import { t } from 'i18next';

function PoiDetails() {
	//store state
	const features = useMapStore((state) => state.features);
	const poi = useMapStore((state) => state.routeFinish);

	//store actions
	const setRouteStart = useMapStore((state) => state.setRouteStart);
	const setRouteFinish = useMapStore((state) => state.setRouteFinish);

	const entranceFeatureId = import.meta.env.VITE_WAYFINDING_ENTRANCE_FEATURE_ID;

	const handleCloseClick = () => {
		setRouteFinish({} as Feature);
		setRouteStart({} as Feature);
	};

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
		<div className='container absolute z-10 w-1/4 px-5 py-8 bg-white'>
			<Button
				type='button'
				variant='secondary'
				className='float-right'
				onClick={handleCloseClick}
			>
				X
			</Button>
			<h1 className='text-xl font-bold'>{poi.properties.title}</h1>
			<Button onClick={() => handleGetRouteClick('parking')}>
				{t('route-from-parking')}
			</Button>
			<Button onClick={() => handleGetRouteClick('entrance')}>
			{t('route-from-entrance')}
			</Button>
			<Button onClick={() => handleGetRouteClick('other')}>{t('other-route')}</Button>
		</div>
	);
}
export default PoiDetails;
