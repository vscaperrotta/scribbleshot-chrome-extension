import { useEffect } from "react";
import { saveState } from "../utils";

export default function useDraw({
  canvasRef,
  isDrawing,
  setIsDrawing,
  startPoint,
  setStartPoint,
  history,
  setHistory,
  setRedoStack
}) {
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const getMousePos = (e) => {
      const rect = canvas.getBoundingClientRect();
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const handleMouseDown = (e) => {
      setIsDrawing(true);
      const point = getMousePos(e);
      setStartPoint(point);

      // Disegna un dot al click per migliorare la visualizzazione
      ctx.beginPath();
      ctx.strokeStyle = "lime";
      ctx.lineWidth = 4;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.arc(point.x, point.y, 2, 0, 2 * Math.PI);
      ctx.fill();
      ctx.fillStyle = "lime";
    };

    const handleMouseMove = (e) => {
      if (!isDrawing) return;
      const currentPoint = getMousePos(e);

      ctx.beginPath();
      ctx.strokeStyle = "lime";
      ctx.lineWidth = 4;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.moveTo(startPoint.x, startPoint.y);
      ctx.lineTo(currentPoint.x, currentPoint.y);
      ctx.stroke();

      setStartPoint(currentPoint);
    };

    const handleMouseUp = () => {
      if (isDrawing) saveState({
        canvasRef,
        setHistory,
        setRedoStack
      });
      setIsDrawing(false);
    };

    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseup", handleMouseUp);
    canvas.addEventListener("mouseleave", handleMouseUp);

    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseup", handleMouseUp);
      canvas.removeEventListener("mouseleave", handleMouseUp);
    };
  }, [isDrawing, startPoint, history, canvasRef, setHistory, setIsDrawing, setRedoStack, setStartPoint]);
}