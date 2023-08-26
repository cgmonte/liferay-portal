/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {ClayButtonWithIcon} from '@clayui/button';
import {ClayInput} from '@clayui/form';
import React from 'react';

export default function SidebarHeader() {
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
		</div>
	);
}
