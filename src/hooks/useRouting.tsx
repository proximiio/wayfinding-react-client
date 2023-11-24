import useMapStore from '@/store/mapStore';

export default function useRouting() {
	const map = useMapStore((state) => state.map);
	const accessibleRoute = useMapStore((state) => state.accessibleRoute);

	const defaultWayfindingConfig = {
		avoidElevators: true,
		avoidEscalators: false,
		avoidStaircases: false,
		avoidRamps: false,
		avoidNarrowPaths: false,
		avoidRevolvingDoors: false,
		avoidTicketGates: false,
		avoidBarriers: false,
		avoidHills: false,
	};

	const findRoute = ({
		start,
		finish,
		type,
	}: {
		start?: string;
		finish: string;
		type?: string;
	}) => {
		const wayfindingConfig = {
			...defaultWayfindingConfig,
			avoidElevators: accessibleRoute ? false : true,
			avoidRamps: accessibleRoute ? false : true,
			avoidEscalators: accessibleRoute ? true : false,
			avoidStaircases: accessibleRoute ? true : false,
			avoidBarriers: accessibleRoute ? true : false,
			avoidNarrowPaths: accessibleRoute ? true : false,
			avoidRevolvingDoors: accessibleRoute ? true : false,
			avoidTicketGates: accessibleRoute ? true : false,
		};
		if (type === 'amenity') {
			map.findRouteToNearestFeature(
				finish,
				start,
				accessibleRoute,
				wayfindingConfig
			);
			return;
		}
		map.findRouteByIds(finish, start, accessibleRoute, wayfindingConfig);
	};

	return [findRoute];
}
