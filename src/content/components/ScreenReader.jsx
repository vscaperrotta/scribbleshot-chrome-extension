/* global chrome */
import { useState } from "react";

export default function ScreenReader() {
  const [loading, setLoading] = useState(false);

  const takeScreenshot = () => {
    setLoading(true);

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentTabId = tabs[0].id;
      chrome.tabs.captureVisibleTab(currentTabId, { format: "png" }, (dataUrl) => {
        if (chrome.runtime.lastError) {
          console.error("Errore screenshot:", chrome.runtime.lastError);
          setLoading(false);
          return;
        }

        // Crea un link per scaricare l'immagine
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = "screenshot.png";
        link.click();

        setLoading(false);
      });
    });
  };

  return (
    <div className="p-4">
      <button
        onClick={takeScreenshot}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        {loading ? "Sto catturando..." : "Cattura schermata"}
      </button>
    </div>
  );
}
