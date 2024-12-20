import { LocalizedValue } from "types";

/**
 * SPDX-FileCopyrightText: (c) 2024 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */
export type AvailableLocale = {
	displayName: string;
	icon: string;
	isDefault?: boolean;
	isTranslated?: boolean;
	localeId: Liferay.Language.Locale;
};

export interface EditingLocale {
	displayName: string;
	icon: string;
	isDefault?: boolean;
	isTranslated?: boolean;
	localeId: Liferay.Language.Locale;
}

export function normalizeAvailableLocales(
	availableLocales: EditingLocale[], 
	defaultLocale: EditingLocale, 
	value: LocalizedValue<unknown>) {
		return availableLocales.map(
			(locale) => ({
				...locale,
				isDefault: locale.localeId === defaultLocale.localeId,
				isTranslated: Object.hasOwn(value, locale.localeId),
			})
		) as AvailableLocale[];
}
