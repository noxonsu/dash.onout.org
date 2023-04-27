import { useEffect } from "react";
import GA from 'react-ga';
import WithWeb3Connect from "./components/WithWeb3Connect";
import UserProvider from "./components/UserProvider";
import Authentification from "./components/Authentification";
import Sections from "./components/Sections";
import Footer from "./components/Footer";
import { GA_TRACKING_ID } from './constants'
import { HashRouter } from "react-router-dom";

function App() {

  const setGA = () => {
    const { pathname, search, hostname } = window.location;

    GA.initialize(hostname === 'localhost' ? '' : GA_TRACKING_ID, { // disable tracking during development
      debug: false, // use "true" to develop Google Analytics features
    });

    const pageView = `${pathname || ''}${search || ''}`;

    GA.pageview(pageView || 'Init page view');
  };

  useEffect(() => {
    setGA();
  }, [])

  return (
    <div className="app">
      <HashRouter>
        <UserProvider>
          <WithWeb3Connect>
            <Authentification />

            <Sections />
            
            <Footer />
          </WithWeb3Connect>
        </UserProvider>
      </HashRouter>
    </div>
  );
}

export default App;
