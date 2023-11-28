/**
 * SPDX-FileCopyrightText: (c) 2023 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.liferay.journal.configuration;

import aQute.bnd.annotation.metatype.Meta;

import com.liferay.portal.configuration.metatype.annotations.ExtendedObjectClassDefinition;

import org.osgi.annotation.versioning.ProviderType;

/**
 * @author Pedro Tavares
 */
@ExtendedObjectClassDefinition(
	category = "web-content",
	scope = ExtendedObjectClassDefinition.Scope.COMPANY
)
@Meta.OCD(
	id = "com.liferay.journal.configuration.JournalStructureConfiguration",
	localization = "content/Language",
	name = "web-content-structures-configuration-name"
)
@ProviderType
public interface JournalStructureConfiguration {

	@Meta.AD(
		deflt = "false",
		name = "display-field-name-in-structures-ui-and-allow-users-to-edit-it",
		required = false
	)
	public boolean displayFieldName();

}