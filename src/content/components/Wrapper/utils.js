/**
 * Creates a history object that stores a canvas state.
 * @param {string} url - The data URL representing the canvas state.
 * @returns {{dataUrl: string, timestamp: number, id: string}} - The history object.
 */
function createHistoryObj(url) {
  return {
    dataUrl: url,
    timestamp: Date.now(),
    id: Math.random().toString(36)
  }
}

/**
 * Saves the current state of the canvas into history and clears the redo stack.
 * @param {Object} params
 * @param {React.RefObject<HTMLCanvasElement>} params.canvasRef - Reference to the canvas element.
 * @param {Function} params.setHistory - State setter function for history stack.
 * @param {Function} params.setRedoStack - State setter function for redo stack.
 */
export function saveState({
  canvasRef,
  setHistory,
  setRedoStack
}) {
  const canvas = canvasRef.current;
  const dataUrl = canvas.toDataURL();
  const obj = createHistoryObj(dataUrl);
  setHistory((prev) => [...prev, obj]);
  setRedoStack([]);
};

/**
 * Clears the canvas and saves the cleared state into history.
 * @param {Object} params
 * @param {React.RefObject<HTMLCanvasElement>} params.canvasRef - Reference to the canvas element.
 * @param {Function} params.setHistory - State setter function for history stack.
 * @param {Function} params.setRedoStack - State setter function for redo stack.
 */
export function handleClear({
  canvasRef,
  setHistory,
  setRedoStack
}) {
  const canvas = canvasRef.current;
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  saveState({
    canvasRef,
    setHistory,
    setRedoStack
  });
}

/**
 * Undoes the last action on the canvas by reverting to the previous state.
 * Saves the current state into the redo stack.
 * @param {Object} params
 * @param {React.RefObject<HTMLCanvasElement>} params.canvasRef - Reference to the canvas element.
 * @param {Array} params.history - Array of saved canvas states (history).
 * @param {Function} params.setHistory - State setter function for history stack.
 * @param {Function} params.setRedoStack - State setter function for redo stack.
 */
export function handleUndo({
  canvasRef,
  history,
  setHistory,
  setRedoStack
}) {
  if (history.length === 0) return;
  const canvas = canvasRef.current;
  const ctx = canvas.getContext("2d");

  const lastState = history[history.length - 1];
  const currentState = createHistoryObj(canvas.toDataURL());

  setRedoStack((prev) => [...prev, currentState]);
  const newHistory = history.slice(0, -1);
  setHistory(newHistory);

  const img = new Image();
  img.src = lastState.dataUrl;
  img.onload = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (newHistory.length > 0) {
      const prevImg = new Image();
      const prevState = newHistory[newHistory.length - 1];
      prevImg.src = prevState.dataUrl;
      prevImg.onload = () => ctx.drawImage(prevImg, 0, 0);
    }
  };
}

/**
 * Redoes the last undone action by restoring the next state from the redo stack.
 * @param {Object} params
 * @param {React.RefObject<HTMLCanvasElement>} params.canvasRef - Reference to the canvas element.
 * @param {Array} params.redoStack - Array of saved canvas states (redo stack).
 * @param {Function} params.setRedoStack - State setter function for redo stack.
 * @param {Function} params.setHistory - State setter function for history stack.
 */
export function handleRedo({
  canvasRef,
  redoStack,
  setRedoStack,
  setHistory
}) {
  if (redoStack.length === 0) return;
  const canvas = canvasRef.current;
  const ctx = canvas.getContext("2d");

  const next = redoStack[redoStack.length - 1];

  setRedoStack(redoStack.slice(0, -1));
  setHistory((prev) => [...prev, next]);

  const img = new Image();
  img.src = next.dataUrl;
  img.onload = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);
  };
}
