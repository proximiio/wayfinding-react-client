import { useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import useMapStore from '@/store/mapStore';

function PoiDetailsImage() {
	const [loading, setLoading] = useState(true);
	const poi = useMapStore((state) => state.routeFinish);

	const getImageUrl = () => {
		return `https://api.proximi.fi/v5/geo/${poi.properties.images[0]}?token=${
			import.meta.env.VITE_PROXIMIIO_TOKEN
		}`;
	};

	return (
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
	);
}

export default PoiDetailsImage;
