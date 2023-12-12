import useMapStore from '@/store/mapStore';
import { t } from 'i18next';
import Feature from 'proximiio-js-library/lib/models/feature';
import { useEffect } from 'react';

interface PoiDetailsParkingProps {
	closestParkingFeature: Feature;
	onSet: (feature: Feature) => void;
}

function PoiDetailsParking({
	closestParkingFeature,
	onSet,
}: PoiDetailsParkingProps) {
	const map = useMapStore((state) => state.map);
	const currentLanguage = useMapStore((state) => state.currentLang);
	const parkingAmenityId = import.meta.env.VITE_WAYFINDING_PARKING_AMENITY_ID;
	const poi = useMapStore((state) => state.routeFinish);

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
				onSet(closestParkingFeature);
			}
		};

		getClosestParking();
	}, [currentLanguage, map, onSet, parkingAmenityId, poi]);

	const locateParkingHandler = () => {
		map.centerToFeature(closestParkingFeature.id);
	};

	return (
		<>
			{closestParkingFeature && closestParkingFeature?.properties && (
				<p
					className='cursor-pointer text-primary hover:text-accent'
					onClick={locateParkingHandler}
				>
					<strong>{t('closest-parking')}:</strong>{' '}
					{closestParkingFeature.properties.title}
				</p>
			)}
		</>
	);
}

export default PoiDetailsParking;
