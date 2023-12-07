import { motion } from 'framer-motion';
import useMapStore from '@/store/mapStore';
import { FilterItemModel } from '@/models/filterItem.model';

function PoiList() {
	const activeFilter = useMapStore((state) => state.activeFilter);
	const pois = useMapStore((state) => state.getSortedPOIs());
	const features = useMapStore((state) => state.features);

	const setRouteFinish = useMapStore((state) => state.setRouteFinish);
	const setActiveFilter = useMapStore((state) => state.setActiveFilter);

	const filteredPois = pois
		.filter((feature) => {
			return (
				(Array.isArray(activeFilter.id)
					? activeFilter.id.includes(feature.properties.amenity)
					: feature.properties.amenity === activeFilter.id) &&
				feature.properties.type === 'poi'
			);
		})
		.sort((a, b) => (a.properties.title > b.properties.title ? 1 : -1));
	// .sort((a, b) => (a.properties.level > b.properties.level ? 1 : -1));

	const onSelectHandle = (featureId: string) => {
		const feature = features.find((feature) => feature.id === featureId)!;
		setRouteFinish(feature);
		setActiveFilter({} as FilterItemModel);
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
				<ul>
					{filteredPois.map((feature, idx) => (
						<motion.li
							key={feature.properties.id}
							initial={{ scale: 0, opacity: 0 }}
							animate={{ scale: 1, opacity: 1 }}
							transition={{
								type: 'spring',
								stiffness: 260,
								damping: 20,
								delay: 0.1 + idx / 10,
							}}
							className='font-semibold flex items-center justify-between px-1 py-2 border-b border-b-black/30 min-w-[320px] last:border-b-0 cursor-pointer group'
							onClick={() => onSelectHandle(feature.id)}
						>
							<span className='text-lg group-hover:text-primary'>
								{feature.properties.title}
							</span>
							<span className='inline-flex items-center justify-center w-8 h-8 text-sm text-center rounded-md bg-primary/70 text-primary-foreground group-hover:bg-primary'>
								{feature.floorName}
							</span>
						</motion.li>
					))}
				</ul>
			</motion.div>
		</>
	);
}

export default PoiList;
