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

import ClayForm, {ClayCheckbox} from '@clayui/form';
import React, {useState} from 'react';

import Asterisk from './Asterisk';

const ProductOptionCheckboxMultiple = ({
	label,
	productOptionValues,
	required,
}) => {
	const [options, setOptions] = useState(productOptionValues);

	const handleChange = ({target: {checked, value}}) => {
		setOptions((previousOptions) =>
			previousOptions.map((option) =>
				option.value === value ? {...option, selected: checked} : option
			)
		);
	};

	return (
		<ClayForm.Group>
			<label>
				{label}

				<Asterisk required={required} />
			</label>

			{options.map(({key, label, name, selected, value}) => (
				<ClayCheckbox
					checked={selected}
					key={key}
					label={label}
					name={name}
					onChange={handleChange}
					value={value}
				/>
			))}
		</ClayForm.Group>
	);
};

export default ProductOptionCheckboxMultiple;
