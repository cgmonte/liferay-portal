/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import classNames from 'classnames';

const statusBarClassNames = {
	blocked: 'blocked',
	complete: 'completed',
	didnotrun: 'didnotrun',
	failed: 'failed',
	inanalysis: 'in-analysis',
	incomplete: 'light',
	inprogress: 'inprogress',
	open: 'open',
	other: 'primary',
	passed: 'passed',
	scheduled: 'untested',
	self: 'info',
	testfix: 'test-fix',
	untested: 'untested',
};

export type StatusBadgeType = keyof typeof statusBarClassNames;

export type StatusBadgeProps = {
	children: React.ReactNode;
	type: StatusBadgeType;
};

const StatusBadge: React.FC<
	{children?: React.ReactNode | undefined} & StatusBadgeProps
> = ({children, type}) => (
	<span
		className={classNames(
			'label label-chart text-uppercase text-nowrap',
			(statusBarClassNames as any)[type?.toLowerCase()] ||
				type?.toLowerCase().replace(' ', '-')
		)}
	>
		{children}
	</span>
);

export default StatusBadge;
