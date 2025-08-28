import { useState, useEffect } from "react";
import { createContext } from 'react';
import Wrapper from './components/Wrapper';
import './styles/main.scss';

export default function App() {
  const MainContext = createContext(null);
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
    <MainContext>
      <Wrapper />
    </MainContext>
  );
}
