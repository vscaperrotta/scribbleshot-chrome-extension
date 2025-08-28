import { useRef, useState, useEffect } from "react";
import Icons from "../Icons";

export default function Toolbar() {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 100, y: 100 })
  const offsetRef = useRef({ x: 0, y: 0 });
  const toolbarRef = useRef(null)

  function handleDragStart(event) {
    const rect = toolbarRef.current.getBoundingClientRect();

    console.log(rect)

    offsetRef.current = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };

    setIsDragging(true);
    event.preventDefault();
  }

  useEffect(() => {
    console.log(offsetRef.current.x, offsetRef.current.y)
  }, [offsetRef.current.x, offsetRef.current.y])

  useEffect(() => {
    function handleMouseMove(event) {
      if (!isDragging) return;

      console.log(event.clientX)
      setPosition({
        x: event.clientX + offsetRef.current.x,
        // x: offsetRef.current.x,
        // x: event.clientX,
        y: event.clientY - offsetRef.current.y,
      });
    }

    function handleMouseUp() {
      setIsDragging(false);
    }

    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div
      ref={toolbarRef}
      id="crhmext-toolbar"
      className="crhmext-toolbar-container"
      style={{
        left: position.x,
        top: position.y,
        cursor: isDragging ? "grabbing" : "default",
      }}
    >
      {/* Drag and drop toolbar */}
      <button
        className="crhmext-toolbar-grab"
        onMouseDown={handleDragStart}
        style={{
          cursor: "grab"
        }}
      >
        <Icons value='drag' />
      </button>
      <h1>TOOLBAR</h1>
    </div>
  );
}