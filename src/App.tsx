import WithWeb3Connect from "./components/WithWeb3Connect";
import UserProvider from "./components/User";
import Authentification from "./components/Authentification";
import Sections from "./components/Sections";

function App() {
  return (
    <div className="App">
      <WithWeb3Connect>
        <UserProvider>
          <div className="App-header">
            <Authentification />
          </div>

          <Sections />
        </UserProvider>
      </WithWeb3Connect>
    </div>
  );
}

export default App;
