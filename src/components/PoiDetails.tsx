import { useState } from 'react';
import { Button } from '@/components/ui/button';
import useMapStore from '@/store/mapStore';
import { t } from 'i18next';
import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';

function PoiDetails() {
	const [loading, setLoading] = useState(true);

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

	const getImageUrl = () => {
		return `https://api.proximi.fi/v5/geo/${poi.properties.images[0]}?token=${
			import.meta.env.VITE_PROXIMIIO_TOKEN
		}`;
	};

	return (
		<>
			<motion.div
				key='details'
				initial={{ opacity: 0, scale: 0 }}
				animate={{ opacity: 1, scale: 1 }}
				exit={{ opacity: 0, scale: 0 }}
				transition={{ duration: 0.2 }}
				className='absolute z-10 max-w-xs overflow-x-hidden overflow-y-auto bg-white rounded-lg shadow-xl top-20 left-5 lg:max-w-md'
			>
				<div>
					{loading && (
						<div className='flex items-center h-56 p-8'>
							<Skeleton className='w-12 h-12 rounded-full' />
							<div className='space-y-2'>
								<Skeleton className='h-4 w-[250px]' />
								<Skeleton className='h-4 w-[200px]' />
							</div>
						</div>
					)}
					<img
						src={
							poi.properties?.images[0]
								? getImageUrl()
								: 'https://picsum.photos/500/300'
						}
						alt={poi.properties?.title}
						onLoad={() => {
							setLoading(false);
						}}
						className='w-full'
					/>
				</div>
				<div className='px-6 py-2 bg-white rounded-tr-2xl relative top-[-20px] lg:px-10 lg:py-5'>
					<h1 className='text-2xl font-semibold text-primary'>
						{poi.properties?.title}
					</h1>
					<Button onClick={() => handleGetRouteClick('parking')}>
						{t('route-from-parking')}
					</Button>
					<Button onClick={() => handleGetRouteClick('entrance')}>
						{t('route-from-entrance')}
					</Button>
					<Button onClick={() => handleGetRouteClick('other')}>
						{t('other-route')}
					</Button>
				</div>
			</motion.div>
		</>
	);
}
export default PoiDetails;
