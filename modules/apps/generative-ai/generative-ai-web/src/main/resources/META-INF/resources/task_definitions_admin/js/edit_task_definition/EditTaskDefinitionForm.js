/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayButton from '@clayui/button';
import ClayToolbar from '@clayui/toolbar';
import getCN from 'classnames';
import {setNestedObjectValues, useFormik} from 'formik';
import {fetch, navigate} from 'frontend-js-web';
import {PropTypes} from 'prop-types';
import React, {
	useCallback,
	useContext,
	useEffect,
	useRef,
	useState,
} from 'react';

import useShouldConfirmBeforeNavigate from '../hooks/useShouldConfirmBeforeNavigate';
import PageToolbar from '../shared/PageToolbar';
import SubmitWarningModal from '../shared/SubmitWarningModal';
import ThemeContext from '../shared/ThemeContext';
import {DEFAULT_INDEX_CONFIGURATION} from '../utils/constants';
import {DEFAULT_ERROR} from '../utils/errorMessages';
import fetchData, {DEFAULT_HEADERS} from '../utils/fetch/fetch_data';
import isDefined from '../utils/functions/is_defined';
import formatLocaleWithUnderscores from '../utils/language/format_locale_with_underscores';
import renameKeys from '../utils/language/rename_keys';
import {TEST_IDS} from '../utils/testIds';
import {
	openErrorToast,
	openSuccessToast,
	setInitialSuccessToast,
} from '../utils/toasts';
import {INPUT_TYPES} from '../utils/types/inputTypes';
import {SIDEBAR_TYPES} from '../utils/types/sidebarTypes';
import validateBoost from '../utils/validation/validate_boost';
import validateJSON from '../utils/validation/validate_json';
import validateNumberRange from '../utils/validation/validate_number_range';
import validateRequired from '../utils/validation/validate_required';
import ConfigurationTab from './configuration_tab/index';

// Tabs in display order
/* eslint-disable sort-keys */
const TABS = {
	configuration: Liferay.Language.get('configuration'),
};
/* eslint-enable sort-keys */

