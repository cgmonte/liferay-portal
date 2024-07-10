/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayButton from '@clayui/button';
import ClayForm, { ClayCheckbox, ClayInput } from '@clayui/form';

import ClayLayout from '@clayui/layout';
import getCN from 'classnames';
import React, { useRef, useEffect, useState } from 'react';

import taskConfigurationSchema from '../../../schemas/task-configuration.schema.json';
import CodeMirrorEditor from '../../shared/CodeMirrorEditor';
import LearnMessage from '../../shared/LearnMessage';
import ThemeContext from '../../shared/ThemeContext';
import { DEFAULT_INDEX_CONFIGURATION } from '../../utils/constants';
import { set } from 'date-fns';
import { ATTRIBUTES_INPUT_TYPES, ATTRIBUTES_LABELS, NAME_LABELS } from '../../utils/constants';
import { id } from 'date-fns/locale';

const CONFIGURATION_SCHEMAS = {
	taskConfig: taskConfigurationSchema,
};

const updateTaskConfigWithIds = (taskConfigWithIds, id, updatedAttributes) => {
	const taskConfigToUpdate = { ...taskConfigWithIds };

	function traverseTaskConfig(obj) {
		for (let key in obj) {
			if (key === 'id' && obj[key] === id) {
				if (obj.attributes) {
					obj.attributes = updatedAttributes;
				}

				break;
			}
			if (typeof obj[key] === 'object' && obj[key] !== null) {
				traverseTaskConfig(obj[key]);
			}
		}
	}

	traverseTaskConfig(taskConfigToUpdate);

	return taskConfigToUpdate;
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

	return formFields;
};

function processValue(value) {
	if (typeof value === 'string') {
		// Check if the string is a boolean
		if (value.toLowerCase() === 'true') return true;
		if (value.toLowerCase() === 'false') return false;

		// Check if the string is a number
		if (/^\d+$/.test(value)) {
			return Number(value);
		}
	}
	return value;
}

function ConfigurationForm({
	setFieldTouched,
	setFieldValues,
	taskConfigWithIds,
	setTaskConfigWithIds,
}) {
	const [inputValues, setInputValues] = useState({});
	const [formFields, setFormFields] = useState(getFormFields(taskConfigWithIds));

	const formRef = useRef();

	// useEffect(() => {
	// 	const newFormFields = getFormFields(taskConfigWithIds);
	// 	console.log(newFormFields);

	// 	setFormFields(getFormFields(newFormFields));
	// }, [taskConfigWithIds]);

	useEffect(() => {
		return () => {
			console.log("oxe"); 
			// const formData = new FormData(formRef.current);
			// // console.log("formData.entries()", formData.entries());

			// for(var pair of formData.entries()) {
			// 	console.log(pair[0]+ ', '+ pair[1]);
			//  }
		};
	}, []);

	function autoGrow(field) {
		if (field.scrollHeight > field.clientHeight && field.clientHeight < 1001) {
			field.style.height = `${field.scrollHeight}px`;
		}
	}

	useEffect(() => {
		console.log("pqp formFields", formFields)
	}, [formFields]);

	const handleOnChange = (key, value) => {
		setInputValues(prevState => ({
			...prevState,
			[key]: processValue(value)
		}));
	};

	useEffect(() => {
		setFormFields((currentFormFields) => {
			const newFormFields = [...currentFormFields];

			Object.entries(inputValues).forEach(([key, value]) => {
				const [id, attributeKey] = key.split('-');

				newFormFields.find((field) => field.id == id).attributes[attributeKey] = processValue(value);
			});

			return newFormFields;
		});
	}, [inputValues]);

	const submitForm = (event) => {
		const form = event.currentTarget;
		const formData = new FormData(form);

		console.log("formData", formData);
	}

	return (
		<ClayForm
			ref={formRef}
		>
			{formFields.length && formFields.map((field, index) => (
				<div className='mb-5'>
					<h4
						className='task-configuration-label'
						key={`${field.id}-task_label_header_${index}`}
					>
						{field.taskLabel ?? NAME_LABELS[field.name]}
					</h4>

					{field.attributes && Object.keys(field.attributes).length &&
						Object.entries(field.attributes).map(([key, value], attributeIndex) => (
							(key === 'system_message' || key === 'prompt_template')
								? <ClayForm.Group
									className="form-group-sm"
									key={`${field.id}-${key}_${attributeIndex}_group`}
								>
									<label
										htmlFor={`${field.id}-${key}`}
										key={`${field.id}-${key}_${attributeIndex}_label`}
									>
										{ATTRIBUTES_LABELS[key] ?? key}
									</label>

									<ClayInput
										className="task-configuration-input noscrollbars"
										component={(key === 'system_message' || key === 'prompt_template') ? 'textarea' : 'input'}
										id={`${field.id}-${key}`}
										key={`${field.id}-${key}_${attributeIndex}_input`}
										name={`${field.id}-${key}`}
										onChange={({ target }) => handleOnChange(`${field.id}-${key}`, target.value)}
										placeholder=""
										type={ATTRIBUTES_INPUT_TYPES[key] ?? 'text'}
										value={inputValues[`${field.id}-${key}`] ?? value}
									/>
								</ClayForm.Group>
								: null
						))}
				</div>
			))}
		</ClayForm>
	);
}

export default ConfigurationForm;
