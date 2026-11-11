import { useState } from "react";
import type { ChangeEvent } from "react";
import Sidebar from "../components/Sidebar";
import "./pages.css";

//Types of documents/files 
type Category = "Medical" | "Insurance" | "ID & ownership";

//Object that holds the information of a document
type PetDocument = {
    id: number;
    name: string;
    fileType: string;
    category: Category;
    added: String;
};

const categories: Category[] = ["Medical", "Insurance", "ID & ownership"];

//Starting data 
const startingDocuments: PetDocument[] = [
  { id: 1, name: "Rabies vaccine certificate", fileType: "PDF", category: "Medical", added: "Nov 8, 2026" },
  { id: 2, name: "Microchip registration", fileType: "JPG", category: "ID & ownership", added: "Oct 28, 2026" },
  { id: 3, name: "Pet insurance policy", fileType: "PDF", category: "Insurance", added: "Oct 15, 2026" },
  { id: 4, name: "Adoption papers", fileType: "PDF", category: "ID & ownership", added: "Sep 3, 2026" },
  { id: 5, name: "Bloodwork results", fileType: "PDF", category: "Medical", added: "Aug 19, 2026" },
];

export default function Documents() {
    //Creates an array of documents (documents) and uses state to redraw the page apon a change 
    const [documents, setDocuments] = useState<PetDocument[]>(startingDocuments);
    const [filter, setFilter] = useState<Category | "All">("All");
    const [uploadCategory, setUploadCategory] = useState<Category>("Medical");

    //Only show documents that match the filter 
    const shown = filter === "All" ? documents : documents.filter((d) => d.category === filter);

    //Runs when files are picked, lists them on the page (need backend for saving)
    //Turns files in PetDocument objects 
    function handleUpload(event: ChangeEvent<HTMLInputElement>) {
        //Get the files the user chose 
        const files = event.target.files;
        if (!files) return;

        //Gets the date when the files are picked and puts it in the format "MMM, DD, YYYY"
        const today = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric"});

        //Turn files into an array from a FileList obj
        //Then turns maps each file in files to a PetDocument 
        const added: PetDocument[] = Array.from(files).map((file, i) => ({
            id: Date.now() + i,
            name: file.name.replace(/\.[^.]+$/, ""),
            fileType: (file.name.split(".").pop() || "FILE").toUpperCase(),
            category: uploadCategory,
            added:today
        }));

        //Add to the documents array
        // ... = spread operator: unpacks array elems into a new array (newest first)
        setDocuments([...added, ...documents]);

        //Clear selection
        event.target.value = "";
    }

    //Deletes a document from the page (needs backend)
    function deleteDocument(id: number) {
        setDocuments(documents.filter((d) => d.id !== id));
    }

    return (
        <div className="container-fluid">
        <div className="row min-vh-100">
            <Sidebar />
    
            <main className="col-12 col-md-9 col-lg-10 main-content">
            <header className="page-header">
                <h1>Documents</h1>
                <p className="page-subtitle">Mochi's records in one place, ready to show the vet or a sitter.</p>
            </header>
    
            {/* Upload */}
            <section className="content-section">
                <div className="upload-box">
                <div>
                    <h2 className="upload-title">Add documents</h2>
                    <p className="upload-hint">PDFs and photos of paperwork both work.</p>
                </div>
    
                <div className="upload-controls">
                    <label className="pt-field">
                    <span>File under</span>
                    <select value={uploadCategory} onChange={(e) => setUploadCategory(e.target.value as Category)}>
                        {categories.map((c) => (
                        <option key={c} value={c}>{c}</option>
                        ))}
                    </select>
                    </label>
    
                    {/* The real input is hidden; the label styled as a button opens it */}
                    <label className="btn-pixel">
                    Choose files
                    <input type="file" multiple accept=".pdf,image/*" className="visually-hidden" onChange={handleUpload} />
                    </label>
                </div>
                </div>
            </section>
    
            {/* Filter + list */}
            <section className="content-section">
                <div className="list-header">
                <h2>All documents</h2>
                <div className="filter-chips" role="group" aria-label="Filter by category">
                    {(["All", ...categories] as const).map((c) => (
                    <button
                        key={c}
                        type="button"
                        className={filter === c ? "chip chip-on" : "chip"}
                        aria-pressed={filter === c}
                        onClick={() => setFilter(c)}
                    >
                        {c}
                    </button>
                    ))}
                </div>
                </div>
    
                {shown.length === 0 ? (
                <p className="empty-note">No documents in this category yet. Add one above.</p>
                ) : (
                <ul className="recent-list">
                    {shown.map((doc) => (
                    <li key={doc.id}>
                        <span className="file-tag">{doc.fileType}</span>
                        <span className="recent-text">
                        <a href="#">{doc.name}</a>
                        <span className="recent-sub">{doc.category}</span>
                        </span>
                        <time className="recent-time">{doc.added}</time>
                        <button type="button" className="btn-quiet" onClick={() => deleteDocument(doc.id)}>
                        Delete
                        </button>
                    </li>
                    ))}
                </ul>
                )}
            </section>
    
            <footer className="page-footer">
                <p>&copy; 2026 Pet Tracker</p>
            </footer>
            </main>
        </div>
        </div>
    );
} 