/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {toPng} from 'html-to-image';
import jsPDF from 'jspdf';

function cropImageToBoundingBox(dataURL: any) {
	return new Promise((resolve, reject) => {
		const image = new Image();

		image.src = dataURL;

		image.onload = function () {
			const canvas = document.createElement('canvas');
			const context = canvas.getContext('2d');

			canvas.width = image.width;
			canvas.height = image.height;

			context!.drawImage(image, 0, 0);

			const imageData = context!.getImageData(
				0,
				0,
				canvas.width,
				canvas.height
			);
			const data = imageData.data;

			let minX = canvas.width;
			let minY = canvas.height;
			let maxX = -1;
			let maxY = -1;

			for (let y = 0; y < canvas.height; y++) {
				for (let x = 0; x < canvas.width; x++) {
					const alpha = data[(y * canvas.width + x) * 4 + 3];
					if (alpha > 0) {
						minX = Math.min(minX, x);
						minY = Math.min(minY, y);
						maxX = Math.max(maxX, x);
						maxY = Math.max(maxY, y);
					}
				}
			}

			const croppedWidth = maxX - minX + 1;
			const croppedHeight = maxY - minY + 1;

			const croppedCanvas = document.createElement('canvas');
			const croppedContext = croppedCanvas.getContext('2d');
			croppedCanvas.width = croppedWidth;
			croppedCanvas.height = croppedHeight;

			croppedContext!.drawImage(
				image,
				minX,
				minY,
				croppedWidth,
				croppedHeight,
				0,
				0,
				croppedWidth,
				croppedHeight
			);

			const croppedDataURL = croppedCanvas.toDataURL('image/png');

			resolve({croppedHeight, croppedWidth, dataURL: croppedDataURL});
		};

		image.onerror = function () {
			reject(new Error('Failed to load the image.'));
		};
	});
}

function getBlobFromDataURL(dataURL: string) {
	const byteString = atob(dataURL.split(',')[1]);
	const mimeString = dataURL.split(',')[0].split(':')[1].split(';')[0];

	const arrayBuffer = new ArrayBuffer(byteString.length);
	const uint8Array = new Uint8Array(arrayBuffer);

	for (let i = 0; i < byteString.length; i++) {
		uint8Array[i] = byteString.charCodeAt(i);
	}

	return new Blob([arrayBuffer], {type: mimeString});
}

export function getInvertScale(scaledElement: HTMLElement) {
	if (scaledElement) {
		const styleValue = scaledElement.getAttribute('style');

		if (styleValue) {
			const scaleRegex = /scale\(([^)]+)\)/;

			const match = styleValue.match(scaleRegex);

			if (match) {
				return 1 / parseFloat(match[1]);
			}
		}
	}

	return 1;
}

export function getPDF({
	htmlElement,
	invertScale,
	title,
}: {
	htmlElement: HTMLElement;
	invertScale?: number;
	title?: string;
}): Promise<jsPDF> {
	return new Promise((resolve, _) => {
		toPng(htmlElement, {
			canvasHeight: invertScale
				? htmlElement.offsetHeight * invertScale
				: htmlElement.offsetWidth,
			canvasWidth: invertScale
				? htmlElement.offsetWidth * invertScale
				: htmlElement.offsetWidth,
		})
			.then((dataURL) => {
				cropImageToBoundingBox(dataURL)
					.then(({croppedHeight, croppedWidth, dataURL}: any) => {
						const imageBlob = getBlobFromDataURL(dataURL);

						const finalPDFWidth = croppedWidth + 80;

						const finalPDFHeight = croppedHeight + 160;

						const pdfFile = new jsPDF({
							compress: true,
							format: [finalPDFWidth, finalPDFHeight],
							hotfixes: ['px_scaling'],
							orientation:
								finalPDFWidth > finalPDFHeight
									? 'landscape'
									: 'portrait',
							putOnlyUsedFonts: true,
							unit: 'px',
						});

						const containerElement = document.createElement('div');

						containerElement.style.width = finalPDFWidth + 'px';
						containerElement.style.height =
							finalPDFHeight - 1 + 'px';
						containerElement.style.padding = '40px';
						containerElement.style.display = 'flex';
						containerElement.style.justifyContent = 'end';
						containerElement.style.flexDirection = 'column';

						if (title) {
							pdfFile.setFont('helvetica', 'bold');
							pdfFile.setFontSize(15);
							pdfFile.text(title, 40, 60);
						}

						const imageElement = document.createElement('img');

						imageElement.setAttribute(
							'src',
							URL.createObjectURL(imageBlob)
						);

						containerElement.appendChild(imageElement);

						pdfFile.html(containerElement, {
							callback(pdf) {
								resolve(pdf);
							},
						});
					})
					.catch((error) => {
						console.error(error);
					});
			})
			.catch((error) => {
				console.error(error);
			});
	});
}
