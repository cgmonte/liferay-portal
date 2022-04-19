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

import React from 'react';

import { ElementsSidebarPanel } from './ElementsSidebarPanel';

// import './Sidebar.scss';

export default function Sidebar({
	elementsList = [], inputChannel,
}: IElementsSidebarPanel) {
	return (
		<div className="ddm_template_editor__App-sidebar">
			<div
				className="ddm_template_editor__App-sidebar-content"
			>
				<ElementsSidebarPanel
					className="ddm_template_editor__App-sidebar-title my-3"
					elementsList={elementsList}
					inputChannel={inputChannel}
				/>
			</div>
		</div>
	);
}

interface IElementsSidebarPanel {
	className?: string;
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