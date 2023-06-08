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

import ClayForm, {ClayInput} from '@clayui/form';
import classNames from 'classnames';
import {sub} from 'frontend-js-web';
import React, {useEffect, useState} from 'react';

export function DeleteAPIApplicationModalBody(itemData: ItemData) {
	const [confirmationFieldValue, setConfirmationFieldValue] = useState('');
	const [confirmed, setConfirmed] = useState(false);

	const confirmDeleteButton = document.getElementById(
		'deleteAPIApplicationModalConfirmButton'
	);

	const displayError = confirmationFieldValue !== '' && !confirmed;

	useEffect(() => {
		if (confirmDeleteButton) {
			if (confirmDeleteButton.hasAttribute('disabled')) {
				if (itemData.title === confirmationFieldValue) {
					confirmDeleteButton.removeAttribute('disabled');
					setConfirmed(true);
				}
			}
			else {
				if (itemData.title !== confirmationFieldValue) {
					confirmDeleteButton.setAttribute('disabled', '');
					setConfirmed(false);
				}
			}
		}
	}, [confirmDeleteButton, confirmationFieldValue, itemData.title]);

	return (
		<>
			<p>
				{Liferay.Language.get(
					'this-action-cannot-be-undone-and-will-permanently-delete-all-the-related-schemas-and-endpoints-within-this-api'
				)}
			</p>
			<p>
				{Liferay.Language.get(
					'also-all-the-assets-that-used-it-will-not-work'
				)}
			</p>
			<p
				dangerouslySetInnerHTML={{
					__html: sub(
						Liferay.Language.get(
							'please-type-the-api-title-x-to-confirm'
						),
						`<strong>${itemData.title}</strong>`
					),
				}}
			/>
			<ClayForm.Group
				className={classNames({
					'has-error': displayError,
				})}
			>
				<ClayInput
					onChange={({target: {value}}: any) => {
						setConfirmationFieldValue(value);
					}}
				/>

				<div className="feedback-container">
					<ClayForm.FeedbackGroup>
						{displayError && (
							<ClayForm.FeedbackItem className="mt-2">
								<ClayForm.FeedbackIndicator symbol="exclamation-full" />

								{Liferay.Language.get(
									'please-type-the-api-title-mentioned-above'
								)}
							</ClayForm.FeedbackItem>
						)}
					</ClayForm.FeedbackGroup>
				</div>
			</ClayForm.Group>
		</>
	);
}
