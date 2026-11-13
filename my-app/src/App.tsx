import { Routes, Route, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "./lib/supabase";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Appointments from "./pages/Appointments";
import Documents from "./pages/Documents";
import Gencare from "./pages/GeneralCare";
import Notfound from "./pages/NotFound";

// Loads the page needed 
//Uses JSX
export default function App() {
  //Holds who is logged in 
  const [session, setSession] = useState<Session | null>(null);

  //Stays true while we are checking if someone is logged in (prevents login screen for someone logged in)
  const [checking, setChecking] = useState(true);

  //Start supabase
  //useEffect runs code after the first page appears  
  useEffect(() => {
    //See if someone is logged in
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setChecking(false);
    });

    //Listen for any login and log out 
    const { data } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    //Clean up 
    return () => data.subscription.unsubscribe();
  }, []);

  //Handles if there is an early return from useEffect 
  //If we are still checking show loading
  if (checking) return <p className="p-4">Loading...</p>

  //Else return the login page 
  if (!session) return <Login />;

  return(
    <div>
      {/*Shows only the matching page*/}
      {/*Looks at the URL and renders only the matching page*/}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/appointments" element={<Appointments />} />
        <Route path="/general" element={<Gencare />} />
        <Route path="/documents" element={<Documents />} />
        <Route path="*" element={<Notfound />} />
      </Routes>
    </div>
  );
}