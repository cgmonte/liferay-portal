/**
 * SPDX-FileCopyrightText: (c) 2023 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {toPng, toSvg} from 'html-to-image';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {FlowElement, useStore, useZoomPanHelper} from 'react-flow-renderer';

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

interface EditObjectFolder {
	companyKeyValuePairs: KeyValuePair[];
	objectRelationshipDeletionTypes: LabelValueObject[];
	siteKeyValuePairs: KeyValuePair[];
}

type Bounds =
	| {
			bottom: number;
			left: number;
			right: number;
			top: number;
	  }
	| undefined;

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
		},
		dispatch,
	] = useObjectFolderContext();

	const store = useStore();

	const {nodes} = store.getState();

	const containerRef = useRef<HTMLDivElement>(null);

	const [bounds, setBounds] = useState<Bounds>();

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

	// function downloadImage(dataUrl: any) {
	// 	console.log('dataUrl', dataUrl);
	// 	const a = document.createElement('a');

	// 	a.setAttribute('download', 'reactflow.png');
	// 	a.setAttribute('href', dataUrl);
	// 	a.click();
	// }

	// const filter = (node: HTMLElement) => {
	// 	const exclusionClasses = [
	// 		// 'dropdown lfr__object-web-view-object-definitions-actions',
	// 		// 'lexicon-icon',
	// 		'react-flow__background',
	// 		'react-flow__controls',
	// 		'react-flow__minimap',
	// 	];

	// 	return !exclusionClasses.some((classname) => {
	// 		console.log('node.classList', node.classList);

	// 		return (
	// 			node.classList?.contains(classname) ||
	// 			(node.classList?.value && node.classList.value === classname)
	// 		);
	// 	});
	// };

	const {fitBounds, fitView} = useZoomPanHelper();

	// const bounds: any = {};

	useEffect(() => {
		const nodes = elements.filter(
			(element) => element.type === 'objectDefinitionNode'
		);

		if (nodes.length) {
			if (!document.querySelector(`[data-id="${nodes[0].id}"]`)) {
				setTimeout(() => {
					const localBounds: Partial<Bounds> = {};

					nodes.forEach((node: any) => {
						console.log('node.id', node.id);
						const nodeElement = document.querySelector(
							`[data-id="${node.id}"]`
						) as HTMLElement;

						console.log('nodeElement', nodeElement);

						console.log('node x', node.position);
						console.log(
							'nodeElement width',
							nodeElement?.offsetWidth
						);
						console.log(
							'nodeElement height',
							nodeElement?.offsetHeight
						);

						if (localBounds) {
							if (!Object.keys(localBounds).length) {
								localBounds.left = node.position.x;
								localBounds.top = node.position.y;
								localBounds.right =
									node.position.x + nodeElement.offsetWidth;
								localBounds.bottom =
									node.position.y + nodeElement.offsetHeight;
							} else {
								const {bottom, left, right, top} = localBounds;

								if (bottom && left && right && top) {
									localBounds.left =
										node.position.x < left
											? node.position.x
											: localBounds.left;
									localBounds.top =
										node.position.y < top
											? node.position.y
											: localBounds.top;
									localBounds.right =
										node.position.x +
											nodeElement.offsetWidth >
										right
											? node.position.x +
											  nodeElement.offsetWidth
											: localBounds.right;
									localBounds.bottom =
										node.position.y +
											nodeElement.offsetHeight >
										bottom
											? node.position.y +
											  nodeElement.offsetHeight
											: localBounds.bottom;
								}
							}
						}
					});

					// console.log('bounds', bounds);

					setBounds(localBounds as Bounds);

					// fitBounds({ x: bounds.left, y: bounds.top, width: bounds.right, height: bounds.bottom });
				}, 3000);
			}
		}

		// console.log('nodes', nodes);
	}, [elements]);

	const clamp = (val: number, min = 0, max = 1): number =>
		Math.min(Math.max(val, min), max);

	const getTransformForBounds = (
		bounds: any,
		width: number,
		height: number,
		minZoom: number,
		maxZoom: number,
		padding = 0.1
	): any => {
		const xZoom = width / (bounds.width * (1 + padding));
		const yZoom = height / (bounds.height * (1 + padding));
		const zoom = Math.min(xZoom, yZoom);
		const clampedZoom = clamp(zoom, minZoom, maxZoom);
		const boundsCenterX = bounds.x + bounds.width / 2;
		const boundsCenterY = bounds.y + bounds.height / 2;
		const x = width / 2 - boundsCenterX * clampedZoom;
		const y = height / 2 - boundsCenterY * clampedZoom;

		return [x, y, clampedZoom];
	};

	const downloadAsPDF = useCallback(() => {
		if (bounds) {
			// const containerElement = document.querySelector('.react-flow__nodes')
			const containerElement = document.querySelector(
				'.react-flow__renderer'
			);

			console.log('containerElement', containerElement);

			if (!containerElement) {
				// console.log('null', containerElement);

				return;
			}

			const transform = getTransformForBounds(
				{
					height: bounds.bottom,
					width: bounds.right,
					x: bounds.left,
					y: bounds.top,
				},
				bounds.right,
				bounds.bottom,
				0.5,
				2
			);

			toSvg(containerElement as HTMLElement, {
				backgroundColor: 'white',
				height: bounds.bottom,
				style: {
					// transform: `translate(101.184px, 170.279px) scale(0.498811)`,
					height: bounds.bottom.toString(),
					transform: `translate(${transform[0]}px, ${transform[1]}px) scale(${transform[2]})`,
					width: bounds.right.toString(),
				},
				width: bounds.right,
			})
				.then((dataUrl) => {
					const link = document.createElement('a');
					link.download = 'my-image-name.svg';
					link.href = dataUrl;
					link.click();
				})
				.catch((error) => {
					console.log(error);
				});
		}
	}, [bounds]);

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
					disableAutoClose={false}
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
				downloadAsPDF={downloadAsPDF}
				hasDraftObjectDefinitions={elements.some(
					(element) =>
						(element as FlowElement<ObjectDefinitionNodeData>).data
							?.status?.code === 2
				)}
				selectedObjectFolder={selectedObjectFolder}
				setShowModal={setShowModal}
			/>
			<div className="lfr-objects__model-builder-diagram-container">
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
