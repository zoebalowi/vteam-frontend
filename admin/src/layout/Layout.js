import "../styles/layout.css";
import "../styles/sidebar.css";
import "../styles/page.css";
import "../styles/widgets.css";
import "../styles/tables.css";

import Sidebar from "../components/Sidebar";

export default function Layout({ children }) {
    return (
        <div className="layout">
            <Sidebar />

            <div className="main-area">
                <div className="main-content">{children}</div>
            </div>
        </div>
    );
}
