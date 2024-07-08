import React, { useEffect, useRef, useState, MouseEvent } from 'react';

import ReactFlow, {
  removeElements,
  addEdge,
  isNode,
  Background,
  Controls,
  Elements,
  BackgroundVariant,
  FlowElement,
  Node,
  Edge,
  Connection,
  OnLoadParams,
  useZoomPanHelper,
} from 'react-flow-renderer';

import {openModal} from 'frontend-js-web';

import ConfigurationForm from '../ConfigurationForm';
import getElementsFromTaskConfig from '../../../utils/tasks-flow/getElementsFromTaskConfig';

// const onNodeDragStop = (_: MouseEvent, node: Node) => console.log('drag stop', node);

const initialElements: Elements = [
  { id: '1', 
    type: 'input', 
    data: { 
      label: 'Task' 
    }, 
    position: { 
      x: 0, 
      y: 0 
    }, 
    className: 'light' },
];

const BasicFlow = ({taskConfig, editingMode, setFieldTouched, setFieldValue}: any) => {
  const [rfInstance, setRfInstance] = useState<OnLoadParams | null>(null);

  const [elements, setElements] = useState<Elements>(
    getElementsFromTaskConfig(taskConfig) ??
    initialElements
  );

  const onElementsRemove = (elementsToRemove: Elements) => setElements((els) => removeElements(elementsToRemove, els));
  const onConnect = (params: Edge | Connection) => setElements((els) => addEdge(params, els));
  const onLoad = (reactFlowInstance: OnLoadParams) => setRfInstance(reactFlowInstance);

  const onNodeDoubleClick = (_: MouseEvent, element: FlowElement) => {
    openModal({
      bodyComponent: () => (
      <ConfigurationForm 
        taskConfig={taskConfig} 
        setFieldTouched = {setFieldTouched}
				setFieldValues = {setFieldValue}
      />),
      title: 'Edit task',
      size: 'lg',
    })
  };

  const updatePos = () => {
    setElements((elms) => {
      return elms.map((el) => {
        if (isNode(el)) {
          el.position = {
            x: Math.random() * 400,
            y: Math.random() * 400,
          };
        }

        return el;
      });
    });
  };


  useEffect(() => {
    if (rfInstance && editingMode === 'flow') {      
      rfInstance.setTransform({ x: (1174/2)-(260/2), y: (708/2)-(60/2), zoom: 1.5 });
      // rfInstance.fitView();
      // rfInstance.zoomTo(1.5);
    }
  }, [editingMode, rfInstance])

  const logToObject = () => console.log(rfInstance?.toObject());
  const resetTransform = () => rfInstance?.setTransform({ x: 0, y: 0, zoom: 1 });

  const toggleClassnames = () => {
    setElements((elms) => {
      return elms.map((el) => {
        if (isNode(el)) {
          el.className = el.className === 'light' ? 'dark' : 'light';
        }

        return el;
      });
    });
  };

  return (
    <ReactFlow
      elements={elements}
      onLoad={onLoad}
      onNodeDoubleClick={onNodeDoubleClick}
      onElementsRemove={onElementsRemove}
      onConnect={onConnect}
      // onNodeDragStop={onNodeDragStop}
      className="react-flow-basic-example"
      defaultZoom={1.5}
      minZoom={0.2}
      maxZoom={4}
    >
      <Background variant={BackgroundVariant.Lines} />
      <Controls />


    </ReactFlow>
  );
};

export default BasicFlow;
