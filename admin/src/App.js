import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./layout/Layout";

import DashboardPage from "./pages/DashboardPage";
import ScootersPage from "./pages/ScootersPage";
import StationsPage from "./pages/StationsPage";
import UsersPage from "./pages/UsersPage";
import ReportsPage from "./pages/ReportsPage";

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/scooters" element={<ScootersPage />} />
          <Route path="/stations" element={<StationsPage />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/reports" element={<ReportsPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}
