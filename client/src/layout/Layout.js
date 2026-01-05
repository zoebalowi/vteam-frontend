import { Outlet } from "react-router-dom";
import "../style/sidebar.css";
import Sidebar from "../components/sidebar";

export default function Layout() {
  return (
    <div className="layout">
      <Sidebar />  {/* ← alltid synlig */}
      
      <div className="main-area">
        <div className="main-content">
          <Outlet /> {/* ← innehåll byts här */}
        </div>
      </div>
    </div>
  );
}
