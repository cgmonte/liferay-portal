/**
 * SPDX-FileCopyrightText: (c) 2023 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {beginStringWithForwardSlash} from './string';

type LocalUIData = APIApplicationUIData | APISchemaUIData;

interface AddObjectFieldsDataToProperties {
	apiSchema: APISchemaItem;
	objectDefinitions: ObjectDefinition[];
	schemaProperties: APISchemaPropertyItem[];
}

export function AddObjectFieldsDataToProperties({
	apiSchema,
	objectDefinitions,
	schemaProperties,
}: AddObjectFieldsDataToProperties) {
	const propertiesTreeViewItems = schemaProperties.map(
		({description, id, name, objectFieldERC, objectRelationshipNames}) => {
			const objectRelationshipNamesArray = objectRelationshipNames?.split(
				','
			);

			const objectRelationshipName =
				objectRelationshipNamesArray?.[
					objectRelationshipNamesArray.length - 1
				];

			const mainObjectDefinition = objectDefinitions.find(
				(definition) =>
					definition.externalReferenceCode ===
					apiSchema.mainObjectDefinitionERC
			);

			let objectDefinitionId2: number;

			objectDefinitions.forEach((definition) => {
				definition.objectRelationships.forEach((relationship) => {
					{
						if (relationship.name === objectRelationshipName) {
							objectDefinitionId2 =
								relationship.objectDefinitionId2;
						}
					}
				});
			});

			const relatedObjectDefinition = objectDefinitions.find(
				(parentObjectDefinition) =>
					parentObjectDefinition.id === objectDefinitionId2
			);

			const parentObjectDefinition =
				relatedObjectDefinition ?? mainObjectDefinition;

			const currentObjectField = parentObjectDefinition?.objectFields.find(
				(objectField) =>
					objectField.externalReferenceCode === objectFieldERC
			);

			if (currentObjectField && parentObjectDefinition) {
				return {
					businessType: currentObjectField?.businessType!,
					...((description || description === '') && {
						description,
					}),
					id,
					name,
					objectDefinitionName: parentObjectDefinition?.name!,
					objectFieldERC,
					objectFieldId: currentObjectField?.id!,
					objectFieldName: currentObjectField?.name!,
					...(objectRelationshipNames && {
						objectRelationshipNames,
					}),
					r_apiSchemaToAPIProperties_c_apiSchemaId: apiSchema.id,
					type: 'trewViewItem',
				};
			}
		}
	);

	return (propertiesTreeViewItems.length
		? propertiesTreeViewItems
		: schemaProperties) as TreeViewItemData[];
}

export function hasDataChanged({
	fetchedEntityData,
	localUIData,
}: {
	fetchedEntityData: APIApplicationItem | APISchemaItem;
	localUIData: Partial<LocalUIData>;
}) {
	for (const [key, value] of Object.entries(localUIData)) {
		if (fetchedEntityData?.[key as keyof LocalUIData] !== value) {
			return true;
		}
	}

	return false;
}

export function hasEndpointDataChanged({
	fetchedEndpointData,
	localUIData,
}: {
	fetchedEndpointData: APIEndpointItem;
	localUIData: Partial<APIEndpointUIData>;
}) {
	console.log('fetchedEndpointData', fetchedEndpointData);
	console.log('localUIData', localUIData);

	if (
		fetchedEndpointData.path !==
		beginStringWithForwardSlash(localUIData.path)
	) {
		console.log('vai retornar true no path');

		return true;
	} else if (fetchedEndpointData.scope.key !== localUIData.scope?.key) {
		console.log('vai retornar true no scope');

		return true;
	} else if (fetchedEndpointData.description !== localUIData.description) {
		console.log('vai retornar true no description');

		return true;
	} else if (
		((fetchedEndpointData.r_responseAPISchemaToAPIEndpoints_c_apiSchemaId ===
			0 &&
			localUIData.r_responseAPISchemaToAPIEndpoints_c_apiSchemaId) ||
			fetchedEndpointData.r_responseAPISchemaToAPIEndpoints_c_apiSchemaId !==
				localUIData.r_responseAPISchemaToAPIEndpoints_c_apiSchemaId) &&
		!(
			fetchedEndpointData.r_responseAPISchemaToAPIEndpoints_c_apiSchemaId ===
				0 &&
			!localUIData.r_responseAPISchemaToAPIEndpoints_c_apiSchemaId
		)
	) {
		console.log('vai retornar true no schema');

		return true;
	} else if (
		localUIData.apiEndpointToAPIFilters &&
		fetchedEndpointData.apiEndpointToAPIFilters &&
		fetchedEndpointData.apiEndpointToAPIFilters.length !==
			localUIData.apiEndpointToAPIFilters.length
	) {
		console.log('vai retornar true no comprimeento da array de filters');

		return true;
	} else if (
		fetchedEndpointData.apiEndpointToAPIFilters?.length &&
		localUIData.apiEndpointToAPIFilters?.length
	) {
		if (
			fetchedEndpointData.apiEndpointToAPIFilters[0].id !==
				localUIData.apiEndpointToAPIFilters[0].id ||
			fetchedEndpointData.apiEndpointToAPIFilters[0].oDataFilter !==
				localUIData.apiEndpointToAPIFilters[0].oDataFilter
		) {
			console.log('vai retornar true no conteudo do filtro');

			return true;
		}
	}

	console.log('vai retornar falso');

	return false;
}

export function hasPropertiesDataChanged({
	fetchedPropertiesData,
	propertiesUIData,
}: {
	fetchedPropertiesData: APISchemaPropertyItem[];
	propertiesUIData: TreeViewItemData[];
}) {
	if (propertiesUIData.length !== fetchedPropertiesData.length) {
		return true;
	} else {
		for (const property of propertiesUIData) {
			const matchedFetchedProperty = fetchedPropertiesData.find(
				({objectFieldERC, objectRelationshipNames}) =>
					objectRelationshipNames ===
						property.objectRelationshipNames &&
					objectFieldERC === property.objectFieldERC
			);

			if (
				!(
					matchedFetchedProperty &&
					(matchedFetchedProperty.description ===
						property.description ||
						(!matchedFetchedProperty.description &&
							property.description === '')) &&
					matchedFetchedProperty.name === property.name
				)
			) {
				return true;
			}
		}

		return false;
	}
}

export function resetToFetched<FT extends LT, LT extends {}>({
	fetchedEntityData,
	localUIData,
}: {
	fetchedEntityData: FT;
	localUIData: LT;
}) {
	const resetedData: {[key: string]: unknown} = {};

	for (const [key, _] of Object.entries(localUIData)) {
		if (fetchedEntityData[key as keyof LT]) {
			resetedData[key] = fetchedEntityData[key as keyof LT];
		}
	}

	return resetedData as LT;
}
