/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

/// <reference types="react" />

interface BaseAPISchemaProperty {
	objectField: ObjectField;
}
export default function BaseAPISchemaProperty({
	objectField,
}: BaseAPISchemaProperty): JSX.Element;
export {};
