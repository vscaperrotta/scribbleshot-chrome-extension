/**
 * Opens a screenshot in a new tab for viewing and sharing
 * @param {string} image - Base64 encoded image data or image URL
 * @description This function creates a new browser tab to display the screenshot
 * using the extension's screenshot.html page. The image data is passed as a URL parameter.
 * If popup blocking is enabled, it shows an alert to guide the user.
 * @example
 * screenshotView('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...')
 */
export default function screenshotView(image) {
  // Encode the image data to safely pass it as a URL parameter
  const encodedImage = encodeURIComponent(image);

  // Get the extension's screenshot.html page URL
  const extensionUrl = chrome.runtime.getURL('screenshot.html');

  // Construct the full URL with the encoded image as a query parameter
  const screenshotUrl = `${extensionUrl}?image=${encodedImage}`;

  // Open the screenshot in a new tab
  const newTab = window.open(screenshotUrl, '_blank');

  // Focus on the new tab if it opened successfully, otherwise show popup blocked alert
  if (newTab) {
    newTab.focus();
  } else {
    alert('Il popup è stato bloccato. Abilita i popup per questa estensione nelle impostazioni del browser.');
  }
}