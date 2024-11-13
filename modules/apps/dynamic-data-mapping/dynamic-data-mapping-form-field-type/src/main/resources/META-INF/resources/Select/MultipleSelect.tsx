/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {ClayCheckbox} from '@clayui/form';
import ClayMultiSelect from '@clayui/multi-select';
import {useFormState} from 'data-engine-js-components-web';
import React, {useCallback, useEffect, useState} from 'react';

import {MultiSelectItem, MultiSelectProps} from './select.d';

const MultipleSelection = ({
	dataSourceType,
	errorMessage,
	id,
	label,
	name,
	onChange,
	options,
	readOnly,
	required,
	tip,
	value: values,
}: MultiSelectProps) => {
	const [items, setItems] = useState<MultiSelectItem[]>([]);
	const [loading, setLoading] = useState<boolean>();
	const {activeTabTitle, viewMode} = useFormState();

	const accessibleProps = {
		...(label && {
			'aria-labelledby': `${id ?? name}`,
		}),
		...(tip && {
			'aria-describedby': `${id ?? name}_fieldHelp`,
		}),
		...(errorMessage && {
			'aria-errormessage': `${id ?? name}_fieldError`,
		}),
		'aria-required': required,
	};

	useEffect(() => {
		const newItems = options.filter((option) => {
			if (values?.includes(option.value)) {
				return {label: option.label};
			}
		});

		setItems(newItems);

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [values]);

	useEffect(() => {
		if (
			!readOnly &&
			activeTabTitle !== Liferay.Language.get('advanced') &&
			!viewMode
		) {
			setLoading(true);
			setTimeout(() => setLoading(false), 200);
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [options]);

	/**
	 * create an onLoadMore call to be passed to ClayMultiSelect if
	 * dataSourceType equals 'from-autofill'. onLoadMore only returns
	 * a promise that resolves to something we already have (options),
	 * but ClayMultiSelect will then treat the items updates as async,
	 * fixiging the behavior.
	 */
	const onLoadMore = useCallback(() => {
		return new Promise((resolve) => {
			resolve(options);
		});
	}, [options]);

	// debug: check when new options arrive from the data-provider
	useEffect(() => {
		console.log('options', options);
	}, [options]);

	/**
	 * debug: check that dataSourceType does not change to manual.
	 * because I want to isolate the fix to just work with 'from-autofill',
	 * if dataSourceType changes to manual, it won't work.
	 */
	useEffect(() => {
		console.log('dataSourceType', dataSourceType);
	}, [dataSourceType]);

	return (
		<>
			{!loading && (
				<ClayMultiSelect

					// fix: pass onLoadMore only if data source is autofill
					{...(dataSourceType === 'from-autofill' && {onLoadMore})}

					{...accessibleProps}
					disabled={readOnly}
					items={items}
					onItemsChange={(itemsChanged: MultiSelectItem[]) => {
						const uniqueItems = [
							...new Set(itemsChanged.map((item) => item.value)),
						];

						if (itemsChanged.length > uniqueItems.length) {
							uniqueItems.pop();
						}

						onChange({}, uniqueItems);
					}}
					onKeyDown={(event) => {
						if (event.key === 'Enter') {
							event.preventDefault();
						}
					}}
					placeholder={
						!items.length
							? Liferay.Language.get('choose-options')
							: ''
					}
					sourceItems={options}
				>
					{(item) => (
						<ClayMultiSelect.Item
							key={item.value}
							textValue={item.label}
						>
							<div className="auto autofit-row-center fit-row">
								<ClayCheckbox
									aria-label={item.label}
									checked={values?.includes(item.value)!}
									data-itemValue={item.value}
									data-option-reference={item.reference}
									data-testid={`labelItem-${item.value}`}
									label={item.label}
									onChange={({target: {checked}}) => {
										let newValues = values as string[];

										if (checked) {
											options.forEach((option) => {
												if (
													option.value === item.value
												) {
													newValues.push(
														option.value
													);
												}
											});
										}
										else {
											options.forEach((option) => {
												if (
													option.value === item.value
												) {
													newValues = (
														values as string[]
													).filter(
														(value) =>
															value !== item.value
													);
												}
											});
										}

										setItems(
											newValues.map((newValue) => {
												return {
													label: newValue,
													reference: null,
													value: newValue,
												};
											})
										);

										onChange({}, newValues);
									}}
								/>
							</div>
						</ClayMultiSelect.Item>
					)}
				</ClayMultiSelect>
			)}
		</>
	);
};

export default MultipleSelection;
