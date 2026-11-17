import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import PetAvatar from "../components/PetAvatar";
import { supabase } from "../lib/supabase";
import { DEFAULT_AVATAR, type CatAvatar } from "../lib/catAvatar";

// Every input gives back text, so the form keeps everything as strings.
// We convert to numbers / null only when saving.
type PetForm = {
    name: string;
    species: string;
    breed: string;
    birth_date: string; // "2023-04-15", the same format a date input and Postgres use
    weight_kg: string;
    microchip: string;
};

const EMPTY_FORM: PetForm = {
    name: "",
    species: "",
    breed: "",
    birth_date: "",
    weight_kg: "",
    microchip: "",
};

// Empty boxes should be saved as "no value" (null), not as an empty string
function textOrNull(value: string) {
    const trimmed = value.trim();
    return trimmed === "" ? null : trimmed;
}

// Today's date as "YYYY-MM-DD" in your time zone, so the date picker can't pick a future birthday
function todayString() {
    const d = new Date();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${d.getFullYear()}-${month}-${day}`;
}

export default function EditPet() {
    const navigate = useNavigate();

    const [petId, setPetId] = useState<number | null>(null);
    const [form, setForm] = useState<PetForm>(EMPTY_FORM);
    const [avatar, setAvatar] = useState<CatAvatar>(DEFAULT_AVATAR);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");

    // ---------- READ: fill the form with the pet's current info ----------
    useEffect(() => {
        async function loadPet() {
            const { data, error } = await supabase
                .from("pets")
                .select("id, name, species, breed, birth_date, weight_kg, microchip, avatar")
                .limit(1)
                .maybeSingle();

            if (error) {
                console.error(error);
                setMessage("Couldn't load your pet. Try refreshing the page.");
            } else if (data) {
                setPetId(data.id);
                // ?? "" turns empty (null) columns into empty text boxes
                setForm({
                    name: data.name ?? "",
                    species: data.species ?? "",
                    breed: data.breed ?? "",
                    birth_date: data.birth_date ?? "",
                    weight_kg: data.weight_kg?.toString() ?? "",
                    microchip: data.microchip ?? "",
                });
                if (data.avatar) setAvatar(data.avatar as CatAvatar);
            }
            setLoading(false);
        }

        loadPet();
    }, []);

    // One function for every input: the input's "name" says which field to change
    function handleChange(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    }

    // ---------- UPDATE: save the form ----------
    async function handleSubmit(e: FormEvent) {
        e.preventDefault(); // stop the browser from reloading the page

        if (petId === null) {
            setMessage("Couldn't find your pet to save to.");
            return;
        }
        if (form.name.trim() === "") {
            setMessage("Your pet needs a name.");
            return;
        }

        const weight = form.weight_kg.trim() === "" ? null : Number(form.weight_kg);
        if (weight !== null && (Number.isNaN(weight) || weight <= 0)) {
            setMessage("Weight should be a number above 0.");
            return;
        }

        setSaving(true);
        setMessage("");

        const { error } = await supabase
            .from("pets")
            .update({
                name: form.name.trim(),
                species: textOrNull(form.species),
                breed: textOrNull(form.breed),
                birth_date: form.birth_date || null,
                weight_kg: weight,
                microchip: textOrNull(form.microchip),
            })
            .eq("id", petId);

        setSaving(false);

        if (error) {
            console.error(error);
            setMessage("Couldn't save. Try again.");
            return;
        }

        navigate("/"); // Home reloads the sidebar, so the new name shows up
    }

    return (
        <div className="container-fluid">
            <div className="row min-vh-100">
                <Sidebar />

                <main className="col-12 col-md-9 col-lg-10 main-content">
                    <header className="page-header">
                        <h1>Edit pet info</h1>
                        <p className="page-subtitle">Update {form.name || "your pet"}'s details.</p>
                    </header>

                    {loading ? (
                        <p>Loading…</p>
                    ) : (
                        <section className="content-section">
                            <div className="edit-pet">
                                {/* Left: avatar preview */}
                                <div className="edit-pet-avatar">
                                    <div className="pet-frame">
                                        <PetAvatar avatar={avatar} size={128} label={`Avatar of ${form.name || "your pet"}`} />
                                    </div>
                                    <button type="button" className="btn-quiet" onClick={() => navigate("/avatar")}>
                                        Change avatar
                                    </button>
                                </div>

                                {/* Right: the form */}
                                <form className="edit-pet-form" onSubmit={handleSubmit} noValidate>
                                    <div className="row g-3">
                                        <div className="col-12 col-md-6">
                                            <label className="form-label" htmlFor="pet-name">Name</label>
                                            <input
                                                id="pet-name"
                                                name="name"
                                                className="form-control"
                                                value={form.name}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>

                                        <div className="col-12 col-md-6">
                                            <label className="form-label" htmlFor="pet-birth-date">Birthday</label>
                                            <input
                                                id="pet-birth-date"
                                                name="birth_date"
                                                type="date"
                                                className="form-control"
                                                value={form.birth_date}
                                                max={todayString()}
                                                onChange={handleChange}
                                            />
                                        </div>

                                        <div className="col-12 col-md-6">
                                            <label className="form-label" htmlFor="pet-species">Species</label>
                                            <select
                                                id="pet-species"
                                                name="species"
                                                className="form-select"
                                                value={form.species}
                                                onChange={handleChange}
                                            >
                                                <option value="">Choose…</option>
                                                <option value="Cat">Cat</option>
                                                <option value="Dog">Dog</option>
                                                <option value="Rabbit">Rabbit</option>
                                                <option value="Bird">Bird</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>

                                        <div className="col-12 col-md-6">
                                            <label className="form-label" htmlFor="pet-breed">Breed</label>
                                            <input
                                                id="pet-breed"
                                                name="breed"
                                                className="form-control"
                                                value={form.breed}
                                                onChange={handleChange}
                                            />
                                        </div>

                                        <div className="col-12 col-md-6">
                                            <label className="form-label" htmlFor="pet-weight">Weight (kg)</label>
                                            <input
                                                id="pet-weight"
                                                name="weight_kg"
                                                type="number"
                                                step="0.1"
                                                min="0"
                                                className="form-control"
                                                value={form.weight_kg}
                                                onChange={handleChange}
                                            />
                                        </div>

                                        <div className="col-12 col-md-6">
                                            <label className="form-label" htmlFor="pet-microchip">Microchip number</label>
                                            <input
                                                id="pet-microchip"
                                                name="microchip"
                                                className="form-control"
                                                value={form.microchip}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>

                                    {message && <p className="form-message" role="status">{message}</p>}

                                    <div className="edit-pet-actions">
                                        <button type="button" className="btn-quiet" onClick={() => navigate(-1)}>
                                            Cancel
                                        </button>
                                        <button type="submit" className="save-avatar-btn" disabled={saving}>
                                            {saving ? "Saving…" : "Save changes"}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </section>
                    )}
                </main>
            </div>
        </div>
    );
}