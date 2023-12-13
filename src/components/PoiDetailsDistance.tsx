import useMapStore from '@/store/mapStore';
import { t } from 'i18next';
import { useEffect, useState } from 'react';
import * as humanizeDuration from 'humanize-duration';

function PoiDetailsDistance() {
	const haveRouteDetails = useMapStore((state) => state.haveRouteDetails);
	const routeDetails = useMapStore((state) => state.routeDetails);
	const currentLanguage = useMapStore((state) => state.currentLang);
	const [distanceInMeters, setDistanceInMeters] = useState(0);
	const [distanceInMinutes, setDistanceInMinutes] = useState('');

	useEffect(() => {
		setDistanceInMeters(Math.round(routeDetails?.details?.distance));
		setDistanceInMinutes(
			humanizeDuration(routeDetails?.details?.duration.realistic * 1000, {
				delimiter: ` ${t('and')} `,
				round: true,
				language: currentLanguage,
			})
		);
	}, [
		routeDetails?.details?.distance,
		currentLanguage,
		routeDetails?.details?.duration.realistic,
	]);

	return (
		<>
			{haveRouteDetails && (
				<p className='hidden mb-4 text-sm lg:block'>
					<strong>{t('distance')}:</strong> {distanceInMeters}m /{' '}
					{distanceInMinutes}
				</p>
			)}
		</>
	);
}

export default PoiDetailsDistance;
