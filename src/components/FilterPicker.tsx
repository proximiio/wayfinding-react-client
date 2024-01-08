import React from 'react';
import { t } from 'i18next';
import { AnimatePresence, motion } from 'framer-motion';
import Feature from 'proximiio-js-library/lib/models/feature';
import { FilterItemModel } from '@/models/filterItem.model';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

import useMapStore from '@/store/mapStore';

interface FilterPickerProps {
	heading: string;
	color: 'primary' | 'secondary';
	items: FilterItemModel[];
}

function FilterPicker({ heading, color, items }: FilterPickerProps) {
	const kioskMode = useMapStore((state) => state.kioskMode);
	const gpsMode = useMapStore((state) => state.gpsMode);
	const map = useMapStore((state) => state.map);
	const setActiveFilter = useMapStore((state) => state.setActiveFilter);
	const setRouteStart = useMapStore((state) => state.setRouteStart);
	const setRouteFinish = useMapStore((state) => state.setRouteFinish);

	const filterClickHandler = (item: FilterItemModel) => {
		if ((!gpsMode && !kioskMode) || item.type !== 'closest') {
			setActiveFilter(item);
		} else {
			const closestFeature = map.getClosestFeature(
				item.id as string
			) as Feature;
			setRouteStart('kiosk');
			setRouteFinish(closestFeature);
		}
	};

	return (
		<>
			<AnimatePresence>
				<motion.h1
					initial={{ scale: 2, opacity: 0, filter: 'blur(100px)' }}
					animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
					transition={{ duration: 0.2 }}
					className={cn(
						`text-md font-semibold mb-1 sm:text-xl sm:mb-2`,
						color === 'primary' && 'text-primary',
						color === 'secondary' && 'text-secondary'
					)}
					key='heading'
				>
					{heading}
				</motion.h1>
				<ul className='grid grid-cols-5 gap-2 mb-2 sm:mb-6'>
					{items.map((item, idx) => (
						<motion.li
							initial={{ scale: 0, opacity: 0 }}
							animate={{ scale: 1, opacity: 1 }}
							transition={{
								type: 'spring',
								stiffness: 260,
								damping: 20,
								delay: 0.1 + idx / 10,
							}}
							key={idx}
							className='w-12 text-center sm:w-16'
						>
							<Button
								size='icon'
								variant={color === 'primary' ? 'default' : 'secondary'}
								className='w-12 h-12 text-lg sm:w-16 sm:h-16 sm:text-2xl'
								onClick={() => filterClickHandler(item)}
							>
								{item.icon && React.createElement(item.icon)}
								{item.iconImage && (
									<img
										src={item.iconImage}
										alt={t(item.title)}
										className='w-1/2'
									/>
								)}
							</Button>
							<p className='mt-1 overflow-hidden text-xs text-ellipsis whitespace-nowrap sm:whitespace-normal'>
								{t(item.title)}
							</p>
						</motion.li>
					))}
				</ul>
			</AnimatePresence>
		</>
	);
}

export default FilterPicker;
