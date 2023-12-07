import { motion } from 'framer-motion';

function RouteForm() {
	return (
		<>
			<motion.div
				key='list'
				initial={{ opacity: 0, scale: 0 }}
				animate={{ opacity: 1, scale: 1 }}
				exit={{ opacity: 0, scale: 0 }}
				transition={{ duration: 0.2 }}
				className='absolute z-10 p-3 pt-12 border-2 rounded-lg bg-white/80 top-20 left-5 sm:p-5 sm:pt-16'
			>
				<p>RouteForm</p>
			</motion.div>
		</>
	);
}

export default RouteForm;
