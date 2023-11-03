/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayButton from '@clayui/button';
import {ClayDropDownWithItems} from '@clayui/drop-down';
import ClayLabel from '@clayui/label';
import React from 'react';

import {BackgroundIcon} from '../BackgroundIcon';

import './ObjectDefinitionNodeHeader.scss';
import {DropDownItems} from '../types';

interface ObjectDefinitionNodeHeaderProps {
	dropDownItems: DropDownItems[];
	handleSelectObjectDefinitionNode: () => void;
	isLinkedObjectDefinition: boolean;
	objectDefinitionLabel: string;
	status: {
		code: number;
		label: string;
		label_i18n: string;
	};
	system: boolean;
}

export default function ObjectDefinitionNodeHeader({
	dropDownItems,
	handleSelectObjectDefinitionNode,
	isLinkedObjectDefinition,
	objectDefinitionLabel,
	status,
	system,
}: ObjectDefinitionNodeHeaderProps) {
	return (
		<>
			<div
				className="lfr-objects__model-builder-node-header-container"
				onClick={(event) => {
					event.stopPropagation();

					handleSelectObjectDefinitionNode();
				}}
			>
				<div className="lfr-objects__model-builder-node-header-label-container">
					<div className="lfr-objects__model-builder-node-header-label-title">
						{isLinkedObjectDefinition && (
							<div className="lfr-objects__model-builder-node-background-icon-container-link">
								<BackgroundIcon
									className="dark"
									symbol="link"
								/>
							</div>
						)}

						<span>{objectDefinitionLabel}</span>
					</div>

					<ClayDropDownWithItems
						className="lfr__object-web-view-object-definitions-actions"
						items={dropDownItems}
						trigger={
							<ClayButton
								aria-label={Liferay.Language.get(
									'show-actions'
								)}
								className="lfr__object-web-view-object-definitions-actions-button"
								displayType="secondary"
								onClick={(
									event: React.MouseEvent<HTMLElement>
								) => {
									event?.stopPropagation();
								}}
								size="xs"
							>
								<BackgroundIcon symbol="ellipsis-v" />
							</ClayButton>
						}
					/>
				</div>

				<div>
					<ClayLabel displayType={system ? 'info' : 'warning'}>
						{Liferay.Language.get(system ? 'system' : 'custom')}
					</ClayLabel>

					<ClayLabel
						displayType={
							status?.label === 'approved' ? 'success' : 'info'
						}
					>
						{Liferay.Language.get(
							status?.label === 'approved' ? 'approved' : 'draft'
						)}
					</ClayLabel>
				</div>
			</div>
		</>
	);
}
