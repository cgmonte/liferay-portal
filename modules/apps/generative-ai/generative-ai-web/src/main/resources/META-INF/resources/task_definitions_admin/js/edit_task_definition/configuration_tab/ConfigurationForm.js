/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayForm, { ClayRadio, ClayRadioGroup, ClaySelect } from '@clayui/form';
import ClayButton from '@clayui/button';
import { ClayInput } from '@clayui/form';

import ClayLayout from '@clayui/layout';
import getCN from 'classnames';
import React, { useContext, useState } from 'react';

import taskConfigurationSchema from '../../../schemas/task-configuration.schema.json';
import CodeMirrorEditor from '../../shared/CodeMirrorEditor';
import LearnMessage from '../../shared/LearnMessage';
import ThemeContext from '../../shared/ThemeContext';
import { DEFAULT_INDEX_CONFIGURATION } from '../../utils/constants';
import { set } from 'date-fns';
import {NAME_LABELS} from '../../utils/constants';

const CONFIGURATION_SCHEMAS = {
	taskConfig: taskConfigurationSchema,
};

function ConfigurationForm({
	taskConfig,
	setFieldTouched,
	setFieldValues
}) {
	taskConfig = JSON.parse(taskConfig);

	const [localFieldValues, setLocalFieldValues] = useState(
		{
			maxOutputTokens: taskConfig.tasks[1].attributes.max_output_tokens,
			promptTemplate: taskConfig.tasks[1].attributes.prompt_template,
			systemMessage: taskConfig.tasks[1].attributes.system_message,
			temperature: taskConfig.tasks[1].attributes.temperature,
		}
	);

	function autoGrow(field) {
		if (field.scrollHeight > field.clientHeight && field.clientHeight < 1001) {
			field.style.height = `${field.scrollHeight}px`;
		}
	}



	const handleOnBlur = () => {
		console.log("oi");
		setFieldValues((currentFieldValues) => {
			console.log("currentFieldValues", currentFieldValues);

			// return {
			// 	...currentFieldValues,
			// 	temperature: parseInt(currentFieldValues.temperature),
			// 	maxOutputTokens: parseInt(currentFieldValues.maxOutputTokens),
			// };

			return currentFieldValues;

		})	
	};

	const handleOnChange = (propertyName, value) => {
		setLocalFieldValues((currentLocalFieldValues) => {
			const newState = {
				...currentLocalFieldValues,
				[propertyName]: value,
			};

			console.log(newState);
			
			return newState;
		});
	};

	return (
		<>
			<h3>{NAME_LABELS[taskConfig.tasks[1].name]}</h3>

			<label
				className='task-configuration-label'
				for="taskConfigSysMessage"
			>
				{Liferay.Language.get('system-message')}
			</label>

			<ClayInput
				className="task-configuration-input noscrollbars"
				component="textarea"
				id="taskConfigSysMessage"
				onBlur={handleOnBlur}
				onChange={({ target }) => handleOnChange('systemMessage', target.value)}
				onKeyUp={({ target }) => { autoGrow(target) }}
				placeholder=""
				type="text"
				value={localFieldValues.systemMessage}
			/>

			<label
				className='task-configuration-label'
				for="taskConfigTemperature"
			>
				{Liferay.Language.get('max-entries')}
			</label>

			<ClayInput
				className="task-configuration-input"
				component="input"
				id="taskConfigTemperature"
				onBlur={handleOnBlur}
				onChange={({ target }) => handleOnChange('temperature', target.value)}
				placeholder=""
				type="number"
				value={localFieldValues.temperature}
			/>

			<label
				className='task-configuration-label'
				for="taskConfigMaxOutputTokens"
			>
				{Liferay.Language.get('max-output-tokens')}
			</label>

			<ClayInput
				className="task-configuration-input"
				component="input"
				id="taskConfigMaxOutputTokens"
				onBlur={handleOnBlur}
				onChange={({ target }) => handleOnChange('maxOutputTokens', target.value)}
				placeholder=""
				type="number"
				value={localFieldValues.maxOutputTokens}
			/>

			<label
				className='task-configuration-label'
				for="taskConfigPromptTemplate"
			>
				{Liferay.Language.get('prompt-template')}
			</label>

			<ClayInput
				className="task-configuration-input noscrollbars"
				component="textarea"
				id="taskConfigPromptTemplate"
				onBlur={handleOnBlur}
				onChange={({ target }) => handleOnChange('promptTemplate', target.value)}
				onKeyUp={({ target }) => { autoGrow(target) }}
				placeholder=""
				type="text"
				value={localFieldValues.promptTemplate}
			/>
		</>
	);
}

export default ConfigurationForm;
