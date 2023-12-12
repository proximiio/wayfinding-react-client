import { Button } from './ui/button';
import { PiCar, PiPersonSimpleWalk } from 'react-icons/pi';
import { TbRoute } from 'react-icons/tb';
import { t } from 'i18next';
import Feature from 'proximiio-js-library/lib/models/feature';
import useMapStore from '@/store/mapStore';

interface PoiDetailsRoutesProps {
	closestParkingFeature: Feature;
}

function PoiDetailsRoutes({ closestParkingFeature }: PoiDetailsRoutesProps) {
	const features = useMapStore((state) => state.features);
	const setRouteStart = useMapStore((state) => state.setRouteStart);
	const setShowCustomRoutePicker = useMapStore(
		(state) => state.setShowCustomRoutePicker
	);
	const entranceFeatureId = import.meta.env.VITE_WAYFINDING_ENTRANCE_FEATURE_ID;

	const getRouteHandler = (from: string) => {
		console.log('get route');
		if (from === 'parking' && closestParkingFeature?.properties) {
			console.log('from parking');
			setRouteStart(closestParkingFeature);
		}
		if (from === 'entrance') {
			const entranceFeature = features.find((f) => f.id === entranceFeatureId);
			if (entranceFeature) {
				setRouteStart(entranceFeature);
				console.log('from entrance', entranceFeature);
			}
		}
		if (from === 'other') {
			setShowCustomRoutePicker(true);
			console.log('from other');
		}
	};

	return (
		<div className='grid grid-cols-3 gap-2 mt-4'>
			<Button
				onClick={() => getRouteHandler('parking')}
				className='flex flex-col h-auto gap-1 font-light whitespace-normal'
			>
				<PiCar className='block text-2xl' />
				{t('route-from-parking')}
			</Button>
			<Button
				onClick={() => getRouteHandler('entrance')}
				className='flex flex-col h-auto gap-1 font-light whitespace-normal'
			>
				<PiPersonSimpleWalk className='block text-2xl' />
				{t('route-from-entrance')}
			</Button>
			<Button
				onClick={() => getRouteHandler('other')}
				className='flex flex-col h-auto gap-1 font-light whitespace-normal'
			>
				<TbRoute className='block text-2xl' />
				{t('other-route')}
			</Button>
		</div>
	);
}

export default PoiDetailsRoutes;
