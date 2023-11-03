/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import jsPDF from 'jspdf';
export declare function getInvertScale(scaledElement: HTMLElement): number;
export declare function getPDF({
	htmlElement,
	invertScale,
	title,
}: {
	htmlElement: HTMLElement;
	invertScale?: number;
	title?: string;
}): Promise<jsPDF>;
