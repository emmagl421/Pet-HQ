import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { supabase } from "../lib/supabase";

// ---------- Types: one per table, matching the columns we ask for ----------
type Doc = {
    id: number;
    name: string;
    file_path: string;
    created_at: string;
};

type Appointment = {
    id: number;
    title: string;
    starts_at: string;
    place: string | null;
};

type Todo = {
    id: number;
    title: string;
    due_date: string | null; // "2026-11-17" (a date with no time)
    done: boolean;
};

// ---------- Helpers that turn database values into nice text ----------

// "documents/rabies.pdf" -> "PDF"
function fileTag(path: string) {
    return path.split(".").pop()?.toUpperCase() ?? "FILE";
}

// Same calendar day? (ignores the time)
function sameDay(a: Date, b: Date) {
    return a.toDateString() === b.toDateString();
}

// When a document was uploaded: "Today", "Yesterday" or "Oct 28"
function uploadedLabel(iso: string) {
    const d = new Date(iso);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (sameDay(d, today)) return "Today";
    if (sameDay(d, yesterday)) return "Yesterday";
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

// "Thursday, Nov 12 at 3:30 PM"
function appointmentLabel(iso: string) {
    const d = new Date(iso);
    const day = d.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" });
    const clock = d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
    return `${day} at ${clock}`;
}

// Due label for a to-do: "Done", "Today", "Fri" (this week) or "Nov 12"
function dueLabel(todo: Todo) {
    if (todo.done) return "Done";
    if (!todo.due_date) return "";

    // Adding "T00:00" makes JavaScript read the date in YOUR time zone.
    // Without it, "2026-11-17" is read as midnight UTC, which is the day before in New York.
    const due = new Date(todo.due_date + "T00:00");
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const daysAway = Math.round((due.getTime() - today.getTime()) / 86_400_000);

    if (daysAway < 0) return "Overdue";
    if (daysAway === 0) return "Today";
    if (daysAway < 7) return due.toLocaleDateString("en-US", { weekday: "short" });
    return due.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function Home() {
    const navigate = useNavigate();

    const [petName, setPetName] = useState("");
    const [documents, setDocuments] = useState<Doc[]>([]);
    const [nextAppointment, setNextAppointment] = useState<Appointment | null>(null);
    const [todos, setTodos] = useState<Todo[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // ---------- READ: load everything once when the page opens ----------
    useEffect(() => {
        async function load() {
            // Promise.all runs all four queries at the same time instead of one after another
            const [petResult, docResult, apptResult, todoResult] = await Promise.all([
                supabase.from("pets").select("name").limit(1).maybeSingle(),

                supabase
                    .from("documents")
                    .select("id, name, file_path, created_at")
                    .order("created_at", { ascending: false }) // newest first
                    .limit(4),

                supabase
                    .from("appointments")
                    .select("id, title, starts_at, place")
                    .gte("starts_at", new Date().toISOString()) // only ones that haven't happened yet
                    .order("starts_at", { ascending: true })    // soonest first
                    .limit(1)
                    .maybeSingle(),

                supabase
                    .from("todos")
                    .select("id, title, due_date, done")
                    .order("done", { ascending: true })                       // unfinished first
                    .order("due_date", { ascending: true, nullsFirst: false }) // then by due date
                    .limit(6),
            ]);

            const firstError = petResult.error || docResult.error || apptResult.error || todoResult.error;
            if (firstError) {
                console.error(firstError);
                setError("Couldn't load everything. Try refreshing the page.");
            }

            // Use whatever did load, even if one query failed
            setPetName(petResult.data?.name ?? "");
            setDocuments((docResult.data as Doc[] | null) ?? []);
            setNextAppointment((apptResult.data as Appointment | null) ?? null);
            setTodos((todoResult.data as Todo[] | null) ?? []);
            setLoading(false);
        }

        load();
    }, []);

    // ---------- Open a document ----------
    // The bucket is private, so we ask Supabase for a temporary link (valid for 60 seconds)
    async function openDocument(doc: Doc) {
        const { data, error } = await supabase.storage.from("documents").createSignedUrl(doc.file_path, 60);
        if (error) {
            console.error(error);
            setError(`Couldn't open "${doc.name}".`);
            return;
        }
        window.open(data.signedUrl, "_blank", "noopener");
    }

    // ---------- UPDATE: tick a to-do on or off ----------
    async function toggleTodo(todo: Todo) {
        const done = !todo.done;

        // Update the screen straight away so the checkbox feels instant...
        setTodos((prev) => prev.map((t) => (t.id === todo.id ? { ...t, done } : t)));

        // ...then save it
        const { error } = await supabase.from("todos").update({ done }).eq("id", todo.id);

        if (error) {
            // Saving failed, so put the checkbox back the way it was
            console.error(error);
            setTodos((prev) => prev.map((t) => (t.id === todo.id ? { ...t, done: todo.done } : t)));
            setError("Couldn't update that to-do. Try again.");
        }
    }

    return (
        <div className="container-fluid">
            <div className="row min-vh-100">

                <Sidebar />

                {/* Main area */}
                <main className="col-12 col-md-9 col-lg-10 main-content">
                    <header className="page-header">
                        <h1>Home</h1>
                        <p className="page-subtitle">
                            Here's what's been happening with {petName || "your pet"}.
                        </p>
                    </header>

                    {error && <p className="home-error" role="alert">{error}</p>}

                    {loading ? (
                        <p>Loading…</p>
                    ) : (
                        <>
                            <section className="content-section">
                                <h2>Recent documents</h2>

                                {documents.length === 0 ? (
                                    <p>No documents yet.</p>
                                ) : (
                                    <ul className="recent-list">
                                        {documents.map((doc) => (
                                            <li key={doc.id}>
                                                <span className="file-tag">{fileTag(doc.file_path)}</span>
                                                <button
                                                    type="button"
                                                    className="recent-text link-button"
                                                    onClick={() => openDocument(doc)}
                                                >
                                                    {doc.name}
                                                </button>
                                                <time className="recent-time" dateTime={doc.created_at}>
                                                    {uploadedLabel(doc.created_at)}
                                                </time>
                                            </li>
                                        ))}
                                    </ul>
                                )}

                                <button type="button" className="btn-quiet" onClick={() => navigate("/documents")}>
                                    See all documents
                                </button>
                            </section>

                            <section className="content-section">
                                <div className="row g-4">
                                    <div className="col-12 col-lg-6">
                                        <div className="content-box">
                                            <h3>Next appointment</h3>

                                            {nextAppointment ? (
                                                <>
                                                    <p className="box-highlight">{nextAppointment.title}</p>
                                                    <p>
                                                        {appointmentLabel(nextAppointment.starts_at)}
                                                        {nextAppointment.place && (
                                                            <>
                                                                <br />
                                                                {nextAppointment.place}
                                                            </>
                                                        )}
                                                    </p>
                                                </>
                                            ) : (
                                                <p>Nothing booked.</p>
                                            )}

                                            <button type="button" className="btn-quiet" onClick={() => navigate("/appointments")}>
                                                {nextAppointment ? "See all appointments" : "Book one"}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="col-12 col-lg-6">
                                        <div className="content-box">
                                            <h3>To-do</h3>

                                            {todos.length === 0 ? (
                                                <p>Nothing to do. Nice!</p>
                                            ) : (
                                                <ul className="todo-list">
                                                    {todos.map((todo) => (
                                                        <li key={todo.id}>
                                                            <label className="todo-item">
                                                                <input
                                                                    type="checkbox"
                                                                    className="todo-check"
                                                                    checked={todo.done}
                                                                    onChange={() => toggleTodo(todo)}
                                                                />
                                                                <span className="todo-text">{todo.title}</span>
                                                                <span className="todo-due">{dueLabel(todo)}</span>
                                                            </label>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </>
                    )}

                    <footer className="page-footer">
                        <p>&copy; 2026 Pet Tracker</p>
                    </footer>
                </main>

            </div>
        </div>
    );
}