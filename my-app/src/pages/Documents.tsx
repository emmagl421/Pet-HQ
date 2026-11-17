import { useEffect, useState } from "react";
import type { ChangeEvent } from "react";
import Sidebar from "../components/Sidebar";
import { supabase } from "../lib/supabase";
import "./pages.css";

//Types of documents/files 
type Category = "Medical" | "Insurance" | "ID & ownership";

//Object that holds the information of a document
type PetDocument = {
    id: number;
    name: string;
    category: Category;
    file_type: string | null;
    file_path: string;
    created_at: string;
};

const categories: Category[] = ["Medical", "Insurance", "ID & ownership"];

const COLUMNS = "id, name, category, file_type, file_path, created_at";

function shortDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric"});
}

export default function Documents() {
    //Creates an array of documents (documents) and uses state to redraw the page apon a change 
    const [documents, setDocuments] = useState<PetDocument[]>([]);
    const [petId, setPetId] = useState<number | null>(null);
    const [petName, setPetName] = useState("");
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [error, setError]  =useState("");
    const [filter, setFilter] = useState<Category | "All">("All");
    const [uploadCategory, setUploadCategory] = useState<Category>("Medical");

    useEffect(() => {
        async function load() {
            const [petRes, docRes] = await Promise.all([
                supabase.from("pets").select("id, name").limit(1).maybeSingle(),
                supabase.from("documents").select(COLUMNS).order("created_at", { ascending: false })
            ]);

            if (petRes.error || docRes.error) {
                setError("Couldn't load your documents. Try refreshing the page.");
                console.error(petRes.error || docRes.error);
            }
            else {
                setPetId(petRes.data?.id ?? null);
                setPetName(petRes.data?.name ?? "");
                setDocuments(docRes.data as PetDocument[]);
            }
            
            setLoading(false);
        }

        load();
    }, []);

    //Only show documents that match the filter 
    const shown = filter === "All" ? documents : documents.filter((d) => d.category === filter);

    //Runs when files are picked, lists them on the page (need backend for saving)
    //Turns files in PetDocument objects 
    async function handleUpload(event: ChangeEvent<HTMLInputElement>) {
        const input = event.target;
        const files = input.files;
        if (!files || files.length === 0) {
            return;
        }

        if (petId === null) {
            setError("Add a pet first, then upload documents.");
            return;
        }

        setUploading(true);
        setError("");


        //Get user id to add files to correct folder 
        const { data: sessionData } = await supabase.auth.getSession();
        const userId = sessionData.session?.user.id;
        if (!userId) {
            setError("You've been signed out. Please sign in again.");
            setUploading(false);
            return;
        }

        const added: PetDocument[] = [];

        for (const file of Array.from(files)) {
            //Upload file to storage 
            const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
            const path = `${userId}/${Date.now()}-${safeName}`;

            const upload = await supabase.storage.from("documents").upload(path, file);
            if (upload.error) {
                setError(`Couldn't upload ${file.name}. Please try again.`);
                console.error(upload.error);
                continue;
            }

            //Save a row in the documents table describing the file
            const { data, error } = await supabase  
                .from("documents")
                .insert({
                    pet_id: petId,
                    name: file.name.replace (/\.[^.]+$/, ""),
                    category: uploadCategory,
                    file_type: (file.name.split(".").pop() || "FILE").toUpperCase(),
                    file_path: path
                })
                .select(COLUMNS)
                .single();

            if (error) {
                setError(`Couldn't save ${file.name}. Please try again.`);
                console.error(error);
                await supabase.storage.from("documents").remove([path]);
                continue;
            }

            added.push(data as PetDocument);
        }

        setDocuments((current) => [...added, ...current]);
        input.value = "";
        setUploading(false);
    }

    async function openDocument(doc: PetDocument) {
        const { data, error } = await supabase.storage
            .from("documents")
            .createSignedUrl(doc.file_path, 60);

        if (error) {
            setError("Couldn't open document. Please try again.");
            console.error(error);
            return;
        }

        window.open(data.signedUrl, "_blank", "noopener");
    }

    //Deletes a document from the page (needs backend)
    async function deleteDocument(doc: PetDocument) {
        const { error } = await supabase.from("documents").delete().eq("id", doc.id);

        if (error) {
            setError("Couldn't delete document. Please try again.");
            console.error(error);
            return;
        }

        setDocuments(documents.filter((d) => d.id !== doc.id));

        const removal = await supabase.storage.from("documents").remove([doc.file_path]);
        if (removal.error) {
            console.error(removal.error);
        }
    }

    return (
        <div className="container-fluid">
        <div className="row min-vh-100">
            <Sidebar />
    
            <main className="col-12 col-md-9 col-lg-10 main-content">
            <header className="page-header">
                <h1>Documents</h1>
                <p className="page-subtitle">
                    {petName ? `${petName}'s` : "Your pet's"} records in one place, ready to show the vet or a sitter.
                </p>
            </header>

            {error && <p className="form-error mb-3" role="alert">{error}</p>}
    
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
                        {uploading ? "Uploading…" : "Choose files"}
                        <input
                            type="file"
                            multiple
                            accept=".pdf,image/*"
                            className="visually-hidden"
                            onChange={handleUpload}
                            disabled={uploading}
                        />
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
    
                {loading ? (
                    <p className="empty-note">Loading…</p>
                ) : shown.length === 0 ? (
                <p className="empty-note">No documents in this category yet. Add one above.</p>
                ) : (
                <ul className="recent-list">
                    {shown.map((doc) => (
                        <li key={doc.id}>
                            <span className="file-tag">{doc.file_type ?? "FILE"}</span>
                            <span className="recent-text">
                            <button type="button" className="doc-link" onClick={() => openDocument(doc)}>
                                {doc.name}
                            </button>
                            <span className="recent-sub">{doc.category}</span>
                            </span>
                            <time className="recent-time" dateTime={doc.created_at}>{shortDate(doc.created_at)}</time>
                            <button type="button" className="btn-quiet" onClick={() => deleteDocument(doc)}>
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