/**
 * Copyright (c) 2000-present Liferay, Inc. All rights reserved.
 *
 * This library is free software; you can redistribute it and/or modify it under
 * the terms of the GNU Lesser General Public License as published by the Free
 * Software Foundation; either version 2.1 of the License, or (at your option)
 * any later version.
 *
 * This library is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU Lesser General Public License for more
 * details.
 */

import ClayAutocomplete from '@clayui/autocomplete';
import React from 'react';

interface Option {
	label: string;
	value: string;
}

interface SelectProps {
	onClick: (value: string) => void;
	options: Option[];
}

export function Select({onClick, options}: SelectProps) {
	return (
		<ClayAutocomplete
			aria-labelledby="clay-autocomplete-label-1"
			id="clay-autocomplete-1"
			items={options}
			menuTrigger="focus"
			messages={{
				loading: Liferay.Language.get('loading'),
				notFound: Liferay.Language.get('no-results-found'),
			}}
			placeholder={Liferay.Language.get('select-a-liferay-object')}
		>
			{(option) => (
				<ClayAutocomplete.Item
					key={option.value}
					onClick={() => onClick(option.value)}
				>
					{option.label}
				</ClayAutocomplete.Item>
			)}
		</ClayAutocomplete>
	);
}
