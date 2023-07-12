/**
 * Copyright (c) 2000-present Liferay, Inc. All rights reserved.
 *
 * This library is free software; you can redistribute it and/or modify it under
 * the terms of the GNU Lesser General Public License as published by the Free
 * Software Foundation; either version 2.1 of the License, or (at your option)
 * any later version.
 r*
 * This library is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU Lesser General Public License for more
 * details.
 */

import ClayButton from '@clayui/button';
import {TreeView} from '@clayui/core';
import Icon from '@clayui/icon';
import React, {useEffect, useState} from 'react';

interface TYPES_TO_SYMBOLS {
	document: 'document-text';
	pdf: 'document-pdf';
	success: 'check-circle-full';
	warning: 'warning-full';
}

interface TYPES_TO_COLORS {
	document: 'text-primary';
	pdf: 'text-danger';
	success: 'text-success';
	warning: 'text-warning';
}

const items = [
	{
		children: [
			{
				children: [
					{
						children: [{name: 'Research 1'}],
						name: 'Research',
					},
					{
						children: [{name: 'News 1'}],
						name: 'News',
					},
				],
				name: 'Blogs',
			},
			{
				children: [
					{
						children: [
							{
								name: 'Instructions.pdf',
								status: 'success',
								type: 'pdf',
							},
						],
						name: 'PDF',
					},
					{
						children: [
							{
								name: 'Treeview review.docx',
								status: 'success',
								type: 'document',
							},
							{
								name: 'Heuristics Evaluation.docx',
								status: 'success',
								type: 'document',
							},
						],
						name: 'Word',
					},
				],
				name: 'Documents and Media',
			},
		],
		name: 'Liferay Drive',
		type: 'cloud',
	},
	{
		children: [{name: 'Blogs'}, {name: 'Documents and Media'}],
		name: 'Repositories',
		type: 'repository',
	},
	{
		children: [{name: 'PDF'}, {name: 'Word'}],
		name: 'Documents and Media',
		status: 'warning',
	},
];

function Example(handleItem: any, items: any) {
	console.log('items', items);

	const TYPES_TO_SYMBOLS = {
		document: 'document-text',
		pdf: 'document-pdf',
		success: 'check-circle-full',
		warning: 'warning-full',
	};

	const TYPES_TO_COLORS = {
		document: 'text-primary',
		pdf: 'text-danger',
		success: 'text-success',
		warning: 'text-warning',
	};

	return (
		<TreeView dragAndDrop items={items} nestedKey="children">
			{(item: any) => (
				<TreeView.Item
					actions={
						<ClayButton
							displayType={null}
							monospaced
							onClick={(event) => {
								handleItem(event, item);
							}}
						>
							<Icon symbol="times" />
						</ClayButton>
					}
				>
					<TreeView.ItemStack>
						<Icon symbol={item.type ? item.type : 'folder'} />

						{item.name}
					</TreeView.ItemStack>

					<TreeView.Group items={item.children}>
						{({name, status, type}: any) => (
							<TreeView.Item>
								{type && (
									<Icon
										className={
											TYPES_TO_COLORS[
												type as keyof TYPES_TO_COLORS
											]
										}
										symbol={
											TYPES_TO_SYMBOLS[
												type as keyof TYPES_TO_SYMBOLS
											]
										}
									/>
								)}

								{name}

								{status && (
									<Icon
										className={
											TYPES_TO_COLORS[
												status as keyof TYPES_TO_COLORS
											]
										}
										symbol={
											TYPES_TO_SYMBOLS[
												status as keyof TYPES_TO_SYMBOLS
											]
										}
									/>
								)}
							</TreeView.Item>
						)}
					</TreeView.Group>
				</TreeView.Item>
			)}
		</TreeView>
	);
}

export default function ThreeViewSpike() {
	const [tvitems, setTvitems] = useState(items);
	const handleItem = (event: any, item: any) => {
		setTvitems((prev) =>
			prev.filter((arrayItem) => arrayItem.name !== item.name)
		);
	};

	return Example(handleItem, tvitems);
}
