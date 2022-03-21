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

import React from 'react';

import SidebarPanel from '../../../SidebarPanel';
import BaseUser from '../../shared-components/BaseUser';

const User = (props) => {

	// console.log('props:', props);

	const updateSelectedItem = (values) => {

		// console.log('values:', values);
		// props.setSections((previousSections) => {
		// 	console.log('previousSections:', previousSections);
		// 	return previousSections;
		// 	// return {
		// 	// 	sectionsData: values.map((values) => ({
		// 	// 		...values,
		// 	// 		assignmentType: 'user',
		// 	// 	})),
		// 	// };
		// });

	};

	return (
		<SidebarPanel panelTitle={Liferay.Language.get('section')}>
			<BaseUser
				{...props}
				reassignment
				updateSelectedItem={updateSelectedItem}
			/>
		</SidebarPanel>
	);
};

export default User;
