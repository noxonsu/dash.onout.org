import WithWeb3Connect from "./components/WithWeb3Connect";
import UserProvider from "./components/UserProvider";
import Authentification from "./components/Authentification";
import Sections from "./components/Sections";

function App() {
  return (
    <div className="App">
      <UserProvider>
        <WithWeb3Connect>
          <div className="App-header">
            <Authentification />
          </div>

          <Sections />
        </WithWeb3Connect>
      </UserProvider>
    </div>
  );
}

export default App;
