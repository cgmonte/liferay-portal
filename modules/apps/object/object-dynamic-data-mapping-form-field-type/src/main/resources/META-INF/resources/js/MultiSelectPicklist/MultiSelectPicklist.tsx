/**
 * SPDX-FileCopyrightText: (c) 2024 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {
	MultipleSelection,
	ReactFieldBase as FieldBase,
} from 'dynamic-data-mapping-form-field-type';
import React, {useEffect, useState} from 'react';

interface MultiSelectOption {
	label: string;
	reference: string | null;
	value: string;
}

interface MultiSelectPicklistProps {
	errorMessage?: string;
	id: string;
	label: string;
	localizedValue?: Liferay.Language.FullyLocalizedValue<string> | {};
	name: string;
	onChange: Function;
	options: MultiSelectOption[];
	placeholder?: string;
	readOnly: boolean;
	required: boolean;
	tip?: string;
	value: string[] | string;
}

const convertStringToObject = (str: string) =>
	JSON.parse(str.replace(/(\b\w+\b)/g, '"$1"'));

const normalizeValues = (value: string | string[]) => {
	if (value === '') {
		return [];
	}
	else if (typeof value === 'string') {
		return convertStringToObject(value);
	}

	return value;
};

export default function MultiSelectPicklist({
	errorMessage,
	label,
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
	const normalizedValue = normalizeValues(value);

	const [localValues, setLocalValues] = useState(normalizedValue);

	const handleChange = (_: object, value: string) => {
		setLocalValues([...value]);
		onChange({target: {value}});
	};

	useEffect(() => {
		onChange({target: {value: normalizedValue}});
	}, [normalizedValue]);

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
				errorMessage={errorMessage}
				id={id}
				label={label}
				name={name}
				onChange={handleChange}
				options={options}
				placeholder={placeholder}
				readOnly={readOnly}
				required={required}
				tip={tip}
				value={localValues}
			/>

			<input name={name} type="hidden" value={localValues} />
		</FieldBase>
	);
}
