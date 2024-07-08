/**
 * SPDX-FileCopyrightText: (c) 2024 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import { NAME_LABELS } from "../constants";

function getNodeLabel(taskName) {
    if (taskName.includes('agent')) {
        return `Agent: ${NAME_LABELS[taskName]}`;
    }

    return `Task: ${NAME_LABELS[taskName]}`;
}

let previousPosition;

function getElementPosition(previous, name) {
    if (previous === undefined) {
        previousPosition = { x: 0, y: 0 };
        return previousPosition;
    }

    previousPosition = { x: previous.x, y: previous.y + 150 };

    return previousPosition;
}

function getElement(previousPosition, taskConfig) {
    const element = {};

    element.id = taskConfig.id;
    element.className = 'light';

    if (element.id === 1) {
        element.type = 'input';
        const position = { x: 0, y: 0 };

        element.position = position;
        previousPosition = position;
    } else {
        element.type = 'default';
        const position = getElementPosition(previousPosition, taskConfig.name);

        element.position = position;
        previousPosition = position;
    }
    const data = {};

    data.label = getNodeLabel(taskConfig.name);
    data.taskConfig = taskConfig;

    element.data = data;

    return element;
}

export default function getElementsFromTaskConfig(taskConfig) {
    let elements = [];

    function traverseObject(taskConfig) {
        if (taskConfig.name
            && taskConfig.name !== 'chain'
            && !taskConfig.name.includes('agent')
        ) {
            elements.push(getElement(previousPosition, taskConfig));
        } else {

        }


        for (let key in taskConfig) {
            if (typeof taskConfig[key] === 'object' && taskConfig[key] !== null) {
                traverseObject(taskConfig[key]);
            } else {
                console.log(key, taskConfig[key]);
            }
        }
    }

    traverseObject(taskConfig);

    return elements;
};
