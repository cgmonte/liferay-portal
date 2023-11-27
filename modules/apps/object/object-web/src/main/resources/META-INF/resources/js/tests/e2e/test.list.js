/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {test} from '@playwright/test';

import modelBuilderTests from './modelBuilder.spec';
import teardown from './teardown';

// test.describe('Objects tests', objectsTests);

test.describe('Model builder tests', modelBuilderTests);

test.afterAll(
	'Teardown: delete all custom Objects and their relationships',
	teardown
);
