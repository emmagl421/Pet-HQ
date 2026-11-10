import { NavLink } from "react-router-dom";

{/* 
    Sidebar used by everypage 
    Uses NavLink to automatically add the 'active' class
*/}
export default function Sidebar() {
    return (<aside className="col-12 col-md-3 col-lg-2 sidebar p-0">
      <div className="sidebar-inner">
            {/* Pet portrait (top left) */}
            <div className="pet-card">
            <div className="pet-frame">
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
    
            <NavLink to="/" className="sidebar-brand">Pet Tracker</NavLink>
    
            <nav aria-label="Main menu">
            <ul className="nav flex-column">
                {/* "end" makes Home only active on exactly "/" (otherwise it matches every page) */}
                <li className="nav-item"><NavLink to="/" end className="nav-link">Home</NavLink></li>
                <li className="nav-item"><NavLink to="/general" className="nav-link">General Care</NavLink></li>
                <li className="nav-item"><NavLink to="/documents" className="nav-link">Documents</NavLink></li>
                <li className="nav-item"><NavLink to="/appointments" className="nav-link">Appointments</NavLink></li>
            </ul>
            </nav>
        </div>
        </aside>
    );
}