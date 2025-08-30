import { useState } from "react";

import screenshotView from '../screenshotView';

/**
 * Custom hook for handling screenshot functionality
 * Captures the current viewport and opens it in a new tab with annotations
 * @returns {Object} Hook utilities
 * @returns {boolean} loading - Whether screenshot capture is in progress
 * @returns {Function} handleScreenshot - Function to initiate screenshot capture
 */
export default function useScreenshot() {
  const [loading, setLoading] = useState(false);

  /**
   * Handles the screenshot capture process
   * 1. Sets loading state and hides toolbar
   * 2. Captures the current tab via Chrome extension API
   * 3. Processes and crops the image
   * 4. Opens the result in a new tab
   */
  const handleScreenshot = () => {
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

      // Send message to background script to capture tab
      // eslint-disable-next-line no-undef
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

          image.src = response.imgSrc;

          /**
           * Handles successful image loading and processing
           */
          image.onload = function () {
            const canvas = document.createElement("canvas");
            const scale = window.devicePixelRatio;

            // Set canvas dimensions based on the rect and device pixel ratio
            canvas.width = rect.width * scale;
            canvas.height = rect.height * scale;
            const ctx = canvas.getContext("2d");

            // Draw the cropped portion of the image to canvas
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
            );

            const screenshot = canvas.toDataURL();

            // Open the screenshot in a new tab with styled HTML
            screenshotView(screenshot);

            // Reset loading state after everything is completed
            setLoading(false);
          };

          /**
           * Handles image loading errors
           */
          image.onerror = function () {
            console.error("Failed to load the captured image.");
            setLoading(false);
          };
        }
      );
    }, DELAY);
  };

  return {
    loading,
    handleScreenshot
  };
}
