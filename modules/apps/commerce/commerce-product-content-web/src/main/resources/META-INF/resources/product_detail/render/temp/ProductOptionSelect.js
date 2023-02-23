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

import ClayForm, {ClaySelect} from '@clayui/form';
import classnames from 'classnames';
import React, {useState} from 'react';

import Asterisk from './Asterisk';

const ProductOptionSelect = ({
	id,
	label,
	name,
	productOptionValues,
	required,
}) => {
	const [errors, setErrors] = useState({});

	const handleChange = ({target: {value}}) => {

		// This void call is a placeolder. Replace it with the function body.

		void value;
	};

	const handleBlur = ({target: {selectedIndex}}) => {
		if (required && selectedIndex === 0) {
			setErrors({selectedPlaceholder: true});
		}
		else {
			setErrors({});
		}
	};

	return (
		<ClayForm.Group
			className={classnames({'has-error': errors.selectedPlaceholder})}
		>
			<label htmlFor={id}>
				{label}

				<Asterisk required={required} />
			</label>

			<ClaySelect
				id={id}
				name={name}
				onBlur={handleBlur}
				onChange={handleChange}
			>
				<ClaySelect.Option
					disabled={required}
					label={Liferay.Language.get('choose-an-option')}
					selected
				/>

				{productOptionValues.map(({key, label, name, value}) => (
					<ClaySelect.Option
						key={key}
						label={label}
						name={name}
						value={value}
					/>
				))}
			</ClaySelect>

			{errors.selectedPlaceholder && (
				<ClayForm.FeedbackItem>
					<ClayForm.FeedbackIndicator symbol="exclamation-full" />

					{Liferay.Language.get('this-field-is-required')}
				</ClayForm.FeedbackItem>
			)}
		</ClayForm.Group>
	);
};

export default ProductOptionSelect;
