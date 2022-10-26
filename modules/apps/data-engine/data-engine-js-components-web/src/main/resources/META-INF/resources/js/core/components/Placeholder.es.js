/**
 * Copyright (c) 2000-present Liferay, Inc. All rights reserved.
 *
 * This library is free software; you can redistribute it and/or modify it under
 * the terms of the GNU Lesser General Public License as published by the Free
 * Software Foundation; either version 2.1 of the License, or (at your option)
 * any later version.
 *
 * This library is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU Lesser General Public License for more
 * details.
 */

import ClayLayout from '@clayui/layout';
import classnames from 'classnames';
import React, {useContext, useState} from 'react';

import {EVENT_TYPES} from '../actions/eventTypes.es';
import {DND_ORIGIN_TYPE, useDrop} from '../hooks/useDrop.es';
import {useForm} from '../hooks/useForm.es';
import {ParentFieldContext} from './Field/ParentFieldContext.es';

export function Placeholder({columnIndex, isRow, pageIndex, rowIndex, size}) {
	const parentField = useContext(ParentFieldContext);
	const {canDrop, drop, overTarget} = useDrop({
		columnIndex: columnIndex ?? 0,
		origin: DND_ORIGIN_TYPE.EMPTY,
		pageIndex,
		parentField,
		rowIndex,
	});
	const [insertPoint, setInsertPoint] = useState(false);
	const dispatch = useForm();

	const Content = (
		<ClayLayout.Col
			className="col col-ddm col-empty"
			data-ddm-field-column={columnIndex}
			data-ddm-field-page={pageIndex}
			data-ddm-field-row={rowIndex}
			md={size}
			onKeyDown={({key}) => {
				if (key === ' ' || key === 'Enter' || key === 'Spacebar') {
					// const newInsertPoint = {
					// 	columnIndex: target.getAttribute('data-ddm-field-column'),
					// 	pageIndex: target.getAttribute('data-ddm-field-page'),
					// 	rowIndex: target.getAttribute('data-ddm-field-row'),
					// };

					const newInsertPoint = {
						columnIndex,
						pageIndex,
						rowIndex,
					};

					setInsertPoint(newInsertPoint);
					dispatch({
						payload: newInsertPoint,
						type: EVENT_TYPES.TARGET.SET,
					});
				}
			}}
			tabIndex="0"
		>
			<div
				className={classnames('ddm-target', {
					'target-over targetOver':
						((overTarget && canDrop) || insertPoint) &&
						!parentField.root?.ddmStructureId,
				})}
				ref={!parentField.root?.ddmStructureId ? drop : undefined}
			/>
		</ClayLayout.Col>
	);

	if (isRow) {
		return <div className="placeholder row">{Content}</div>;
	}

	return Content;
}
