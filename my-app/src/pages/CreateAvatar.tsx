import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import Sidebar from "../components/Sidebar";
import PetAvatar from "../components/PetAvatar";
import { COATS, PATTERNS, EYES, DEFAULT_AVATAR, type CatAvatar } from "../lib/catAvatar";

//The things you can change about you pet avatar 
type Category = keyof CatAvatar; // coat | pattern | eyes

const CATEGORIES: { id: Category; label: string }[] = [
    { id: "coat", label: "Color" },
    { id: "pattern", label: "Coat pattern" },
    { id: "eyes", label: "Eye color" }
];

//Connects the list of options with the correct category 
const OPTIONS: Record<Category, Record<string, { label: string }>> = {
    coat: COATS,
    pattern: PATTERNS,
    eyes: EYES
};


export default function CreateAvatar() {
    const [avatar, setAvatar] = useState<CatAvatar>(DEFAULT_AVATAR);
    const [category, setCategory] = useState<Category>("coat");
    const ids = Object.keys(OPTIONS[category]);
    const index = ids.indexOf(avatar[category]);
    const currentLabel = OPTIONS[category][avatar[category]]?.label ?? "";

    const [petId, setPetId] = useState<number | null>(null);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    //Loads the pet when the page loads 
    useEffect(() => {
        async function loadPet() {
            const { data, error } = await supabase.from("pets").select("id, avatar").limit(1).maybeSingle();

            if (error) {
                console.error(error);
                setMessage("Couldn't load your pet. Please refresh the page.");
                return;
            }
            if (data) {
                setPetId(data.id);
                if (data.avatar) {
                    setAvatar(data.avatar as CatAvatar);
                }
            }            
        }

        loadPet();
    }, []);

    // Wrap around for the options
    function step(direction: 1 | -1) {
        const nextIndex = (index + direction + ids.length) % ids.length;
        setAvatar({ ...avatar, [category]: ids[nextIndex] } as CatAvatar);
    }

    //Saves the created avatar
    async function saveAvatar() {
        if (petId === null) {
            setMessage('Add a pet first, then create an avater.');
            return;
        }

        setSaving(true);
        setMessage("");

        const {error} =await supabase.from("pets").update({avatar}).eq("id", petId);

        setSaving(false);

        if (error) {
            console.error(error);
            setMessage("Couldn't save your avatar. Please try again.");
            return;
        }

        navigate("/pet");
    }

    return (
        <div className="container-fluid">
            <div className="row min-vh-100">
                <Sidebar />

                <main className="col-12 col-md-9 col-lg-10 main-content">
                    <header className="page-header">
                        <h1>Create your pet's avatar</h1>
                        <p className="page-subtitle">Pick a coat, pattern and eye color.</p>
                    </header>

                    <div className="avatar-editor">
                        {/* Left: the menu */}
                        <nav className="avatar-menu" aria-label="Avatar options">
                            {CATEGORIES.map((c) => (
                            <button
                                key={c.id}
                                type="button"
                                className={`avatar-menu-item ${category === c.id ? "active" : ""}`}
                                aria-pressed={category === c.id}
                                onClick={() => setCategory(c.id)}
                            >
                                {c.label}
                            </button>
                            ))}
                        </nav>

                        {/* Center: the cat, with the arrows underneath */}
                        <div className="avatar-center">
                            <div className="avatar-stage">
                            <PetAvatar avatar={avatar} size={512} label="Preview of your pet's avatar" />
                            </div>

                            <div className="option-stepper">
                            <button type="button" className="stepper-arrow" aria-label="Previous option" onClick={() => step(-1)}>
                                ‹
                            </button>
                            <span className="stepper-name" aria-live="polite">{currentLabel}</span>
                            <button type="button" className="stepper-arrow" aria-label="Next option" onClick={() => step(1)}>
                                ›
                            </button>
                            </div>
                            <p className="stepper-count">{index + 1} / {ids.length}</p>

                            <div className="avatar-actions">
                                <button type="button" className="btn-quiet" onClick={() => navigate(-1)}>
                                    Cancel
                                </button>
                                <button type="button" className="save-avatar-btn" onClick={saveAvatar} disabled={saving}>
                                    {saving ? "Saving…" : "Save avatar"}
                                </button>
                            </div>

                                {message && <p className="avatar-message" role="status">{message}</p>}
                        </div>
                        </div>
                </main>
            </div>
        </div>
    );
}