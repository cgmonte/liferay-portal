/**
 * SPDX-FileCopyrightText: (c) 2025 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {ClayInput} from '@clayui/form';
import React, {useEffect, useRef, useState} from 'react';

import SingleSelectBase from '../Select/SingleSelectBase';
import {SelectMainProps} from '../Select/select.d';
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
	defaultLocale: EditingLocale;
	value: valueTypes;
}

function getDefaultValue(locale: Locale, values: valueTypes) {
	return Array.isArray(values) ? {[locale]: values} : values;
}

export default function SelectLocalizedObjectField({
	availableLocales,
	defaultLanguageId,
	defaultLocale,
	errorMessage,
	fieldName,
	id,
	label,
	name,
	onChange,
	options,
	readOnly,
	required,
	showEmptyOption = true,
	tip,
	value: values,
}: SelectLocalizedObjectFieldProps) {
	const [editingLocales, setEditingLocales] = useState<EditingLocale[]>(
		getEditingLocales(
			availableLocales,
			defaultLocale,
			getDefaultValue(defaultLanguageId, values)
		)
	);

	const [currentEditingLocale, setCurrentEditingLocale] =
		useState<EditingLocale>({
			...getLocale(editingLocales, defaultLocale, defaultLocale.localeId),
		});

	const currentEditingLocaleIdRef = useRef<Locale>(
		currentEditingLocale.localeId
	);

	const [localizedValues, setLocalizedValues] = useState<
		LocalizedValue<string[]>
	>(getDefaultValue(currentEditingLocale.localeId, values));

	useEffect(() => {
		currentEditingLocaleIdRef.current = currentEditingLocale.localeId;
	}, [currentEditingLocale]);

	const updateLocalizedValues = (localeId: Locale, items: string[]) => {
		const newLocalizedValues = {
			...localizedValues,
			[localeId]: items,
		};
		setLocalizedValues(newLocalizedValues);

		onChange({}, newLocalizedValues);
	};

	const handleChange = (_: object, uniqueItems: string[]) => {
		updateLocalizedValues(currentEditingLocaleIdRef.current, uniqueItems);
	};

	const handleTranslationChange = (localeId: Liferay.Language.Locale) => {
		if (!Object.hasOwn(localizedValues, localeId)) {
			updateLocalizedValues(
				localeId,
				localizedValues[defaultLanguageId]!
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
				defaultLanguageId={defaultLanguageId}
				errorMessage={errorMessage}
				fieldName={fieldName}
				id={id}
				label={label}
				name={name}
				onChange={handleChange}
				options={options}
				readOnly={readOnly}
				required={required}
				showEmptyOption={showEmptyOption}
				tip={tip}
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
