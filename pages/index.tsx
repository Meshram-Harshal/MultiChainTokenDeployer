import { useEffect } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import MainPage from './MainPage';

export default function Home() {
  useEffect(() => {
    // Any client-side code that interacts with `document` should go here
    const rootElement = document.getElementById('root');
    if (rootElement) {
      // Your client-side logic here
    }
  }, []);

  return (
    <div id="root" className="bg-gray-950 min-h-screen text-white">
     <div className=" flex justify-end p-2">
     <ConnectButton />
     </div>
      <MainPage />
    </div>
  );
}
