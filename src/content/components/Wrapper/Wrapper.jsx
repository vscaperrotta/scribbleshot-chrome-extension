import { useRef, useState } from "react";
import Button from "../Button";
import Canvas from '../Canvas';
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
    const rect = { x: 0, y: 0, width: 100, height: 100 };

    chrome.runtime.sendMessage(
      {
        msg: "capture_tab",
        rect: rect
      },
      function (response) {
        const image = new Image()

        // Reference
        // https://medium.com/tarkalabs-til/cropping-a-screenshot-captured-with-a-chrome-extension-a52ac9816d10

        console.log(response.tabId)

        image.src = response.imgSrc
        image.onload = function () {
          const canvas = document.createElement("canvas")
          const scale = window.devicePixelRatio

          // canvas.width = width * scale
          // canvas.height = height * scale
          const ctx = canvas.getContext("2d")

          // ctx.drawImage(
          //   image,
          //   left * scale,
          //   top * scale,
          //   width * scale,
          //   height * scale,
          //   0,
          //   0,
          //   width * scale,
          //   height * scale
          // )

          const croppedImage = canvas.toDataURL()
          // Do stuff with your cropped image
          console.log('croppedImage', croppedImage)
        }
      }
    )
  }

  return (
    <div className="crhmext-page-wrapper">
      <div className="crhmext-page-canvas-container">
        <div className="crhmext-canvas-container">
          <Toolbar>
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
