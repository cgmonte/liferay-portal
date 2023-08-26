/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import classNames from 'classnames';
import React, {Dispatch, SetStateAction, useEffect} from 'react';
import {DropTargetMonitor, useDrop} from 'react-dnd';

interface PropertiesEmpryDropAreaProps {
	setTreeViewItems: Dispatch<SetStateAction<TreeViewItem[]>>;
	treeViewItems: TreeViewItem[];
}

export default function PropertiesEmpryDropArea({
	setTreeViewItems,
	treeViewItems,
}: PropertiesEmpryDropAreaProps) {
	const [{isOver}, drop] = useDrop({
		accept: 'treeViewItem',
		collect: (monitor: DropTargetMonitor) => ({
			isOver: monitor.isOver(),
		}),
		drop: (item: any) => {
			console.log('item', [item]);
			setTreeViewItems([item]);
		},
	});

	useEffect(() => {
		console.log('treeViewItems', treeViewItems);
	}, [treeViewItems]);

	useEffect(() => {
		console.log('isOver', isOver);
	}, [isOver]);

	return (
		<div
			className={classNames({
				'first-property-drop-area': !isOver,
				'first-property-drop-area-active': isOver,
			})}
			ref={drop}
		>
			<p>
				{Liferay.Language.get('drop-properties-from-the-sidebar-here.')}
			</p>
		</div>
	);
}
