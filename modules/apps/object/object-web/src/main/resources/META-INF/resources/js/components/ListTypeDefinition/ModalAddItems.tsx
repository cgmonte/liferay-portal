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
import ClayModal, {useModal} from '@clayui/modal';
import {
	API,
	Input,
	InputLocalized,
	invalidateRequired,
} from '@liferay/object-js-components-web';
import React, {useEffect, useState} from 'react';

import {toCamelCase} from '../../utils/string';
import {ObjectValidationErrors} from './ListTypeFormBase';
import {fixLocaleKeys} from './utils';

import './ModalAddItems.scss';

const REQUIRED_MSG = Liferay.Language.get('required');
interface IModalState extends Partial<ListTypeEntry> {
	header?: string;
	id?: number;
	itemKey?: string;
	modalType?: 'add' | 'edit';
	setValues?: (values: Partial<ListTypeDefinition>) => void;
	values?: Partial<ListTypeDefinition>;
}

function ModalAddItems() {
	const defaultLanguageId = Liferay.ThemeDisplay.getDefaultLanguageId();

	const [
		{header, id, itemKey, modalType, name_i18n, setValues, values},
		setState,
	] = useState<IModalState>({});

	// console.log('name_i18n:', name_i18n);

	const [keyChanged, setKeyChanged] = useState(false);

	const handleKeyChange = (value: string) => {
		if (keyChanged === false) {
			setKeyChanged(true);
		}
		setState((previousValues) => ({
			...previousValues,
			itemKey: value,
		}));
	};

	const handleNameChange = (name_i18n: LocalizedValue<string>) => {
		if (modalType !== 'edit' && keyChanged === false) {
			setState((previousValues) => ({
				...previousValues,
				itemKey: name_i18n[defaultLanguageId],
				name_i18n: {...name_i18n},
			}));
		} else {
			setState((previousValues) => ({
				...previousValues,
				name_i18n: {...name_i18n},
			}));
		}
	};

	const [errors, setErrors] = useState<{name?: string; name_i18n?: string}>({
		name: '',
		name_i18n: '',
	});

	const resetModal = () => {
		setState({});
		setErrors({});
		setKeyChanged(false);
	};

	const {observer} = useModal({
		onClose: resetModal,
	});

	useEffect(() => {
		const openModal = ({...otherProps}: Partial<IModalState>) => {
			setState({...otherProps});
		};

		Liferay.on('openModalAddItems', openModal);

		return () =>
			Liferay.detach('openModalAddItems', openModal as () => void);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const validate = (
		entry: Partial<ListTypeEntry>
	): ObjectValidationErrors => {
		const errors: ObjectValidationErrors = {};
		const name_i18n = entry.name_i18n?.[defaultLanguageId];
		const key = entry.key;

		if (invalidateRequired(name_i18n)) {
			errors.name_i18n = REQUIRED_MSG;
		}

		if (invalidateRequired(key)) {
			errors.name = REQUIRED_MSG;
		}

		return errors;
	};

	const handleSave = () => {
		const errors: ObjectValidationErrors = validate({
			key: itemKey,
			name_i18n,
		});

		if (Object.keys(errors).length) {
			setErrors(errors);
		} else {
			setErrors({});
			let response;
			if (modalType === 'add') {
				response = API.addPickListItem({id, key: itemKey, name_i18n});
				response.then((response) => {
					setValues!({
						...values,
						listTypeEntries: [
							...values!.listTypeEntries!,
							response,
						].map((entry) => ({
							...entry,
							name_i18n: fixLocaleKeys(entry.name_i18n),
						})),
					});
				});
			} else if (modalType === 'edit') {
				response = API.updatePickListItems({id, name_i18n});
				response.then((response) => {
					{
						setValues!({
							...values,
							listTypeEntries: values!.listTypeEntries?.map(
								(entry) => {
									if (entry.id === response.id) {
										return {
											...response,
											name_i18n: fixLocaleKeys(
												response.name_i18n
											),
										};
									}

									return entry;
								}
							),
						});
					}
				});
			}

			resetModal();
		}
	};

	return header ? (
		<ClayModal
			className="lfr-object__object-view-modal-add-columns"
			observer={observer}
		>
			<ClayModal.Header>{header}</ClayModal.Header>

			<ClayModal.Body>
				<InputLocalized
					error={errors.name_i18n}
					label={Liferay.Language.get('name')}
					onChange={(name_i18n) => handleNameChange(name_i18n)}
					required
					translations={
						name_i18n
							? (name_i18n as LocalizedValue<string>)
							: {[defaultLanguageId]: ''}
					}
				/>

				<Input
					disabled={modalType === 'edit'}
					error={errors.name}
					label={Liferay.Language.get('key')}
					name="name"
					onChange={({target}) => handleKeyChange(target.value)}
					required
					value={itemKey ?? toCamelCase(itemKey ?? '')}
				/>
			</ClayModal.Body>

			<ClayModal.Footer
				last={
					<ClayButton.Group spaced>
						<ClayButton
							displayType="secondary"
							onClick={resetModal}
						>
							{Liferay.Language.get('cancel')}
						</ClayButton>

						<ClayButton displayType="primary" onClick={handleSave}>
							{Liferay.Language.get('save')}
						</ClayButton>
					</ClayButton.Group>
				}
			/>
		</ClayModal>
	) : null;
}

export default ModalAddItems;
