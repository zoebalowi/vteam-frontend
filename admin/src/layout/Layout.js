import { Outlet } from "react-router-dom";
import "../styles/layout.css";
import "../styles/sidebar.css";
import "../styles/page.css";
import "../styles/widgets.css";
import "../styles/tables.css";

import Sidebar from "../components/Sidebar";

export default function Layout() {
  return (
    <div className="layout">
      <Sidebar />

      <div className="main-area">
        <div className="main-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
