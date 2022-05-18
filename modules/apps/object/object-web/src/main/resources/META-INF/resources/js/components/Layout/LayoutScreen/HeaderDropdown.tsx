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

import {ClayButtonWithIcon} from '@clayui/button';
import ClayDropDown from '@clayui/drop-down';
import {useFeatureFlag} from 'data-engine-js-components-web';
import React, {FC, MouseEventHandler, useContext, useState} from 'react';

import LayoutContext from '../context';

const HeaderDropdown: FC<IHeaderDropdown> = ({
	addCategorization,
	deleteElement,
}) => {
	const flags = useFeatureFlag();

	const [active, setActive] = useState<boolean>(false);
	const [
		{
			isViewOnly,
			objectLayout: {objectLayoutTabs},
		},
	] = useContext(LayoutContext);
	const isThereFramework = (framework: string): boolean => {
		for (const tab of objectLayoutTabs) {
			if (
				tab.objectLayoutBoxes.some((box) => box.boxType === framework)
			) {
				return true;
			}
		}

		return false;
	};

	return (
		<ClayDropDown
			active={active}
			onActiveChange={setActive}
			trigger={
				<ClayButtonWithIcon
					displayType="unstyled"
					symbol="ellipsis-v"
				/>
			}
		>
			<ClayDropDown.ItemList>
				<ClayDropDown.Item
					disabled={isViewOnly}
					onClick={deleteElement}
				>
					{Liferay.Language.get('delete')}
				</ClayDropDown.Item>

				{flags['LPS-149014'] && addCategorization && (
					<ClayDropDown.Item
						disabled={isThereFramework('categorization')}
						disabled={isViewOnly}
						onClick={addCategorization}
					>
						{Liferay.Language.get('add-categorization')}
					</ClayDropDown.Item>
				)}
			</ClayDropDown.ItemList>
		</ClayDropDown>
	);
};

interface IHeaderDropdown {
	addCategorization?: MouseEventHandler;
	deleteElement: MouseEventHandler;
}

export default HeaderDropdown;
