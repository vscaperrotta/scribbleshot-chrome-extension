import { useState, useEffect } from 'react';

function Wrapper() {

  const [active, setActive] = useState(false);

  useEffect(() => {
    function handleMessage(message) {
      if (message.action === 'INIT') {
        setActive((prevActive) => !prevActive);
      }
    }

    chrome.runtime.onMessage.addListener(handleMessage);

    return () => {
      chrome.runtime.onMessage.removeListener(handleMessage);
    };
  }, []);

  if (!active) return null;
  return (
    <div className="crhmext-page-wrapper">
      <h1>lorem ipsum</h1>
    </div>
  );
}

export default Wrapper;