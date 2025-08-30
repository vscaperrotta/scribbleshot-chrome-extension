import React from "react";

export default function screenshotView(image) {
  const screenshot = `<img src="${image}" alt="Cropped Screenshot" />`;

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
          <div>
            <button>Download PNG</button>
          </div>
          <div>
            ${screenshot}
          </div>
        </div>
      </body>
    </html>
  `);

  newWindow.document.close();
}