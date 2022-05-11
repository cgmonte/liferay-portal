/**
 * Copyright (c) 2000-present Liferay, Inc. All rights reserved.
 *
 * This library is free software; you can redistribute it and/or modify it under
 * the terms of the GNU Lesser General Public License as published by the Free
 * Software Foundation; either version 2.1 of the License, or (at your option)
 * any later version.
 *
 * This library is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU Lesser General Public License for more
 * details.
 */

import classNames from 'classnames';
import {useFeatureFlag} from 'data-engine-js-components-web';
import React, {ChangeEventHandler, useState} from 'react';

import Card from '../Card/Card';
import Editor from '../Editor/Editor';
import Sidebar from '../Editor/Sidebar/Sidebar';
import {useChannel} from '../Editor/Sidebar/useChannel';
import InputLocalized from '../Form/InputLocalized/InputLocalized';
import Select from '../Form/Select';
import ObjectValidationFormBase, {
	ObjectValidationErrors,
} from '../ObjectValidationFormBase';

import '../Editor/Editor.scss';

function BasicInfo({
	componentLabel,
	defaultLocale,
	disabled,
	errors,
	locales,
	setValues,
	values,
}: IBasicInfo) {
	const [locale, setSelectedLocale] = useState(
		defaultLocale as {
			label: string;
			symbol: string;
		}
	);

	return (
		<>
			<Card title={componentLabel}>
				<InputLocalized
					disabled={disabled}
					error={errors.name}
					label={Liferay.Language.get('label')}
					locales={locales}
					onSelectedLocaleChange={setSelectedLocale}
					onTranslationsChange={(label) => setValues({name: label})}
					placeholder={Liferay.Language.get('add-a-label')}
					required
					selectedLocale={locale}
					translations={values.name as LocalizedValue<string>}
				/>

				<ObjectValidationFormBase
					disabled={disabled}
					errors={errors}
					objectValidationTypeLabel={values.engineLabel!}
					setValues={setValues}
					values={values}
				/>
			</Card>

			<TriggerEventContainer
				disabled={disabled}
				eventTypes={[Liferay.Language.get('on-submission')]}
			/>
		</>
	);
}

function Conditions({
	defaultLocale,
	disabled,
	errors,
	locales,
	objectValidationRuleElements,
	setValues,
	values,
}: IConditions) {
	const [locale, setSelectedLocale] = useState(
		defaultLocale as {
			label: string;
			symbol: string;
		}
	);
	const inputChannel = useChannel();
	const flags = useFeatureFlag();

	const ddmTooltip = {
		content: Liferay.Language.get(
			'use-the-expression-builder-to-define-the-format-of-a-valid-object-entry'
		),
		symbol: 'question-circle-full',
	};

	return (
		<>
			<div className="lfr-objects__no-padding-card">
				<Card
					title={values.engineLabel!}
					tooltip={values.engine === 'ddm' ? ddmTooltip : null}
				>
					<div className="lfr-objects__object-data-validation-editor-sidebar">
						<div className="lfr-objects__object-data-validation-editor-container">
							<Editor
								className={classNames({
									'lfr-objects__script-editor--rtl':

										// @ts-ignore

										Liferay.Language.direction[
											locale.label
										] === 'rtl',
								})}
								content={values.script}
								disabled={disabled}
								engine={values.engine!}
								error={errors.script}
								inputChannel={inputChannel}
								setValues={setValues}
							/>
						</div>

						{flags['LPS-147651'] && (
							<Sidebar
								inputChannel={inputChannel}
								objectValidationRuleElements={
									objectValidationRuleElements
								}
							/>
						)}
					</div>
				</Card>
			</div>

			<Card title={Liferay.Language.get('error-message')}>
				<InputLocalized
					disabled={disabled}
					error={errors.errorLabel}
					label={Liferay.Language.get('message')}
					locales={locales}
					onSelectedLocaleChange={setSelectedLocale}
					onTranslationsChange={(message) =>
						setValues({errorLabel: message})
					}
					placeholder={Liferay.Language.get('add-an-error-message')}
					required
					selectedLocale={locale}
					translations={values.errorLabel as LocalizedValue<string>}
				/>
			</Card>
		</>
	);
}

function TriggerEventContainer({disabled, eventTypes}: ITriggerEventProps) {
	return (
		<Card title={Liferay.Language.get('trigger-event')}>
			<Select
				disabled={disabled}
				label={Liferay.Language.get('event')}
				options={eventTypes}
				value={0}
			/>
		</Card>
	);
}

interface ITriggerEventProps {
	disabled: boolean;
	eventTypes: string[];
}

interface ITabs {
	defaultLocale: {label: string; symbol: string};
	disabled: boolean;
	errors: ObjectValidationErrors;
	handleChange: ChangeEventHandler<HTMLInputElement>;
	locales: Array<any>;
	setValues: (values: Partial<ObjectValidation>) => void;
	values: Partial<ObjectValidation>;
}

interface IBasicInfo extends ITabs {
	componentLabel: string;
}

interface IConditions extends ITabs {
	objectValidationRuleElements: ObjectValidationRuleElement[];
}

export {BasicInfo, Conditions};
