import { useState } from "react";
import Sidebar from "../components/Sidebar";
import PetAvatar from "../components/PetAvatar";
import { COATS, EYES, DEFAULT_AVATAR, type CatAvatar, type CoatId, type EyeId } from "../lib/catAvatar";


export default function CreateAvatar() {
    const [avatar, setAvatar] = useState<CatAvatar>(DEFAULT_AVATAR);
    const coatIds = Object.keys(COATS) as CoatId[];
    const eyeIds = Object.keys(EYES) as EyeId[];

    return (
        <div className="container-fluid">
            <div className="row min-vh-100">
                <Sidebar />

                <main className="col-12 col-md-9 col-lg-10 main-content">
                    <header className="page-header">
                        <h1>Create your pet's avatar</h1>
                        <p className="page-subtitle">Pick a coat, pattern and eye color.</p>
                    </header>

                    <section className="content-section">
                        <div className="row g-4">
                            {/* Left: the big preview */}
                            <div className="col-12 col-lg-6">
                                <div className="avatar-stage">
                                    <PetAvatar avatar={avatar} size={128} label="Preview of your pet's avatar" />
                                </div>
                            </div>

                            {/* Right: the options */}
                            <div className="col-12 col-lg-6">
                                <h2 className="avatar-option-title">Coat color</h2>
                                    <div className="swatch-row">
                                    {coatIds.map((id) => (
                                        <button
                                        key={id}
                                        type="button"
                                        className={`swatch ${avatar.coat === id ? "selected" : ""}`}
                                        style={{ backgroundColor: COATS[id].base }}
                                        aria-label={COATS[id].label}
                                        aria-pressed={avatar.coat === id}
                                        onClick={() => setAvatar({ ...avatar, coat: id })}
                                        />
                                    ))}
                                    </div>
                                    <h2 className="avatar-option-title">Eye color</h2>
                                    <div className="swatch-row">
                                    {eyeIds.map((id) => (
                                        <button
                                        key={id}
                                        type="button"
                                        className={`swatch ${avatar.eyes === id ? "selected" : ""}`}
                                        style={{ backgroundColor: EYES[id].color }}
                                        aria-label={EYES[id].label}
                                        aria-pressed={avatar.eyes === id}
                                        onClick={() => setAvatar({ ...avatar, eyes: id })}
                                        />
                                    ))}
                                    </div>
                            </div>
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
}