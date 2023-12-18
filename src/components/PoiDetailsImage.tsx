import { useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import useMapStore from '@/store/mapStore';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';

function PoiDetailsImage({ showMore }: { showMore: boolean }) {
	const [loading, setLoading] = useState(true);
	const poi = useMapStore((state) => state.routeFinish);

	const getImageUrl = () => {
		return `https://api.proximi.fi/v5/geo/${poi.properties.images[0]}?token=${
			import.meta.env.VITE_PROXIMIIO_TOKEN
		}`;
	};

	return (
		<AnimatePresence>
			<motion.div className={cn('lg:block max-h-96 overflow-hidden', !showMore && 'hidden')}>
				{loading && (
					<div className='flex items-center h-56 p-8'>
						<Skeleton className='w-12 h-12 rounded-full' />
						<div className='space-y-2'>
							<Skeleton className='h-4 w-[250px]' />
							<Skeleton className='h-4 w-[200px]' />
						</div>
					</div>
				)}
				<motion.img
					src={
						poi.properties?.images[0]
							? getImageUrl()
							: 'https://picsum.photos/500/300'
					}
					alt={poi.properties?.title}
					onLoad={() => {
						setLoading(false);
					}}
					initial={{ scale: 2, opacity: 0, filter: 'blur(100px)' }}
					animate={{ scale: 1, opacity: 1, filter: 'blur(0)' }}
					transition={{ duration: 0.4 }}
					className={cn('w-full', loading && 'hidden opacity-0')}
				/>
			</motion.div>
		</AnimatePresence>
	);
}

export default PoiDetailsImage;
