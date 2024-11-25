/**
 * SPDX-FileCopyrightText: (c) 2024 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

/**
 * Compares the scopes of two object definitions.
 *
 * If the second object definition or its scope is missing, it compares the first
 * definition with the `fallbackObjectDefinition` instead.
 *
 * @param objectDefinition1 - The first object definition to compare.
 * @param objectDefinition2 - The second object definition to compare.
 * @param fallbackObjectDefinition - The fallback object definition.
 *
 * @returns {boolean} `true` if both object definitions have non-null,
 * identical scopes; otherwise, returns `false`.
 */

export function compareObjectDefinitionsScope(
	objectDefinition1?: Partial<ObjectDefinition>,
	objectDefinition2?: Partial<ObjectDefinition>,
	fallbackObjectDefinition?: Partial<ObjectDefinition>
): boolean {
	const firstObjectScope = objectDefinition1?.scope;
	const secondObjectScope = objectDefinition2?.scope;
	const currentObjectScope = fallbackObjectDefinition?.scope;

	if (firstObjectScope && (secondObjectScope || currentObjectScope)) {
		return firstObjectScope === (secondObjectScope ?? currentObjectScope);
	}

	return false;
}
