/**
 * Screenshot Viewer
 * Handles image display, download, clipboard operations, and printing
 */

// Get image URL from URL parameters
const urlParams = new URLSearchParams(window.location.search);
const imageUrl = urlParams.get('image');

if (!imageUrl) {
  showError('No image provided');
} else {
  // Set the image source
  const screenshotImg = document.getElementById('screenshotImg');
  screenshotImg.src = imageUrl;
}

/**
 * Generates a filename with timestamp
 * @returns {string} Formatted filename with timestamp
 */
const generateFilename = () => {
  const now = new Date();
  const timestamp = now.toISOString()
    .replace(/[:.]/g, '-')
    .slice(0, -5);
  return `screenshot-${timestamp}.png`;
};

/**
 * Shows error message to user
 * @param {string} message - Error message to display
 */
function showError(message) {
  const errorEl = document.getElementById('errorMessage');
  errorEl.textContent = message;
  errorEl.style.display = 'block';
}

/**
 * Hides error message
 */
function hideError() {
  const errorEl = document.getElementById('errorMessage');
  errorEl.style.display = 'none';
}

/**
 * Shows loading indicator
 */
function showLoading() {
  document.getElementById('loading').style.display = 'block';
}

/**
 * Hides loading indicator
 */
function hideLoading() {
  document.getElementById('loading').style.display = 'none';
}

/**
 * Shows visual feedback on button after action
 * @param {HTMLElement} button - Button element to show feedback on
 * @param {string} message - Feedback message to display
 * @param {boolean} isSuccess - Whether the action was successful
 */
function showButtonFeedback(button, message, isSuccess = true) {
  const originalText = button.innerHTML;
  const icon = isSuccess ? '✅' : '❌';
  const color = isSuccess ? '#48bb78' : '#ac4242';

  button.innerHTML = `<span>${icon}</span> <span class="btn-text">${message}</span>`;
  button.style.background = color;
  button.disabled = true;

  setTimeout(() => {
    button.innerHTML = originalText;
    button.style.background = '';
    button.disabled = false;
  }, 2000);
}

/**
 * Handles image download functionality
 * Supports both data URLs and regular URLs with CORS handling
 * @async
 */
async function handleDownload() {
  const button = document.getElementById('downloadBtn');
  hideError();
  showLoading();

  try {
    let blob;

    // Handle different types of image URLs
    if (imageUrl.startsWith('data:')) {
      // For data URLs, convert directly to blob
      const response = await fetch(imageUrl);
      blob = await response.blob();
    } else {
      // For regular URLs, fetch with CORS handling
      const response = await fetch(imageUrl, {
        mode: 'cors',
        credentials: 'omit'
      });

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      blob = await response.blob();
    }

    // Create temporary URL for download
    const url = window.URL.createObjectURL(blob);

    // Create and click download link
    const link = document.createElement('a');
    link.href = url;
    link.download = generateFilename();
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();

    // Cleanup
    setTimeout(() => {
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    }, 100);

    showButtonFeedback(button, 'Downloaded!');
  } catch (error) {
    console.error('Download error:', error);

    // Fallback: try direct download
    try {
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = generateFilename();
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      showButtonFeedback(button, 'Downloaded!');
    } catch (fallbackError) {
      console.error('Fallback download error:', fallbackError);
      showError('Error downloading image. Try right-clicking on the image and select "Save image as...".');
      showButtonFeedback(button, 'Error!', false);
    }
  } finally {
    hideLoading();
  }
}

/**
 * Handles copying image to clipboard
 * Uses modern Clipboard API with fallback error handling
 * @async
 */
async function handleCopy() {
  const button = document.getElementById('copyBtn');
  hideError();
  showLoading();

  try {
    // Check API support
    if (!navigator.clipboard || !window.ClipboardItem) {
      throw new Error('Browser not supported');
    }

    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    const blob = await response.blob();

    await navigator.clipboard.write([
      new ClipboardItem({
        [blob.type]: blob
      })
    ]);

    showButtonFeedback(button, 'Copied!');
  } catch (error) {
    console.error('Copy error:', error);

    let errorMessage = 'Unable to copy to clipboard. ';
    if (error.message.includes('not supported')) {
      errorMessage += 'Browser does not support this feature.';
    } else {
      errorMessage += 'Try again or right-click on the image.';
    }

    showError(errorMessage);
    showButtonFeedback(button, 'Error!', false);
  } finally {
    hideLoading();
  }
}

/**
 * Handles print functionality
 */
function handlePrint() {
  window.print();
}

/**
 * Handles keyboard shortcuts
 * @param {KeyboardEvent} e - Keyboard event
 */
function handleKeydown(e) {
  if (e.ctrlKey || e.metaKey) {
    switch (e.key.toLowerCase()) {
      case 's':
        e.preventDefault();
        document.getElementById('downloadBtn').click();
        break;
      case 'c':
        if (e.shiftKey) {
          e.preventDefault();
          document.getElementById('copyBtn').click();
        }
        break;
    }
  }
}

/**
 * Handles image loading errors
 */
function handleImageError() {
  showError('Unable to load image. Please verify the URL is correct.');
}

/**
 * Handles successful image loading
 */
function handleImageLoad() {
  hideError();

  // Update page title with image info
  const timestamp = new Date().toLocaleString('en-US');
  document.title = `Screenshot - ${timestamp} - ScribbleShot`;
}

/**
 * Handles context menu events on image
 */
function handleContextMenu() {
  // Context menu opened for screenshot
}

/**
 * Initialize event listeners when DOM is loaded
 */
document.addEventListener('DOMContentLoaded', function () {
  // Event listeners
  document.getElementById('downloadBtn').addEventListener('click', handleDownload);
  document.getElementById('copyBtn').addEventListener('click', handleCopy);
  document.getElementById('printBtn').addEventListener('click', handlePrint);
  document.addEventListener('keydown', handleKeydown);

  const screenshotImg = document.getElementById('screenshotImg');
  screenshotImg.addEventListener('error', handleImageError);
  screenshotImg.addEventListener('load', handleImageLoad);
  screenshotImg.addEventListener('contextmenu', handleContextMenu);
});
