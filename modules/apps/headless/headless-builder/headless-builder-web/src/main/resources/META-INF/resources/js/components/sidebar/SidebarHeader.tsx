/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {ClayButtonWithIcon} from '@clayui/button';
import {ClayInput} from '@clayui/form';
import ClayIcon from '@clayui/icon';
import {ClayResultsBar} from '@clayui/management-toolbar';
import {sub} from 'frontend-js-web';
import React from 'react';

interface SidebarHeaderProps {
	objectDefinition: ObjectDefinition;
}

export default function SidebarHeader({objectDefinition}: SidebarHeaderProps) {
	return (
		<div className="sidebar-header">
			<span className="sidebar-header-title">
				{Liferay.Language.get('properties')}
			</span>

			<div className="card-divider"></div>

			<div className="search-container">
				<ClayInput.Group>
					<ClayInput.GroupItem>
						<ClayInput
							aria-label="Search"
							className="form-control input-group-inset input-group-inset-after"
							placeholder={Liferay.Language.get('search')}
							type="text"
						/>

						<ClayInput.GroupInsetItem after tag="span">
							<ClayButtonWithIcon
								aria-label="Search"
								displayType="unstyled"
								symbol="search"
							/>
						</ClayInput.GroupInsetItem>
					</ClayInput.GroupItem>
				</ClayInput.Group>
			</div>

			<div className="card-divider"></div>

			<div className="related-objects-results-bar-container">
				<ClayResultsBar>
					<ClayResultsBar.Item className="results-angle-left">
						<ClayIcon symbol="angle-left" />
					</ClayResultsBar.Item>

					<ClayResultsBar.Item className="results-info">
						<span className="component-text text-truncate">
							{/* <span
								className="text-truncate"
								dangerouslySetInnerHTML={{
									__html: sub(
										Liferay.Language.get('x-results-for-x'),
										objectDefinition.objectRelationships
											.length,
										`<strong id="resultObjectLabel">"${objectDefinition
											.label[
											Liferay.ThemeDisplay.getDefaultLanguageId()
										]!}"</strong>`
									),
								}}
							/> */}

							{sub(
								Liferay.Language.get('x-related-objects-for-x'),
								objectDefinition.objectRelationships.length,
								`"${objectDefinition.label[
									Liferay.ThemeDisplay.getDefaultLanguageId()
								]!}"`
							)}
						</span>
					</ClayResultsBar.Item>

					<ClayResultsBar.Item className="results-close-button">
						<ClayButtonWithIcon
							aria-label="Search"
							displayType="unstyled"
							symbol="times-circle"
						/>
					</ClayResultsBar.Item>
				</ClayResultsBar>
			</div>
		</div>
	);
}
