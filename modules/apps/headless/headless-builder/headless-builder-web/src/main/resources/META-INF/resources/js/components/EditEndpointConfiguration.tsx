/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {Text} from '@clayui/core';
import ClayForm from '@clayui/form';
import ClayIcon from '@clayui/icon';
import {ClayTooltipProvider} from '@clayui/tooltip';
import {sub} from 'frontend-js-web';
import React, {useEffect, useState} from 'react';

import {Select} from './fieldComponents/Select';
import {getAllItems} from './utils/fetchUtil';

interface EditEndpointConfigurationProps {
	currentAPIApplicationId: string;
	schemaAPIURLPath: string;
}

export default function EditEndpointConfiguration({
	currentAPIApplicationId,
	schemaAPIURLPath,
}: EditEndpointConfigurationProps) {
	const [responseBodySchemaOptions, setResponseBodySchemaOptions] = useState<
		SelectOption[]
	>([]);
	const [localUIData, setLocalUIData] = useState<
		Partial<{
			endpointFilter: string;
			endpointSort: string;
			selectedResponseBodySchema: SelectOption;
		}>
	>();

	useEffect(() => {
		getAllItems<APISchemaItem>({
			url: schemaAPIURLPath,
		}).then((result) => {
			const options = result
				? result
						.filter(
							(apiSchemas) =>
								apiSchemas.r_apiApplicationToAPISchemas_c_apiApplicationId?.toString() ===
								currentAPIApplicationId
						)
						.map((apiSchemas) => ({
							label: apiSchemas.name,
							value: apiSchemas.id.toString(),
						}))
				: [];

			if (options.length) {
				setResponseBodySchemaOptions(options);
			}
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleSelectResponseBodySchema = (value: string) => {
		const selectedOption = responseBodySchemaOptions.find(
			(option) => option.value === value
		);

		if (selectedOption) {
			setLocalUIData((previousValue) => ({
				...previousValue,
				selectedResponseBodySchema: selectedOption,
			}));
		}

		// setSelectedObjectDefinition(
		// 	objectDefinitionsOptions.find((option) => option.value === value)
		// );
	};

	const endpointFiltersInstruction = Liferay.Language.get(
		'type-any-filter-using-odata-language'
	);

	const endpointSortInstruction = Liferay.Language.get(
		'type-any-sort-using-odata-language'
	);

	return (
		<ClayForm>
			<ClayForm.Group>
				<label htmlFor="selectTrigger">
					{Liferay.Language.get('response-body-schema')}
				</label>

				<Select
					cleanUp={() =>
						setLocalUIData((previousValue) => {
							delete previousValue?.selectedResponseBodySchema;

							return {...previousValue};
						})
					}
					disabled={false}
					dropDownSearchAriaLabel={Liferay.Language.get(
						'search-for-a-schema-or-use-the-arrow-keys-to-navigate-and-select-a-schema-from-the-list'
					)}
					onClick={handleSelectResponseBodySchema}
					options={responseBodySchemaOptions}
					placeholder={Liferay.Language.get(
						'select-a-response-body-schema'
					)}
					selectedOption={localUIData?.selectedResponseBodySchema}

					// triggerAriaLabel={
					// 	!selectedObjectDefinition
					// 		? Liferay.Language.get(
					// 				Liferay.Language.get(
					// 					'select-an-object-definition'
					// 				)
					// 		  )
					// 		: sub(
					// 				Liferay.Language.get(
					// 					'object-definition-x-is-selected'
					// 				),
					// 				selectedObjectDefinition.label
					// 		  )
					// }
				/>
			</ClayForm.Group>

			<ClayForm.Group>
				<label htmlFor="endpointFiltersField">
					{Liferay.Language.get('filters')}

					<ClayTooltipProvider>
						<span
							data-tooltip-align="top"
							title={`${Liferay.Language.get(
								'there-is-a-limit-of-1000-characters-in-OData-language'
							)} ${sub(
								Liferay.Language.get(
									'remember-not-to-include-the-x'
								),
								'?filter='
							)}`}
						>
							&nbsp;
							<ClayIcon symbol="question-circle-full" />
						</span>
					</ClayTooltipProvider>
				</label>

				<Text as="p" id="hostTextPreview" size={2} weight="lighter">
					/?filter=
				</Text>

				<textarea
					aria-label={endpointFiltersInstruction}
					autoComplete="off"
					className="form-control"
					id="endpointFiltersField"
					onChange={({target: {value}}) =>
						setLocalUIData((previousData) => ({
							...previousData,
							endpointFilter: value,
						}))
					}
					placeholder={endpointFiltersInstruction}
					value={localUIData?.endpointFilter}
				/>
			</ClayForm.Group>

			<ClayForm.Group>
				<label htmlFor="schemaDescriptionField">
					{Liferay.Language.get('sorting')}

					<ClayTooltipProvider>
						<span
							data-tooltip-align="top"
							title={`${Liferay.Language.get(
								'there-is-a-limit-of-1000-characters-in-OData-language'
							)} ${sub(
								Liferay.Language.get(
									'remember-not-to-include-the-x'
								),
								'?filter='
							)}`}
						>
							&nbsp;
							<ClayIcon symbol="question-circle-full" />
						</span>
					</ClayTooltipProvider>
				</label>

				<Text as="p" id="hostTextPreview" size={2} weight="lighter">
					/?sort=
				</Text>

				<textarea
					aria-label={endpointSortInstruction}
					autoComplete="off"
					className="form-control"
					id="schemaDescriptionField"
					onChange={({target: {value}}) =>
						setLocalUIData((previousData) => ({
							...previousData,
							endpointSort: value,
						}))
					}
					placeholder={endpointSortInstruction}
					value={localUIData?.endpointSort}
				/>
			</ClayForm.Group>
		</ClayForm>
	);
}
