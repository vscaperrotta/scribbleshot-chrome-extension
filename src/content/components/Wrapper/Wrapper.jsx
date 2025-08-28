import { useRef, useState } from "react";
import Button from "../Button";
import Canvas from '../Canvas';
import Icons from "../Icons";
import Toolbar from "../Toolbar";
import {
  handleClear,
  handleUndo,
  handleRedo
} from "./utils";
import useDebugCanvas from "./useDebugCanvas";
import useDraw from "./useDraw";
import messages from './messages';

export default function Wrapper() {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });

  // Stack per undo/redo
  const [history, setHistory] = useState([]);
  const [redoStack, setRedoStack] = useState([]);

  // Variables
  const canvasWidth = window.innerWidth;
  const canvasHeight = window.innerHeight;

  // Debug
  useDebugCanvas({ canvasRef, history });

  // Initialize canvas and save initial state
  useDraw({
    canvasRef,
    isDrawing,
    setIsDrawing,
    startPoint,
    setStartPoint,
    history,
    setHistory,
    setRedoStack
  });


  function handleScreenshot() {
    console.log("Saving screenshot...");
  }

  function handleDragAndDrop() {
    console.log("Handle drag and drop...");
  }

  return (
    <div className="crhmext-page-wrapper">
      <div className="crhmext-page-canvas-container">
        <div className="crhmext-canvas-container">
          <Toolbar />
          <div className="crhmext-toolbar-container">
            {/* Drag and drop toolbar */}
            <button onClick={handleDragAndDrop}>
              <Icons value='drag' />
            </button>

            {/* Clear canvas */}
            <Button
              label={messages.clear}
              variant='primary'
              icon='clear'
              onClick={() => handleClear({
                canvasRef,
                setHistory,
                setRedoStack
              })}
              disabled={history.length === 0}
            />

            {/* History manager */}
            <Button
              label={messages.undo}
              variant='secondary'
              icon='undo'
              onClick={() => handleUndo({
                canvasRef,
                history,
                setHistory,
                setRedoStack
              })}
              disabled={history.length === 0}
            />
            <Button
              label={messages.redo}
              variant='secondary'
              icon='redo'
              onClick={() => handleRedo({
                canvasRef,
                redoStack,
                setRedoStack,
                setHistory
              })}
              disabled={redoStack.length === 0}
            />

            <div className="crhmext-divider" />

            {/* Save Screenshot */}
            <Button
              label={messages.screenshot}
              variant='primary'
              icon='screenshot'
              onClick={() => handleScreenshot()}
              disabled={history.length === 0}
            />
          </div>

          {/* Canvas */}
          <Canvas
            ref={canvasRef}
            id="crhmext-canvas"
            height={canvasHeight}
            width={canvasWidth}
          />
        </div>
      </div>
    </div>
  );
}
