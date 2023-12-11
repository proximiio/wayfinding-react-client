import { motion } from 'framer-motion';
import useMapStore from '@/store/mapStore';
import { t } from 'i18next';
import PoiSelect from './PoiSelect';
import ClosestAmenitySelect from './ClosestAmenitySelect';
import { Button } from './ui/button';
import { PiPersonSimpleWalk } from 'react-icons/pi';
import { FilterItemModel } from '@/models/filterItem.model';
import Feature from 'proximiio-js-library/lib/models/feature';

function RouteForm() {
	const features = useMapStore((state) => state.features);
	const activeFilter = useMapStore((state) => state.activeFilter);
	const routeStart = useMapStore((state) => state.routeStart);
	const routeFinish = useMapStore((state) => state.routeFinish);
	const map = useMapStore((state) => state.map);

	const setRouteStart = useMapStore((state) => state.setRouteStart);
	const setRouteFinish = useMapStore((state) => state.setRouteFinish);
	const setActiveFilter = useMapStore((state) => state.setActiveFilter);

	const startSelectHandler = (featureId: string) => {
		const feature = features.find((item) => item.id === featureId)!;
		setRouteStart(feature);
	};

	const clickHandler = () => {
		if (routeStart?.id && routeFinish?.id) {
			console.log('should find regular route');
			return;
		}
		if (routeStart?.id && activeFilter?.id) {
			console.log('should find closest amenity route');
			const closestFeature = map.getClosestFeature(activeFilter.id as string, routeStart) as Feature;
			setRouteFinish(closestFeature);
			setActiveFilter({} as FilterItemModel);
			return;
		}
	};

	return (
		<>
			<motion.div
				key='list'
				initial={{ opacity: 0, scale: 0 }}
				animate={{ opacity: 1, scale: 1 }}
				exit={{ opacity: 0, scale: 0 }}
				transition={{ duration: 0.2 }}
				className='absolute z-10 p-3 pt-12 border-2 rounded-lg bg-white/80 top-20 left-5 sm:p-5 sm:pt-16'
			>
				<h2 className='mb-4 text-lg font-semibold text-primary'>
					{t(activeFilter.title)}
				</h2>
				<PoiSelect selectedPoi={routeStart} onSelect={startSelectHandler} />
				{activeFilter?.type === 'closest' && <ClosestAmenitySelect />}
				<Button
					className='flex w-full'
					disabled={!routeStart?.id || !activeFilter?.id}
					onClick={clickHandler}
				>
					<PiPersonSimpleWalk className='mr-2 text-2xl' />
					{t('takeMeThere')}
				</Button>
			</motion.div>
		</>
	);
}

export default RouteForm;
