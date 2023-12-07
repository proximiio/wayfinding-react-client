import { FilterItemModel } from '@/models/filterItem.model';
import { t } from 'i18next';
import React from 'react';
import { Button } from './ui/button';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface FilterPickerProps {
	heading: string;
	color: 'primary' | 'secondary';
	items: FilterItemModel[];
}

function FilterPicker({ heading, color, items }: FilterPickerProps) {
	return (
		<>
			<AnimatePresence>
				<motion.h1
					initial={{ scale: 2, opacity: 0, filter: 'blur(100px)' }}
					animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
					transition={{ duration: 0.2 }}
					className={cn(
						`text-md font-semibold mb-1 sm:text-xl sm:mb-2`,
						color === 'primary' && 'text-primary',
						color === 'secondary' && 'text-secondary'
					)}
					key='heading'
				>
					{heading}
				</motion.h1>
				<ul className='grid grid-cols-5 gap-2 mb-2 sm:mb-6'>
					{items.map((item, idx) => (
						<motion.li
							initial={{ scale: 0, opacity: 0 }}
							animate={{ scale: 1, opacity: 1 }}
							transition={{
								type: 'spring',
								stiffness: 260,
								damping: 20,
								delay: 0.1 + idx / 10,
							}}
							key={idx}
							className='w-12 text-center sm:w-16'
						>
							<Button
								size='icon'
								variant={color === 'primary' ? 'default' : 'secondary'}
								className='w-12 h-12 text-lg sm:w-16 sm:h-16 sm:text-2xl'
							>
								{item.icon && React.createElement(item.icon)}
								{item.iconImage && (
									<img src={item.iconImage} alt={t(item.title)} />
								)}
							</Button>
							<p className='mt-1 overflow-hidden text-xs text-ellipsis whitespace-nowrap sm:overflow-auto sm:whitespace-normal'>{t(item.title)}</p>
						</motion.li>
					))}
				</ul>
			</AnimatePresence>
		</>
	);
}

export default FilterPicker;
