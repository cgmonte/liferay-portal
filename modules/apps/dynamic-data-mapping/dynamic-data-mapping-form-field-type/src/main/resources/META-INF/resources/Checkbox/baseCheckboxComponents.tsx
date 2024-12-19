/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {ClayCheckbox, ClayToggle} from '@clayui/form';
import ClayIcon from '@clayui/icon';
import React from 'react';

import type {FieldChangeEventHandler} from '../types';

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

interface ISwitcherProps extends ICheckboxProps {
	showMaximumRepetitionsInfo: boolean;
	systemSettingsURL: string;
}

interface ICheckboxProps {
	checked: boolean;
	disabled?: boolean;
	label?: string;
	name: string;
	onChange: FieldChangeEventHandler<boolean>;
	required?: boolean;
	showLabel?: boolean;
}

export {Checkbox, Switcher};
