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

// import {
// 	API,
// 	Card,
// 	SidePanelForm,
// 	saveAndReload,
// } from '@liferay/object-js-components-web';

import ClayAlert from '@clayui/alert';
import ClayTabs from '@clayui/tabs';
import {
	API,
	Card,
	CustomItem,
	FormError,
	Input,
	InputLocalized,
	SidePanelForm,
	invalidateRequired,
	openToast,
	saveAndReload,
	useForm,
} from '@liferay/object-js-components-web';
import {fetch} from 'frontend-js-web';
import React, {useEffect, useState} from 'react';

import {HEADERS} from '../utils/constants';
import {ERRORS} from '../utils/errors';
import {useObjectFieldForm} from './ObjectFieldFormBase';
import StateDefinition from './StateManager/StateDefinition';

export default function EditListTypeDefinition({apiURL, listTypeDefinitionId}: IProps) {

	let initialValues;	

	useEffect(() => {

		API.getPickList(parseInt(listTypeDefinitionId, 10))
		.then(response => {
			initialValues = response.name_i18n
		});
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])
	




	// const onSubmit = async ({id, ...objectField}: ObjectField) => {
	// 	delete objectField.system;

	// 	const response = await fetch(
	// 		`/o/headless-admin-list-type/v1.0/list-type-definitions/${listTypeDefinitionId}`,
	// 		{
	// 			body: JSON.stringify({
	// 				name_i18n: localizedNames,
	// 			}),
	// 			headers: HEADERS,
	// 			method: 'PUT',
	// 		}
	// 	);

	// 	if (response.ok) {
	// 		saveAndReload();
	// 		openToast({
	// 			message: Liferay.Language.get(
	// 				'the-object-field-was-updated-successfully'
	// 			),
	// 		});
	// 	}
	// 	else {
	// 		const error: {type?: string} | undefined = await response.json();

	// 		const message =
	// 			(error?.type && ERRORS[error.type]) ??
	// 			Liferay.Language.get('an-error-occurred');

	// 		openToast({message, type: 'danger'});
	// 	}
	// };

	const {
		errors,
		// handleChange,
		// handleSubmit,
		setValues,
		values,
	} = useObjectFieldForm({
		initialValues,
		onSubmit,
	});

	return (
		<SidePanelForm title={Liferay.Language.get('picklist')}>
			<Card title={Liferay.Language.get('basic-info')}>
				<p>{listTypeDefinitionId}</p>
				
				<p>{apiURL}</p>
				
				<InputLocalized
					// disabled={
					// 	values.system && objectName !== 'AccountEntry'
					// 		? disabled
					// 		: readOnly
					// }
					error={errors.label}
					label={Liferay.Language.get('label')}
					onChange={(label) => setValues({label})}
					required
					translations={values.label as LocalizedValue<string>}
				/>
			</Card>
		</SidePanelForm>
	)
}

interface IProps {
	apiURL: string;
	listTypeDefinitionId: string;
}
