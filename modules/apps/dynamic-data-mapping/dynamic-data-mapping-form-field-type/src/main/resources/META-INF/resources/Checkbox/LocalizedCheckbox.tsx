/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {ClayInput} from '@clayui/form';
import React, {useState} from 'react';

import FieldBase from '../FieldBase/ReactFieldBase.es';
import LocalesDropdown from '../util/localizable/LocalesDropdown';
import {
	AvailableLocale,
	getAvailableLocales,
} from '../util/localizable/getAvailableLocales';
import {Checkbox, Switcher} from './baseCheckboxComponents';

import type {FieldChangeEventHandler, LocalizedValue} from '../types';

const LocalizedCheckbox: React.FC<
	{children?: React.ReactNode | undefined} & LocalizedCheckbox
> = ({
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
	const availableLocales = getAvailableLocales();
	const defaultLanguageId = Liferay.ThemeDisplay.getDefaultLanguageId();

	value = typeof value === 'object' ? value : {[defaultLanguageId]: value};

	const Toggle = showAsSwitcher ? Switcher : Checkbox;

	const getLocale = (id: string) => {
		return availableLocales.find(
			({localeId}) => localeId === id
		) as AvailableLocale;
	};
	const [currentEditingLocale, setCurrentEditingLocale] = useState(
		getLocale(defaultLanguageId)
	);

	const checked = !!(
		value ??
		(typeof value !== 'object'
			? value
			: value[currentEditingLocale.localeId]) ??
		(Array.isArray(predefinedValue)
			? predefinedValue[0] === 'true'
			: predefinedValue)
	);

	const handleCheckboxToggle: FieldChangeEventHandler<boolean> = (event) => {
		const eventValue = event.target.value;
		let newValue;
		if (typeof value !== 'object') {
			newValue = {[currentEditingLocale.localeId]: eventValue};
		}
		else {
			newValue = {
				...value,
				[currentEditingLocale.localeId]: eventValue,
			};
		}
		onChange({target: {value: newValue}});
	};
	const handleTranslationChange = (localeId: Liferay.Language.Locale) => {
		let newValue;
		if (typeof value !== 'object') {
			newValue = {[defaultLanguageId]: value, [localeId]: value};
			onChange({target: {value: newValue}});
		}
		else {
			if (!Object.hasOwn(value, localeId)) {
				newValue = {...value, [localeId]: value[defaultLanguageId]};
				onChange({target: {value: newValue}});
			}
		}
		setCurrentEditingLocale(getLocale(localeId));
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
					availableLocales={availableLocales}
					editingLocale={currentEditingLocale}
					fieldName={fieldName}
					onLanguageClicked={handleTranslationChange}
				/>
			</ClayInput.GroupItem>
		</FieldBase>
	);
};

interface LocalizedCheckbox {
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
	value?: LocalizedValue<boolean>;
	visible?: boolean;
}
export default LocalizedCheckbox;
