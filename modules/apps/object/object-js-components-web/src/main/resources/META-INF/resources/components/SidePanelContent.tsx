/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayButton, {ClayButtonWithIcon} from '@clayui/button';
import ClayForm from '@clayui/form';
import ClayLabel from '@clayui/label';
import classNames from 'classnames';
import React, {
	forwardRef,
	useEffect,
	useRef,
} from 'react';

import './SidePanelContent.scss';

export function closeSidePanel() {
	const parentWindow = Liferay.Util.getOpener();
	parentWindow.Liferay.fire('close-side-panel');
}

export function saveAndReload() {
	const parentWindow = Liferay.Util.getOpener();

	closeSidePanel();

	setTimeout(() => {
		parentWindow.location.reload();
	}, 300);
}

export function openToast(options: {
	message: string;
	type?: 'danger' | 'success';
}) {
	const parentWindow = Liferay.Util.getOpener();
	parentWindow.Liferay.Util.openToast(options);
}

export const SidePanelContent = forwardRef<HTMLDivElement, ISidePanelContent>(
	function SidePanelContent(
		{children, className, customLabel, onSave, readOnly, title},
		ref
	) {
		const saveProps: {
			onClick?: () => void;
			type?: 'submit';
		} = onSave ? {onClick: onSave} : {type: 'submit'};

		return (
			<div
				className={classNames(
					'lfr-objects__side-panel-content',
					className
				)}
				ref={ref}
			>
				<div className="lfr-objects__side-panel-content-header">
					<div className="lfr-objects__side-panel-content-header-title">
						<h3 className="mb-0">{title}</h3>

						{customLabel && (
							<ClayLabel
								className="lfr-objects__side-panel-content-header-title-label"
								displayType={customLabel?.displayType}
							>
								{customLabel?.message}
							</ClayLabel>
						)}
					</div>

					<ClayButtonWithIcon
						aria-label={Liferay.Language.get('cancel')}
						displayType="unstyled"
						monospaced={false}
						onClick={closeSidePanel}
						symbol="times"
					/>
				</div>

				{children}

				<ClayButton.Group
					className="lfr-objects__side-panel-content-container"
					spaced
				>
					<ClayButton
						displayType="secondary"
						onClick={closeSidePanel}
					>
						{Liferay.Language.get('cancel')}
					</ClayButton>

					<ClayButton disabled={readOnly} {...saveProps}>
						{Liferay.Language.get('save')}
					</ClayButton>
				</ClayButton.Group>
			</div>
		);
	}
);

export function SidePanelForm({
	children,
	customLabel,
	onSubmit,
	readOnly,
	title,
}: ISidePanelFormProps) {

	const sidePanelFormRef = useRef<HTMLFormElement>(null);
	const sidePanelContentRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const {current: sidePanelContentElement} = sidePanelContentRef;
		const {current: sidePanelFormElement} = sidePanelFormRef;

		const resizeObserver = new ResizeObserver(() => {
			if (
				sidePanelContentElement &&
				sidePanelFormElement
			) {
				const sidePanelIsOverflowing =
					sidePanelFormElement.scrollHeight >
					sidePanelFormElement.clientHeight;

				if (sidePanelIsOverflowing) {
					const scrollbarWidth =
						sidePanelFormElement.offsetWidth -
						sidePanelFormElement.clientWidth;

					console.log(
						'sidebar is overflowing. sidebar scrollbar width is: ',
						scrollbarWidth
					);

					const fdsSidePanelElement =
						window.parent.document.querySelector(
							'.fds-side-panel.fds-side-panel-lg:not(.is-hidden):not(.is-loading)'
						) as HTMLElement | null;

					if (fdsSidePanelElement) {
						console.log(
							'fdsSidePanelElement style',
							fdsSidePanelElement.getAttribute('style')
						);
						console.log(
							'fdsSidePanelElement offsetWidth',
							fdsSidePanelElement.offsetWidth
						);
						console.log(
							'fdsSidePanelElement clientWidth',
							fdsSidePanelElement.clientWidth
						);

						const fdsContainerElement = document.querySelector(
							'#p_p_id_com_liferay_object_web_internal_list_type_portlet_portlet_ListTypeDefinitionsPortlet_ .lfr-objects__side-panel-content .dnd-table'
						);

						if (fdsContainerElement) {
							const fdsIsOverflowing =
								fdsContainerElement.scrollWidth >
								fdsContainerElement.clientWidth;

							console.log("fdsIsOverflowing", fdsIsOverflowing);

							const currentStyleAttribute =
								fdsSidePanelElement.getAttribute('style');

							if (!currentStyleAttribute?.includes('width')) {
								const currentElementWidth =
								fdsSidePanelElement.offsetWidth;

								const newElementStyle =
									currentStyleAttribute +
									` width: ${currentElementWidth + scrollbarWidth}px`;

								fdsSidePanelElement.setAttribute(
									'style',
									newElementStyle
								);
							}
						}
					}
				}
				else {
					console.log('sidebar is not overflowing');
				}
			}
		});

		if (sidePanelContentElement) {
			resizeObserver.observe(sidePanelContentElement);
		}

		return () => {
			if (sidePanelContentElement) {
				resizeObserver.unobserve(sidePanelContentElement);
			}
		};
	}, []);

	return (
		<ClayForm
			className="lfr-objects__side-panel-form"
			onSubmit={onSubmit}
			ref={sidePanelFormRef}
		>
			<SidePanelContent
				customLabel={customLabel}
				readOnly={readOnly}
				ref={sidePanelContentRef}
				title={title}
			>
				{children}
			</SidePanelContent>
		</ClayForm>
	);
}

interface IContainerProps {
	children: React.ReactNode;
	className?: string;
}

interface CommonProps extends IContainerProps {
	customLabel?: {
		displayType: 'success' | 'info';
		message: string;
	};
	readOnly?: boolean;
	title: string;
}

interface ISidePanelContent extends CommonProps {
	ref: React.RefObject<HTMLDivElement>;
	onSave?: () => void;
}

interface ISidePanelFormProps extends CommonProps {
	onSubmit?: React.FormEventHandler<HTMLFormElement>;
}
