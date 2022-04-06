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
import ClayModal, {ClayModalProvider, useModal} from '@clayui/modal';
import React, {FormEvent, useEffect, useState} from 'react';

import CustomSelect from './Form/CustomSelect/CustomSelect';
import Input from './Form/Input';

const defaultLanguageId = Liferay.ThemeDisplay.getDefaultLanguageId() as Liferay.Language.Locale;
const requiredLabel = Liferay.Language.get('required');

function ModalAddObjectValidation({
	objectValidationTypes,
	observer,
	onClose,
}: IModal) {
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

	const handleSubmit = (event: FormEvent) => {
		event.preventDefault();
		setErrors((currentErrors) => {
			const updatedErrors = {...currentErrors};
			updatedErrors.labelError =
				labelValue[defaultLanguageId] === '' ? requiredLabel : '';
			updatedErrors.typeError =
				typeValue.label === '' ? requiredLabel : '';

			return updatedErrors;
		});
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
						error={errors.labelError}
						id="objectFieldLabel"
						label={Liferay.Language.get('label')}
						name="label"
						onChange={({target: {value}}) => {
							handleLabelChange({[defaultLanguageId]: value});
						}}
						required
						value={labelValue[defaultLanguageId]}
					/>

					<CustomSelect<ObjectValidationType>
						error={errors.typeError}
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
	const {observer, onClose} = useModal({onClose: () => setVisibility(false)});

	useEffect(() => {
		objectValidationTypes.push({label: 'Groovy', validationType: 'groovy'});
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
