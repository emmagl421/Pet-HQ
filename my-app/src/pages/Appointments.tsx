import { useNavigate } from "react-router-dom";
import type { FormEvent } from "react";
import { useState } from "react";
import Sidebar from "../components/Sidebar";
import "./pages.css";

//An appointment shape 
type Appointment = {
    id: number;
    title: string;
    date: string;
    time: string;
    place: string;
    notes: string;
};

//Starting data (change later)
const startingAppointments: Appointment[] = [
    {id: 1, title: "Annual checkup", date: "2026-11-12", time: "15:30", place:"Blue Ridge Animal Clinic", notes: "No food after midnight" },
    { id: 2, title: "Dental cleaning", date: "2026-12-03", time: "09:00", place: "Blue Ridge Animal Clinic", notes: "No food after midnight" }
];

const pastVisits = [
  { id: 1, title: "Rabies booster", date: "Nov 8, 2026", place: "Blue Ridge Animal Clinic", outcome: "Certificate uploaded to Documents" },
  { id: 2, title: "Microchip scan", date: "Oct 28, 2026", place: "Blue Ridge Animal Clinic", outcome: "Chip registered" },
  { id: 3, title: "Grooming", date: "Sep 20, 2026", place: "Whiskers & Wags", outcome: "Nails trimmed" },
];

//Formatters for the date 
function monthOf(date: string) {
    return new Date(date + "T00:00").toLocaleDateString("en-US", { month: "short"});
}

function dayOf(date: string) {
    return new Date(date + "T00:00").getDate();
}

function weekdayTime(date: string, time: string) {
    const d= new date(`${date}T${time}`);
    const weekday = d.toLocaleDateString("en-US", {weekday: "long" });
    const clock = d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
    return `${weekday} at ${clock}`;
}


//Appointments page setup
export default function Appointments() {
    {/**
        State = data that can change 
        If it changes, redraw page 
        appointments = current state value 
        setAppointments = modifer function that updates state and triggers rerender
    */}
    const [appointments, setAppointments] = useState<Appointment[]>(startingAppointments);

    //One state per form field 
    const [title, setTitle] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [place , setPlace] = useState("");
    const [notes, setNotes] = useState("");

    //Adds an appointment 
    function addAppointment(event: FormEvent) {
        event.preventDefault();

        const newAppointment: Appointment = { id: Date.now(), title, date, time, place, notes };

        //Add it to the appointments and the sort by soonest 
        const updated = [...appointments, newAppointment].sort((a, b) => 
            `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`)
        );
        //Trigger rerender
        setAppointments(updated);

        //Clear the form 
        setTitle("");
        setDate("");
        setTime("");
        setPlace("");
        setNotes("");
    }

    //Cancel an appointment
    function cancelAppointment(id: number) {
        setAppointments(appointments.filter((a) => a.id !== id));
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
        
                <div className="row g-4">
                    {/* Upcoming list */}
                    <section className="col-12 col-xl-7 content-section">
                    <h2>Upcoming</h2>
        
                    {appointments.length === 0 ? (
                        <p className="empty-note">Nothing booked. Add an appointment to see it here.</p>
                    ) : (
                        <ul className="appt-list">
                        {appointments.map((appt) => (
                            <li key={appt.id} className="appt-item">
                            <div className="date-tile" aria-hidden="true">
                                <span className="date-tile-month">{monthOf(appt.date)}</span>
                                <span className="date-tile-day">{dayOf(appt.date)}</span>
                            </div>
        
                            <div className="appt-body">
                                <h3 className="appt-title">{appt.title}</h3>
                                <p className="appt-when">
                                <time dateTime={`${appt.date}T${appt.time}`}>{weekdayTime(appt.date, appt.time)}</time>
                                </p>
                                <p className="appt-place">{appt.place}</p>
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
        
                        <button type="submit" className="btn-pixel">Add appointment</button>
                        </form>
                    </div>
                    </section>
                </div>
        
                {/* Past visits */}
                <section className="content-section">
                    <h2>Past visits</h2>
                    <ul className="recent-list">
                    {pastVisits.map((visit) => (
                        <li key={visit.id}>
                        <span className="file-tag">Visit</span>
                        <span className="recent-text">
                            {visit.title}
                            <span className="recent-sub">{visit.place}. {visit.outcome}.</span>
                        </span>
                        <time className="recent-time">{visit.date}</time>
                        </li>
                    ))}
                    </ul>
                </section>
        
                <footer className="page-footer">
                    <p>&copy; 2026 Pet Tracker</p>
                </footer>
                </main>
            </div>
            </div>
    );

}