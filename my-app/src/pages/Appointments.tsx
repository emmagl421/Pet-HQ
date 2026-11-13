import { useEffect, useState } from "react";
import type { SubmitEvent } from "react";
import Sidebar from "../components/Sidebar";
import { supabase } from "../lib/supabase";
import "./pages.css";

//An appointment shape 
type Appointment = {
    id: number;
    title: string;
    starts_at: string,
    place: string | null;
    notes: string | null;
    outcome: string | null;
};

//List of columns we ask from supabase 
const COLUMNS = "id, title, starts_at, place, notes, outcome";

//Formatters for the date 
//Iso is the name of the standard date format for databases 
function monthOf(iso: string) {
    return new Date(iso).toLocaleDateString("en-US", { month: "short"});
}

function dayOf(iso: string) {
    return new Date(iso).getDate();
}

function weekdayTime(iso: string) {
    const d = new Date(iso);
    const weekday = d.toLocaleDateString("en-US", {weekday: "long" });
    const clock = d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
    return `${weekday} at ${clock}`;
}

function shortDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric"});
}


//Appointments page setup
export default function Appointments() {
    {/**
        State = data that can change 
        If it changes, redraw page 
        appointments = current state value 
        setAppointments = modifer function that updates state and triggers rerender
    */}
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [petId, setPetId] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    //One state per form field 
    const [title, setTitle] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [place , setPlace] = useState("");
    const [notes, setNotes] = useState("");
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        //Load data from supabase
        async function load() {
            //Gets the pets id
            const petResult = await supabase.from("pets").select("id").limit(1).maybeSingle();

            //Get the appointments
            const apptResult = await supabase
                .from("appointments")
                .select(COLUMNS)
                .order("starts_at", { ascending: true });

            //If there is an error tell the user and print to the console 
            if (petResult.error || apptResult.error) {
                setError("Couldn't load your appointments. Try refreshing the page.");
                console.error(petResult.error || apptResult.error);
            }
            else {
                //If there is data then get it else stop 
                setPetId(petResult.data?.id ?? null);
                setAppointments(apptResult.data as Appointment[]);
            }
            setLoading(false);
        }
        load();
    }, []);

    //Sorts the list by spliting into 2 and comparing it to right now 
    const now = new Date();
    const upcoming = appointments.filter((a) => new Date(a.starts_at) >= now);
    const past = appointments.filter((a) => new Date(a.starts_at) > now).reverse();

    //Adds an appointment 
    async function addAppointment(event: SubmitEvent<HTMLFormElement>) {
        //Prevent defaut refresh 
        event.preventDefault();

        //Make sure we have the pet id and send error if we don't 
        if (petId === null) {
            setError("Add a pet first, then add appointments.");
            return;
        }
        
        //Indicate that we are saving and reset error
        setSaving(true);
        setError("");

        //Add the date 
        const startsAt = new Date(`${date}T${time}`).toISOString();

        //Try and save the appointment by sending it to supabase
        const { data, error } = await supabase
            .from("appointments")
            .insert({
                pet_id: petId,
                title,
                starts_at: startsAt,
                place,
                notes: notes || null
            })
            .select(COLUMNS)
            .single();

            //Check for errors
            if (error) {
                setError("Couldn't save appointment. Please try again.");
                console.error(error);
            }
            else { 
                //Add the appointment to the appointments array and resort 
                const updated = [...appointments, data as Appointment].sort((a, b) => 
                    a.starts_at.localeCompare(b.starts_at)
                );
                setAppointments(updated);

                //Reset the fields to empty 
                setTitle("");
                setDate("");
                setTime("");
                setPlace("");
                setNotes("");
            }
            setSaving(false);
    }

    //Cancel an appointment
    async function cancelAppointment(id: number) {
        //Tell supabase to delete the appointment with given id
        const { error } = await supabase.from("appointments").delete().eq("id", id);

        //Check for errors 
        if (error) {
            setError("Couldn't cancel appointment. Please try again.");
            console.error(error);
        }
        else {
            //Remove the appointment from the array
            setAppointments(appointments.filter((a) => a.id !== id));
        }
        
    }
    
    return (
        <div className="container-fluid">
            <div className="row min-vh-100">
                <Sidebar />
        
                <main className="col-12 col-md-9 col-lg-10 main-content">
                <header className="page-header">
                    <h1>Appointments</h1>
                    <p className="page-subtitle">Vet visits, grooming and anything else on Mochi's calendar.</p>
                </header>

                {error && <p className="form-error mb-3" role="alert">{error}</p>}
        
                <div className="row g-4">
                    {/* Upcoming list */}
                    <section className="col-12 col-xl-7 content-section">
                    <h2>Upcoming</h2>
        
                    {loading ? (
                        <p className="empty-note">Loading…</p>
                    ) : upcoming.length === 0 ? (
                        <p className="empty-note">Nothing booked. Add an appointment to see it here.</p>
                    ) : (
                        <ul className="appt-list">
                        {upcoming.map((appt) => (
                            <li key={appt.id} className="appt-item">
                            <div className="date-tile" aria-hidden="true">
                                <span className="date-tile-month">{monthOf(appt.starts_at)}</span>
                                <span className="date-tile-day">{dayOf(appt.starts_at)}</span>
                            </div>
        
                            <div className="appt-body">
                                <h3 className="appt-title">{appt.title}</h3>
                                <p className="appt-when">
                                <time dateTime={appt.starts_at}>{weekdayTime(appt.starts_at)}</time>
                                </p>
                                {appt.place && <p className="appt-place">{appt.place}</p>}
                                {appt.notes && <p className="appt-notes">{appt.notes}</p>}
                            </div>
        
                            <button type="button" className="btn-quiet" onClick={() => cancelAppointment(appt.id)}>
                                Cancel
                            </button>
                            </li>
                        ))}
                        </ul>
                    )}
                    </section>
        
                    {/* Booking form */}
                    <section className="col-12 col-xl-5 content-section">
                    <div className="content-box">
                        <h2>Add an appointment</h2>
                        <form className="pt-form" onSubmit={addAppointment}>
                        <label className="pt-field">
                            <span>What for</span>
                            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Vaccine booster" required />
                        </label>
        
                        <div className="pt-field-row">
                            <label className="pt-field">
                            <span>Date</span>
                            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
                            </label>
                            <label className="pt-field">
                            <span>Time</span>
                            <input type="time" value={time} onChange={(e) => setTime(e.target.value)} required />
                            </label>
                        </div>
        
                        <label className="pt-field">
                            <span>Where</span>
                            <input type="text" value={place} onChange={(e) => setPlace(e.target.value)} placeholder="Blue Ridge Animal Clinic" required />
                        </label>
        
                        <label className="pt-field">
                            <span>Notes (optional)</span>
                            <textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Anything to bring or remember" />
                        </label>
        
                        <button type="submit" className="btn-pixel" disabled={saving}>
                            {saving ? "Saving…" : "Add appointment"}
                        </button>
                        </form>
                    </div>
                    </section>
                </div>
        
                {/* Past visits */}
                {!loading && past.length === 0 ? (
                    <p className="empty-note">No past visits yet.</p>
                ) : (
                    <ul className="recent-list">
                        {past.map((visit) => (
                        <li key={visit.id}>
                            <span className="file-tag">Visit</span>
                            <span className="recent-text">
                            {visit.title}
                            <span className="recent-sub">
                                {visit.place}
                                {visit.outcome && `. ${visit.outcome}.`}
                            </span>
                            </span>
                            <time className="recent-time" dateTime={visit.starts_at}>{shortDate(visit.starts_at)}</time>
                        </li>
                        ))}
                    </ul>
                    )}
        
                <footer className="page-footer">
                    <p>&copy; 2026 Pet Tracker</p>
                </footer>
                </main>
            </div>
            </div>
    );

}