import { useState } from "react";

export default function useScreenshot() {
  const [loading, setLoading] = useState(false);

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
          image.onload = function () {
            const canvas = document.createElement("canvas");
            const scale = window.devicePixelRatio;

            // Set canvas dimensions based on the rect
            canvas.width = rect.width * scale;
            canvas.height = rect.height * scale;
            const ctx = canvas.getContext("2d");

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
            );

            const croppedImage = canvas.toDataURL();

            // Open the cropped image in a new tab
            const newWindow = window.open();
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
            `);
            newWindow.document.close();

            // Reset loading state after everything is done
            setLoading(false);
          };

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
