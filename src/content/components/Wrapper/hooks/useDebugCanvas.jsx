import { useEffect } from "react";


export default function useDebugCanvas({
  ref = null,
  history = []
}) {
  useEffect(() => {
    const canvas = ref?.current;
    if (!canvas) return;

    const handleMouseDown = (e) => {
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "red";
      ctx.beginPath();
      ctx.arc(e.offsetX, e.offsetY, 5, 0, Math.PI * 2);
      ctx.fill();
    };

    canvas.addEventListener("mousedown", handleMouseDown);
    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown);
    };
  }, [ref]);

  useEffect(() => {
    console.log("Canvas history changed:", history);
  }, [history]);

  return null;
}