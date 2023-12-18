import { useEffect, useRef, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useClickAway } from 'react-use';
import FilterMenu from './FilterMenu';
import PoiList from './PoiList';
import Filters from './Filters';
import { FilterItemModel } from '@/models/filterItem.model';
import useMapStore from '@/store/mapStore';
import RouteForm from './RouteForm';
import PoiDetails from './PoiDetails';
import Feature from 'proximiio-js-library/lib/models/feature';
import { cn } from '@/lib/utils';

function Sidebar() {
	const [isOpen, setOpen] = useState(false);
	const [color, setColor] = useState('#000');
	const ref = useRef(null);

	const activeFilter = useMapStore((state) => state.activeFilter);
	const routeFinish = useMapStore((state) => state.routeFinish);
	const kioskMode = useMapStore((state) => state.kioskMode);
	const showCustomRoutePicker = useMapStore(
		(state) => state.showCustomRoutePicker
	);

	const setActiveFilter = useMapStore((state) => state.setActiveFilter);
	const setRouteFinish = useMapStore((state) => state.setRouteFinish);
	const setRouteStart = useMapStore((state) => state.setRouteStart);
	const setShowCustomRoutePicker = useMapStore(
		(state) => state.setShowCustomRoutePicker
	);
	const setHaveRouteDetails = useMapStore((state) => state.setHaveRouteDetails);

	useClickAway(ref, () => {
		if (isOpen && routeFinish?.id) {
			return;
		}
		if (isOpen && activeFilter?.id) {
			return;
		}
		if (!isOpen) {
			return
		}
		onCloseHandler();
	});

	// open sidebar if route finish is set by search/polygon click/url params
	useEffect(() => {
		if (routeFinish?.id) {
			setOpen(true);
			setColor('#e11d48');
		}
	}, [routeFinish]);

	const onCloseHandler = () => {
		console.log('close handler');
		setOpen(false);
		setColor('#000');
		setActiveFilter({} as FilterItemModel);
		setRouteFinish({} as Feature);
		setRouteStart({} as Feature);
		setShowCustomRoutePicker(false);
		setHaveRouteDetails(false);
	};

	return (
		<div ref={ref}>
			<FilterMenu
				isOpen={isOpen}
				setOpen={setOpen}
				color={color}
				setColor={setColor}
				onClose={onCloseHandler}
				className={cn(
					routeFinish?.id && 'bg-white shadow-md lg:shadow-none lg:m-3 lg:p-1',
					(activeFilter?.type === 'list' || activeFilter?.type === 'closest' || showCustomRoutePicker) &&
						'bg-white shadow-md lg:shadow-none lg:bg-transparent'
				)}
			/>
			<AnimatePresence>
				{isOpen &&
					Object.keys(activeFilter).length === 0 &&
					Object.keys(routeFinish).length === 0 && <Filters key='1' />}
				{isOpen && activeFilter?.type === 'list' && <PoiList key='2' />}
				{isOpen &&
					((activeFilter?.type === 'closest' && !kioskMode) || showCustomRoutePicker) && (
						<RouteForm key='3' />
					)}
				{isOpen && routeFinish?.id && !showCustomRoutePicker && (
					<PoiDetails key='4' />
				)}
			</AnimatePresence>
		</div>
	);
}

export default Sidebar;
