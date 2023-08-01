/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayButton from '@clayui/button';
import ClayCard from '@clayui/card';
import {Heading} from '@clayui/core';
import ClayLayout from '@clayui/layout';
import ClayModal from '@clayui/modal';
import ClayNavigationBar from '@clayui/navigation-bar';
import {openModal, openToast} from 'frontend-js-web';
import React, {useCallback, useEffect, useMemo, useState} from 'react';

import APIApplicationsEndpointsTable from '../components/FDS/APIApplicationsEndpointsTable';
import SchemasContent from '../components/SchemasContent';
import {APIApplicationManagementToolbar} from './APIApplicationManagementToolbar';
import BaseAPIApplicationField from './baseComponents/BaseAPIApplicationFields';
import {CancelEditAPIApplicationModalContent} from './modals/CancelEditAPIApplicationModalContent';
import {fetchJSON, updateData} from './utils/fetchUtil';
import {
	getCurrentCurrentNavFromURL,
	getCurrentURLParamValue,
	updateHistory,
} from './utils/urlUtil';

import '../../css/main.scss';

interface EditAPIApplicationProps {
	apiURLPaths: APIURLPaths;
	basePath: string;
	portletId: string;
}

type DataError = {
	baseURL: boolean;
	title: boolean;
};

export default function EditAPIApplication({
	apiURLPaths,
	basePath,
	portletId,
}: EditAPIApplicationProps) {
	const currentAPIApplicationID = getCurrentURLParamValue({
		paramSufix: 'apiApplicationId',
		portletId,
	});

	const [activeNav, setActiveNav] = useState<ActiveNav>(
		getCurrentCurrentNavFromURL({
			paramSufix: 'editAPIApplicationNav',
			portletId,
		})
	);
	const [data, setData] = useState<APIApplicationItem>();
	const [displayError, setDisplayError] = useState<DataError>({
		baseURL: false,
		title: false,
	});

	const defaultButtonProps = {onClick: () => {}, visible: true};

	const [managementButtonsProps, setManagementButtonsProps] = useState<
		ManagementButtonsProps
	>({
		cancel: defaultButtonProps,
		publish: defaultButtonProps,
		save: defaultButtonProps,
	});

	const [title, setTitle] = useState<string>('');
	const [status, setStatus] = useState<ApplicationStatusKeys>('unpublished');

	const initialFieldData = useMemo(
		() => {
			return {
				baseURL: data?.baseURL,
				description: data?.description,
				title: data?.title,
			};
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[title]
	);

	const hasDataChanged = () => {
		for (const [key, value] of Object.entries(initialFieldData)) {
			if (data?.[key as keyof Partial<APIApplicationItem>] !== value) {
				return true;
			}
		}

		return false;
	};

	const fetchAPIApplication = () => {
		fetchJSON<APIApplicationItem>({
			input: apiURLPaths.applications + currentAPIApplicationID,
		}).then((response) => {
			if (response.id.toString() === currentAPIApplicationID) {
				setData(response);
				setStatus(response.applicationStatus.key);
				setTitle(response.title);
			}
		});
	};

	const handleUpdate = useCallback(
		({
			applicationStatusKey,
			successMessage,
		}: {
			applicationStatusKey: 'published' | 'unpublished';
			successMessage: string;
		}) => {
			const isDataValid = validateData();

			if (data && isDataValid) {
				updateData<APIApplicationItem>({
					dataToUpdate: {
						applicationStatus: {key: applicationStatusKey},
						baseURL: data.baseURL,
						description: data.description,
						title: data.title,
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
					url: data.actions.update.href,
				});
			}
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[data]
	);

	const handleCancel = () => {
		if (hasDataChanged()) {
			openModal({
				center: true,
				contentComponent: ({closeModal}: {closeModal: voidReturn}) =>
					CancelEditAPIApplicationModalContent({
						closeModal,
					}),
				id: 'confirmCancelEditModal',
				size: 'md',
				status: 'warning',
			});
		}
		else {
			history.back();
		}
	};

	useEffect(() => {
		for (const key in data) {
			if (data[key as keyof APIApplicationItem] !== '') {
				setDisplayError((previousErrors) => ({
					...previousErrors,
					[key]: false,
				}));
			}
		}

		setManagementButtonsProps({
			cancel: {onClick: handleCancel, visible: true},
			publish: {
				onClick: () =>
					handleUpdate({
						applicationStatusKey: 'published',
						successMessage: Liferay.Language.get(
							'api-application-was-published'
						),
					}),
				visible: true,
			},
			save: {
				onClick: () =>
					handleUpdate({
						applicationStatusKey: 'unpublished',
						successMessage: Liferay.Language.get(
							'api-application-changes-were-saved'
						),
					}),
				visible: data?.applicationStatus?.key === 'unpublished',
			},
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data]);

	useEffect(() => {
		fetchAPIApplication();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleNavigate = (nav: ActiveNav) => {
		updateHistory({navState: nav, portletId});
		setActiveNav(nav);
	};

	function validateData() {
		let isDataValid = true;
		const mandatoryFields = ['baseURL', 'title'];

		if (!Object.keys(data!).length) {
			const errors = mandatoryFields.reduce(
				(errors, field) => ({...errors, [field]: true}),
				{}
			);
			setDisplayError(errors as DataError);

			isDataValid = false;
		}
		else {
			mandatoryFields.forEach((field) => {
				if (data![field as keyof APIApplicationItem]) {
					setDisplayError((previousErrors) => ({
						...previousErrors,
						[field]: false,
					}));
				}
				else {
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

	return data && currentAPIApplicationID && managementButtonsProps ? (
		<>
			<APIApplicationManagementToolbar
				applicationStatusKey={status}
				managementButtonsProps={managementButtonsProps}
				title={title}
			/>
			<ClayNavigationBar triggerLabel={activeNav as string}>
				<ClayNavigationBar.Item active={activeNav === 'details'}>
					<ClayButton onClick={() => handleNavigate('details')}>
						{Liferay.Language.get('details')}
					</ClayButton>
				</ClayNavigationBar.Item>

				<ClayNavigationBar.Item active={activeNav === 'endpoints'}>
					<ClayButton onClick={() => handleNavigate('endpoints')}>
						{Liferay.Language.get('endpoints')}
					</ClayButton>
				</ClayNavigationBar.Item>

				<ClayNavigationBar.Item active={activeNav === 'schemas'}>
					<ClayButton onClick={() => handleNavigate('schemas')}>
						{Liferay.Language.get('schemas')}
					</ClayButton>
				</ClayNavigationBar.Item>
			</ClayNavigationBar>
			{activeNav === 'details' && (
				<ClayLayout.Container className="api-app-details mt-5">
					<ClayCard className="pt-2">
						<ClayModal.Header withTitle={false}>
							<Heading fontSize={5} level={3} weight="semi-bold">
								{Liferay.Language.get('details')}
							</Heading>
						</ClayModal.Header>

						<ClayCard.Body>
							<BaseAPIApplicationField
								basePath={basePath}
								data={data as APIApplicationItem}
								disableURLAutoFill
								displayError={displayError}
								setData={setData as voidReturn}
							/>
						</ClayCard.Body>
					</ClayCard>
				</ClayLayout.Container>
			)}
			{activeNav === 'endpoints' && (
				<APIApplicationsEndpointsTable
					apiApplicationBaseURL={data.baseURL}
					apiURLPaths={apiURLPaths}
					portletId={portletId}
					readOnly={false}
				/>
			)}
			{activeNav === 'schemas' && (
				<SchemasContent
					apiURLPaths={apiURLPaths}
					currentAPIApplicationID={currentAPIApplicationID}
					portletId={portletId}
					setManagementButtonsProps={setManagementButtonsProps}
					setStatus={setStatus}
					setTitle={setTitle}
				/>
			)}
		</>
	) : null;
}
