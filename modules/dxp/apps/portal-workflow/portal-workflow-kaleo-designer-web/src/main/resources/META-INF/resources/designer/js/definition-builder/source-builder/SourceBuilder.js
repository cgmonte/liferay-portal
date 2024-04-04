/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayAlert from '@clayui/alert';
import ClayIcon from '@clayui/icon';
import ClayLayout from '@clayui/layout';
import ClayLink from '@clayui/link';
import ClayLoadingIndicator from '@clayui/loading-indicator';
import ClayToolbar from '@clayui/toolbar';
import {ClassicEditor} from 'frontend-editor-ckeditor-web';
import React, {useContext, useEffect, useRef, useState} from 'react';
import {isEdge, isNode} from 'react-flow-renderer';

import XMLUtil from '../../../js/definition-builder/source-builder/xmlUtil';
import {DefinitionBuilderContext} from '../DefinitionBuilderContext';
import {editorConfig} from '../constants';
import {xmlNamespace} from './constants';
import {serializeDefinition} from './serializeUtil';

export default function SourceBuilder() {
	const {
		XMLContentInvalid,
		currentEditor,
		definitionDescription,
		definitionName,
		elements,
		originalContentRef,
		setCurrentEditor,
		setXMLContentInvalid,
		version,
	} = useContext(DefinitionBuilderContext);
	const editorRef = useRef();
	const [loading, setLoading] = useState(true);
	const [showImportSuccessMessage, setShowImportSuccessMessage] = useState(
		false
	);

	useEffect(() => {
		function loadXmlContent() {
			if (currentEditor?.mode === 'source' && elements) {
				const metadata = {
					description: definitionDescription,
					name: definitionName,
					version,
				};

				const xmlContent = serializeDefinition(
					xmlNamespace,
					metadata,
					elements.filter(isNode),
					elements.filter(isEdge)
				);

				if (xmlContent) {
					originalContentRef.current = xmlContent;
					currentEditor.setData(xmlContent);

					setLoading(false);
				}
			}
		}

		const interval = setInterval(() => {
			if (currentEditor) {
				if (currentEditor.mode !== 'source') {
					setTimeout(() => {
						currentEditor.setMode('source');
					}, 1000);
				}
				else {
					clearInterval(interval);
					loadXmlContent();
				}
			}
		}, 1000);

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentEditor, definitionName, elements, version]);

	useEffect(() => {
		if (XMLContentInvalid) {
			document.addEventListener('keydown', () => {
				setXMLContentInvalid(false);
			});

			return () => {
				document.removeEventListener('keydown', () => {
					setXMLContentInvalid(false);
				});
			};
		}
	}, [setXMLContentInvalid, XMLContentInvalid]);

	const writeDefinitionMessage = Liferay.Language.get(
		'write-your-definition-or-x'
	).substring(0, 25);

	const importFileMessage = Liferay.Language.get(
		'import-a-file'
	).toLowerCase();

	function loadFile(event) {
		setXMLContentInvalid(false);

		const files = event.target.files;

		if (files[0].type === 'text/xml') {
			const reader = new FileReader();

			reader.onloadend = (event) => {
				if (event.target.readyState === FileReader.DONE) {
					const fileInput = document.querySelector('#fileInput');

					fileInput.value = '';

					setShowImportSuccessMessage(true);
				}
			};

			reader.readAsText(files[0]);
		}
		else if (files[0].type !== 'text/xml') {
			setXMLContentInvalid(true);
		}
	}

	return (
		<>
			<ClayToolbar className="source-toolbar">
				<ClayLayout.ContainerFluid>
					<ClayToolbar.Nav>
						<ClayToolbar.Item>
							<span>{Liferay.Language.get('source')}</span>
						</ClayToolbar.Item>

						<ClayToolbar.Item>
							<div className="import-file">
								<ClayIcon symbol="document-code" />

								<span>{writeDefinitionMessage}</span>

								<label className="pt-1" htmlFor="fileInput">
									<ClayLink className="ml-1">
										{`${importFileMessage}.`}
									</ClayLink>
								</label>

								<input
									id="fileInput"
									onChange={(event) => loadFile(event)}
									type="file"
								/>
							</div>
						</ClayToolbar.Item>
					</ClayToolbar.Nav>
				</ClayLayout.ContainerFluid>
			</ClayToolbar>

			{loading && (
				<ClayLoadingIndicator
					displayType="primary"
					shape="squares"
					size="md"
				/>
			)}

			<ClassicEditor
				config={editorConfig}
				name="sourceBuilderEditor"
				onBeforeDestroy={({editor}) => {
					if (
						editor.checkDirty() &&
						!XMLUtil.validateDefinition(editor.getData())
					) {
						editor.setData(originalContentRef.current);
					}
				}}
				onInstanceReady={({editor}) => {
					editor.setMode('source');

					setCurrentEditor(editor);
				}}
				ref={editorRef}
			/>

			{showImportSuccessMessage && (
				<ClayAlert.ToastContainer>
					<ClayAlert
						autoClose={5000}
						displayType="success"
						onClose={() => setShowImportSuccessMessage(false)}
						title={`${Liferay.Language.get('success')}:`}
					>
						{Liferay.Language.get(
							'definition-imported-successfully'
						)}
					</ClayAlert>
				</ClayAlert.ToastContainer>
			)}
		</>
	);
}
