import * as API from './api';

export function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

export async function createRandomObjectDefinition (request, folderERC) {

	const objectDefinitionERC = "ObjectDefinition" + getRandomInt(9999999);
	
	const randomObjectDefinition = {
		"label": {
			"en_US": objectDefinitionERC
		},
		"pluralLabel": {
			"en_US": objectDefinitionERC
		},
		"name": objectDefinitionERC,
		"scope": "company",
		"externalReferenceCode": objectDefinitionERC,
		"objectFolderExternalReferenceCode": folderERC
		};

	const objectDefinition = await API.post(request, 'object-definitions', randomObjectDefinition);

	return objectDefinition;

}

export async function createRandomFolder(request) {

	const objectFolderERC = 'objectFolder' + getRandomInt(9999999);

	const randomObjectFolder = {
		"label": {
			"en_US": objectFolderERC
		},
		"name": objectFolderERC,
		"externalReferenceCode": objectFolderERC
	}

	const objectFolder = await API.post(request, 'object-folders', randomObjectFolder);

	return objectFolder;

}