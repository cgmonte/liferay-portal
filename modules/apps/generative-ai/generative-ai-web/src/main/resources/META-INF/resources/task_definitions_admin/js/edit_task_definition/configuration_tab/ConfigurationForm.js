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
import { ATTRIBUTES_LABELS, NAME_LABELS } from '../../utils/constants';
import { id } from 'date-fns/locale';

const CONFIGURATION_SCHEMAS = {
	taskConfig: taskConfigurationSchema,
};

const updateTaskConfigWithIds = (taskConfigWithIds, id, updatedAttributes) => {
	if (!taskConfigWithIds || !Object.keys(taskConfigWithIds).length) {
		return taskConfigWithIds;
	}

	function traverseTaskConfigWithIds(obj) {
		for (let key in obj) {
			if (key === 'id' && obj[key] === id) {
				if (obj.attributes) {
					obj.attributes = updatedAttributes;
				}

				break;
			}
			else if (typeof obj[key] === 'object' && obj[key] !== null) {
				traverseTaskConfigWithIds(obj[key]);
			}
		}
	}

	traverseTaskConfigWithIds(taskConfigWithIds);

	console.log("taskConfigWithIds after update:", taskConfigWithIds);

	return taskConfigWithIds;
};

const getFormFields = (serializedTaskConfig) => {
	const formFields = [];

	function traverseTaskConfigWithIds(obj) {
		for (let key in obj) {
			if (typeof obj[key] === 'object' && obj[key] !== null) {
				traverseTaskConfigWithIds(obj[key]);
			}
			if (key === 'name'
				&& !obj[key].endsWith('agent')
				&& obj[key] !== "chain") {
				formFields.push({
					attributes: obj.attributes,
					id: obj.id,
					name: obj.name,
					...(obj.label && { taskLabel: obj.label })
				});
			}
		}
	}

	traverseTaskConfigWithIds(serializedTaskConfig);

	console.log(formFields);

	return formFields;
};

function ConfigurationForm({
	setFieldTouched,
	setFieldValues,
	taskConfigWithIds,
	setTaskConfigWithIds,
}) {
	function autoGrow(field) {
		if (field.scrollHeight > field.clientHeight && field.clientHeight < 1001) {
			field.style.height = `${field.scrollHeight}px`;
		}
	}

	const formFields = getFormFields(taskConfigWithIds);

	console.log("formFields:", formFields);

	const handleOnBlur = (fieldId, attributeKey, newValue) => {
		console.log("fieldId", fieldId);
		console.log("attributeKey", attributeKey);
		console.log("newValue", newValue);
		// setFieldValues((currentFieldValues) => {
		// 	console.log("currentFieldValues", currentFieldValues);

		// 	// return {
		// 	// 	...currentFieldValues,
		// 	// 	temperature: parseInt(currentFieldValues.temperature),
		// 	// 	maxOutputTokens: parseInt(currentFieldValues.maxOutputTokens),
		// 	// };

		// 	return currentFieldValues;

		// })	
	};

	const handleOnChange = (propertyName, value) => {
		// setLocalFieldValues((currentLocalFieldValues) => {
		// 	const newState = {
		// 		...currentLocalFieldValues,
		// 		[propertyName]: value,
		// 	};

		// 	console.log(newState);

		// 	return newState;
		// });

		console.log("handleOnChange propertyName:", propertyName);
		console.log("handleOnChange value:", value);
	};

	const getFieldType = (key, value) => {
		if (key === 'system_message' || key === 'prompt_template') {
			return 'textarea';
		}

		if (typeof value === 'string') {
			return 'input';
		}

		if (typeof value === 'number') {
			return 'number';
		}

		if (typeof value === 'boolean') {
			return 'checkbox';
		}

		return 'input';
	}

	return (
		<>
			{
				formFields.length && formFields.map((field, index) => (
					<>
						<h3
							className='task-configuration-label'
							key={`${field.id}_task_label_header_${index}`}
						>
							{field.taskLabel ?? NAME_LABELS[field.name]}
						</h3>

						{field.attributes && Object.keys(field.attributes).length &&
							Object.entries(field.attributes).map(([key, value], index) => (
								<>
									<label
										for={`${field.id}_${key}`}
										key={`${field.id}_${key}_${index}_label`}
									>
										{ATTRIBUTES_LABELS[key] ?? key}
									</label>

									<ClayInput
										className="task-configuration-input noscrollbars"
										component={(key === 'system_message' || key === 'prompt_template') ? 'textarea' : 'input'}
										// height={100}
										id={`${field.id}_${key}`}
										key={`${field.id}_${key}_${index}_input`}
										onBlur={({ target }) => handleOnBlur(field.id, key, target.value)}
										// onChange={({ target }) => handleOnChange('systemMessage', target.value)}
										// onKeyUp={({ target }) => { autoGrow(target) }}
										placeholder=""
										type={getFieldType(key, value)}
										value={value}
									/>
								</>
							))}
					</>
				))
			}
		</>
	);
}

export default ConfigurationForm;
