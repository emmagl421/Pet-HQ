import Sidebar from "../components/Sidebar";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import "./pages.css";

//Object type descriptions 
type Pet = {
  id: number;
  name: string;
  species: string | null;
  breed: string | null;
  birth_date: string | null;
  weight_kg: number | null;
  microchip: string | null;
};

type FeedingTime = {
  id: number;
  feed_at: string;
  meal: string;
  amount: string | null;
};

type DailyTask = {
  id: number; 
  task: string;
  last_done: string | null;
};

type Medication = {
  id: number;
  name: string;
  how: string | null;
  schedule: string | null;
};

type Contact = {
  id: number;
  name: string;
  phone: string;
};


//Puts the string into the from PostgreSQL uses 
function todayString() {
  return new Date().toLocaleDateString("en-CA");
}

//Formats the time from 07:00:00 -> 7:00 AM
function formatTime(t: string) {
  return new Date(`1970-01-01T${t}`).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit"});
}

//Gets pets age from birth_date
function ageFrom(birth: string) {
  const b = new Date(birth + "T00:00");
  const now = new Date();
  let years = now.getFullYear() - b.getFullYear();
  const birthdayThisYear = new Date(now.getFullYear(), b.getMonth(), b.getDate());
  if (now < birthdayThisYear) {
    years--;
  }
  return years === 1 ? "1 year" : `${years} years`;
}



export default function GeneralCare() {
  //Add trackers for changes 
  const [pet, setPet] = useState<Pet | null>(null);
  const [feeding, setFeeding] = useState<FeedingTime[]>([]);
  const [tasks, setTasks] = useState<DailyTask[]>([]);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const today = todayString();

  useEffect(() => {
    async function load() {
      const [petRes, feedRes, taskRes, medRes, contactRes] = await Promise.all([
        supabase.from("pets").select("id, name, species, breed, birth_date, weight_kg, microchip").limit(1).maybeSingle(),
        supabase.from("feeding_times").select("id, feed_at, meal, amount").order("feed_at"),
        supabase.from("daily_tasks").select("id, task, last_done").order("id"),
        supabase.from("medications").select("id, name, how, schedule").order("id"),
        supabase.from("contacts").select("id, name, phone").order("id")
      ]);

      //Check for errors 
      const firstError = petRes.error || feedRes.error || taskRes.error || medRes.error || contactRes.error;

      if (firstError) {
        setError("Couldn't load care info. Try refreshing the page.");
        console.error(firstError);
      }
      else {
        setPet(petRes.data as Pet | null);
        setFeeding(feedRes.data as FeedingTime[]);
        setTasks(taskRes.data as DailyTask[]);
        setMedications(medRes.data as Medication[]);
        setContacts(contactRes.data as Contact[]);
      }

      setLoading(false);
    }

    //Load data
    load();
  }, []);

  //Fills in the info for the pet if it exists 
  const profile = pet
    ? [
        { label: "Species", value: pet.species },
        { label: "Breed", value: pet.breed },
        { label: "Age", value: pet.birth_date ? ageFrom(pet.birth_date) : null},
        { label: "Weight", value: pet.weight_kg !== null ? `${pet.weight_kg} kg` : null},
        { label: "Microchip", value: pet.microchip }
      ]
    : [];

    //Updates tasks in supabase if they are toggled 
    async function toggleTask(task: DailyTask) {
      const newValue = task.last_done === today ? null : today;

      const { error } = await supabase
        .from("daily_tasks")
        .update({ last_done: newValue })
        .eq("id", task.id);

        if (error) {
          setError("Couldn't update that task. Please try again.");
          console.error(error);
        }
        else {
          //Builds new list with copied version of last_done and updates the page 
          setTasks(tasks.map((t) => (t.id === task.id ? { ...t, last_done: newValue } : t)));
        }
    }

  return (
    <div className="container-fluid">
      <div className="row min-vh-100">
        <Sidebar />

        <main className="col-12 col-md-9 col-lg-10 main-content">
          <header className="page-header">
            <h1>General Care</h1>
            <p className="page-subtitle">Everything someone needs to look after {pet?.name ?? "your pet"} for a day.</p>    
          </header>

          {error && <p className="form-error mb-3" role="alert">{error}</p>}
          {loading && <p className="empty-note">Loading…</p>}

          {/* Profile strip */}
          <section className="content-section">
            <dl className="profile-strip">
              {profile.map((item) => (
                <div key={item.label} className="profile-item">
                  <dt>{item.label}</dt>
                  <dd>{item.value ?? "Not set"}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="content-section">
            <div className="row g-4">
              {/* Feeding schedule: a real sequence through the day, so it's a timeline */}
              <div className="col-12 col-lg-6">
                <div className="content-box">
                  <h3>Feeding schedule</h3>
                  <ol className="feed-timeline">
                    {feeding.map((f) => (
                      <li key={f.id}>
                        <time className="feed-time">{formatTime(f.feed_at)}</time>
                        <span className="feed-meal">{f.meal}</span>
                        <span className="feed-amount">{f.amount}</span>
                      </li>
                    ))}
                  </ol>
                  <p className="box-note">No milk or onion. Treats count toward dinner.</p>
                </div>
              </div>

              {/* Daily checklist reuses the to-do styles from Home */}
              <div className="col-12 col-lg-6">
                <div className="content-box">
                  <h3>Every day</h3>
                  <ul className="todo-list">
                    {tasks.map((t) => (
                      <li key={t.id}>
                        <label className="todo-item">
                          <input
                            type="checkbox"
                            className="todo-check"
                            checked={t.last_done === today}
                            onChange={() => toggleTask(t)}
                          />
                          <span className="todo-text">{t.task}</span>
                        </label>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>

          <section className="content-section">
            <h2>Medications and treatments</h2>
            <ul className="recent-list">
              {medications.map((m) => (
                <li key={m.id}>
                  <span className="file-tag">Rx</span>
                  <span className="recent-text">
                    {m.name}
                    {m.how && <span className="recent-sub">{m.how}</span>}
                  </span>
                  <span className="recent-time">{m.schedule}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="content-section">
            <h2>If something's wrong</h2>
            <ul className="contact-list">
              {contacts.map((c) => (
                <li key={c.id}>
                  <span className="contact-who">{c.name}</span>
                  <a className="contact-phone" href={`tel:${c.phone.replace(/\D/g, "")}`}>{c.phone}</a>
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