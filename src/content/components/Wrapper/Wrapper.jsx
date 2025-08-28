import { useRef, useState } from "react";
import Button from "../Button";
import Canvas from '../Canvas';
import Toolbar from "../Toolbar";
import {
  handleClear,
  handleUndo,
  handleRedo
} from "./utils";
import useDebugCanvas from "./hooks/useDebugCanvas";
import useDraw from "./hooks/useDraw";
import useScreenshot from "./hooks/useScreenshot";
import messages from './messages';

export default function Wrapper() {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });

  // Stack per undo/redo
  const [history, setHistory] = useState([]);
  const [redoStack, setRedoStack] = useState([]);

  // Screenshot hook
  const { loading, handleScreenshot } = useScreenshot();

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

  return (
    <div
      className="crhmext-page-wrapper"
      style={loading ? {
        pointerEvents: 'none',
        border: 'none',
        boxShadow: 'none',
        transition: 'border 0.4s ease-in-out, box-shadow 0.4s ease-in-out'
      } : {}}>
      <div className="crhmext-page-canvas-container">
        <div className="crhmext-canvas-container">
          <Toolbar style={loading ? {
            top: '-100px',
            transition: 'top 0.4s ease-in-out'
          } : {}}>
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
            <Button
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
            <Button
              label={messages.screenshot}
              variant='primary'
              icon='screenshot'
              onClick={() => handleScreenshot()}
              disabled={history.length === 0}
            />
          </Toolbar>

          {/* Canvas */}
          <Canvas
            ref={canvasRef}
            id="crhmext-canvas"
            height={canvasHeight}
            width={canvasWidth}
          />
        </div>
      </div>
    </div >
  );
}
