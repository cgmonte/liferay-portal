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

import ClayForm from '@clayui/form';
import {InputLocalized, Toggle} from '@liferay/object-js-components-web';
import React from 'react';

import {defaultLanguageId} from '../../utils/constants';
import {
	removeFieldSettings,
	updateFieldSettings,
} from '../../utils/fieldSettings';

import './ObjectFieldFormBase.scss';

interface UniqueValuesProps {
	disabled?: boolean;
	error?: string;
	objectField: Partial<ObjectField>;
	setValues: (values: Partial<ObjectField>) => void;
}

const defaultUniqueValuesSettings: ObjectFieldSetting[] = [
	{
		name: 'uniqueValues',
		value: true,
	},
	{
		name: 'uniqueValuesErrorMessage',
		value: {
			[defaultLanguageId]: Liferay.Language.get(
				'this-value-is-already-in-use-please-choose-an-unique-one'
			),
		},
	},
];

export function UniqueValues({
	disabled,
	error,
	objectField: values,
	setValues,
}: UniqueValuesProps) {
	const uniqueValuesErrorMessageSetting = values.objectFieldSettings?.find(
		(setting) => setting.name === 'uniqueValuesErrorMessage'
	);

	const isUniqueValue = values.objectFieldSettings?.some(
		(setting) => setting.name === 'uniqueValues'
	);

	const handleUniqueValuesToggle = (toggled: boolean) => {
		if (toggled) {
			if (!values.id) {
				setValues({
					objectFieldSettings: values.objectFieldSettings!.concat(
						defaultUniqueValuesSettings
					),
				});
			}
			else {
				if (uniqueValuesErrorMessageSetting) {
					setValues({
						objectFieldSettings: updateFieldSettings(
							values.objectFieldSettings,
							defaultUniqueValuesSettings[0]
						),
					});
				}
				else {
					setValues({
						objectFieldSettings: values.objectFieldSettings!.concat(
							defaultUniqueValuesSettings
						),
					});
				}
			}
		}
		else {
			if (!values.id) {
				setValues({
					objectFieldSettings: removeFieldSettings(
						['uniqueValues', 'uniqueValuesErrorMessage'],
						values
					),
				});
			}
			else {
				setValues({
					objectFieldSettings: removeFieldSettings(
						['uniqueValues'],
						values
					),
				});
			}
		}
	};

	const handleUniqueValuesErrorMessageChange = (
		translations: LocalizedValue<string>
	) => {
		setValues({
			objectFieldSettings: updateFieldSettings(
				values.objectFieldSettings,
				{name: 'uniqueValuesErrorMessage', value: translations}
			),
		});
	};

	return (
		<>
			<ClayForm.Group>
				<Toggle
					disabled={disabled}
					label={Liferay.Language.get('accept-unique-values-only')}
					name="enableUniqueValues"
					onToggle={handleUniqueValuesToggle}
					toggled={isUniqueValue}
					tooltip={Liferay.Language.get(
						'users-will-only-be-able-to-add-unique-values-for-that-field'
					)}
				/>

				{values.id && isUniqueValue && (
					<InputLocalized
						className="mt-3"
						error={error}
						label={Liferay.Language.get(
							'unique-value-error-message'
						)}
						onChange={handleUniqueValuesErrorMessageChange}
						required
						translations={
							uniqueValuesErrorMessageSetting!
								.value as LocalizedValue<string>
						}
					/>
				)}
			</ClayForm.Group>
		</>
	);
}
