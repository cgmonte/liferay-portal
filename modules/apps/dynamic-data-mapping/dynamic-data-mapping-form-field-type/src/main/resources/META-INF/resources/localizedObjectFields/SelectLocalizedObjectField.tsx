/**
 * SPDX-FileCopyrightText: (c) 2025 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {ClayInput} from '@clayui/form';
import React, {useState} from 'react';

import SingleSelectBase from '../Select/SingleSelectBase';
import {useNormalizedOptionsMemo} from '../Select/hooks';
import {SelectMainProps} from '../Select/select.d';
import {toArray} from '../Select/selectOperations';
import {LocalizedValue} from '../types';
import LocalesDropdown, {
	AvailableLocale,
	EditingLocale,
} from '../util/localizable/LocalesDropdown';
import {getEditingLocales, getLocale} from './util/locales';

import type {Locale} from '../types';

type valueTypes = {} | LocalizedValue<string[]>;

export interface SelectLocalizedObjectFieldProps
	extends Omit<SelectMainProps, 'value'> {
	availableLocales: AvailableLocale[];
	defaultLocale: AvailableLocale;
	value: valueTypes;
}

function getDefaultValue(locale: Locale, value: valueTypes) {
	return !Object.keys(value).length ? {[locale]: []} : value;
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
	const predefinedValueArray = toArray(predefinedValue);

	const [editingLocales, setEditingLocales] = useState<EditingLocale[]>(
		getEditingLocales(
			availableLocales,
			defaultLocale,
			getDefaultValue(defaultLanguageId, value)
		)
	);

	const [currentEditingLocale, setCurrentEditingLocale] =
		useState<EditingLocale>({
			...getLocale(editingLocales, defaultLocale, defaultLocale.localeId),
		});

	const [localizedValues, setLocalizedValues] = useState<
		LocalizedValue<string[]>
	>(getDefaultValue(currentEditingLocale.localeId, value));

	const normalizedOptions = useNormalizedOptionsMemo({
		editingLanguageId: currentEditingLocale.localeId,
		fixedOptions,
		multiple: false,
		options,
		showEmptyOption,
		valueArray: toArray(
			localizedValues[currentEditingLocale.localeId] ?? ['']
		),
	});

	const updateLocalizedValues = (localeId: Locale, newValue: React.Key) => {
		const newLocalizedValues = {
			...localizedValues,
			[localeId]: newValue,
		};
		setLocalizedValues(newLocalizedValues);

		onChange({}, newLocalizedValues);
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
				defaultLanguageId={defaultLanguageId}
				fieldName={fieldName}
				id={id}
				label={label}
				name={name}
				onChange={onChange}
				onSelectionChange={handleChange}
				options={normalizedOptions}
				placeholder={placeholder}
				predefinedValue={predefinedValueArray}
				readOnly={readOnly}
				selectedKey={localizedValues[currentEditingLocale.localeId]![0]}
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
