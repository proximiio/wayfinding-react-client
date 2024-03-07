import { useEffect, useState } from 'react';
import { t } from 'i18next';
import { AnimatePresence, motion } from 'framer-motion';
import { PiCamera, PiCar, PiPersonSimpleWalk } from 'react-icons/pi';
import { TbRoute } from 'react-icons/tb';
import { ImageDetection } from 'proximiio-js-library';
import Feature from 'proximiio-js-library/lib/models/feature';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

import useMapStore from '@/store/mapStore';

interface PoiDetailsRoutesProps {
	closestParkingFeature: Feature;
	showMore: boolean;
}

function PoiDetailsRoutes({
	closestParkingFeature,
	showMore,
}: PoiDetailsRoutesProps) {
	const features = useMapStore((state) => state.features);
	const pois = useMapStore((state) => state.getSortedPOIs());
	const haveRouteDetails = useMapStore((state) => state.haveRouteDetails);
	const kioskMode = useMapStore((state) => state.kioskMode);
	const gpsMode = useMapStore((state) => state.gpsMode);
	const setRouteStart = useMapStore((state) => state.setRouteStart);
	const setShowCustomRoutePicker = useMapStore(
		(state) => state.setShowCustomRoutePicker
	);
	const entranceFeatureId = import.meta.env.VITE_WAYFINDING_ENTRANCE_FEATURE_ID;

	const [enableGVision, setEnableGVision] = useState(
		import.meta.env.VITE_WAYDINDING_ENABLE_GVISION === 'true'
	);

	useEffect(() => {
		navigator.mediaDevices.enumerateDevices().then(function (devices) {
			const videoDevices = devices.filter(
				(device) => device.kind === 'videoinput'
			);
			setEnableGVision(videoDevices.length > 0);
		});
	});

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
			setRouteStart('kiosk');
			console.log('from kiosk');
			return;
		}
		if (from === 'gvision') {
			ImageDetection.init(
				{
					gVisionApiKey: import.meta.env.VITE_WAYFINDING_GVISION_APIKEY,
					pois,
				},
				(item) => {
					const feature = features.find((f) => f.id === item.id);
					if (feature) {
						setRouteStart(feature);
					}
				}
			);
		}
	};

	return (
		<AnimatePresence>
			{(kioskMode || gpsMode) && (
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
			{!kioskMode && !gpsMode && (
				<motion.div
					className={cn(
						'grid grid-cols-3 gap-2 mt-4',
						haveRouteDetails && 'lg:grid',
						haveRouteDetails && !showMore && 'hidden',
						enableGVision && 'grid-cols-4 gap-1'
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
					{enableGVision && (
						<Button
							onClick={() => getRouteHandler('gvision')}
							className='flex flex-col h-auto gap-1 font-light whitespace-normal'
						>
							<PiCamera className='block text-lg lg:text-2xl' />
							{t('identify-location')}
						</Button>
					)}
				</motion.div>
			)}
		</AnimatePresence>
	);
}

export default PoiDetailsRoutes;
