/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayBreadcrumb from '@clayui/breadcrumb';
import ClayCard from '@clayui/card';
import ClayTabs from '@clayui/tabs';
import {openToast} from 'frontend-js-web';
import React, {
	Dispatch,
	SetStateAction,
	useCallback,
	useEffect,
	useState,
} from 'react';

import BaseAPISchemaFields from './baseComponents/BaseAPISchemaFields';
import {fetchJSON, updateData} from './utils/fetchUtil';

import '../../css/main.scss';

interface EditAPIApplicationSchemaProps {
	apiURLPaths: APIURLPaths;
	currentAPIApplicationID: string;
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

export default function EditAPIApplicationSchema({
	apiURLPaths,
	currentAPIApplicationID,
	schemaId,
	setMainSchemaNav,
	setManagementButtonsProps,
	setStatus,
	setTitle,
}: EditAPIApplicationSchemaProps) {
	const [activeTab, setActiveTab] = useState(0);
	const [data, setData] = useState<APIApplicationSchemaItem>();
	const [displayError, setDisplayError] = useState<DataError>({
		description: false,
		mainObjectDefinitionERC: false,
		name: false,
	});

	const hideAllManagementButtons = () => {
		const defaultButtonProps = {onClick: () => {}, visible: false};

		setManagementButtonsProps({
			cancel: defaultButtonProps,
			publish: defaultButtonProps,
			save: defaultButtonProps,
		});
	};

	const fetchAPIApplication = () => {
		fetchJSON<APIApplicationSchemaItem>({
			input: apiURLPaths.schemas + schemaId,
		}).then((response) => {
			if (response.id === schemaId) {
				setData(response);
			}
		});
	};

	function validateData() {
		let isDataValid = true;
		const mandatoryFields = ['description', 'name'];

		if (!Object.keys(data!).length) {
			const errors = mandatoryFields.reduce(
				(errors, field) => ({...errors, [field]: true}),
				{}
			);
			setDisplayError(errors as DataError);

			isDataValid = false;
		} else {
			mandatoryFields.forEach((field) => {
				if (data![field as keyof APIApplicationSchemaItem]) {
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

			if (data && isDataValid) {
				updateData<APIApplicationSchemaItem>({
					dataToUpdate: {
						description: data.description,
						name: data.name,
					},
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
						fetchAPIApplication();
					},
					url: data.actions.update.href,
				});
			}
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[data]
	);

	const handlePublish = ({successMessage}: {successMessage: string}) => {
		const isDataValid = validateData();
		if (data && isDataValid) {
			updateData<APIApplicationItem>({
				dataToUpdate: {
					applicationStatus: {key: 'published'},
				},
				onError: (error: string) => {
					openToast({
						message: error,
						type: 'danger',
					});
				},
				onSuccess: (responseJSON: APIApplicationItem) => {
					openToast({
						message: successMessage,
						type: 'success',
					});
					setTitle(responseJSON.title);
					setStatus(responseJSON.applicationStatus.key);
				},
				url: apiURLPaths.applications + currentAPIApplicationID,
			});
		}
	};

	useEffect(() => {
		fetchAPIApplication();

		return () => {
			hideAllManagementButtons();
		};

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		setManagementButtonsProps({
			cancel: {onClick: () => setMainSchemaNav('list'), visible: true},
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
				visible: true,
			},
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data]);

	return data ? (
		<div className="container-fluid container-fluid-max-xl mt-3">
			<ClayBreadcrumb
				items={[
					{
						label: Liferay.Language.get('schemas'),
						onClick: () => setMainSchemaNav('list'),
					},
					{
						active: true,
						label: data.name,
					},
				]}
			/>

			<ClayCard className="mt-3 pt-2">
				<ClayTabs
					active={activeTab}
					className="mt-3"
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
						aria-labelledby="tab-1"
						className="info-tab"
					>
						<ClayCard.Body>
							<BaseAPISchemaFields
								data={data as APIApplicationSchemaItem}
								disableObjectSelect
								displayError={displayError}
								setData={setData as voidReturn}
							/>
						</ClayCard.Body>
					</ClayTabs.TabPane>

					<ClayTabs.TabPane aria-labelledby="tab-2">
						Cenas do próximo capítulo
					</ClayTabs.TabPane>
				</ClayTabs.Content>
			</ClayCard>
		</div>
	) : null;
}
