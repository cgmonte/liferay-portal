/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {ClayCheckbox, ClayInput, ClayToggle} from '@clayui/form';
import ClayIcon from '@clayui/icon';
import React, {useState} from 'react';

import FieldBase from '../FieldBase/ReactFieldBase.es';
import LocalesDropdown from '../util/localizable/LocalesDropdown';
import {
	AvailableLocale,
	getAvailableLocales,
} from '../util/localizable/getAvailableLocales';

import type {FieldChangeEventHandler, LocalizedValue} from '../types';

const Switcher: React.FC<
	{children?: React.ReactNode | undefined} & ISwitcherProps
> = ({
	checked,
	disabled,
	label,
	name,
	onChange,
	required,
	showLabel,
	showMaximumRepetitionsInfo,
	systemSettingsURL,
}) => {
	return (
		<>
			<label className="toggle-switch">
				<ClayToggle
					aria-required={required}
					disabled={disabled}
					name={name}
					onToggle={(checked) => {
						onChange({target: {value: checked}});
					}}
					toggled={checked}
					value={String(checked)}
				/>

				{showLabel && label}

				{required && (
					<ClayIcon className="reference-mark" symbol="asterisk" />
				)}
			</label>
			{checked && showMaximumRepetitionsInfo && (
				<div className="ddm-info">
					<span className="ddm-tooltip">
						<ClayIcon symbol="info-circle" />
					</span>

					<div
						className="ddm-info-text"
						dangerouslySetInnerHTML={{
							__html: Liferay.Util.sub(
								Liferay.Language.get(
									'for-security-reasons-upload-field-repeatability-is-limited-the-limit-is-defined-in-x-system-settings-x'
								),
								`<a href=${systemSettingsURL} target="_blank">`,
								'</a>'
							),
						}}
					/>
				</div>
			)}
		</>
	);
};

const Checkbox: React.FC<
	{children?: React.ReactNode | undefined} & ICheckboxProps
> = ({checked, disabled, label, name, onChange, required, showLabel}) => {
	return (
		<ClayCheckbox
			aria-required={required}
			checked={checked}
			disabled={disabled}
			label={showLabel ? label : ''}
			name={name}
			onChange={({target: {checked}}) => {
				onChange({target: {value: checked}});
			}}
		>
			{showLabel && required && (
				<span className="ddm-label-required reference-mark">
					<ClayIcon symbol="asterisk" />
				</span>
			)}
		</ClayCheckbox>
	);
};

const Main: React.FC<{children?: React.ReactNode | undefined} & IProps> = ({
	fieldName,
	label,
	localizable,
	localizedValue,
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
	console.log('value', value);
	console.log('localizedValue', localizedValue);
	const Toggle = showAsSwitcher ? Switcher : Checkbox;

	const availableLocales = getAvailableLocales();
	const defaultLanguageId = Liferay.ThemeDisplay.getDefaultLanguageId();

	const getLocale = (id: string) => {
		return availableLocales.find(
			({localeId}) => localeId === id
		) as AvailableLocale;
	};

	const [currentEditingLocale, setCurrentEditingLocale] = useState(
		getLocale(defaultLanguageId)
	);

	const checked = !!(
		(!localizable || typeof value !== 'object'
			? value
			: value[currentEditingLocale.localeId]) ??
		(Array.isArray(predefinedValue)
			? predefinedValue[0] === 'true'
			: predefinedValue)
	);

	const handleCheckboxToggle: FieldChangeEventHandler<boolean> = (event) => {
		if (!localizable) {
			onChange(event);
		}
		else {
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
		}
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

			{localizable && (
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
			)}
		</FieldBase>
	);
};

interface IProps extends ICheckboxProps {
	fieldName: string;
	localizable: boolean;
	localizedValue: {
		[key in Liferay.Language.Locale]: boolean;
	};
	predefinedValue?: boolean | String[];
	readOnly?: boolean;
	showAsSwitcher?: boolean;
	showMaximumRepetitionsInfo?: boolean;
	systemSettingsURL: string;
	value: boolean | LocalizedValue<boolean>;
	visible?: boolean;
}
interface ISwitcherProps extends ICheckboxProps {
	showMaximumRepetitionsInfo: boolean;
	systemSettingsURL: string;
}

interface ICheckboxProps {
	checked: boolean;
	disabled?: boolean;
	label?: string;
	name: string;
	onChange: any;
	required?: boolean;
	showLabel?: boolean;
}

Main.displayName = 'Checkbox';

export {Main};
export default Main;
