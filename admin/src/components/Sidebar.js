import { useNavigate } from "react-router-dom";

export default function Sidebar() {
    const navigate = useNavigate();

    function handleLogout() {
        localStorage.removeItem("token");
        navigate("/login");
    }

    return (
        <div className="sidebar">
            <div className="logo">
                <img
                src={process.env.PUBLIC_URL + "/logga.png"}
                alt="VTeam logga"
                className="logo-img"
                />
            </div>

            <a href="/">Dashboard</a>
            <a href="/scooters">Scooters</a>
            <a href="/stations">Stations</a>
            <a href="/users">Users</a>
            <a href="/reports">Reports</a>

            <button onClick={handleLogout} style={{marginTop: 24, width: "90%", alignSelf: "center"}}>
                Logga ut
            </button>
        </div>
    );
}