function EditTaskDefinitionForm({
	entityJSON,
	initialConfiguration = {},
	initialDescription = '',
	initialDescriptionI18n = {},
	initialExternalReferenceCode,
	initialTitle = '',
	initialTitleI18n = {},
	taskDefinitionId,
}) {
	const {isCompanyAdmin, locale, redirectURL} = useContext(ThemeContext);

	const formRef = useRef();

	const controllerRef = useRef();

	const [errors, setErrors] = useState([]);
	const [
		isTitleAndDescriptionEdited,
		setIsTitleAndDescriptionEdited,
	] = useState(false);
	const [previewInfo, setPreviewInfo] = useState(() => ({
		loading: false,
		results: {},
	}));
	const [openSidebar, setOpenSidebar] = useState(
		SIDEBAR_TYPES.ADD_SXP_ELEMENT
	);
	const [showSubmitWarningModal, setShowSubmitWarningModal] = useState(false);
	const [tab, setTab] = useState('configuration');

	/**
	 * This method must go before the useFormik hook.
	 */
	const _handleFormikSubmit = async (values) => {
		let configuration;

		try {
			configuration = _getConfiguration(values);
		}
		catch (error) {
			openErrorToast({
				message: Liferay.Language.get(
					'the-configuration-has-missing-or-invalid-values'
				),
			});

			if (process.env.NODE_ENV === 'development') {
				console.error(error);
			}

			return;
		}

		try {

			// If the warning modal is already open, assume the form was submitted
			// using the "Continue To Save" action and should skip the schema
			// validation step.


			if (!showSubmitWarningModal) {
				const validateErrors = {errors: []};


				if (validateErrors.errors?.length) {
					setErrors(validateErrors.errors);
					setShowSubmitWarningModal(true);

					return;
				}
			}

			const responseContent = await fetch(
				`/o/generative-ai/v1.0/task-definitions/${taskDefinitionId}`,
				{
					body: JSON.stringify({
						configuration,
						description_i18n: renameKeys(
							formik.values.description_i18n,
							formatLocaleWithUnderscores
						),
						externalReferenceCode:
							formik.values.externalReferenceCode,
						title_i18n: renameKeys(
							formik.values.title_i18n,
							formatLocaleWithUnderscores
						),
					}),
					headers: DEFAULT_HEADERS,
					method: 'PUT',
				}
			).then((response) => {
				if (!response.ok) {
					setShowSubmitWarningModal(false);

					throw DEFAULT_ERROR;
				}

				return response.json();
			});

			if (
				Object.prototype.hasOwnProperty.call(responseContent, 'errors')
			) {
				responseContent.errors.forEach((message) =>
					openErrorToast({message})
				);
			}
			else {
				setInitialSuccessToast(
					Liferay.Language.get('the-task-definition-was-saved-successfully')
				);

				navigate(redirectURL);
			}
		}
		catch (error) {
			openErrorToast();

			if (process.env.NODE_ENV === 'development') {
				console.error(error);
			}
		}
	};

	/**
	 * This method must go before the useFormik hook.
	 */
	const _handleFormikValidate = (values) => {
		const errors = {};

		[
			'taskConfig'
		].map((configName) => {
			const configError = validateJSON(
				values[configName],
				INPUT_TYPES.JSON
			);

			if (configError) {
				errors[configName] = configError;
			}
		});

		return errors;
	};

	const formik = useFormik({
		initialValues: {
			taskConfig: JSON.stringify(
				initialConfiguration,
				null,
				'\t'
			),
			description_i18n: initialDescriptionI18n,
			externalReferenceCode: initialExternalReferenceCode,
			title_i18n: initialTitleI18n
		},
		onSubmit: _handleFormikSubmit,
		validate: _handleFormikValidate,
	});

	useShouldConfirmBeforeNavigate(formik.dirty && !formik.isSubmitting);

	/**
	 * Formats the form values for the "configuration" parameter to send to
	 * the server. Sets defaults so the JSON.parse calls don't break.
	 * @param {Object} values Form values
	 * @return {Object}
	 */
	const _getConfiguration = ({
								   taskConfig
							   }) => {
		const configuration = {
			taskConfiguration: taskConfig
				? JSON.parse(taskConfig)
				: {}
		};

		return configuration;
	};

	const _handleExternalReferenceCodeChange = (externalReferenceCode) => {
		formik.setFieldValue('externalReferenceCode', externalReferenceCode);
	};
	
	const _handleTitleAndDescriptionChange = ({
		description_i18n,
		title_i18n,
	}) => {
		formik.setFieldValue('description_i18n', description_i18n);
		formik.setFieldValue('title_i18n', title_i18n);

		setIsTitleAndDescriptionEdited(true);
	};


	const _handleSubmit = (event) => {
		event.preventDefault();

		formik.handleSubmit();

		if (!formik.isValid) {
			openErrorToast({
				message: Liferay.Language.get(
					'unable-to-save-due-to-invalid-or-missing-configuration-values'
				),
			});
		}
	};

const _renderTabContent = () => {
console.log("ASDASDASDASD" + formik.values.taskConfig);
	switch (tab) {
		default:
			return (
				<ConfigurationTab
					errors={formik.errors}
					setFieldTouched={formik.setFieldTouched}
					setFieldValue={formik.setFieldValue}
					taskConfig={formik.values.taskConfig}
					touched={formik.touched}
				/>
			);
	}
};



return (
	<form ref={formRef}>
		<SubmitWarningModal
			errors={errors}
			isSubmitting={formik.isSubmitting}
			message={Liferay.Language.get(
				'the-task-definition-configuration-has-errors-that-may-cause-unexpected-results.-use-the-preview-panel-to-review-these-errors'
			)}
			onClose={() => setShowSubmitWarningModal(false)}
			onSubmit={_handleSubmit}
			visible={showSubmitWarningModal}
		/>

		<PageToolbar
			description={initialDescription}
			descriptionI18n={formik.values.description_i18n}
			entityId={taskDefinitionId}
			externalReferenceCode={formik.values.externalReferenceCode}
			isSubmitting={formik.isSubmitting}
			onCancel={redirectURL}
			onExternalReferenceCodeChange={
				_handleExternalReferenceCodeChange
			}
			onSubmit={_handleSubmit}
			onTitleAndDescriptionChange={_handleTitleAndDescriptionChange}
			tab={tab}
			tabs={TABS}
			title={initialTitle}
			titleAndDescriptionEdited={isTitleAndDescriptionEdited}
			titleI18n={formik.values.title_i18n}
		>
		</PageToolbar>

       				{_renderTabContent()}

	</form>
	);
}


EditTaskDefinitionForm.propTypes = {
	entityJSON: PropTypes.object,
	initialConfiguration: PropTypes.object,
	initialDescription: PropTypes.string,
	initialDescriptionI18n: PropTypes.object,
	initialTitle: PropTypes.string,
	initialTitleI18n: PropTypes.object,
	taskDefinitionExternalReferenceCode: PropTypes.string,
	taskDefinitionId: PropTypes.string,
};

export default React.memo(EditTaskDefinitionForm);
