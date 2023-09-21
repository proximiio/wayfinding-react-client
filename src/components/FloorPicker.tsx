import { FloorModel } from 'proximiio-js-library/lib/models/floor';

interface FloorPickerProps {
	floors: FloorModel[];
	currentLang: string;
	currentFloor: FloorModel;
	onSetCurrentFloor: React.Dispatch<React.SetStateAction<FloorModel>>;
}

function FloorPicker({
	floors,
	currentLang,
	currentFloor,
	onSetCurrentFloor,
}: FloorPickerProps) {
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
		currentFloor = floor;
		onSetCurrentFloor(floor);
	};

	const floorsList = floors.map((floor) => {
		return (
			<button
				key={floor.id}
				className={`rounded-md bg-white px-3.5 py-2.5 text-sm gap-1 font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 ${
					currentFloor?.id === floor.id &&
					'bg-gray-950 text-white hover:bg-gray-950'
				}`}
				onClick={() => handleFloorClick(floor)}
			>
				{getFloorName({ floor })}
			</button>
		);
	});

	return (
		<div className='absolute top-5 inset-x-0 flex items-center justify-center gap-1 z-10'>
			{floorsList}
		</div>
	);
}
export default FloorPicker;
