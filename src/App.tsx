import Authentification from "./conponents/Authentification";
import WithWeb3Connect from "./conponents/WithWeb3Connect";

function App() {
  return (
    <div className="App">
      <WithWeb3Connect>
        <div className="App-header"></div>
        <Authentification />
      </WithWeb3Connect>
    </div>
  );
}

export default App;