import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";

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

                <Sidebar />
                
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