/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayBreadcrumb from '@clayui/breadcrumb';
import ClayCard from '@clayui/card';
import ClayTabs from '@clayui/tabs';
import {openModal, openToast} from 'frontend-js-web';
import React, {
	Dispatch,
	SetStateAction,
	useCallback,
	useContext,
	useEffect,
	useState,
} from 'react';

import {
	EditAPIApplicationContext,
	EditSchemaContext,
} from './EditAPIApplicationContext';
import EditAPISchemaProperties from './EditAPISchemaProperties';
import BaseAPISchemaFields from './baseComponents/BaseAPISchemaFields';
import {CancelEditAPIApplicationModalContent} from './modals/CancelEditAPIApplicationModalContent';
import Sidebar from './sidebar/Sidebar';
import {hasDataChanged, resetToFetched} from './utils/dataUtils';
import {fetchJSON, getAllItems, updateData} from './utils/fetchUtil';

import '../../css/main.scss';

interface EditAPISchemaProps {
	apiURLPaths: APIURLPaths;
	currentAPIApplicationId: string;
	schemaId: number;
	setMainSchemaNav: Dispatch<SetStateAction<MainSchemaNav>>;
	setManagementButtonsProps: Dispatch<SetStateAction<ManagementButtonsProps>>;
	setStatus: Dispatch<SetStateAction<ApplicationStatusKeys>>;
	setTitle: Dispatch<SetStateAction<string>>;
}

type DataError = {
	description: boolean;
	mainObjectDefinitionERC: boolean;
	name: boolean;
};

