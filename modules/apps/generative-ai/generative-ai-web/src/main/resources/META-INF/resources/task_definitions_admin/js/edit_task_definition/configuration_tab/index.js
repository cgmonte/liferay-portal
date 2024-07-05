/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayForm, {ClayRadio, ClayRadioGroup, ClaySelect} from '@clayui/form';
import ClayLayout from '@clayui/layout';
import getCN from 'classnames';
import React, {useContext} from 'react';

import taskConfigurationSchema from '../../../schemas/task-configuration.schema.json';
import CodeMirrorEditor from '../../shared/CodeMirrorEditor';
import LearnMessage from '../../shared/LearnMessage';
import ThemeContext from '../../shared/ThemeContext';
import {DEFAULT_INDEX_CONFIGURATION} from '../../utils/constants';

const CONFIGURATION_SCHEMAS = {
	taskConfig: taskConfigurationSchema,
};

function ConfigurationTab({
	errors,
	setFieldTouched,
	setFieldValue,
	taskConfig,
	touched
}) {
	const {isCompanyAdmin} = useContext(ThemeContext);

	const _renderEditor = (configName, configValue) => (
		<div
			className={getCN({
				'has-error': touched[configName] && errors[configName],
			})}
			onBlur={() => setFieldTouched(configName)}
		>
			<CodeMirrorEditor
				autocompleteSchema={CONFIGURATION_SCHEMAS[configName]}
				onChange={(value) => setFieldValue(configName, value)}
				value={configValue}
			/>

			{touched[configName] && errors[configName] && (
				<ClayForm.FeedbackGroup>
					<ClayForm.FeedbackItem>
						<ClayForm.FeedbackIndicator symbol="exclamation-full" />

						{errors[configName]}
					</ClayForm.FeedbackItem>
				</ClayForm.FeedbackGroup>
			)}
		</div>
	);

	return (
		<ClayLayout.ContainerFluid className="layout-section-main" size="xl">
			<div className="layout-section-main-shift">
				<div className="configuration-sheet sheet">
					<h2 className="sheet-title">
						{Liferay.Language.get('configuration')}
					</h2>

					<ClayForm.Group>
						<label>
							{Liferay.Language.get('task-configuration')}
						</label>

						{_renderEditor('taskConfig', taskConfig)}
					</ClayForm.Group>
				</div>
			</div>
		</ClayLayout.ContainerFluid>
	);
}

export default React.memo(ConfigurationTab);
