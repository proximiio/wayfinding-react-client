/* eslint-disable no-mixed-spaces-and-tabs */
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import useMapStore from '@/store/mapStore';
import { t } from 'i18next';
import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';
import { getFloorName } from '@/lib/utils';
import { TfiAngleDown, TfiAngleUp } from 'react-icons/tfi';
import { PiCar } from 'react-icons/pi';
import { PiPersonSimpleWalk } from 'react-icons/pi';
import { TbRoute } from 'react-icons/tb';
import Feature from 'proximiio-js-library/lib/models/feature';

const defaultDetails =
	'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';

function PoiDetails() {
	const [loading, setLoading] = useState(true);
	const [details, setDetails] = useState(defaultDetails);
	const [showMore, setShowMore] = useState(false);
	const [limit, setLimit] = useState(200);
	const [linkUrl, setLinkUrl] = useState('');
	const [closestParkingFeature, setClosestParkingFeature] = useState(
		{} as Feature
	);

	//store state
	const map = useMapStore((state) => state.map);
	const features = useMapStore((state) => state.features);
	const floors = useMapStore((state) => state.floors);
	const poi = useMapStore((state) => state.routeFinish);
	const currentLanguage = useMapStore((state) => state.currentLang);

	//store actions
	const setRouteStart = useMapStore((state) => state.setRouteStart);
	const setShowCustomRoutePicker = useMapStore((state) => state.setShowCustomRoutePicker);

	const entranceFeatureId = import.meta.env.VITE_WAYFINDING_ENTRANCE_FEATURE_ID;
	const parkingAmenityId = import.meta.env.VITE_WAYFINDING_PARKING_AMENITY_ID;

	useEffect(() => {
		const getClosestParking = () => {
			if (poi.properties) {
				const closestParkingFeature = map.getClosestFeature(
					parkingAmenityId,
					poi
				) as Feature;
				closestParkingFeature.properties.title =
					closestParkingFeature.properties.title_i18n &&
					closestParkingFeature.properties.title_i18n[currentLanguage]
						? closestParkingFeature.properties.title_i18n[currentLanguage]
						: closestParkingFeature.properties.title;
				setClosestParkingFeature(closestParkingFeature);
			}
		};

		const getUrl = () => {
			if (poi.properties) {
				const url =
					typeof poi.properties.url === 'undefined'
						? typeof poi.properties.metadata !== 'undefined'
							? poi.properties.metadata.url
							: 'yolo'
						: poi.properties.url;
				if (url) {
					let protocol = url.startsWith('http://') ? 1 : 0;
					if (protocol === 0) protocol = url.startsWith('https://') ? 2 : 0;
					setLinkUrl(protocol === 0 ? `http://${url}` : url);
					return;
				}
				setLinkUrl(url);
			}
		};

		const definePoi = () => {
			console.log('define poi');
			if (poi.properties) {
				if (!poi.properties._dynamic) poi.properties._dynamic = {};
				if (!poi.geometry.type) poi.geometry.type = 'Point';
				poi.properties.title =
					poi.properties.title_i18n &&
					poi.properties.title_i18n[currentLanguage]
						? poi.properties.title_i18n[currentLanguage]
						: poi.properties.title;
				poi.properties._dynamic.floor = poi.properties.floor_id
					? floors.find((i) => i.id === poi.properties.floor_id)
					: null;
				poi.properties._dynamic.floorName = poi.properties._dynamic.floor
					? getFloorName({
							floor: poi.properties._dynamic.floor,
							language: currentLanguage,
					  })
					: null;
				if (poi.properties.description_i18n) {
					setDetails(
						poi.properties.description_i18n[currentLanguage]
							? poi.properties.description_i18n[currentLanguage]
							: poi.properties.description_i18n.en
					);
				}
				getClosestParking();
				getUrl();
			}
		};
		definePoi();
	}, [currentLanguage, floors, map, parkingAmenityId, poi]);

	const handleGetRouteClick = (from: string) => {
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

	const getImageUrl = () => {
		return `https://api.proximi.fi/v5/geo/${poi.properties.images[0]}?token=${
			import.meta.env.VITE_PROXIMIIO_TOKEN
		}`;
	};

	const getOpenHours = () => {
		const d = new Date();
		const weekDay = d.getDay();

		if (poi.properties) {
			if (poi.properties.workingHours && poi.properties.workingHours[weekDay]) {
				return `${poi.properties.workingHours[weekDay][0]} - ${poi.properties.workingHours[weekDay][1]}`;
			} else if (
				poi.properties.metadata &&
				poi.properties.metadata.openHours &&
				poi.properties.metadata.openHours[weekDay].en
			) {
				return poi.properties.metadata.openHours[weekDay][currentLanguage]
					? poi.properties.metadata.openHours[weekDay][currentLanguage]
					: poi.properties.metadata.openHours[weekDay].en;
			} else {
				return t('noOpenHours');
			}
		}
	};

	const locateParkingHandler = () => {
		map.centerToFeature(closestParkingFeature.id);
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
					{/*<div>qr-code</div>*/}
					<h3 className='text-sm text-primary'>{getOpenHours()}</h3>
					<h3 className='mb-8 text-sm font-semibold'>
						{t('floor')}:{' '}
						{poi.properties?._dynamic?.floorName
							? poi.properties?._dynamic.floorName
							: poi.properties?.level}
					</h3>
					{details && (
						<div className='mb-4'>
							<p className='text-sm'>
								{details.slice(0, limit)} {details.length > limit ? '...' : ''}
							</p>
							{details.length > limit && (
								<span
									onClick={() => {
										setLimit(details.length);
										setShowMore(true);
									}}
									className='text-sm font-semibold cursor-pointer hover:text-primary'
								>
									{t('showMore')}
									<TfiAngleDown className='inline-flex ml-1 text-xs' />
								</span>
							)}
							{showMore && (
								<span
									onClick={() => {
										setLimit(200);
										setShowMore(false);
									}}
									className='text-sm font-semibold cursor-pointer hover:text-primary'
								>
									{t('showLess')}
									<TfiAngleUp className='inline-flex ml-1 text-xs' />
								</span>
							)}
						</div>
					)}
					{linkUrl && (
						<p className='text-sm'>
							{t('link')}:{' '}
							<a href={linkUrl} target='_blank' className='hover:text-primary'>
								{linkUrl}
							</a>
						</p>
					)}
					{closestParkingFeature && closestParkingFeature?.properties && (
						<p
							className='cursor-pointer text-primary hover:text-accent'
							onClick={locateParkingHandler}
						>
							<strong>{t('closest-parking')}:</strong>{' '}
							{closestParkingFeature.properties.title}
						</p>
					)}
					<div className='grid grid-cols-3 gap-2 mt-4'>
						<Button
							onClick={() => handleGetRouteClick('parking')}
							className='flex flex-col h-auto gap-1 font-light whitespace-normal'
						>
							<PiCar className='block text-2xl' />
							{t('route-from-parking')}
						</Button>
						<Button
							onClick={() => handleGetRouteClick('entrance')}
							className='flex flex-col h-auto gap-1 font-light whitespace-normal'
						>
							<PiPersonSimpleWalk className='block text-2xl' />
							{t('route-from-entrance')}
						</Button>
						<Button
							onClick={() => handleGetRouteClick('other')}
							className='flex flex-col h-auto gap-1 font-light whitespace-normal'
						>
							<TbRoute className='block text-2xl' />
							{t('other-route')}
						</Button>
					</div>
				</div>
			</motion.div>
		</>
	);
}
export default PoiDetails;
