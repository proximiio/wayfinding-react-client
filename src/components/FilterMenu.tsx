import { useRef, useState } from 'react';
import { useClickAway } from 'react-use';
import { Twirl as Hamburger } from 'hamburger-react';
import { cn } from '@/lib/utils';
import FilterPicker from './FilterPicker';
import { t } from 'i18next';
import { AnimatePresence, motion } from 'framer-motion';
import useMapStore from '@/store/mapStore';

interface FilterMenuProps {
	className?: string | undefined;
}

function FilterMenu({ className }: FilterMenuProps) {
	const [isOpen, setOpen] = useState(false);
	const [color, setColor] = useState('#000');
	const ref = useRef(null);

	const filterItems = useMapStore((state) => state.filterItems);
	const filterItems2 = useMapStore((state) => state.filterItems2);

	useClickAway(ref, () => {
		setOpen(false);
		setColor('#000');
	});

	return (
		<div ref={ref}>
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
					toggle={setOpen}
					color={color}
					onToggle={(toggled) => {
						if (toggled) {
							setColor('#e11d48');
						} else {
							setColor('#000');
						}
					}}
				/>
			</div>
			<AnimatePresence>
				{isOpen && (
					<motion.div
						initial={{ opacity: 0, scale: 0 }}
						animate={{ opacity: 1, scale: 1 }}
						exit={{ opacity: 0, scale: 0 }}
						transition={{ duration: 0.2 }}
						className='absolute z-10 p-3 pt-12 border-2 rounded-lg bg-white/80 top-20 left-5 sm:p-5 sm:pt-16'
					>
						<FilterPicker
							heading={t('shops')}
							items={filterItems}
							color='primary'
						/>
						<FilterPicker
							heading={t('showTheClosest')}
							items={filterItems2}
							color='secondary'
						/>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}

export default FilterMenu;
