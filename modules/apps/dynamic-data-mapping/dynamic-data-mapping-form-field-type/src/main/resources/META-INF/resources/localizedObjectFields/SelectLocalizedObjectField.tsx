/**
 * SPDX-FileCopyrightText: (c) 2025 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {ClayInput} from '@clayui/form';
import React, {useState} from 'react';

import SingleSelectBase from '../Select/SingleSelectBase';
import {useNormalizedOptionsMemo} from '../Select/hooks';
import {SelectMainProps} from '../Select/select.d';
import {LocalizedValue} from '../types';
import LocalesDropdown, {
	AvailableLocale,
	EditingLocale,
} from '../util/localizable/LocalesDropdown';
import {getEditingLocales, getLocale} from './util/locales';

import './SelectLocalizedObjectField.scss';

import type {Locale} from '../types';

type valueTypes = {} | LocalizedValue<string>;

export interface SelectLocalizedObjectFieldProps
	extends Omit<SelectMainProps, 'value'> {
	availableLocales: AvailableLocale[];
	defaultLocale: AvailableLocale;
	value: string;
}

// function parseValue(value: string): valueTypes | undefined {
// 	try {
// 		const parsedValue = JSON.parse(value);

// 		return parsedValue;
// 	}
// 	catch (error) {
// 		console.error(error);
// 	}
// }

function getDefaultValue(
	locale: Locale,
	value: valueTypes
): LocalizedValue<string> {
	return !Object.keys(value).length ? {[locale]: ''} : value;
}

export default function SelectLocalizedObjectField({
	availableLocales,
	defaultLanguageId,
	defaultLocale,
	fieldName,
	fixedOptions = [],
	id,
	label,
	name,
	onChange,
	options,
	placeholder = Liferay.Language.get('choose-an-option'),
	predefinedValue,
	readOnly,
	showEmptyOption = true,
	value,
	...otherProps
}: SelectLocalizedObjectFieldProps) {
	// const value = parseValue(stringfiedValue) as valueTypes;

	const [editingLocales, setEditingLocales] = useState<EditingLocale[]>(
		getEditingLocales(
			availableLocales,
			defaultLocale,
			getDefaultValue(defaultLanguageId, value)
		)
	);

	const [currentEditingLocale, setCurrentEditingLocale] =
		useState<EditingLocale>({
			...getLocale(editingLocales, defaultLocale, defaultLanguageId),
		});

	const [localizedValues, setLocalizedValues] = useState<
		LocalizedValue<string>
	>(getDefaultValue(currentEditingLocale.localeId, value));

	const normalizedOptions = useNormalizedOptionsMemo({
		editingLanguageId: currentEditingLocale.localeId,
		fixedOptions,
		multiple: false,
		options,
		showEmptyOption,
		valueArray: [localizedValues[currentEditingLocale.localeId]!],
	});

	const updateLocalizedValues = (localeId: Locale, newValue: React.Key) => {
		// const newLocalizedValues = {
		// 	...localizedValues,
		// 	[localeId]: newValue,
		// };

		setLocalizedValues((previous)=>({
			...previous,
			[localeId]: newValue,
		}));

		onChange({}, {
			...localizedValues,
			[localeId]: [newValue],
		});
	};

	const handleChange = (value: React.Key) => {
		updateLocalizedValues(currentEditingLocale.localeId, value);
	};

	const handleTranslationChange = (localeId: Liferay.Language.Locale) => {
		if (!Object.hasOwn(localizedValues, localeId)) {
			updateLocalizedValues(
				localeId,
				localizedValues[defaultLanguageId]?.[0] ?? ''
			);
		}

		const currentLocale = getLocale(
			editingLocales,
			defaultLocale,
			localeId
		);

		const updatedLocale = {...currentLocale, isTranslated: true};

		setEditingLocales((previous) =>
			previous.map((locale) =>
				locale.localeId === localeId ? updatedLocale : locale
			)
		);

		setCurrentEditingLocale(updatedLocale);
	};

	return (
		<ClayInput.Group>
			<SingleSelectBase
				{...otherProps}
				className="ddm-object-field-single-select-localized"
				defaultLanguageId={defaultLanguageId}
				fieldName={fieldName}
				id={id}
				label={label}
				name={name}
				onSelectionChange={handleChange}
				options={normalizedOptions}
				placeholder={placeholder}
				// predefinedValue={[]}
				readOnly={readOnly}
				selectedKey={localizedValues[currentEditingLocale.localeId]}
				showEmptyOption={showEmptyOption}
			/>

			<ClayInput.GroupItem shrink>
				<LocalesDropdown
					availableLocales={editingLocales}
					editingLocale={currentEditingLocale}
					fieldName={fieldName}
					onLanguageClicked={handleTranslationChange}
				/>
			</ClayInput.GroupItem>
		</ClayInput.Group>
	);
}
