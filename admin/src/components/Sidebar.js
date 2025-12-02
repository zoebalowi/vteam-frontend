export default function Sidebar() {
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
        </div>
    );
}