export default function EditAPISchema({
	apiURLPaths,
	currentAPIApplicationId,
	schemaId,
	setMainSchemaNav,
	setManagementButtonsProps,
	setStatus,
	setTitle,
}: EditAPISchemaProps) {
	const {
		fetchedData,
		setFetchedData,
		setHideManagementButtons,
		setIsDataUnsaved,
	} = useContext(EditAPIApplicationContext);

	const [activeTab, setActiveTab] = useState(0);
	const [currentSchemaProperties, setCurrentSchemaProperties] = useState<
		TreeViewItemData[]
	>([]);
	const [displayError, setDisplayError] = useState<DataError>({
		description: false,
		mainObjectDefinitionERC: false,
		name: false,
	});
	const [fetchedSchemaData, setFetchedSchemaData] = useState<
		FetchedSchemaData
	>({});
	const [localUIData, setLocalUIData] = useState<APISchemaUIData>({
		description: '',
		mainObjectDefinitionERC: '',
		name: '',
	});

	const fetchAPISchema = () => {
		fetchJSON<APISchemaItem>({
			input: apiURLPaths.schemas + schemaId,
		}).then((response) => {
			if (response.id === schemaId) {
				setFetchedSchemaData((previous) => ({
					...previous,
					apiSchema: response,
				}));

				setLocalUIData({
					description: response.description,
					mainObjectDefinitionERC: response.mainObjectDefinitionERC,
					name: response.name,
				});
			}
		});
	};

	const fetchAPISchemaProperties = () => {
		getAllItems<APISchemaPropertyItem>({
			url: `/o/headless-builder/schemas/${schemaId}/apiSchemaToAPIProperties`,
		}).then((response) => {
			setFetchedSchemaData((previous) => ({
				...previous,
				schemaProperties: response,
			}));
		});
	};

	const resetLocalUIData = () => {
		if (fetchedData.apiSchema) {
			setLocalUIData(
				resetToFetched<APISchemaItem, APISchemaUIData>({
					fetchedEntityData: fetchedData.apiSchema,
					localUIData,
				})
			);
		}
	};

	function validateData() {
		let isDataValid = true;
		const mandatoryFields = ['name'];

		if (!Object.keys(localUIData!).length) {
			const errors = mandatoryFields.reduce(
				(errors, field) => ({...errors, [field]: true}),
				{}
			);
			setDisplayError(errors as DataError);

			isDataValid = false;
		} else {
			mandatoryFields.forEach((field) => {
				if (localUIData![field as keyof APISchemaUIData]) {
					setDisplayError((previousErrors) => ({
						...previousErrors,
						[field]: false,
					}));
				} else {
					setDisplayError((previousErrors) => ({
						...previousErrors,
						[field]: true,
					}));
					isDataValid = false;
				}
			});
		}

		return isDataValid;
	}

	const handleUpdate = useCallback(
		({successMessage}: {successMessage: string}) => {
			const isDataValid = validateData();

			if (localUIData && isDataValid && fetchedSchemaData.apiSchema) {
				updateData<APISchemaItem>({
					dataToUpdate: {
						description: localUIData.description,
						name: localUIData.name,
						...(currentSchemaProperties.length && {
							apiSchemaToAPIProperties: currentSchemaProperties.map(
								(property) => ({
									description: property.description,
									name: property.name,
									objectFieldERC: property.objectFieldERC,
									r_apiSchemaToAPIProperties_c_apiSchemaId:
										property.r_apiSchemaToAPIProperties_c_apiSchemaId,
									...(property.objectRelationshipNames && {
										objectRelationshipNames:
											property.objectRelationshipNames,
									}),
								})
							),
						}),
					},
					method: 'PATCH',
					onError: (error: string) => {
						openToast({
							message: error,
							type: 'danger',
						});
					},
					onSuccess: () => {
						openToast({
							message: successMessage,
							type: 'success',
						});
						fetchAPISchema();
						fetchAPISchemaProperties();
					},
					url: fetchedSchemaData.apiSchema.actions.update.href,
				});
			}
		},

		// eslint-disable-next-line react-hooks/exhaustive-deps
		[currentSchemaProperties, localUIData]
	);

	const handlePublish = ({successMessage}: {successMessage: string}) => {
		const isDataValid = validateData();
		if (localUIData && isDataValid) {
			updateData<APIApplicationItem>({
				dataToUpdate: {
					applicationStatus: {key: 'published'},
				},
				method: 'PATCH',
				onError: (error: string) => {
					openToast({
						message: error,
						type: 'danger',
					});
				},
				onSuccess: (responseJSON: APIApplicationItem) => {
					setFetchedData((previous) => ({
						...previous,
						apiApplication: responseJSON,
					}));
					setStatus(responseJSON.applicationStatus.key);
					setTitle(responseJSON.title);
					openToast({
						message: successMessage,
						type: 'success',
					});
				},
				url: apiURLPaths.applications + currentAPIApplicationId,
			});
		}
	};

	const handleCancel = () => {
		if (
			fetchedData?.apiSchema &&
			hasDataChanged({
				fetchedEntityData: fetchedData.apiSchema,
				localUIData,
			})
		) {
			openModal({
				center: true,
				contentComponent: ({closeModal}: {closeModal: voidReturn}) =>
					CancelEditAPIApplicationModalContent({
						closeModal,
						onConfirm: () => {
							resetLocalUIData();
							setIsDataUnsaved(false);
							setMainSchemaNav('list');
						},
					}),
				id: 'confirmCancelEditModal',
				size: 'md',
				status: 'warning',
			});
		} else {
			setMainSchemaNav('list');
		}
	};

	useEffect(() => {
		setHideManagementButtons(false);

		fetchAPISchema();
		fetchAPISchemaProperties();

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// useEffect(() => {
	// 	const {
	// 		apiSchema,
	// 		objectDefinitions,
	// 		schemaProperties,
	// 	} = fetchedSchemaData;

	// 	if (apiSchema && objectDefinitions && schemaProperties) {
	// 		let allFields: ObjectField[] = [];

	// 		relatedObjectDefinitions.forEach((definition) => {
	// 			allFields = [...allFields, ...definition.objectFields];
	// 		});

	// 		allFields = [...allFields, ...mainObjectDefinition.objectFields];

	// 		const allObjectDefinitions = [
	// 			...relatedObjectDefinitions,
	// 			mainObjectDefinition,
	// 		];

	// 		const propertiesTreeViewItems = schemaProperties.map(
	// 			({
	// 				description,
	// 				id,
	// 				name,
	// 				objectFieldERC,
	// 				objectRelationshipNames,
	// 			}) => {
	// 				const currentField = allFields.find(
	// 					(field) =>
	// 						field.externalReferenceCode === objectFieldERC
	// 				);

	// 				const parentObjectDefinition = allObjectDefinitions.find(
	// 					(definition) =>
	// 						definition.objectFields.some(
	// 							(field) =>
	// 								field.externalReferenceCode ===
	// 								objectFieldERC
	// 						)
	// 				);

	// 				return {
	// 					businessType: currentField?.businessType!,
	// 					...(description && {
	// 						description,
	// 					}),
	// 					id,
	// 					name,
	// 					objectDefinitionName: parentObjectDefinition?.name!,
	// 					objectFieldERC,
	// 					objectFieldName: currentField?.name!,
	// 					...(objectRelationshipNames && {
	// 						objectRelationshipNames,
	// 					}),
	// 					r_apiSchemaToAPIProperties_c_apiSchemaId: apiSchema.id,
	// 					type: 'trewViewItem',
	// 				};
	// 			}
	// 		);

	// 		setCurrentSchemaProperties(propertiesTreeViewItems);
	// 	}
	// }, [fetchedSchemaData]);

	useEffect(() => {
		if (fetchedData.apiSchema) {
			setIsDataUnsaved(
				hasDataChanged({
					fetchedEntityData: fetchedData.apiSchema,
					localUIData,
				})
			);
		}

		setManagementButtonsProps({
			cancel: {onClick: handleCancel, visible: true},
			publish: {
				onClick: () => {
					handlePublish({
						successMessage: Liferay.Language.get(
							'api-application-was-published'
						),
					});
					handleUpdate({
						successMessage: Liferay.Language.get(
							'api-schema-changes-were-saved'
						),
					});
				},
				visible: true,
			},
			save: {
				onClick: () =>
					handleUpdate({
						successMessage: Liferay.Language.get(
							'api-schema-changes-were-saved'
						),
					}),
				visible:
					fetchedData.apiApplication?.applicationStatus.key ===
					'unpublished',
			},
		});

		for (const key in localUIData) {
			if (localUIData[key as keyof APISchemaUIData] !== '') {
				setDisplayError((previousErrors) => ({
					...previousErrors,
					[key]: false,
				}));
			}
		}

		console.log('currentSchemaProperties', currentSchemaProperties);

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentSchemaProperties, localUIData]);

	return (
		<EditSchemaContext.Provider
			value={{
				apiSchemaId: schemaId,
				fetchedSchemaData,
				objectDefinitionBasePath:
					'/o/object-admin/v1.0/object-definitions/by-external-reference-code/',
				setFetchedSchemaData,
			}}
		>
			<div className="main-container">
				<div className="edit-schema">
					<div className="container-fluid container-fluid-max-xl edit-schema-child mt-3">
						<ClayBreadcrumb
							className="api-builder-navigation-breadcrum"
							items={[
								{
									label: Liferay.Language.get('schemas'),
									onClick: () => handleCancel(),
								},
								{
									active: true,
									label:
										fetchedData.apiSchema?.name ??
										localUIData.name,
								},
							]}
						/>

						<ClayCard className="mt-3 pt-2">
							<ClayTabs
								active={activeTab}
								className="mt-3"
								fade
								onActiveChange={setActiveTab}
							>
								<ClayTabs.Item
									innerProps={{
										'aria-controls': 'tabpanel-1',
									}}
								>
									{Liferay.Language.get('info')}
								</ClayTabs.Item>

								<ClayTabs.Item
									innerProps={{
										'aria-controls': 'tabpanel-2',
									}}
								>
									{Liferay.Language.get('properties')}
								</ClayTabs.Item>
							</ClayTabs>

							<ClayTabs.Content activeIndex={activeTab} fade>
								<ClayTabs.TabPane
									aria-label={Liferay.Language.get(
										'information-tab'
									)}
									className="schema-tabs"
								>
									<ClayCard.Body>
										<BaseAPISchemaFields
											data={localUIData}
											disableObjectSelect
											displayError={displayError}
											setData={setLocalUIData}
										/>
									</ClayCard.Body>
								</ClayTabs.TabPane>

								<ClayTabs.TabPane
									aria-label={Liferay.Language.get(
										'properties-tab'
									)}
									className="schema-tabs"
								>
									<ClayCard.Body>
										<EditAPISchemaProperties
											currentSchemaProperties={
												currentSchemaProperties
											}
											setCurrentSchemaProperties={
												setCurrentSchemaProperties
											}
										/>
									</ClayCard.Body>
								</ClayTabs.TabPane>
							</ClayTabs.Content>
						</ClayCard>
					</div>

					{activeTab === 1 && (
						<Sidebar
							currentSchemaProperties={currentSchemaProperties}
							mainObjectDefinitionERC={
								localUIData.mainObjectDefinitionERC
							}
							setCurrentSchemaProperties={
								setCurrentSchemaProperties
							}
						/>
					)}
				</div>
			</div>
		</EditSchemaContext.Provider>
	);
}
