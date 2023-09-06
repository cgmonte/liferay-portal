/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayButton from '@clayui/button';
import ClayForm, {ClayInput} from '@clayui/form';
import ClayIcon from '@clayui/icon';
import ClayModal from '@clayui/modal';
import classNames from 'classnames';
import {fetch, openToast, sub} from 'frontend-js-web';
import React, {Dispatch, SetStateAction, useEffect, useState} from 'react';

import {Select} from '../fieldComponents/Select';

type DataError = {
	dataType: boolean;
	mappedProperty: boolean;
	name: boolean;
};

interface PropertyUIData {
	dataType: ObjectFieldBusinessType;
	description: string;
	mappedProperty: string;
	name: string;
}

const headers = new Headers({
	'Accept': 'application/json',
	'Accept-Language': Liferay.ThemeDisplay.getBCP47LanguageId(),
	'Content-Type': 'application/json',
});

interface EditAPIPropertyModalContentProps extends Partial<TreeViewItemData> {
	closeModal: voidReturn;
}

export default function EditAPIPropertyModalContent({
	businessType,
	closeModal,
	description,
	name,
	objectFieldName,
}: EditAPIPropertyModalContentProps) {
	// const [localUIData, setLocalUIData] = useState<PropertyUIData>();

	const [displayError, setDisplayError] = useState<DataError>({
		dataType: false,
		mappedProperty: false,
		name: false,
	});

	// useEffect(() => {
	// 	for (const key in localUIData) {
	// 		if (localUIData[key as keyof PropertyUIData] !== '') {
	// 			setDisplayError((previousErrors) => ({
	// 				...previousErrors,
	// 				[key]: false,
	// 			}));
	// 		}
	// 	}
	// }, [localUIData]);

	// async function postData() {
	// 	fetch(apiSchemasURLPath, {
	// 		body: JSON.stringify({
	// 			...localUIData,
	// 			applicationStatus: {key: 'unpublished'},
	// 			r_apiApplicationToAPISchemas_c_apiApplicationId: currentAPIApplicationId,
	// 			version: '1.0',
	// 		}),
	// 		headers,
	// 		method: 'POST',
	// 	})
	// 		.then((response) => {
	// 			if (response.ok) {
	// 				return response.json();
	// 			} else {
	// 				throw response.json();
	// 			}
	// 		})
	// 		.then((responseJSON) => {
	// 			loadData();
	// 			closeModal();
	// 			setMainSchemaNav({edit: responseJSON.id});
	// 			openToast({
	// 				message: Liferay.Language.get(
	// 					'new-api-application-schema-was-created'
	// 				),
	// 				type: 'success',
	// 			});
	// 		})
	// 		.catch((error) => {
	// 			error.then((response: {message: string; title: string}) => {
	// 				{
	// 					openToast({
	// 						message: response.title ?? response.message,
	// 						type: 'danger',
	// 					});
	// 				}
	// 			});
	// 		});
	// }

	// function validateData() {
	// 	let isDataValid = true;
	// 	const mandatoryFields = ['mainObjectDefinitionERC', 'name'];

	// 	if (!Object.keys(localUIData).length) {
	// 		const errors = mandatoryFields.reduce(
	// 			(errors, field) => ({...errors, [field]: true}),
	// 			{}
	// 		);
	// 		setDisplayError(errors as DataError);

	// 		isDataValid = false;
	// 	} else {
	// 		mandatoryFields.forEach((field) => {
	// 			if (localUIData[field as keyof APISchemaUIData]) {
	// 				setDisplayError((previousErrors) => ({
	// 					...previousErrors,
	// 					[field]: false,
	// 				}));
	// 			} else {
	// 				setDisplayError((previousErrors) => ({
	// 					...previousErrors,
	// 					[field]: true,
	// 				}));
	// 				isDataValid = false;
	// 			}
	// 		});
	// 	}

	// 	return isDataValid;
	// }

	// const handleCreate = () => {
	// 	const isDataValid = validateData();

	// 	if (isDataValid) {
	// 		postData();
	// 	} else {
	// 		return;
	// 	}
	// };

	return (
		<>
			<ClayModal.Header>
				{Liferay.Language.get('edit-property')}
			</ClayModal.Header>

			<div className="modal-body">
				<ClayForm>
					<ClayForm.Group
						className={classNames({
							'has-error': displayError.name,
						})}
					>
						<label htmlFor="PropertyName">
							{Liferay.Language.get('name')}

							<span className="ml-1 reference-mark text-warning">
								<ClayIcon symbol="asterisk" />
							</span>
						</label>

						<ClayInput
							aria-invalid={displayError.name}
							aria-required="true"
							autoComplete="off"
							id="PropertyName"
							onChange={() => {}}
							onKeyPress={(event) =>
								event.key === 'Enter' && event.preventDefault()
							}
							placeholder={Liferay.Language.get('enter-name')}
							value={name}
						/>

						<div className="feedback-container">
							<ClayForm.FeedbackGroup>
								{displayError.name && (
									<ClayForm.FeedbackItem className="mt-2">
										<ClayForm.FeedbackIndicator symbol="exclamation-full" />

										<span id="inputNameErrorMessage">
											{Liferay.Language.get(
												'please-enter-a-schema-name'
											)}
										</span>
									</ClayForm.FeedbackItem>
								)}
							</ClayForm.FeedbackGroup>
						</div>
					</ClayForm.Group>

					<ClayForm.Group

					// className={classNames({
					// 	'has-error': displayError.description,
					// })}
					
					>
						<label
							htmlFor="properyDescriptionField"
							id="properyDescriptionField"
						>
							{Liferay.Language.get('description')}
						</label>

						<textarea
							aria-labelledby="properyDescriptionField"
							autoComplete="off"
							className="form-control"
							id="properyDescriptionField"
							onChange={() => {}}
							placeholder={Liferay.Language.get(
								'add-a-description-to-this-property'
							)}
							value={description}
						/>
					</ClayForm.Group>

					<ClayForm.Group
						className={classNames({
							'has-error': displayError.dataType,
						})}
					>
						<label htmlFor="selectTrigger">
							{Liferay.Language.get('data-type')}

							<span className="ml-1 reference-mark text-warning">
								<ClayIcon symbol="asterisk" />
							</span>
						</label>

						<Select
							cleanUp={() => {}}
							disabled
							onClick={() => {}}
							options={[
								{label: businessType!, value: businessType!},
							]}
							placeholder={Liferay.Language.get(
								'select-a-data-type'
							)}
							required
							selectedOption={{
								label: businessType!,
								value: businessType!,
							}}
						/>

						<div className="feedback-container">
							<ClayForm.FeedbackGroup>
								{displayError.dataType && (
									<ClayForm.FeedbackItem className="mt-2">
										<ClayForm.FeedbackIndicator symbol="exclamation-full" />

										<span id="selectObjectErrorMessage">
											{Liferay.Language.get(
												'please-select-a-data-type'
											)}
										</span>
									</ClayForm.FeedbackItem>
								)}
							</ClayForm.FeedbackGroup>
						</div>
					</ClayForm.Group>

					<ClayForm.Group
						className={classNames({
							'has-error': displayError.mappedProperty,
						})}
					>
						<label htmlFor="selectTrigger">
							{Liferay.Language.get('mapped-property')}

							<span className="ml-1 reference-mark text-warning">
								<ClayIcon symbol="asterisk" />
							</span>
						</label>

						<Select
							cleanUp={() => {}}
							disabled
							onClick={() => {}}
							options={[
								{
									label: objectFieldName!,
									value: objectFieldName!,
								},
							]}
							placeholder={Liferay.Language.get(
								'select-a-mapperd-property'
							)}
							required
							selectedOption={{
								label: objectFieldName!,
								value: objectFieldName!,
							}}
						/>

						<div className="feedback-container">
							<ClayForm.FeedbackGroup>
								{displayError.mappedProperty && (
									<ClayForm.FeedbackItem className="mt-2">
										<ClayForm.FeedbackIndicator symbol="exclamation-full" />

										<span id="selectObjectErrorMessage">
											{Liferay.Language.get(
												'please-select-a-property'
											)}
										</span>
									</ClayForm.FeedbackItem>
								)}
							</ClayForm.FeedbackGroup>
						</div>
					</ClayForm.Group>

					<div aria-live="assertive" className="sr-only">
						{(displayError.name || displayError.dataType) && (
							<span>
								{Liferay.Language.get(
									'there-are-errors-on-the-form-please-check-if-any-mandatory-fields-have-not-been-completed'
								)}
							</span>
						)}
					</div>
				</ClayForm>
			</div>

			<ClayModal.Footer
				last={
					<ClayButton.Group spaced>
						<ClayButton
							displayType="secondary"
							id="modalCancelButton"
							onClick={closeModal}
							type="button"
						>
							{Liferay.Language.get('cancel')}
						</ClayButton>

						<ClayButton
							displayType="primary"
							id="modalCreateButton"
							onClick={() => {}}
							type="button"
						>
							{Liferay.Language.get('create')}
						</ClayButton>
					</ClayButton.Group>
				}
			/>
		</>
	);
}
