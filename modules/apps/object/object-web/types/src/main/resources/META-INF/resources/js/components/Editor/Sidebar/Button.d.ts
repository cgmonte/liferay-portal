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

import PropTypes from 'prop-types';
import {MouseEventHandler} from 'react';
export declare function Button({label, onClick, tooltip}: IItem): JSX.Element;
export declare namespace Button {
	var propTypes: {
		label: PropTypes.Validator<string>;
		onClick: PropTypes.Requireable<(...args: any[]) => any>;
		tooltip: PropTypes.Validator<string>;
	};
}
interface IItem {
	content?: string;
	label: string;
	onClick: MouseEventHandler;
	repeatable?: boolean;
	tooltip: string;
}
export {};
