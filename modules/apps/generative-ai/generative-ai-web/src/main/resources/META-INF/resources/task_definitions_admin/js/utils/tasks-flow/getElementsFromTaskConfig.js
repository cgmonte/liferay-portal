/**
 * SPDX-FileCopyrightText: (c) 2024 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

export default function getElementsFromTaskConfig(taskConfig) {
    let elements = [];

    function traverseObject(obj) {
        for (let key in obj) {
            if (typeof obj[key] === 'object' && obj[key] !== null) {
                traverseObject(obj[key]);
            } else {
                console.log(key, obj[key]);
            }
        }
    }

    if (taskConfig && Object.keys(taskConfig).length) {
        traverseObject(taskConfig);

        consoleg.log(elements);

        // return elements;
    }

    return null;
};

// if tis chain, always look for attributes.tasks

const processedElements = [
    { id: '1', type: 'input', data: { label: 'Chain' }, position: { x: 0, y: 0 }, className: 'light' },
    { id: 'e1-2', source: '1', target: '2'},
    { id: '2', type: 'input', data: { label: 'Chain' }, position: { x: 0, y: 0 }, className: 'light' },









    
    { id: '2', data: { label: 'Node 2' }, position: { x: 100, y: 100 }, className: 'light' },
    { id: '3', data: { label: 'Node 3' }, position: { x: 400, y: 100 }, className: 'light' },
    { id: '4', data: { label: 'Node 4' }, position: { x: 400, y: 200 }, className: 'light' },
    { id: 'e1-2', source: '1', target: '2', animated: true },
    { id: 'e1-3', source: '1', target: '3' },
  ];
  