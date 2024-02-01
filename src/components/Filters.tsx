import { t } from 'i18next';
import { motion } from 'framer-motion';
import FilterPicker from './FilterPicker';

import useMapStore from '@/store/mapStore';

function Filters() {
	const filterCategories = useMapStore((state) => state.filterCategories);

	return (
		<>
			<motion.div
				key='filters'
				initial={{ opacity: 0, scale: 0 }}
				animate={{ opacity: 1, scale: 1 }}
				exit={{ opacity: 0, scale: 0 }}
				transition={{ duration: 0.2 }}
				className='absolute z-10 p-3 pt-12 border-2 rounded-lg bg-white/80 top-5 sm:top-20 left-2 sm:left-5 sm:p-5 sm:pt-16'
			>
				{filterCategories.map((category) => (
					<FilterPicker
						key={category.title}
						heading={t(category.title)}
						items={category.items}
						color={category.colorVariant}
					/>
				))}
			</motion.div>
		</>
	);
}

export default Filters;
