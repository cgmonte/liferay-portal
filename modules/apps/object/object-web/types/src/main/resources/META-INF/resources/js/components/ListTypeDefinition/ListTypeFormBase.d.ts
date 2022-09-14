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

/// <reference types="react" />

import {FormError} from '@liferay/object-js-components-web';
export declare function useListTypeForm({
	initialValues,
	onSubmit,
}: IUseListTypeForm): {
	errors: FormError<ListTypeDefinition>;
	handleChange: import('react').ChangeEventHandler<HTMLInputElement>;
	handleSubmit: import('react').FormEventHandler<HTMLFormElement>;
	setValues: (values: Partial<ListTypeDefinition>) => void;
	values: Partial<ListTypeDefinition>;
};
interface IUseListTypeForm {
	initialValues: Partial<ListTypeDefinition>;
	onSubmit: (picklist: ListTypeDefinition) => void;
}
export declare type ObjectValidationErrors = FormError<ListTypeDefinition>;
export {};
