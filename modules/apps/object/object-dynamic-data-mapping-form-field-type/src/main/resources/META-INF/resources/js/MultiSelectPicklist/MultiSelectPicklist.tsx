/**
 * SPDX-FileCopyrightText: (c) 2024 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {
	LocalizedValue,
	MultipleSelection,
	ReactFieldBase as FieldBase,
} from 'dynamic-data-mapping-form-field-type';
import React, {useEffect, useRef, useState} from 'react';

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

type PossibleValues = string | string[] | LocalizedValue<string[]>;

interface MultiSelectPicklistProps {
	availableLocales: EditingLocale[];
	defaultLanguageId: Liferay.Language.Locale;
	defaultLocale: EditingLocale;
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
	value: PossibleValues;
}

export default function MultiSelectPicklist({
	errorMessage,
	label,
	localizedObjectField,
	localizedValue = {},
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
	const convertStringToObject = (
		str: string
	): string[] | LocalizedValue<string[]> =>
		JSON.parse(
			localizedObjectField ? str : str.replace(/(\b\w+\b)/g, '"$1"')
		);

	const normalizeValues = (value: PossibleValues) => {
		if (value === '') {
			return [];
		}
		else if (typeof value === 'string') {
			return convertStringToObject(value);
		}

		return value;
	};

	const normalizedValue = normalizeValues(value);

	const [localValues, setLocalValues] = useState(normalizedValue);

	const onChangeRef = useRef(onChange);

	useEffect(() => {
		onChangeRef.current = onChange;
	}, [onChange]);

	useEffect(() => {
		onChangeRef.current({target: {value: normalizedValue}});
	}, [normalizedValue]);

	const handleChange = (
		_: object,
		value: string[] | LocalizedValue<string[]>
	) => {
		setLocalValues(
			localizedObjectField
				? {...(value as LocalizedValue<string[]>)}
				: [...(value as string[])]
		);
		onChange({target: {value}});
	};

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
				onChange={handleChange}
				options={options}
				placeholder={placeholder}
				readOnly={readOnly}
				required={required}
				tip={tip}
				value={localValues}
			/>
		</FieldBase>
	);
}
