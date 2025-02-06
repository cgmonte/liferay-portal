/**
 * SPDX-FileCopyrightText: (c) 2025 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {ClayInput} from '@clayui/form';

// @ts-ignore

import React, {useState} from 'react';
import {flushSync} from 'react-dom';

import {MultipleSelectBase} from '../Select/MultipleSelectBase';
import {MultipleSelectBaseProps} from '../Select/select.d';
import {LocalizedValue} from '../types';
import LocalesDropdown, {
	AvailableLocale,
	EditingLocale,
} from '../util/localizable/LocalesDropdown';
import {getEditingLocales, getLocale} from './util/locales';

import type {Locale} from '../types';

export interface MultipleSelectLocalizedObjectFieldProps
	extends MultipleSelectBaseProps<string> {
	availableLocales: AvailableLocale[];
	defaultLocale: EditingLocale;
}

export default function MultipleSelectLocalizedObjectField({
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
	tip,
	value: values,
}: MultipleSelectLocalizedObjectFieldProps) {
	const initialEditingLocales = getEditingLocales(
		availableLocales,
		defaultLocale,
		values ?? {['en_US']: ''}
	);

	const [editingLocales, setEditingLocales] = useState<EditingLocale[]>(
		initialEditingLocales
	);

	const [currentEditingLocale, setCurrentEditingLocale] =
		useState<EditingLocale>({
			...getLocale(editingLocales, defaultLocale, defaultLocale.localeId),
		});

	const [localizedValues, setLocalizedValues] = useState<
		LocalizedValue<string[]>
	>(
		values === ''
			? {[currentEditingLocale.localeId]: [values]}
			: JSON.parse(values)
	);

	function updateLocalizedValues(localeId: Locale, items: string[]) {
		const newLocalizedValues = {
			...localizedValues,
			[localeId]: items,
		};

		onChange({}, JSON.stringify(newLocalizedValues));
		setLocalizedValues(newLocalizedValues);
	}

	const handleChange = (_: object, uniqueItems: string[]) => {
		updateLocalizedValues(currentEditingLocale.localeId, uniqueItems);
	};

	const handleTranslationChange = (localeId: Liferay.Language.Locale) => {
		if (!Object.hasOwn(localizedValues, localeId)) {
			flushSync(() => {
				updateLocalizedValues(
					localeId,
					localizedValues[defaultLanguageId]!
				);
			});
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
		<>
			<MultipleSelectBase
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
				tip={tip}
				value={localizedValues[currentEditingLocale.localeId] ?? ''}
			/>

			<ClayInput.GroupItem shrink>
				<LocalesDropdown
					availableLocales={editingLocales}
					editingLocale={currentEditingLocale}
					fieldName={fieldName}
					onLanguageClicked={handleTranslationChange}
				/>
			</ClayInput.GroupItem>
		</>
	);
}
