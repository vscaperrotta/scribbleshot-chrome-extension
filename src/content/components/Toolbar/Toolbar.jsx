import { useRef, useState, useEffect } from "react";
import Icons from "../Icons";

export default function Toolbar({
  children = null
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [toolbarSize, setToolbarSize] = useState({ height: 0, width: 0, });
  const [position, setPosition] = useState({ x: window.innerWidth / 2 - toolbarSize / 2, y: 50 });
  const toolbarRef = useRef(null);
  const buttonRef = useRef(null);

  function handleDragStart(event) {
    setIsDragging(true);
    event.preventDefault();
  }

  useEffect(() => {
    function handleMouseMove(event) {
      if (!isDragging) return;

      setPosition({
        x: event.clientX,
        y: event.clientY,
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

  useEffect(() => {
    const toolbar = toolbarRef.current.getBoundingClientRect();
    const button = buttonRef.current.getBoundingClientRect();

    setToolbarSize({
      height: toolbar.height / 2,
      width: (toolbar.width / 2) - button.width
    })
  }, [])

  return (
    <div
      ref={toolbarRef}
      id="crhmext-toolbar"
      className="crhmext-toolbar-container"
      style={{
        border: isDragging ? '.063rem solid #fff' : 'none',
        left: position.x + toolbarSize.width,
        top: position.y - toolbarSize.height,
      }}
    >
      {/* Drag and drop toolbar */}
      <button
        ref={buttonRef}
        className="crhmext-toolbar-grab"
        onMouseDown={handleDragStart}
        style={{
          cursor: isDragging ? "grabbing" : "grab"
        }}
      >
        <Icons value='drag' />
      </button>

      {children}

    </div>
  );
}