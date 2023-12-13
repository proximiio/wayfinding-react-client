import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import useMapStore from '@/store/mapStore';
import { t } from 'i18next';
import { PiPersonSimpleWalk, PiElevator } from 'react-icons/pi';

function PoiDetailsRouteToggle() {
	const accessibleRoute = useMapStore((state) => state.accessibleRoute);
	const haveRouteDetails = useMapStore((state) => state.haveRouteDetails);
	const setAccessibleRoute = useMapStore((state) => state.setAccessibleRoute);

	const onValueChangeHandler = (value: string) => {
		setAccessibleRoute(value === 'accessible');
	};

	return (
		<>
			{haveRouteDetails && (
				<ToggleGroup
					type='single'
					value={accessibleRoute ? 'accessible' : 'fastest'}
					onValueChange={onValueChangeHandler}
					className='mb-4'
				>
					<ToggleGroupItem
						value='fastest'
						aria-label='Toggle fastest'
						className='flex flex-col flex-1 h-auto gap-1 p-3 font-light whitespace-normal'
					>
						<PiPersonSimpleWalk className='block text-4xl' />
						<p>{t('fast-route')}</p>
					</ToggleGroupItem>
					<ToggleGroupItem
						value='accessible'
						aria-label='Toggle accessible'
						className='flex flex-col flex-1 h-auto gap-1 p-3 font-light whitespace-normal'
					>
						<PiElevator className='block text-4xl' />
						<p>{t('use-elevators')}</p>
					</ToggleGroupItem>
				</ToggleGroup>
			)}
		</>
	);
}

export default PoiDetailsRouteToggle;
