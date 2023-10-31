/**
 * SPDX-FileCopyrightText: (c) 2023 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {toJpeg, toPng} from 'html-to-image';
import jsPDF from 'jspdf';
import React, {useEffect, useRef, useState} from 'react';
import {FlowElement, useStore, useZoomPanHelper} from 'react-flow-renderer';

import {defaultLanguageId} from '../../utils/constants';
import {KeyValuePair} from '../ObjectDetails/EditObjectDetails';
import {ModalAddObjectDefinition} from '../ViewObjectDefinitions/ModalAddObjectDefinition';
import {ModalEditObjectFolder} from '../ViewObjectDefinitions/ModalEditObjectFolder';
import {getUpdatedModelBuilderStructurePayload} from '../ViewObjectDefinitions/objectDefinitionUtil';
import Diagram from './Diagram/Diagram';
import EditObjectFolderHeader from './EditObjectFolderHeader/EditObjectFolderHeader';
import {ModalPublishObjectDefinitions} from './EditObjectFolderHeader/ModalPublishObjectDefinitions';
import LeftSidebar from './LeftSidebar/LeftSidebar';
import {useObjectFolderContext} from './ModelBuilderContext/objectFolderContext';
import {TYPES} from './ModelBuilderContext/typesEnum';
import {RightSideBar} from './RightSidebar/index';

import './EditObjectFolder.scss';

interface EditObjectFolder {
	companyKeyValuePairs: KeyValuePair[];
	objectRelationshipDeletionTypes: LabelValueObject[];
	siteKeyValuePairs: KeyValuePair[];
}

export default function EditObjectFolder({
	companyKeyValuePairs,
	objectRelationshipDeletionTypes,
	siteKeyValuePairs,
}: EditObjectFolder) {
	const [
		{
			elements,
			objectDefinitionsStorageTypes,
			objectFolderName,
			rightSidebarType,
			selectedObjectFolder,
			showChangesSaved,
		},
		dispatch,
	] = useObjectFolderContext();

	const store = useStore();

	const {nodes} = store.getState();

	const containerRef = useRef<HTMLDivElement>(null);

	const [showModal, setShowModal] = useState<ModelBuilderModals>({
		addObjectDefinition: false,
		addObjectField: false,
		addObjectFolder: false,
		addObjectRelationship: false,
		deleteObjectDefinition: false,
		deleteObjectFolder: false,
		deleteObjectRelationship: false,
		editObjectDefinitionExternalReferenceCode: false,
		editObjectFolder: false,
		moveObjectDefinition: false,
		publishObjectDefinitions: false,
		redirectToEditObjectDefinitionDetails: false,
	});

	const {fitView} = useZoomPanHelper();

	useEffect(() => {
		dispatch({
			payload: {
				isLoadingObjectFolder: true,
			},
			type: TYPES.SET_LOADING_OBJECT_FOLDER,
		});

		const updateModelBuilderStructure = async () => {
			const payload = await getUpdatedModelBuilderStructurePayload(
				objectFolderName
			);

			dispatch({
				payload,
				type: TYPES.UPDATE_MODEL_BUILDER_STRUCTURE,
			});

			dispatch({
				payload: {
					isLoadingObjectFolder: false,
				},
				type: TYPES.SET_LOADING_OBJECT_FOLDER,
			});
		};

		updateModelBuilderStructure();

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [objectFolderName]);

	useEffect(() => {
		if (showChangesSaved) {
			setTimeout(() => {
				dispatch({
					payload: {updatedShowChangesSaved: false},
					type: TYPES.SET_SHOW_CHANGES_SAVED,
				});
			}, 5000);
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [showChangesSaved]);

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

				resolve({croppedHeight, croppedWidth, dataUrl: croppedDataURL});
			};

			image.onerror = function () {
				reject(new Error('Failed to load the image.'));
			};
		});
	}

	function dataURItoBlob(dataURI: any) {
		const byteString = atob(dataURI.split(',')[1]);

		const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

		const ab = new ArrayBuffer(byteString.length);

		const ia = new Uint8Array(ab);

		for (let i = 0; i < byteString.length; i++) {
			ia[i] = byteString.charCodeAt(i);
		}

		const blob = new Blob([ab], {type: mimeString});

		return blob;
	}

	const downloadAsPDF = () => {
		const containerElement = document.querySelector(
			'.react-flow__renderer'
		) as HTMLElement;

		const getInvertScale = () => {
			const scaledElement = document.querySelector('.react-flow__nodes');

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
		};

		setTimeout(() => {
			const counterScale = getInvertScale();
			const finalHeight = containerElement.offsetHeight * counterScale;
			const finalWidth = containerElement.offsetWidth * counterScale;

			toPng(containerElement, {
				canvasHeight: finalHeight,
				canvasWidth: finalWidth,
			})
				.then((dataUrl) => {
					cropImageToBoundingBox(dataUrl)
						.then(({croppedHeight, croppedWidth, dataUrl}: any) => {
							const imageBlob = dataURItoBlob(dataUrl);

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

							const containerElement = document.createElement(
								'div'
							);

							containerElement.style.width = finalPDFWidth + 'px';
							containerElement.style.height =
								finalPDFHeight - 1 + 'px';
							containerElement.style.padding = '40px';
							containerElement.style.display = 'flex';
							containerElement.style.justifyContent = 'end';
							containerElement.style.flexDirection = 'column';

							if (selectedObjectFolder.label[defaultLanguageId]) {
								pdfFile.setFont('helvetica', 'bold');
								pdfFile.setFontSize(15);
								pdfFile.text(
									selectedObjectFolder.label[
										defaultLanguageId
									]!,
									40,
									60
								);
							}

							const imageElement = document.createElement('img');

							imageElement.setAttribute(
								'src',
								URL.createObjectURL(imageBlob)
							);

							containerElement.appendChild(imageElement);

							pdfFile.html(containerElement, {
								callback(pdf) {
									pdf.save('Folder.pdf');
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
		}, 2000);
	};

	return (
		<>
			{showModal.addObjectDefinition && (
				<ModalAddObjectDefinition
					handleOnClose={() =>
						setShowModal((previousState: ModelBuilderModals) => ({
							...previousState,
							addObjectDefinition: false,
						}))
					}
					objectDefinitionsStorageTypes={
						objectDefinitionsStorageTypes
					}
					objectFolderExternalReferenceCode={
						selectedObjectFolder.externalReferenceCode
					}
					onAfterSubmit={(newObjectDefinition) => {
						dispatch({
							payload: {
								newObjectDefinition,
								objectDefinitionNodes: nodes,
								selectedObjectFolderName:
									selectedObjectFolder.name,
							},
							type: TYPES.ADD_OBJECT_DEFINITION_TO_OBJECT_FOLDER,
						});
					}}
					reload={false}
				/>
			)}

			{showModal.editObjectFolder && (
				<ModalEditObjectFolder
					externalReferenceCode={
						selectedObjectFolder.externalReferenceCode
					}
					handleOnClose={() => {
						setShowModal((previousState) => ({
							...previousState,
							editObjectFolder: false,
						}));
					}}
					id={selectedObjectFolder.id}
					initialLabel={selectedObjectFolder.label}
					name={selectedObjectFolder.name}
				/>
			)}

			{showModal.publishObjectDefinitions && (
				<ModalPublishObjectDefinitions
					disableAutoClose={true}
					dispatch={dispatch}
					elements={elements}
					handleOnClose={() => {
						setShowModal((previousState) => ({
							...previousState,
							publishObjectDefinitions: false,
						}));
					}}
				/>
			)}

			<EditObjectFolderHeader
				downloadAsPDF={() => {
					fitView({includeHiddenNodes: true, padding: 0.2});
					downloadAsPDF();
				}}
				hasDraftObjectDefinitions={elements.some(
					(element) =>
						(element as FlowElement<ObjectDefinitionNodeData>).data
							?.status?.code === 2
				)}
				selectedObjectFolder={selectedObjectFolder}
				setShowModal={setShowModal}
			/>
			<div className="lfr-objects__model-builder-content">
				<LeftSidebar setShowModal={setShowModal} />

				<Diagram
					containerRef={containerRef}
					setShowModal={setShowModal}
				/>

				<RightSideBar.Root>
					{rightSidebarType === 'empty' && <RightSideBar.Empty />}

					{rightSidebarType === 'objectDefinitionDetails' && (
						<RightSideBar.ObjectDefinitionDetails
							companyKeyValuePairs={companyKeyValuePairs}
							siteKeyValuePairs={siteKeyValuePairs}
						/>
					)}

					{rightSidebarType === 'objectFieldDetails' && (
						<RightSideBar.ObjectFieldDetails />
					)}

					{rightSidebarType === 'objectRelationshipDetails' && (
						<RightSideBar.ObjectRelationshipDetails
							objectRelationshipDeletionTypes={
								objectRelationshipDeletionTypes
							}
						/>
					)}
				</RightSideBar.Root>
			</div>
		</>
	);
}
