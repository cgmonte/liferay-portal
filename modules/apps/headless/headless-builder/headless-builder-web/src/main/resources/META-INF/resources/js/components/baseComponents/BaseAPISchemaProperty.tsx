/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayButtonWithIcon from '@clayui/button';
import ClayIcon from '@clayui/icon';
import classNames from 'classnames';
import {sub} from 'frontend-js-web';
import React, {Dispatch, SetStateAction} from 'react';

import {BUSINESS_TYPES_TO_SYMBOLS} from '../utils/constants';

interface BaseAPISchemaProperty {
	added: boolean;
	objectDefinitionName: string;
	objectField: ObjectField;
	objectRelationshipName?: string;
	setCurrentSchemaProperties: Dispatch<SetStateAction<TreeViewItemData[]>>;
}

export default function BaseAPISchemaProperty({
	added,
	objectDefinitionName,
	objectField,
	objectRelationshipName,
	setCurrentSchemaProperties,
}: BaseAPISchemaProperty) {
	const localizedPropertyName = objectField.label[
		Liferay.ThemeDisplay.getDefaultLanguageId()
	]!;

	const handleClick = () => {
		setCurrentSchemaProperties((previous) => {
			previous.unshift({
				businessType: objectField.businessType,
				id: objectField.id,

				// item: objectField,

				name: localizedPropertyName,
				objectDefinitionName,
				type: 'treeViewItem',
				...(objectRelationshipName && {
					objectRelationshipNames: objectRelationshipName,
				}),
			});

			return [...previous];
		});
	};

	return (
		<div className="property-container">
			<div
				className={classNames({
					'disabled': added,
					'icon-container': true,
				})}
			>
				<ClayIcon
					symbol={BUSINESS_TYPES_TO_SYMBOLS[objectField.businessType]}
				/>
			</div>

			<div
				className={classNames({
					'disabled': added,
					'label-container': true,
					'text-truncate': true,
				})}
			>
				{objectField.label[Liferay.ThemeDisplay.getDefaultLanguageId()]}
			</div>

			{!added && (
				<ClayButtonWithIcon
					aria-label={sub(
						Liferay.Language.get('add-x-property'),
						localizedPropertyName
					)}
					className="icon-container plus-icon"
					displayType="unstyled"
					onClick={handleClick}
					size="sm"
				>
					<ClayIcon symbol="plus" />
				</ClayButtonWithIcon>
			)}
		</div>
	);
}
