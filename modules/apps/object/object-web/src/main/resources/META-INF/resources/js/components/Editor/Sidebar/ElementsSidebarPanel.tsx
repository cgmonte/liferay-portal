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

import classNames from 'classnames';
import React from 'react';

// import { AppContext } from './AppContext';

import { CollapsableButtonList } from './CollapsableButtonList';

export function ElementsSidebarPanel({ className, elementsList, inputChannel }: IElementsSidebarPanel) {
	// const {
	// 	inputChannel,
	// 	templateVariableGroups: initialTemplateVariableGroups,
	// } = useContext(AppContext);

	elementsList = elementsList.map((group) => ({
		...group,
		items: group.items.map((item) =>
			item.repeatable ? { ...item, label: `${item.label}*` } : item
		),
	}));

	const onButtonClick = (item: IItem) => inputChannel.sendData(item.content);

	return (
		<div className={classNames(className, 'px-3')}>
			<h1 className="ddm_template_editor__App-sidebar-title my-3">
				{Liferay.Language.get('elements')}
			</h1>

			{
				elementsList.map(({ items, label }) => (
					<CollapsableButtonList
						items={items}
						key={label}
						label={label}
						onButtonClick={onButtonClick}
					/>
				))
			}
		</div>
	);
}

interface IElementsSidebarPanel {
	className: string;
	elementsList: IElement[];
	inputChannel: inputChannelObject;
}

interface IElement {
	items: IItem[];
	label: string;
}

interface IItem {
	content: string;
	label: string;
	repeatable: boolean;
	tooltip: string;
}

interface inputChannelObject {
	sendData: Function;
}