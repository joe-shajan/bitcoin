import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Explorer from "./pages/Explorer";
import Wallet from "./pages/Wallet";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Wallet />} />
        <Route path="/explorer" element={<Explorer />} />

      </Routes>
    </Router>
  );
}

export default App;
