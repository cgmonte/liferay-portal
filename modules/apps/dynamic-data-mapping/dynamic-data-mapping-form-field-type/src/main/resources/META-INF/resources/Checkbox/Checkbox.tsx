/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {ClayInput} from '@clayui/form';
import React from 'react';

import FieldBase from '../FieldBase/ReactFieldBase.es';
import CheckboxLocalizedObjectField from '../localizedObjectFields/CheckboxLocalizedObjectField';
import Toggle from './ToggleComponent';

import type {FieldChangeEventHandler} from '../types';

const DefaultCheckbox: React.FC<
	{children?: React.ReactNode | undefined} & IProps
> = ({
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
	const checked = !!(
		value ??
		(Array.isArray(predefinedValue)
			? predefinedValue[0] === 'true'
			: predefinedValue)
	);

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
				onChange={onChange}
				required={required}
				showAsSwitcher={showAsSwitcher}
				showLabel={showLabel}
				showMaximumRepetitionsInfo={showMaximumRepetitionsInfo}
				systemSettingsURL={systemSettingsURL}
			/>

			<ClayInput name={name} type="hidden" value={`${checked}`} />
		</FieldBase>
	);
};

const Main: React.FC<{children?: React.ReactNode | undefined} & any> = ({
	localizedObjectField,
	...otherProps
}) => {
	const Component = localizedObjectField
		? CheckboxLocalizedObjectField
		: DefaultCheckbox;

	return <Component {...otherProps} />;
};

interface IProps extends ICheckboxProps {
	localizedObjectField?: boolean;
	predefinedValue?: boolean | String[];
	readOnly?: boolean;
	showAsSwitcher?: boolean;
	showMaximumRepetitionsInfo?: boolean;
	systemSettingsURL: string;
	value?: boolean;
	visible?: boolean;
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

Main.displayName = 'Checkbox';

export {Main};
export default Main;
