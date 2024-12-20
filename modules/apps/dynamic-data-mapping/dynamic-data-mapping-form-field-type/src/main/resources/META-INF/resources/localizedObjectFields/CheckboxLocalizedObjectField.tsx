/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {ClayInput} from '@clayui/form';
import React, {useState} from 'react';

import Toggle from '../Checkbox/ToggleComponent';
import FieldBase from '../FieldBase/ReactFieldBase.es';
import LocalesDropdown, {EditingLocale} from '../util/localizable/LocalesDropdown';
import {
	AvailableLocale,
	normalizeAvailableLocales,
} from '../util/localizable/normalizeAvailableLocales';

import type {FieldChangeEventHandler, LocalizedValue} from '../types';

const CheckboxLocalizedObjectField: React.FC<
	{children?: React.ReactNode | undefined} & LocalizedObjectCheckboxField
> = ({
	availableLocales,
	defaultLocale,
	fieldName,
	label,
	name,
	onChange,
	predefinedValue,
	readOnly,
	required,
	showAsSwitcher = true,
	showLabel = true,
	showMaximumRepetitionsInfo = false,
	systemSettingsURL,
	value,
	visible,
	...otherProps
}) => {
	value = Object.keys(value).length ? value : {[defaultLocale.localeId]: false};

	const normalizedAvailableLocales: AvailableLocale[] = normalizeAvailableLocales(availableLocales, defaultLocale, value);

	const [editingLocales, setEditingLocales] = useState(
		normalizedAvailableLocales
	);

	const getLocale = (editingLocales: AvailableLocale[], id: string) => {
		return editingLocales.find(
			({localeId}) => localeId === id
		) as AvailableLocale;
	};

	const [currentEditingLocale, setCurrentEditingLocale] = useState(
		{...getLocale(normalizedAvailableLocales, defaultLocale.localeId)}
	);

	const checked = !!value[currentEditingLocale.localeId];

	const handleCheckboxToggle: FieldChangeEventHandler<boolean> = (event) => {
		const eventValue = event.target.value;

		const newValue = {
			...value,
			[currentEditingLocale.localeId]: eventValue,
		};

		onChange({target: {value: newValue}});
	};

	const handleTranslationChange = (localeId: Liferay.Language.Locale) => {
		if (!Object.hasOwn(value, localeId)) {
			const newValue = {...value, [localeId]: value[defaultLocale.localeId]};

			onChange({target: {value: newValue}});
		}

		const currentLocale = getLocale(editingLocales, localeId);

		const newLocale = {...currentLocale, isDefault: localeId === defaultLocale.localeId, isTranslated: true};

		setEditingLocales((previous) => previous.map((locale) => locale.localeId === localeId ? newLocale : locale))
		
		setCurrentEditingLocale(newLocale);
	};

	return (
		<FieldBase
			name={name}
			showLabel={false}
			visible={visible}
			{...otherProps}
		>
			<Toggle
				checked={checked}
				disabled={readOnly}
				label={label}
				name={name}
				onChange={handleCheckboxToggle}
				required={required}
				showAsSwitcher={showAsSwitcher}
				showLabel={showLabel}
				showMaximumRepetitionsInfo={showMaximumRepetitionsInfo}
				systemSettingsURL={systemSettingsURL}
			/>

			<ClayInput name={name} type="hidden" value={`${checked}`} />

			<ClayInput.GroupItem
				className="liferay-ddm-form-field-localizable-text"
				shrink
			>
				<LocalesDropdown
					availableLocales={editingLocales}
					editingLocale={currentEditingLocale}
					fieldName={fieldName}
					onLanguageClicked={handleTranslationChange}
				/>
			</ClayInput.GroupItem>
		</FieldBase>
	);
};

interface LocalizedObjectCheckboxField {
	availableLocales: EditingLocale[];
	defaultLanguageId: Liferay.Language.Locale;
	defaultLocale: EditingLocale;
	checked: boolean;
	disabled?: boolean;
	fieldName: string;
	label?: string;
	name: string;
	onChange: FieldChangeEventHandler<LocalizedValue<boolean>>;
	required?: boolean;
	showLabel?: boolean;
	localizedObjectField?: boolean;
	predefinedValue?: boolean | String[];
	readOnly?: boolean;
	showAsSwitcher?: boolean;
	showMaximumRepetitionsInfo?: boolean;
	systemSettingsURL: string;
	value: LocalizedValue<boolean>;
	visible?: boolean;
}
export default CheckboxLocalizedObjectField;
