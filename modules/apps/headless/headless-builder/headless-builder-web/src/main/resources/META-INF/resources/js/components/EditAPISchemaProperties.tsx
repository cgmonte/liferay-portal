/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayButton from '@clayui/button';
import {ClayInput} from '@clayui/form';
import ClayIcon from '@clayui/icon';
import ClayManagementToolbar, {
	ClayResultsBar,
} from '@clayui/management-toolbar';
import {sub} from 'frontend-js-web';
import React, {Dispatch, SetStateAction, useState} from 'react';

import PropertiesTreeView from './PropertiesTreeView';

import '../../css/main.scss';

interface EditAPISchemaPropertiesProps {
	currentSchemaProperties: TreeViewItemData[];
	setCurrentSchemaProperties: Dispatch<SetStateAction<TreeViewItemData[]>>;
}

interface SearchState {
	filteredSchemaProperties: TreeViewItemData[];
	searchKeyword: string;
}

export default function EditAPISchemaProperties({
	currentSchemaProperties,
	setCurrentSchemaProperties,
}: EditAPISchemaPropertiesProps) {
	const [searchState, setSearchState] = useState<SearchState>({
		filteredSchemaProperties: [],
		searchKeyword: '',
	});

	const clearSearch = () =>
		setSearchState({
			filteredSchemaProperties: [],
			searchKeyword: '',
		});

	const getFilteredSchemaProperties = (
		searchKeyword: string
	): TreeViewItemData[] => {
		return currentSchemaProperties.filter((property) =>
			property.name.toLowerCase().includes(searchKeyword.toLowerCase())
		);
	};

	const handleSearch = (searchKeyword: string) => {
		if (searchKeyword) {
			setSearchState({
				filteredSchemaProperties: getFilteredSchemaProperties(
					searchKeyword
				),
				searchKeyword,
			});
		} else {
			clearSearch();
		}
	};

	return (
		<>
			<div className="search-container">
				<ClayManagementToolbar>
					<ClayManagementToolbar.Search>
						<ClayInput.Group>
							<ClayInput.GroupItem>
								<ClayInput
									aria-label={Liferay.Language.get('search')}
									className="form-control input-group-inset input-group-inset-after"
									onChange={({target: {value}}) =>
										handleSearch(value)
									}
									placeholder={Liferay.Language.get('search')}
									type="text"
									value={searchState.searchKeyword}
								/>

								<ClayInput.GroupInsetItem
									after
									className="pr-3"
									tag="span"
								>
									<ClayIcon symbol="search" />
								</ClayInput.GroupInsetItem>
							</ClayInput.GroupItem>
						</ClayInput.Group>
					</ClayManagementToolbar.Search>
				</ClayManagementToolbar>

				{searchState.searchKeyword && (
					<ClayResultsBar>
						<ClayResultsBar.Item expand>
							<span className="component-text text-truncate-inline">
								<span className="text-truncate">
									{sub(
										Liferay.Language.get('x-result-for-x'),
										searchState.filteredSchemaProperties
											.length,
										searchState.searchKeyword
									)}
								</span>
							</span>
						</ClayResultsBar.Item>

						<ClayResultsBar.Item>
							<ClayButton
								className="component-link tbar-link"
								displayType="unstyled"
								onClick={clearSearch}
							>
								{Liferay.Language.get('clear-all')}
							</ClayButton>
						</ClayResultsBar.Item>
					</ClayResultsBar>
				)}
			</div>

			<PropertiesTreeView
				currentSchemaProperties={currentSchemaProperties}
				searchState={searchState}
				setCurrentSchemaProperties={setCurrentSchemaProperties}
			/>
		</>
	);
}
