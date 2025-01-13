/**
 * SPDX-FileCopyrightText: (c) 2024 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {ClayInput} from '@clayui/form';
import React, {useEffect, useState} from 'react';

import CheckboxBase, {ICheckboxBaseProps} from '../Checkbox/CheckboxBase';
import LocalesDropdown, {
	EditingLocale,
} from '../util/localizable/LocalesDropdown';
import {getEditingLocales, getLocale} from './util/locales';

import {useFormState} from 'data-engine-js-components-web';

import type {FieldChangeEventHandler, LocalizedValue} from '../types';

export default function CheckboxLocalizedObjectField(props: IProps) {
	const {availableLocales, defaultLocale, fieldName, onChange, value} = props;
	const {objectEntryEditingLanguageId} = useFormState();

	const initialEditingLocales = getEditingLocales(
		availableLocales,
		defaultLocale,
		value
	);

	const [editingLocales, setEditingLocales] = useState<EditingLocale[]>(
		initialEditingLocales
	);

	useEffect(()=>{
		if (objectEntryEditingLanguageId as Liferay.Language.Locale) {
			// handleTranslationChange(objectEntryEditingLanguageId as Liferay.Language.Locale);


			if (!Object.hasOwn(value, objectEntryEditingLanguageId as Liferay.Language.Locale)) {
				const newValue = {	
					...value,
					[objectEntryEditingLanguageId as Liferay.Language.Locale]: value[defaultLocale.localeId],
				};
	
				onChange({target: {value: newValue}});
			}
		}

	},[objectEntryEditingLanguageId])

	// const [currentEditingLocale, setCurrentEditingLocale] = useState({
	// 	...getLocale(editingLocales, defaultLocale, defaultLocale.localeId),
	// });

	const checked = !!value[objectEntryEditingLanguageId as Liferay.Language.Locale ?? defaultLocale.localeId];

	const handleCheckboxToggle: FieldChangeEventHandler<
		LocalizedValue<boolean>
	> = (event) => {
		const eventValue = event.target.value;

		const newValue = {
			...value,
			[objectEntryEditingLanguageId as Liferay.Language.Locale]: eventValue,
		};

		onChange({target: {value: newValue}});
	};

	const handleTranslationChange = (localeId: Liferay.Language.Locale) => {
		// if (!Object.hasOwn(value, localeId)) {
		// 	const newValue = {	
		// 		...value,
		// 		[localeId]: value[defaultLocale.localeId],
		// 	};

		// 	onChange({target: {value: newValue}});
		// }

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

		// setCurrentEditingLocale(updatedLocale);
	};

	return (
		<ClayInput.Group>
			<ClayInput.GroupItem>
				<CheckboxBase
					{...props}
					checked={checked}
					onChange={handleCheckboxToggle}
				/>
			</ClayInput.GroupItem>

			<ClayInput.GroupItem shrink>
				<LocalesDropdown
					availableLocales={editingLocales}
					editingLocale={editingLocales.find(
						(locale) => {
							const localeToMatch = objectEntryEditingLanguageId ?? defaultLocale.localeId;
							
							return locale.localeId === localeToMatch
						}
					) as EditingLocale}
					fieldName={fieldName}
					onLanguageClicked={handleTranslationChange}
				/>
			</ClayInput.GroupItem>
		</ClayInput.Group>
	);
}

export interface IProps extends ICheckboxBaseProps {
	availableLocales: EditingLocale[];
	defaultLocale: EditingLocale;
	fieldName: string;
	onChange: FieldChangeEventHandler<LocalizedValue<boolean>>;
	systemSettingsURL: string;
	value: LocalizedValue<boolean>;
}
