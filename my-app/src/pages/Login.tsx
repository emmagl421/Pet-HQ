import { useState } from "react";
import type { SubmitEvent } from "react";
import { supabase } from "../lib/supabase";
import "./pages.css";

export default function Login() {
    //Use state to moniter the the input boxes
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [busy, setBusy] = useState(false); //Track if we are waiting on supabase

    //Handles logging in by sending info to supabase and waiting for a response 
    //App.tsx listens for changes and, on successful login, will handle the page changes 
    async function handleLogin(event: SubmitEvent<HTMLFormElement>) {
        //Prevent a refresh and change to busy 
        event.preventDefault();
        setError("");
        setBusy(true);

        //Try to sign in and save the error of the returned object to check 
        const { error } = await supabase.auth.signInWithPassword({ email, password });

        //Check if there was an error and handle it if there was
        if (error) {
            setError(error.message);
        }

        //Set busy to false 
        setBusy(false);
    }

    //Return the login page 
    return (
        <main className="min-vh-100 d-flex align-items-center justify-content-center p-3">
        <div className="content-box login-box">
            <h1 className="login-title">Pet Tracker</h1>
            <p className="page-subtitle">Sign in to see your pet's records.</p>

            <form className="pt-form" onSubmit={handleLogin}>
            <label className="pt-field">
                <span>Email</span>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required />
            </label>

            <label className="pt-field">
                <span>Password</span>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required />
            </label>

            {error && <p className="form-error" role="alert">{error}</p>}

            <button type="submit" className="btn-pixel" disabled={busy}>
                {busy ? "Signing in…" : "Sign in"}
            </button>
            </form>
        </div>
        </main>
    );

}