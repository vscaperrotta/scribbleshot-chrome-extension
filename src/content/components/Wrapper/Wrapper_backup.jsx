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

  const [loading, setLoading] = useState(false);

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
    setLoading(true);

    const DELAY = 1000;

    // Give time for the toolbar to disappear before taking screenshot
    // 1000ms delay to ensure toolbar disappears
    setTimeout(() => {
      // Define a rect based on the full viewport dimensions
      const rect = {
        x: 0,
        y: 0,
        width: window.innerWidth,
        height: window.innerHeight
      };

      chrome.runtime.sendMessage(
        {
          msg: "capture_tab",
          rect: rect
        },
        function (response) {
          if (!response || !response.imgSrc) {
            console.error("Failed to capture tab or no image data received.");
            setLoading(false);
            return;
          }

          const image = new Image();

          image.src = response.imgSrc
          image.onload = function () {
            const canvas = document.createElement("canvas")
            const scale = window.devicePixelRatio

            // Set canvas dimensions based on the rect
            canvas.width = rect.width * scale
            canvas.height = rect.height * scale
            const ctx = canvas.getContext("2d")

            // Draw the cropped portion of the image
            ctx.drawImage(
              image,
              rect.x * scale,      // Source x
              rect.y * scale,      // Source y
              rect.width * scale,  // Source width
              rect.height * scale, // Source height
              0,                   // Destination x
              0,                   // Destination y
              rect.width * scale,  // Destination width
              rect.height * scale  // Destination height
            )

            const croppedImage = canvas.toDataURL()

            // Open the cropped image in a new tab
            const newWindow = window.open()
            newWindow.document.write(`
              <html>
                <head>
                  <title>Cropped Screenshot</title>
                  <style>
                    body {
                      margin: 0;
                      padding: 20px;
                      background-color: #f0f0f0;
                      display: flex;
                      justify-content: center;
                      align-items: center;
                      min-height: 100vh;
                      font-family: Arial, sans-serif;
                    }
                    .container {
                      text-align: center;
                      background: white;
                      border-radius: 8px;
                      padding: 20px;
                      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                      width: 100%;
                      height: 100%;
                    }
                    img {
                      max-width: 100%;
                      height: auto;
                      border: 1px solid #ddd;
                      border-radius: 4px;
                    }
                    h1 {
                      color: #333;
                      margin-bottom: 20px;
                    }
                  </style>
                </head>
                <body>
                  <div class="container">
                    <img src="${croppedImage}" alt="Cropped Screenshot" />
                  </div>
                </body>
              </html>
            `)
            newWindow.document.close()

            // Reset loading state after everything is done
            setLoading(false);
          }

          image.onerror = function () {
            console.error("Failed to load the captured image.");
            setLoading(false);
          }
        }
      )
    }, DELAY);
  }

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
