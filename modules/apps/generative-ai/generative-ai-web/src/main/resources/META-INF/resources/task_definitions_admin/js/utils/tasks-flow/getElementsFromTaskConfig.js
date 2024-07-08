/**
 * SPDX-FileCopyrightText: (c) 2024 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import { NAME_LABELS } from "../constants";

// function getNodeLabel(taskName) {
//     if (taskName.includes('agent')) {
//         return `Agent: ${NAME_LABELS[taskName]}`;
//     }

//     return `Task: ${NAME_LABELS[taskName]}`;
// }

// let previousPosition;

// function getElementPosition(previous, name) {
//     if (previous === undefined) {
//         previousPosition = { x: 0, y: 0 };
//         return previousPosition;
//     }

//     previousPosition = { x: previous.x, y: previous.y + 150 };

//     return previousPosition;
// }

// function getElement(previousPosition, taskConfig) {
//     const element = {};

//     element.id = taskConfig.id;
//     element.className = 'light';

//     if (element.id === 1) {
//         element.type = 'input';
//         const position = { x: 0, y: 0 };

//         element.position = position;
//         previousPosition = position;
//     } else {
//         element.type = 'default';
//         const position = getElementPosition(previousPosition, taskConfig.name);

//         element.position = position;
//         previousPosition = position;
//     }
//     const data = {};

//     data.label = getNodeLabel(taskConfig.name);
//     data.taskConfig = taskConfig;

//     element.data = data;

//     return element;
// }

export default function getElementsFromTaskConfig(taskConfig) {
    let idCounter = 1;
    let elements = [];

    function traverseObject(obj, depth = 0, parentId = null) {
        let currentId = null;
        for (let key in obj) {
          if (typeof obj[key] === 'object' && obj[key] !== null) {
            currentId = String(idCounter++);
            let node = {
              id: currentId,
              data: { label: key },
              position: { x: 100, y: depth * 100 },
            };
      
            if (key === 'name') {
              node.data.label = NAME_LABELS[obj[key]];
            }
      
            if (key === 'attributes') {
              node.data.attributes = obj[key];
            }
      
            elements.push(node);
      
            if (parentId) {
              elements.push({
                id: `e${parentId}-${currentId}`,
                source: parentId,
                target: currentId,
                animated: true,
              });
            }
      
            traverseObject(obj[key], depth + 1, currentId);
          }
        }
      }
      
    //   // Usage
    //   const schema = {
    //     "properties": {
    //       "attributes": {
    //         "$ref": "#/definitions/taskAttributes"
    //       },
    //       "debug": {
    //         "default": false,
    //         "description": "Include debug information in the response",
    //         "type": "boolean"
    //       },
    //       "name": {
    //         "default": "gemini_chat_model",
    //         "description": "The name of the task",
    //         "enum": [
    //           "chain",
    //           "gemini_chat_model",
    //           "google_imagen",
    //           "local_document_retrieval",
    //           "openai_image_model",
    //           "task_context_agent",
    //           "text_input_agent",
    //           "webhook"
    //         ],
    //         "type": "string"
    //       }
    //     },
    //     "type": "object"
    //   };
      
      traverseObject(taskConfig);
      console.log(elements);

    return elements
};
