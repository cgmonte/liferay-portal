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

export function fixLocaleKeys(name_i18n: LocalizedValue<string>) {
	const newTranslationsObject: {[key: string]: string} = {};

	for (const [key, value] of Object.entries(name_i18n)) {
		newTranslationsObject[key.replace('-', '_')] = value;
	}

	return newTranslationsObject;
}

export function getPickListSideBarIFrame(pickListId: number | undefined) {
	if (pickListId) {
		const iframes = document.getElementsByTagName('iframe');
		if (iframes?.length) {
			const sideBarIFrame = [...iframes].find((iframe) => {
				if (iframe.src?.includes(Liferay.ThemeDisplay.getLayoutURL())) {
					const iframeURL = new URL(iframe.src);
					const iframeURLParams = new URLSearchParams(
						iframeURL.search
					);
					const listTypeDefinitionId = iframeURLParams.get(
						'_' +
							iframeURLParams.get('p_p_id') +
							'_listTypeDefinitionId'
					);
					if (
						listTypeDefinitionId &&
						parseInt(listTypeDefinitionId, 10) === pickListId
					) {
						return true;
					}
				}

				return false;
			});

			return sideBarIFrame;
		}
	}
	else {
		return null;
	}
}
