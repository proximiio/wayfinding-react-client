import { Button } from './ui/button';
import { PiCar, PiPersonSimpleWalk } from 'react-icons/pi';
import { TbRoute } from 'react-icons/tb';
import { t } from 'i18next';
import Feature from 'proximiio-js-library/lib/models/feature';
import useMapStore from '@/store/mapStore';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';

interface PoiDetailsRoutesProps {
	closestParkingFeature: Feature;
	showMore: boolean;
}

function PoiDetailsRoutes({
	closestParkingFeature,
	showMore,
}: PoiDetailsRoutesProps) {
	const features = useMapStore((state) => state.features);
	const haveRouteDetails = useMapStore((state) => state.haveRouteDetails);
	const kioskMode = useMapStore((state) => state.kioskMode);
	const activeKiosk = useMapStore((state) => state.activeKiosk);
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
			return;
		}
		if (from === 'entrance') {
			const entranceFeature = features.find((f) => f.id === entranceFeatureId);
			if (entranceFeature) {
				setRouteStart(entranceFeature);
				console.log('from entrance', entranceFeature);
				return;
			}
		}
		if (from === 'other') {
			setShowCustomRoutePicker(true);
			console.log('from other');
			return;
		}
		if (from === 'kiosk') {
			const kioskFeature = new Feature({
				id: 'kiosk',
				geometry: {
					type: 'Point',
					coordinates: [activeKiosk?.longitude, activeKiosk?.latitude],
				},
				type: 'Feature',
				properties: {
					...activeKiosk,
				},
			});
			setRouteStart(kioskFeature);
			console.log('from kiosk', kioskFeature);
			return;
		}
	};

	return (
		<AnimatePresence>
			{kioskMode && (
				<motion.div
					className={cn(
						'mt-4',
						haveRouteDetails && 'lg:block',
						haveRouteDetails && !showMore && 'hidden'
					)}
					initial={{ scale: 0, opacity: 0 }}
					animate={{ scale: 1, opacity: 1 }}
					transition={{
						type: 'spring',
						stiffness: 260,
						damping: 20,
						delay: 0.2,
					}}
				>
					<Button
						onClick={() => getRouteHandler('kiosk')}
						className='flex w-full'
					>
						<PiPersonSimpleWalk className='mr-2 text-2xl' />
						{t('takeMeThere')}
					</Button>
				</motion.div>
			)}
			{!kioskMode && (
				<motion.div
					className={cn(
						'grid grid-cols-3 gap-2 mt-4',
						haveRouteDetails && 'lg:grid',
						haveRouteDetails && !showMore && 'hidden'
					)}
					initial={{ scale: 0, opacity: 0 }}
					animate={{ scale: 1, opacity: 1 }}
					transition={{
						type: 'spring',
						stiffness: 260,
						damping: 20,
						delay: 0.2,
					}}
				>
					<Button
						onClick={() => getRouteHandler('parking')}
						className='flex flex-col h-auto gap-1 font-light whitespace-normal'
					>
						<PiCar className='block text-lg lg:text-2xl' />
						{t('route-from-parking')}
					</Button>
					<Button
						onClick={() => getRouteHandler('entrance')}
						className='flex flex-col h-auto gap-1 font-light whitespace-normal'
					>
						<PiPersonSimpleWalk className='block text-lg lg:text-2xl' />
						{t('route-from-entrance')}
					</Button>
					<Button
						onClick={() => getRouteHandler('other')}
						className='flex flex-col h-auto gap-1 font-light whitespace-normal'
					>
						<TbRoute className='block text-lg lg:text-2xl' />
						{t('other-route')}
					</Button>
				</motion.div>
			)}
		</AnimatePresence>
	);
}

export default PoiDetailsRoutes;
