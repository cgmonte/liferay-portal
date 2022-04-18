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
export declare const AppContext: React.Context<{
	inputChannel: null;
	portletNamespace: null;
	propertiesViewURL: null;
	templateVariableGroups: never[];
}>;
export declare function AppContextProvider({
	children,
	portletNamespace,
	propertiesViewURL,
	templateVariableGroups,
}: {
	children: any;
	portletNamespace: any;
	propertiesViewURL: any;
	templateVariableGroups: any;
}): JSX.Element;
