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

import ClayForm, {ClayInput} from '@clayui/form';
import ClayIcon from '@clayui/icon';
import classNames from 'classnames';
import React, {Dispatch, SetStateAction, useEffect, useState} from 'react';

import {Select} from '../fieldComponents/Select';
import {getItems} from '../utils/fetchUtil';

type DataError = {
	baseURL: boolean;
	title: boolean;
};

interface BaseAPIApplicationFieldsProps {
	data: Partial<APIApplicationItem>;
	displayError: DataError;
	setData: Dispatch<SetStateAction<Partial<APIApplicationSchemaItem>>>;
}

export default function BaseAPISchemaFields({
	data,
	displayError,
	setData,
}: BaseAPIApplicationFieldsProps) {
	const [objectDefinitions, setObjectDefinitions] = useState<
		ObjectDefinition[] | undefined
	>();

	useEffect(() => {
		getItems<ObjectDefinition>({
			url: '/o/object-admin/v1.0/object-definitions',
		}).then((result) => {
			setObjectDefinitions(result);
		});
	}, []);

	const handleSelectObject = (value: string) => {
		setData((previousValue) => ({
			...previousValue,
			mainObjectDefinitionERC: value,
		}));
	};

	return (
		<>
			<ClayForm.Group
				className={classNames({
					'has-error': displayError.title,
				})}
			>
				<label>
					{Liferay.Language.get('name')}

					<span className="ml-1 reference-mark text-warning">
						<ClayIcon symbol="asterisk" />
					</span>
				</label>

				<ClayInput
					onChange={({target: {value}}) =>
						setData((previousData) => ({
							...previousData,
							title: value,
						}))
					}
					placeholder={Liferay.Language.get('enter-name')}
					value={data.title}
				/>

				<div className="feedback-container">
					<ClayForm.FeedbackGroup>
						{displayError.title && (
							<ClayForm.FeedbackItem className="mt-2">
								<ClayForm.FeedbackIndicator symbol="exclamation-full" />

								{Liferay.Language.get(
									'please-enter-a-schema-name'
								)}
							</ClayForm.FeedbackItem>
						)}
					</ClayForm.FeedbackGroup>
				</div>
			</ClayForm.Group>

			<ClayForm.Group>
				<label>{Liferay.Language.get('description')}</label>

				<textarea
					className="form-control"
					onChange={({target: {value}}) =>
						setData((previousData) => ({
							...previousData,
							description: value,
						}))
					}
					placeholder={Liferay.Language.get(
						'add-a-short-description-that-describes-this-schema'
					)}
					value={data.description}
				/>
			</ClayForm.Group>

			<ClayForm.Group>
				<label>{Liferay.Language.get('object')}</label>

				<Select
					onClick={handleSelectObject}
					options={
						objectDefinitions
							? objectDefinitions.map((objectDefinition) => ({
									label: objectDefinition.name,
									value:
										objectDefinition.externalReferenceCode,
							  }))
							: []
					}
				/>
			</ClayForm.Group>
		</>
	);
}
