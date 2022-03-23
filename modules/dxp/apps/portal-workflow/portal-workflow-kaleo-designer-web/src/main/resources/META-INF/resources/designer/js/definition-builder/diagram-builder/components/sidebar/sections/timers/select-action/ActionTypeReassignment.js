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

import React, {useEffect, useState} from 'react';

import {getAssignmentType} from '../../assignments/utils';
import AssetCreator from '../select-reassignment/AssetCreator';
import ResourceActions from '../select-reassignment/ResourceActions';
import Role from '../select-reassignment/Role';
import RoleType from '../select-reassignment/RoleType';
import ScriptedReassignment from '../select-reassignment/ScriptedReassignment';
import {SelectReassignment} from '../select-reassignment/SelectReassignment';
import User from '../select-reassignment/User';

const assignmentSectionComponents = {
	assetCreator: AssetCreator,
	resourceActions: ResourceActions,
	roleId: Role,
	roleType: RoleType,
	scriptedReassignment: ScriptedReassignment,
	user: User,
};

const ActionTypeReassignment = ({
	actionData,
	actionSectionsIndex,
	identifier,
	sectionsLength,
	setActionSections,
}) => {
	const assignmentType = getAssignmentType({
		assignmentType: actionData.assignmentType
			? [actionData.assignmentType]
			: ['user'],
	});
	const [reassignmentType, setReassignmentType] = useState(assignmentType);
	const [subSections, setSubSections] = useState([
		{identifier: `${Date.now()}-0`},
	]);

	useEffect(() => {
		console.log('foo', assignmentType)
		if (assignmentType === 'user') {
			setActionSections((currentSections) => {
				const updatedSections = [...currentSections];

				updatedSections[actionSectionsIndex].assignmentType = 'user';
				updatedSections[actionSectionsIndex].users = subSections;

				return updatedSections;
			});
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [subSections]);

	const ReassignmentSectionComponent =
		assignmentSectionComponents[reassignmentType];

	return (
		<>
			<SelectReassignment
				currentAssignmentType={assignmentType}
				setSection={setReassignmentType}
			/>

			{subSections.map(({identifier: subSectionIdentifier}, index) => {
				return (
					ReassignmentSectionComponent && (
						<ReassignmentSectionComponent
							actionData={actionData}
							actionSectionsIndex={actionSectionsIndex}
							currentAssignmentType={assignmentType}
							identifier={identifier}
							index={index}
							key={`section-${identifier}`}
							sectionsLength={sectionsLength}
							setActionSections={setActionSections}
							setSections={setSubSections}
							subSectionIdentifier={subSectionIdentifier}
							subSectionsLength={subSections.length}
						/>
					)
				);
			})}
		</>
	);
};

export default ActionTypeReassignment;
