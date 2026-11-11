import Sidebar from "../components/Sidebar";
import "./pages.css";

// Plain data arrays. .map() below turns each item into HTML,
// so adding a row here adds it to the page.
// Need to add backend for pulling info
const profile = [
  { label: "Species", value: "Cat" },
  { label: "Breed", value: "Domestic shorthair" },
  { label: "Age", value: "3 years" },
  { label: "Weight", value: "4.2 kg" },
  { label: "Microchip", value: "985 112 004 563 210" },
];

const feeding = [
  { time: "7:00 AM", meal: "Wet food", amount: "½ can" },
  { time: "12:30 PM", meal: "Dry food", amount: "¼ cup" },
  { time: "6:30 PM", meal: "Wet food", amount: "½ can" },
];

const dailyCare = [
  { task: "Fresh water", done: true },
  { task: "Scoop litter box", done: true },
  { task: "Brush coat", done: false },
  { task: "15 minutes of play", done: false },
];

const medications = [
  { name: "Flea and tick treatment", how: "1 dose on the back of the neck", when: "Monthly, next on Fri" },
  { name: "Dental treats", how: "2 treats", when: "Daily, after dinner" },
];

const contacts = [
  { who: "Blue Ridge Animal Clinic", detail: "(434) 555-0142" },
  { who: "24-hour emergency vet", detail: "(434) 555-0199" },
  { who: "Pet sitter, Jordan", detail: "(434) 555-0187" },
];

export default function GeneralCare() {
  return (
    <div className="container-fluid">
      <div className="row min-vh-100">
        <Sidebar />

        <main className="col-12 col-md-9 col-lg-10 main-content">
          <header className="page-header">
            <h1>General Care</h1>
            <p className="page-subtitle">Everything someone needs to look after Mochi for a day.</p>
          </header>

          {/* Profile strip */}
          <section className="content-section">
            <dl className="profile-strip">
              {profile.map((item) => (
                <div key={item.label} className="profile-item">
                  <dt>{item.label}</dt>
                  <dd>{item.value}</dd>
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
                      <li key={f.time}>
                        <time className="feed-time">{f.time}</time>
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
                    {dailyCare.map((c) => (
                      <li key={c.task}>
                        <label className="todo-item">
                          {/* defaultChecked = starting value the user can still change */}
                          <input type="checkbox" className="todo-check" defaultChecked={c.done} />
                          <span className="todo-text">{c.task}</span>
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
                <li key={m.name}>
                  <span className="file-tag">Rx</span>
                  <span className="recent-text">
                    {m.name}
                    <span className="recent-sub">{m.how}</span>
                  </span>
                  <span className="recent-time">{m.when}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="content-section">
            <h2>If something's wrong</h2>
            <ul className="contact-list">
              {contacts.map((c) => (
                <li key={c.who}>
                  <span className="contact-who">{c.who}</span>
                  {/* tel: links open the phone dialer on mobile */}
                  <a className="contact-phone" href={`tel:${c.detail.replace(/\D/g, "")}`}>{c.detail}</a>
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