import useMapStore from '@/store/mapStore';
import { t } from 'i18next';
import { useEffect, useState } from 'react';
import { TfiAngleDown, TfiAngleUp } from 'react-icons/tfi';

const defaultDetails =
	'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';

function PoiDetailsDescription() {
	const [details, setDetails] = useState(defaultDetails);
	const [showMore, setShowMore] = useState(false);
	const [limit, setLimit] = useState(200);
	const poi = useMapStore((state) => state.routeFinish);

	const currentLanguage = useMapStore((state) => state.currentLang);

	useEffect(() => {
		if (poi?.properties?.description_i18n) {
			setDetails(
				poi.properties.description_i18n[currentLanguage]
					? poi.properties.description_i18n[currentLanguage]
					: poi.properties.description_i18n.en
			);
		}
	}, [poi?.properties?.description_i18n, currentLanguage]);

	return (
		<>
			{details && (
				<div className='mb-4'>
					<p className='text-sm'>
						{details.slice(0, limit)} {details.length > limit ? '...' : ''}
					</p>
					{details.length > limit && (
						<span
							onClick={() => {
								setLimit(details.length);
								setShowMore(true);
							}}
							className='text-sm font-semibold cursor-pointer hover:text-primary'
						>
							{t('showMore')}
							<TfiAngleDown className='inline-flex ml-1 text-xs' />
						</span>
					)}
					{showMore && (
						<span
							onClick={() => {
								setLimit(200);
								setShowMore(false);
							}}
							className='text-sm font-semibold cursor-pointer hover:text-primary'
						>
							{t('showLess')}
							<TfiAngleUp className='inline-flex ml-1 text-xs' />
						</span>
					)}
				</div>
			)}
		</>
	);
}

export default PoiDetailsDescription;
