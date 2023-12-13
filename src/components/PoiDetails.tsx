/* eslint-disable no-mixed-spaces-and-tabs */
import { useState } from 'react';
import { motion } from 'framer-motion';
import Feature from 'proximiio-js-library/lib/models/feature';
import PoiDetailsImage from './PoiDetailsImage';
import PoiDetailsHeading from './PoiDetailsHeading';
import PoiDetailsDescription from './PoiDetailsDescription';
import PoiDetailsLink from './PoiDetailsLink';
import PoiDetailsParking from './PoiDetailsParking';
import PoiDetailsRoutes from './PoiDetailsRoutes';
import PoiDetailsDistance from './PoiDetailsDistance';
import PoiDetailsRouteToggle from './PoiDetailsRouteToggle';
import PoiDetailsSteps from './PoiDetailsSteps';

function PoiDetails() {
	const [closestParkingFeature, setClosestParkingFeature] = useState(
		{} as Feature
	);

	return (
		<>
			<motion.div
				key='details'
				initial={{ opacity: 0, scale: 0 }}
				animate={{ opacity: 1, scale: 1 }}
				exit={{ opacity: 0, scale: 0 }}
				transition={{ duration: 0.2 }}
				className='fixed inset-x-0 bottom-0 z-10 overflow-x-hidden overflow-y-auto bg-white rounded-lg shadow-xl lg:absolute lg:top-20 lg:left-5 lg:max-w-md lg:bottom-auto'
			>
				<PoiDetailsImage />
				<div className='px-6 py-5 bg-white rounded-tr-2xl relative lg:top-[-20px] lg:px-10'>
					<PoiDetailsHeading />
					<PoiDetailsDescription />
					<PoiDetailsLink />
					<PoiDetailsDistance />
					<PoiDetailsRouteToggle />
					<PoiDetailsSteps />
					<PoiDetailsParking
						closestParkingFeature={closestParkingFeature}
						onSet={setClosestParkingFeature}
					/>
					<PoiDetailsRoutes closestParkingFeature={closestParkingFeature} />
				</div>
			</motion.div>
		</>
	);
}
export default PoiDetails;
