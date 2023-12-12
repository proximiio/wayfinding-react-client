import { Twirl as Hamburger } from 'hamburger-react';
import { cn } from '@/lib/utils';

interface FilterMenuProps {
	className?: string | undefined;
	isOpen: boolean;
	setOpen: (open: boolean) => void;
	color: string;
	setColor: (open: string) => void;
	onClose: () => void;
}

function FilterMenu({
	className,
	isOpen,
	setOpen,
	color,
	setColor,
	onClose,
}: FilterMenuProps) {
	return (
		<div
			className={cn(
				'absolute z-20 p-1 top-20 left-5 hover:border-primary/70',
				isOpen
					? 'p-2 hover:border-rose-500 sm:p-3'
					: 'border-2 rounded-full bg-white/80',
				className
			)}
		>
			<Hamburger
				toggled={isOpen}
				size={26}
				toggle={() => setOpen(!isOpen)}
				color={color}
				onToggle={(toggled) => {
					if (toggled) {
						setColor('#e11d48');
					} else {
						onClose();
					}
				}}
			/>
		</div>
	);
}

export default FilterMenu;