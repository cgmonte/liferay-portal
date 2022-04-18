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

/// <reference types="react" />

import PropTypes from 'prop-types';
export declare function CollapsableButtonList({
	items,
	label,
	onButtonClick,
}: IElement): JSX.Element;
export declare namespace CollapsableButtonList {
	var propTypes: {
		items: PropTypes.Requireable<(object | null)[]>;
		label: PropTypes.Validator<string>;
		onButtonClick: PropTypes.Validator<(...args: any[]) => any>;
	};
}
interface IElement {
	items: IItem[];
	label: string;
	onButtonClick: onButtonClickType;
}
interface IItem {
	content: string;
	label: string;
	repeatable: boolean;
	tooltip: string;
}
declare type onButtonClickType = (item: IItem) => void;
export {};
