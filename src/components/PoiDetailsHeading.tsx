import useMapStore from '@/store/mapStore';
import { t } from 'i18next';

function PoiDetailsHeading() {
	const currentLanguage = useMapStore((state) => state.currentLang);
	const poi = useMapStore((state) => state.routeFinish);

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

	return (
		<>
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
		</>
	);
}

export default PoiDetailsHeading;
