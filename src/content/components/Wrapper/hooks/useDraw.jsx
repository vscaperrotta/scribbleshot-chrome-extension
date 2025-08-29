import { useEffect } from "react";
import { saveState } from "../utils";

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

    const getMousePos = (e) => {
      const rect = canvas.getBoundingClientRect();
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const handleMouseDown = (e) => {
      // Se siamo in modalità gomma, cancelliamo invece di disegnare
      if (isEraserMode) {
        setIsDrawing(true);
        const point = getMousePos(e);
        setStartPoint(point);

        // Configura il canvas per la cancellazione
        ctx.globalCompositeOperation = "destination-out";
        ctx.beginPath();
        ctx.arc(point.x, point.y, 10, 0, 2 * Math.PI);
        ctx.fill();
        return;
      }

      // Il disegno è attivo solo quando isDrawingMode è true
      if (!isDrawingMode) return;

      setIsDrawing(true);
      const point = getMousePos(e);
      setStartPoint(point);

      // Assicurati che siamo in modalità disegno normale
      ctx.globalCompositeOperation = "source-over";

      // Disegna un dot al click per migliorare la visualizzazione
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = 4;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.arc(point.x, point.y, 2, 0, 2 * Math.PI);
      ctx.fill();
      ctx.fillStyle = color;
    };

    const handleMouseMove = (e) => {
      if (!isDrawing) return;
      const currentPoint = getMousePos(e);

      if (isEraserMode) {
        // Modalità gomma: cancella lungo il percorso
        ctx.globalCompositeOperation = "destination-out";
        ctx.beginPath();
        ctx.arc(currentPoint.x, currentPoint.y, 10, 0, 2 * Math.PI);
        ctx.fill();
      } else {
        // Modalità disegno normale
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
  }, [isDrawing, startPoint, history, canvasRef, setHistory, setIsDrawing, setRedoStack, setStartPoint, isEraserMode, isDrawingMode]);
}