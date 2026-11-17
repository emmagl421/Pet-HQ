import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { supabase } from "../lib/supabase";
import PetAvatar from "./PetAvatar";
import { DEFAULT_AVATAR, type CatAvatar } from "../lib/catAvatar";

const AVATAR_SIZE = 128;
{/* 
    Sidebar used by everypage 
    Uses NavLink to automatically add the 'active' class
*/}
export default function Sidebar() {

    const [petName, setPetName] = useState("");
    const [avatar, setAvatar] = useState<CatAvatar>(DEFAULT_AVATAR);
    useEffect(() => {
        async function loadPet() {
            const { data, error } = await supabase.from("pets").select("name, avatar").limit(1).maybeSingle();

            if (error) {
                console.error(error);
            }
            else {
                setPetName(data?.name ?? "");
                setAvatar((data?.avatar as CatAvatar | null) ?? DEFAULT_AVATAR);
            }
        }

        loadPet();
    }, []);

    return (<aside className="col-12 col-md-3 col-lg-2 sidebar p-0">
      <div className="sidebar-inner">
            {/* Pet portrait (top left) */}
            <div className="pet-card">
            <div className="pet-frame">
                <PetAvatar avatar={avatar} size={AVATAR_SIZE} label={`Pixel portrait of ${petName || "your pet"}`} />
            </div>
        
            <div className="pet-info">
                <p className="pet-name">{petName || "Your pet"}</p>
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

            <button type="button" className="btn-quiet sidebar-signout" onClick={() => supabase.auth.signOut()}>
                Sign out
            </button>

        </div>
        </aside>
    );
}