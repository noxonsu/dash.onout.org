import Authentification from "./conponents/Authentification";
import WithWeb3Connect from "./conponents/WithWeb3Connect";
import UserProducts from "./conponents/UserProducts";

function App() {
  const signed = false;

  return (
    <div className="App">
      <WithWeb3Connect>
        <div className="App-header"></div>
        <Authentification />
        {signed && <UserProducts />}
      </WithWeb3Connect>
    </div>
  );
}

export default App;
