import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import { getToken } from "./authUtils";
import Layout from "./layout/Layout";
import Login from "./components/login";
import OAuthCallback from "./components/OAuthCallback";

import Home from "./components/home";
import Maps from "./components/maps";
import Profile from "./components/profile";
import Payments from "./components/payments";

function App() {
  const token = getToken();

  return (
    <Router>
      <Routes>
        {/* Callback för OAuth */}
        <Route path="/callback" element={<OAuthCallback />} />

        {/* Om ingen token, visa login */}
        {!token && <Route path="*" element={<Login />} />}

        {/* Om token finns, visa app */}
        {token && (
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/maps" element={<Maps />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/payments" element={<Payments />} />
          </Route>
        )}

        {/* Login alltid tillgänglig */}
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
