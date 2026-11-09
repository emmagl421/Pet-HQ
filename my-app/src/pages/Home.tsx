import { useNavigate } from "react-router-dom";

export default function Home() {
    //Hook = gives components extra abilities (must be called at the top of component)
    const navigate = useNavigate();

    //Functions use the hook to change pages 
    //Can run logic first like checking forms before switch
    function goToAppointments() {
        console.log("Going to appointment page...");
        navigate("/appointments");
    }

    function goToDocuments() {
        console.log("Going to documents page...");
        navigate("/documents");
    }

    function goToGeneralCare() {
        console.log("Going to gerneral care page...");
        navigate("/general");
    }

    function goToHome() {
        console.log("Going to home page...");
        navigate("/");
    }

    return (
         <div className="container-fluid">
            <div className="row min-vh-100">

                {/* Aside menu */}
                <aside className="col-12 col-md-3 col-lg-2 sidebar p-0">
                <div className="sidebar-inner">

                    {/* Pet portrait (top left) */}
                    <div className="pet-card">
                    <div className="pet-frame">
                        {/*
                        Animated pixel pet. To use your own pixel art instead, replace the <svg>
                        with: <img className="pet-sprite" src="/images/my-pet.png" alt="Pixel portrait of Mochi" />
                        */}
                        <svg className="pet-sprite" viewBox="0 0 16 16" role="img" aria-label="Pixel portrait of Mochi the cat">
                        {/* shadow (stays still) */}
                        <rect className="pet-shadow" x="4" y="15" width="8" height="1" />

                        <g className="pet-body">
                            {/* tail */}
                            <g className="pet-tail">
                            <rect className="fur" x="12" y="11" width="2" height="1" />
                            <rect className="fur" x="13" y="9" width="1" height="2" />
                            </g>
                            {/* ears */}
                            <rect className="fur" x="3" y="2" width="2" height="2" />
                            <rect className="fur" x="11" y="2" width="2" height="2" />
                            <rect className="pink" x="4" y="3" width="1" height="1" />
                            <rect className="pink" x="11" y="3" width="1" height="1" />
                            {/* head */}
                            <rect className="fur" x="3" y="4" width="10" height="6" />
                            {/* eyes */}
                            <g className="pet-eyes">
                            <rect className="eye" x="5" y="6" width="2" height="2" />
                            <rect className="eye" x="9" y="6" width="2" height="2" />
                            </g>
                            {/* nose */}
                            <rect className="pink" x="7" y="8" width="2" height="1" />
                            {/* body + belly */}
                            <rect className="fur" x="4" y="10" width="8" height="4" />
                            <rect className="belly" x="6" y="11" width="4" height="3" />
                            {/* feet */}
                            <rect className="fur-dark" x="4" y="14" width="2" height="1" />
                            <rect className="fur-dark" x="10" y="14" width="2" height="1" />
                        </g>
                        </svg>
                    </div>

                    <div className="pet-info">
                        <p className="pet-name">Mochi</p>
                        <p className="pet-status">Fed 2 hrs ago</p>
                    </div>
                    </div>

                    <a href="#" className="sidebar-brand">Pet Tracker</a>

                    <nav aria-label="Main menu">
                    <ul className="nav flex-column">
                        <li className="nav-item"><button type="button" className="nav-link active" aria-current="page" onClick={goToHome}>Home</button></li>
                        <li className="nav-item"><button type="button" className="nav-link" onClick={goToGeneralCare}>General Care</button></li>
                        <li className="nav-item"><button type="button" className="nav-link" onClick={goToDocuments}>Documents</button></li>
                        <li className="nav-item"><button type="button" className="nav-link" onClick={goToAppointments}>Appointments</button></li>
                    </ul>
                    </nav>
                </div>
                </aside>

                {/* Main area */}
                <main className="col-12 col-md-9 col-lg-10 main-content">
                <header className="page-header">
                    <h1>Home</h1>
                    <p className="page-subtitle">Here's what's been happening with Mochi.</p>
                </header>

                <section className="content-section">
                    <h2>Recent documents</h2>
                    <ul className="recent-list">
                    <li>
                        <span className="file-tag">PDF</span>
                        <a className="recent-text" href="#">Rabies vaccine certificate</a>
                        <time className="recent-time">Yesterday</time>
                    </li>
                    <li>
                        <span className="file-tag">JPG</span>
                        <a className="recent-text" href="#">Microchip registration</a>
                        <time className="recent-time">Oct 28</time>
                    </li>
                    <li>
                        <span className="file-tag">PDF</span>
                        <a className="recent-text" href="#">Pet insurance policy</a>
                        <time className="recent-time">Oct 15</time>
                    </li>
                    <li>
                        <span className="file-tag">PDF</span>
                        <a className="recent-text" href="#">Adoption papers</a>
                        <time className="recent-time">Sep 3</time>
                    </li>
                    </ul>
                </section>

                <section className="content-section">
                    <div className="row g-4">
                    <div className="col-12 col-lg-6">
                        <div className="content-box">
                        <h3>Next appointment</h3>
                        <p className="box-highlight">Annual checkup</p>
                        <p>Thursday, Nov 12 at 3:30 PM<br />Blue Ridge Animal Clinic</p>
                        </div>
                    </div>
                    <div className="col-12 col-lg-6">
                        <div className="content-box">
                        <h3>To-do</h3>
                        <ul className="todo-list">
                            <li>
                            <label className="todo-item">
                                <input type="checkbox" className="todo-check" />
                                <span className="todo-text">Buy more dry food</span>
                                <span className="todo-due">Today</span>
                            </label>
                            </li>
                            <li>
                            <label className="todo-item">
                                <input type="checkbox" className="todo-check" />
                                <span className="todo-text">Give flea medication</span>
                                <span className="todo-due">Fri</span>
                            </label>
                            </li>
                            <li>
                            <label className="todo-item">
                                <input type="checkbox" className="todo-check" />
                                <span className="todo-text">Upload records after checkup</span>
                                <span className="todo-due">Nov 12</span>
                            </label>
                            </li>
                            <li>
                            <label className="todo-item">
                                <input type="checkbox" className="todo-check" defaultChecked />
                                <span className="todo-text">Clean litter box</span>
                                <span className="todo-due">Done</span>
                            </label>
                            </li>
                        </ul>
                        </div>
                    </div>
                    </div>
                </section>

                <footer className="page-footer">
                    <p>&copy; 2026 Pet Tracker</p>
                </footer>
                </main>

            </div>
            </div>
        );
}