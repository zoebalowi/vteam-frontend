import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../../authUtils';
import "../../style/sidebar.css";

export default function Sidebar() {
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <div className="sidebar">
            <div className="logo">
                <img
                src={process.env.PUBLIC_URL + "/logga.png"}
                alt="VTeam logga"
                className="logo-img"
                />
            </div>
            <Link to="/">Home</Link>
            <br />
            <Link to="/maps">Go to Bikes</Link>
            <br />
            <Link to="/profile">Go to Profile</Link>
            <br />
            <Link to="/payments">Betalningar</Link>
            <br />
            <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
    );
}
