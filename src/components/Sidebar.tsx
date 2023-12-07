import { useRef, useState } from 'react';
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

function Sidebar() {
	const [isOpen, setOpen] = useState(false);
	const [color, setColor] = useState('#000');
	const ref = useRef(null);

	const activeFilter = useMapStore((state) => state.activeFilter);
	const routeFinish = useMapStore((state) => state.routeFinish);

	const setActiveFilter = useMapStore((state) => state.setActiveFilter);
	const setRouteFinish = useMapStore((state) => state.setRouteFinish);
	const setRouteStart = useMapStore((state) => state.setRouteStart);

	useClickAway(ref, () => {
		if (isOpen && !routeFinish?.id) {
			onCloseHandler();
		}
	});

	const onCloseHandler = () => {
		setOpen(false);
		setColor('#000');
		setActiveFilter({} as FilterItemModel);
		setRouteFinish({} as Feature);
		setRouteStart({} as Feature);
	};

	return (
		<div ref={ref}>
			<FilterMenu
				isOpen={isOpen}
				setOpen={setOpen}
				color={color}
				setColor={setColor}
				onClose={onCloseHandler}
			/>
			<AnimatePresence>
				{isOpen &&
					Object.keys(activeFilter).length === 0 &&
					Object.keys(routeFinish).length === 0 && <Filters key='1' />}
				{isOpen && activeFilter?.type === 'list' && <PoiList key='2' />}
				{isOpen && activeFilter?.type === 'closest' && <RouteForm key='3' />}
				{isOpen && routeFinish?.id && <PoiDetails key='4' />}
			</AnimatePresence>
		</div>
	);
}

export default Sidebar;
