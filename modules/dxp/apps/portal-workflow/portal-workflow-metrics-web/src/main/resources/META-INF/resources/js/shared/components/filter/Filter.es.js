/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayButton from '@clayui/button';
import ClayDropDown, {Align} from '@clayui/drop-down';
import ClayIcon from '@clayui/icon';
import React, {useCallback, useEffect, useState} from 'react';

import {useFilter} from '../../hooks/useFilter.es';
import {useRouter} from '../../hooks/useRouter.es';
import {FilterItem} from './FilterItem.es';
import {FilterSearch} from './FilterSearch.es';
import {
	getCapitalizedFilterKey,
	getSelectedItemsQuery,
	replaceHistory,
} from './util/filterUtil.es';

const Filter = ({
	children,
	childrenVisibility,
	defaultItem,
	disabled,
	elementClasses,
	filterKey,
	hideControl = false,
	items,
	labelPropertyName = 'name',
	multiple = true,
	name,
	onClickFilter,
	prefixKey = '',
	show = true,
	withoutRouteParams,
}) => {
	const {dispatchFilter} = useFilter({withoutRouteParams});
	const [expanded, setExpanded] = useState(false);
	const [filteredItems, setFilteredItems] = useState([]);
	const [searchTerm, setSearchTerm] = useState('');
	const [changed, setChanged] = useState(false);

	const prefixedFilterKey = getCapitalizedFilterKey(prefixKey, filterKey);
	const routerProps = useRouter();

	const getSelectedItems = useCallback((items) => items.filter((item) => item.active), []);

	const applyFilterChanges = useCallback(() => {
		if (!withoutRouteParams) {
			const query = getSelectedItemsQuery(
				items,
				prefixedFilterKey,
				routerProps.location.search
			);

			replaceHistory(query, routerProps);
		}
		else {
			dispatchFilter(prefixedFilterKey, getSelectedItems(items));
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [items, prefixedFilterKey, routerProps, withoutRouteParams, dispatchFilter, getSelectedItems]);

	const closeDropdown = useCallback(() => {
		setExpanded(false);
		setSearchTerm('');
	}, []);
	const onSelect = useCallback(
		(item) => {
			const updatedItems = items.map(currentItem => {
				if (currentItem.key === item.key) {
					return {...currentItem, active: !currentItem.active};
				}
				if (!multiple) {
					return {...currentItem, active: false};
				}
				return currentItem;
			});

			if (onClickFilter) {
				onClickFilter(updatedItems.find(item => item.active));
				closeDropdown();
			}
			else {
				if (!multiple) {
					applyFilterChanges();
					closeDropdown();
				}
				else {
					setChanged(true);
				}
			}
		},
		[items, multiple, onClickFilter, applyFilterChanges, closeDropdown]
	);

	const selectDefaultItem = useCallback(() => {
		if (defaultItem && !multiple) {
			const selectedItems = getSelectedItems(items);

			if (!selectedItems.length) {
				const index = items.findIndex(
					(item) => item.key === defaultItem.key
				);

				if (index !== -1) {
					const updatedItems = items.map((item, i) => ({
						...item,
						active: i === index
					}));

					if (!onClickFilter) {
						applyFilterChanges();
					}
					else {
						onClickFilter(updatedItems[index]);
					}
				}
			}
		}
	}, [defaultItem, multiple, items, getSelectedItems, onClickFilter, applyFilterChanges]);

	useEffect(() => {
		selectDefaultItem();
	}, [selectDefaultItem]);

	useEffect(() => {
		setFilteredItems(
			searchTerm
				? items.filter((item) =>
						item[labelPropertyName]
							.toLowerCase()
							.includes(searchTerm.toLowerCase())
					)
				: items
		);
	}, [items, labelPropertyName, searchTerm]);

	useEffect(() => {
		if (!expanded && multiple && changed) {
			setChanged(false);
			applyFilterChanges();
		}
		else if (!expanded && !multiple && childrenVisibility) {
			setExpanded(true);
		}
	}, [expanded, multiple, changed, childrenVisibility, applyFilterChanges]);

	return (
		show && (
			<ClayDropDown
				active={expanded}
				alignmentPosition={Align.BottomLeft}
				className={elementClasses}
				menuElementAttrs={{
					className:
						childrenVisibility && 'dropdown-menu-inline-table',
				}}
				onActiveChange={(newActive) => setExpanded(newActive)}
				trigger={
					<ClayButton
						className="filter-dropdown-button"
						disabled={disabled}
						displayType="secondary"
					>
						{name}

						<ClayIcon className="ml-1" symbol="caret-bottom" />
					</ClayButton>
				}
			>
				{childrenVisibility ? (
					children
				) : (
					<FilterSearch
						filteredItems={filteredItems}
						onChange={({target}) => {
							setSearchTerm(target.value);
						}}
						searchTerm={searchTerm}
						totalCount={items.length}
					>
						{filteredItems.map((item, index) => (
							<FilterItem
								{...item}
								hideControl={hideControl}
								key={index}
								labelPropertyName={labelPropertyName}
								multiple={multiple}
								onClick={() => onSelect(item)}
							/>
						))}
					</FilterSearch>
				)}
			</ClayDropDown>
		)
	);
};
export default Filter;
