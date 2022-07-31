import "./App.css";
import { Navbar, Footer } from "./components";
import { Main, Profile, Item, Create } from "./pages";
import { HashRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="app__app">
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="nft/:id" element={<Item />} />
          <Route path="/create" element={<Create />} />        
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
