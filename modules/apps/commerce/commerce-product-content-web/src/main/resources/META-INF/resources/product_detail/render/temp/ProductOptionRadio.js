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

import ClayForm, {ClayRadio, ClayRadioGroup} from '@clayui/form';
import React from 'react';

import Asterisk from './Asterisk';

const ProductOptionRadio = ({
	id,
	label,
	name,
	productOptionValues,
	required,
}) => {
	const handleClick = ({target: {value}}) => {

		// This void call is a placeolder. Replace it with the function body.

		void value;
	};
	const getPredefinedValue = () => {
		const selectedOption = productOptionValues.find(
			(option) => option.selected === true
		);

		if (selectedOption) {
			return selectedOption.value;
		}

		const defaultOption = productOptionValues.find(
			(option) => option.defaultValue === true
		);

		return defaultOption?.value;
	};

	return (
		<ClayForm.Group>
			<label htmlFor={id}>
				{label}

				<Asterisk required={required} />
			</label>

			<ClayRadioGroup
				defaultValue={getPredefinedValue()}
				id={id}
				name={name}
			>
				{productOptionValues.map(({key, label, name, value}) => (
					<ClayRadio
						key={key}
						label={label}
						name={name}
						onClick={handleClick}
						value={value}
					/>
				))}
			</ClayRadioGroup>
		</ClayForm.Group>
	);
};

export default ProductOptionRadio;
