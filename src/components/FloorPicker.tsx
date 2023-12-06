import { FloorModel } from 'proximiio-js-library/lib/models/floor';
import { Button } from '@/components/ui/button';
import useMapStore from '@/store/mapStore';

function FloorPicker() {
	//store state
	const map = useMapStore((state) => state.map);
	const floors = useMapStore((state) => state.floors);
	const currentFloor = useMapStore((state) => state.currentFloor);
	const currentLang = useMapStore((state) => state.currentLang);

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
		if (Object.keys(map).length > 0) {
			map.setFloorById(floor.id);
		}
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
		<div className='absolute z-10 flex items-center justify-center gap-1 left-[calc(50%-140px)] top-20 w-[280px] lg:top-5'>
			{floorsList}
		</div>
	);
}
export default FloorPicker;
