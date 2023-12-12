import { motion } from 'framer-motion';
import useMapStore from '@/store/mapStore';
import { t } from 'i18next';
import PoiSelect from './PoiSelect';
import ClosestAmenitySelect from './ClosestAmenitySelect';
import { Button } from './ui/button';
import { PiPersonSimpleWalk } from 'react-icons/pi';
import { FilterItemModel } from '@/models/filterItem.model';
import Feature from 'proximiio-js-library/lib/models/feature';
import { useState } from 'react';

function RouteForm() {
	const features = useMapStore((state) => state.features);
	const activeFilter = useMapStore((state) => state.activeFilter);
	const routeStart = useMapStore((state) => state.routeStart);
	const routeFinish = useMapStore((state) => state.routeFinish);
	const map = useMapStore((state) => state.map);
	const showCustomRoutePicker = useMapStore(
		(state) => state.showCustomRoutePicker
	);
	const [startFeature, setStartFeature] = useState(routeStart);
	const [finishFeature, setFinishFeature] = useState(routeFinish);

	const setRouteStart = useMapStore((state) => state.setRouteStart);
	const setRouteFinish = useMapStore((state) => state.setRouteFinish);
	const setActiveFilter = useMapStore((state) => state.setActiveFilter);

	const startSelectHandler = (featureId: string) => {
		setStartFeature(features.find((item) => item.id === featureId)!);
	};

	const finishSelectHandler = (featureId: string) => {
		setFinishFeature(features.find((item) => item.id === featureId)!);
	};

	const clickHandler = () => {
		if (startFeature?.id && finishFeature?.id) {
			console.log('should find regular route');
			setRouteStart(startFeature);
			setRouteFinish(finishFeature);
			return;
		}
		if (startFeature?.id && activeFilter?.id) {
			console.log('should find closest amenity route');
			const closestFeature = map.getClosestFeature(
				activeFilter.id as string,
				startFeature
			) as Feature;
			setRouteStart(startFeature);
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
				<PoiSelect
					selectedPoi={startFeature}
					onSelect={startSelectHandler}
					placeholder={t('startingPoint')}
				/>
				{showCustomRoutePicker && (
					<PoiSelect
						selectedPoi={finishFeature}
						onSelect={finishSelectHandler}
						placeholder={t('destination')}
					/>
				)}
				{activeFilter?.type === 'closest' && <ClosestAmenitySelect />}
				<Button
					className='flex w-full'
					disabled={
						(!startFeature?.id && !finishFeature?.id) || (!activeFilter?.id && !showCustomRoutePicker)
					}
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
