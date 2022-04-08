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

import ClayButton from '@clayui/button';
import ClayForm from '@clayui/form';
import ClayModal, { ClayModalProvider, useModal } from '@clayui/modal';
import { fetch } from 'frontend-js-web';
import React, { FormEvent, useEffect, useState } from 'react';

import { toCamelCase } from '../utils/string';
import CustomSelect from './Form/CustomSelect/CustomSelect';
import Input from './Form/Input';

const defaultLanguageId = Liferay.ThemeDisplay.getDefaultLanguageId() as Liferay.Language.Locale;
const requiredLabel = Liferay.Language.get('required');
const objectValidationTypes = [{ label: 'Groovy', validationType: 'groovy' }];
const headers = new Headers({
	'Accept': 'application/json',
	'Content-Type': 'application/json',
});

function ModalAddObjectValidation({
	apiURL,
	// objectValidationTypes,
	observer,
	onClose,
}: IModal) {
	console.log('apiURL', apiURL);
	console.log('objectValidationTypes', objectValidationTypes);

	const [typeValue, setTypeValue] = useState<ObjectValidationType>({
		label: '',
		validationType: '',
	});
	const [labelValue, setLabelValue] = useState<IObjectValidationLabel>({
		[defaultLanguageId]: '',
	});
	const [errors, setErrors] = useState<IObjectValidationErrors>({
		labelError: '',
		typeError: '',
	});
	const [showError, setShowError] = useState<boolean>(false);

	useEffect(() => {
		setErrors((currentErrors) => {
			const updatedErrors = { ...currentErrors };
			updatedErrors.labelError =
				labelValue[defaultLanguageId] === '' ? requiredLabel : '';
			updatedErrors.typeError =
				typeValue.label === '' ? requiredLabel : '';

			return updatedErrors;
		});
	}, [labelValue, typeValue])

	const handleSubmit = async (event: FormEvent) => {
		event.preventDefault();
		if (Object.values(errors).some((error) => error !== '')) {
			setShowError(true)
		} else {
			setShowError(false)
			const response = await fetch(apiURL, {
				body: JSON.stringify({
					active: false,
					engine: typeValue.validationType,
					name: {
						[defaultLanguageId]: labelValue[defaultLanguageId]
					},
					objectDefinitionId: 42724,
					script: '',
				}),
				headers,
				method: 'POST',
			});

			if (response.status === 401) {
				window.location.reload();
			}
			else if (response.ok) {
				console.log('response', response)
				onClose();

				window.location.reload();
			}

			// else {
			// 	const {type} = (await response.json()) as any;
			// 	const errorMessage =
			// 		ERRORS[type] ?? Liferay.Language.get('an-error-occurred');

			// 	setError(errorMessage);
			// }
		}
	};

	const handleTypeChange = (option: ObjectValidationType) => {
		setTypeValue({
			label: option.label,
			validationType: option.validationType,
		});
	};

	const handleLabelChange = (label: IObjectValidationLabel) => {
		setLabelValue(label);
	};



	return (
		<ClayModal observer={observer}>
			<ClayForm onSubmit={handleSubmit}>
				<ClayModal.Header>
					{Liferay.Language.get('new-validation')}
				</ClayModal.Header>

				<ClayModal.Body>
					<Input
						autoComplete="off"
						error={showError && errors.labelError !== '' ? errors.labelError : ''}
						id="objectFieldLabel"
						label={Liferay.Language.get('label')}
						name="label"
						onChange={({ target: { value } }) => {
							handleLabelChange({ [defaultLanguageId]: value });
						}}
						required
						value={labelValue[defaultLanguageId]}
					/>

					<CustomSelect<ObjectValidationType>
						error={showError && errors.typeError !== '' ? errors.typeError : ''}
						label={Liferay.Language.get('type')}
						onChange={handleTypeChange}
						options={objectValidationTypes}
						required
						value={typeValue.label}
					/>
				</ClayModal.Body>

				<ClayModal.Footer
					last={
						<ClayButton.Group spaced>
							<ClayButton
								displayType="secondary"
								onClick={() => onClose()}
							>
								{Liferay.Language.get('cancel')}
							</ClayButton>

							<ClayButton type="submit">
								{Liferay.Language.get('save')}
							</ClayButton>
						</ClayButton.Group>
					}
				/>
			</ClayForm>
		</ClayModal>
	);
}

export default function ModalWithProvider({
	apiURL,
	objectValidationTypes,
}: IProps) {
	const [isVisible, setVisibility] = useState<boolean>(false);
	const { observer, onClose } = useModal({ onClose: () => setVisibility(false) });

	useEffect(() => {
		Liferay.on('addObjectValidation', () => setVisibility(true));

		return () => Liferay.detach('addObjectValidation');

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<ClayModalProvider>
			{isVisible && (
				<ModalAddObjectValidation
					apiURL={apiURL}
					objectValidationTypes={objectValidationTypes}
					observer={observer}
					onClose={onClose}
				/>
			)}
		</ClayModalProvider>
	);
}

type ObjectValidationType = {
	label: string;
	validationType: string;
};

interface IModal extends IProps {
	observer: any;
	onClose: () => void;
}

interface IProps {
	apiURL: string;
	objectValidationTypes: ObjectValidationType[];
}

interface IObjectValidationLabel {
	[key: string]: string;
}

interface IObjectValidationErrors {
	labelError: string;
	typeError: string;
}
