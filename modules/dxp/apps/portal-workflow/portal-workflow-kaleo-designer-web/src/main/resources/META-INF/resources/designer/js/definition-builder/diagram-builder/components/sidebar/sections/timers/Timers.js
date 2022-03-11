/**
 * Copyright (c) 2000-present Liferay, Inc. All rights reserved.
 *
 * The contents of this file are subject to the terms of the Liferay Enterprise
 * Subscription License ("License"). You may not use this file except in
 * compliance with the License. You can obtain a copy of the License by
 * contacting Liferay, Inc. See the License for the specific language governing
 * permissions and limitations under the License, including but not limited to
 * distribution rights of the Software.
 */

import React, {useContext, useEffect, useState} from 'react';

import {DiagramBuilderContext} from '../../../../DiagramBuilderContext';
import Timer from './Timer';

const Timers = (props) => {
	const {selectedItem} = useContext(DiagramBuilderContext);
	const [sections, setSections] = useState([{identifier: `${Date.now()}-0`}]);

	useEffect(() => {
		setSections(
			selectedItem.data.taskTimers?.delay?.map((_, index) => ({
				identifier: `${Date.now()}-${index}`,
			})) || {identifier: `${Date.now()}-0`}
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return sections.map(({identifier}, index) => (
		<Timer
			{...props}
			identifier={identifier}
			key={`section-${identifier}`}
			sectionsLength={sections?.length}
			setSections={setSections}
			timersIndex={index}
		/>
	));
};

export default Timers;
