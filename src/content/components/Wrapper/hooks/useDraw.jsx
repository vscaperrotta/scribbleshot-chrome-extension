import { useEffect } from "react";
import { saveState } from "../utils";

/**
 * Custom hook for handling drawing and erasing functionality on a canvas
 * @param {Object} params - Configuration object
 * @param {React.RefObject<HTMLCanvasElement>} params.canvasRef - Reference to the canvas element
 * @param {boolean} params.isDrawingMode - Whether drawing mode is active
 * @param {boolean} params.isDrawing - Whether currently drawing/erasing
 * @param {Function} params.setIsDrawing - Setter for isDrawing state
 * @param {string} params.color - Current drawing color
 * @param {Object} params.startPoint - Starting point coordinates {x, y}
 * @param {Function} params.setStartPoint - Setter for startPoint state
 * @param {Array} params.history - Array of canvas states for undo functionality
 * @param {Function} params.setHistory - Setter for history state
 * @param {Function} params.setRedoStack - Setter for redo stack state
 * @param {boolean} params.isEraserMode - Whether eraser mode is active
 */
export default function useDraw({
  canvasRef,
  isDrawingMode,
  isDrawing,
  setIsDrawing,
  color,
  startPoint,
  setStartPoint,
  history,
  setHistory,
  setRedoStack,
  isEraserMode
}) {
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    /**
     * Gets mouse position relative to canvas
     * @param {MouseEvent} e - Mouse event
     * @returns {Object} Coordinates {x, y}
     */
    const getMousePos = (e) => {
      const rect = canvas.getBoundingClientRect();
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    /**
     * Handles mouse down events for drawing and erasing
     * @param {MouseEvent} e - Mouse event
     */
    const handleMouseDown = (e) => {
      // If we're in eraser mode, erase instead of drawing
      if (isEraserMode) {
        setIsDrawing(true);
        const point = getMousePos(e);
        setStartPoint(point);

        // Configure canvas for erasing
        ctx.globalCompositeOperation = "destination-out";
        ctx.beginPath();
        ctx.arc(point.x, point.y, 10, 0, 2 * Math.PI);
        ctx.fill();
        return;
      }

      // Drawing is only active when isDrawingMode is true
      if (!isDrawingMode) return;

      setIsDrawing(true);
      const point = getMousePos(e);
      setStartPoint(point);

      // Ensure we're in normal drawing mode
      ctx.globalCompositeOperation = "source-over";

      // Draw a dot on click to improve visualization
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = 4;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.arc(point.x, point.y, 2, 0, 2 * Math.PI);
      ctx.fill();
      ctx.fillStyle = color;
    };

    /**
     * Handles mouse move events for continuous drawing and erasing
     * @param {MouseEvent} e - Mouse event
     */
    const handleMouseMove = (e) => {
      if (!isDrawing) return;
      const currentPoint = getMousePos(e);

      if (isEraserMode) {
        // Eraser mode: erase along the path
        ctx.globalCompositeOperation = "destination-out";
        ctx.beginPath();
        ctx.arc(currentPoint.x, currentPoint.y, 10, 0, 2 * Math.PI);
        ctx.fill();
      } else {
        // Normal drawing mode
        ctx.globalCompositeOperation = "source-over";
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = 4;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.moveTo(startPoint.x, startPoint.y);
        ctx.lineTo(currentPoint.x, currentPoint.y);
        ctx.stroke();
      }

      setStartPoint(currentPoint);
    };

    /**
     * Handles mouse up events to save canvas state and stop drawing
     */
    const handleMouseUp = () => {
      // Save state only if we actually drew or erased something
      if (isDrawing) {
        // Ensure globalCompositeOperation is reset before saving
        const ctx = canvasRef.current.getContext("2d");
        ctx.globalCompositeOperation = "source-over";

        saveState({
          canvasRef,
          setHistory,
          setRedoStack
        });
      }
      setIsDrawing(false);
    };

    // Add event listeners
    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseup", handleMouseUp);
    canvas.addEventListener("mouseleave", handleMouseUp);

    // Cleanup event listeners on unmount
    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseup", handleMouseUp);
      canvas.removeEventListener("mouseleave", handleMouseUp);
    };
  }, [isDrawing, startPoint, history, canvasRef, setHistory, setIsDrawing, setRedoStack, setStartPoint, isEraserMode, isDrawingMode, color]);
}