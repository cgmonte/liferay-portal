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

import PropTypes from 'prop-types';
import React, {useContext} from 'react';

import {DiagramBuilderContext} from '../../DiagramBuilderContext';
import {nodeDescription, nodeTypes} from '../nodes/utils';

const onDragStart = (event, nodeType,setMousePositionInsideNode) => {
	event.dataTransfer.setData('application/reactflow', nodeType);
	event.dataTransfer.effectAllowed = 'move';

	const nodeRect = event.target.getBoundingClientRect();
	const height = nodeRect.height;
	const mouseX = event.clientX - nodeRect.left;
	const mouseY = event.clientY - nodeRect.top;
	const width = nodeRect.width;

	setMousePositionInsideNode({height, mouseX, mouseY, width});

};

// const handleClick = (event, setMousePositionInsideNode) => {
// 	const nodeRect = event.target.getBoundingClientRect();
// 	const height = nodeRect.height;
// 	const mouseX = event.clientX - nodeRect.left;
// 	const mouseY = event.clientY - nodeRect.top;
// 	const width = nodeRect.width;

// 	setMousePositionInsideNode({height, mouseX, mouseY, width});
	
// 	// console.log('Left: ', mouseX);
// 	// console.log('Top: ', mouseY);
// }

export default function SidebarBody({children, displayDefaultContent = true, setMousePositionInsideNode}) {
	const {setAvailableArea} = useContext(DiagramBuilderContext);

	return (
		<div className="sidebar-body">
			{displayDefaultContent
				? Object.entries(nodeTypes).map(([key, Component], index) => (
						<Component
							descriptionSidebar={nodeDescription[key]}
							draggable
							key={index}
							// onDragStart={(event) => handleClick(event, setMousePositionInsideNode)}
							onDragEnd={() => setAvailableArea(null)}
							onDragStart={(event) => onDragStart(event, key, setMousePositionInsideNode)}

						/>
				  ))
				: children}
		</div>
	);
}

SidebarBody.protoTypes = {
	children: PropTypes.any,
	displayDefaultContent: PropTypes.bool,
};
