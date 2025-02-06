/**
 * SPDX-FileCopyrightText: (c) 2024 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {
	MultipleSelection,
	ReactFieldBase as FieldBase,
} from 'dynamic-data-mapping-form-field-type';
import React from 'react';

interface AvailableLocale {
	displayName: string;
	icon: string;
	localeId: Liferay.Language.Locale;
}

interface EditingLocale extends AvailableLocale {
	isDefault: boolean;
	isTranslated: boolean;
}

interface MultiSelectOption {
	label: string;
	reference: string | null;
	value: string;
}

interface MultiSelectPicklistProps {
	availableLocales?: EditingLocale[];
	defaultLanguageId: Liferay.Language.Locale;
	defaultLocale?: EditingLocale;
	errorMessage: string;
	fieldName: string;
	id: string;
	label: string;
	localizedObjectField?: boolean;
	localizedValue?: Liferay.Language.FullyLocalizedValue<string> | {};
	name: string;
	onChange: Function;
	options: MultiSelectOption[];
	placeholder?: string;
	readOnly: boolean;
	required: boolean;
	tip?: string;
	value: string[];
}

export default function MultiSelectPicklist({
	errorMessage,
	label,
	localizedValue = {},
	localizedObjectField,
	name,
	onChange,
	id,
	options = [],
	placeholder = Liferay.Language.get('choose-an-option'),
	readOnly = false,
	required,
	tip,
	value,
	...otherProps
}: MultiSelectPicklistProps) {
	return (
		<FieldBase
			errorMessage={errorMessage}
			label={label}
			localizedValue={localizedValue}
			name={name}
			readOnly={readOnly}
			required={required}
			tip={tip}
			{...otherProps}
		>
			<MultipleSelection
				{...otherProps}
				errorMessage={errorMessage}
				id={id}
				label={label}
				localizedObjectField={localizedObjectField}
				name={name}
				onChange={onChange}
				options={options}
				placeholder={placeholder}
				readOnly={readOnly}
				required={required}
				tip={tip}
				value={value}
			/>

			<input name={name} type="hidden" value={value} />
		</FieldBase>
	);
}
