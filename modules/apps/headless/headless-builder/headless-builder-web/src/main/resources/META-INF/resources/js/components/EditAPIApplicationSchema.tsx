/**
 * Copyright (c) 2000-present Liferay, Inc. All rights reserved.
 *
 * This library is free software; you can redistribute it and/or modify it under
 * the terms of the GNU Lesser General Public License as published by the Free
 * Software Foundation; either version 2.1 of the License, or (at your option)
 * any later version.
 r*
 * This library is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU Lesser General Public License for more
 * details.
 */

import React from 'react';

import {getCurrentURLParamValue} from './utils/urlUtil';

import ThreeViewSpike from './ThreeViewSpike'

import '../../css/main.scss';

interface EditAPIApplicationSchemaProps {
	apiURLPaths: APIURLPaths;
	portletId: string;
	schemaId: number;
}

export default function EditAPIApplicationSchema({
	portletId,
	schemaId,
}: EditAPIApplicationSchemaProps) {
	const currentAPIApplicationID = getCurrentURLParamValue({
		paramSufix: 'apiApplicationId',
		portletId,
	});

	return (
		<>
			<h3>{`API App ID ${currentAPIApplicationID}`}</h3>
			<h3>{`API App Schema ID ${schemaId}`}</h3>
			<ThreeViewSpike/>
		</>
	);
}
