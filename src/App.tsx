import WithWeb3Connect from "./components/WithWeb3Connect";
import UserProvider from "./components/UserProvider";
import Authentification from "./components/Authentification";
import Sections from "./components/Sections";
import Footer from "./components/Footer";

function App() {
  return (
    <div className="app">
      <UserProvider>
        <WithWeb3Connect>
          <Authentification />

          <Sections />

          <Footer />
        </WithWeb3Connect>
      </UserProvider>
    </div>
  );
}

export default App;
