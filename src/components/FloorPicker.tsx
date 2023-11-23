import { FloorModel } from 'proximiio-js-library/lib/models/floor';
import { Button } from '@/components/ui/button';
import useMapStore from '@/store/mapStore';

function FloorPicker() {
	//store state
	const floors = useMapStore((state) => state.floors);
	const currentFloor = useMapStore((state) => state.currentFloor);
	const currentLang = useMapStore((state) => state.currentLang);

	//store actions
	const setCurrentFloor = useMapStore((state) => state.setCurrentFloor);

	const getFloorName = ({ floor }: { floor: FloorModel }) => {
		if (floor.name.length === 1 && Number(parseInt(floor.name))) {
			return `L${floor.name}`;
		}
		if (floor.metadata && (floor.metadata['title_' + currentLang] as string)) {
			return floor.metadata['title_' + currentLang] as string;
		}
		return floor.name;
	};

	const handleFloorClick = (floor: FloorModel) => {
		setCurrentFloor(floor);
	};

	const floorsList = floors.map((floor) => {
		return (
			<Button
				key={floor.id}
				variant={currentFloor?.id === floor.id ? 'default' : 'secondary'}
				onClick={() => handleFloorClick(floor)}
			>
				{getFloorName({ floor })}
			</Button>
		);
	});

	return (
		<div className='absolute inset-x-0 z-10 flex items-center justify-center gap-1 top-5'>
			{floorsList}
		</div>
	);
}
export default FloorPicker;
